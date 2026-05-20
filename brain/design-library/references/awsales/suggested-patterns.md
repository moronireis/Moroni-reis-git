# AwSales — Suggested Patterns for Distillation
## Extracted: 2026-04-26
## Source: https://www.awsales.io/
## For orchestrator approval before moving to brain/design-library/patterns/

---

## Pattern Proposals

Each entry below is a concrete distillation candidate. Format: path — why — source reference in html.html — REIS [IA] compatibility assessment.

---

### 1. `patterns/motion/conic-arc-spinner.md`

**What**: Two counter-rotating conic-gradient circles (833px outer, 746px inner) with dark masking discs cut out of the center, producing a thin glowing arc halo. `filter: blur(3px)` softens hard conic edges.

**Why**: Highest-value technique in the harvest. Achieves a complex holographic 3D-ring visual with zero JS dependencies — pure CSS conic-gradient + CSS rotation animation. Signals AI/tech instantly. The blur+mask approach means the visual quality is resolution-independent and GPU-composited.

**Source reference** (html.html): CSS classes `.framer-8mo5vd`, `.framer-70kzve`, `.framer-z4fkoi`, `.framer-11vbkww` in style block 3. Search `conic-gradient(#121212 53.5135deg`.

**REIS [IA] compatibility**: HIGH. Replace `#079ed6` cyan with `#4A90FF` (REIS [IA] primary blue). Replace `#121212` dark segments with `#000000`. Drop into hero or section background. No conflict with existing design system. Hourglass motif could be layered on top.

**Implementation sketch**:
```css
.arc-spinner-outer {
  background: conic-gradient(#000 54deg, #4A90FF 360deg);
  border-radius: 50%;
  width: 600px; height: 600px;
  filter: blur(3px);
  animation: spin-cw 10s linear infinite;
}
.arc-mask-outer {
  background: #000; /* match page bg */
  border-radius: 50%;
  width: 598px; height: 598px;
}
.arc-spinner-inner {
  background: conic-gradient(#4A90FF 62deg, #000 264deg);
  border-radius: 50%;
  width: 520px; height: 520px;
  filter: blur(3px);
  animation: spin-ccw 7s linear infinite;
}
.arc-mask-inner {
  background: #000;
  border-radius: 50%;
  width: 518px; height: 518px;
}

@keyframes spin-cw  { to { transform: translate(-50%,-50%) rotate(360deg); } }
@keyframes spin-ccw { to { transform: translate(-50%,-50%) rotate(-360deg); } }
```

---

### 2. `patterns/backgrounds/hero-radial-depth-glow.md`

**What**: Single `radial-gradient` applied to hero section background, emanating from bottom center. Creates a stage-lighting effect — content appears lit from below, background feels atmospheric rather than flat.

**Why**: One CSS line that transforms a flat dark background into a cinematic composition. The key insight is using the dark navy `#102240` (not white/blue) as the glow color — the result is subtle and premium, not garish.

**Source reference** (html.html): CSS class `.framer-j2jhl1`. Search `radial-gradient(50% 50% at 50% 100%,#102240`.

**REIS [IA] compatibility**: HIGH. Direct drop-in. Replace `#102240` with a dark variant of `#4A90FF` (e.g. `#0a1a3a`) for REIS [IA] blue tint. Works with existing dark-mode default.

**Implementation**:
```css
.hero {
  background: radial-gradient(
    50% 50% at 50% 100%,
    #0a1a3a 0%,   /* dark blue glow */
    #000000 100%  /* page bg */
  );
}
/* Tablet/mobile variant — wider spread */
@media (max-width: 1199px) {
  .hero {
    background: radial-gradient(
      50% 88% at 48.2% 100%,
      #0a1a3a 0%,
      #000000 100%
    );
  }
}
```

---

### 3. `patterns/buttons/conic-gradient-pill-cta.md`

**What**: Pill-shaped CTA button using a conic-gradient that simulates a sphere surface. The gradient origin is placed above and to the left of center (`at 53.6% -18.1%`), making it appear as a light source hitting a convex surface.

**Why**: Differentiates a CTA from flat colored buttons without being garish. The three-stop conic (light blue → primary blue → dark slate) reads as 3D without any shadows or borders. Pairs with a right-arrow icon in a circular container.

**Source reference** (html.html): CSS classes `.framer-s5leds`, `.framer-7s76qa`. Search `conic-gradient(from 0deg at 53.6%`.

