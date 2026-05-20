# AwSales Motion Configuration
## Extracted: 2026-04-26
## Source: https://www.awsales.io/
## Stack: Framer (motion library bundled)

---

## Detected Motion Stack

| Library | Detected | Evidence |
|---------|----------|---------|
| **Framer Motion** | YES | `motion.mZcHFMke.mjs` preloaded, `data-framer-appear-animation`, `will-change: transform` patterns |
| GSAP | NO | No evidence in HTML or linked scripts |
| ScrollTrigger | NO | Not detected |
| Three.js | NO | Not detected |
| Lenis | NO | Not detected |
| Lottie | NO | Not detected |
| CSS @keyframes | NO | None found in extracted CSS |
| Custom WebGL | NO | Not detected |
| Canvas 2D | NO | Not detected |

**Motion runtime**: Framer's bundled Motion library (based on Framer Motion / Motion One). All animation is driven by the Framer site runtime, not handwritten JS.

---

## Framer Motion Bundle

```
https://framerusercontent.com/sites/4cxf12hdaNlk9dJpSAVk6V/motion.mZcHFMke.mjs
https://framerusercontent.com/sites/4cxf12hdaNlk9dJpSAVk6V/framer.CgPNa4cd.mjs
https://framerusercontent.com/sites/4cxf12hdaNlk9dJpSAVk6V/script_main.B3muni5q.mjs
```

---

## Scroll-Triggered Entrance Animations

### Config: `data-framer-appear-animation`
```
Value: "no-preference"
```
This means: respect `prefers-reduced-motion`. If user has no preference (standard), full animation plays.

### Initial State (pre-animation)
```css
opacity: 0;
transform: translateY(30px);
```
Elements slide up from 30px below their final position while fading in. Applied to:
- Meta Partner card (`framer-jtzv63-container`)
- Case study cards
- Testimonial cards
- Section headings

### Easing
Not explicitly in CSS — handled by Framer runtime. Based on Framer defaults: likely `ease-out` or `cubic-bezier(0.4, 0, 0.2, 1)` with ~0.5s duration.

---

## Hero Conic Arc Spinning Animation

This is the signature visual element — two conic-gradient circles that rotate. The CSS is:

```css
/* Outer arc (cyan segment clockwise) */
.framer-8mo5vd {
  background: conic-gradient(#121212 53.5135deg, #079ed6 360deg);
  border-radius: 422px;
  width: 833px;
  height: 833px;
  filter: blur(3px);
  will-change: var(--framer-will-change-override, transform);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Inner arc (inverted — cyan on different side) */
.framer-70kzve {
  background: conic-gradient(#079ed6 61.6216deg, #121212 264.324deg);
  border-radius: 422px;
  width: 746px;
  height: 746px;
  filter: blur(3px);
  will-change: var(--framer-will-change-override, transform);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Dark masking discs (cut out inner area, reveal only arc) */
.framer-z4fkoi {
  background-color: #070c14;
  border-radius: 422px;
  width: 832px;
  height: 832px;
  /* sits between outer arc and inner arc */
}
.framer-11vbkww {
  background-color: #070c14;
  border-radius: 422px;
  width: 744px;
  height: 744px;
}
```

**Mechanism**: The Framer runtime applies a `rotate` transform animation to `.framer-8mo5vd` and `.framer-70kzve`, spinning them at different speeds/directions. The dark masking discs cut out the center, leaving only a thin glowing arc visible. `filter: blur(3px)` softens the hard conic edge.

**To replicate in CSS**:
```css
@keyframes spin-slow {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to   { transform: translate(-50%, -50%) rotate(360deg); }
}
@keyframes spin-reverse {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to   { transform: translate(-50%, -50%) rotate(-360deg); }
}

.outer-arc {
  animation: spin-slow 8s linear infinite;
}
.inner-arc {
  animation: spin-reverse 6s linear infinite;
}
```

---

## Hero Section Animated Elements

