# Project Configuration

## Project Identity

**REIS [IA]** — an ecosystem that helps entrepreneurs and business owners profit from AI — increasing revenue, reducing costs, and structuring growth. Led by Moroni Reis. The agent system supports market research, strategy, messaging, copy production, design, and web development to help scale the REIS [IA] ecosystem (Systems, Builders, Marketing).

Full business context: `brain/context/business-profile.md`

## Agent System

### Available Agents

| Agent | Role | Model |
|-------|------|-------|
| orchestrator | Coordination, planning, delegation. Never implements directly. | opus |
| market-research-analyst | Market analysis, competitor research, ICP discovery, positioning gaps. | sonnet |
| cmo-strategist | Marketing strategy, positioning, offers, funnels, go-to-market planning. Copy Squad director. | opus |
| direct-response-copywriter | Persuasive copy execution: sales pages, VSL scripts, emails, ads. Hormozi framework. | sonnet |
| humanizer | Eliminates AI patterns, injects natural PT-BR executive voice. Post-copywriter. | sonnet |
| reviewer | Final quality gate: scores copy against brand voice, Hormozi, humanization. | sonnet |
| execution | File operations, folder organization, asset generation. | sonnet |
| dev-agent | Web development: Astro pages, React components, Tailwind styling, project setup. | sonnet |
| designer-agent | UI/UX design specs, brand identity, page layouts, wireframes-as-text. | opus |
| analysis-agent | Context summaries, tool evaluation, integration research, file audits. | sonnet |
| executor-agent | Platform configuration: email setup, CRM, booking tools, deployment. | sonnet |
| education-director | Curriculum mapping, lesson briefings, educational pipeline management, quality review. | opus |
| art-director | Unified creative head (fusion of former creative-director + cinematic-art-director). Concept + narrative + editorial typography system + grid/composition + shot grammar + lighting + hero image prompts + 3D demo direction + motion language direction. Sits above designer/vfx in the pipeline. Produces briefs, never code. | opus |
| visual-research-scout | Continuous aesthetic curation from Awwwards, FWA, Site Inspire, Land-book, Godly, Typewolf. Produces mood reports in `brain/design-library/mood-reports/` with 20-50 annotated refs per aesthetic intent. Curatorial only — no code harvest. Upstream of design-system-extractor. | sonnet |
| visual-qa-agent | Subjective aesthetic judge — third quality layer after reviewer (copy) and brand-audit-checklist (structural). Compares implementations against mood reports and renders APPROVE / REVISE / REJECT verdicts with aesthetic prose. Anti-mediocrity filter. | opus |
| task-router | Smart cost optimizer: classifies tasks and routes to optimal model (ollama/haiku/sonnet/opus). | haiku |
| chief-strategy-advisor | Board Advisor / Conselheiro Estratégico. Pressure-tests macro decisions (new pillars, launches, pricing, positioning). NOT in day-to-day pipeline. | opus |
| integration-engineer | Third-party APIs, webhooks, MCP servers (FastMCP 3.0), OAuth, Supabase edge functions, automation pipelines (Whisper, ffmpeg, Playwright, wappalyzer, SearXNG). | sonnet |
| qa-agent | End-to-end functional testing (Playwright + API + DB). Deploy gate — can BLOCK devops-agent on regressions. | sonnet |
| devops-agent | Deploys, env vars (Vercel), CI/CD, monitoring. Respects qa-agent as deploy gate. Strict git safety. | sonnet |
| data-engineer | Supabase schemas, migrations, RLS policies, indexes, triggers. Single source of truth for data model. | sonnet |
| offer-architect | Grand Slam Offer design (Hormozi): dream outcome, value stack, guarantee, scarcity, pricing, naming. | opus |
| funnel-architect | End-to-end funnels (Brunson + DigitalMarketer + Hormozi): value ladder, sequences, upsells, bridges, automations. | opus |
| social-media-director | Content director (formerly social-media-team). Orchestrates the 4 content specialists below. File still lives at `social-media-team.md`. | opus |
| hook-specialist | Generates 10+ hook variations per request (Reels, Shorts, LinkedIn, carousels). Covers all 4 Hormozi angles. Platform-specific retention windows. | sonnet |
| reels-scriptwriter | Recording-ready Reels/Shorts/TikTok scripts (15-60s) with shot list, framing, b-roll cues, text overlays, caption brief. | sonnet |
| linkedin-strategist | LinkedIn B2B executive content: posts, carousels, newsletters, strategic comments. 2026 algorithm-aware. | sonnet |
| carousel-designer-writer | 10-slide carousel copy + structured visual brief for designer-agent / educational-designer handoff. | sonnet |
| video-editor-director | Stack 3 lead. Plans full post-production per video: cut scoring, caption style, B-roll, aspect ratios, thumbnails. Delegates execution — never runs ffmpeg. | opus |
| clip-cutter | Stack 3 operator. Reads Whisper transcripts and returns ranked JSON coordinates for viral clips (OSS replacement for Opus Clip). | sonnet |
| caption-broll-operator | Stack 3 operator. Produces ASS subtitle files in REIS [IA] brand style + semantic B-roll queries and insertion timelines (OSS replacement for Submagic + Runway B-roll). | sonnet |
| traffic-manager | Operational media buyer. Campaign CRUD, audience config, budget distribution, creative upload via meta-ads MCP. All campaigns created PAUSED. | sonnet |
| ads-analyst | Performance analyst. Reports, breakdowns, diagnostics, health scoring, alerting. Uses meta-ads MCP + claude-ads plugin. | sonnet |
| creative-strategist | Ad creative strategy. Competitive creative analysis, briefing Copy Squad for ads, funnel stage mapping, creative rotation. Bridge between strategy and traffic. | sonnet |
| launch-strategist | Paid launch architect (Lancamento Pago Turbo). Plans full launch: event format, ticket pricing, creative portfolio (post-Andromeda), landing page/checkout copy, 6-phase traffic scaling, metrics analysis. Ticket funds traffic (ROAS >= 1.0), product sale = pure profit. | opus |
| typography-specialist | **Protocolo Luxo only.** Deep typography: High-Low pairing, variable fonts, kinetic type, OpenType audit, micro-typography. Between art-director and designer-agent. | sonnet |
| luxury-brand-analyst | **Protocolo Luxo only.** Decodes luxury brand visual grammar by vertical. Produces DNA Reports in `brain/design-library/luxury/dna/`. Feeds art-director and visual-qa-agent. | sonnet |

