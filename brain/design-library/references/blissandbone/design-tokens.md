# Bliss & Bone — Design Tokens
**Source:** https://blissandbone.com
**Captured:** 2026-05-01
**Method:** WebFetch rendered HTML + CDN image visual analysis (14 images analyzed)

---

## Color System

### Primary Site Chrome (light mode — main UI)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-white` | `#FFFFFF` | Pure white surfaces |
| `--color-ivory` | `#F7F4EE` | Primary background, warm off-white |
| `--color-cream` | `#EDE9E0` | Card backgrounds, paper stock simulation |
| `--color-linen` | `#E5DED4` | Parchment tone, envelope/card face |
| `--color-sand` | `#D4C9B8` | Warm neutral borders, dividers |
| `--color-stone` | `#B5A898` | Muted warm grey |
| `--color-taupe` | `#9C8B7A` | Body text on light bg, secondary labels |
| `--color-mocha` | `#7A6B5D` | Captions, metadata text |
| `--color-bark` | `#5C4D3C` | Dark accent on light surfaces |
| `--color-charcoal` | `#2C2822` | Primary headings, near-black warm |
| `--color-black` | `#1A1713` | Deep warm black, maximum contrast |

### Dark Mode Palette (template designs — "Amber & Elgin" etc.)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-dark-bg` | `#1E1E1E` | Near-black canvas |
| `--color-dark-surface` | `#2A2A2A` | Card on dark bg |
| `--color-dark-overlay` | `rgba(20,20,20,0.72)` | Photo overlay, medium |
| `--overlay-dark-light` | `rgba(15,12,10,0.40)` | Light overlay on photo |
| `--overlay-dark-medium` | `rgba(15,12,10,0.62)` | Medium — botanical photos |
| `--overlay-dark-heavy` | `rgba(15,12,10,0.78)` | Heavy — text readability on photo |
| `--overlay-warm-tint` | `rgba(40,32,20,0.55)` | Warm-toned dark, slight sepia |
| `--overlay-olive-tint` | `rgba(28,38,20,0.50)` | Olive-toned dark overlay |
| `--overlay-vignette` | `radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)` | Vignette effect |

### Template Accent Palettes (seen in design collection showcase)

**Olive / Forest Green** (Cecilia & James template, Vivienne Nash dark template)

| Token | Hex | Notes |
|-------|-----|-------|
| `--color-olive-deep` | `#3D4A2E` | Hero bg, darkest forest tone |
| `--color-olive-mid` | `#5A6B40` | Mid botanical tone |
| `--color-olive-light` | `#7A8E5E` | Lighter botanical accent |
| `--color-sage` | `#A8B899` | Light sage, invitation paper |

**Cobalt Blue** (April & Wilson template)

| Token | Hex | Notes |
|-------|-----|-------|
| `--color-cobalt` | `#2140C4` | Saturated royal/cobalt blue — hero bg |
| `--color-cobalt-light` | `#3D5AD4` | Lighter cobalt for accents |

**Warm Earth / Sienna** (modern invitations thumbnail, terracotta card)

| Token | Hex | Notes |
|-------|-----|-------|
| `--color-sienna` | `#8B6B5A` | Warm brown card bg |
| `--color-mushroom` | `#C4B4A0` | Warm greige |
| `--color-parchment` | `#F2EDE3` | Aged paper tone |

**Marble / Stone textures** (Abigail & Gregory template)

| Token | Hex | Notes |
|-------|-----|-------|
| `--color-marble-base` | `#E8E4DC` | Marble white bg, warm cast |
| `--color-marble-vein` | `#C8C0B8` | Marble veining, light grey |
| `--color-marble-gold-vein` | `#D4C49A` | Gold-toned veining seen in marble bg |

**Beige / Taupe** (Elodie & Beckett, general invitation paper)

| Token | Hex | Notes |
|-------|-----|-------|
| `--color-linen-dark` | `#D8CFBF` | Envelope paper stock |
| `--color-khaki` | `#B8A98A` | Warm khaki for envelopes |

---

## Typography System

### Font Families

