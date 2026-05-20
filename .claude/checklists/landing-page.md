# Checklist: Landing Page — From Brief to Deploy

> Used by: orchestrator, cmo-strategist, direct-response-copywriter, designer-agent, dev-agent, qa-agent, devops-agent
> Inspired by: IOX Task-First methodology (Alan Nicolas) — 40+ granular tasks

---

## Phase 1: Research (8 tasks)

- [ ] Load ICP from `brain/strategy/icp-tokenized.md` — **agent**: cmo-strategist | **output**: ICP block selected
- [ ] Load voice profile from `.claude/voice-profiles/` — **agent**: cmo-strategist | **output**: voice profile identified
- [ ] Load relevant offers from `brain/context/offerbook.md` — **agent**: cmo-strategist | **output**: offer block selected
- [ ] Analyze 3-5 competitor LPs in the same niche — **agent**: market-research-analyst | **output**: competitor LP analysis
- [ ] Extract design system from best competitor LP — **agent**: design-system-extractor or `node .claude/skills/design-md/run.cjs --url <url>` | **output**: DESIGN.md + preview.html
- [ ] Gather proof/testimonials from `brain/context/proof-vault.md` — **agent**: cmo-strategist | **output**: proof entries selected
- [ ] Identify top objections for this ICP — **agent**: cmo-strategist | **output**: objection list with rebuttals
- [ ] Review existing copy assets in `brain/assets/copy/` for reusable material — **agent**: analysis-agent | **output**: reusable copy inventory

## Phase 2: Strategy (6 tasks)

- [ ] Define LP objective (lead capture, application, booking, purchase) — **agent**: cmo-strategist | **output**: objective statement
- [ ] Select primary Hormozi angle (More Good / Less Bad / Status / Risk) — **agent**: cmo-strategist | **output**: angle + material per `.claude/rules/hormozi-framework.md`
- [ ] Generate Hormozi 4-angle material for all angles — **agent**: cmo-strategist | **output**: 4-angle brief
- [ ] Define page structure (sections, flow, CTA placement) — **agent**: cmo-strategist | **output**: wireframe-as-text
- [ ] Map objection-to-section placement — **agent**: cmo-strategist | **output**: objection map
- [ ] Define CTA routing (/agendar or /aplicar ONLY) — **agent**: cmo-strategist | **output**: CTA spec

## Phase 3: Copy Production (12 tasks)

- [ ] Generate 10+ headline variations — **agent**: hook-specialist | **output**: headline menu
- [ ] Select winning headline — **agent**: cmo-strategist | **output**: chosen headline + rationale
- [ ] Write lead/hero section (problem agitation) — **agent**: direct-response-copywriter | **output**: lead copy
- [ ] Write proof section (testimonials, metrics, logos) — **agent**: direct-response-copywriter | **output**: proof section
- [ ] Write offer section (value stack, deliverables) — **agent**: direct-response-copywriter | **output**: offer copy
- [ ] Write FAQ section (objection handling) — **agent**: direct-response-copywriter | **output**: FAQ copy
- [ ] Write CTA sections (primary + secondary + final) — **agent**: direct-response-copywriter | **output**: CTA copy
- [ ] Write meta description + OG tags — **agent**: direct-response-copywriter | **output**: SEO copy
- [ ] Run humanization pass — **agent**: humanizer | **input**: raw copy | **output**: humanized copy
- [ ] Run reviewer quality gate — **agent**: reviewer | **input**: humanized copy | **output**: PASS/BLOCK verdict
- [ ] If BLOCK: apply fixes and re-submit (max 2 loops) — **agent**: identified rollback agent | **output**: revised copy
- [ ] CMO final sign-off — **agent**: cmo-strategist | **output**: approved copy file

## Phase 4: Design (7 tasks)

- [ ] Select or extract design system — **agent**: designer-agent | **input**: brand reference or DESIGN.md | **output**: design tokens
- [ ] Create page layout spec (desktop + mobile) — **agent**: designer-agent | **output**: layout specification
- [ ] Define component specs (hero, cards, CTA buttons, testimonial cards) — **agent**: designer-agent | **output**: component specs
- [ ] Define responsive breakpoints and behavior — **agent**: designer-agent | **output**: responsive spec
- [ ] Define micro-interactions (hover, scroll, CTA pulse) — **agent**: designer-agent | **output**: interaction spec
- [ ] Select imagery/illustrations — **agent**: art-director | **output**: image brief or prompts
- [ ] Review against brand-audit-checklist — **agent**: designer-agent | **input**: `.claude/rules/brand-audit-checklist.md` | **output**: compliance check

## Phase 5: Build (8 tasks)

- [ ] Initialize Astro project (if new) or identify target project — **agent**: dev-agent | **output**: project ready
- [ ] Build HTML structure from layout spec — **agent**: dev-agent | **output**: page structure
- [ ] Apply Tailwind CSS styling from design tokens — **agent**: dev-agent | **output**: styled page
- [ ] Implement responsive design — **agent**: dev-agent | **output**: mobile-ready page
- [ ] Add micro-interactions and animations — **agent**: vfx-motion-designer | **output**: interactive page
- [ ] Implement form/CTA functionality — **agent**: dev-agent | **output**: functional CTAs
- [ ] Add analytics tracking (if applicable) — **agent**: dev-agent | **output**: tracked page
- [ ] Optimize images and assets — **agent**: dev-agent | **output**: optimized page

## Phase 6: QA (7 tasks)

- [ ] Mobile responsiveness test (375px, 390px, 768px, 1024px, 1280px+) — **agent**: qa-agent | **output**: responsive report
- [ ] Page speed test (target: <3s load) — **agent**: qa-agent | **output**: speed report
- [ ] Copy proofread (accents, typos, consistency) — **agent**: reviewer | **output**: proofread report
- [ ] All links and CTAs functional — **agent**: qa-agent | **output**: link check report
- [ ] CTA routing verified (/agendar or /aplicar ONLY) — **agent**: qa-agent | **output**: CTA verification
- [ ] SEO basics (title, meta, OG, heading hierarchy) — **agent**: qa-agent | **output**: SEO check
- [ ] Cross-browser check (Chrome, Safari, Firefox) — **agent**: qa-agent | **output**: browser report

## Phase 7: Deploy (4 tasks)

- [ ] Deploy to Vercel preview — **agent**: devops-agent | **output**: preview URL
- [ ] Human review on preview URL — **agent**: HUMAN (Moroni) | **output**: approval or revision notes
- [ ] Deploy to production — **agent**: devops-agent | **output**: live URL
- [ ] Final live verification — **agent**: qa-agent | **output**: live check report

---

**Total: 52 tasks**
**Estimated time with AI**: 2-4 hours (vs. 2-3 days manual)
