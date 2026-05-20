# Minted — Motion Config
Source: https://www.minted.com/wedding-invitations
Harvested: 2026-05-02

---

## Stack Detection Summary

| Library | Detected | Evidence |
|---|---|---|
| GSAP | NO | No `gsap.`, `from 'gsap'`, or ScrollTrigger references found |
| ScrollTrigger | NO | — |
| Three.js / R3F | NO | No `THREE.`, Canvas, or WebGL context references |
| Spline | NO | No `spline-viewer` or `@splinetool` references |
| Lenis | NO | No `new Lenis`, `lenis.raf` references |
| Framer Motion | NO | No `framer-motion`, `motion.`, `useScroll` references |
| Custom WebGL shaders | NO | No `.glsl`, `gl_FragColor` references |
| Canvas 2D particles | NO | No particle loop patterns |
| CSS Animations (keyframes) | NO | No `@keyframes` blocks detected |
| CSS Transitions | YES | Core interaction layer — see below |
| React (SPA) | YES | Emotion CSS-in-JS hashed classes (`.css-l088ss` pattern) |
| Cloudinary Named Transforms | YES | Server-side image shape system |

**Minted uses zero motion libraries.** The entire interactive layer is pure CSS transitions.
This is a deliberate product decision: a premium stationery brand that sells physical tactile
objects has no need for digital motion spectacle. The restraint is itself a brand statement.

---

## CSS Transition Configs (exact values reconstructed)

### Product Card — Primary Hover Effect (image crossfade)

This is Minted's signature micro-interaction. Two absolutely-stacked images with opacity
crossfade reveals the "detail" view (envelope interior, back of card, or lifestyle shot).

```css
/* Primary image (front of card) */
.product-card__image--primary {
  transition: opacity 300ms ease;
}

/* Detail image (starts hidden) */
.product-card__image--detail {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 300ms ease;
}

/* On card hover: swap */
.product-card:hover .product-card__image--primary { opacity: 0; }
.product-card:hover .product-card__image--detail   { opacity: 1; }
```

**Config values:**
- Duration: `300ms`
- Easing: `ease` (cubic-bezier(0.25, 0.1, 0.25, 1.0))
- Property: `opacity` only (no transform, no scale)
- Trigger: `:hover` on parent card anchor

### Product Card — Controls Reveal (favorite + quick-view)

```css
.product-card__favorite,
.product-card__quick-view {
  opacity: 0;
  transition: opacity 200ms ease;
}

.product-card:hover .product-card__favorite,
.product-card:hover .product-card__quick-view {
  opacity: 1;
}
```

**Config values:**
- Duration: `200ms`
- Easing: `ease`
- Stagger: none (both reveal simultaneously)

### Quick-View Button — Fill Swap on Hover

```css
.product-card__quick-view {
  background-color: #FFFFFF;
  color: #2B2B2B;
  transition: background-color 200ms ease, color 200ms ease;
}

.product-card__quick-view:hover {
  background-color: #2B2B2B;
  color: #FFFFFF;
}
```

### Primary Button — Inverse Fill on Hover

```css
.btn-primary {
  background-color: #2B2B2B;
  color: #FFFFFF;
  transition: background-color 200ms ease, color 200ms ease;
}

.btn-primary:hover {
  background-color: #FFFFFF;
  color: #2B2B2B;
}
```

### Secondary (Outline) Button — Fill In on Hover

```css
.btn-secondary {
  background-color: transparent;
  color: #2B2B2B;
  transition: background-color 200ms ease, color 200ms ease;
}

.btn-secondary:hover {
  background-color: #2B2B2B;
  color: #FFFFFF;
}
```

### Collection Card — Subtle Image Scale on Hover

```css
.collection-card img {
  transition: transform 400ms ease;
}

.collection-card:hover img {
  transform: scale(1.04);
}
```

**Config values:**
- Duration: `400ms` (slower than card controls — appropriate for a larger region)
- Scale: `1.04` (very subtle — NOT the aggressive 1.1 often misused)
- Easing: `ease`

