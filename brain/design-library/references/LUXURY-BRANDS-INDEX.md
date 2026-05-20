# Luxury Brand Design System Extractions — Index

> Last updated: 2026-05-18
> Purpose: Reference design systems from 12 premium luxury brands for REIS [IA] design elevation
> Usage: Consumed by art-director, designer-agent, vfx-motion-designer, visual-qa-agent, typography-specialist, luxury-brand-analyst
> DNA Report: brain/design-library/luxury/dna/fashion-houses.md

---

## Extraction Summary

| Brand | Vertical | Method | Quality | DESIGN.md | tokens.json | preview.html |
|-------|----------|--------|---------|-----------|-------------|--------------|
| **Chanel** | Fashion | Automated (design-md) | B (87/100) | 30KB | 13KB | 345KB |
| **Hermes** | Fashion | Automated (design-md) | C (75/100) | 28KB | 11KB | 536KB |
| **Tiffany** | Jewelry | Automated (design-md) | B (86/100) | 30KB | 14KB | 275KB |
| **Dior** | Fashion | Research-based | Medium | 11KB | 2.5KB | 14KB |
| **Cartier** | Jewelry | Research-based | Medium | 11KB | 2.5KB | 16KB |
| **Louis Vuitton** | Fashion | Research-based | Medium | 12KB | 2.7KB | 16KB |
| **Bottega Veneta** | Fashion | Hybrid (automated + enriched) | B (88/100) | 37KB | 12KB | 571KB |
| **Aesop** | Beauty | Research-based | Medium-High | 26KB | 7KB | 31KB |
| **Diptyque** | Fragrance | Research-based | Medium | 21KB | 5KB | 33KB |
| **Rolls-Royce** | Automotive | Research-based | Medium-High | 28KB | 5.3KB | 37KB |
| **Aman Resorts** | Hospitality | Hybrid (automated + enriched) | B (84/100) | 39KB | 18KB | 531KB |
| **Brunello Cucinelli** | Fashion | Automated (design-md) | B (84/100) | 30KB | 18KB | 316KB |

### Method Notes

- **Automated extractions** (Chanel, Hermes, Tiffany): Used the `/design-md` skill which fetches live HTML+CSS and uses LLM analysis to produce Google-spec DESIGN.md. Higher confidence — tokens come directly from CSS source.
- **Research-based extractions** (Dior, Cartier, Louis Vuitton): These sites use aggressive bot protection (Cloudflare/Akamai) that blocks all automated fetching (HTTP 403 on all paths). Design systems were constructed from brand guideline research and deep knowledge of each brand's public digital presence. Medium confidence — values are informed estimates.

---

## Brand Profiles (Quick Reference)

### Chanel — "Stark Monochrome"
- **Palette**: Pure black + white, no warm tones
- **Type**: Custom Chanel serif (Abridged), sharp geometric sans
- **Key Pattern**: Maximum contrast, zero ornamentation, photography-dominant
- **Motion**: Deliberate, minimal, unhurried
- **Signature**: The most restrained of all luxury digital presences
- **Path**: `references/chanel/`

