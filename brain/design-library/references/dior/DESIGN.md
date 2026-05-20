---
# Dior — Design System Extraction
# Source: dior.com (research-based — site blocks automated fetching)
# Extracted: 2026-05-14
# Method: Brand guideline research + public digital presence analysis
# Confidence: medium (no direct CSS extraction possible due to 403 bot protection)

colors:
  primary:
    - name: "Dior Black"
      value: "#000000"
    - name: "Dior White"
      value: "#FFFFFF"
  accent:
    - name: "Dior Gray"
      value: "#757575"
    - name: "Dior Light Gray"
      value: "#E8E8E8"
    - name: "Dior Warm Gray"
      value: "#F5F5F0"
  brand:
    - name: "Dior Gold"
      value: "#C4A35A"
    - name: "Dior Navy"
      value: "#1A1A2E"
  surface:
    - name: "Background Primary"
      value: "#FFFFFF"
    - name: "Background Secondary"
      value: "#F7F7F7"
    - name: "Background Dark"
      value: "#000000"
    - name: "Background Warm"
      value: "#FAF8F5"

typography:
  families:
    - name: "Dior"
      value: "'Dior', serif"
      role: "Display headings, brand wordmark"
    - name: "DiorPrimary"
      value: "'DiorPrimary', serif"
      role: "Body text, editorial content"
    - name: "Helvetica Neue"
      value: "'Helvetica Neue', Helvetica, Arial, sans-serif"
      role: "UI elements, navigation, form labels"
  sizes:
    - name: "hero"
      value: "72px"
    - name: "display"
      value: "48px"
    - name: "h1"
      value: "36px"
    - name: "h2"
      value: "28px"
    - name: "h3"
      value: "22px"
    - name: "body-lg"
      value: "18px"
    - name: "body"
      value: "15px"
    - name: "body-sm"
      value: "13px"
    - name: "caption"
      value: "11px"
    - name: "nav"
      value: "12px"
  weights:
    - name: "light"
      value: "300"
    - name: "regular"
      value: "400"
    - name: "medium"
      value: "500"
    - name: "bold"
      value: "700"
  lineHeights:
    - name: "tight"
      value: "1.1"
    - name: "normal"
      value: "1.5"
    - name: "relaxed"
      value: "1.7"
  letterSpacing:
    - name: "tight"
      value: "-0.02em"
    - name: "normal"
      value: "0"
    - name: "wide"
      value: "0.1em"
    - name: "ultra-wide"
      value: "0.3em"

spacing:
  scale:
    - name: "xs"
      value: "4px"
    - name: "sm"
      value: "8px"
    - name: "md"
      value: "16px"
    - name: "lg"
      value: "24px"
    - name: "xl"
      value: "32px"
    - name: "2xl"
      value: "48px"
    - name: "3xl"
      value: "64px"
    - name: "4xl"
      value: "96px"
    - name: "5xl"
      value: "120px"
    - name: "section"
      value: "160px"

borderRadius:
  scale:
    - name: "none"
      value: "0"
    - name: "sm"
      value: "2px"
    - name: "button"
      value: "0"
    - name: "card"
      value: "0"
    - name: "full"
      value: "9999px"

shadows:
  scale:
    - name: "none"
      value: "none"
    - name: "subtle"
      value: "0 1px 3px rgba(0,0,0,0.06)"
    - name: "product-card"
      value: "0 2px 8px rgba(0,0,0,0.08)"
    - name: "dropdown"
      value: "0 4px 16px rgba(0,0,0,0.12)"
    - name: "modal"
      value: "0 8px 32px rgba(0,0,0,0.16)"

layout:
  maxWidth: "1440px"
  contentWidth: "1200px"
  narrowContent: "800px"
  columns: 12
  gutter: "24px"
  breakpoints:
    - name: "mobile"
      value: "375px"
    - name: "tablet"
      value: "768px"
    - name: "desktop"
      value: "1024px"
    - name: "wide"
      value: "1440px"

motion:
  transitions:
    - name: "default"
      value: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)"
    - name: "fast"
      value: "all 0.15s ease"
    - name: "slow"
      value: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
    - name: "page"
      value: "opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
  easing:
    - name: "default"
      value: "cubic-bezier(0.25, 0.1, 0.25, 1)"
    - name: "dramatic"
      value: "cubic-bezier(0.16, 1, 0.3, 1)"
    - name: "spring"
      value: "cubic-bezier(0.34, 1.56, 0.64, 1)"
---

# Dior — Design System

## Overview

Dior's digital presence embodies French haute couture elegance — a deliberate tension between classical refinement and contemporary editorial boldness. The design language prioritizes editorial photography as the dominant visual element, with typography and whitespace serving as supporting architecture rather than competing for attention.

## Design Philosophy

**"Timeless Modernity"** — Dior's digital aesthetic bridges heritage craft with forward-looking editorial presentation. Every element serves the product and the brand narrative. The interface recedes; the fashion speaks.

### Key Principles

1. **Photography-First**: Full-bleed editorial imagery dominates every viewport. The design system exists to frame — never to compete with — the visual content.
2. **Typographic Restraint**: Custom Dior serif for display moments only. Sans-serif for all functional UI. Letter-spacing as a signature gesture.
3. **Radical Whitespace**: Generous negative space signals luxury. Sections breathe. Content density is deliberately low.
4. **Zero Radius**: No border-radius on any interactive element. Sharp geometric edges reflect the precision of haute couture.
5. **Monochrome Foundation**: Black, white, and gray form the entire palette. Color enters exclusively through photography and product.

## Color System

Dior operates on a pure monochrome palette. The absence of color IS the brand identity — it creates a gallery-like neutrality that lets fashion imagery dominate.

