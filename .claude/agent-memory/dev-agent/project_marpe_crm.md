---
name: project_marpe_crm
description: Marpe CRM Seguros key decisions, architecture, and table conventions
type: project
---

Astro 6 SSR + React 19 islands + Supabase. All styling is React inline styles (no Tailwind, no CSS modules). All DB tables prefixed `marpe_`. Deploy via `npx vercel deploy --prod` from the project dir.

**Why:** Marcel (client) needed a CRM tightly coupled to WhatsApp (UazapiGO) and Corp Nuvem ERP — no off-the-shelf fit.

**How to apply:** When adding new features, always use inline style objects (no class names). Always prefix new tables with `marpe_`. Never use Tailwind classes in this project.

Key conventions:
- URL-driven deep links: `?deal=ID` opens DealPanel, `?new_deal=contactId` opens NewDealModal pre-filled, `?contact=ID` auto-selects contact in InboxView
- Status options for deals: `marpe_status_options` table (id, name, color). API at `/api/status-options`. DealPanel uses dynamic dropdown when options exist, free-text fallback when empty.
- Deal-scoped chat: messages linked to a deal via `deal_id` column on `marpe_messages` (SQL pending data-engineer). DealPanel "Conversa" tab queries `/api/messages?deal_id=ID`.
- Ramo color map (`RAMO_COLORS`) is defined in CrmBoard.tsx — reuse it, don't redefine.
