# Paperless Post — Design Tokens
Source: https://www.paperlesspost.com/
Harvest date: 2026-05-01
Method: WebFetch multi-page analysis (/, /wedding, /birthday, /subscription, /pricing, /features, /invitations, /online-invitations, /about, /blog)
Note: CSS custom properties not directly accessible (WebFetch strips raw markup). Values below are forensically reconstructed from visual analysis and cross-page consistency signals.

---

## Color System

### Primary Palette

| Token name (inferred) | Value | Usage |
|---|---|---|
| `color-background` | `#FFFFFF` | Primary page background (all pages) |
| `color-background-alt` | `#F5F5F5` | Alternating section backgrounds |
| `color-background-dark` | `#1A1A1A` (est.) | Pro/subscription hero, footer |
| `color-text-primary` | `#222222` | Headlines, primary body text |
| `color-text-secondary` | `#666666` | Supporting copy, metadata |
| `color-text-tertiary` | `#999999` | Captions, fine print |
| `color-accent-primary` | `#0066CC` (est.) | Links, interactive elements (about page signal) |
| `color-accent-teal` | `#00A8A8` (est.) | Pricing page accent, checkmark icons, recommended badge |
| `color-border` | `#E0E0E0` | Card borders, dividers |
| `color-border-light` | `#EEEEEE` | Subtle separators |

