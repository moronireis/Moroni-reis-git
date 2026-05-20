---
# DESIGN.md — Diptyque Paris (diptyqueparis.com)
# Extraction method: Research-based (site blocked automated fetch — Cloudflare/CDN protection)
# Confidence: MEDIUM (sourced from brand analyses, academic papers, design studio portfolios, retail case studies)
# Date: 2026-05-18
# Purpose: Protocolo Luxo knowledge base — consumed by art-director, designer-agent, typography-specialist, visual-qa-agent
# Sources: Ateljé Altmann portfolio, Latterly brand analysis, academic visual identity paper (UC journal),
#          BrandColorCode, Apartment Therapy, Household Design, Elle Decoration, DesignBoom, Space NK, Perfume Society
---

# Diptyque Paris — Design System

## 1. Brand DNA & Design Philosophy

Diptyque is a Parisian maison founded in 1961 at 34 Boulevard Saint-Germain by three artists: Desmond Knox-Leet (painter/cryptographer), Christiane Gautrot (interior designer), and Yves Coueslant (theater set designer). The brand's visual language is inseparable from its founders' artistic disciplines — painting, calligraphy, theater, and textile design.

### Core Principles

| Principle | Expression |
|-----------|------------|
| **Artisanal over industrial** | Hand-drawn labels, Indian ink calligraphy, illustrated motifs — never photographic reproduction |
| **Understatement as luxury** | Black-and-white palette signals refinement through restraint, not ornament |
| **The candle as art object** | Product is vitrine, not commodity — the vessel is designed for display longevity |
| **Heritage continuity** | Packaging unchanged since 1963 — evolution without revolution |
| **Diptych composition** | The brand name itself means "two-panel" — design always plays with pairs, contrasts, reflections |

### Visual Archetype

**Dark editorial luxury** — closer to a gallery or museum catalog than a retail store. Photography favors natural light, intimate still lifes, and tactile realism over heavy polish. The digital experience must feel like entering a curated Parisian apartment, not a shopping cart.

---

## 2. Typography

### Primary Typeface: Diptyque Saint-Germain

Custom typeface designed by **Ateljé Altmann** (2022) exclusively for Diptyque SAS.

| Property | Value |
|----------|-------|
| Family | `"Diptyque Saint-Germain", Georgia, "Times New Roman", serif` |
| Weights | Regular (400), Italic (400i), Bold (700), Bold Italic (700i) |
| Character | Transitional serif with calligraphic DNA — organic stroke terminals, subtle weight contrast |
| Heritage | Evolved from the original hand-drawn lettering by Desmond Knox-Leet |
| License | Proprietary — Diptyque SAS, not available for licensing |

### Display / Label Typeface: Diptyque (Original Calligraphic)

The iconic label lettering is not a conventional font but a **hand-drawn calligraphic system** created by Desmond Knox-Leet using Indian ink.

| Property | Description |
|----------|-------------|
| Inspiration | Ancient Roman temple inscriptions + Bletchley Park code-breaking aesthetics |
| Character traits | Es sprout tiny branches, Os spread thick and round, consonants swirl, vowels tremble randomly |
| Digital approximation | `"EB Garamond", Garamond, "Cormorant Garamond", serif` (for non-label contexts) |
| Usage | Product labels, oval medallions, packaging calligrams only |

### Body / UI Typeface: System Serif + Sans-Serif Stack

On the e-commerce platform, body text and UI elements use:

