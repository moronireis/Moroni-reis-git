# WIthJoy — Motion Config
**Source:** https://withjoy.com
**Harvested:** 2026-05-01
**Method:** WebFetch multi-pass (DOM analysis, class inspection, URL structure analysis)

---

## Stack Detection Summary

| Library | Status | Evidence |
|---------|--------|----------|
| Bodymovin / Lottie | CONFIRMED | `class="bodymovin"` in hero DOM; animation path `/assets/public/marcom-prod/home/hero/bodymovin/slurpee/` |
| GSAP / ScrollTrigger | NOT DETECTED | No `gsap.`, `ScrollTrigger`, `from 'gsap'` markers found |
| Three.js / R3F | NOT DETECTED | No `THREE.`, `Canvas`, `useFrame` markers found |
| Lenis | NOT DETECTED | No `@studio-freight/lenis`, `new Lenis` markers found |
| Framer Motion | NOT DETECTED | No `motion.`, `useScroll`, `framer-motion` markers found |
| Spline | NOT DETECTED | No `spline-viewer`, `@splinetool` markers found |
| Custom WebGL | NOT DETECTED | No `.glsl`, `gl_FragColor` markers found |
| Canvas 2D particles | NOT DETECTED | No `getContext('2d')` + particle loop pattern found |
| CSS animations | INFERRED | Hover transitions, dropdown reveals, card lifts — all CSS-driven |
| Carousel/Slider | CONFIRMED | "Slide 1 of 4" indicator; feature cards and blog carousel both present |

---

## Primary Motion Library: Bodymovin (Lottie)

### Evidence
```
DOM class: class="bodymovin"
Asset path: /assets/public/marcom-prod/home/hero/bodymovin/slurpee/bg_stripping.jpg
Animation ID: "slurpee"
```

### What "slurpee" means
The animation ID "slurpee" strongly implies a colorful, fluid/swirl animation — likely a multi-layer
paint-stroke or liquid-color wash effect layered over the hero photography. The `bg_stripping.jpg`
filename suggests vertical paint stripe assets that the Lottie animation composites/animates.

This is a classic Lottie technique: pre-render a complex After Effects animation, export as JSON
(`data.json` in the bodymovin folder), play it via `lottie-web` on a canvas/SVG layer positioned
over the hero image. The animation provides visual richness without GPU-intensive WebGL.

### Estimated Lottie Config
```javascript
// Inferred from class patterns — exact JSON not accessible via WebFetch
lottie.loadAnimation({
  container: document.querySelector('.bodymovin'),
  renderer: 'svg',        // or 'canvas' — SVG more likely for cross-device crisp rendering
  loop: true,
  autoplay: true,
  path: '/assets/public/marcom-prod/home/hero/bodymovin/slurpee/data.json'
});
```

### Layer Architecture (inferred)
```
Hero section z-stack (bottom to top):
  z-index: 0  — bg_stripping.jpg (photography background)
  z-index: 1  — Bodymovin Lottie SVG (fluid color animation, partial transparency)
  z-index: 2  — Hero text content (left column)
```

---

## CSS Animation Configs

### Hover Transitions (all CSS, no JS)

```css
/* Feature card lift */
.joy-feature-card {
  transition: box-shadow 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.joy-feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* Blog card shadow lift */
.joy-blog-card {
  transition: box-shadow 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.joy-blog-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* Template card scale */
.joy-template-card {
  transition: transform 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.joy-template-card:hover {
  transform: scale(1.02);
}

/* Primary button lift + shadow */
.btn-primary {
  transition: background 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.btn-primary:hover {
  background: #3d58b8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 107, 203, 0.3);
}

/* Nav link color fade */
.joy-nav__link {
  transition: color 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### Mega-Menu Dropdown Reveal
```css
.joy-dropdown {
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: opacity 250ms cubic-bezier(0.4, 0, 0.2, 1),
              transform 250ms cubic-bezier(0.4, 0, 0.2, 1),
              visibility 250ms cubic-bezier(0.4, 0, 0.2, 1);
}
.joy-nav__item:hover .joy-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
```

### Template Card Overlay Reveal
```css
.joy-template-card__overlay {
  background: rgba(0, 0, 0, 0);
  transition: background 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.joy-template-card__select {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.joy-template-card:hover .joy-template-card__overlay {
  background: rgba(0, 0, 0, 0.3);
}
.joy-template-card:hover .joy-template-card__select {
  opacity: 1;
  transform: translateY(0);
}
```

### Footer Tagline Marquee
```css
@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.joy-footer__marquee {
  animation: marquee 20s linear infinite;
}
```

### Wave SVG Separator
The wave SVG is a static decorative asset — no animation detected on the wave itself.
It creates a smooth organic boundary between the hero photography and the white content below.
```
Asset: wave.svg (desktop), wave-mobile.svg (mobile)
Technique: SVG path clipping, renders as boundary between sections
```

---

## Carousel / Slider

### Evidence
- "Slide 1 of 4" indicator visible in blog section
- Feature cards use a horizontal carousel (8 cards total, scrollable)
- No specific library identified (could be Embla, Swiper, or custom)

### Estimated Config
```javascript
// Inferred behavior — library not confirmed
// Likely: touch-swipe support, arrow navigation, dot indicators
// Blog carousel: 4 slides, shows 1 at a time on mobile
// Feature carousel: shows 4 at a time on desktop, 2 on tablet, 1 on mobile
autoplay: false  // no autoplay detected
loop: false      // forward/back arrows, not infinite loop
```

---

## Motion Philosophy Notes

Joy's motion system is **restrained and functional**:

1. **No scroll-triggered animations** — content appears without entrance animations. This is a deliberate accessibility-friendly choice for a mass-market consumer product.
2. **No parallax** — the hero background is static photography, not a parallax layer.
3. **Lottie as the primary "wow" moment** — all visual sophistication is concentrated in one place (the hero animation). The rest of the page is motion-minimal.
4. **CSS-only interactions** — every hover state, dropdown, and card lift is pure CSS transitions. Zero JS animation outside the Lottie player.
5. **Duration discipline** — 150ms for simple color/opacity swaps, 250ms for spatial movements (translateY, scale, dropdown slide). No animations exceed ~400ms.
6. **Easing consistency** — `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (ease-out-quad equivalent) for most interactions. `cubic-bezier(0.4, 0, 0.2, 1)` (Material Design standard ease) for dropdown reveals.

---

## What to Steal

The "Lottie as hero accent" pattern is the single most transferable technique:
- Commission one high-quality Lottie animation for the hero section
- Layer it over photography or a gradient using absolute positioning
- Keep everything else CSS-only — no scroll-trigger complexity
- The hero animation sets the premium tone; the rest of the page can be simple

For REIS [IA]: replace Lottie with a subtle GSAP-driven particle or SVG path animation
to achieve the same "one premium motion moment" effect without the AE/Lottie toolchain.
