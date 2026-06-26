---
name: azeredo-ia project stack and conventions
description: Core stack, DB table naming, styling conventions, and component patterns for azeredo-ia
type: project
---

Astro 6 SSR + React islands (client:load). All styling is inline React styles — no Tailwind, no CSS modules.
CSS custom properties live in `src/styles/global.css` and are referenced as `var(--token)` strings in inline style objects.

**Why:** Consistent with Marpe CRM pattern that preceded this project.

**How to apply:** Never add Tailwind classes inside .tsx files. All React components use inline style objects that reference CSS vars by string.

## Table prefix
All Supabase tables use `az_` prefix: `az_campaigns`, `az_contacts`, `az_brands`, `az_contact_brands`, `az_templates`, `az_campaign_recipients`, `az_messages`.

## Key CSS tokens (from global.css) — updated 2026-06-25 (WhatsApp green redesign)
- `--bg-primary: #080c09` / `--bg-secondary: #0d1410` / `--bg-card: #111a12`
- `--border: #1c2820` / `--border-light: #243228`
- `--text-primary: #e8f0e8` / `--text-secondary: #8aaa90` / `--text-muted: #4a6050`
- `--accent: #25D366` / `--accent-dark: #1aad52` / `--accent-light: #4de08c` / `--accent-dim: rgba(37,211,102,0.1)`
- `--green: #22c55e` / `--red: #ef4444` / `--amber: #f59e0b` / `--blue: #4A90FF`
- `--radius-sm: 6px` / `--radius-md: 10px` / `--radius-lg: 16px`
- `--sidebar-width: 220px` (expanded with icon + label text — NOT icon-only like Marpe)

## Sidebar design
220px wide, shows logo "AZEREDO IA" + icon, nav items with icon + text label, user avatar + name + role + logout. Mobile: hamburger + drawer overlay. Green accent (#25D366) on active items.

## Login page design
Two-panel: left (WhatsApp bubble decoration + stats cards + green glow bg), right (clean form). Responsive: left panel hides on mobile < 860px. Password toggle uses two SVG elements (#eyeOpen/#eyeClosed) with display:none toggling — avoids the innerHTML + SVGElement cast bug from the old version.

## Auth pattern
Every API route calls `requireAuth(locals as any)` from `src/lib/api-auth.ts` and returns early if result is a Response.
All API routes set `export const prerender = false`.

## WhatsApp send
`sendWhatsAppText(phone, text, contactId?, campaignId?)` from `src/lib/whatsapp/send.ts`. Uses UazapiGO via `UAZAPI_URL` + `UAZAPI_TOKEN` env vars.

## Variable interpolation
`resolveVariables(template, contact)` from `src/lib/variables.ts`. Handles: nome, nome_fantasia, primeiro_nome, cidade, estado, contato, segmento, periodo_dia.

## Campaigns module (built 2026-06-25)
- `src/pages/api/campaigns/index.ts` — GET list, POST create
- `src/pages/api/campaigns/[id].ts` — GET single + recipients, PATCH (draft only)
- `src/pages/api/campaigns/[id]/preview.ts` — GET count + sample for segment_filter
- `src/pages/api/campaigns/[id]/send.ts` — POST fire-and-forget blast engine (2s delay between msgs)
- `src/components/disparos/DisparosView.tsx` — 3-step wizard + campaign list with polling

## Segment filter shape
```typescript
{
  brand_ids?: string[];   // az_contact_brands join
  cidade?: string;        // ILIKE %value%
  estado?: string;        // ILIKE %value%
  segmento?: string;      // ILIKE %value%
  status?: string;        // exact match
}
```

## Blast engine pattern
Returns 200 immediately. Loop runs in `Promise.resolve().then(async () => { ... })` — fire and forget.
Frontend polls every 3s when any campaign.status === 'sending'.

## Toast component
Exists at `src/components/ui/Toast.tsx`. Exports `Toast` (render component) and `useToast` (hook with success/error/info methods).