### Phase A — Agency Technical Foundation (2026-04-14)

Phase A of the agency expansion added 6 new agents, refactored `social-media-team` into `social-media-director`, and formally activated `chief-strategy-advisor` as Board Advisor (Option A — pressure-tester at macro decision points, NOT in day-to-day pipeline). The new agents cover the technical execution layer (integration-engineer, qa-agent, devops-agent, data-engineer) and the offer/funnel strategic layer (offer-architect, funnel-architect).

Phase A was foundation-only: agent definitions without implementations. The first real integration landed in Stack 4 (2026-04-22): `meta-ads` MCP server (@getscaleforge/mcp-meta-ads) connected to 4 ad accounts, plus `claude-ads` plugin (250+ audit checks).

### Phase B partial — Content Specialists (2026-04-14)

Phase B partial added 4 content specialists that the `social-media-director` orchestrates: `hook-specialist`, `reels-scriptwriter`, `linkedin-strategist`, `carousel-designer-writer`. Stack 2 (content production) is now fully connected to the Copy Squad: every specialist output passes through `humanizer` → `reviewer` → `social-media-director` consolidation → `cmo-strategist` sign-off before publishing. The upcoming Stack 3 (video editing: `clip-cutter`, `caption-broll-operator`) will consume the structured shot list and overlay tables produced by `reels-scriptwriter`.

Delegation flow inside Stack 2: the director receives a brief from `cmo-strategist`, starts with `hook-specialist` to generate a hook menu, picks the winner, then forwards to the format-specific specialist (Reels → `reels-scriptwriter`, LinkedIn → `linkedin-strategist`, carousel → `carousel-designer-writer`). For carousel visual implementation, the carousel agent produces a designer brief consumed by `designer-agent`.

### Stack 3 — Video Editing Pipeline (OSS, 2026-04-14)

Stack 3 adds 3 agents that own the full post-production pipeline for recorded video assets (Reels/Shorts/TikTok and long-form): `video-editor-director` (opus), `clip-cutter` (sonnet), `caption-broll-operator` (sonnet). The stack is 100% OSS and $0/month — Whisper (transcription) + ffmpeg/libass (cutting, burn-in, compositing) + Pexels/Pixabay APIs (free B-roll). It replaces Opus Clip, Submagic, and Runway B-roll. No subscriptions.

The full recipe — install instructions, pipeline steps, ffmpeg command book, REIS [IA] ASS caption template, and B-roll query patterns — lives at `brain/context/video-pipeline-oss-recipe.md`.

**Important**: the agents and the recipe are documented, but **no scripts or installs have been performed yet**. When Moroni says "implemente o Stack 3", the `integration-engineer` reads the recipe and produces the actual `scripts/video-pipeline/` executables (transcribe, cut, caption, B-roll fetch, compose, encode), coordinated with `qa-agent` for a smoke test and `devops-agent` for env var provisioning (PEXELS_API_KEY, PIXABAY_API_KEY).

