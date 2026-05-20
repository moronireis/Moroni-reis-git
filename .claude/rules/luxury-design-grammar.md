# Luxury Design Grammar — REIS IA

> Used by: art-director, designer-agent, vfx-motion-designer, typography-specialist, luxury-brand-analyst, visual-qa-agent
> Activation: Loaded when **Protocolo Luxo** is active or when a project is tagged as luxury
> Purpose: Codify the visual grammar that separates luxury digital from premium-tech/SaaS

---

## 1. When This Rule Applies

This rule activates ONLY under these conditions:
- Moroni says "Protocolo Luxo" (activates the full luxury overlay)
- A project is explicitly tagged as luxury (e.g., Filhas de Eva, Castelo dos Lagos, luxury client work)
- Art-director or designer-agent is briefed for luxury output

When NOT active, the standard REIS [IA] design rules apply unchanged.

---

## 2. The 8 Universal Luxury Patterns

These appear across 80%+ of luxury brand digital presences. Their ABSENCE signals non-luxury:

1. **Zero or minimal border-radius** — Sharp edges on CTAs, cards, inputs. Max 2px for softening, never rounded.
2. **Uppercase letter-spaced navigation** — 11-13px, tracking 0.08-0.15em, font-weight 400-500.
3. **Generous negative space** — Whitespace is an active element, not unused space. Section padding 2-4x normal.
4. **Photography/video dominance** — The interface FRAMES content, never competes. UI recedes, imagery commands.
5. **Serif in the hierarchy** — Display serif for headlines, sans for UI. The "High-Low pairing" creates editorial tension.
6. **Slow motion** — Minimum 0.4s transitions. Ease-out bias. Never bounce, never spring, never elastic.
7. **Full-bleed imagery** — Edge-to-edge at multiple points. Photography breaks the grid deliberately.
8. **Color restraint** — Monochrome foundation (black/white) + ONE signature accent maximum.

---

## 3. Luxury Motion Rules

### Timing
- **Minimum transition**: 0.4s (luxury brands use 0.3-0.8s)
- **Hero reveals**: 0.6-1.2s
- **Page transitions**: 0.4-0.8s
- **Micro-interactions**: 0.3-0.5s (not faster)
- **Scroll-driven**: Continuous, no snapping

