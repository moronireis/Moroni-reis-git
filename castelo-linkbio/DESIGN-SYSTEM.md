# Castelo dos Lagos — Design System
Last updated: 2026-06-01

## Design Decision: CREATE (new file)
IDS Protocol: No existing `castelo-linkbio/index.html` found. Reference pattern adapted from `filhasdeeva-linkbio/index.html` (carousel3D, reveal system, horizontal scroll pattern) — venue context requires institutional identity, not personal brand aesthetic.

---

## Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--forest-deep` | `#1E2E24` | Background (dark mode default) |
| `--forest-mid` | `#2F4A3A` | Surface elevated |
| `--gold` | `#C9A96E` | Accent — borders, icons, CTAs, eyebrows |
| `--gold-dark` | `#A07840` | Gold hover state |
| `--cream` | `#F4EFE6` | Background (light mode) |
| `--near-black` | `#0E0E0C` | CTA text on gold, hero footer |
| `--muted` | `#7A8A80` | Body text secondary |
| `--ease` | `cubic-bezier(0.16, 1, 0.3, 1)` | Standard easing (luxury: dramatic deceleration) |

### Surface Hierarchy (dark mode)
- `--bg` → `#1E2E24` (forest-deep)
- `--surface` → `#243B2E`
- `--surface-2` → `#1A2820`

### Surface Hierarchy (light mode)
- `--bg` → `#F4EFE6` (cream)
- `--surface` → `#FDFAF5`
- `--surface-2` → `#EDE8DE`

---

## Typography

### Fonts
- **Cormorant Garamond** — Display/editorial. Weights: 300, 400, 500, 600. Italic variants: 300i, 400i, 600i.
- **Inter** — UI/body. Weights: 300, 400, 500, 600.
- No Great Vibes (personal brand font — not appropriate for institutional venue).

### Type Scale
| Role | Font | Weight | Size | Tracking |
|------|------|--------|------|----------|
| Hero H1 | Cormorant Garamond | 300 | clamp(2.8rem, 12vw, 4rem) | .08em |
| Section title | Cormorant Garamond | 300 | clamp(2rem, 8vw, 2.75rem) | .04em |
| Card title | Cormorant Garamond | 400–500 | .9–1.5rem | .03em |
| Eyebrow | Inter | 600 | .6rem | .25em UPPERCASE |
| Body | Inter | 400 | .8–.85rem | normal |
| Labels / meta | Inter | 500–600 | .5–.6rem | .12–.25em UPPERCASE |

---

## Spacing & Layout

- **Max content width**: 480px (mobile-first, link-in-bio format)
- **Section padding**: 4rem vertical · 1.25rem horizontal
- **Card gap**: .65–.85rem
- **Luxury override**: generous negative space, 2–4x section padding on CTA final

---

## Components

### CTAs / Buttons
- Zero border-radius (sharp rectangle) — luxury grammar
- Background: solid `--gold`, color `--near-black`
- Hover: `--gold-dark` or white (CTA final)
- Border variant: 1px solid `--gold`, transparent background
- Font: Inter 600, .65–.7rem, .14–.16em tracking, UPPERCASE

### Cards
- Zero border-radius on premium cards (espaco, parceiros, diferenciais)
- Border: 1px solid `--border` (rgba gold 18%)
- Hover: translateY(-3px) + border-color rgba gold 40–50%
- No drop shadows — use border differentiation

### Carousel 3D
- Perspective: 1000px
- Active: scale(1) + strong shadow
- Side cards: scale(.72) + rotateY(±13deg) + translateX(±108px) + blur(1px) + brightness(.55)
- Hidden: scale(.5) + translateZ(-280px)
- Auto-rotate: 4000ms
- Touch swipe: dx > 40px threshold

### Gallery Scrolls
- Single row: CSS animation `scrollLeft` 30s linear infinite, 50% translate for seamless loop
- Dual rows: row-right (scrollLeft 24s) + row-left (scrollRight 24s) for opposite direction
- Pause on hover/touch

### Video Horizontal Scroll
- JS RAF-based, speed 0.6px/frame, bounce at edges
- Center detection for active-video (scale 1.05, gold 2px border)
- Touch pause: 3s cooldown

### Video Modal
- Fixed overlay rgba(0,0,0,.92)
- Close: Escape key, click outside, X button
- Gold X button on hover

---

## Motion Rules (Luxury Grammar)

- Minimum transition: 0.4s
- Hero reveals: 0.6–0.75s
- Scroll reveals: 0.75s via IntersectionObserver (threshold 0.12)
- Reveal stagger: 0.1s delay increments
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` — dramatic deceleration
- Never: bounce, spring, elastic, overshoot
- Gallery animations: CSS linear (continuous) — not eased, intentionally mechanical for parallax feel
- `prefers-reduced-motion`: disables all transitions and animations

---

## Sections Map

| # | Section | Key component | Photo assets |
|---|---------|---------------|-------------|
| 1 | Hero | Full-viewport, overlay gradient | castelo-aereo-drone.jpg |
| 2 | Celebrações | 3D carousel (5 cards) | casal-frente-castelo, debutante-carruagem, salao-mesa-arranjo, corp-hall, mesas-externas-noite |
| 3 | Vídeos | Horizontal auto-scroll (5 vids) | MP4 assets |
| 4 | Diferenciais | 2×2 grid cards + SVG icons | — |
| 5 | O Espaço | Hero card + 2×2 grid | 05-salao-01, 04-cerimonia-01, 02-lagos-01, 06-suites-01, 01-chegada-01 |
| 6 | Como Chegar | Google Maps embed + info cards | — |
| 7 | Galeria de Momentos | Single-row infinite scroll | 8 photos × 2 (loop) |
| 8 | Galeria Dupla | 2-row opposite-direction scroll | 6+6 photos × 2 (loop) |
| 9 | Sobre o Castelo | Photo + bio + 2×2 stats + quote | castelo-aereo.jpg |
| 10 | Nossa História | Photo + text | silhueta-casal-noite.jpg |
| 11 | Parceiros | Hero card (Di Matoso) + 2-card grid | buffet-finger.jpg |
| 12 | Vídeos dos Eventos | 3 cards + fullscreen modal | poster photos + MP4 |
| 13 | Redes Sociais | 2×2 grid with SVG icons | — |
| 14 | CTA Final + Footer | Dark gradient + grain overlay + B&W photo | silhueta-casal-castelo.jpg |

---

## Key Decisions

1. **No Great Vibes** — venue is institutional, not personal brand. Cormorant Garamond italic serves the editorial serif role.
2. **Zero border-radius on CTAs** — luxury grammar compliance (sharp rectangles signal authority).
3. **Forest green palette** — aligns with Castelo dos Lagos existing brand identity (nature + exclusivity).
4. **Gold as sole accent** — single signature color, photographic imagery carries all other color.
5. **3px gold scrollbar** — subtle brand signal consistent with luxury micro-details.
6. **No pricing / tier cards** — venue sales is always consultative, direct to WhatsApp.
7. **Dark mode default** — premium, cinematic, photography-forward.
8. **Grain overlay** — adds tactility, reduces digital sterility, luxury signal.