| Role | Inferred Family | Characteristics |
|------|----------------|-----------------|
| **Display Serif** | Cormorant Garamond / Canela / Freight Display | High-contrast, extreme hairline-to-thick-stroke ratio. Ultra-light weight (300). The defining typographic signature. |
| **Script / Calligraphic** | Great Vibes / Alex Brush / Lovers Quarrel | Flowing calligraphy for name connectors and romantic script headlines |
| **Body Serif** | EB Garamond / Cormorant | Readable editorial serif for invitation copy text |
| **UI Sans** | Jost / Raleway / Futura | Light weight geometric sans for labels, navigation, CTAs |
| **Accent Script** | Custom calligraphic (possibly Signatura Monoline or similar) | Used for "agatha & LOGAN" style mixed treatments |

**Typographic Signature:** The brand's defining move is mixing a high-contrast display serif in ALL CAPS with a flowing italic script for connective words ("and", "of", "&"). This creates dramatic tension between geometric precision and calligraphic softness.

### Type Scale

| Token | Size | Usage |
|-------|------|-------|
| `--text-hero` | `clamp(3rem, 8vw, 7rem)` | Full-bleed hero headline |
| `--text-display` | `clamp(2rem, 5vw, 4.5rem)` | Section headings |
| `--text-h1` | `clamp(1.75rem, 4vw, 3.5rem)` | Page titles |
| `--text-h2` | `clamp(1.25rem, 2.5vw, 2rem)` | Sub-sections |
| `--text-h3` | `1.25rem` | Card titles |
| `--text-body-lg` | `1.125rem` | Testimonials, intros |
| `--text-body` | `1rem` | Body copy |
| `--text-sm` | `0.875rem` | Secondary text, nav links |
| `--text-xs` | `0.75rem` | Invitation card copy, captions |
| `--text-label` | `0.6875rem` | ALL CAPS tracking labels (11px) |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `--weight-light` | `300` | Primary weight for display serif — creates the luxury feel |
| `--weight-regular` | `400` | Body text |
| `--weight-medium` | `500` | Emphasis, button text |
| `--weight-semibold` | `600` | Rare, for functional UI only |

### Letter Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--tracking-tightest` | `-0.02em` | Display headlines |
| `--tracking-tight` | `-0.01em` | Large headings |
| `--tracking-normal` | `0em` | Body text |
| `--tracking-wide` | `0.05em` | Invitation detail copy |
| `--tracking-wider` | `0.1em` | Navigation links |
| `--tracking-widest` | `0.2em` | ALL CAPS labels, footer headings |

### Typography Patterns

**Pattern A — Mixed Case Editorial (most common):**
```
VIVIENNE NASH &       ← ALL CAPS thin sans or serif
SEBASTIEN KENT        ← ALL CAPS thin sans or serif
```

**Pattern B — Serif + Script hybrid:**
```
agatha               ← flowing calligraphic script
& LOGAN              ← high-contrast display serif, ALL CAPS
```

**Pattern C — Large serif with italic connector:**
```
THE MARRIAGE of      ← CAPS serif, "of" in italic
BRIE and LUCAS       ← CAPS serif, "and" in italic script
```

**Pattern D — Calligraphic names only:**
```
Cecilia and James    ← full calligraphic script, italic
```

**Pattern E — Monogram / initials in circle:**
Circular text badge, 160px diameter, 1px white border, serif initials centered, ALL CAPS name running arc

---

## Spacing System

| Token | Value | Pixels |
|-------|-------|--------|
| `--space-1` | `0.25rem` | 4px |
| `--space-2` | `0.5rem` | 8px |
| `--space-3` | `0.75rem` | 12px |
| `--space-4` | `1rem` | 16px |
| `--space-5` | `1.25rem` | 20px |
| `--space-6` | `1.5rem` | 24px |
| `--space-8` | `2rem` | 32px |
| `--space-10` | `2.5rem` | 40px |
| `--space-12` | `3rem` | 48px |
| `--space-16` | `4rem` | 64px |
| `--space-20` | `5rem` | 80px |
| `--space-24` | `6rem` | 96px |
| `--space-32` | `8rem` | 128px |
| `--space-40` | `10rem` | 160px |