| Context | Font Stack (estimated) |
|---------|----------------------|
| Headings | `"Diptyque Saint-Germain", Georgia, "Times New Roman", serif` |
| Body copy | `"Diptyque Saint-Germain", Georgia, serif` |
| UI / Navigation | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` |
| Buttons / CTAs | Sans-serif system stack, uppercase tracking |

### Type Scale (estimated from visual analysis)

| Element | Size | Weight | Letter-Spacing | Line-Height | Transform |
|---------|------|--------|-----------------|-------------|-----------|
| Hero headline | 48–64px | 400 | 0.02em | 1.1 | None |
| Section heading (H2) | 32–40px | 400 | 0.03em | 1.2 | None |
| Product name | 18–24px | 400 | 0.05em | 1.3 | None |
| Product price | 16–18px | 400 | 0.02em | 1.4 | None |
| Body text | 15–16px | 400 | 0.01em | 1.6 | None |
| Navigation links | 12–14px | 400 | 0.08–0.12em | 1.0 | Uppercase |
| Button text | 12–13px | 500–600 | 0.10–0.15em | 1.0 | Uppercase |
| Caption / meta | 11–12px | 400 | 0.04em | 1.4 | None |

### Typographic Principles

1. **Generous letter-spacing** on navigation and buttons — creates breathing room that signals luxury
2. **Serif dominance** — sans-serif reserved for functional UI only (nav, buttons, form labels)
3. **Light-to-regular weights** preferred — bold used sparingly, never for body text
4. **No decorative type effects** — no gradients, shadows, or strokes on text
5. **Calligrams** are a signature element — interwoven letters that form illustrations inspired by fragrances (Cypress letters form tree silhouettes, Rose letters bloom into petals)

---

## 3. Color System

### Core Palette

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--color-black` | `#000000` | 0, 0, 0 | Primary brand color, backgrounds, text |
| `--color-white` | `#FFFFFF` | 255, 255, 255 | Text on dark, backgrounds, labels |
| `--color-cream` | `#F5F0E8` | 245, 240, 232 | Warm off-white backgrounds, paper texture |
| `--color-ivory` | `#FAF7F2` | 250, 247, 242 | Page background, product card backgrounds |
| `--color-warm-gray` | `#D4CFC7` | 212, 207, 199 | Borders, dividers, muted UI elements |
| `--color-charcoal` | `#2C2C2C` | 44, 44, 44 | Secondary text, subtle dark backgrounds |
| `--color-dark-gray` | `#4A4A4A` | 74, 74, 74 | Body text on light backgrounds |
| `--color-mid-gray` | `#8C8C8C` | 140, 140, 140 | Placeholder text, metadata |
| `--color-light-gray` | `#E8E4DE` | 232, 228, 222 | Section dividers, subtle borders |

### Accent / Seasonal Colors

Diptyque introduces color through product-specific and seasonal collections, never as UI chrome:

| Token | Hex | RGB | Context |
|-------|-----|-----|---------|
| `--color-diptyque-green` | `#2D4A3E` | 45, 74, 62 | Signature dark green (packaging, store interiors) |
| `--color-moss` | `#5B7355` | 91, 115, 85 | Botanical illustrations, nature scents |
| `--color-amber-warm` | `#C4956A` | 196, 149, 106 | Warm fragrance families, candle glow |
| `--color-rose-blush` | `#D4A5A5` | 212, 165, 165 | Floral collections |
| `--color-navy-deep` | `#1A2744` | 26, 39, 68 | Winter/night collections |
| `--color-terracotta` | `#B5694D` | 181, 105, 77 | Mediterranean collections |
| `--color-gold-foil` | `#C5A55A` | 197, 165, 90 | Limited editions, holiday packaging |

### Color Principles

1. **Black and white as diptych** — the brand name means "two-panel"; solids and voids reflect each other
2. **Color enters through product, not through UI** — the website frame is neutral; color comes from product photography
3. **Dark mode is not default** — Diptyque uses predominantly light/cream backgrounds with strategic dark sections for drama
4. **Product glow effect** — on dark backgrounds, candles and fragrances are lit to create a warm halo, never harsh studio lighting
5. **Natural pigment palette** — accent colors reference "ancient paintings, ceramics, and earth pigments" per brand description

---

## 4. The Oval — Signature Brand Element

The oval is Diptyque's most recognizable design element, present across all touchpoints.

### Specifications (estimated)

| Property | Value |
|----------|-------|
| Shape | True ellipse, ~1.25:1 width-to-height ratio |
| Border | 1px solid black (on labels), sometimes double-line |
| Origin | Inspired by ancient Roman battle shields (clipeus) |
| First use | 1963, on the "Prétorien" fabric pattern |
| Application | Candle labels, perfume medallions, packaging, store fixtures, website logo |

### Digital Implementation

