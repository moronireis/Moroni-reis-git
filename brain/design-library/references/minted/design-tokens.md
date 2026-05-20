# Minted — Design Tokens
Source: https://www.minted.com/wedding-invitations
Harvested: 2026-05-02
Method: WebFetch visual analysis + URL/class extraction

---

## Color System

Minted uses CSS-in-JS (Emotion) with hashed class names (`.css-l088ss` pattern). No
raw CSS custom properties were exposed. Values below are reconstructed from visual analysis
with high confidence.

### Raw Palette

| Token Name (reconstructed) | Value | Role |
|---|---|---|
| `--color-ink` | `#2B2B2B` | Primary text, headings, borders (active), button fill |
| `--color-parchment` | `#FAFAF8` | Page background — warm off-white, NOT pure white |
| `--color-warm-white` | `#FFFFFF` | Card backgrounds, header, footer |
| `--color-cream` | `#F2EDE8` | Promo banner bg, email signup bg, warm section backgrounds |
| `--color-dust` | `#F0EBE5` | Product card image placeholder bg |
| `--color-border-light` | `#E8E4DF` | Dividers, card borders, nav bottom border |
| `--color-border-warm` | `#E5DDD5` | Promo banner bottom border |
| `--color-text-secondary` | `#5C5040` | Body copy, filter labels, card metadata, FAQ answers |
| `--color-text-muted` | `#8C7B6E` | Artist bylines, breadcrumb, footer links, label hints |
| `--color-text-faint` | `#C4B8AA` | Breadcrumb separators, footer legal, disabled states |
| `--color-badge-dark` | `#2B2B2B` | "New Collection" badge background |
| `--color-foil-gold-text` | `#8B6914` | Gold foil badge text |
| `--color-foil-gold-border` | `#D4AF37` | Gold foil badge border |
| `--color-foil-silver-text` | `#5A5A5A` | Silver foil badge text |
| `--color-foil-silver-border` | `#C0C0C0` | Silver foil badge border |
| `--color-star-gold` | `#C4A35A` | Testimonial star rating only |

### Color Notes