### Rotating/Changing Text
Component name `framer-uah5e7-container` with dimensions `1440px × 306px` — this is the Framer component that handles text rotation/morphing in the hero. Exact animation type is a Framer interactive component (not visible in static HTML).

Component names observed: `"XL Tagless"`, `"tab content"` — suggesting a tabbed or rotating text display.

### Logo Carousel
```css
.framer-1lvrv9c {
  width: 979px;
  height: 110px;
  overflow: hidden;
}
.framer-1k3081s {
  /* Positioned text row */
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
```
The wide image `w0ioHyydset4wuanwxCVaGgPLs.png` (30626×5014px) — a very wide sprite sheet of logos — is likely animated horizontally using CSS `translateX` or Framer's built-in marquee. The `overflow: hidden` container clips to create the infinite scroll illusion.

**Logo sprite sheet URL**:
```
https://framerusercontent.com/images/w0ioHyydset4wuanwxCVaGgPLs.png
```
Dimensions: 30626×5014px — contains all client logos in a horizontal strip.

---

## Separator Lines (Shimmer Effect)

```css
.framer-qinb25, .framer-1su51bj, etc. {
  background: linear-gradient(
    90deg,
    #ffffff05 0%,     /* transparent */
    #ffffff1a 50%,    /* 10% white at center */
    #ffffff05 100%    /* transparent */
  );
  height: 1px;
  max-width: 1300px;
  width: 100%;
}
```
These 1px horizontal lines fade in from the edges, creating an elegant section divider. Static in the HTML, potentially with an animation on scroll via Framer.

---

## CTA Button Arrow Animation

The CTA button `"Começar Agora"` has a right-side arrow icon in a 33×33px container:
```css
.framer-179pgyw-container,
.framer-192tg4t-container {
  flex: none;
  width: 33px;
  height: 33px;
  position: relative;
}
```
Likely has a hover animation (translateX on the arrow). Framer runtime handles this.

---

## Meta Partner Card Blur Blobs

```css
/* Two colored PNG blobs, blurred 100px to create background wash */
.framer-11neicu, .framer-1i0kz8z {
  filter: blur(100px);
  -webkit-filter: blur(100px);
  will-change: transform;
  opacity: 1;
  transform: none;
}
```
**Images used**:
- `nLeHcY6hTYnGZSbJxzCgB9CvFOw.png` (282×286px) — Blur_1 blob
- `PBvpW9iBXWsz9gVkC6z99WDxCo.png` (422×424px) — Blur_2 blob

These are colored abstract shapes blurred to near-formlessness to create subtle background color washes. Much lighter than rendering gradients directly — browsers can GPU-composite blurred images efficiently.

---

## Will-Change Strategy

```css
/* Default: no will-change speculation */
--framer-will-change-override: none;

/* Safari (Chrome on iOS) fallback */
@supports (background: -webkit-named-image(i)) and (not (grid-template-rows: subgrid)) {
  body { --framer-will-change-override: transform; }
}

/* Elements that animate */
will-change: var(--framer-will-change-override, transform);
/* = will-change: transform on Safari, will-change: none on other browsers */
```
Smart GPU layer promotion: only promote on Safari where it helps, avoid unnecessary layer creation on Chrome/Firefox.

---

## Counter Animation (Number Stats)

Numbers like `R$1.940.378,00`, `9.95x ROI`, `+35 mil leads` likely animate via Framer's number-counting component. In the static HTML these render as final values. The Framer component (`framer-uah5e7-container` or similar) handles the count-up on scroll entry.

No custom JS implementation detected — fully Framer runtime.

---

## Framer Appear System Summary

```
data-framer-appear-animation="no-preference"
```

This is Framer's built-in scroll-triggered entrance system. It:
1. Registers an `IntersectionObserver` on each element with this attribute
2. On first intersection, applies the `animate` variant (fade-up from opacity:0 + translateY(30px))
3. Respects `prefers-reduced-motion: reduce` via the `no-preference` value
4. One-shot (does not repeat on scroll-up)
