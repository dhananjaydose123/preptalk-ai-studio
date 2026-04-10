
CREATE TABLE public.interview_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  firebase_uid TEXT NOT NULL,
  interview_type TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  role TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  overall_score INTEGER,
  categories JSONB DEFAULT '[]',
  tips JSONB DEFAULT '[]',
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert sessions"
ON public.interview_sessions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can read sessions"
ON public.interview_sessions
FOR SELECT
USING (true);

CREATE INDEX idx_interview_sessions_firebase_uid ON public.interview_sessions(firebase_uid);
