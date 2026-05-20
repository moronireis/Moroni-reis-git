# Minted — Suggested Patterns for Distillation
Source: https://www.minted.com/wedding-invitations
Harvested: 2026-05-02
Status: PROPOSED — awaiting orchestrator approval before creation

---

## Instructions for Orchestrator

The following patterns were identified during Minted's Track B harvest as high-value
distillation candidates. Each is formatted as a concrete `patterns/{category}/{name}.md`
proposal with rationale, source evidence, and implementation priority.

None of these files have been created yet. The `design-system-extractor` does not write
to `brain/design-library/patterns/` directly. The orchestrator decides which to approve
and delegate to `vfx-motion-designer` or `dev-agent` for pattern file creation.

---

## Pattern Proposals

---

### PATTERN 1

**File:** `patterns/cards/stacked-image-hover-reveal.md`
**Priority:** P0 — Highest Value
**Category:** Cards / Product Display

**Why distill:**
This is the most reusable, zero-dependency interaction in the entire harvest. It solves
a universal problem (showing multiple views of a product/item without UI reflow) with
4 lines of CSS. The pattern is GPU-composited (opacity only, no layout triggers), works
on all browsers, and creates a premium "discovery" feeling on hover. Directly applicable
to: Reis IA case study cards, Noiva S.A. product cards, Castelo dos Lagos room/venue cards,
and any portfolio grid in the ecosystem.

**Source evidence in html.html:**
Lines containing `.product-card__image--primary` and `.product-card__image--detail` CSS,
and the product card HTML structure (articles with two stacked `<img>` elements).

**Core implementation:**
```css
.card-image { position: relative; overflow: hidden; }
.card-image img.primary { transition: opacity 300ms ease; }
.card-image img.detail  { position: absolute; inset: 0; opacity: 0; transition: opacity 300ms ease; }
a:hover .card-image img.primary { opacity: 0; }
a:hover .card-image img.detail  { opacity: 1; }
```

**Variations to document:**
- Standard crossfade (primary → detail)
- Dark overlay reveal (primary → same image + dark overlay + centered text)
- Scale + fade (primary stays, detail fades in at scale(1.05))

---

### PATTERN 2

**File:** `patterns/typography/serif-italic-product-naming.md`
**Priority:** P1 — High Value
**Category:** Typography

**Why distill:**
The convention of naming each product/design in italic serif — evoking calligraphy,
vintage print, and handwriting — is a typography pattern applicable far beyond stationery.
Any product, service, or offering that benefits from feeling handcrafted or artisan
can use this pattern. For Reis IA: a named methodology card ("The Revenue Framework"
in Cormorant Garamond italic) would carry a different weight than the same name in Inter.

**Source evidence in html.html:**
`.product-card__name` CSS declaration (Freight Text Pro, 15px, weight 400, font-style italic).
Every product card meta section.

**Fonts for web-safe implementation (Freight Text Pro is commercial):**
- Cormorant Garamond (Google Fonts, free) — closest match, extremely elegant
- EB Garamond (Google Fonts, free) — more classical
- Lora (Google Fonts, free) — warmer, more approachable
- Inter italic — minimal adaptation for Reis IA (keeps Inter-only rule)

**When to use:** Named offerings, methodology names, section pull-quotes, case study titles.
**When NOT to use:** UI controls, data labels, technical copy, navigation.

---

### PATTERN 3

**File:** `patterns/tokens/warm-parchment-background.md`
**Priority:** P1 — High Value
**Category:** Design Tokens / Color

