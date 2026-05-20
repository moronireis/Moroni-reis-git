# WIthJoy — Design Tokens
**Source:** https://withjoy.com
**Harvested:** 2026-05-01
**Method:** WebFetch multi-pass (6 pages analyzed)
**Extraction confidence:** HIGH for structure/color intent, ESTIMATED for exact hex values where not directly observable

---

## Color Tokens

### Primary Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--joy-blue` | `#4F6BCB` | Primary CTA buttons, icons, links, accents — confirmed via /wedding-website/ icon color |
| `--joy-blue-hover` | `#3d58b8` | Button hover state (estimated -15% brightness) |
| `--joy-bg-white` | `#FFFFFF` | Primary page background, nav background |
| `--joy-bg-off-white` | `#FAFAF8` | Alternating section background (warm, slightly cream) |
| `--joy-text-primary` | `#1a1a1a` | Near-black heading text (estimated from "dark gray/black" observation) |
| `--joy-text-body` | `#3d3d3d` | Body copy (medium dark gray) |
| `--joy-text-muted` | `#757575` | Secondary/caption text, card descriptions |
| `--joy-text-white` | `#FFFFFF` | Text on dark backgrounds |

### Background Variants (Contextual Sections)

| Token | Value | Usage |
|-------|-------|-------|
| `--joy-bg-dark` | `#1a1a1a` | Footer background |
| `--joy-bg-blush` | `#f5e6e0` | Mother's Day / promotional editorial sections |
| `--joy-bg-baby-blue` | `#EFF4FE` | Joy Baby Registry cross-promo section |
| `--joy-bg-sage` | `#e8ede4` | Nature/floral accent backgrounds (inferred) |

### Interactive States