### Hermes — "Playful Heritage"
- **Palette**: Orange (#FF6600) as primary accent, warm backgrounds
- **Type**: Clean sans-serif family, moderate tracking
- **Key Pattern**: Warmer and more approachable than peers, editorial storytelling
- **Motion**: Smooth, organic, nature-inspired
- **Signature**: The only luxury brand that uses a bold color accent prominently
- **Path**: `references/hermes/`

### Tiffany — "Cool Blue Elegance"
- **Palette**: Tiffany Blue (#0ABAB5) as signature, black + white foundation
- **Type**: Clean modern serif + geometric sans
- **Key Pattern**: Blue as brand signature, clean jewelry presentation, ring-box warmth
- **Motion**: Subtle, refined, jewelry-appropriate sparkle effects
- **Signature**: The most color-identified luxury brand — blue IS the brand
- **Path**: `references/tiffany/`

### Dior — "Timeless Modernity"
- **Palette**: Pure monochrome with gold heritage accent
- **Type**: Custom Dior serif, Helvetica Neue for UI
- **Key Pattern**: Photography-first, radical whitespace, zero border-radius
- **Motion**: Slow and deliberate — minimum 0.3s for any transition
- **Signature**: The most editorial fashion-house digital presence
- **Path**: `references/dior/`

### Cartier — "Refined Warmth"
- **Palette**: Warm neutrals (cream, warm-white) with signature red (#A5182A)
- **Type**: Custom Cartier serif, clean sans for UI
- **Key Pattern**: Warm backgrounds distinguish from cold-minimalist competitors
- **Motion**: Smooth, measured, vitrine-like product presentation
- **Signature**: Warmth as differentiator — cream tones, serif heritage, red accent
- **Path**: `references/cartier/`

### Louis Vuitton — "Art Meets Commerce"
- **Palette**: High-contrast B&W with heritage brown/tan
- **Type**: Custom LV serif at oversized scales (80px hero), tiny tracked nav (11px)
- **Key Pattern**: Largest type scale, most editorial, video-first heroes
- **Motion**: Most cinematic — longer durations, video crossfades, parallax
- **Signature**: Scale contrast (huge display vs tiny nav) creates editorial tension
- **Path**: `references/louisvuitton/`

---

## Cross-Brand Pattern Analysis (for REIS [IA] application)

### Universal Luxury Patterns
These appear across ALL 6 brands and should inform REIS [IA] design:

1. **Zero or minimal border-radius** on CTAs — sharp edges signal precision
2. **Uppercase letter-spaced navigation** — small size (11-13px) with wide tracking
3. **Generous whitespace** — sections breathe, content density is deliberately low
4. **Photography/video dominance** — the interface frames content, never competes
5. **Serif for display, sans for UI** — typographic hierarchy creates two voices
6. **Slow motion** — minimum 0.3-0.4s transitions, never snappy or bouncy
7. **Dark mode capability** — all brands have editorial dark sections
8. **Full-bleed heroes** — edge-to-edge imagery at viewport height

### Differentiating Patterns
Choose which approach best fits REIS [IA]:

| Pattern | Cold (Chanel/Dior) | Warm (Cartier/Hermes) | Bold (LV) |
|---------|-------------------|----------------------|-----------|
| Background | Pure white/black | Cream/warm-white | White + editorial dark |
| Accent | None (monochrome) | Brand color (red/orange) | Heritage contextual |
| Type scale | Moderate (36-48px) | Moderate (34-44px) | Large (52-80px) |
| Content density | Very low | Moderate | Higher |
| Motion speed | Slow (0.3-0.8s) | Moderate (0.35-0.7s) | Cinematic (0.4-1.5s) |

### Recommended Blend for REIS [IA]
- **Base**: Dior's monochrome discipline (dark mode, zero radius, photography-first)
- **Accent**: Cartier's approach to signature color (one accent, used only for interactive elements)
- **Typography**: LV's scale contrast (oversized hero text vs tiny tracked nav)
- **Motion**: Dior/LV's slow, deliberate transitions (0.4s minimum)
- **Warmth**: Surface levels (#0A0A0A, #111113) instead of pure black for Cartier-like depth
- **Layout**: LV's wider max-width (1600px) for modern displays

---

## File Inventory

```
brain/design-library/references/
  chanel/
    DESIGN.md              # Full Google-spec design system
    tokens.json            # Parsed design tokens
    preview.html           # Visual preview (embedded fonts)
    quality-score.json     # Automated quality assessment
    extraction-log.yaml    # Provenance + confidence
    telemetry.json         # Run metadata
    inputs/                # Raw HTML, CSS, detection files
  hermes/
    DESIGN.md
    tokens.json
    preview.html
    quality-score.json
    extraction-log.yaml
    telemetry.json
    inputs/
  tiffany/
    DESIGN.md
    tokens.json
    preview.html
    quality-score.json
    extraction-log.yaml
    telemetry.json
    inputs/
  dior/
    DESIGN.md              # Research-based
    tokens.json
    preview.html           # Lightweight (Google Fonts CDN)
  cartier/
    DESIGN.md              # Research-based
    tokens.json
    preview.html           # Lightweight (Google Fonts CDN)
  louisvuitton/
    DESIGN.md              # Research-based
    tokens.json
    preview.html           # Lightweight (Google Fonts CDN)
```