Delegation flow:

```
social-media-director (Reels script) → recording (Moroni) → video-editor-director (edit plan)
  ├→ clip-cutter (transcript → JSON cut coordinates)
  └→ caption-broll-operator (ASS subtitle file + B-roll query/timeline)
       → integration-engineer (ffmpeg/Whisper execution per recipe)
         → qa-agent (smoke test) → social-media-director (publish)
```

Transversal support agents (used by most pipelines):
- `integration-engineer`, `qa-agent`, `devops-agent`, `data-engineer` support all code-producing pipelines
- `offer-architect` and `funnel-architect` feed the Copy Squad upstream of `direct-response-copywriter`
- `chief-strategy-advisor` reviews `cmo-strategist` output at macro decision points only (new pillar launches, new major offers, positioning shifts, budget calls above threshold)

### Stack 4 — Meta Ads Squad (2026-04-22)

Stack 4 adds 3 agents that own paid traffic management for all REIS [IA] client accounts: `traffic-manager` (sonnet), `ads-analyst` (sonnet), `creative-strategist` (sonnet). The stack connects to Meta Marketing API via the `meta-ads` MCP server (@getscaleforge/mcp-meta-ads, 32 tools) and uses the `claude-ads` plugin (250+ audit checks) for enhanced analysis.

**MCP Server:** `meta-ads` — @getscaleforge/mcp-meta-ads (Graph API v24.0, 32 tools, MIT, direct token auth)
**Plugin:** `claude-ads` — AgriciDaniel/claude-ads (250+ audit checks, health scoring, PPC math, PDF reports)
**Safety Rules:** `.claude/rules/ads-safety.md` — all campaigns PAUSED by default, budget limits, no deletes, rate limiting

**Accessible Ad Accounts (as of 2026-04-22):**
- `act_1690330771143511` — Moroni Reis (BRL)
- `act_2980473968915513` — Noiva S/A - Oficial (BRL)
- `act_1067594805509822` — Agente Lucrativo (BRL)
- `act_1618363548859143` — Leo Soares 3 (BRL)

Delegation flow:

```
cmo-strategist (campaign brief + objectives + ICP + budget)
    ├→ creative-strategist (competitive analysis, creative briefs)
    │     ├→ direct-response-copywriter (ad copy — Hormozi angles)
    │     │     → humanizer → reviewer (Copy Squad pipeline)
    │     ├→ hook-specialist (hooks for video ads)
    │     │     → reels-scriptwriter (video ad scripts)
    │     └→ designer-agent (visual creatives)
    ├→ traffic-manager (creates campaign structure — ALL PAUSED)
    │     → HUMAN APPROVAL (Moroni activates)
    │     → campaign running
    ├→ ads-analyst (monitors performance, diagnoses issues)
    │     → reports → cmo-strategist (strategic decisions)
    │     → alerts → traffic-manager (operational adjustments)
    └→ creative-strategist (feedback loop: what performed → next batch)
```

### Stack 5 — Paid Launch System (Lancamento Pago Turbo, 2026-04-22)

Stack 5 adds 1 agent (`launch-strategist`, opus) that orchestrates paid launches — a low-ticket event model where ticket sales fund traffic (ROAS >= 1.0) and the main product sold at event end = pure profit (~35% net margin). Based on Leonardo Tabari's "Lancamento Pago Turbo" methodology (10 lesson transcriptions + strategic prompt).

**Knowledge base** (3 original + 6 new files in `brain/strategy/`):
- `low-ticket-launch-playbook.md` — complete Tabari Turbo model: revenue stack, funnel architecture, 6 scaling phases, metrics, optimization protocol
- `andromeda-creative-portfolio.md` — post-Andromeda creative portfolio strategy (10 ad types, format mix, validation protocol)
- `event-structures.md` — Workshop (1-day) vs Challenge/Week (7-day) templates with lesson plans, engagement systems, pitch strategy
- `formula-lancamento-framework.md` — Erico Rocha FL complete: Semente + Classico + Ciclos Evolutivos + NAR + Objection Tree + Raiz/Nutella + Metodo LEOA
- `lancamento-pago-baldan.md` — William Baldan LCP 2-Day Intensive model
- `high-ticket-sales-system.md` — FHT + Full Sales System: session scripts, 5 HT funnels, DFY/DWY/DIY ladder, 18 mental triggers, KLT framework
- `conteudo-raiz-nutella-system.md` — Content production system: Raiz (30min+) → Nutella (short-form derived), 5 topic techniques, editorial lines
- `sobral-trafego-principios.md` — Sobral traffic principles: campaign structure, HSR metric, testing protocol, scale rules
- `ia-para-vendas-playbook.md` — Puglia AI for sales: DISC profiling, Schwartz levels, pre/post-session AI analysis, 57% close rate method

