---
name: CyberAct Website — Project State
description: Stack, component locations, visual kit install, hero setup for cyberact-website
type: project
---

# CyberAct Website

**Stack**: Astro (static, no SSR adapter) + React islands + Tailwind CSS v4 (@tailwindcss/vite)  
**Build command**: `npm run build` from `/Users/moronireis/Projetos vscode/cyberact-website/`  
**Dev command**: `npm run dev`

## Key Directories

- Pages: `src/pages/` (index.astro, servicos.astro, sobre.astro, contato.astro, ticket.astro)
- Layouts: `src/layouts/Layout.astro` — single layout wrapping all pages, has nav + footer
- Components: `src/components/` — AnimatedNumbers.tsx, MockupDashboard.tsx, TestimonialCarousel.tsx
- Backgrounds: `src/components/backgrounds/` — CyberGridHero.tsx (active hero), ShaderGradientHero.tsx, GlowOrbHero.tsx
- Styles: `src/styles/global.css` — particle/scanline/noise-overlay CSS classes already defined here

## Visual Kit (installed 2026-06-01)

Packages added: `three @react-three/fiber @react-three/drei shadergradient framer-motion gsap @gsap/react lenis @tsparticles/react @tsparticles/slim simplex-noise`

## Hero Setup (index.astro)

- **Background**: `CyberGridHero` (client:load) — Canvas 2D, no external deps
  - Perspective grid converging to vanishing point + 18 floating nodes + 4s pulse scan
  - Accent color: #e63946. Falls back to static CSS radial gradient on prefers-reduced-motion.
  - Throttled to 30fps to save battery. ResizeObserver handles resize.
  - Also copied to `/brain/design-library/hero-components/CyberGridHero.tsx`
- **Particles**: 6x `.particle` divs + 2x `.hero-scanline` divs inside hero (CSS-driven, complement the grid)
- **Noise overlay**: `noise-overlay` class on `<body>` in Layout.astro

## Shared Library

Hero components also saved to: `/Users/moronireis/Projetos vscode/brain/design-library/hero-components/`
- CyberGridHero.tsx — Canvas 2D perspective grid + nodes + pulse (no deps, 30fps, cybersecurity aesthetic)
- ShaderGradientHero.tsx — fluid mesh gradient (shadergradient)
- ParticleFieldHero.tsx — constellation particles (@tsparticles)
- GlowOrbHero.tsx — Canvas 2D floating orbs, no heavy deps

## Visual Polish (2026-06-01)

Surface token system added to global.css: `--color-cyber-base` (#080808, body bg), `--color-cyber-surface-1/2/3` for layered depth.
Card upgrade: border-top 2px red accent at 0.25 opacity, deeper shadow system on hover.
New utility classes: `.glow-ambient`, `.stat-glow`, `.quote-warm`, `.compare-row-hover`.
Gradient-line dividers before Depoimentos and CTA Final sections.
Segurança section: subtle blue radial tint overlay (rgba(20,20,60,0.15)).
Comparativo section: right-side red gradient tension (rgba(230,57,70,0.06)).
CTA Final gradient: strengthened to 0.08 opacity.

## Brand Colors

- `cyber-red`: #e63946
- `cyber-black`: #0a0a0a
- `cyber-dark`: ~#111111
- `cyber-white`: #ffffff
- `cyber-text`: muted gray
- `cyber-border`: subtle dark border

## Notes

- shadergradient is heavy (Three.js under the hood) — chunk size warning on build is expected and non-blocking
- `ShaderGradientCanvas` and `ShaderGradient` must be lazy-imported to avoid SSR errors
- GlowOrbHero uses Canvas 2D with hexToRgba helper (handles #rrggbb, #rgb, shorthand formats)
- Astro config: no output adapter set → pure static generation

**Why:** Needed to track stack details, visual kit state, and component locations for future sessions.
**How to apply:** When resuming CyberAct work, check this file first before reading source files.