- Logo lockup: Oval containing "DIPTYQUE" lettering in custom calligraphic style
- Used as a framing device for product imagery, never as decorative background pattern
- On web: appears in header as SVG, on product cards as part of product photography
- Never distorted, rotated, or filled with color (except limited editions)

---

## 5. Spacing & Layout

### Spacing Scale (estimated)

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4px | Inline element gaps |
| `--space-sm` | 8px | Icon-to-text gaps, tight component padding |
| `--space-md` | 16px | Standard component padding |
| `--space-lg` | 24px | Card internal padding |
| `--space-xl` | 32px | Section internal padding |
| `--space-2xl` | 48px | Between components within sections |
| `--space-3xl` | 64px | Between major sections |
| `--space-4xl` | 96px | Hero section padding, major section breaks |
| `--space-5xl` | 128px | Top-level section separation |

### Layout Grid

| Property | Value |
|----------|-------|
| Max content width | 1440px (estimated) |
| Grid columns (desktop) | 12 |
| Grid columns (tablet) | 8 |
| Grid columns (mobile) | 4 |
| Gutter | 24px (desktop), 16px (mobile) |
| Side margins | 48–64px (desktop), 16–24px (mobile) |

### Breakpoints (estimated)

| Name | Value |
|------|-------|
| Mobile | 0–767px |
| Tablet | 768–1023px |
| Desktop | 1024–1439px |
| Wide | 1440px+ |

### Layout Principles

1. **Generous whitespace** — luxury is communicated through what's NOT there
2. **Asymmetric compositions** — editorial layouts alternate full-bleed imagery with text panels
3. **Product-first hierarchy** — product imagery always dominates; UI elements recede
4. **Scroll as storytelling** — long vertical pages reveal content like turning pages of an art book
5. **Image ratios**: Hero sections use landscape (16:9 to 2:1), product cards use portrait (3:4), editorial uses square (1:1)

---

## 6. Components

### Navigation

| Property | Value |
|----------|-------|
| Style | Minimal horizontal nav, fixed on scroll |
| Background | White/cream, semi-transparent on scroll |
| Typography | Uppercase sans-serif, wide letter-spacing (0.1em+) |
| Logo position | Center |
| Cart / Account | Right-aligned icons |
| Mega menu | Clean dropdown with product imagery, category columns |
| Mobile | Slide-in drawer from left, full-height |

### Product Cards

| Property | Value |
|----------|-------|
| Background | White or `--color-ivory` |
| Border | None (clean edges) or 1px `--color-light-gray` |
| Border-radius | 0px (sharp corners — no rounded cards) |
| Image ratio | 3:4 portrait (product) or 1:1 square (candle) |
| Image background | Soft neutral, often with subtle shadow/glow |
| Product name | Serif, regular weight, 16–18px |
| Price | Below name, regular weight, subtle styling |
| Hover | Subtle image swap (alternate angle) or gentle opacity shift |
| Shadow | None or extremely subtle (luxury avoids heavy drop-shadows) |

### Buttons / CTAs

| Variant | Style |
|---------|-------|
| Primary | Black background, white text, uppercase, wide tracking, no border-radius |
| Secondary | White background, black border (1px), black text, uppercase |
| Text link | Underline on hover, no background, serif or sans-serif |
| Add to cart | Black pill or rectangle, white text, icon optional |

```
Button dimensions (estimated):
  padding: 14px 32px;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-radius: 0;     /* sharp corners */
  transition: opacity 0.3s ease;
```

### Hero Sections

| Property | Value |
|----------|-------|
| Height | 75–100vh |
| Image treatment | Full-bleed photography, natural lighting |
| Text overlay | Centered or left-aligned, white on dark image |
| Headline style | Serif, 48–64px, light weight |
| CTA placement | Below headline, generous spacing |
| Animation | Subtle parallax or fade-in on load |

### Footer

| Property | Value |
|----------|-------|
| Background | Black or very dark charcoal |
| Text color | White / warm gray |
| Typography | Sans-serif, uppercase categories, regular-weight links |
| Columns | 4–5 (Help, About, Services, Legal, Social) |
| Newsletter | Email input + "Subscribe" button, minimal styling |

---

## 7. Motion & Animation

### Principles