### Easing
- **Primary**: `cubic-bezier(0.25, 0.1, 0.25, 1.0)` — ease-out bias (Dior's curve)
- **Reveal**: `cubic-bezier(0.16, 1, 0.3, 1)` — dramatic deceleration
- **NEVER**: bounce, spring, elastic, overshoot — these read as playful/tech, not luxury
- **NEVER**: linear for visible transitions — it reads as mechanical

### Choreography
- Elements appear in **editorial sequence**: headline → subheadline → image → CTA
- NEVER simultaneous reveals — that reads as a loading screen, not a composition
- Stagger between elements: 80-150ms
- Scroll velocity: reduce Lenis `wheelMultiplier` to 0.8-0.9 (slower scroll = more premium feel)

### Photography Reveals (ranked by luxury appropriateness)
1. **Clip-path curtain** — horizontal or vertical wipe (most editorial)
2. **Scale from center** — starts at 0.95, ends at 1.0 (subtle zoom)
3. **Opacity fade** — ONLY as last resort, and always combined with slight translate

### Product Presentation
- **Vitrine rotation** — slow 360 spin, pausable, studio lighting
- **Zoom-to-detail** — click/hover reveals texture, material, craftsmanship
- **Studio lighting simulation** — light follows cursor subtly
- **Pause-and-hold** — motion stops at beauty angles, not continuous

---

## 4. Luxury Typography Rules

### The High-Low System
| Voice | Role | Size Range | Weight | Tracking | Font Type |
|-------|------|-----------|--------|----------|-----------|
| HIGH | Display headlines | 64-160px | 300-400 | -0.02 to -0.04em | Serif (editorial) |
| MID | Body text, UI | 14-18px | 400 | 0 to 0.01em | Sans-serif |
| LOW | Metadata, labels | 10-13px | 400-500 | 0.08-0.15em | Mono or tracked sans, UPPERCASE |

### Rules
- Maximum 3 type sizes visible per viewport
- Never geometric sans for display in luxury — it reads SaaS
- Variable fonts preferred for responsive headlines: `clamp()` on size + weight
- True small caps (`font-variant: small-caps` or OpenType `smcp`) for metadata when available
- Hanging punctuation on pull quotes
- Typographer's quotes always (" " not " ")

---

## 5. Luxury Component Rules

### CTAs / Buttons
- Zero border-radius (sharp rectangle)
- Uppercase, letter-spaced (0.08-0.12em)
- Thin border (1px) or solid fill — never gradient
- Hover: subtle background shift or underline, never scale/bounce
- Font-size: 12-14px, never large

### Cards
- Zero or 2px border-radius maximum
- Border-only (1px solid) or no border with subtle background difference
- No drop shadows — use border or background differentiation
- If image: full-bleed within card, no padding around image

### Navigation
- Small (11-13px), uppercase, wide tracking (0.08-0.15em)
- Horizontal or fullscreen overlay — never sidebar
- Transparent over hero, transitions to solid on scroll
- Hamburger on mobile — minimal, no animation circus

### Forms / Inputs
- Underline-only inputs (bottom border) or thin full-border
- No rounded corners, no shadows, no floating labels with animation
- Label above, small, tracked, uppercase

### Photography
- Full-bleed or deliberate editorial crop — never thumbnail-in-card
- Aspect ratios: 16:9, 3:2, 1:1, or full-viewport — never arbitrary
- No rounded corners on images (zero border-radius)
- Overlay text on dark images: white, high contrast, positioned with grid intent

---

## 6. Luxury vs SaaS Diagnostic

### Instant SaaS Tells (if present, design is NOT luxury)
- [ ] Border-radius >= 8px on any interactive element
- [ ] Gradient fills on CTAs or hero backgrounds
- [ ] Feature comparison grids or pricing tier cards
- [ ] Card grids with uniform box-shadows
- [ ] Bounce/spring/elastic animations anywhere
- [ ] Icon-heavy navigation or feature sections
- [ ] Bright multi-color palette (3+ saturated colors)
- [ ] Badge/pill UI elements
- [ ] "Dashboard preview" hero images
- [ ] Sans-serif only (no serif voice in hierarchy)
- [ ] Floating elements with drop-shadow elevation

### Red Flags (not instant disqualifiers, but investigate)
- [ ] Dark mode with neon accents (luxury dark is muted, not neon)
- [ ] Frosted glass cards (luxury blur is subtle, not UI pattern)
- [ ] Decorative geometric blobs (luxury geometry is architectural, not playful)
- [ ] Scroll-triggered number counters ("500+ clients served")
- [ ] Testimonial carousels with star ratings
- [ ] "Trusted by" logo bars

---

## 7. Luxury Color Discipline

- **Foundation**: Monochrome (black, white, grays)
- **Accent**: ONE signature color, used sparingly (Cartier red, Tiffany blue, REIS [IA] blue)
- **Photography carries color** — the UI does not compete
- **No gradients** on interactive elements (buttons, links, inputs)
- **Surface hierarchy**: Use value shifts (#0A0A0A → #111113 → #1A1A1C) not color shifts
- **Gold/metallic**: Only if brand-appropriate; render as flat tone (#C5A572), not CSS gradient shimmer

---

## 8. Luxury Layout Rules

- **Max content width**: 1400-1600px (wider than SaaS standard 1200px)
- **Section padding**: 120-200px vertical (2-4x SaaS standard)
- **Grid**: 12-column, but break it deliberately for editorial asymmetry
- **Full-bleed breaks**: At least 2-3 sections per page break the max-width and go edge-to-edge
- **Content density**: LOW. Fewer elements, more space. If in doubt, remove.
- **Asymmetric layouts**: Text left + image right (or vice versa) with deliberate offset — not centered-everything
- **Scroll length**: Luxury pages are LONG. Scroll IS the experience. 5-8 full-viewport sections minimum for a landing page.
