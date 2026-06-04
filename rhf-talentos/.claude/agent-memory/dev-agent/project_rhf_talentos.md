---
name: RHF Talentos project context
description: Node.js/TypeScript recruitment automation backend — stack, file layout, pending work
type: project
---

RHF Talentos is a pure Node.js/TypeScript backend (NOT Astro) located at `/Users/moronireis/Projetos vscode/rhf-talentos/`.

**Stack:** TypeScript strict mode, ES2022, NodeNext modules, Express, @anthropic-ai/sdk, dotenv, tsx for dev.

**Key files:**
- `src/api/chatguru.ts` — ChatGuruClient class, 10 methods, POST + URLSearchParams
- `src/ai/cv-engine.ts` — Claude Haiku (claude-haiku-4-5), 3 functions with prompt caching on system message
- `src/webhooks/chatguru-webhook.ts` — Express app, POST /webhook/chatguru + GET /health
- `src/db/schema.sql` — 5 tables: candidates, jobs, cvs, messages, sync_log
- `src/scripts/test-chatguru.ts` — connectivity test, --send flag for live test

**Scripts:** `npm run dev` (tsx watch), `npm run test-api`, `npm run build`, `npm run webhook`

**Pending:** Pandapé integration, Supabase persistence wiring, CV PDF template, candidate matching, dashboard.

**Why:** TypeScript strict mode passes with zero errors as of initial scaffold.
