# Avelã White — Motion Configuration
## Source: https://www.avelawhite.com/
## Extracted: 2026-05-01

---

## Motion Stack: NONE (Squarespace Native Only)

Avelã White does NOT use GSAP, Lenis, Three.js, Framer Motion, or custom WebGL.
All motion is implemented via:
1. Squarespace's built-in `block-animation` system (CSS-only)
2. Custom lightweight JS for gallery auto-scroll
3. CSS transitions on hover states

This is a finding worth noting: **a site that feels genuinely premium achieves it with zero motion JS libraries**. The luxury comes from typography, color, and restraint — not technical animation complexity.

---

## Library Detection Results

| Library           | Detected | Evidence |
|-------------------|----------|----------|
| GSAP              | NO       | 0 occurrences in 827KB source |
| ScrollTrigger     | NO       | 0 occurrences |
| SplitText         | NO       | 0 occurrences |
| Three.js          | NO       | 4 occurrences of "three" but none are THREE.js (false positive: "partner", "three packages") |
| Lenis             | NO       | 0 occurrences |
| Framer Motion     | NO       | 0 occurrences |
| React             | NO       | Pure Squarespace, no React |
| Custom WebGL      | NO       | No GLSL, no getContext('webgl') |
| Canvas 2D         | NO       | No getContext('2d') particle loops |
| Spline            | NO       | 0 occurrences |
| Intersection Observer | YES  | Via Squarespace `block-animation` system |
| CSS Animations    | YES      | tmpl-anim-* keyframe family |
| CSS Transitions   | YES      | 0.4s ease on gallery, nav, list items |

---

## Squarespace Animation System (Full Config)

### Entrance Animations (tmpl-anim family)
All triggered by Squarespace's IntersectionObserver-based `block-animation` system:

```css
/* 1. Fade Up — most common */
@keyframes tmpl-anim-fade-up {
  from, to {
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center center;
  }
  from {
    opacity: 0;
    transform: matrix(1, 0, 0, 1, 0, 25);   /* translateY(25px) */
  }
}
/* Duration: 800ms | Delay: 0.6s | Fill: both */

/* 2. Fade Scale Up */
@keyframes tmpl-anim-fade-scale-up {
  from, to {
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center center;
  }
  from {
    opacity: 0;
    transform: matrix(0.92, 0, 0, 0.92, 0, 0);   /* scale(0.92) */
  }
}

/* 3. Fade Stretch Up */
@keyframes tmpl-anim-fade-stretch-up {
  from, to {
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center 0;   /* NOTE: origin at top */
  }
  from {
    opacity: 0;
    transform: matrix(0.9, 0, 0, 1.3, 0, 25);   /* scaleX(0.9) scaleY(1.3) + translate */
  }
}

/* 4. Clip Reveal Vertical */
@keyframes tmpl-anim-clip-vertical-up {
  from, to {
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  from {
    clip-path: polygon(50% 0%, 100% 0%, 100% 0%, 50% 0%, 50% 100%, 0% 100%, 0% 100%, 50% 100%, 50% 100%, 50% 100%);
    /* collapsed to center line */
  }
  /* to: full polygon(0 0, 100% 0, 100% 100%, 0 100%) */
}

/* 5. Clip Reveal Horizontal (wipe from left) */
@keyframes tmpl-anim-clip-horizontal-left {
  from, to {
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  from {
    clip-path: polygon(0% 50%, 0% 100%, 0% 100%, 0% 50%, 100% 50%, 100% 0%, 100% 0%, 100% 50%, 100% 50%, 100% 50%);
    /* collapsed to center horizontal line */
  }
}
```

### Animation Configuration Values
```css
animation-duration: 800ms;           /* primary entrance */
animation-duration: 400ms;           /* fast interactions */
animation-duration: 2s;              /* loading/spinners */
animation-fill-mode: both;
animation-iteration-count: 1;        /* entrances play once */
animations-animation-delay: 0.6s;    /* entrance stagger */
animations-animation-duration: 0.9s; /* Squarespace template config */
```

### Primary Easing Curve
```css
cubic-bezier(0.4, 0, 0.2, 1)   /* Material Design standard ease */
```
This is Material Design's "standard" easing (fast out, slow in). Not custom — Squarespace default.

---

## CSS Transition Configs (Custom)

