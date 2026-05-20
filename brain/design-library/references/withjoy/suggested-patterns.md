# WIthJoy — Suggested Patterns
**Source:** https://withjoy.com
**Harvested:** 2026-05-01
**For orchestrator approval before distillation into `brain/design-library/patterns/`**

---

## How to Read This File

Each entry below is a proposal for a new pattern file. Format:
`patterns/{category}/{pattern-name}.md — why + source reference in html.html`

The orchestrator must approve before any pattern is created. This file is the proposal list only.

---

## Pattern Proposals

---

### 1. `patterns/motion/lottie-hero-overlay.md`

**Why:** Joy deploys one high-quality Lottie animation in the hero, layered over photography via absolute positioning (z-index stack). This concentrates all motion investment in a single premium moment — CSS-only for everything else. It is the most cost-effective way to achieve "this feels alive" without WebGL, GSAP, or scroll-trigger complexity. Appropriate for any site that needs motion premium without the engineering overhead.

**What to document:**
- z-index stack architecture (photo → Lottie SVG → text content)
- `lottie.loadAnimation()` config (renderer: svg, loop: true, autoplay: true)
- How to source/commission a Lottie for this use case (After Effects → Bodymovin export)
- Alternative: GSAP SVG path draw as a lighter replacement when Lottie toolchain unavailable
- REIS [IA] adaptation: replace fluid/color-wash Lottie with geometric line/grid animation in Electric Blue (#2D7AFF) for the Builders hero

**Source reference in html.html:** `<div class="joy-hero__lottie bodymovin" ...>` — lines ~180–195 of html.html

---

### 2. `patterns/layout/svg-wave-section-divider.md`

**Why:** The wave SVG between Joy's hero and content section is one asset that solves a universal problem: the hard visual cut between a photographic/dark hero and a white content area. The organic path creates flow and visual continuity. Separate mobile asset (`wave-mobile.svg`) handles the responsive case. Zero JS, one `<img>` tag, immediate impact.

**What to document:**
- SVG path construction technique (single `<path>` with fill matching destination section background)
- Responsive handling (two separate SVG assets vs. one responsive SVG with viewBox)
- Variations: wave (Joy), diagonal cut, geometric chevron, custom brand shape
- REIS [IA] adaptation: sharp angular geometric cut (not organic wave) — consistent with minimal/architectural aesthetic. Could use the hourglass silhouette as the divider path.

**Source reference in html.html:** `<div class="joy-wave">` + wave.svg asset — lines ~210–220 of html.html

---

### 3. `patterns/layout/floating-png-editorial-layer.md`

**Why:** Joy's Mother's Day promotional section achieves editorial richness through 14 individually-sized, positioned, and rotated PNG assets — all `position: absolute`, zero JS, zero canvas. The technique creates a sense of physical depth and art direction that single-background-image approaches cannot replicate. The key insight is using *many* small individual assets rather than one complex illustration.

**What to document:**
- CSS architecture: parent `position: relative; overflow: hidden`, children `position: absolute`
- Asset diversity requirement: minimum 6–8 unique PNGs, varied scale (60px–160px), varied rotation (-30deg to +30deg)
- Z-index layering to place some elements behind content
- How to avoid chaos: keep all assets to same color family; vary size and rotation, not color
- REIS [IA] adaptation: replace flowers with floating geometric fragments, circuit-trace SVGs, or translucent architectural shapes in Electric Blue/Cyan at low opacity for promotional sections

**Source reference in html.html:** `<div class="joy-promo-banner__flowers">` — lines ~295–315 of html.html

---

### 4. `patterns/typography/label-headline-stack.md`

**Why:** Joy consistently introduces feature sections with a two-level headline stack: a small uppercase label in accent color (13px, `letter-spacing: 0.05em`, `text-transform: uppercase`) above the main bold headline. This pattern anchors semantic context before the reader hits the headline, which allows the headline itself to be more poetic/short. Seen in: Contact Collector section, Room Blocks section, Mother's Day section. Common across premium SaaS and editorial sites (Linear, Stripe, Vercel all use variants).

**What to document:**
- Exact typography values: label 13px / semibold / uppercase / letter-spacing 0.05em / accent color; headline 36px / bold / near-black / line-height 1.15
- Margin between label and headline: 8px (`--space-2`)
- When to use: feature section intros, promotional callouts — NOT hero headlines
- REIS [IA] adaptation: label in #4A90FF (or pillar-specific accent), headline in #FFFFFF (dark mode). Spacing and sizing can port directly.

**Source reference in html.html:** `.joy-contact-collector` and `.joy-promo-banner` sections — lines ~315–360 of html.html

---

### 5. `patterns/components/pill-button-system.md`

**Why:** Joy uses `border-radius: 9999px` universally across all button variants (primary, ghost, text link). This single decision creates strong visual cohesion at the interaction layer. The primary button hover adds a blue-tinted shadow (`box-shadow: 0 4px 12px rgba(79,107,203,0.3)`) — a technique that makes the hover feel warm and branded rather than generic. Duration discipline: 150ms for color/shadow, same easing throughout.

**What to document:**
- Three-variant system: Primary (filled), Ghost (bordered transparent), Text (color-only)
- Exact hover values for each variant
- Shadow technique: `box-shadow` in brand color at 30% opacity — the "colored shadow" micro-pattern
- Why pill vs. rounded-rect: pill reads consumer/warm; 8px radius reads enterprise/tech. Match to brand positioning.
- REIS [IA] adaptation: REIS [IA] should likely use 6–8px radius (enterprise premium), not pill. But the colored shadow on hover is directly portable with #4A90FF.

**Source reference in html.html:** `.btn-primary`, `.btn-ghost`, `.btn-text` — lines ~65–110 of html.html

---

### 6. `patterns/motion/css-mega-menu-reveal.md`

**Why:** Joy's mega-menu uses a pure CSS reveal: `opacity: 0 → 1`, `visibility: hidden → visible`, `translateY(-8px) → 0`, all triggered by `:hover` on the parent nav item. No JS event listeners, no `mouseenter` handlers. The three-property transition (opacity + visibility + transform) is the correct technique — `visibility` prevents the invisible element from capturing pointer events while `opacity` handles the visual fade. `translateY(-8px)` provides the subtle drop-down spatial cue.

**What to document:**
- The three-property transition pattern and why all three are needed
- Exact transition: `250ms cubic-bezier(0.4, 0, 0.2, 1)` (Material Design standard ease)
- Grid layout inside mega-menu (CSS Grid, `repeat(3, 1fr)`)
- Accessibility note: pure CSS hover menus fail keyboard navigation — document the JS enhancement needed for `focus-within`
- REIS [IA] adaptation: direct port. Replace blue category links with #4A90FF. Dark mode version: white dropdown background → `#111111` with `rgba(255,255,255,0.05)` hover state.

**Source reference in html.html:** `.joy-dropdown` and `.joy-nav__item:hover .joy-dropdown` — lines ~130–160 of html.html

---

### 7. `patterns/layout/contextual-section-palette.md`

**Why:** Joy uses background color as semantic signal: `#FFFFFF` = default/neutral, `#FAFAF8` = alternating/rhythm, `#f5e6e0` = emotional/editorial (Mother's Day), `#EFF4FE` = product/tech (Baby Registry), `#1a1a1a` = terminus (footer). Each background shift carries meaning without requiring labels or dividers. This is more sophisticated than simple light/dark alternation — the tint encodes the content's emotional register.

**What to document:**
- The semantic mapping: neutral → editorial/emotional → product → terminus
- How to choose tints: hue should relate to the content's emotional temperature (warm = human, cool = product)
- When NOT to use: too many distinct backgrounds creates visual noise; limit to 3–4 per page
- REIS [IA] adaptation (dark mode): `#000000` default, `#0a0a0a` alternating rhythm, `#0d1117` (dark blue-black) for product/technical sections, `#111111` for editorial moments. Footer can be `#000000` with a top border.

**Source reference in html.html:** Section background values throughout the body — lines ~245, ~330, ~360, ~415 of html.html

---

### 8. `patterns/components/footer-marquee-tagline.md`

**Why:** Joy's footer contains a horizontal marquee of brand taglines ("Celebrate life / Plan smarter / Save the date / ...") in low-opacity text. This converts what would be dead vertical space in the footer into a subtle motion moment that reinforces brand voice. The infinite `translateX(-50%)` loop (with content duplicated for seamless repeat) is a CSS-only technique — zero JS. Low opacity (`rgba(255,255,255,0.3)`) keeps it ambient rather than distracting.

**What to document:**
- CSS `@keyframes marquee` with `translateX(-50%)` trick (duplicate content for seamless loop)
- Opacity: 0.3 (ambient, not distracting)
- Speed: `20s linear infinite` (slow enough to read, fast enough to feel alive)
- Pause on hover: `animation-play-state: paused` on `:hover`
- REIS [IA] adaptation: footer marquee with brand phrases in `rgba(255,255,255,0.2)` — "O Tempo é Rei" alternating with pillar names (Systems / Builders / Marketing / REIS [IA]). Replace wave with a cleaner separator.

**Source reference in html.html:** Footer marquee div — lines ~445–465 of html.html

---

## Priority Order for Orchestrator

| Priority | Pattern | Effort | REIS [IA] Impact |
|----------|---------|--------|-----------------|
| P1 | `lottie-hero-overlay.md` | Medium | High — hero premium moment |
| P1 | `label-headline-stack.md` | Low | High — immediate port, every section |
| P2 | `svg-wave-section-divider.md` | Low | Medium — section flow improvement |
| P2 | `css-mega-menu-reveal.md` | Low | Medium — nav component if needed |
| P2 | `pill-button-system.md` | Low | Medium — colored shadow technique portable |
| P3 | `floating-png-editorial-layer.md` | Medium | Medium — editorial/promotional sections |
| P3 | `contextual-section-palette.md` | Low | Medium — dark mode semantic palette |
| P3 | `footer-marquee-tagline.md` | Low | Low — ambient brand reinforcement |
