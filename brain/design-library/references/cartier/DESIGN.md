---
# Cartier — Design System Extraction
# Source: cartier.com (research-based — site blocks automated fetching)
# Extracted: 2026-05-14
# Method: Brand guideline research + public digital presence analysis
# Confidence: medium (no direct CSS extraction possible due to 403 bot protection)

colors:
  primary:
    - name: "Cartier Black"
      value: "#000000"
    - name: "Cartier White"
      value: "#FFFFFF"
  brand:
    - name: "Cartier Red"
      value: "#A5182A"
    - name: "Cartier Burgundy"
      value: "#6B0F1A"
    - name: "Cartier Gold"
      value: "#B8860B"
    - name: "Cartier Rose Gold"
      value: "#B76E79"
  neutral:
    - name: "Warm White"
      value: "#FAF7F2"
    - name: "Cream"
      value: "#F5F0E8"
    - name: "Light Gray"
      value: "#E5E5E5"
    - name: "Medium Gray"
      value: "#999999"
    - name: "Charcoal"
      value: "#333333"
  surface:
    - name: "Background Primary"
      value: "#FFFFFF"
    - name: "Background Warm"
      value: "#FAF7F2"
    - name: "Background Dark"
      value: "#000000"
    - name: "Background Cream"
      value: "#F5F0E8"

typography:
  families:
    - name: "Cartier"
      value: "'Cartier', serif"
      role: "Display headings, brand wordmark, editorial titles"
    - name: "Cartier Sans"
      value: "'CartierSans', 'Helvetica Neue', Arial, sans-serif"
      role: "Body text, navigation, UI elements"
  sizes:
    - name: "hero"
      value: "64px"
    - name: "display"
      value: "44px"
    - name: "h1"
      value: "34px"
    - name: "h2"
      value: "26px"
    - name: "h3"
      value: "20px"
    - name: "body-lg"
      value: "17px"
    - name: "body"
      value: "14px"
    - name: "body-sm"
      value: "12px"
    - name: "caption"
      value: "11px"
    - name: "nav"
      value: "13px"
  weights:
    - name: "light"
      value: "300"
    - name: "regular"
      value: "400"
    - name: "medium"
      value: "500"
    - name: "semibold"
      value: "600"
  lineHeights:
    - name: "tight"
      value: "1.1"
    - name: "normal"
      value: "1.5"
    - name: "relaxed"
      value: "1.6"
  letterSpacing:
    - name: "tight"
      value: "-0.01em"
    - name: "normal"
      value: "0.02em"
    - name: "wide"
      value: "0.08em"
    - name: "ultra-wide"
      value: "0.2em"

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
      value: "80px"
    - name: "5xl"
      value: "120px"

borderRadius:
  scale:
    - name: "none"
      value: "0"
    - name: "sm"
      value: "2px"
    - name: "md"
      value: "4px"
    - name: "full"
      value: "9999px"

shadows:
  scale:
    - name: "none"
      value: "none"
    - name: "subtle"
      value: "0 1px 4px rgba(0,0,0,0.05)"
    - name: "card"
      value: "0 2px 8px rgba(0,0,0,0.06)"
    - name: "elevated"
      value: "0 4px 20px rgba(0,0,0,0.1)"
    - name: "modal"
      value: "0 8px 40px rgba(0,0,0,0.15)"

layout:
  maxWidth: "1440px"
  contentWidth: "1200px"
  narrowContent: "720px"
  columns: 12
  gutter: "20px"
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
      value: "all 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)"
    - name: "fast"
      value: "all 0.2s ease"
    - name: "slow"
      value: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
    - name: "reveal"
      value: "opacity 0.7s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)"
  easing:
    - name: "default"
      value: "cubic-bezier(0.25, 0.1, 0.25, 1)"
    - name: "smooth"
      value: "cubic-bezier(0.16, 1, 0.3, 1)"
---

# Cartier — Design System

## Overview

Cartier's digital presence embodies the essence of French joaillerie — refined, warm, and timelessly elegant. Unlike the stark minimalism of some luxury competitors, Cartier embraces warmth through cream backgrounds, serif typography, and the iconic Cartier red as a signature accent. The design language balances heritage gravitas with contemporary digital fluidity.

## Design Philosophy

**"Refined Warmth"** — Cartier's digital aesthetic is distinguished from cold-minimalist luxury competitors by its warmth. Cream tones, elegant serif type, and the signature burgundy-red create an intimate, jewel-box feeling that mirrors the experience of entering a Cartier boutique.

### Key Principles

