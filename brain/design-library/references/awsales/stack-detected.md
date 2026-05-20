# AwSales — Stack Detected
## Extracted: 2026-04-26
## Source: https://www.awsales.io/

---

## Site Builder

- [x] **Framer** — confirmed via `<!-- Made in Framer · framer.com ✨ -->` comment + `meta name="generator" content="Framer b16259d"` + all JS/CSS served from `framerusercontent.com`

## JavaScript Framework

- [x] **React** — `react.BupkZe05.mjs` preloaded
- [x] **Framer Motion** — `motion.mZcHFMke.mjs` preloaded (Framer's bundled motion library)
- [ ] Next.js — not detected
- [ ] Vue — not detected
- [ ] Svelte — not detected

## Animation Libraries

- [ ] GSAP — not detected (no `gsap.`, no `ScrollTrigger` references)
- [x] **Framer Motion** (via Framer runtime)
- [ ] Lenis — not detected
- [ ] GSAP SplitText — not detected
- [ ] Three.js / R3F — not detected
- [ ] Spline — not detected
- [ ] Lottie — not detected
- [ ] AOS — not detected

## CSS Methodology

- [x] **Framer-generated utility classes** — all classes are `framer-XXXXX` hash format
- [x] **CSS custom properties** — token system with UUID-based variable names
- [ ] Tailwind — not detected
- [ ] BEM — not detected
- [ ] CSS Modules — not detected

## Typography

- [x] **DM Sans** — Google Fonts CDN
- [x] **Figtree** — Google Fonts CDN
- [x] **Manrope** — Google Fonts CDN (primary body font)
- [x] **Poppins** — Google Fonts CDN (primary headline font)
- [x] Custom woff2 fonts — self-hosted on `framerusercontent.com/assets/`

## Analytics / Tracking

- [x] **Google Tag Manager** — `gtm.awsales.io` (custom GTM server)
- [x] **Framer Analytics** — `events.framer.com/script`
- [x] **Stape** (server-side GTM) — `_stape` cookie, `stapeUserId`

## Hosting / CDN

- [x] **Framer hosting** — `framerusercontent.com` CDN for all assets
- [x] Custom domain `awsales.io`
- [x] Custom GTM server `gtm.awsales.io`

## Evidence Snippets

```html
<!-- Generator tag -->
<meta name="generator" content="Framer b16259d">

<!-- React + Motion preloads -->
<link rel="modulepreload" href="https://framerusercontent.com/sites/4cxf12hdaNlk9dJpSAVk6V/react.BupkZe05.mjs">
<link rel="modulepreload" href="https://framerusercontent.com/sites/4cxf12hdaNlk9dJpSAVk6V/motion.mZcHFMke.mjs">
<link rel="modulepreload" href="https://framerusercontent.com/sites/4cxf12hdaNlk9dJpSAVk6V/framer.CgPNa4cd.mjs">

<!-- Framer appear animation system -->
<div data-framer-appear-animation="no-preference" style="opacity:0;transform:translateY(30px)">

<!-- Body background (set by Framer) -->
<style>html body { background: rgb(7, 12, 20); }</style>

<!-- GTM custom server -->
E.src = f + "/" + i + ".js?" + c + v  // f = "https://gtm.awsales.io"
```

## Key Architectural Notes

1. **100% Framer-generated** — no handwritten HTML/CSS. All layout, typography, animation is output from Framer's visual editor.
2. **React SSR** — page is server-rendered HTML (1MB+ static HTML), then hydrated client-side.
3. **Component isolation** — each section is a Framer component (`framer-UiDPC`, `framer-iHWZY` etc.) with scoped CSS.
4. **No GSAP dependency** — all motion is Framer Motion. This means animation config lives in the Framer editor, not extractable as raw GSAP code.
5. **Conic gradient circles** — the signature spinning arc effect is pure CSS conic-gradient + Framer Motion rotation. No Canvas/WebGL needed.
6. **Blur blob technique** — colored PNG images blurred 100px via CSS filter, not CSS gradients. More performant for complex color washes.
