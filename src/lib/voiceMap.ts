// ElevenLabs voice IDs mapped by role / persona voice hint
export const ELEVENLABS_VOICES = {
  interviewer: "JBFqnCBsd6RMkjVDRZzb", // George — warm male
  moderator: "EXAVITQu4vr4xnSDxMaL", // Sarah — clear female host
  "male-1": "nPczCjzI2devNBz1zQrb", // Brian
  "male-2": "TX3LPaxmHKxFdv7VOQHJ", // Liam
  "female-1": "FGY2WhTYpPnrIDTdsKH5", // Laura
  "female-2": "XrExE9yKIg1WjnnlVkGX", // Matilda
} as const;

export type VoiceHint = "male-1" | "male-2" | "female-1" | "female-2";

export function voiceIdForHint(hint?: VoiceHint | string): string {
  if (hint && hint in ELEVENLABS_VOICES) {
    return (ELEVENLABS_VOICES as Record<string, string>)[hint];
  }
  return ELEVENLABS_VOICES["male-1"];
}