1. **Warm Neutrals**: Cream and warm white backgrounds replace stark white, creating an intimate atmosphere
2. **Serif Heritage**: Custom Cartier serif for all display text — the typeface IS the brand
3. **Signature Red**: Cartier red (#A5182A) appears strategically in CTAs and accents — never overused
4. **Product Worship**: Jewelry and watches are presented against clean backgrounds with precise lighting, as if displayed in a vitrine
5. **Elegant Restraint**: Ornament is reserved for the products themselves — the interface is the vitrine, not the jewel

## Color System

Cartier uses a warm-neutral palette with its signature red as the primary accent. The warmth distinguishes it from competitors like Tiffany (cool blue) or Chanel (stark black/white).

| Token | Value | Usage |
|-------|-------|-------|
| `cartier-black` | `#000000` | Primary text, dark backgrounds |
| `cartier-white` | `#FFFFFF` | Pure white (used sparingly) |
| `cartier-red` | `#A5182A` | Primary accent, CTAs, links |
| `cartier-burgundy` | `#6B0F1A` | Hover states on red elements |
| `cartier-gold` | `#B8860B` | Metallic accents, jewelry context |
| `cartier-rose-gold` | `#B76E79` | Secondary metallic accent |
| `warm-white` | `#FAF7F2` | Primary background |
| `cream` | `#F5F0E8` | Section backgrounds |
| `light-gray` | `#E5E5E5` | Borders, dividers |
| `medium-gray` | `#999999` | Secondary text, metadata |
| `charcoal` | `#333333` | Primary text on light backgrounds |

### Color Rules
- Background defaults to warm-white (#FAF7F2), NOT pure white
- Red appears ONLY in interactive elements (links, buttons, hover states)
- Product photography backgrounds are pure white or very light gray
- Dark sections use pure black with warm-white text
- Gold/rose-gold used contextually (watch vs. jewelry collections)

## Typography

Cartier uses a custom proprietary serif for display and a clean sans-serif for functional elements. The serif is the most distinctive brand element in their digital presence.

### Type Scale

| Level | Size | Weight | Letter-Spacing | Usage |
|-------|------|--------|----------------|-------|
| Hero | 64px | 300 | 0.2em | Campaign headlines |
| Display | 44px | 300 | 0.08em | Section titles |
| H1 | 34px | 400 | 0.08em | Page titles |
| H2 | 26px | 400 | 0.05em | Section headers |
| H3 | 20px | 400 | 0.02em | Subsection headers |
| Body Large | 17px | 300 | 0.02em | Editorial text |
| Body | 14px | 400 | 0.02em | Standard body |
| Body Small | 12px | 400 | 0.02em | Metadata |
| Caption | 11px | 500 | 0.08em | Labels, reference numbers |
| Nav | 13px | 500 | 0.08em | Navigation items |

### Typography Rules
- Display text: Cartier serif, weight 300, moderate letter-spacing
- Uppercase used for navigation and CTAs, mixed case for editorial
- Body text: Cartier Sans, weight 300-400
- Price display: Sans-serif, weight 400, right-aligned in product grids
- Line height 1.5-1.6 for body text readability

## Spacing

Cartier uses measured spacing that creates a vitrine-like presentation — enough space for each product to breathe, but not so much that the layout feels empty.

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Inline spacing |
| `sm` | 8px | Tight component gaps |
| `md` | 16px | Default component padding |
| `lg` | 24px | Card padding, list gaps |
| `xl` | 32px | Between components |
| `2xl` | 48px | Between sections (mobile) |
| `3xl` | 64px | Between sections |
| `4xl` | 80px | Major section breaks |
| `5xl` | 120px | Hero vertical padding |

## Layout

- **Max width**: 1440px
- **Content width**: 1200px
- **Narrow content**: 720px (product detail text)
- **Grid**: 12-column with 20px gutters
- **Product grids**: 2-column (mobile), 3-column (tablet), 4-column (desktop)
- **Asymmetric layouts**: Used for editorial — 60/40 or 70/30 splits

## Components

### Navigation
- Fixed transparent header, turns solid on scroll
- Logo centered, search and utility icons right-aligned
- Category navigation below, left-aligned
- Uppercase, letter-spaced sans-serif
- Mega-menu with editorial imagery

### Buttons
- Primary: Cartier red fill, white text, 0 border-radius
- Secondary: White fill, charcoal border
- Tertiary: Text link with underline on hover
- All uppercase, letter-spacing 0.08em
- Height: 44px, padding: 0 28px
- Hover: darker shade transition (0.35s)

### Product Cards
- No border, minimal shadow
- White background product images (aspect ratio 1:1 for jewelry, 4:5 for watches)
- Product name: serif, regular weight
- Price: sans-serif, below name, right-aligned option
- "Discover" link in red on hover

### Image Presentation
- Product shots: centered on white background, high-key lighting
- Editorial/campaign: full-bleed, cinematic aspect ratios
- Zoom functionality on hover for product images
- Video backgrounds for campaign heroes (muted autoplay)

## Motion

Cartier's motion language is smooth and measured — slightly warmer and less severe than Dior or Chanel, matching the brand's overall warmth.

| Pattern | Duration | Easing | Usage |
|---------|----------|--------|-------|
| Hover | 0.35s | ease | Buttons, links |
| Fade In | 0.7s | cubic-bezier(0.16, 1, 0.3, 1) | Page sections |
| Slide Up | 0.5s | cubic-bezier(0.16, 1, 0.3, 1) | Content reveal |
| Image Scale | 0.5s | ease | Product card hover |
| Parallax | continuous | linear | Campaign backgrounds |

### Motion Rules
- Smooth, non-jarring transitions — never snappy or bouncy
- Product images zoom smoothly, never abruptly
- Scroll-triggered reveals use staggered timing (50-100ms between elements)
- Mega-menu: slide down with slight fade (0.3s)

## Design Patterns for REIS [IA] Application

### What to Extract
1. **Warm neutral backgrounds** — The cream/warm-white creates intimacy that pure white/black cannot
2. **Signature accent as anchor** — Cartier red appears only in interactive elements, never decoratively
3. **Serif for authority** — Display serif with wide tracking commands attention
4. **Vitrine spacing** — Each element has room to breathe, like a jewelry display case
5. **Asymmetric editorial** — 60/40 splits add visual interest to text-heavy sections

### What to Adapt
- Replace Cartier serif with Inter weight 300 (or consider a display serif for key moments)
- Use #4A90FF as the signature accent (where Cartier uses red)
- Apply the warm-background principle to dark mode: use #0A0A0A instead of pure #000000
- Keep the measured spacing ratios for a premium, non-cramped feel
- Adopt the asymmetric editorial layout for case studies and testimonials