**REIS [IA] compatibility**: HIGH. Replace the three stops with REIS [IA] blue scale: `#6AADFF → #4A90FF → #0d1f40`. The pill shape (`border-radius: 200px`) and asymmetric padding (`15px 30px 15px 40px`) are directly adoptable.

**Implementation**:
```css
.cta-button {
  background: conic-gradient(
    from 0deg at 53.6% -18.1%,
    #6AADFF 108deg,
    #4A90FF 169.2deg,
    #0d1f40 262.8deg
  );
  border-radius: 200px;
  padding: 15px 30px 15px 40px;
  height: 57px;
  display: flex;
  align-items: center;
  gap: 0;
}
```

---

### 4. `patterns/cards/credential-card-light-on-dark.md`

**What**: A light-background card placed on a dark page. Uses `linear-gradient(130deg, #f8f9fe 20%, #c8d3e3 100%)` as card background, `border-radius: 23px`, and two extreme-blur colored PNG blobs (`filter: blur(100px)`) inside for background color wash. Creates maximum visual contrast as a focal point for credentials/badges.

**Why**: The inversion of light-on-dark is a powerful attention mechanism. The blur-blob technique for the card background is more visually complex than a flat color or CSS gradient, yet GPU-efficient. Directly applicable to REIS [IA] partnership badges (Meta, partnerships, certifications).

**Source reference** (html.html): `data-framer-name="Meta Partner"` section, classes `.framer-1qpsvqy`, `.framer-11neicu`, `.framer-1i0kz8z`. Search `White Bg` data-framer-name.

**REIS [IA] compatibility**: MEDIUM-HIGH. The light card clashes with dark-mode default but that's exactly the point — use sparingly for credential display only. Replace the blue-gray gradient with a white-to-light-blue variant compatible with REIS [IA] palette. Badge text color `rgb(72, 94, 121)` maps to a muted REIS [IA] blue.

**Implementation sketch**:
```css
.credential-card {
  background: linear-gradient(130deg, #f8f9fe 20%, #c8d3e3 100%);
  border-radius: 23px;
  padding: 40px;
  position: relative;
  overflow: hidden;
}
.credential-card__blur-blob {
  position: absolute;
  filter: blur(100px);
  pointer-events: none;
  /* Position colored PNG or div behind content */
}
/* Text inside card */
.credential-card p {
  color: rgb(72, 94, 121);
  font-size: 18px;
  line-height: 1.65em;
}
```

---

### 5. `patterns/shadows/penumbra-shadow-ladder.md`

**What**: Six-layer box-shadow system that simulates physically accurate light penumbra falloff. Each layer increases spread radius while decreasing opacity, matching how real shadows soften at distance.

**Why**: Single-layer shadows look flat and cheap. This technique makes any card or surface feel physically present. Already used across reference sites (Linear, Stripe, Vercel). The exact AwSales values are well-calibrated for dark-mode cards on near-black backgrounds.

**Source reference** (html.html): Classes `.framer-17huav0`, `.framer-1oantw1`, `.framer-1ohbuq`. Search `0.706592px`.

**REIS [IA] compatibility**: DIRECT. Drop in immediately. No color conflicts.

**Reusable token**:
```css
--shadow-card: 
  0 0.706592px 0.706592px -0.625px  rgba(0,0,0,0.149),
  0 1.80656px  1.80656px  -1.25px   rgba(0,0,0,0.141),
  0 3.62176px  3.62176px  -1.875px  rgba(0,0,0,0.141),
  0 6.8656px   6.8656px   -2.5px    rgba(0,0,0,0.129),
  0 13.6468px  13.6468px  -3.125px  rgba(0,0,0,0.102),
  0 30px       30px       -3.75px   rgba(0,0,0,0.051);
```

---

### 6. `patterns/separators/shimmer-divider-line.md`

**What**: 1px horizontal line with a center-bright, edge-transparent gradient. Appears to glow softly at center while fading into the background at edges. Used between major sections.

**Why**: Flat borders (`border-bottom: 1px solid`) look crude on dark backgrounds. This gradient line reads as light reflecting off a surface, consistent with the stage-lighting metaphor of the overall design. Zero performance cost.

