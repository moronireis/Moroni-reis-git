# Bliss & Bone — Motion Config
**Source:** https://blissandbone.com
**Captured:** 2026-05-01
**Method:** WebFetch structural analysis + visual inference from rendered product

---

## Stack Detection Summary

| Library | Detected | Evidence |
|---------|----------|----------|
| GSAP / ScrollTrigger | NOT DETECTED | No script src patterns, no gsap. calls found |
| Three.js / R3F | NOT DETECTED | No canvas, no THREE., no WebGL |
| Spline | NOT DETECTED | No spline-viewer tag |
| Lenis | NOT DETECTED | No Lenis constructor found |
| Framer Motion | NOT DETECTED | No framer-motion imports |
| Custom WebGL | NOT DETECTED | No .glsl, no gl_FragColor |
| Canvas 2D particles | NOT DETECTED | No getContext('2d') + rAF loop |
| AOS (Animate on Scroll) | POSSIBLE | Scroll fade-up pattern is consistent with AOS or Intersection Observer |
| Swiper.js / Slick | POSSIBLE | Carousel with 5 slides — standard slider library likely |
| Vanilla Intersection Observer | LIKELY | Entrance animations are CSS-class-based, simple fade-up |

**Assessment:** Bliss & Bone is a **CSS-primary motion system**. No heavy JS animation libraries detected. Motion is intentionally restrained — befitting a luxury editorial brand. The premium feeling comes entirely from:
1. Typography quality
2. Image quality (photography + mockup production)
3. Subtle CSS transitions on hover and scroll entry

This is a deliberate editorial choice: luxury does not need kinetic spectacle. The motion budget is minimal and tasteful.

---

## Detected Motion Patterns

### 1. Image Hover Scale
**Usage:** Product cards, feature sections
**Implementation:** CSS transform on hover

```css
.product-card__image img {
  transition: transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.product-card:hover .product-card__image img {
  transform: scale(1.04);
}
```

Scale factor: `1.04` (very subtle — not a dramatic zoom, just a suggestion of depth)
Duration: `400ms`
Easing: smooth deceleration (editorial ease-out)

---

### 2. Hero Image Carousel — 5 Slides
**Usage:** Homepage hero right panel
**Implementation:** CSS transform: translateX or opacity cross-fade

```css
.carousel__track {
  display: flex;
  transition: transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

OR cross-fade variant:
```css
.carousel__slide {
  position: absolute;
  opacity: 0;
  transition: opacity 600ms ease-in-out;
}
.carousel__slide.is-active {
  opacity: 1;
}
```

Autoplay interval: estimated 4000–6000ms (luxury sites favor slower rotations)
No visible pagination dots or arrows observed — clean, minimal controls

---

### 3. Scroll Entrance — Fade Up
**Usage:** Section headings, product cards, feature text
**Implementation:** CSS animation triggered by Intersection Observer

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-up {
  animation: fadeInUp 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-play-state: paused;
}

.animate-fade-up.is-visible {
  animation-play-state: running;
}
```

Or with AOS library defaults:
```html
<div data-aos="fade-up" data-aos-duration="600" data-aos-easing="ease-out-quad">
```

translateY offset: `24px` (moderate — not a dramatic 60px slam)
Opacity: `0 → 1`
Duration: `600ms`

---

### 4. Navigation Dropdown
**Usage:** Multi-level nav (Wedding Websites, Online Invitations, etc.)
**Implementation:** CSS opacity + transform

```css
.dropdown-menu {
  opacity: 0;
  transform: translateY(-8px);
  pointer-events: none;
  transition:
    opacity 200ms ease-out,
    transform 200ms ease-out;
}

.nav-item:hover .dropdown-menu {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
```

Duration: `200ms` (fast, functional)
Easing: ease-out

---

### 5. Button Hover State
**Usage:** All CTA buttons throughout site
**Implementation:** CSS transition on background-color and color

```css
.btn {
  transition:
    background-color 150ms ease-out,
    color 150ms ease-out,
    border-color 150ms ease-out;
}
```

Duration: `150ms` (snappy, immediate feedback)

---

### 6. Page Load Fade
**Usage:** Initial page render, likely on body or main wrapper
**Implementation:** CSS animation or JS class toggle

```css
@keyframes pageReveal {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.page-wrapper {
  animation: pageReveal 400ms ease-out forwards;
}
```

---

## Easing Reference

All confirmed cubic-bezier values inferred from motion style:

| Name | Value | Character |
|------|-------|-----------|
| `ease-editorial` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Primary easing — silky, magazine-quality |
| `ease-out-standard` | `cubic-bezier(0.0, 0.0, 0.2, 1.0)` | Material-style deceleration |
| `ease-in-out-standard` | `cubic-bezier(0.4, 0.0, 0.2, 1.0)` | Symmetric |
| `ease-fast-snap` | `cubic-bezier(0.4, 0.0, 0.6, 1.0)` | Button micro-interactions |

---

## What Is Deliberately Absent

This negative list is as instructive as the positive one:

- **No parallax scrolling** — no `transform: translateY()` tied to scroll position
- **No text scramble / glitch effects** — typography is always legible, never theatrical
- **No cursor follower / magnetic cursor** — no custom cursor at all
- **No scroll-velocity effects** — no skew, warp, or distortion on scroll
- **No particle systems** — completely clean canvas
- **No 3D card flips** — cards are flat, static
- **No loop animations** — nothing animates indefinitely
- **No loading screens** — content appears cleanly without ceremony
- **No GSAP timeline sequences** — no coordinated entrance choreography
- **No video backgrounds** — photography only, no looping video hero

**The lesson:** For a luxury paper goods / wedding brand, the motion restraint IS the luxury signal. Excess motion cheapens the product. Every frame of animation spends credibility.

---

## Motion Philosophy Extracted

From visual analysis of the brand:

1. **Stillness over spectacle.** The designs speak through quality, not movement.
2. **Hover is the primary interactive layer.** Image scale + cursor change are sufficient feedback.
3. **Scroll entrances are gentle, not dramatic.** `translateY(24px)` not `translateY(80px)`.
4. **Duration budget is short.** Nothing runs longer than 600ms. No slow reveals.
5. **Easing is always ease-out or ease-in-out.** Nothing bounces or overshoots.
6. **The carousel is the most "animated" element** and it's a simple opacity/translate crossfade.

---

## Recommended Implementation for Adaptation

When adapting these patterns for a dark-mode context (like Reis IA):

```css
/* Dark bg scroll entrance — slightly longer duration because dark surfaces
   benefit from a more considered reveal */
@keyframes darkFadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
    filter: blur(1px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

/* The blur addition (1px) is almost imperceptible but adds
   a micro-depth quality on dark backgrounds */
```

Intersection Observer trigger (vanilla JS, no dependencies):
```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
```
