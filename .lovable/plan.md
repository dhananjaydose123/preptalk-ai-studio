

# AI Interview Backend Implementation Plan

## Overview
Replace the mock interview chat with a real AI-powered interviewer using **Lovable AI Gateway** (already available via `LOVABLE_API_KEY`). The AI will ask contextual interview questions, respond to user answers, and generate structured feedback when the interview ends.

## Architecture

```text
┌─────────────┐       ┌──────────────────────┐       ┌────────────────────┐
│  Interview   │──────▶│  Edge Function:       │──────▶│  Lovable AI        │
│  Page (React)│◀──────│  interview-chat       │◀──────│  Gateway (Gemini)  │
│              │       │  (streaming SSE)      │       │                    │
│              │──────▶│  Edge Function:       │──────▶│                    │
│              │◀──────│  interview-feedback   │◀──────│                    │
└─────────────┘       └──────────────────────┘       └────────────────────┘
```

## What Gets Built

### 1. Edge Function: `interview-chat`
- Receives the full conversation history + interview config (type, difficulty, role)
- System prompt instructs the AI to act as an interviewer for the selected type/difficulty/role
- Streams responses back via SSE for real-time token rendering
- Handles CORS, rate limit errors (429), and credit errors (402)

### 2. Edge Function: `interview-feedback`
- Receives the complete conversation when user clicks "End Interview"
- Uses structured output (tool calling) to extract scores and tips in a defined JSON schema:
  - Overall score, category scores (Communication, Technical Knowledge, Problem Solving, Confidence)
  - 3-5 actionable improvement tips
- Returns structured JSON (non-streaming)

### 3. Updated Interview Page (`src/pages/Interview.tsx`)
- **Setup phase**: Track selected values (type, difficulty, role) in state
- **Interview phase**:
  - On start, send initial message to get AI's first question (streamed)
  - User types response, sends it, AI responds with next question (streamed, token-by-token)
  - Messages render with markdown support via `react-markdown`
  - Loading indicator while AI is responding
  - Auto-scroll to latest message
- **Feedback phase**:
  - On "End Interview", call `interview-feedback` with full conversation
  - Display real AI-generated scores and tips (replacing mock data)
  - Loading state while feedback is being generated

### 4. Supabase Config
- `supabase/config.toml` with both functions configured

## Key Details

- **Model**: `google/gemini-3-flash-preview` (fast, good for conversational interviews)
- **Streaming**: SSE-based streaming for the chat, non-streaming for feedback
- **No database needed**: Conversation lives in React state for the session
- **Dependencies**: Add `react-markdown` for rendering AI responses with formatting
- **System prompt** crafted per interview type (technical asks coding/system design questions, behavioral uses STAR method, HR asks culture-fit questions)

## Files to Create/Edit
1. `supabase/config.toml` — function config
2. `supabase/functions/interview-chat/index.ts` — streaming chat edge function
3. `supabase/functions/interview-feedback/index.ts` — feedback generation edge function
4. `src/pages/Interview.tsx` — full rewrite with real AI integration
5. `package.json` — add `react-markdown`

