# Bliss & Bone — Suggested Patterns
**Source:** https://blissandbone.com
**Captured:** 2026-05-01
**For orchestrator review — do not distill without approval**

Each entry below is a concrete proposal. Format: target path — rationale — source evidence in html.html.

---

## Priority 1 — Immediately Actionable (high value, low complexity)

### `patterns/backgrounds/dark-botanical-photo-overlay.md`
**Why:** The single highest-value technique in this harvest. Converts any dark background from a flat hex fill into a material surface. The desaturated botanical photography underneath dark overlays creates depth, texture, and organic warmth simultaneously — a three-for-one. Directly applicable to Reis IA dark mode sections where a hero or feature section needs premium weight without 3D or WebGL.
**Source evidence:** `html.html` — `.dark-photo-bg` ruleset, lines ~175–190. Also visible in CDN image `bliss-and-bone-feature-04-334-1690814531.png` (Amber & Elgin design) and `bliss-and-bone-feature-08-475-1760372355.png` (Vivienne Nash dark satin).
**Key params:** `filter: grayscale(100%) contrast(1.1) brightness(0.70)` on photo layer; `rgba(15,12,10,0.62)` warm dark overlay; warm-tinted overlay variant `rgba(40,32,20,0.55)` for olive-toned sections.
**Reis IA adaptation note:** Swap botanical photography for architectural/geometric dark photography. Keep the grayscale + brightness + warm overlay formula. Works directly with the Reis IA dark mode default.

---

### `patterns/typography/ultra-light-display-headline.md`
**Why:** Font-weight 300 on a high-contrast display serif is the single most transferable luxury typography signal in this harvest. It is the opposite of the common mistake of bolding headlines to create impact. At large scale, a light-weight serif with negative letter-spacing reads as architecturally refined, not weak. Directly applicable to Reis IA hero sections, section titles, and any editorial landing page moment.
**Source evidence:** `html.html` — `--weight-light: 300` token; `.hero__headline`, `.dark-headline` rules; `.invitation-card__names` rule. Visible across every CDN image in the harvest — consistent application in 14/14 analyzed images.
**Key params:** `font-weight: 300`, `letter-spacing: -0.01em` to `-0.02em` at display sizes, `line-height: 1.1`. Pair with `clamp(2rem, 5vw, 4.5rem)` for responsive scale.
**Reis IA adaptation note:** Inter at weight 300 already exists in the Reis IA system. This pattern formalizes its use at display scale with the correct letter-spacing and line-height companions.

---