| Principle | Expression |
|-----------|------------|
| **Subtle always** | Motion serves content discovery, never decorates |
| **Fade is primary** | Opacity transitions preferred over sliding/bouncing |
| **Photography-first** | Animate the frame, never distort the product image |
| **Slow luxury** | Longer durations (300–600ms) signal premium pacing |
| **Reduce motion respected** | All motion disabled for `prefers-reduced-motion` |

### Motion Tokens (estimated)

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 200ms | Button hovers, icon state changes |
| `--duration-base` | 350ms | Component transitions, card hovers |
| `--duration-slow` | 600ms | Page transitions, hero reveals |
| `--duration-dramatic` | 900ms | Full-page overlays, modal opens |
| `--easing-default` | `cubic-bezier(0.25, 0.1, 0.25, 1.0)` | Standard ease |
| `--easing-out` | `cubic-bezier(0.0, 0.0, 0.2, 1.0)` | Entrances |
| `--easing-in` | `cubic-bezier(0.4, 0.0, 1.0, 1.0)` | Exits |
| `--easing-dramatic` | `cubic-bezier(0.16, 1, 0.3, 1)` | Hero reveals |

### Animation Patterns

1. **Fade-in on scroll** — Content sections fade up as they enter viewport (translate-y: 20px → 0)
2. **Image swap on hover** — Product cards swap to alternate angle (crossfade, ~300ms)
3. **Parallax (subtle)** — Hero images move at ~0.5x scroll rate, max 30px travel
4. **Cart drawer slide** — Right-side drawer slides in, 350ms ease-out
5. **Navigation overlay** — Mega menu fades in, 250ms, slight translate-y
6. **No scroll-jacking** — Native scroll preserved, enhanced with subtle triggers

---

## 8. Photography & Imagery

### Product Photography

| Property | Guideline |
|----------|-----------|
| Lighting | Natural light or warm studio — never harsh flash |
| Background | Soft neutral (cream/light gray) for catalog; dark/black for hero features |
| Shadow | Organic, soft — product appears to rest naturally, never floating |
| Candle flame | Always lit when showing the "in-use" state; warm amber glow |
| Fragrance bottles | Translucent liquid visible; back-label illustrations visible through glass |
| Composition | Single product centered, or editorial groupings with props (books, fabric, botanicals) |

### Editorial Photography

| Property | Guideline |
|----------|-----------|
| Style | Intimate still life, reminiscent of Dutch Golden Age paintings |
| Color grading | Warm, slightly desaturated, natural tones |
| Subjects | Parisian interiors, botanicals, travel scenes, artisan workshops |
| Treatment | No heavy retouching — "tactile realism that signals authenticity and craft" |
| Aspect ratios | 2:1 panoramic (hero), 3:4 portrait (editorial), 1:1 square (grid) |

### The Product Glow Effect

On dark backgrounds, Diptyque creates a signature warm glow around candles and fragrances:

```
/* Approximate CSS for product glow on dark backgrounds */
.product-glow {
  position: relative;
}
.product-glow::after {
  content: '';
  position: absolute;
  inset: -20%;
  background: radial-gradient(
    ellipse at center,
    rgba(196, 149, 106, 0.15) 0%,    /* warm amber */
    rgba(196, 149, 106, 0.05) 40%,
    transparent 70%
  );
  pointer-events: none;
  z-index: -1;
}
```

---

## 9. Illustration & Heritage Elements

### Calligrams

Diptyque's signature illustrated labels where **letters form visual compositions** inspired by the fragrance:

| Fragrance | Calligram Style |
|-----------|----------------|
| Cypress | Letters rise to form tree-like silhouettes |
| Sandalwood | Letters stack into architectural columns |
| Gardenia | Letters bloom into delicate petals |
| Roses | Letters spiral into floral arrangements |

These are hand-drawn originals, never digitally generated. In digital contexts, they appear as high-resolution scans on product labels.

### Illustrated Motifs

- Back-of-label illustrations: scene or memory pertinent to each fragrance (visible through translucent liquid)
- Fabric-inspired patterns: derived from the founders' original 1960s textile designs (e.g., "Prétorien" pattern)
- Botanical line drawings: used in editorial content, never in UI

### Heritage Pattern: The Prétorien