**Source reference** (html.html): Classes `.framer-qinb25`, `.framer-1su51bj`, `.framer-dcbfqc`, `.framer-gjap3b`. Search `#ffffff05 0%,#ffffff1a 50%`.

**REIS [IA] compatibility**: DIRECT. The 3%→10%→3% white gradient works on any dark background.

```css
.section-divider {
  width: 100%;
  max-width: 1300px;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.02) 0%,
    rgba(255,255,255,0.10) 50%,
    rgba(255,255,255,0.02) 100%
  );
}
```

---

### 7. `patterns/carousels/fade-edge-logo-marquee.md`

**What**: Infinite horizontal logo marquee using a wide sprite-sheet image, with gradient overlay masks at both left and right edges that fade the logos into the page background color.

**Why**: Raw logo carousels that cut off sharply at container edges look unpolished. The gradient mask creates the illusion that logos emerge from and dissolve back into the page — seamless infinite scroll. AwSales uses a 30626px wide PNG strip as the logo source.

**Source reference** (html.html): Class `.framer-1lvrv9c` (979×110px container), `.framer-wekxj5` and `.framer-1wkn8dv` (fade overlay elements). The sprite: `w0ioHyydset4wuanwxCVaGgPLs.png`.

**REIS [IA] compatibility**: HIGH. Replace logo strip with REIS [IA] client logos. Match gradient color to `#070c14` (or REIS [IA] section background). Animation speed to be calibrated.

```css
.logo-marquee-wrapper {
  position: relative;
  overflow: hidden;
  width: 100%;
}
.logo-marquee-fade-left,
.logo-marquee-fade-right {
  position: absolute;
  top: 0; bottom: 0;
  width: 120px;
  z-index: 1;
  pointer-events: none;
}
.logo-marquee-fade-left {
  left: 0;
  background: linear-gradient(90deg, #000 0%, transparent 100%);
}
.logo-marquee-fade-right {
  right: 0;
  background: linear-gradient(270deg, #000 0%, transparent 100%);
}
.logo-marquee-track {
  display: flex;
  animation: marquee 30s linear infinite;
}
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```

---

### 8. `patterns/backgrounds/blur-blob-background-wash.md`

**What**: Colored abstract PNG images positioned inside a container and blurred 100px via CSS `filter: blur()`. Creates a soft, multi-hue background color wash without complex CSS gradient stacking. GPU-composited via will-change.

**Why**: Complex multi-stop gradients are computationally expensive when animated or layered. Blurred colored images achieve the same visual result with better GPU performance — the browser composite layer handles the blur, not the CSS paint step. Used inside the Meta Partner card and potentially behind other premium sections.

**Source reference** (html.html): Classes `.framer-11neicu` (Blur_1), `.framer-1i0kz8z` (Blur_2). Images: `nLeHcY6hTYnGZSbJxzCgB9CvFOw.png`, `PBvpW9iBXWsz9gVkC6z99WDxCo.png`. Search `filter:blur(100px)`.

**REIS [IA] compatibility**: HIGH. Create REIS [IA]-colored blob PNGs (electric blue + dark navy shapes) and blur them inside hero or CTA card sections. Replace PNG blobs with CSS `background-color` divs for a code-only version.

```css
.blur-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  -webkit-filter: blur(100px);
  will-change: transform;
  pointer-events: none;
  opacity: 0.6;
}
.blur-blob--blue {
  background: #4A90FF;
  width: 400px; height: 400px;
  top: -100px; right: -100px;
}
.blur-blob--navy {
  background: #102240;
  width: 300px; height: 300px;
  bottom: -50px; left: -50px;
}
```

---

## Priority Order for Distillation

1. **IMMEDIATE** — `penumbra-shadow-ladder` (direct drop-in, zero risk)
2. **IMMEDIATE** — `shimmer-divider-line` (direct drop-in, zero risk)
3. **HIGH** — `hero-radial-depth-glow` (one CSS line, high impact)
4. **HIGH** — `conic-gradient-pill-cta` (differentiates REIS [IA] CTAs immediately)
5. **MEDIUM** — `conic-arc-spinner` (complex but high visual impact for hero/demo sections)
6. **MEDIUM** — `blur-blob-background-wash` (needs asset creation)
7. **MEDIUM** — `credential-card-light-on-dark` (limited use cases — badge/partner display only)
8. **LOW** — `fade-edge-logo-marquee` (useful when REIS [IA] has a social proof logo section)
