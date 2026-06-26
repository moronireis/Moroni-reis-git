---
name: Castelo dos Lagos — Wedding Campaign Strategy
description: Full wedding lead gen campaign strategy for Castelo dos Lagos luxury venue. Funnel, ICP, pixel fix, CAPI, budget, KPIs. June 2026.
type: project
---

# Castelo dos Lagos — Wedding Campaign Strategy

**Status**: Strategy complete (2026-06-11), pending execution.
**Strategy doc**: `brain/assets/campaigns/castelo-dos-lagos-wedding-campaign-strategy.md`

**Why:** 96% of R$6.8K historical spend was on ENGAGEMENT (conversations). Zero pixel tracking. Zero conversion optimization. Only LEADS campaign (CPL R$5.31) was paused. Moroni's directive: "qualified leads matter, not cheap conversations."

**Key decisions:**
- 3-stage funnel: TOFU (Video Views R$20/day) → MOFU (Traffic to LP R$15/day) → BOFU (Conversions/Lead R$15/day)
- Total budget: R$50/day = R$1,500/month (matches available account balance)
- Target CPL: R$30-60 (acceptable given R$35K avg ticket = 580-1166x ROAS per closed deal)
- LP form already has 6 qualifying fields — no changes needed
- ICP primary: Women 25-40 (brides), secondary: Women 45-60 (mothers), tertiary: Men 27-42 (grooms)
- Best demographics from data: Women 35-54 + Men 55-64 (parents)
- Degustacao (food) creative is best performer historically (CPA R$2.94)
- Price in ads (R$26.990+) is intentional — filters unqualified clicks

**CRITICAL BLOCKER**: Meta Pixel is COMMENTED OUT in `castelo-lp/index.html` (line 29-30). `fbq('init', 'PIXEL_ID_HERE')` is literally commented. Must fix BEFORE any campaign launches.

**Implementation needed (in order):**
1. Activate Pixel (uncomment + insert ID 1861444358023074)
2. Add ViewContent event on form scroll
3. Implement CAPI in `/api/lead.js`
4. Create Custom Audiences (video viewers, engagers)
5. Create 3 campaigns PAUSED in act_1327467106018116
6. Moroni approval → activate

**Account**: act_1327467106018116 (BM - Castelo dos Lagos) — R$1,500 available
**LP**: https://castelo-lp.vercel.app/
**Pixel**: 1861444358023074

**How to apply:** Reference the strategy doc for any campaign creation, creative briefing, or ads analysis. Pixel fix is prerequisite #1.