First fabric pattern (1963) that became the origin of the oval label. Celtic-influenced character with 18th-century medallion composition. Appears on limited editions and seasonal packaging.

---

## 10. Retail-to-Digital Translation

### Store Interior → Web Experience

| Retail Element | Digital Translation |
|----------------|-------------------|
| Greek Thassos marble tabletops (LED backlit) | Soft glow effects on product display sections |
| Dorset basalt flooring | Dark section backgrounds with subtle texture |
| Pressed tin ceiling patterns | Subtle pattern overlays at very low opacity (decorative, not structural) |
| Glass chandeliers shaped as Diptyque logo | Logo prominence in navigation, never as decorative element |
| Green-lacquered intimate rooms | Dark green accent sections for premium/personalization content |
| Progressive darkening through store | Scroll progression from light to dark on product detail pages |

### Maison Concept → Digital Architecture

The physical "Maison Diptyque" flagship concept (arranged like an aesthete's Parisian apartment) translates to:

1. **Rooms as sections** — each page section feels like entering a new room
2. **Curated, not cataloged** — products presented in narrative context, not endless grids
3. **Material presence** — textures visible (glass, wax, paper, fabric) even in digital photography
4. **Intimate scale** — never overwhelming; collections shown in small, considered groupings

---

## 11. Image Formats & Technical

| Property | Value |
|----------|-------|
| Primary format | AVIF (quality: 90) with WebP and JPEG fallbacks |
| Lazy loading | Native `loading="lazy"` on below-fold images |
| Hero images | 2025×1518px observed for featured content |
| Product images | Multiple angles per product (3–6 views) |
| Responsive images | `srcset` with multiple resolution breakpoints |
| Alt text | Descriptive, includes fragrance name and product type |

---

## 12. Tech Stack (Observed)

| Layer | Technology |
|-------|-----------|
| Platform | Magento 2 (migrated from Magento 1, redesigned by Clever Age) |
| Fonts | Custom webfonts (Diptyque Saint-Germain) + Google Fonts API (fallback) |
| Image delivery | AVIF-first with CDN optimization |
| Security | HSTS, DNSSEC |
| Analytics | Standard luxury e-commerce stack |
| Total technologies | ~72 (per BuiltWith) |

---

## 13. Anti-Patterns (What Diptyque Never Does)

| Never | Why |
|-------|-----|
| Bright UI colors | Competes with product photography |
| Rounded corners on cards | Signals casual/tech, not luxury heritage |
| Heavy drop shadows | Implies physicality that clashes with editorial aesthetic |
| Animated product images | Product photography is sacred — animate the frame, not the object |
| Emoji or playful icons | Breaks artisanal brand voice |
| Countdown timers / urgency badges | Undermines timeless positioning |
| Grid-heavy product listing | Curated groupings > infinite scroll catalogs |
| Gradient text or backgrounds | Too digital for an artisanal brand |
| Stock photography | Every image is original — still life or editorial |
| Pricing prominence | Price is always secondary to product name and story |

---

## 14. Design System Summary for Agent Consumption

### For art-director
- The Diptyque system proves that **restraint IS the luxury signal**. Black + white + cream with color entering only through product. Custom serif typography with calligraphic heritage. The oval as singular, untouchable brand mark.

### For designer-agent
- Sharp corners everywhere (border-radius: 0). Uppercase sans-serif for navigation at 0.1em+ tracking. Body in custom serif at 15–16px. Product cards with no shadows, no borders, no decoration — let photography do the work. Dark sections use radial gradient glow behind products.

### For typography-specialist
- Custom typeface "Diptyque Saint-Germain" by Ateljé Altmann (2022) in 4 weights. Fallback to EB Garamond or Georgia. Wide letter-spacing is signature (0.08–0.15em on UI, 0.02–0.05em on body). Serif dominance with sans only for functional UI.

### For visual-qa-agent
- Test against: (1) Is color coming from product only or leaking into UI? (2) Are corners sharp? (3) Does the page feel like a gallery or a shop? (4) Is photography intimate and warm, never harsh? (5) Does the typography have breathing room? If any answer fails, the implementation has drifted from Diptyque's aesthetic.