| Token | Value | Usage |
|-------|-------|-------|
| `--joy-blue-shadow` | `rgba(79, 107, 203, 0.3)` | Button hover shadow (computed from #4F6BCB) |
| `--joy-overlay-dark` | `rgba(0, 0, 0, 0.3)` | Template card hover overlay |
| `--joy-border-subtle` | `rgba(0, 0, 0, 0.15)` | Ghost button border, subtle dividers |
| `--joy-footer-text` | `rgba(255, 255, 255, 0.6)` | Footer link text |
| `--joy-footer-heading` | `rgba(255, 255, 255, 0.7)` | Footer section headings |
| `--joy-footer-divider` | `rgba(255, 255, 255, 0.1)` | Footer horizontal dividers |
| `--joy-footer-copyright` | `rgba(255, 255, 255, 0.4)` | Footer copyright text |

### Blog Category Color Accents (inferred from product category palette)
The blog section uses warm earth-tone placeholder backgrounds for card images:
- Proposal content: `#f0ede8` (warm cream)
- Registry content: `#edf0e8` (soft sage)
- Planning content: `#e8ebf0` (cool blue-gray)
- Videography content: `#f0eee8` (warm parchment)

---

## Typography Tokens

### Font Stack
**No Google Fonts URL or @font-face declaration was detectable** via WebFetch (external CSS not accessible). Inferred system font or proprietary font matching the clean sans-serif aesthetic:

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
             'Helvetica Neue', Arial, sans-serif;
```

Note: The visual aesthetic suggests a humanist sans-serif (possibly Apercu, Inter, or a custom typeface). The design does not use any distinct serif for display — it is uniformly sans-serif.

### Type Scale

| Token | Value (rem) | Value (px) | Usage |
|-------|------------|-----------|-------|
| `--text-xs` | `0.75rem` | 12px | Copyright, labels, tiny captions |
| `--text-sm` | `0.875rem` | 14px | Navigation links, card descriptions, button text |
| `--text-base` | `1rem` | 16px | Body copy |
| `--text-lg` | `1.125rem` | 18px | Feature section body, promo body copy |
| `--text-xl` | `1.25rem` | 20px | Hero subheadline, feature card titles |
| `--text-2xl` | `1.5rem` | 24px | Testimonial quote |
| `--text-3xl` | `1.875rem` | 30px | Medium section headings |
| `--text-4xl` | `2.25rem` | 36px | Section headings (Features title, Blog title) |
| `--text-5xl` | `3rem` | 48px | Final CTA headline |
| `--text-6xl` | `3.75rem` | 60px | Hero headline (large display) |

Hero headline uses `clamp(2.25rem, 5vw, 3.75rem)` for fluid responsive scaling.

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `--weight-regular` | `400` | Body copy |
| `--weight-medium` | `500` | Ghost button labels, subtle emphasis |
| `--weight-semibold` | `600` | Primary buttons, blog categories, footer headings |
| `--weight-bold` | `700` | All headings (H1–H3), card titles, CTA headlines |

### Letter Spacing & Text Transform
- Category labels: `text-transform: uppercase; letter-spacing: 0.05em` — "Contact Collector", "Room Blocks", blog categories
- Footer headings: `text-transform: uppercase; letter-spacing: 0.08em`
- Logo/brand marks: no transform (natural case)

### Line Heights
- Hero headline: `1.1` (tight, display)
- Section headings: `1.15`–`1.2`
- Body copy: `1.6` (comfortable reading)
- Testimonial quote: `1.5`
- Card descriptions: `1.5`

---

## Spacing Scale

| Token | Value | px equiv |
|-------|-------|---------|
| `--space-1` | `0.25rem` | 4px |
| `--space-2` | `0.5rem` | 8px |
| `--space-3` | `0.75rem` | 12px |
| `--space-4` | `1rem` | 16px |
| `--space-6` | `1.5rem` | 24px |
| `--space-8` | `2rem` | 32px |
| `--space-10` | `2.5rem` | 40px |
| `--space-12` | `3rem` | 48px |
| `--space-16` | `4rem` | 64px |
| `--space-20` | `5rem` | 80px |
| `--space-24` | `6rem` | 96px |

### Section Padding Pattern
- Full-width sections: `padding: 80px 64px` (5rem × 4rem)
- Hero section: `padding: 96px 64px` (6rem × 4rem)
- Navigation: `padding: 16px 32px`

---

## Border & Radius Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `4px` | Small elements, inputs |
| `--radius-md` | `8px` | Cards (tight), registry product cards |
| `--radius-lg` | `12px` | Blog cards, dropdown menus, image treatment |
| `--radius-xl` | `16px` | Feature cards, promotional sections, template cards |
| `--radius-pill` | `9999px` | All buttons (fully rounded pill shape) |

**Key observation:** Joy uses pill-shaped buttons exclusively — this is the primary brand button shape. No square or slightly-rounded buttons detected.

### Border Values
- Ghost button border: `1px solid rgba(0,0,0,0.15)`
- Footer divider: `1px solid rgba(255,255,255,0.1)`
- No card borders detected — cards use shadow only

---

## Shadow Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-nav` | `0 1px 3px rgba(0,0,0,0.06)` | Sticky navigation bar |
| `--shadow-card` | `0 2px 8px rgba(0,0,0,0.08)` | Feature cards, blog cards (resting) |
| `--shadow-card-hover` | `0 8px 24px rgba(0,0,0,0.12)` | Feature/blog cards on hover |
| `--shadow-dropdown` | `0 8px 32px rgba(0,0,0,0.12)` | Mega-menu dropdown |
| `--shadow-btn-hover` | `0 4px 12px rgba(79,107,203,0.3)` | Primary button hover (blue-tinted) |

---

## Motion Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | `150ms` | Simple hover color transitions |
| `--duration-base` | `250ms` | Card lifts, dropdown reveals, overlay fades |
| `--duration-slow` | `400ms` | Complex entrance animations |
| `--ease-out` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Most hover/exit transitions |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Dropdown menu, overlay transitions |

(Exact easing curves are estimated; external CSS not directly accessible)

---

## Layout Tokens

| Property | Value | Notes |
|----------|-------|-------|
| Max content width | `1200px` (estimated) | Standard for this type of platform |
| Grid columns (desktop) | 4 | Feature cards, blog cards |
| Grid columns (tablet) | 2 | Feature cards |
| Grid columns (mobile) | 1 | All cards |
| Hero grid | 2 columns (50/50) | Text left, animation right |
| Split sections | 2 columns (50/50) | Contact Collector, Room Blocks, Baby Registry |
| Footer grid | 4 columns | Product, Resources, Brands, Company |

### Responsive Breakpoints (estimated)
- Mobile: `< 480px`
- Tablet: `480px – 768px`
- Desktop: `> 768px`
- Wide: `> 1280px`

---

## Component Tokens

### Button Variants
```
Primary (pill):
  background: #4F6BCB
  color: #FFFFFF
  border-radius: 9999px
  padding: 12px 24px
  font-size: 14px
  font-weight: 600
  hover: background #3d58b8, translateY(-1px), box-shadow 0 4px 12px rgba(79,107,203,0.3)

Ghost (pill):
  background: transparent
  color: #3d3d3d
  border: 1px solid rgba(0,0,0,0.15)
  border-radius: 9999px
  padding: 12px 24px
  font-size: 14px
  font-weight: 500
  hover: border-color #4F6BCB, color #4F6BCB

Text link:
  background: none
  color: #4F6BCB
  font-size: 14px
  font-weight: 600
  no border, no padding
  usage: card CTAs ("Explore Wedding Website →")
```

### Feature Card
```
background: #FFFFFF
border-radius: 16px
padding: 24px
box-shadow: 0 2px 8px rgba(0,0,0,0.08)
hover: translateY(-4px), box-shadow 0 8px 24px rgba(0,0,0,0.12)
transition: 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94)
image: border-radius 12px, aspect-ratio 4/3
```

### Blog Card
```
border-radius: 12px
overflow: hidden
box-shadow: 0 2px 8px rgba(0,0,0,0.08)
hover: box-shadow 0 8px 24px rgba(0,0,0,0.12)
image: aspect-ratio 16/9
category label: uppercase, letter-spacing 0.05em, color #4F6BCB, font-size 12px
```

### Navigation Badge ("New")
```
background: #4F6BCB
color: #FFFFFF
font-size: 10px
padding: 2px 6px
border-radius: 9999px (pill)
```

---

## Image System

**CDN pattern:**
```
https://withjoy.com/assets/public/marcom-prod/{section}/{name}.{ext}?m_resize=w{width}&opt=aggressive&ver=2
```

**Key image assets detected:**
- `home/hero/bodymovin/slurpee/bg_stripping.jpg` — Hero background (couple in urban setting, painterly treatment)
- `home/hero/wave.svg` — Desktop wave separator
- `home/hero/wave-mobile.svg` — Mobile wave separator
- `home/studio-banner/flower{1-14}.png` — 14 individual floating flower PNGs
- `home/studio-banner/mom-daughter-purple-poster.jpg`
- `home/studio-banner/hero-wildflowers-mom-grandma.png`
- `home/studio-banner/hero-wildflowers-mom-son.png`

**Responsive image sizing:**
```
?m_resize=w600   — mobile/thumbnail
?m_resize=w1400  — full desktop
?opt=aggressive  — aggressive compression
?ver=2           — cache-busting version parameter
```
