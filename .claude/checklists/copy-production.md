# Checklist: Copy Production — Full Copy Squad Pipeline

> Used by: cmo-strategist, direct-response-copywriter, humanizer, reviewer
> Based on: Copy Squad pipeline in CLAUDE.md + Hormozi framework + humanization rules

---

## Phase 1: Strategic Brief (6 tasks)

- [ ] Identify copy type (sales page, email sequence, ad copy, social post, VSL script) — **agent**: cmo-strategist
- [ ] Load target ICP from `brain/strategy/icp-tokenized.md` — **agent**: cmo-strategist
- [ ] Load voice profile from `.claude/voice-profiles/` — **agent**: cmo-strategist
- [ ] Load offer details from `brain/context/offerbook.md` — **agent**: cmo-strategist
- [ ] Load proof entries from `brain/context/proof-vault.md` — **agent**: cmo-strategist
- [ ] Generate Hormozi 4-angle material per `.claude/rules/hormozi-framework.md`:
  - [ ] More Good: specific financial/operational gain
  - [ ] Less Bad: specific pain removed (Prototype Graveyard narrative)
  - [ ] More Good for Others: status gain (board, team, market)
  - [ ] Less Bad for Others: risk eliminated (reputation, credibility)
  - [ ] WHO expansion: self, board, team, clients, market
  - [ ] WHEN urgency: today, 30 days, 90 days, 1 year

## Phase 2: Draft Copy (8 tasks)

- [ ] Select primary angle from 4-angle material — **agent**: direct-response-copywriter
- [ ] Write headline/hook (minimum 5 variations) — **agent**: direct-response-copywriter
- [ ] Write lead section (problem agitation + empathy) — **agent**: direct-response-copywriter
- [ ] Write proof section (specificity > generality, numbers > adjectives) — **agent**: direct-response-copywriter
- [ ] Write offer/solution section (Grand Slam Offer structure if applicable) — **agent**: direct-response-copywriter
- [ ] Write CTA sections (clear, actionable, routes to /agendar or /aplicar) — **agent**: direct-response-copywriter
- [ ] Apply Value Equation throughout: Valor = (Resultado x Probabilidade) / (Tempo x Esforco) — **agent**: direct-response-copywriter
- [ ] Self-check: every claim has a specific number, scenario, or proof attached — **agent**: direct-response-copywriter

## Phase 3: Humanization (10 tasks)

- [ ] Scan for prohibited words per `.claude/rules/humanization-rules.md`:
  - [ ] "revolucionario", "inovador", "solucao robusta", "cutting-edge" → REMOVE
  - [ ] "transformar", "alavancar", "potencializar", "impulsionar" → REPLACE
  - [ ] "neste artigo/guia vamos explorar..." → REMOVE opening
  - [ ] "em conclusao", "em resumo", "para finalizar" → REMOVE closing
  - [ ] "jornada", "ecossistema", "sinergia", "paradigma" → REPLACE
- [ ] Check for 3+ adjetivos encadeados → BREAK UP — **agent**: humanizer
- [ ] Check for 5+ items starting with same grammatical structure → RESTRUCTURE — **agent**: humanizer
- [ ] Check paragraph rhythm: vary sentence lengths (short. Long with context. Short again.) — **agent**: humanizer
- [ ] Add Brazilian executive tone markers ("Olha", "Na pratica", "Funciona assim:") — **agent**: humanizer
- [ ] Add strategic imperfections ("e olha que...", parenthetical asides, self-corrections) — **agent**: humanizer
- [ ] Replace generic language with emotional specificity:
  - [ ] "aumentar receita" → "parar de justificar investimento em AI sem retorno"
  - [ ] "eficiencia operacional" → "sua equipe parar de apagar incendio"
  - [ ] "vantagem competitiva" → "quando seu concorrente ligar pra saber como voce fez"
- [ ] Read aloud test (mentally): does it sound like a Brazilian executive in a meeting? — **agent**: humanizer
- [ ] Check Portuguese accents/diacritics are ALL correct — **agent**: humanizer
- [ ] Verify identity test: "If I covered the brand name, would I know this is Reis IA?" — **agent**: humanizer

## Phase 4: Review Quality Gate (8 tasks)

- [ ] Check against `.claude/rules/brand-voice.md`:
  - [ ] Consultivo premium tone (strategic partner, not salesperson)
  - [ ] C-level appropriate (business decision-makers, not tech teams)
  - [ ] Zero academicism
  - [ ] No unnecessary anglicisms
- [ ] Check against `.claude/rules/hormozi-framework.md`:
  - [ ] Value Equation present in copy structure
  - [ ] At least 1 of 4 angles clearly dominant
  - [ ] Specificity > Generality throughout
- [ ] Check against `.claude/rules/humanization-rules.md`:
  - [ ] No prohibited words remaining
  - [ ] Rhythm variety confirmed
  - [ ] No AI structural patterns
- [ ] Check 7 veto conditions (V1-V7) per reviewer.md — **agent**: reviewer
- [ ] Score copy on 3 dimensions (brand voice, Hormozi, humanization) — **agent**: reviewer
- [ ] Issue verdict: PASS / BLOCK / EXIT — **agent**: reviewer
- [ ] If BLOCK: identify specific fixes + rollback agent + re-enter pipeline (max 2 loops) — **agent**: reviewer
- [ ] If EXIT: restart from Phase 1 with new CMO brief — **agent**: reviewer

## Phase 5: Final Sign-off (3 tasks)

- [ ] CMO reviews approved copy against strategic objectives — **agent**: cmo-strategist
- [ ] Verify copy aligns with funnel position and CTA routing — **agent**: cmo-strategist
- [ ] Save final copy to `brain/assets/copy/` with `[ADDED -- YYYY-MM-DD]` tag — **agent**: cmo-strategist

---

**Total: 35 tasks**
**Max revision loops: 2 (then EXIT)**
