import { useCallback, useEffect, useRef, useState } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

interface SpeakOptions {
  voiceId: string;
  onStart?: () => void;
  onDone?: () => void;
  onError?: (err: string) => void;
}

/**
 * ElevenLabs-powered TTS via the `tts-speak` edge function.
 * Plays MP3 audio in a single shared Audio element so only one voice plays at a time.
 */
export function useElevenLabsVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const cleanupCurrent = useCallback(() => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
      } catch {/* ignore */}
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    cleanupCurrent();
    setIsSpeaking(false);
    setIsLoading(false);
  }, [cleanupCurrent]);

  const speak = useCallback(
    async (text: string, opts: SpeakOptions) => {
      const clean = text.replace(/[*_~`#>]/g, "").trim();
      if (!clean) {
        opts.onDone?.();
        return;
      }

      // Stop anything currently playing
      cancel();

      const ac = new AbortController();
      abortRef.current = ac;
      setIsLoading(true);

      try {
        const resp = await fetch(`${SUPABASE_URL}/functions/v1/tts-speak`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
          body: JSON.stringify({ text: clean, voiceId: opts.voiceId }),
          signal: ac.signal,
        });

        if (!resp.ok) {
          const data = await resp.json().catch(() => ({ error: `HTTP ${resp.status}` }));
          throw new Error(data.error || `HTTP ${resp.status}`);
        }

        const blob = await resp.blob();
        if (ac.signal.aborted) return;

        const url = URL.createObjectURL(blob);
        urlRef.current = url;
        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onplay = () => {
          setIsLoading(false);
          setIsSpeaking(true);
          opts.onStart?.();
        };
        const finish = () => {
          if (audioRef.current === audio) {
            cleanupCurrent();
            setIsSpeaking(false);
            setIsLoading(false);
            opts.onDone?.();
          }
        };
        audio.onended = finish;
        audio.onerror = () => {
          if (audioRef.current === audio) {
            cleanupCurrent();
            setIsSpeaking(false);
            setIsLoading(false);
            opts.onError?.("audio playback failed");
            opts.onDone?.();
          }
        };

        await audio.play();
      } catch (e: unknown) {
        const err = e as { name?: string; message?: string };
        if (err?.name === "AbortError") return;
        setIsLoading(false);
        setIsSpeaking(false);
        opts.onError?.(err?.message || "TTS failed");
        opts.onDone?.();
      }
    },
    [cancel, cleanupCurrent],
  );

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      cleanupCurrent();
    };
  }, [cleanupCurrent]);

  return { speak, cancel, isSpeaking, isLoading };
}