**Rules** (3 new in `.claude/rules/`):
- `launch-methodology.md` — 5 launch models, mandatory elements, quality gates, KPI benchmarks
- `high-ticket-sales.md` — HT session protocol, offer rules, funnel selection, follow-up rules, KPI targets
- `content-production.md` — Raiz/Nutella rules, KLT integration, editorial lines, Hormozi angle requirements

**Activation**: On-demand when Moroni initiates a launch (any of 5 models) for any REIS [IA] product, client, or partner campaign. Not part of day-to-day pipeline.

**Integration**: `launch-strategist` now supports 5 launch models (Semente, Classico, Turbo, LCP, Hybrid) and sits between `cmo-strategist` (who provides the brief) and the execution agents. The knowledge base is consumed by 8 agents: launch-strategist, cmo-strategist, funnel-architect, offer-architect, social-media-director, traffic-manager, creative-strategist, direct-response-copywriter.

### Protocolo Luxo — Luxury Design Overlay (2026-05-18)

A conditional overlay that activates luxury-specific agents, rules, and knowledge WITHOUT modifying the standard design pipeline. The existing design stack (art-director, designer-agent, vfx-motion-designer, visual-research-scout, visual-qa-agent, design-system-extractor, brand-site-builder, logo-brand-mark-designer) remains 100% unchanged.

**Activation**: Moroni says "Protocolo Luxo" or tags a project as luxury. Deactivation: implicit when project work concludes.

**New Agents (luxury-only):**
- `typography-specialist` (sonnet) — Deep typography: High-Low pairing (display serif + text sans + mono metadata), variable font exploitation, kinetic type specs, OpenType feature audit, micro-typography enforcement. Sits between art-director (type intent) and designer-agent (component specs).
- `luxury-brand-analyst` (sonnet) — Decodes luxury brand visual grammar by vertical (fashion, automotive, jewelry, hospitality, fragrance). Produces DNA Reports in `brain/design-library/luxury/dna/`. Feeds art-director and visual-qa-agent with luxury intelligence.

**New Rule:**
- `.claude/rules/luxury-design-grammar.md` — 8 universal luxury patterns, motion rules (min 0.4s, ease-out, no bounce), typography rules (High-Low system), component rules (zero border-radius CTAs), luxury vs SaaS diagnostic checklist. Loaded conditionally when protocol is active.

**New Knowledge Base:**
- `brain/design-library/luxury/luxury-principles.md` — Central principles document: restraint, codes, confidence, the luxury spectrum (temperature/density/motion/voice), vertical-specific grammar, reference harvest priority list
- `brain/design-library/luxury/dna/` — DNA Reports per vertical (produced by luxury-brand-analyst)
- `brain/design-library/luxury/harvest-plan.md` — Prioritized list of luxury brands to extract, sources to monitor, type foundries

**Luxury Pipeline (overlays the standard design pipeline):**

```
[STANDARD PIPELINE — unchanged]
  art-director → designer-agent → vfx-motion-designer → visual-qa-agent

[LUXURY OVERLAY — activated by Protocolo Luxo]
  luxury-brand-analyst (DNA report) + visual-research-scout (luxury mood report)
    ↓ both feed ↓
  art-director (reads luxury-principles.md + DNA report + luxury-design-grammar.md)
    ↓
  typography-specialist (full type system with High-Low pairing)
    ↓
  designer-agent (reads luxury-design-grammar.md for component rules)
  vfx-motion-designer (reads luxury-design-grammar.md for motion rules)
    ↓
  visual-qa-agent (reads DNA report + luxury-design-grammar.md for Luxury Calibration verdict)
```

**Key Principle:** The overlay ADDS luxury-specific intelligence to existing agents via knowledge files and rules. It does NOT replace or modify any existing agent definition. The 2 new agents (typography-specialist, luxury-brand-analyst) are additive specialists that only exist within the luxury context.

**Existing references (already extracted):** Chanel, Hermes, Tiffany, Dior, Cartier, Louis Vuitton (in `brain/design-library/references/`)

**Priority harvest queue:** Bottega Veneta, Aesop, Diptyque, Rolls-Royce, Aman Resorts, Brunello Cucinelli

### Token Optimization

The `task-router` agent runs on haiku (cheapest) and classifies tasks into 4 tiers:

| Tier | Model | Cost | When |
|------|-------|------|------|
| 0 | Ollama local (llama3, qwen2.5-coder, reis-ops, reis-strategy) | FREE | Exploration, reading, formatting, explanations |
| 1 | Haiku | $0.25/M in | Simple edits, single-file, clear instructions |
| 2 | Sonnet | $3/M in | Multi-file implementation, bug fixes, copy writing |
| 3 | Opus | $15/M in | Architecture, strategy, orchestration, ambiguous problems |

Ollama queries use: `.claude/scripts/ollama-query.sh <model> <prompt> [context_file]`

### Workflow Chain

```
orchestrator
    +---> market-research-analyst  (produces research)
    +---> cmo-strategist           (consumes research, produces strategy, directs Copy Squad)
    |        +---> [OPTIONAL] chief-strategy-advisor (pressure-test at macro decision points only)
    |        +---> offer-architect  (Grand Slam Offers from strategic angle)
    |        +---> funnel-architect (value ladder + sequences from objective)
    |        +---> COPY SQUAD PIPELINE:
    |        |     cmo-strategist (brief + angles)
    |        |       ← offer-architect + funnel-architect (structured inputs)
    |        |       → direct-response-copywriter (raw copy + Hormozi)
    |        |         → humanizer (PT-BR voice + AI pattern removal)
    |        |           → reviewer (quality gate: APPROVE / REVISE)
    |        |             → cmo-strategist (final sign-off)
    +---> TRANSVERSAL TECHNICAL SUPPORT (used by any code-producing pipeline):
    |        integration-engineer  (APIs, webhooks, MCP servers, automation pipelines)
    |        data-engineer         (Supabase schemas, migrations, RLS)
    |        qa-agent              (end-to-end tests, deploy gate)
    |        devops-agent          (deploys, env vars, monitoring — respects qa-agent BLOCK)
    +---> designer-agent           (consumes copy + strategy, produces design specs)
    +---> dev-agent                (consumes design specs + copy, produces code)
    +---> executor-agent           (configures external platforms and tools)
    +---> analysis-agent           (produces context summaries for any agent)
    +---> execution                (file operations when needed)
    +---> social-media-director    (Stack 2 content production — orchestrates 4 specialists)
    |        +---> SOCIAL MEDIA PIPELINE:
    |        |     cmo-strategist (brief + Hormozi 4 angles)
    |        |       → social-media-director (routes by format)
    |        |         → hook-specialist (generates 10+ hook menu)
    |        |           → {reels-scriptwriter | linkedin-strategist | carousel-designer-writer}
    |        |             → humanizer (PT-BR voice + AI pattern removal)
    |        |               → reviewer (quality gate: APPROVE / REVISE)
    |        |                 → social-media-director (consolidation)
    |        |                   → cmo-strategist (strategic sign-off)
    |        |                     → publishing (carousels route through designer-agent first)
    +---> META ADS SQUAD (Stack 4 — paid traffic management):
    |        +---> ADS PIPELINE:
    |        |     cmo-strategist (campaign brief + objectives + ICP + budget)
    |        |       → creative-strategist (competitive analysis, creative briefs)
    |        |         → Copy Squad (ad copy) + designer-agent (visuals)
    |        |           → traffic-manager (campaign CRUD via meta-ads MCP — ALL PAUSED)
    |        |             → HUMAN APPROVAL → campaign active
    |        |               → ads-analyst (performance monitoring + diagnostics)
    |        |                 → cmo-strategist (strategic decisions)
    |        |                   → creative-strategist (feedback loop → next creative batch)
    +---> PAID LAUNCH PIPELINE (Lancamento Pago Turbo — activated on demand):
    |        +---> LAUNCH PIPELINE:
    |        |     cmo-strategist (campaign brief + ICP + budget)
    |        |       → launch-strategist (full launch architecture: event format, pricing, funnel)
    |        |         ├→ offer-architect (ticket offer + main product Grand Slam Offer)
    |        |         ├→ creative-strategist (portfolio brief for 10-50 creatives — Andromeda strategy)
    |        |         │     → Copy Squad (ad copy per angle) + designer-agent (visuals)
    |        |         ├→ direct-response-copywriter (landing page + checkout copy)
    |        |         │     → humanizer → reviewer
    |        |         ├→ hook-specialist (video hooks for creative portfolio)
    |        |         │     → reels-scriptwriter (video ad scripts)
    |        |         ├→ traffic-manager (6-phase scaling — ALL PAUSED)
    |        |         │     → HUMAN APPROVAL → campaigns active
    |        |         ├→ ads-analyst (CAC vs ticket monitoring, scaling phase progression)
    |        |         └→ social-media-director (event content + warm-up)
    +---> education-director       (curriculum mapping, briefings, quality review)
    +---> BRANDING PIPELINE (Protocolo Branding):
    |        brand strategists (concept + voice profile)
    |          → visual-research-scout (mood reports — aesthetic curation)
    |            → design-system-extractor (Track B harvest from mood-report recommendations)
    |              → art-director (unified brief: concept + type system + grid + shots + prompts + motion direction)
    |                → designer-agent (design system tokens + layout specs)
    |                  → vfx-motion-designer + logo-brand-mark-designer (implementation)
    |                    → visual-qa-agent (aesthetic verdict: APPROVE / REVISE / REJECT)
    |                      → brand-site-builder (brandbook documentation)
    |                        → designer-agent + reviewer (brand audit via brand-audit-checklist)
```