Section padding pattern: `var(--space-24) 0` (96px top/bottom) for major sections.

---

## Shadow System

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-card` | `0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)` | Subtle card lift |
| `--shadow-lifted` | `0 12px 40px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.06)` | Invitation card, floating |
| `--shadow-float` | `0 24px 64px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.08)` | Device mockups, heavy float |

Note: Shadows lean slightly warm (no cold blue-grey cast). The overall impression is of physical objects under warm light.

---

## Border System

| Token | Value | Usage |
|-------|-------|-------|
| `--border-hair` | `0.5px solid` | Hairline, maximum delicacy |
| `--border-thin` | `1px solid` | Standard UI borders |
| `--border-standard` | `1.5px solid` | Slightly more prominent |
| `--radius-none` | `0` | Cards (completely flat edges) |
| `--radius-sm` | `2px` | Buttons |
| `--radius-md` | `4px` | Input fields |
| `--radius-lg` | `8px` | Device frames |
| `--radius-full` | `9999px` | Pills, badges |

Key observation: invitation cards have NO border-radius — flat corners are essential to the print-authenticity aesthetic.

---

## Motion Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | `150ms` | Hover micro-responses |
| `--duration-base` | `250ms` | Standard transitions |
| `--duration-slow` | `400ms` | Image scale on hover |
| `--duration-slower` | `600ms` | Carousel transitions, fade-in |
| `--duration-crawl` | `900ms` | Full-page entrance |
| `--ease-out` | `cubic-bezier(0.0, 0.0, 0.2, 1.0)` | Standard deceleration |
| `--ease-in-out` | `cubic-bezier(0.4, 0.0, 0.2, 1.0)` | Symmetric motion |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1.0)` | Slight overshoot |
| `--ease-editorial` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Smooth editorial glide |

---

## Aspect Ratios

| Usage | Ratio |
|-------|-------|
| Wedding invitation card | `5 / 7` |
| Envelope | `7 / 5` |
| Desktop monitor | `16 / 10` |
| Laptop | `16 / 10` |
| Phone mockup | `9 / 19` |
| Product section image | `4 / 3` |
| Circular monogram badge | `1 / 1` |

---

## Layout System

| Token | Value |
|-------|-------|
| `--max-width` | `1200px` |
| `--max-width-text` | `700px` |
| `--gutter` | `1.5rem` (24px) |
| `--gutter-lg` | `2.5rem` (40px) |

Grid patterns observed:
- **Hero:** `grid-template-columns: 1fr 1fr` — text left, image carousel right
- **Product categories:** `repeat(3, 1fr)` with `gap: 2rem`
- **Footer:** `repeat(5, 1fr)` — five equal columns
- **Blog resources:** `repeat(3, 1fr)` or `repeat(4, 1fr)` thumbnail grid
- **Template showcase (wedding websites):** `repeat(4, 1fr)` at desktop

---

## Texture / Material Tokens

| Texture | Description | CSS approach |
|---------|-------------|--------------|
| Paper grain | Fine noise on ivory/cream backgrounds | SVG feTurbulence or PNG overlay at 3–6% opacity |
| Marble veining | Warm white marble with subtle golden veins | Background-image: marble texture PNG |
| Fabric/Satin | Dark silk texture for premium templates | Background-image + subtle CSS gradient highlight |
| Aged parchment | Speckled, slightly warm | Background-color + grain overlay |
| Linen weave | Fine textile pattern | Very subtle repeating pattern or filter |

---

## Botanical Color Signatures (from photography)

Greens used in botanical photography and overlays:
- Eucalyptus: `#7A9B72` (muted sage green leaves)
- Tropical leaf dark: `#2E3D28` (near-black dark green, desaturated)
- Palm shadow: `rgba(40,60,30,0.15)` (cast shadow on warm bg)
- Pampas grass: `#D4C8A8` (warm beige/gold dried grass tone)
- Dried botanical: `#B8A070` (dried tan-gold for stems/branches)