### `patterns/motion/css-only-luxury-transitions.md`
**Why:** The complete Bliss & Bone motion system demonstrates that CSS-only animation, when calibrated precisely, is indistinguishable from JS-library animation for editorial luxury sites. The specific values (scale 1.04, translateY 24px, 600ms, editorial ease) are the result of deliberate calibration — not defaults. Worth capturing as a named system so the team stops guessing hover scale factors and scroll entrance offsets.
**Source evidence:** `html.html` — `.product-card:hover .product-card__image img` transform rule; `@keyframes fadeInUp` definition; `.carousel__track` transition; `.btn` transition declarations; `motion-config.md` full easing table.
**Key params:**
- Image hover: `scale(1.04)` at `400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- Scroll entrance: `translateY(24px) → 0` + `opacity 0→1` at `600ms`
- Dropdown: `translateY(-8px) → 0` + `opacity` at `200ms ease-out`
- Button: `background-color` at `150ms ease-out`
**Reis IA adaptation note:** These values work directly on dark backgrounds. The scroll entrance can gain a `filter: blur(1px) → blur(0)` micro-addition for extra depth on dark surfaces.

---

### `patterns/color/warm-neutral-anchor-palette.md`
**Why:** The Bliss & Bone neutral scale (ivory → cream → linen → sand → taupe → charcoal) is a masterclass in warm-cast neutral construction. Every step reads as a material — paper, parchment, linen, suede — rather than as a grey. The warmth comes from the undertone (~15° hue shift toward yellow-orange). This palette anchors light-mode sections and can frame dark-mode content with warmth rather than coldness.
**Source evidence:** `html.html` `:root` block — `--color-ivory: #F7F4EE` through `--color-charcoal: #2C2822`. `design-tokens.md` Primary Site Chrome table.
**Key params:** Full 11-step scale from `#FFFFFF` to `#1A1713`. Every step maintains ~10–15° warm undertone. No cool greys.
**Reis IA adaptation note:** Reis IA uses pure black (#000000) and white (#FFFFFF). The warm neutral scale is a controlled departure from pure neutrals — usable for paper/print contexts (wedding sub-project) or for any section that needs warmth without introducing a brand color.

---

## Priority 2 — High Value, Requires Typography Asset Decision

### `patterns/typography/serif-script-name-treatment.md`
**Why:** The systematic pairing of ALL CAPS high-contrast display serif with calligraphic script italic for connector words is Bliss & Bone's defining typographic signature. It creates the impression of custom hand-lettering at the cost of two font files. The rule is strict: connector words ("and", "of", "&") are always in the script/italic voice; names are always in the structured serif voice. This creates predictable, scalable elegance.
**Source evidence:** `html.html` — `.names__connector` rule; `design-tokens.md` Typography Patterns A–E. Visible in CDN images: `navigation-logos-and-monograms-01` (agatha & LOGAN), feature-06 (Cecilia and James), feature-07 (April & Wilson), feature-08 (Vivienne Nash).
**Key params:** Display serif at `font-weight: 300`, `text-transform: uppercase`, `letter-spacing: 0.04em`; Script at `font-style: italic`, `font-weight: 300–400`, no text-transform.
**Dependency:** Requires a calligraphic script font. For Reis IA: not directly applicable (Inter has no script variant). Applicable to the wedding sub-project (moroniedaphine) where Fraunces is already in use.

---

### `patterns/cards/invitation-card-5-7.md`
**Why:** The 5:7 portrait card is a self-contained composition system. It defines how typography, botanical elements, and color palettes interact within a constrained vertical rectangle. The flat corners (zero border-radius) are essential — they signal physical print authenticity. The shadow system (`0 12px 40px rgba(0,0,0,0.14)`) creates physical lift without distraction. This is a reusable card shell for any context requiring editorial portrait cards.
**Source evidence:** `html.html` — `.invitation-card` ruleset, `.invitation-card--dark` variant, `.invitation-card__text`, `.invitation-card__names`. Visible in every CDN product image across the harvest.
**Key params:** `aspect-ratio: 5/7`, `border-radius: 0`, `box-shadow: 0 12px 40px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.06)`, padding `var(--space-8)`.
**Reis IA adaptation note:** Could be adapted for content cards in the wedding sub-project or as a general "premium portrait card" pattern for editorial landing page sections.

---

## Priority 3 — Worth Capturing, Lower Immediate Urgency

### `patterns/overlays/circular-text-badge.md`
**Why:** A 160px circle with 1px border at 50% opacity, name running along the arc via SVG `<textPath>`, date centered in italic serif. A fully self-contained typographic composition that reads as a physical wax seal or embossed monogram. Works on dark photo backgrounds, dark solid backgrounds, and cream surfaces equally. Zero background fill makes it adaptable.
**Source evidence:** `html.html` — `.circular-badge`, `.circular-badge__text`, `.circular-badge__date` rules. CDN image: `bliss-and-bone-feature-04` (Amber & Elgin dark botanical laptop hero).
**Key params:** `width: 160px`, `height: 160px`, `border: 1px solid rgba(255,255,255,0.5)`, `border-radius: 50%`. Text on arc: SVG `<textPath>` with `font-size: 0.5rem`, `letter-spacing: 0.2em`, `text-transform: uppercase`.

---

### `patterns/botanical/shadow-cast-composition.md`
**Why:** Botanical elements (eucalyptus, palm fronds, pampas grass) appear in frame but partially cropped, leaving only their cast shadow on warm neutral surfaces. This adds organic depth without botanical illustration. The technique is photography-based — it requires a styled photograph, not SVG. Worth documenting because the visual effect is unique and not achievable with pure CSS.
**Source evidence:** CDN images: `printed-wedding-invitations-01` (pampas grass at right edge of Elodie & Beckett card), `examples-of-wedding-websites-thumb` (eucalyptus leaves right-cropped on laptop mockup lifestyle shot), `navigation-logos-and-monograms-01` (palm shadow on cream card background).
**Key params:** Element position: right or bottom edge, 5–15% out of frame. Shadow softness: medium (not hard cast). Background: warm neutral `#EDE9E0`–`#F7F4EE`. Photography, not CSS.

---

### `patterns/backgrounds/material-surface-simulation.md`
**Why:** Backgrounds treated as physical materials (marble, linen, parchment, silk fabric, aged paper) rather than flat fills. The warmth and texture of these backgrounds is what makes typography on them feel grounded rather than floating. Even the cobalt blue in the April & Wilson design has material richness — it reads like deep dyed indigo paper, not a hex value.
**Source evidence:** `html.html` — `.bg-marble`, `.bg-linen`, `.bg-parchment` class comments; `design-tokens.md` Texture / Material Tokens table. CDN images: feature-08 (dark satin/silk), feature-04 (warm taupe marble), `modern-wedding-invitations-thumb` (marble white card stack).
**Key params:** Base color + texture PNG overlay at 3–6% opacity + subtle radial gradient for material depth. Mix-blend-mode: multiply for texture overlays on light backgrounds.

---

### `patterns/layout/device-mockup-floating-group.md`
**Why:** Compositing iMac + MacBook + iPad + iPhone + physical cards in a single feature section without rigid grid alignment. Devices overlap, cards lean at subtle angles, the group has visual mass. This demonstrates cross-platform design consistency more convincingly than isolated screenshots and doubles as premium product photography.
**Source evidence:** `html.html` — `.mockup-group`, `.mockup-desktop`, `.mockup-laptop`, `.mockup-phone`, `.mockup-card` rules. Visible in every feature CDN image (feature-06 through feature-08, feature-04, feature-01).
**Key params:** Desktop: 60% width, 16:10 aspect. Laptop: 55% width, 16:10 aspect. Phone: 22% width, 9:19 aspect. Card: 18% width, 5:7 aspect. Shadow: `var(--shadow-float)` on screens, `var(--shadow-lifted)` on cards. Slight rotation (1–3deg) on physical cards.

---

## Cross-Reference with Reis IA Design System

### Compatible patterns (can be adopted without conflict)
- `dark-botanical-photo-overlay` — fits dark mode default, warm overlay stays within brand neutrals
- `ultra-light-display-headline` — Inter 300 already in system, just needs formalized token usage
- `css-only-luxury-transitions` — stack-agnostic, pure CSS, no conflicts
- `warm-neutral-anchor-palette` — usable in light sub-sections, wedding sub-project, print materials

### Incompatible patterns (do not adopt for Reis IA core)
- `serif-script-name-treatment` — calligraphic script is incompatible with Inter-only system. Wedding sub-project only.
- `invitation-card-5-7` — the 5:7 portrait format and warm paper palette conflict with Reis IA's geometric dark minimal aesthetic. Wedding sub-project only.
- `botanical/shadow-cast-composition` — botanical/organic motifs conflict with Reis IA's architectural geometric visual language. Wedding sub-project only.
- `material-surface-simulation` — warm linen/parchment textures conflict with Reis IA's clean dark surfaces. Do not adopt.

### Requires art-director review before adopting
- `circular-text-badge` — the circular composition is adaptable (the hourglass motif could replace the name arc), but needs art-director sign-off to ensure it doesn't conflict with the H1-B mark.
- `device-mockup-floating-group` — useful for Reis IA product showcase sections, but the physical card element must be replaced. Art director needs to define which Reis IA artefacts replace the invitation card in the composition.