### Branding Pipeline (Protocolo Branding)

A 10-phase pipeline activated by "Protocolo Branding". Coordinates 10 agents from strategy through visual implementation:

**Strategy Phases (1-5):**
1. `company-brand-strategist` → brand architecture, positioning, values
2. `personal-brand-strategist` → persona, archetypes, narrative
3. `movement-brand-strategist` → cause, tribe, rituals, vocabulary
4. `product-brand-strategist` → naming, positioning, delivery experience
5. Voice DNA generation → each strategist produces `.claude/voice-profiles/` as mandatory deliverable

**Design Phases (6-8):** — updated 2026-04-15 (Design Team Restructure)
6. `visual-research-scout` → curates mood report(s) in `brain/design-library/mood-reports/` (20-50 annotated refs by aesthetic intent) — upstream curatorial pass
6b. `design-system-extractor` → harvests code from mood-report recommendations into `brain/design-library/references/{site}/` (Track B mandatory: real `html.html` > 50KB + 5 companion files)
7. `art-director` → unified creative direction brief: concept + narrative + **editorial typography system** + grid/composition + shot grammar + lighting + hero image prompts + 3D demo direction + motion language direction. Single creative head (fusion of former creative-director + cinematic-art-director).
8. `designer-agent` + `vfx-motion-designer` + `logo-brand-mark-designer` → design specs, motion implementation, SVG assets (all MUST consult `brain/design-library/patterns/` + `references/` before implementing)
8b. `visual-qa-agent` → subjective aesthetic verdict (APPROVE / REVISE / REJECT) comparing implementation against mood reports

**Documentation & Audit (9-10):**
9. `brand-site-builder` → interactive brandbook at reis-ia-brand/
10. `designer-agent` + `reviewer` → brand audit against `.claude/rules/brand-audit-checklist.md`

**Brandbook structure**: `.claude/templates/brandbook-structure.md` (30-section, 7-part template)
**Audit checklist**: `.claude/rules/brand-audit-checklist.md` (6-section PASS/BLOCK scoring)

### Copy Squad

The Copy Squad is a 5-agent pipeline managed by the CMO Strategist for all copy production:

1. **CMO Strategist** — creates strategic brief with Hormozi 4-angle material
2. **Direct-Response Copywriter** — writes raw persuasive copy applying `.claude/rules/hormozi-framework.md`
3. **Humanizer** — eliminates AI patterns per `.claude/rules/humanization-rules.md`, injects natural PT-BR voice
4. **Reviewer** — final quality gate scoring against all 3 rule sets in `.claude/rules/`
5. **CMO Strategist** — final strategic sign-off

**Rule sets** (mandatory for all Copy Squad agents):
- `.claude/rules/brand-voice.md` — Brand voice and tone
- `.claude/rules/hormozi-framework.md` — Persuasion framework (value equation, 4 angles, Grand Slam Offer)
- `.claude/rules/humanization-rules.md` — AI pattern elimination and human voice injection

### Quality Gate Rules

The reviewer agent operates as a formal quality gate with three verdict levels:
- **PASS** — Copy proceeds to CMO for final sign-off
- **BLOCK** — Copy returns to the identified rollback agent for specific fixes, then re-enters review. Max 2 revision loops.
- **EXIT** — Critical failure; pipeline restarts from CMO strategic brief

7 veto conditions (V1-V7) trigger automatic BLOCK regardless of score. See `reviewer.md` for the full veto table and rollback assignments.

### Voice Profile System

Voice profiles are operational extracts of brand concepts that Copy Squad agents load before writing. They live in `.claude/voice-profiles/` and are **produced by brand strategist agents** as part of the branding process.

