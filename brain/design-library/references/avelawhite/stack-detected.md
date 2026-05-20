# Avelã White — Stack Detection
## Source: https://www.avelawhite.com/
## Extracted: 2026-05-01
## HTML source size: 827,146 bytes

---

## Platform

- [x] **Squarespace** (Fluid Engine — modern SQS grid system, confirmed by `<!-- This is Squarespace. -->` comment and `sqs-` class prefix throughout)
- [ ] Next.js / Astro / custom framework
- [ ] WordPress
- [ ] Webflow

---

## Motion Libraries

- [ ] GSAP
- [ ] GSAP ScrollTrigger
- [ ] GSAP SplitText
- [ ] GSAP Flip
- [ ] Three.js / React Three Fiber
- [ ] Lenis smooth scroll
- [ ] Framer Motion
- [ ] Spline
- [ ] Custom WebGL shaders
- [ ] Canvas 2D particles
- [x] **Squarespace native `block-animation` system** (IntersectionObserver-based, CSS keyframes)
- [x] **CSS transitions** (gallery hover, nav hover, list item hover)

---

## Third-Party Plugins (via CDN)

All from `willmyerscode` GitHub CDN (Will Myers Squarespace plugin ecosystem):

```
https://cdn.jsdelivr.net/gh/willmyerscode/tabs@5/tabs.min.css
https://cdn.jsdelivr.net/gh/willmyerscode/pricing-table@1/pricing-table.min.css
https://cdn.jsdelivr.net/gh/willmyerscode/expanding-panels@2/expanding-panels.min.css
https://cdn.jsdelivr.net/gh/willmyethewebsiteguy/websiteMockupDisplay@1/styles.min.css
```

Evidence snippets from html.html:
```html
<link rel="stylesheet" id="website-mockup-css" href="https://cdn.jsdelivr.net/gh/willmyethewebsiteguy/websiteMockupDisplay@1/styles.min.css">
<link href="https://cdn.jsdelivr.net/gh/willmyerscode/tabs@5/tabs.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/gh/willmyerscode/pricing-table@1/pricing-table.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/gh/willmyerscode/expanding-panels@2/expanding-panels.min.css" rel="stylesheet">
```

---

## Analytics / Tracking

- [x] **Google Tag Manager** (detected via GTM script snippet)
- [x] **Google Analytics 4** (detected via `gtag()` call)
- [ ] Meta Pixel (not detected)

Evidence:
```js
(function(w,d,s,l,i){ w[l]=w[l]||[]; w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'}); ... })(window,document,'script','dataLayer','GTM-XXXXX');
```

---

## Font Stack

- [x] **Editor's Note** (proprietary, loaded from Squarespace CDN as .otf)
  - Weight 200, both normal and italic
  - Classic editorial serif, similar to Cormorant Garamond
- [x] **PP Neue Montreal** (proprietary, loaded from Squarespace CDN as .woff)
  - Weights 300 and 500
  - Premium geometric grotesque sans-serif by Pangram Pangram
- [x] **Inter** (Google Fonts fallback — weights 300, 400, 500 normal + 300 italic)

Evidence:
```css
@font-face {
  font-family: 'editors-note-46p2ah';
  font-style: italic;
  font-weight: 200;
  src: url('https://file.squarespace-cdn.com/content/v2/namespaces/fonts/.../font.otf') format('opentype');
}
@font-face {
  font-family: 'pp-neue-montreal-mjs551';
  font-style: normal;
  font-weight: 500;
  src: url('https://file.squarespace-cdn.com/content/v2/namespaces/fonts/.../font.woff') format('woff');
}
```
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;1,300">
```

---

## JavaScript (Inline Custom)

- [x] Gallery auto-scroller (custom `setAutoScroll()` function, 3000ms, direction 2)
- [x] Pricing table toggle (custom labels via `window.wmPricingTableSettings`)
- [x] Accordion behavior (DOMContentLoaded listener)
- [x] Cookie consent (Squarespace native)
- [x] Announcement bar visibility (localStorage-based)
- [ ] No custom scroll behavior (no smoothscroll, no scroll-jacking)

---

## Squarespace Feature Usage

- [x] Fluid Engine (modern 24-column CSS grid)
- [x] Marquee block (scrolling text ticker)
- [x] Gallery Reel (horizontal scrolling gallery)
- [x] User Items List (simple + banner slideshow variants)
- [x] Newsletter block
- [x] Section dividers
- [x] Image overlay system
- [x] Custom CSS injection (15KB of custom overrides)
- [x] Commerce (shop pages, pricing display)
- [x] Website Mockup Display (Will Myers plugin)

---

## Key Technical Signatures

1. The Fluid Engine grid uses `repeat(24, minmax(0, var(--cell-max-width)))` on desktop — 24-column fine-grained layout
2. Row heights are view-relative: `minmax(calc(container-width * 0.0215), auto)` — rows scale with viewport width
3. Squarespace's `fe-block-*` class naming for every positioned element
4. Block animations use data attributes: `data-animation`, `block-animation`, `animation-loaded`
5. Image lazy loading via Squarespace CDN `?format=1500w` URL params

---

## What This Stack Tells Us

Avelã White achieves a premium, design-award-level aesthetic on a **completely no-code Squarespace platform** with zero motion JS libraries. The premium comes from:
1. Font choice (Editor's Note weight 200 + PP Neue Montreal)
2. Warm color palette restraint (5 tones, all warm)
3. Precise custom CSS overrides (15KB of careful tweaks)
4. Third-party layout plugins (expanding panels, tabs) for composition variety
5. Content strategy (curated imagery, minimal copy)

This is a reference for what typography + color alone can achieve.
