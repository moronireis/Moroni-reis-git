---
# Louis Vuitton — Design System Extraction
# Source: louisvuitton.com (research-based — site blocks automated fetching)
# Extracted: 2026-05-14
# Method: Brand guideline research + public digital presence analysis
# Confidence: medium (no direct CSS extraction possible due to 403 bot protection)

colors:
  primary:
    - name: "LV Black"
      value: "#000000"
    - name: "LV White"
      value: "#FFFFFF"
  brand:
    - name: "LV Brown"
      value: "#6B4226"
    - name: "LV Tan"
      value: "#C19A6B"
    - name: "LV Monogram Brown"
      value: "#8B6914"
    - name: "LV Dark Brown"
      value: "#3C2415"
  neutral:
    - name: "Off White"
      value: "#F9F6F1"
    - name: "Light Beige"
      value: "#F2EDE7"
    - name: "Warm Gray"
      value: "#B0A89F"
    - name: "Medium Gray"
      value: "#8C8C8C"
    - name: "Dark Gray"
      value: "#333333"
  surface:
    - name: "Background Primary"
      value: "#FFFFFF"
    - name: "Background Warm"
      value: "#F9F6F1"
    - name: "Background Dark"
      value: "#000000"
    - name: "Background Editorial"
      value: "#1A1A1A"

typography:
  families:
    - name: "Louis Vuitton"
      value: "'LouisVuitton', serif"
      role: "Display headings, campaign titles"
    - name: "LV Body"
      value: "'LVBody', 'Neue Helvetica', 'Helvetica Neue', Helvetica, Arial, sans-serif"
      role: "Body text, navigation, UI elements"
  sizes:
    - name: "hero"
      value: "80px"
    - name: "display"
      value: "52px"
    - name: "h1"
      value: "38px"
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
      value: "11px"
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
      value: "1.05"
    - name: "heading"
      value: "1.15"
    - name: "normal"
      value: "1.5"
    - name: "relaxed"
      value: "1.65"
  letterSpacing:
    - name: "negative"
      value: "-0.03em"
    - name: "tight"
      value: "-0.01em"
    - name: "normal"
      value: "0"
    - name: "wide"
      value: "0.06em"
    - name: "ultra-wide"
      value: "0.15em"

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
    - name: "section"
      value: "140px"

borderRadius:
  scale:
    - name: "none"
      value: "0"
    - name: "sm"
      value: "2px"
    - name: "full"
      value: "9999px"

shadows:
  scale:
    - name: "none"
      value: "none"
    - name: "subtle"
      value: "0 1px 3px rgba(0,0,0,0.04)"
    - name: "card"
      value: "0 2px 10px rgba(0,0,0,0.06)"
    - name: "elevated"
      value: "0 6px 24px rgba(0,0,0,0.1)"
    - name: "modal"
      value: "0 12px 48px rgba(0,0,0,0.15)"

layout:
  maxWidth: "1600px"
  contentWidth: "1280px"
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
    - name: "ultra-wide"
      value: "1920px"

motion:
  transitions:
    - name: "default"
      value: "all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)"
    - name: "fast"
      value: "all 0.2s ease-out"
    - name: "slow"
      value: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
    - name: "hero"
      value: "opacity 1.2s ease, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)"
  easing:
    - name: "default"
      value: "cubic-bezier(0.25, 0.1, 0.25, 1)"
    - name: "dramatic"
      value: "cubic-bezier(0.16, 1, 0.3, 1)"
    - name: "elastic"
      value: "cubic-bezier(0.34, 1.56, 0.64, 1)"
---

# Louis Vuitton — Design System

## Overview

Louis Vuitton's digital presence is the most editorially ambitious of the major luxury houses. It merges fashion-forward art direction with a dense, magazine-like content structure. The design language is bolder than Dior or Cartier — larger type, stronger contrasts, more video, and more willingness to break conventional grid patterns for editorial impact.

## Design Philosophy

**"Art Meets Commerce"** — Under creative directors like Nicolas Ghesquiere and Pharrell Williams, LV's digital presence pushes closer to an art publication than a traditional e-commerce site. Campaign imagery dominates, type is oversized and expressive, and the monogram heritage provides instant brand recognition without requiring explicit branding.

### Key Principles

1. **Editorial Scale**: Oversized typography and full-viewport imagery create magazine-cover impact on every page
2. **Video-First Heroes**: Campaign heroes prioritize looping video over static imagery — motion is the default state
3. **Monogram as Texture**: The LV monogram appears as subtle texture, background pattern, and watermark — ubiquitous but never heavy-handed
4. **Contrast Maximalism**: LV embraces harder contrasts than most luxury peers — pure black on white, large type against full-bleed imagery
5. **Dense Navigation**: More categories visible at once than competitors — LV's breadth of product (fashion, leather goods, fragrance, watches, jewelry) requires a denser information architecture

## Color System

Louis Vuitton uses a high-contrast black-and-white palette with its heritage brown/tan as a contextual accent. The palette is warmer than Chanel but more neutral than Cartier.

| Token | Value | Usage |
|-------|-------|-------|
| `lv-black` | `#000000` | Primary text, dark backgrounds, nav |
| `lv-white` | `#FFFFFF` | Primary background, reverse text |
| `lv-brown` | `#6B4226` | Heritage accent, monogram contexts |
| `lv-tan` | `#C19A6B` | Secondary heritage accent, leather tones |
| `lv-monogram-brown` | `#8B6914` | Monogram-specific gold-brown |
| `lv-dark-brown` | `#3C2415` | Deep heritage, footer |
| `off-white` | `#F9F6F1` | Warm section backgrounds |
| `light-beige` | `#F2EDE7` | Card backgrounds, hover states |
| `warm-gray` | `#B0A89F` | Secondary text, borders |
| `medium-gray` | `#8C8C8C` | Metadata, timestamps |
| `dark-gray` | `#333333` | Primary text on light backgrounds |