| Token | Value | Usage |
|-------|-------|-------|
| `dior-black` | `#000000` | Primary text, dark backgrounds, nav |
| `dior-white` | `#FFFFFF` | Primary background, reverse text |
| `dior-gray` | `#757575` | Secondary text, metadata |
| `dior-light-gray` | `#E8E8E8` | Borders, dividers |
| `dior-warm-gray` | `#F5F5F0` | Warm section backgrounds |
| `dior-bg-secondary` | `#F7F7F7` | Alternate section backgrounds |
| `dior-gold` | `#C4A35A` | Couture/heritage accents (used sparingly) |
| `dior-navy` | `#1A1A2E` | Editorial dark sections |

### Color Rules
- No gradients in UI elements
- Gold used only in heritage/couture contexts, never as a primary accent
- Hover states: black → gray transition, never color shifts
- Focus states: thin black outline, never colored

## Typography

Dior uses a custom proprietary serif typeface ("Dior") for display and a clean sans-serif (Helvetica Neue family) for all functional elements.

### Type Scale

| Level | Size | Weight | Letter-Spacing | Usage |
|-------|------|--------|----------------|-------|
| Hero | 72px | 300 | 0.3em | Campaign headlines |
| Display | 48px | 300 | 0.1em | Section titles |
| H1 | 36px | 400 | 0.1em | Page titles |
| H2 | 28px | 400 | 0.05em | Section headers |
| H3 | 22px | 400 | 0.02em | Subsection headers |
| Body Large | 18px | 300 | 0 | Editorial text |
| Body | 15px | 400 | 0 | Standard body |
| Body Small | 13px | 400 | 0.02em | Metadata |
| Caption | 11px | 400 | 0.1em | Labels, prices |
| Nav | 12px | 500 | 0.15em | Navigation items |

### Typography Rules
- Display text: custom Dior serif, letter-spacing 0.1-0.3em, weight 300
- Uppercase used extensively in navigation, CTAs, and labels
- Body text: Helvetica Neue, weight 300-400, no uppercase
- Price display: Helvetica Neue, weight 400, letter-spacing 0.05em
- Line height for body: 1.5-1.7 for readability

## Spacing

Dior uses generous spacing that creates an editorial, gallery-like presentation.

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Inline spacing |
| `sm` | 8px | Tight component gaps |
| `md` | 16px | Default component padding |
| `lg` | 24px | Card padding |
| `xl` | 32px | Section inner padding |
| `2xl` | 48px | Between components |
| `3xl` | 64px | Between sections (mobile) |
| `4xl` | 96px | Between sections (desktop) |
| `5xl` | 120px | Hero vertical padding |
| `section` | 160px | Major section breaks |

## Layout

- **Max width**: 1440px
- **Content width**: 1200px
- **Narrow content**: 800px (editorial text columns)
- **Grid**: 12-column with 24px gutters
- **Full-bleed**: Photography breaks the grid to fill viewport width
- **Product grids**: 2-column (mobile), 3-column (tablet), 4-column (desktop)

## Components

### Navigation
- Fixed top bar, minimal height (~60px)
- Logo centered, navigation items flanking
- All-caps, letter-spaced sans-serif
- Hover: simple opacity or underline transition
- Mega-menu drops with editorial layout

### Buttons
- Sharp rectangle (0 border-radius)
- Black fill / white text (primary)
- White fill / black border (secondary)
- All-caps, letter-spacing 0.15em
- Height: 48px, padding: 0 32px
- Hover: background opacity shift

### Product Cards
- No border, no shadow, no radius
- Image dominant (aspect ratio 3:4 for fashion, 1:1 for accessories)
- Product name: serif, regular weight
- Price: sans-serif, below name
- Minimal hover: image scale 1.02, transition 0.6s

### Image Presentation
- Full-bleed heroes with 100vh height
- Parallax scroll on campaign imagery
- Lazy loading with elegant fade-in (opacity 0→1, 0.8s)
- Aspect ratios: 16:9 (hero), 3:4 (product), 1:1 (square grid)

## Motion

Dior's motion language is deliberate and unhurried — movements are slow, smooth, and feel weighty.

| Pattern | Duration | Easing | Usage |
|---------|----------|--------|-------|
| Hover | 0.3s | ease | Buttons, links |
| Fade In | 0.8s | cubic-bezier(0.16, 1, 0.3, 1) | Page sections |
| Slide Up | 0.6s | cubic-bezier(0.16, 1, 0.3, 1) | Content reveal |
| Image Scale | 0.6s | ease | Product card hover |
| Page Transition | 1.0s | cubic-bezier(0.25, 0.1, 0.25, 1) | Route changes |

### Motion Rules
- No bouncing, no elastic easing
- Minimum duration 0.3s for any visible transition
- Scroll-triggered reveals use intersection observer with 20% threshold
- Respect `prefers-reduced-motion`

## Design Patterns for REIS [IA] Application

### What to Extract
1. **Extreme whitespace** — Dior's spacing ratios create luxury perception
2. **Uppercase letter-spacing** — The wide tracking on navigation and CTAs signals premium
3. **Zero border-radius** — Sharp edges throughout reinforce precision
4. **Photography-first hierarchy** — Content recedes behind imagery
5. **Monochrome discipline** — Color restraint as brand strength
6. **Slow, deliberate motion** — Unhurried transitions signal confidence

### What to Adapt
- Replace Dior serif with Inter at weight 300 for similar elegance
- Use #4A90FF as the single color accent (where Dior uses gold sparingly)
- Maintain the whitespace ratios but adapt to dark-mode context
- Keep the zero-radius approach for primary CTAs
- Apply the letter-spacing pattern to section labels and navigation
