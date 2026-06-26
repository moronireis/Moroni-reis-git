# Memory Index

Created 2026-04-14 as part of Phase A foundation.

## Starting context — Deploy conventions (do not drift from these)
- `reis-ia-hub`: ALWAYS `npm run deploy` — updates BOTH `reis-ia-hub.vercel.app` AND `hub-reisia.vercel.app`.
- `reis-ia-marketing`: manual `vercel --prod` only. Does NOT auto-deploy from git.
- `reis-ia-website`: localhost-only so far — verify with Moroni before first prod deploy.
- `reis-ia-brand`: localhost-only so far.
- `reis-ia-funnels`: initialized, no deploy target yet.

## Git safety (strict, no exceptions)
- Never push to main without explicit approval.
- Never force-push, `reset --hard`, `--no-verify`, `--no-gpg-sign`, or modify git config.
- Always create new commits; never amend.
- When a hook fails, fix the root cause — do not bypass.

## Deploy gate
- qa-agent verdict BLOCK = no deploy. No exceptions.

## Project: rhf-proposta
- [project_rhf_proposta.md](project_rhf_proposta.md) — Vercel env vars catalog (8 vars, all envs). CLI bug workaround for preview/dev vars.

## Vercel CLI quirk — no-git-repo projects
- When a Vercel project has no connected Git repo, `vercel env add NAME preview` hangs on branch selection even with `--yes`.
- Fix: use REST API `POST /v10/projects/{id}/env?upsert=true` with `"target":["production","preview","development"]`.
- Auth token lives at `/Users/moronireis/Library/Application Support/com.vercel.cli/auth.json`.
