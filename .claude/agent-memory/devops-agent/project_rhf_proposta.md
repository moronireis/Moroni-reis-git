---
name: RHF Proposta — Vercel env vars catalog
description: Env vars required by rhf-proposta Vercel project (Supabase + ChatGuru + Meta)
type: project
---

Project: `rhf-proposta` (Vercel project ID: `prj_I5quumWmEjs9FQVqEKrc2oCyaarv`, team: `team_p7Tv8o8ok0ZLrXDTCOzy7svM`)

No git repo connected to Vercel — preview vars must be set via REST API (the CLI `vercel env add NAME preview` hangs on branch selection when no repo is linked).

**Why:** CLI v50 requires a git branch argument for preview if the project has no connected repo; `--yes` does not bypass this. Use the REST API endpoint `POST /v10/projects/{id}/env?upsert=true` instead.

**How to apply:** Whenever adding/updating env vars for rhf-proposta across all environments, use the REST API approach demonstrated in the 2026-06-01 session, not the CLI for preview/development.

## Required env vars (all 8 set as of 2026-06-01, Production + Preview + Development)

| Variable | Description |
|----------|-------------|
| SUPABASE_URL | Cloudfy Supabase instance URL |
| SUPABASE_KEY | Service role JWT for Supabase |
| CHATGURU_KEY | ChatGuru API key |
| CHATGURU_ENDPOINT | ChatGuru API base URL |
| CHATGURU_ACCOUNT_ID | ChatGuru account ID |
| CHATGURU_PHONE_ID | ChatGuru phone/inbox ID |
| META_ACCESS_TOKEN | Meta WhatsApp Cloud API access token |
| META_VERIFY_TOKEN | Meta webhook verify token (static string) |

Note: Values are NOT stored here. They were migrated from hardcoded constants in the api/ files — source of truth is the Vercel dashboard (encrypted).
