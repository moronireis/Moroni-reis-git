# Paperless Post — Suggested Patterns
Source: https://www.paperlesspost.com/
Harvest date: 2026-05-01
Status: SUGGESTIONS ONLY — awaiting orchestrator approval before distillation into brain/design-library/patterns/

---

## Pattern Proposals

### 1. `patterns/gallery/dual-layer-product-preview.md`
**What**: A card component that layers two images — a background artifact (envelope, packaging, context object) and a foreground product (card face, poster, document) — to anchor the digital product in a physical-world frame.

**Why**: The envelope+card stack is the single most distinctive UI pattern on Paperless Post. It eliminates the need for a separate "preview" step by baking physical-world context into the browse thumbnail. For any digital product that has a physical analogue (invitations, prints, packaging, mockups), this pattern creates instant premium anchoring.

**Source reference**: `html.html` — Card tile component section (`<!-- INVITATION CARD COMPONENT -->`), observations.md Signature Technique #1.

**Applicability to Reis IA**: Potentially useful for any product gallery (e-books, templates, deliverables shown in mockup frames). Not immediately needed but valuable for future client projects.

---

### 2. `patterns/gallery/color-swatch-overflow.md`
**What**: A compact color variant selector on product cards — circular swatches (16–20px diameter, 4px gap) showing 3–5 colors with a "+N" overflow indicator of identical size. Clicking a swatch updates the card preview in-place without navigation.

**Why**: Communicates full colorway range in under 100px horizontal space. No dropdown, no modal, no page reload. The "+N" at identical swatch dimensions keeps the row visually uniform. A best-in-class pattern for multi-variant product galleries.

**Source reference**: `html.html` — Color swatches section, `design-tokens.md` — Color Swatches block.

**Applicability to Reis IA**: Directly applicable to any template/design gallery, client portfolio browser, or product variant selector.

---

### 3. `patterns/navigation/horizontal-occasion-tab-strip.md`
**What**: A horizontally scrollable tab strip of category/occasion labels above a product grid. 17+ items in a single row, scroll-snapping on mobile. Active state indicated by underline or color shift. No dropdown, no sidebar — categories are always one tap away.

**Why**: Eliminates the cognitive overhead of nested dropdowns for category navigation. Works at any scale — 5 or 50 categories. Degrades elegantly to touch-scroll on mobile. Faster than any sidebar filter system for top-level category switching.

**Source reference**: `html.html` — Occasion tabs section, observations.md Signature Technique #7.

**Applicability to Reis IA**: Useful for any content hub, template library, or resource browser. Could work for the REIS IA Hub's module/phase navigation.

---

### 4. `patterns/layout/gallery-as-curation.md`
**What**: A product gallery design philosophy: uniform card grid (no featured interruptions), comprehensive filter system exposed in a collapsible panel (not always visible), sort options in a clean dropdown, result count displayed, pagination at bottom. The grid breathes — cards do not compete with each other.

**Why**: The distinction between a catalogue (overwhelming) and a curation (premium) is achieved through grid uniformity, generous card spacing, and filter restraint. Paperless Post handles 7,336 items without feeling cluttered. The lesson: consistency of card size and spacing IS the curation signal.

**Source reference**: `html.html` — Gallery filter system and card grid sections, observations.md Signature Technique #2.

**Applicability to Reis IA**: Template libraries, case study browsers, resource archives. Any collection that risks feeling overwhelming.

---

### 5. `patterns/motion/functional-only-motion.md`
**What**: A motion philosophy pattern — constrain all animation to functional states only: hover reveals, dropdown opens, accordion expands, carousel scrolls, tab indicator slides. Zero entrance animations. Zero scroll choreography. Zero parallax.

**Why**: Premium does not always require GSAP choreography. For product categories adjacent to physical luxury (stationery, print, fashion), stillness IS the brand. Motion restraint signals confidence — "the product speaks for itself." This pattern documents the specific CSS transition values and contexts where motion is used, and explicitly lists what is absent.

**Source reference**: `motion-config.md` — all sections, observations.md Signature Technique #4 and Key Motion Philosophy.

**Applicability to Reis IA**: Directly applicable. Reis IA's "Apple-level premium" positioning benefits from knowing WHEN to suppress motion, not just how to add it. This pattern is a counterweight to the GSAP-heavy patterns already in the library.

---

### 6. `patterns/components/contextual-dark-mode-section.md`
**What**: A page-level background switch — a single section (hero, conversion CTA, or pricing block) that breaks from the site-wide light background and uses dark imagery/dark backgrounds to signal a different tier, tone, or urgency. No user toggle. No system preference. Purely editorial.

**Why**: Paperless Post's Pro subscription page uses this to signal "professional tier" — you cross a visual threshold when you reach the conversion page. This is more intentional than a global dark mode toggle, and more impactful than just changing a section background color. The technique is common in high-conversion landing pages (dark pricing tables on light sites).

**Source reference**: `observations.md` Signature Technique #6, subscription page analysis.

**Applicability to Reis IA**: High relevance. Reis IA is dark-mode-default, but this pattern could be inverted — a single light section within a dark page to signal a different register (e.g., testimonial section, pricing section, or a calm contrast beat in a high-energy scroll).

---

### 7. `patterns/components/designer-partnership-social-proof.md`
**What**: A social proof system built on collaborator/partner brand names rather than testimonials or star ratings. Displayed as a horizontal scroll or 2x4 grid of partner names/logos. The partners' brand equity transfers to the product.

**Why**: "Oscar de la Renta" communicates quality faster than any 5-star review. For platforms that curate third-party content or work with recognizable collaborators, this pattern replaces generic testimonials with aspirational brand association. The visual treatment is restrained — names or minimal logos, not loud badge walls.

**Source reference**: `html.html` — Designer collections sections (homepage + wedding page), observations.md Signature Technique #5.

**Applicability to Reis IA**: Applicable if Reis IA develops notable client partnerships, case study subjects, or technology partnerships (e.g., showcasing client company logos instead of generic testimonials).

---

## Priority Ranking for Orchestrator

| Priority | Pattern | Reason |
|---|---|---|
| 1 | `functional-only-motion.md` | Counterbalances GSAP-heavy library; directly applicable to Reis IA philosophy |
| 2 | `dual-layer-product-preview.md` | Most distinctive pattern; highest novelty value in library |
| 3 | `color-swatch-overflow.md` | Immediately implementable UI pattern; useful in multiple contexts |
| 4 | `horizontal-occasion-tab-strip.md` | High utility for Hub navigation patterns |
| 5 | `contextual-dark-mode-section.md` | Relevant for Reis IA's dark-default site |
| 6 | `gallery-as-curation.md` | Philosophy pattern — useful as a reference, lower urgency |
| 7 | `designer-partnership-social-proof.md` | Applicable only when partnership program exists |
