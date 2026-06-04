# RHF Talentos

AI-powered recruitment automation service. Connects ChatGuru (WhatsApp) with an AI engine to automate candidate screening, CV generation, and recruiter assistance.

## Environment Variables

Copy `.env` and fill in the blanks:

| Variable | Description |
|---|---|
| `CHATGURU_ENDPOINT` | ChatGuru API base URL |
| `CHATGURU_KEY` | ChatGuru authentication key |
| `CHATGURU_ACCOUNT_ID` | ChatGuru account ID |
| `CHATGURU_PHONE_ID` | ChatGuru WhatsApp phone ID |
| `ANTHROPIC_API_KEY` | Anthropic API key (for Claude AI) |
| `WEBHOOK_PORT` | Port for the webhook server (default: 3333) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_KEY` | Supabase service role key |

## How to Run

```bash
# Install dependencies
npm install

# Start the webhook server in development (hot reload)
npm run dev

# Test ChatGuru API connectivity
npm run test-api

# Send a test WhatsApp message (use with caution)
npm run test-api -- --send 5551999999999

# Build for production
npm run build
```

## Architecture

```
src/
├── index.ts                  # Entry point — starts webhook server
├── api/
│   └── chatguru.ts           # ChatGuru API client (10 methods)
├── ai/
│   └── cv-engine.ts          # Claude AI functions (summary, JD, chat response)
├── db/
│   └── schema.sql            # PostgreSQL schema for Supabase
├── webhooks/
│   └── chatguru-webhook.ts   # Express webhook handler
└── scripts/
    └── test-chatguru.ts      # API connectivity test script
```

## Implemented

- ChatGuru API client with 10 methods (send message, send file, manage contacts, dialogs)
- Claude Haiku AI engine: professional summary, job description, chat response suggestion
- Webhook server receiving ChatGuru events (POST /webhook/chatguru)
- PostgreSQL schema: candidates, jobs, cvs, messages, sync_log
- Test script for API validation

## Pending

- **Pandapé integration** — sync candidates and jobs from Pandapé ATS
- **CV PDF template** — generate branded PDF CVs from AI summaries
- **Supabase persistence** — wire webhook events to database tables
- **Candidate matching** — auto-match inbound candidates to open jobs
- **Dashboard** — recruiter-facing web interface
- **Automated screening flow** — dialog sequences via ChatGuru
