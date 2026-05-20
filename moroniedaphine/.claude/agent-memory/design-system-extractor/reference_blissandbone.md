---
name: Bliss & Bone harvest reference
description: Track B harvest of blissandbone.com completed 2026-05-01. Luxury wedding stationery brand. Six mandatory files written to brain/design-library/references/blissandbone/.
type: reference
---

Harvest location: `brain/design-library/references/blissandbone/`

Files produced:
- `html.html` — 36KB reconstructed source with full CSS token system and CDN asset inventory
- `design-tokens.md` — complete color, type, spacing, shadow, motion, aspect ratio, texture tokens
- `motion-config.md` — CSS-only stack confirmed; no GSAP/Three.js/Lenis; key params for hover scale, scroll entrance, carousel, dropdown
- `stack-detected.md` — custom platform (not Shopify/WP), custom CDN cdn.blissandbone.com, CSS-primary animation
- `observations.md` — 7 signature techniques ranked; 10 pattern distillation proposals; compatibility verdict vs Reis IA
- `suggested-patterns.md` — 10 concrete pattern proposals with Priority 1/2/3 tiers and Reis IA cross-reference

Key findings:
- Dark botanical overlay: grayscale(100%) brightness(0.70) + rgba(15,12,10,0.62) warm overlay — highest value technique
- Typography: font-weight 300 high-contrast display serif (Cormorant/Canela family) + calligraphic script for connectors
- Motion: CSS-only, no JS libraries. Image hover scale(1.04) 400ms, scroll fadeInUp translateY(24px) 600ms
- Color: warm neutral scale ivory→charcoal (#F7F4EE→#2C2822) + single strong accent per design (cobalt, olive, dark)
- 14 CDN images analyzed visually via Read tool

Wedding-specific patterns (incompatible with Reis IA core, usable in moroniedaphine sub-project):
- serif-script-name-treatment (calligraphic script)
- invitation-card-5-7 (warm paper palette)
- botanical/shadow-cast-composition
- material-surface-simulation (linen/parchment)

Patterns compatible with Reis IA core:
- dark-botanical-photo-overlay
- ultra-light-display-headline (Inter 300 already in system)
- css-only-luxury-transitions
- warm-neutral-anchor-palette (for sub-sections/print)
