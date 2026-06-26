---
name: RHF Talentos Project
description: AI recruitment automation pilot for RHF Talentos (u4digital). R$5K+R$497/mo. 300+ franchise network. Pandapé API unblocked 2026-06-03.
type: project
---

## Project: RHF Talentos — AI Recruitment Automation

**Client:** Rodrigo Silva, franqueado RHF Talentos Vale dos Sinos (9 years, 300+ franchise network)
**Team:** u4digital — Moroni Reis (Head IA), Tiago Donicht (Diretor), Gustavo
**Pricing:** R$5.000 setup (or R$4.500 à vista) + R$497/mês recorrência
**Project dir:** `rhf-proposta/`
**Deploy:** Vercel (rewrites configured in vercel.json)

## Current State (as of 2026-06-05)

### DONE — Commercial layer (100%)
- `index.html` — 14-slide interactive proposal
- `interno.html` — internal cost/margin analysis (4 pricing scenarios, 8 risks)
- `kickoff.html` — post-approval kickoff presentation (10 slides)
- `status.html` — client-facing status page (updated 2026-05-22)

### DONE — Chat layer (functional with real data)
- `chat.html` — WhatsApp Web-style chat interface, polling real data
- ChatGuru API connected (send/receive tested 2026-05-21)
- Meta Cloud API webhook receiving messages
- 9 serverless API endpoints (contacts, messages, webhooks, WhatsApp)
- Supabase: 5 tables (candidates, rhf_messages, sync_log, vagas, curriculos)

### DONE — MVP UI (visual only, mock data)
- `mvp.html` — 93KB dashboard with tabs (Dashboard, CV Generator, Vagas, Candidatos, Sync)
- All data is hardcoded HTML — no fetch() calls to Supabase

### NOT DONE — Core product
- Pandapé integration (API unblocked 2026-06-03, zero code exists)
- AI CV generator (no backend endpoint, button exists but non-functional)
- PDF generation (no library, no template received from client)
- Pandapé ↔ ChatGuru sync (zero implementation)
- Smart vacancy creation (zero implementation)
- "Sugerir IA" button in chat (disabled, no backend)
- Dashboard with real data (no API calls from mvp.html)

### SECURITY ISSUE
- All credentials hardcoded in API files (SUPABASE_KEY, CHATGURU_KEY, META_ACCESS_TOKEN)
- Must migrate to Vercel env vars before production

## Pandapé API Documentation (received 2026-06-03)

**Phase 1 (NOW) — Consume triaged candidates:**
- Webhook event: "Candidato mudou de estágio" → FINALISTAS or CONTRATADOS
- Webhook payload: `{IdMatch, IdVacancy, IdVacancyFolderFrom, IdVacancyFolderTo, EventDate}`
- Endpoint: `GET /v2/matches/{idMatch}` — returns full candidate data
- Auth: OAuth2 with client_id + client_secret → JWT Bearer token (fixed)

**Phase 2 (FUTURE) — Create vacancies/requests:**
- `POST /v2/vacancies` — create vacancies
- `POST /v2/requests` — create requests

**References:**
- Swagger V2: https://api.pandape.com.br/index.html?urls.primaryName=Pandap%C3%A9%20API%20v2
- Security/JWT docs: https://supportcenter.pandape.com/hc/pt-br/articles/41313406698769
- Help site: https://sites.google.com/infojobs.com.br/swagger/início

**Why:** Pandapé integration was the #1 blocker since project start. This unblocks the entire core product pipeline.
**How to apply:** Phase 1 implementation should focus on: webhook receiver → OAuth2 auth → GET matches → AI CV generation → PDF → ChatGuru delivery.