- **No blues, purples, or bright accent colors** anywhere in the UI chrome. The entire UI
  palette is warm neutrals from ink (#2B2B2B) to parchment (#FAFAF8).
- **Product images carry all the color.** The neutral shell lets invitation artwork dominate.
- Foil badge colors are the only "decorative" colors in the UI — warm gold (#D4AF37) and
  cool silver (#C0C0C0) serve as material indicators, not brand accents.
- Stars use a muted warm gold (#C4A35A), not a saturated yellow — consistent restraint.

---

## Typography System

### Font Families

| Family | Category | Usage |
|---|---|---|
| `Freight Text Pro` | Serif (display) | Product names, H1, H2, body copy, testimonials, italic emphasis |
| `Neue Haas Grotesk` | Sans-serif (UI) | Navigation, filter labels, badges, buttons, breadcrumbs, captions, footer |
| `Georgia` | Serif fallback | Freight Text Pro fallback |
| `Helvetica Neue / Arial` | Sans fallback | Neue Haas Grotesk fallback |

**Key insight:** Minted's dual-stack is the signature of premium print brands — a classical
editorial serif for product names and content, a clean grotesque for all UI chrome. The serif
carries warmth and artisan credibility; the grotesque signals precision and clarity.

### Type Scale

| Element | Font | Size | Weight | Style | Line Height | Letter Spacing | Transform |
|---|---|---|---|---|---|---|---|
| H1 (page heading) | Freight Text Pro | 28px | 400 | italic | 1.3 | normal | none |
| H2 (section heading) | Neue Haas Grotesk | 11px | 500 | normal | 1.2 | 0.12em | uppercase |
| Product name | Freight Text Pro | 15px | 400 | italic | 1.3 | normal | none |
| Artist byline | Neue Haas Grotesk | 12px | 400 | normal | 1.4 | normal | none |
| Nav link | Neue Haas Grotesk | 13px | 400 | normal | 1 | 0.04em | uppercase |
| Sub-nav link | Neue Haas Grotesk | 12px | 400 | normal | 1 | 0.06em | uppercase |
| Filter label | Neue Haas Grotesk | 13px | 400 | normal | 1.4 | 0.02em | none |
| Filter section heading | Neue Haas Grotesk | 11px | 500 | normal | 1.2 | 0.1em | uppercase |
| Badge text | Neue Haas Grotesk | 10px | 500 | normal | 1 | 0.04em | uppercase |
| Button text | Neue Haas Grotesk | 11px | 500 | normal | 1 | 0.1em | uppercase |
| Body / FAQ | Freight Text Pro | 15-16px | 400 | normal | 1.7 | normal | none |
| Footer heading | Neue Haas Grotesk | 11px | 500 | normal | 1.2 | 0.1em | uppercase |
| Footer link | Neue Haas Grotesk | 13px | 400 | normal | 1.5 | normal | none |
| Legal text | Neue Haas Grotesk | 11px | 400 | normal | 1.2 | 0.02em | none |
| Results count | Neue Haas Grotesk | 13px | 400 | normal | 1 | normal | none |
| Promo banner | Neue Haas Grotesk | 13px | 400 | normal | 1 | 0.02em | none |

### Typography Observations

- **The italic serif product name** is the single most recognizable typographic pattern.
  It evokes handwriting, calligraphy, and traditional stationery house naming conventions.
- **Tracked uppercase grotesque** (letter-spacing 0.06–0.14em) creates elegance in
  section labels without requiring a luxury font — pure spacing doing the work.
- **11px uppercase, weight 500** recurs constantly: section headings, filter titles, footer
  columns, button labels. This micro-type system is highly consistent.
- Font size range is tight: 10px (badge) → 28px (H1). No oversized display type.
- Line height 1.7 for body copy (Freight Text Pro) feels deliberately luxurious and readable.

---

## Spacing System

Reconstructed from visual analysis. Minted appears to use an 8px base grid.

| Token | Value | Usage |
|---|---|---|
| `--space-1` | `4px` | Card image gap, minor nudges |
| `--space-2` | `8px` | Badge padding, favorite button offset, filter option gap |
| `--space-3` | `12px` | Breadcrumb padding, filter option padding, thumbnail gap |
| `--space-4` | `16px` | Card meta padding, filter group padding, collections gap |
| `--space-5` | `20px` | Page edge padding (mobile) |
| `--space-6` | `24px` | Page horizontal padding, grid gap (horizontal), footer column gap |
| `--space-7` | `32px` | Grid vertical gap, footer bottom padding, trust row gap |
| `--space-8` | `40px` | Trust row padding |
| `--space-9` | `48px` | Section padding (top/bottom), FAQ section spacing |

### Layout Dimensions

| Component | Value |
|---|---|
| Max content width | 1440px |
| Page horizontal padding | 24px (desktop), 16px (mobile) |
| Sidebar width | 240px |
| Sidebar gap from main | 32px |
| Product grid gap (col) | 16px |
| Product grid gap (row) | 24px |
| Header height | 64px |
| Sub-nav height | 44px |
| Sticky offset (sidebar) | 108px (64px header + 44px subnav) |
| Card image aspect ratio | 4:5 (portrait A7 format) |
| Landscape card aspect | 5:4 (landscape A7 format) |
| Square card aspect | 1:1 (6x6 square format) |
| Category chip size | 72px diameter circle |
| Thumbnail height | ~60px (1:1 aspect, flex fill) |

### Grid Columns

| Breakpoint | Product Grid | Page Layout |
|---|---|---|
| > 1200px (desktop) | 4 columns | sidebar + main |
| 768–1200px (tablet) | 3 columns | sidebar + main |
| < 768px (mobile L) | 2 columns | single column |
| < 480px (mobile S) | 1 column | single column |

---

## Shadow System

Minted uses **no box-shadows** on product cards or navigation — a deliberate anti-drop-shadow
stance common in premium print/editorial design. Elevation is communicated through:
- White card background against parchment page background
- Subtle border (`1px solid #E8E4DF`)
- Opacity overlays for quick-view and favorite buttons

The absence of shadows is a design token in itself — it signals flat, editorial restraint.

---

## Border System

| Token | Value | Usage |
|---|---|---|
| `--border-light` | `1px solid #E8E4DF` | Dividers, nav bottom, filter groups, cards, trust row |
| `--border-warm` | `1px solid #E5DDD5` | Promo banner bottom |
| `--border-input` | `1px solid #C4B8AA` | Form inputs, checkboxes default |
| `--border-input-active` | `1px solid #2B2B2B` | Form input focus state |
| `--border-btn` | `1px solid #2B2B2B` | Secondary/outline button border |
| `--border-foil-gold` | `1px solid #D4AF37` | Gold foil badge |
| `--border-foil-silver` | `1px solid #C0C0C0` | Silver foil badge |
| `--border-radius-default` | `0px` (square) | All buttons, inputs, badges, merch blocks |
| `--border-radius-circle` | `50%` | Category chip images, favorite button |
| `--border-radius-card` | `2px` | Merch blocks only (very subtle) |
| `--border-radius-checkbox` | `2px` | Filter checkboxes |

**Key insight:** Nearly zero border-radius across the entire UI. Square corners signal
craftsmanship and print tradition — rounded corners would feel too "app-like" for a premium
stationery brand.

---

## Motion System

### Transitions

| Component | Property | Duration | Easing |
|---|---|---|---|
| Card hover (detail image fade in) | `opacity` | `300ms` | `ease` |
| Card hover (primary image fade out) | `opacity` | `300ms` | `ease` |
| Nav link hover | `color` | `200ms` | `ease` |
| Sub-nav active border | `border-color, color` | `200ms` | `ease` |
| Favorite button reveal | `opacity` | `200ms` | `ease` |
| Quick-view button reveal | `opacity` | `200ms` | `ease` |
| Button hover (fill swap) | `background-color, color` | `200ms` | `ease` |
| Collection card image | `transform (scale)` | `400ms` | `ease` |
| Filter checkbox | `background-color` | implicit | browser default |
| Category chip border | `border-color` | `200ms` | `ease` |
| Thumbnail hover | `opacity` | `200ms` | implicit |

### Keyframes

No custom `@keyframes` detected. Minted relies entirely on CSS transitions — no
scroll-triggered animations, no entrance animations, no GSAP.

### Motion Philosophy

Minted's motion is **functional and restrained**:
- The primary hover interaction (image crossfade: hero → detail) is the single most
  important micro-interaction — it communicates "there is more to see" without being flashy.
- Quick-view button apparition on hover is the secondary CTA reveal — common in premium
  marketplaces (similar to Net-a-Porter, Farfetch).
- No page transitions, no scroll effects, no parallax.
- Motion budget is extremely conservative — befitting a brand that sells tactile, physical objects.

---

## Effects System

| Effect | Value | Usage |
|---|---|---|
| Badge overlay bg | `rgba(255,255,255,0.90)` | Letterpress + foil badges |
| Favorite button bg | `rgba(255,255,255,0.85)` | Heart icon bg on hover |
| Collection image gradient | `linear-gradient(to top, rgba(0,0,0,0.5), transparent)` | Category collection cards label overlay |
| Image background | `#F0EBE5` | Product card image loading placeholder |
| Lazy loading | `loading="lazy"` attribute | All product images |

No `backdrop-filter`, no `blur()`, no `mix-blend-mode`, no `filter: drop-shadow()` detected.

---

## Cloudinary Transform Token System

Minted has a custom Named Transform system in Cloudinary that acts as a visual design token
layer for card shapes. This is highly sophisticated — the shape of the invitation card is
controlled at the CDN level, not in CSS.

| Transform Name | Shape | Notes |
|---|---|---|
| `t_WEDDING_Portrait-A7_Hero` | Standard rectangle | Default portrait 7x5 |
| `t_WEDDING_Portrait-A7_Hero_Rounded-Corners` | Rounded rectangle | Soft corner treatment |
| `t_WEDDING_Portrait-A7_Hero_Mini-Scallop` | Scallop edge | Decorative scalloped border |
| `t_WEDDING_Portrait-A7_Hero_Arch` | Arch top | Single arch at top |
| `t_WEDDING_Portrait-A7_Hero_Waved-Frame` | Wave frame | Wavy decorative border |
| `t_WEDDING_Portrait-A7_Hero_Classic-Oval` | Oval | Classic oval shape |
| `t_WEDDING_Portrait-A7_Detail` | Standard detail crop | Close-up / back view |
| `t_WEDDING_Portrait-A7_Detail-letterpress` | Letterpress detail | Higher quality |
| `t_WEDDING_Portrait-A7_Hero-letterpress` | Standard letterpress | q_95 quality boost |
| `t_WEDDING_Portrait-A7_Hero_Rounded-Corners-letterpress` | Rounded letterpress | |
| `t_WEDDING_Landscape-A7_Hero` | Landscape rectangle | 5x7 landscape orientation |
| `t_WEDDING_Landscape-A7_Detail` | Landscape detail | |
| `t_WEDDING_Square-6x6_Hero-letterpress` | Square letterpress | 6x6 format |
| `t_WEDDING_Square-6x6_Detail-letterpress` | Square detail | |

Base CDN: `https://assets.minted.com/image/upload/`
Global params: `c_scale,f_auto,q_auto:eco,w_250,dpr_2.0`
Letterpress/Foil override: adds `q_95` (higher quality floor)
Thumbnail params: `dpr_2.0,q_auto,w_112`

---

## Z-Index System

| Layer | Value | Element |
|---|---|---|
| Base content | 0 | Product cards, page content |
| Card overlay (favorite btn, quick view) | 2–3 | Absolute-positioned card controls |
| Sticky sidebar | auto | Filter sidebar (sticky, no z-index needed) |
| Sticky header | 100 | `site-header` |

No complex z-index wars detected. Architecture is straightforward.