### Navigation Hover Fade
```css
/* ALL items fade to 50% when any item is hovered */
.header-nav-list:hover > .header-nav-item {
  opacity: 0.5;
}
.header-nav-list:hover > .header-nav-item:hover {
  opacity: 1;
}
/* Dropdown transition */
.header-nav-folder-content {
  transition: ease-in-out 0.5s;
}
```
**Pattern**: "Inactive dimming" — hovered item stays full opacity, ALL siblings fade to 50%.
This is a high-quality UX pattern used by luxury brands (Bottega Veneta, etc.).

### Gallery Image Hover
```css
.gallery-reel-item:hover img,
.gallery-reel-item.is-active img {
  transform: scale(1.02);
  transition: 0.4s ease;
}
.gallery-reel-item .gallery-caption,
.gallery-reel-item {
  opacity: 0.7;
  transition: opacity 0.4s ease;
}
.gallery-reel-item:hover {
  opacity: 1;
}
```
**Pattern**: Images default to 70% opacity, hover brings to 100% AND scale 1.02. Subtle warmth.

### Product List Item Hover
```css
.user-items-list-simple:hover .list-item {
  opacity: 0.4;   /* deep fade on siblings */
}
.user-items-list-simple:hover .list-item:hover {
  opacity: 1;
  transform: scale(1.03);
}
.user-items-list-simple .list-item {
  transition:
    transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    opacity 0.4s ease;
}
```
**Pattern**: Sibling items fade to 40% (very deep), hovered item scales to 1.03.
The cubic-bezier here is "ease-out" (fast start, slow end) — feels organic.

### Link Hover States
```css
/* Blog sections */
a h3:hover { color: #cbb7a7 !important; }   /* warm sand hover color */

/* Service list links */
section[...] p a { text-decoration: none; opacity: 0.7; }
section[...] p a:hover { text-decoration: none; opacity: 1; }
```

---

## Gallery Auto-Scroll (Custom JS)

```javascript
/* Lightweight gallery section auto scroller */
(function () {
  setAutoScroll({
    gallery: 1,
    direction: 2,    /* 2 = left-to-right */
    timing: 3000,    /* 3 seconds per step */
  });
})();
```

---

## Underline Slide Animation

```css
@keyframes underlineSlideOut {
  from { background-position: 0% bottom, 100% bottom; }
  to   { background-position: 200% bottom, 300% bottom; }
}
@keyframes underlineSlideIn {
  from { background-position: -200% bottom, -100% bottom; }
  to   { background-position: 0% bottom, 100% bottom; }
}
```
Uses CSS `background` with two gradient stops as a "sliding underline" — more elegant than `text-decoration-color` animation.

---

## Expanding Panels (WillMyersCode Plugin)
```css
div.wm-expanding-panels {
  --panel-height: 90vh;
  --mobile-panel-height: 40vh;
  --active-mobile-panel-height: 50vh;
  --active-width: 1.2;   /* expanded panel is 1.2x wider */
  --background-opacity: 0.9;
  --border-radius: 0px;
  --content-width: 60%;  /* desktop */
  --text-alignment: center;
  --vertical-alignment: center;
}

/* Inactive panel darkening */
div[data-wm-plugin="expanding-panels"] .wm-panel:not(.panel-active) {
  background-color: rgba(0, 0, 0, 0.1);
  background-blend-mode: darken;
}

/* Typography in expanded panels */
[data-wm-plugin="expanding-panels"] .title > * {
  font-size: 2.5em;
  text-transform: uppercase;
}
[data-wm-plugin="expanding-panels"] .vertical-title > * {
  font-size: 0em;   /* hidden when inactive */
  color: #fff;
  font-style: italic;
}
```

---

## Motion Philosophy (Design Observation)

Avelã White's motion is purely **CSS-native and restrained**. Key principles visible:

1. **Duration 400ms-800ms** — nothing faster than 400ms, nothing slower than 1s
2. **Opacity-based fading** preferred over position-based animations
3. **Micro-scale (1.02-1.03)** not macro-scale (1.1+) for hover
4. **Sibling dimming** is the main luxury signal in interactions
5. **No parallax, no scroll-linked motion, no WebGL** — the "premium" comes entirely from type and color restraint
6. **clip-path reveals** for content entrances (the most technical element)

This proves the pattern: luxury sites often achieve premium feel through **stillness and restraint**, not motion complexity.