**Branding Pipeline → Voice Profile:**
```
personal-brand-strategist  → brain/assets/branding/personal-moroni-reis-concept.md  → .claude/voice-profiles/moroni-personal.md
company-brand-strategist   → brain/assets/branding/company-reis-ia-concept.md       → .claude/voice-profiles/reis-ia-company.md
movement-brand-strategist  → brain/assets/branding/movement-builder-concept.md      → .claude/voice-profiles/builders-community.md
product-brand-strategist   → brain/assets/branding/product-concepts.md              → .claude/voice-profiles/{product-name}.md (when distinct)
```

**Rule**: When a brand concept is created or updated, the voice profile MUST be updated in the same session. The concept is the source of truth; the profile is the operational derivative.

**Loading**: Copy Squad agents determine which profile to load based on task context (IF/THEN rules in each agent's Expertise DNA). Default: `reis-ia-company.md`.

### ICP Ownership Split

- **market-research-analyst** discovers and maps raw ICP data (demographics, firmographics, pain points, desires, objections, voice-of-customer).
- **cmo-strategist** refines, prioritizes, and makes strategic ICP decisions (targeting priorities, segment selection, positioning per segment).

## Design Library

`brain/design-library/` is the team's persistent, versioned asset for premium design knowledge. It is the antidote to reinventing premium motion and visuals from zero each time. Four sub-assets:

1. **`references/`** — Raw source code harvested from premium sites (HTML, CSS, JS, assets, screenshots, motion configs). Written exclusively by `design-system-extractor` via its expanded Track B mission.
2. **`patterns/`** — Distilled reusable techniques: GSAP ScrollTrigger recipes, Three.js product spins, Lenis smooth scroll, editorial type reveals, noise grain, cinematic gradient mesh, backdrop-blur cards, magnetic cursor, clip-path reveals. Starter catalog in `patterns/SEED.md` (11 curated patterns).
3. **`hero-prompts/`** — Cinematic image prompts for Gemini / Flux / Midjourney following the REIS [IA] skeleton (dark, architectural, electric blue accent, film grain, studio lighting). Written by `art-director`.
4. **`iterations/`** — Tadewald-style exploration workspace for numbered HTML variants (`design_system.html`, `design_system2.html`, ...) before promoting a direction to production.

**MANDATORY for `vfx-motion-designer`**: before implementing any motion, consult `patterns/` and `references/` first. Reuse before reinvent. Enforced in the agent definition as the first workflow step.

**Golden rule**: every time `design-system-extractor` harvests a reference, it must also SUGGEST patterns to distill into `patterns/`. An extraction without a distillation plan is incomplete.

**Approved premium stack** (OSS-first): GSAP 3 + ScrollTrigger + SplitText, Three.js + React Three Fiber + Drei, Lenis, Framer Motion, Spline (embed), Canvas 2D / custom WebGL shaders. Use with critério — each added dependency is weight.

See `brain/design-library/README.md` for full rules, ownership, and consumption patterns.

### Design Team Restructure — 2026-04-15

Phase 1 of the Design Team Audit restructured the creative head of the design pipeline:

- **Merged** `creative-director` + `cinematic-art-director` → single `art-director` (opus). One unified brief covers concept, narrative, editorial typography system, grid/composition, shot grammar, lighting, hero image prompts, 3D demo direction, and motion language direction. The old two-director split caused handoff gaps and duplicated ownership of typography/motion decisions.
- **Added** `visual-research-scout` (sonnet) — continuous aesthetic curation from Awwwards, FWA, Typewolf, Land-book, Godly. Produces mood reports at `brain/design-library/mood-reports/` by aesthetic intent (not technology). Upstream of design-system-extractor — scout discovers, extractor harvests.
- **Added** `visual-qa-agent` (opus) — subjective aesthetic judge. Third quality layer (copy QA → brand audit checklist → visual QA). Compares implementations against curated mood-report references and renders APPROVE / REVISE / REJECT with aesthetic prose, not checklists. Anti-mediocrity filter.
- **Upgraded** `design-system-extractor` — BLOCKING rule: Track B harvests must contain a real `html.html` > 50KB captured via WebFetch/Playwright plus 5 mandatory companion files (`design-tokens.md`, `motion-config.md`, `stack-detected.md`, `observations.md`, `suggested-patterns.md`). Skeleton/README-only harvests are prohibited.
- **Upgraded** `vfx-motion-designer` — added "2026 Techniques" section covering native platform primitives: CSS `animation-timeline: scroll()`, View Transitions API, variable fonts + OpenType features, custom WebGL shaders beyond gradient mesh, CSS `@scope`, subgrid, `color-mix()`. Rule of engagement: check native primitives before adding JS dependencies.

Phase 1 is structural only. Phase 2 (mood-report collection + real extractor harvests) and subsequent phases are pending Moroni's approval.

## Tech Stack

| Component | Choice | Notes |
|-----------|--------|-------|
| Framework | Astro | Static-first, React islands for interactive components |
| Styling | Tailwind CSS | Utility-first CSS framework |
| Typography | Inter | Free, all weights, via Google Fonts or self-hosted |
| Development | Localhost | Local dev server first |
| Deployment | Vercel | After review and placeholder replacement |
| Booking | Cal.com | Open source, free tier, no branding |
| Email platform | TBD | Phase 2 decision |
| CRM | TBD | Phase 2 decision |

## Brand Identity

- **Brand name**: REIS [IA] — "REIS" in white, "[IA]" in accent blue. Font-weight 300 (light).
- **Philosophy**: "O Tempo é Rei" — decorative slogan, used sparingly in footer/watermarks. Never as headline.
- **Primary colors**: Black (#000000), White (#FFFFFF)
- **Accent color**: Primary Blue (#4A90FF). Layered by pillar:
  - **Builders**: Electric Blue (#2D7AFF) + Cyan (#00B4FF)
  - **Systems**: Black/White dominant + #4A90FF minimal
  - **Marketing**: Same as master (#4A90FF)
  - **Moroni Reis**: Soft Blue (#6AADFF)
- **Mode**: Dark mode default
- **Aesthetic**: Minimal geometric, architectural, Apple-level premium
- **Font**: Inter (all weights)
- **Three Pillars**: Systems (AI implementation), Builders (community/mentorship), Marketing (marketing/demand)
- **Hourglass**: Optional decorative element only. NOT a required brand symbol. May appear as low-opacity watermark.
- **PROHIBITED**: Gold, amber, terracotta, chess pieces, crowns, Z7 symbol, gradient text, azure whisper effects, emojis in UI, SaaS pricing patterns.

## Folder Structure

```
/
    .claude/
        agents/             # Agent definition files (11 agents)
        agent-memory/       # Agent-private persistent memory (per-agent)
        rules/              # Shared rule sets for Copy Squad (brand-voice, hormozi-framework, humanization-rules)
    brain/                  # Shared project knowledge base
        research/           # Raw research and data
            market/         # Market analyses
            competitors/    # Competitor deep-dives
            audience/       # Voice-of-customer, surveys, interview notes
        strategy/           # Strategic decisions and frameworks
        messaging/          # Approved messaging and angles
        assets/             # Generated deliverables
            copy/           # Sales pages, emails, VSL scripts, ads
            campaigns/      # Campaign briefs and execution plans
            content/        # Blog posts, social content, lead magnets
        context/            # Project identity and shared context
    CLAUDE.md               # This file
```

## Conventions

### Knowledge Base Rules

1. **brain/ is shared knowledge.** Any agent can read from brain/. Only the designated owner agent writes to a given section.
2. **agent-memory/ is private.** Each agent's memory directory is for that agent's internal learning only.
3. **Research flows into strategy, strategy flows into messaging, messaging flows into assets.** Respect this pipeline.
4. **Always use absolute file paths** in agent instructions and references.
5. **Never duplicate knowledge** between agent-memory/ and brain/. Agent memory stores patterns and lessons learned. Brain stores deliverables and decisions.

### File Ownership

| brain/ directory | Owner (creates/updates) | Consumers (read-only) |
|-----------------|------------------------|----------------------|
| research/ | market-research-analyst | cmo-strategist, orchestrator |
| strategy/ | cmo-strategist | direct-response-copywriter, designer-agent, orchestrator |
| messaging/ | cmo-strategist | direct-response-copywriter, designer-agent |
| assets/copy/ | direct-response-copywriter | dev-agent, designer-agent, orchestrator |
| assets/campaigns/ | cmo-strategist | orchestrator |
| context/ | orchestrator (+ user) | ALL agents |

### File Management Rules (ALL agents must follow)

1. **NEVER overwrite originals** in `brain/assets/copy/`. Keep existing content exactly as it is.
2. **Append only** — add new content below originals with `[ADDED -- YYYY-MM-DD]` tags.
3. **Variations** — mark alternative versions with `[VARIATION -- YYYY-MM-DD]` tags.
4. **Changelog** — add a changelog section at the bottom of any modified file.
5. **Portuguese content** — create separate files with `-pt` suffix (e.g., `linkedin-templates-pt.md`). Never mix languages within a single file.
6. **Update dates** — change the "Last updated" date at the top of any modified file.

### Writing Standards

- Use Markdown for all knowledge files.
- Include a date header (e.g., "Last updated: March 2026") in every knowledge file.
- Structure files with clear headers and sections.
- When updating a file, update the date header.
- All agent communications, task contracts, file contents, and documentation must be written in English. Portuguese is only used when explicitly requested for market-specific content variations.