**Why distill:**
The #FAFAF8 (warm parchment) background is the highest-ROI single token in the harvest.
It requires no code change, only a color value substitution, yet it shifts the entire
page perception from clinical (#FFFFFF) to editorial (#FAFAF8). Every project that
currently uses pure white backgrounds could benefit from this 2-point warmth shift.

**Source evidence in html.html:**
`body { background-color: #FAFAF8 }` CSS rule.

**Full warm neutral scale to document (for light-mode contexts):**
| Token | Value | Usage |
|---|---|---|
| `--bg-page` | `#FAFAF8` | Page background |
| `--bg-card` | `#FFFFFF` | Card / panel surface |
| `--bg-section-warm` | `#F2EDE8` | Alternate section (promo, email signup) |
| `--bg-image-placeholder` | `#F0EBE5` | Image loading state |
| `--border-light` | `#E8E4DF` | Dividers, card borders |

**Dark-mode adaptation for Reis IA:**
The same principle inverted: instead of slightly-warm white, use a slightly-warm dark
(#0A0908 instead of pure #000000). Adds depth without disrupting the dark aesthetic.

---

### PATTERN 4

**File:** `patterns/layout/category-scrollstrip-chips.md`
**Priority:** P2 — Medium Value
**Category:** Layout / Navigation

**Why distill:**
The horizontal scrolling chip strip (72px circles with images + labels) is a
mobile-first category navigation pattern that works equally well at desktop width.
The hidden scrollbar and active border reveal create a clean interaction. Applicable
to Reis IA for: pillar navigation (Systems / Builders / Marketing), content type
selection, or product category browsing in any marketplace context.

**Source evidence in html.html:**
`.category-strip`, `.category-chip`, `.category-chip__image` CSS + HTML structure.

**Core implementation:**
```css
.chip-strip {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
}
.chip-strip::-webkit-scrollbar { display: none; }

.chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  width: 72px;
}

.chip__image {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid transparent;
  transition: border-color 200ms ease;
}

.chip:hover .chip__image,
.chip.active .chip__image { border-color: var(--color-ink); }
```

**Variations to document:**
- Square chips (for more editorial contexts)
- Text-only chips (pill/tag style)
- Icon + label chips (for Reis IA pillar nav)

---

### PATTERN 5

**File:** `patterns/cards/zero-shadow-border-elevation.md`
**Priority:** P2 — Medium Value
**Category:** Cards / Elevation

**Why distill:**
Counter-pattern to the default `box-shadow: 0 4px 16px rgba(0,0,0,0.1)` that most
designers reach for first. Minted achieves card elevation with only: (a) background
color difference (card #FFFFFF on page #FAFAF8), (b) `1px solid #E8E4DF` border.
No shadow. The result is flatter, more editorial, more premium — and more performant
(no composite layer promotion for box-shadow).

**Source evidence in html.html:**
Absence of any `box-shadow` in the reconstructed CSS. `.product-card` has no shadow
declaration. `--border-light: 1px solid #E8E4DF` in design-tokens.md.

**Dark-mode adaptation for Reis IA:**
Card: `#111111` on page background `#0A0908`. Border: `1px solid rgba(255,255,255,0.06)`.
No shadow. The principle is identical — background contrast + faint border = elevation.

---

### PATTERN 6

**File:** `patterns/typography/tracked-uppercase-micro-label.md`
**Priority:** P2 — Medium Value
**Category:** Typography

**Why distill:**
Minted's single UI label style — 11px / weight 500 / letter-spacing 0.1em / uppercase —
appears in every chrome element: section headings, sidebar titles, footer column headers,
button text. One rule creates an entire labeling system. The tracked uppercase grotesque
is one of the most reliable "premium UI" typography patterns across print and digital.

**Source evidence in html.html:**
`.filter-sidebar__title`, `.section-heading`, `.footer-col__heading`, `.btn-primary` CSS.

**Reis IA adaptation:** Inter 400 weight (instead of 500, since Inter's weight 400 at
small tracked sizes reads very cleanly), 11px, letter-spacing 0.08–0.12em, uppercase.
This already partially exists in Reis IA's system — this pattern would codify it.

---

### PATTERN 7

**File:** `patterns/media/cdn-named-transform-shapes.md`
**Priority:** P3 — Niche / Reference
**Category:** Media / Infrastructure

**Why distill:**
The concept of delegating card shape rendering to Cloudinary Named Transforms is an
infrastructure pattern worth documenting as a reference — not as something to implement
immediately, but as a mental model. The shape becomes a CDN-level design token: scallop,
arch, oval, wave frame, rounded corners. The image itself has the correct shape,
including proper shadow and paper-edge rendering that pure CSS clip-path cannot achieve.

**Source evidence in html.html:**
Cloudinary URL transform parameter list in HTML comments and design-tokens.md Cloudinary section.
Transform names: `_Hero_Mini-Scallop`, `_Hero_Arch`, `_Hero_Classic-Oval`, `_Hero_Waved-Frame`,
`_Hero_Rounded-Corners`.

**When relevant:** Any Reis IA project using Cloudinary for product/portfolio imagery.
Particularly relevant for Noiva S.A. — wedding stationery, invitation previews, venue
photography with creative crop shapes.

---

### PATTERN 8

**File:** `patterns/badges/material-indicator-badge.md`
**Priority:** P3 — Niche / Reference
**Category:** Badges / Labels

**Why distill:**
Using a tiny photograph of the actual material finish (letterpress texture, gold foil)
as a badge icon communicates quality at thumbnail scale better than any icon or text alone.
The `rgba(255,255,255,0.90)` translucent background lets the product image show through
while the badge floats above it. The warm gold border for foil badges and the neutral
border for letterpress maintain visual hierarchy without competing with the invitation design.

**Source evidence in html.html:**
`.badge--letterpress`, `.badge--foil-gold`, `.badge--foil-silver` CSS.
Badge image URLs: `cdn3.minted.com/files/content/minted_ui/letterpress_texture_icon.png`,
`realfoil_gold.png`, `realfoil_silver.png`.

**Adaptation for Reis IA:** "Premium" vs "Core" tier badges using material/finish imagery.
Could use a subtle gradient mesh or texture thumbnail as the badge icon for premium offerings.

---

## Summary Table

| # | File Path | Priority | Complexity | Dependency |
|---|---|---|---|---|
| 1 | `patterns/cards/stacked-image-hover-reveal.md` | P0 | Low | None |
| 2 | `patterns/typography/serif-italic-product-naming.md` | P1 | Low | Font choice |
| 3 | `patterns/tokens/warm-parchment-background.md` | P1 | Minimal | None |
| 4 | `patterns/layout/category-scrollstrip-chips.md` | P2 | Low | None |
| 5 | `patterns/cards/zero-shadow-border-elevation.md` | P2 | Minimal | None |
| 6 | `patterns/typography/tracked-uppercase-micro-label.md` | P2 | Minimal | None |
| 7 | `patterns/media/cdn-named-transform-shapes.md` | P3 | High (infra) | Cloudinary |
| 8 | `patterns/badges/material-indicator-badge.md` | P3 | Medium | Asset prep |

**Recommended first distillations:** Patterns 1, 3, 5 — all P0/P1, zero dependencies,
immediately usable across all Reis IA projects. These three together define the core
of a premium editorial card system.