### Color Rules
- Primary palette is strictly black + white for most contexts
- Brown/tan heritage colors appear only in leather goods and monogram-related content
- Campaign pages may introduce seasonal accent colors (always editorial, never UI)
- Product detail pages use pure white backgrounds
- Footer and "world of LV" sections use dark backgrounds

## Typography

LV uses a custom serif for display and a sans-serif for all functional elements. The display type is characteristically large — often 60-80px on desktop — creating immediate editorial impact.

### Type Scale

| Level | Size | Weight | Letter-Spacing | Usage |
|-------|------|--------|----------------|-------|
| Hero | 80px | 300 | -0.03em | Campaign headlines |
| Display | 52px | 300 | -0.01em | Section titles |
| H1 | 38px | 400 | 0 | Page titles |
| H2 | 28px | 400 | 0.02em | Section headers |
| H3 | 22px | 500 | 0.02em | Subsection headers |
| Body Large | 18px | 300 | 0 | Editorial text |
| Body | 15px | 400 | 0 | Standard body |
| Body Small | 13px | 400 | 0.01em | Metadata |
| Caption | 11px | 400 | 0.06em | Labels, prices |
| Nav | 11px | 500 | 0.15em | Navigation (uppercase) |

### Typography Rules
- Display sizes are larger than most luxury peers — LV uses scale for impact
- Negative letter-spacing on hero text creates density and modernity
- Navigation is very small (11px) and heavily tracked — a deliberate contrast against oversized display
- Body text is clean, legible, unpretentious
- Campaign type may use custom display fonts per collection (seasonal)

## Spacing

LV uses generous but not extreme spacing — the content density is higher than Dior or Hermes, reflecting the broader product range.

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Inline spacing |
| `sm` | 8px | Tight component gaps |
| `md` | 16px | Default padding |
| `lg` | 24px | Card padding |
| `xl` | 32px | Between components |
| `2xl` | 48px | Between sections (mobile) |
| `3xl` | 64px | Between sections |
| `4xl` | 80px | Major breaks |
| `5xl` | 120px | Hero padding |
| `section` | 140px | Major section divisions |

## Layout

- **Max width**: 1600px (wider than most luxury sites)
- **Content width**: 1280px
- **Narrow content**: 800px (editorial text)
- **Grid**: 12-column with 24px gutters
- **Product grids**: 2-column (mobile), 3-column (tablet), 4-column (desktop)
- **Editorial grids**: Asymmetric, broken-grid layouts for campaign content
- **Full-bleed**: Video heroes extend edge-to-edge on all viewports

## Components

### Navigation
- Fixed black header bar with white text
- Logo centered (or left-aligned depending on collection)
- Dense category system with multiple tiers
- Small (11px), heavily tracked, all-uppercase navigation text
- Mega-menu with editorial imagery and category trees
- Search prominently featured

### Buttons
- Primary: Black fill, white text, 0 border-radius
- Secondary: White fill, black border
- Link style: Underlined text links (common)
- All uppercase, letter-spacing 0.06em
- Height: 48px, padding: 0 32px
- Hover: inverse colors transition (0.4s)

### Product Cards
- Minimal styling — image is dominant
- White background product images (1:1 or 3:4)
- Product name: small, clean sans-serif
- Price below name, same size
- No hover animations on product images (differs from competitors)
- "Select" or color-swatch dots below price

### Video Heroes
- Full-viewport looping video (muted, autoplay)
- Text overlay: large white serif type with text-shadow
- CTA button overlaid on video
- Fade transitions between campaign videos
- Ken Burns effect on fallback static images

## Motion

LV's motion language is the most cinematic among luxury peers — longer durations, more video, more parallax, more scroll-triggered reveals.

| Pattern | Duration | Easing | Usage |
|---------|----------|--------|-------|
| Hover | 0.4s | ease | Buttons, links |
| Fade In | 0.8s | cubic-bezier(0.16, 1, 0.3, 1) | Page sections |
| Slide Up | 0.6s | cubic-bezier(0.16, 1, 0.3, 1) | Content reveal |
| Hero Reveal | 1.2s | cubic-bezier(0.16, 1, 0.3, 1) | Hero sections |
| Video Crossfade | 1.5s | ease | Campaign video transitions |
| Parallax | continuous | linear | Background images |

### Motion Rules
- Video is the default hero format — static images are the fallback
- Transitions are unhurried — minimum 0.4s for any visible change
- Scroll-triggered reveals stagger at 100ms intervals
- Page transitions use full-screen fade (1.0s)
- Respect `prefers-reduced-motion`

## Design Patterns for REIS [IA] Application

### What to Extract
1. **Oversized display type** — LV's large headlines create instant editorial impact; apply to hero sections
2. **Video-first heroes** — Default to motion; static is the fallback, not the primary
3. **Negative letter-spacing** — Tight tracking on large type creates modernity and density
4. **High-contrast navigation** — Very small, tracked, uppercase nav against oversized content creates visual tension
5. **Dense-but-organized layout** — Higher content density than Dior/Hermes while maintaining clarity
6. **Wider max-width** — 1600px accommodates modern ultra-wide displays

### What to Adapt
- Use Inter at weight 300 with negative tracking (-0.03em) for hero text
- Apply the video-first hero principle to the main website (looping ambient video)
- Use the nav size contrast: tiny tracked navigation vs. large section headings
- #4A90FF as the accent, replacing LV's brown heritage tones
- Dark mode already aligns with LV's editorial dark sections
- Keep 0 border-radius on all CTAs for the sharp, confident feel
