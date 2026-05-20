# Checklist: Design System Extraction

> Used by: design-system-extractor, designer-agent, dev-agent
> Tools: design-md skill (Alan Nicolas), design-system-extractor agent
> Reference: brain/design-library/

---

## Phase 1: Target Selection (4 tasks)

- [ ] Identify target URL(s) — single page or multiple pages of same site
- [ ] Test URL accessibility (no paywall, no heavy JS-only rendering, no bot protection)
- [ ] Define extraction purpose: client delivery | internal reference | competitor analysis
- [ ] Check if extraction already exists in `brain/design-library/references/` — avoid duplicates

## Phase 2: Static Extraction via design-md Skill (5 tasks)

- [ ] Run extraction:
  ```bash
  node .claude/skills/design-md/run.cjs --url <target-url>
  ```
- [ ] Check exit code (0 = success, 4 = content too thin, 5 = LLM budget exhausted)
- [ ] Review `outputs/design-md/{slug}/quality-score.json` — target grade B or above
- [ ] Open `outputs/design-md/{slug}/preview.html` in browser — visual validation of extracted tokens
- [ ] Review `outputs/design-md/{slug}/telemetry.json` — check cost and reuse trace

## Phase 3: Quality Validation (6 tasks)

- [ ] Verify color palette matches visual inspection of live site
- [ ] Verify typography (font family, sizes, weights) matches live site
- [ ] Verify button styles (radius, padding, colors) match live site
- [ ] Verify spacing scale is reasonable (not auto-generated noise)
- [ ] Check `style-fingerprint.json` — does the archetype classification make sense?
- [ ] Check `lint-report.json` — address any errors (warnings are acceptable)

## Phase 4: Enrichment (5 tasks)

- [ ] Review `tokens-extended.json` for shadow, motion, and component data
- [ ] If motion patterns are important: manually catalog key animations for `brain/design-library/patterns/`
- [ ] If site has multiple pages with different styles: run extraction on key pages separately
- [ ] Compare extraction with `render-contract.json` — verify theme detection (dark/light)
- [ ] Generate `agent-prompt.txt` review — is it usable for recreating pages?

## Phase 5: Integration into Design Library (4 tasks)

- [ ] Copy final extraction to `brain/design-library/references/{site-name}/`:
  - [ ] DESIGN.md
  - [ ] tokens.json
  - [ ] preview.html
  - [ ] style-fingerprint.json
  - [ ] render-contract.json
- [ ] Suggest patterns to distill into `brain/design-library/patterns/` (golden rule: extraction without distillation plan is incomplete)
- [ ] Update `brain/design-library/references/` README if it exists
- [ ] Log extraction in project notes for future reference

## Phase 6: Client Delivery (if selling as service) (5 tasks)

- [ ] Package DESIGN.md + preview.html + agent-prompt.txt for client
- [ ] Create usage guide: "How to use your Design System with AI tools"
- [ ] Test: feed DESIGN.md to Lovable/Bolt/Claude and verify visual consistency
- [ ] Prepare presentation showing side-by-side: original site vs AI-recreated page
- [ ] Define maintenance plan: drift detection via `--compare` flag for periodic checks

## Phase 7: Drift Monitoring (optional, ongoing) (3 tasks)

- [ ] Schedule periodic drift check:
  ```bash
  node .claude/skills/design-md/run.cjs --url <url> --compare path/to/DESIGN.md
  ```
- [ ] Review `drift-report.json` — verdict: in-sync / minor-drift / notable-drift / major-drift
- [ ] If notable-drift or above: re-extract and update references

---

**Total: 32 tasks**
**Cost per extraction: ~$0.40-2.00 (depending on model and site complexity)**