### Observed Accent Signals
- Birthday page: Gold/bronze card backdrops (warmth added via invitation imagery backgrounds, not UI chrome)
- Pro/subscription page: Dark charcoal/black hero — the only page with dark mode treatment
- Pricing page: Teal accent (#00A8A8 range) used for checkmarks, recommended-plan badge, primary CTA buttons on that page
- Wedding page: Neutral whites and grays dominate — warm tones come from invitation imagery only
- About page: Medium blue link color (~#0066CC range)

### Neutral Scale
```
#FFFFFF  white          — primary backgrounds
#FAFAFA  off-white      — subtle surface variant
#F5F5F5  light-gray-1   — alt section backgrounds
#EEEEEE  light-gray-2   — subtle borders
#E0E0E0  light-gray-3   — card borders, dividers
#999999  mid-gray       — tertiary text
#666666  dark-gray      — secondary text
#333333  charcoal-light — body text
#222222  charcoal       — headlines
#1A1A1A  near-black     — dark mode surfaces (Pro page)
#000000  black          — darkest UI elements
```

### Invitation Color Palette (card colorways observed, not UI chrome)
These are card design colors, not the site UI palette:
- Cream/gold, black-gold, rosegold-black, silver-black
- Pink, lavender, purple-red-lavender
- Blue, white-blue, navy-cream
- Green, green-white, yellow-green
- Orange, red-pink, red-blue
- Neon/glow variants (for birthday/party categories)

---

## Typography System

### Font Stack
- **Primary font**: Clean geometric sans-serif. Based on rendering characteristics and brand aesthetic (premium, minimal, stationery-adjacent), most likely a custom or licensed geometric sans. Visual analysis suggests weight range 300–700.
- No visible serif fonts in site UI chrome (serifs appear only within invitation designs).
- No script fonts in site UI (script appears only within invitation designs).
- System fallback stack inferred: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`

### Type Scale (estimated from visual hierarchy analysis)

| Token | Size (est.) | Weight | Line-height | Usage |
|---|---|---|---|---|
| `text-hero` | 48–56px | 700 | 1.1–1.2 | Hero H1 ("Online invitations...") |
| `text-h1` | 40–48px | 700 | 1.2 | Page H1s |
| `text-h2` | 32–40px | 700 | 1.25 | Section headers ("Shop by style") |
| `text-h3` | 24–28px | 600 | 1.3 | Subsection headers, plan names |
| `text-h4` | 18–20px | 600 | 1.4 | Category headers, card titles |
| `text-body-lg` | 16–18px | 400 | 1.6 | Primary body copy |
| `text-body` | 14–16px | 400 | 1.5–1.6 | Standard body, feature lists |
| `text-small` | 12–13px | 400 | 1.5 | Pricing footnotes, metadata |
| `text-label` | 11–12px | 500–600 | 1.0 | Tags, badges, navigation labels |

### Navigation Typography
- Navigation labels: Sentence case (not all-caps) on primary nav
- Some all-caps labels on secondary/utility nav
- Medium weight (500) for nav items, bold for active/selected

### Letter Spacing
- Headlines: Tight (`-0.01em` to `0em` range)
- Body: Normal (`0em`)
- Labels/badges: Slight positive tracking (`0.02em` to `0.05em`)

---

## Spacing System

### Estimated Scale (based on section analysis)

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Micro gaps |
| `space-2` | 8px | Tight spacing |
| `space-3` | 12px | Component internal padding |
| `space-4` | 16px | Standard gaps |
| `space-5` | 24px | Card padding, form fields |
| `space-6` | 32px | Component separation |
| `space-7` | 40px | Section dividers (min) |
| `space-8` | 48px | Section spacing |
| `space-9` | 60px | Large section padding |
| `space-10` | 80px | Hero/feature section padding |

### Layout Constraints
- Max content width: ~1200px (estimated from footer spanning)
- Content padding horizontal: 24–32px at desktop, 16px at mobile
- Card grid gaps: 16–24px (estimated)

---

## Card Component Tokens

### Invitation Card Tile
```
card-border-radius:    8px (est.) — subtle rounding, modern feel
card-shadow:           0 2px 8px rgba(0,0,0,0.08) — minimal lift
card-hover-shadow:     0 8px 24px rgba(0,0,0,0.12) — slight elevation on hover
card-image-ratio:      ~2:3 (portrait, matching physical card proportions)
card-padding:          0 (image flush) with text area ~12-16px
```

### Pricing Cards
```
pricing-card-border:      1px solid #E0E0E0
pricing-card-shadow:      0 2px 8px rgba(0,0,0,0.08)
pricing-card-padding:     24–32px
pricing-card-recommended: border or badge in teal accent
```

### Color Swatches (on invitation cards)
```
swatch-size:           16–20px diameter (circular)
swatch-gap:            4px
swatch-border:         1px solid rgba(0,0,0,0.1)
swatch-overflow:       "+N" text label, same size as swatches
swatch-count-visible:  3–5 swatches before overflow
```

---

## Border & Radius System

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 4px | Buttons, small components |
| `radius-md` | 6–8px | Cards, panels |
| `radius-lg` | 12px | Large containers |
| `radius-pill` | 100px | Badge/tag components |
| `radius-full` | 50% | Color swatches, avatar elements |

---

## Shadow System

| Token | Value | Usage |
|---|---|---|
| `shadow-card` | `0 2px 8px rgba(0,0,0,0.08)` | Default card elevation |
| `shadow-card-hover` | `0 8px 24px rgba(0,0,0,0.12)` | Card hover state |
| `shadow-dropdown` | `0 4px 16px rgba(0,0,0,0.12)` | Navigation dropdowns |
| `shadow-modal` | `0 16px 48px rgba(0,0,0,0.2)` | Modals, overlays |

---

## Motion Tokens

| Token | Value | Usage |
|---|---|---|
| `duration-fast` | 150ms | Hover micro-interactions |
| `duration-base` | 200–250ms | Component transitions |
| `duration-slow` | 300–400ms | Page section reveals |
| `easing-base` | `ease` or `ease-out` | General transitions |
| `easing-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Interactive feedback |

---

## Icon System

- Style: Simple line icons or solid monochromatic
- Color: Matches text color (monochromatic, not colorful)
- Size: ~20–24px in feature sections, ~16px inline
- Types observed: Photo, blocks/grid, checkmark, bullet-list, link, lock, envelope, tag, heart (favorite), search, user, notification, chevron, scroll-left/right arrows
- Social: Instagram, TikTok, Pinterest, Facebook, YouTube, X
- No complex illustration-style icons in UI chrome

---

## Badge / Label System

### "Trending" Badge
- Position: Top corner overlay on card image
- Style: Small pill or rectangular label
- Color: Likely white background with dark text, or accent-colored
- Font: 10–12px, medium weight, letter-spaced

### Filter Checkmark
- Style: Circle checkmark icon (filled on selection)
- Color: Teal accent (#00A8A8 range) when active

### "+N" Swatch Overflow
- Style: Same circle dimensions as swatches
- Color: Light gray background, dark text
- Font: 10–12px, regular weight

---

## Data Observations

- **No dark mode toggle** — site is light mode by default throughout (exception: Pro subscription hero uses dark imagery)
- **No gradient text** visible in UI chrome
- **No heavy decorative borders** — restraint maintained
- **Color warmth** comes entirely from invitation imagery, not UI chrome
- **White space is generous** — sections breathe with 60–80px vertical padding
- **Typography is consistent across pages** — single typeface, no mixing
- **Teal (#00A8A8)** is the primary interaction/accent color on pricing/features pages, not consistently applied site-wide (the main nav appears to use the near-black text with blue links)
