# Avelã White — Critical Analysis
## Source: https://www.avelawhite.com/
## Extracted: 2026-05-01

---

## What Makes This Page Premium

Avelã White is a Lisbon-based boutique studio specializing in luxury wedding websites and digital stationery. The site achieves a genuinely premium, editorial-luxury aesthetic on Squarespace — a constrained platform — through extreme discipline in four areas: typography weight, color temperature, spatial restraint, and interaction softness.

The single most powerful design decision is using Editor's Note at weight 200 for all headings. Ultra-light serif typography at this weight reads not as "thin" but as "aristocratic" — the visual equivalent of writing on handmade paper. Combined with a five-tone warm palette where the "white" is cream (#fbf8f2) and the "black" is warm espresso (#221c19), every pixel on the site feels like it is made of natural materials. There is no cold gray, no pure white, no sharp black anywhere on the page. The effect is like looking at a site printed on ivory card stock.

The second major lever is spatial generosity. The Squarespace Fluid Engine grid is configured at 24 columns with 4vw gutters and a max-width of 1500px. Sections breathe. Text is set with generous line heights, and heading blocks are given 4-12 rows of vertical space before the next element appears. Luxury has always been about what is not there.

Interaction design is equally restrained. The "inactive dimming" nav pattern (all siblings fade to 50% when any item is hovered) is used by Bottega Veneta and similar luxury brands. Gallery images default to 70% opacity at rest and come to full opacity + scale 1.02 on hover — a warmth effect, not a drama effect. Product list items use 40% sibling dimming on hover, the deepest fade in the site. All of these patterns say: we are showing you exactly one thing at a time.

---

## Detected Stack Checklist

- [ ] GSAP / ScrollTrigger / SplitText
- [ ] Three.js / React Three Fiber
- [ ] Lenis smooth scroll
- [ ] Framer Motion
- [ ] Custom WebGL shaders
- [ ] Canvas 2D particles
- [x] Squarespace Fluid Engine (24-col CSS grid)
- [x] CSS keyframe entrance animations (tmpl-anim-* family)
- [x] CSS transitions (0.4s ease, 0.5s ease-in-out)
- [x] Intersection Observer (via SQS block-animation)
- [x] WillMyersCode expanding-panels, tabs, pricing-table plugins
- [x] Editor's Note serif (weight 200) + PP Neue Montreal sans
- [x] HSL-based color token system

---

## Signature Techniques (Ranked by Extractable Value)

### 1. WARM MONOCHROME PALETTE (★★★★★ — steal immediately)
Five tones, all warm, no cold grays. The "white" is cream, the "black" is warm espresso.
```css
--white:       #fbf8f2   /* cream, not white */
--lightAccent: #d3ccc2   /* linen */
--accent:      #988573   /* taupe */
--darkAccent:  #493a32   /* espresso brown */
--black:       #221c19   /* warm near-black */
```
This palette would not work for REIS [IA] directly (we are black/blue, not warm earth), but the **principle** — zero pure black or white, all warm — is directly adaptable. REIS [IA] could do the same with cool-temperature neutrals.

### 2. HSL OPACITY TOKEN SYSTEM (★★★★★ — architecture pattern)
All colors defined as `--name-hsl: H, S%, L%` then consumed as `hsla(var(--name-hsl), opacity)`.
This gives any component fine-grained opacity without extra tokens.
```css
:root { --black-hsl: 20, 14.75%, 11.96%; }
/* Usage: */
hsla(var(--black-hsl), 0.17)   /* divider */
hsla(var(--black-hsl), 0.49)   /* header border */
hsla(var(--black-hsl), 1)      /* full text */
```
This pattern is directly applicable to REIS [IA]'s token system.

### 3. INACTIVE DIMMING INTERACTION PATTERN (★★★★★ — direct steal)
When any item in a list/nav is hovered, ALL siblings fade to 40-50% opacity.
The hovered item stays at 100% opacity (and may scale 1.02-1.03).
```css
.header-nav-list:hover > .header-nav-item { opacity: 0.5; }
.header-nav-list:hover > .header-nav-item:hover { opacity: 1; }
/* Sibling transition */
transition: opacity 0.4s ease;
```
This is the single most luxury-feeling interaction pattern on the site. Used by Bottega Veneta, Loro Piana, etc.

### 4. ULTRA-LIGHT SERIF + GEOMETRIC SANS PAIRING (★★★★☆ — typographic principle)
Editor's Note 200 (display) + PP Neue Montreal 300/500 (body/UI).
The contrast between an ultra-light, classical serif and a crisp geometric sans at weight 300-500 is a canonical luxury pairing.
For REIS [IA]: adapt with available fonts — Cormorant Garamond 300 (serif) + Inter 300/500 (sans) approximates this.

### 5. MICRO-SCALE HOVER (★★★★☆ — direct steal)
Gallery images and list items use scale 1.02-1.03 on hover, not color change.
```css
transform: scale(1.02);   /* gallery */
transform: scale(1.03);   /* list items */
transition: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
```
These numbers are deliberately small — large-scale hover (1.1+) reads as playful/startup. 1.02-1.03 reads as premium.

### 6. CLIP-PATH CONTENT REVEALS (★★★☆☆ — motion pattern)
Content blocks enter via clip-path polygon animation — a "wipe" reveal, not a fade.
```css
/* Vertical reveal */
from { clip-path: polygon(50% 0%, 100% 0%, ... collapsed to center); }

/* Horizontal wipe from left */
from { clip-path: polygon(0% 50%, 0% 100%, ... collapsed to horizontal line); }

animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
animation-duration: 800ms;
```