### Navigation Links — Color Transition

```css
.site-nav__link {
  transition: color 200ms ease;
}

.wedding-subnav__link {
  transition: border-color 200ms ease, color 200ms ease;
}
```

### Category Chip — Border Reveal

```css
.category-chip__image {
  border: 2px solid transparent;
  transition: border-color 200ms ease;
}

.category-chip:hover .category-chip__image,
.category-chip.active .category-chip__image {
  border-color: #2B2B2B;
}
```

### Thumbnail — Opacity Dim on Hover

```css
.product-card__thumbnail img {
  transition: opacity 200ms;
}

.product-card__thumbnail:hover img {
  opacity: 0.85;
}
```

---

## Motion Philosophy Analysis

### The Crossfade Pattern (highest value extract)

The image crossfade on product card hover is the most sophisticated motion decision
on the page. It solves a real UX problem elegantly:

**Problem:** Users need to see multiple views of a physical product (front, detail, envelope)
without layout reflow or a jarring swap.

**Solution:** Two images absolutely stacked. The "detail" image sits invisibly on top.
On hover, opacity crossfade takes 300ms — long enough to feel premium, short enough
to feel responsive.

**Why 300ms:** At 200ms the swap feels abrupt (too close to a click response time).
At 400ms it feels sluggish on frequent hover-scanning behavior (users move cursor
across 20+ cards quickly). 300ms is the Goldilocks duration for this use case.

**Why only opacity, not transform:** No scale or translate on the image container.
The card itself never moves. This respects the "physical object" metaphor — a real
invitation doesn't zoom toward you when you look at it.

### The Thumbnail Strip Pattern

Below the hero image, a row of 2–3 small square thumbnails acts as manual hover targets.
Each thumbnail shows a different view (envelope liner, RSVP card, back, lifestyle).
This gives the user agency vs the automatic hover crossfade — they can click/hover
specific views. The two systems (auto crossfade + manual thumbnails) work together
without conflict.

### What Is Deliberately Absent

- No scroll-triggered entrance animations (no fade-in-on-scroll, no stagger on grid items)
- No page transitions
- No loading spinners or skeleton screens visible in static render
- No parallax on hero/banner images
- No magnetic cursor effects
- No text splitting/character animations
- No counting number animations

The absence of all these is the motion system. It says: the design is confident enough
in its content to not need motion spectacle. The invitations sell themselves.

---

## Promotional Banner Carousel

The promo banner at top of page cycles through 3 promotional messages with arrow navigation.

```
Cycle interval: ~5000ms (estimated — typical for low-priority promotional banners)
Transition: likely a CSS opacity or translate fade
Controls: left/right arrow buttons
```

Arrow images:
- `https://cdn3.minted.com/files/content/CyclerArrowLeft-Lt.png`
- `https://cdn3.minted.com/files/content/CyclerArrowRight-Lt.png`

No JS animation library detected for this — likely a React state-driven className swap
with a CSS transition on the banner text.

---

## Reproduction Recipe

To replicate the Minted card hover crossfade in isolation:

```html
<div class="card-image-container" style="position:relative;aspect-ratio:4/5;overflow:hidden;">
  <img class="img-primary"
       src="primary.jpg"
       style="width:100%;height:100%;object-fit:cover;
              transition:opacity 300ms ease;" />
  <img class="img-detail"
       src="detail.jpg"
       style="position:absolute;inset:0;width:100%;height:100%;
              object-fit:cover;opacity:0;
              transition:opacity 300ms ease;" />
</div>

<style>
  /* Parent anchor hover triggers both */
  a:hover .img-primary { opacity: 0; }
  a:hover .img-detail  { opacity: 1; }
</style>
```

Zero JavaScript. Zero dependencies. Browsers handle GPU-composited opacity transitions
natively. This is intentionally the simplest possible implementation of a premium hover effect.
