# Checklist: Client Onboarding

> Used by: orchestrator, cmo-strategist, market-research-analyst, designer-agent, dev-agent
> Reference: brain/context/service-packages.md, brain/context/offerbook.md

---

## Phase 1: Discovery (7 tasks)

- [ ] Initial meeting/call conducted — record or transcribe
- [ ] Extract from meeting: client name, business type, revenue range, team size
- [ ] Map client pains (top 3-5 specific problems they want solved)
- [ ] Map client desires (top 3-5 specific outcomes they want)
- [ ] Identify decision maker(s) and approval process
- [ ] Determine budget range and timeline expectations
- [ ] Identify existing tools/systems they use (CRM, email, website, social)

## Phase 2: Research (6 tasks)

- [ ] Research client's industry/niche — use `brain/research/RESEARCH-TEMPLATE.md` format
- [ ] Analyze client's current website/online presence — extract DESIGN.md if they have a site:
  ```bash
  node .claude/skills/design-md/run.cjs --url <client-site>
  ```
- [ ] Analyze 3-5 competitors in their space
- [ ] Identify client's ICP (their customers, not ours)
- [ ] Map market opportunities and gaps
- [ ] Document findings in `brain/research/` following standard template

## Phase 3: Proposal (6 tasks)

- [ ] Select service packages from `brain/context/service-packages.md`
- [ ] Customize deliverables for client's specific needs
- [ ] Define pricing (reference `brain/context/offerbook.md` for similar engagements)
- [ ] Create proposal document in client project directory
- [ ] Include timeline with milestones
- [ ] Present proposal — record feedback and objections

## Phase 4: Project Setup (7 tasks)

- [ ] Create project directory at workspace root: `{client-name}/` or `{client-name}-{deliverable}/`
- [ ] Initialize git if needed
- [ ] Create project README with: client name, scope, timeline, key contacts
- [ ] Set up Vercel project for deployment (if web deliverable)
- [ ] Add client to `brain/context/project-inventory.md`
- [ ] Create offer entry in `brain/context/offerbook.md`
- [ ] Set up client communication channel (WhatsApp group, email thread)

## Phase 5: Kickoff (6 tasks)

- [ ] Extract brand identity from existing assets:
  - [ ] Website DESIGN.md extraction (if they have a site)
  - [ ] Social media visual analysis (colors, fonts, tone)
  - [ ] Logo/brand mark collection
- [ ] Define client's ICP in tokenized format
- [ ] Audit existing content (social, blog, email)
- [ ] Identify quick wins (immediate improvements with low effort)
- [ ] Create execution plan with agent assignments
- [ ] Kickoff meeting with client — align expectations and timeline

## Phase 6: Execution (varies by package)

- [ ] Follow relevant checklist for each deliverable:
  - Landing Page → `.claude/checklists/landing-page.md`
  - Copy → `.claude/checklists/copy-production.md`
  - Design System → `.claude/checklists/design-system-extraction.md`
  - Brand Strategy → Protocolo Branding (10 phases in CLAUDE.md)
  - Ads Campaign → Stack 4 Meta Ads pipeline
  - Content → Stack 2 Content pipeline
- [ ] Track progress and update client regularly
- [ ] Document decisions and approvals

## Phase 7: Delivery (5 tasks)

- [ ] Deploy to Vercel preview for client review
- [ ] Present deliverables with walkthrough
- [ ] Collect feedback and revision requests
- [ ] Implement revisions (max 2 rounds included)
- [ ] Final delivery and handoff documentation

## Phase 8: Follow-up (5 tasks)

- [ ] Conduct debrief meeting (what worked, what to improve)
- [ ] Request testimonial/depoimento → add to `brain/context/proof-vault.md`
- [ ] Identify upsell opportunities (next package in value ladder)
- [ ] Schedule check-in for 30 days post-delivery
- [ ] Update project status in `brain/context/project-inventory.md` to "delivered"

---

**Total: 42 tasks**
**Key principle: Service as Software — AI powers the delivery, human owns the relationship**