### 7. CSS BACKGROUND-GRADIENT UNDERLINE ANIMATION (★★★☆☆)
Uses two CSS background gradient stops as a sliding underline on hover:
```css
@keyframes underlineSlideIn {
  from { background-position: -200% bottom, -100% bottom; }
  to   { background-position: 0% bottom, 100% bottom; }
}
```
More editorial than `text-decoration` underlines.

### 8. SECTION OPACITY DEFAULTS (★★★☆☆)
Links within sections default to 0.7 opacity, hover brings to 1.0:
```css
section[...] p a { opacity: 0.7; }
section[...] p a:hover { opacity: 1; }
```
This creates a sense that everything is "resting" at lower intensity, and interaction "activates" it.

### 9. EXPANDING PANELS (★★★☆☆ — layout pattern)
Full-viewport accordion panels that expand horizontally (not vertically).
Configured at 90vh height, active panel at 1.2x width, dark overlay on inactive panels.
A premium alternative to standard tab interfaces.

---

## Non-Code Ideas Worth Stealing

1. **Testimonials as the primary content block** — the homepage leads with eight client testimonials formatted as block quotes, before showing services or portfolio. This positions the studio's reputation before its work.

2. **"Featured by" bar** — Vogue, Tatler, The Lane, The Wed logos. Simple social proof. The publications chosen match the target client (luxury wedding market). For REIS [IA]: tier-appropriate publications.

3. **Collection naming as aesthetic descriptors** — "Onda: coastal · airy · modern", "Simon: bold · sculptural · contemporary", "Seine: Parisian · romantic · timeless". Each collection is sold via three adjectives before any imagery. The adjectives create desire before the visual does.

4. **Bilingual heading treatment** — headings like "services for Couples" where "for" is lowercase mid-sentence creates typographic rhythm. Intentional mixed case as a design element.

5. **Italic as accent** — H2 headings are uppercase, but italic em spans within them reset to not-uppercase. This creates visual surprise inside a rigid grid.

6. **Pricing transparency** — packages listed at exact prices (€950 Light, €1500 Core) without any form-fill required. For service businesses, this filters unqualified leads and builds trust with qualified ones.

7. **Studio-in-Lisbon positioning** — geographic specificity creates mystique. "Avenida Casal Ribeiro, Lisboa, Portugal." European luxury location signals quality to international wedding clients.

---

## Extraction Limitations

- Squarespace renders much of the page client-side via hydration. The HTML captured is server-rendered but some interactive states (expanded panels, tabs) require JavaScript execution to observe.
- The actual font files (Editor's Note, PP Neue Montreal) are hosted on Squarespace CDN and cannot be downloaded without a license. For reproduction, Cormorant Garamond (free) and PP Neue Montreal (commercial) are the closest equivalents.
- Section background colors are controlled via Squarespace editor (not visible as CSS classes in source). The cream/white (#fbf8f2) background dominates with one dark section visible.
- Images are served from Squarespace CDN with `?format=1500w` parameters. No direct asset URLs for download.

---

## Pattern Distillation Suggestions (for Orchestrator Approval)

1. `patterns/interactions/inactive-dimming.md` — The nav/list sibling fade-to-50% hover pattern. Config: opacity 0.5 siblings, 1.0 hovered, 0.4s ease transition. Reference: html.html lines `.header-nav-list:hover > .header-nav-item` and `.user-items-list-simple:hover .list-item`.

2. `patterns/tokens/hsl-opacity-system.md` — Color token architecture where all colors are defined as HSL triplets and consumed via `hsla(var(--color-hsl), opacity)`. Enables opacity-as-semantic-layer without extra variables. Reference: html.html site.css `:root` block.

3. `patterns/typography/ultra-light-serif-display.md` — Using a serif typeface at weight 200 for all display headings. CSS implementation, fallback fonts (Cormorant Garamond), letter-spacing rules, em-italic exceptions. Reference: html.html `@font-face editors-note-46p2ah`.

4. `patterns/motion/clip-path-content-reveal.md` — Clip-path polygon animation for content entrances (vertical collapse + horizontal wipe variants). Exact keyframes, duration (800ms), easing (cubic-bezier(0.4, 0, 0.2, 1)), delay (0.6s). Reference: html.html `tmpl-anim-clip-*` keyframes.

5. `patterns/motion/micro-scale-hover.md` — Gallery and list items using scale(1.02)–scale(1.03) on hover. Values matter: 1.02 for images, 1.03 for text-cards. Transition: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94). Reference: html.html custom.css `.gallery-reel-item`.

6. `patterns/layout/section-opacity-default.md` — Setting all links/interactive elements within a section to opacity 0.7 at rest, 1.0 on hover. Creates a "resting state" that makes interaction feel like activation. Reference: html.html `section[data-section-id] p a { opacity: 0.7 }`.

7. `patterns/typography/uppercase-tracked-label.md` — PP Neue Montreal (or geometric sans) weight 400-500, text-transform uppercase, letter-spacing 0.1em as a systematic "label" style. Used for nav, captions, marquees, tab buttons. Reference: html.html custom.css `.sqsrte-small`, `.sqsrte-large`.
