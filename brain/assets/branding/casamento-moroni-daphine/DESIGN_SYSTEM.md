# Design System -- Moroni & Daphine Wedding

Last updated: 2026-05-01
Author: art-director
Voice profile: `.claude/voice-profiles/moroni-daphine-wedding.md`
Mood report: `brain/design-library/mood-reports/casamento-moroni-daphine/wedding-romantic-burgundy.md`

---

## Vision Statement

This site should feel like opening a hand-addressed envelope on heavy cotton paper -- the weight of it in your hands, the pressed seal, the deliberate slowness of unfolding something made for you. Romantic luxury rendered in burgundy, cream, and restrained gold. Not a template. Not a blog. An invitation that breathes.

---

## Narrative Arc

**Entry**: Darkness and intimacy. The hero section is a deep burgundy field -- the viewer is inside the envelope before they know the contents. Names emerge slowly, like ink drying on linen. The date anchors the moment.

**Unfolding**: The site opens into warm cream. The couple's story arrives through photography and measured prose. Each section dissolves into the next like turning pages of an album on a Sunday afternoon. Botanical line art appears as quiet ornament along the margins, never competing with the photographs.

**Resolution**: The site closes the way it opened -- returning to burgundy for the final section. A countdown marks the remaining days. The footer is the wax seal on the back of the envelope.

---

## Reference Stack

1. **Valentino Beauty Campaign** (Ref #05) -- burgundy as background, not accent. Serif display in cream. The courage to go dark.
2. **Emily & John Botanical Framed** (Ref #03 image) -- burgundy line-art botanicals as full-section backgrounds. Ornamental frame around monogram. The balance between abundance and control.
3. **Cecilia & Lucas Wedding Site** (cecilialucas refs) -- LDS wedding site with alternating dark/light sections, Didone serif display, cinematographic photo treatments. Direct structural precedent.
4. **Dior Fall Campaign** (Ref #06) -- display type never below 8vw. Tracking + line-height turn scale into elegance, not volume.
5. **Tom Ford Beauty** (Ref #24) -- parallax at 0.15 ratio. The speed of luxury.
6. **Magnolia Rouge** (Ref #02) -- narrative begins with detail, not with the couple. Close of a flower, a ring, a candle -- then the wide shot. Cinematographic control.

---

## 1. Color System

### 1.1 Core Tokens (LOCKED)

Three colors. No variations. No cream, no blush, no charcoal as system tokens.

| Token | Hex | Role |
|---|---|---|
| `burgundy` | `#4A1619` | Primary. Text on white, section backgrounds, accents, botanical line art |
| `white` | `#FFFFFF` | Dominant background, text on burgundy |
| `gold` | `#D4AF37` | Tertiary only. Hairlines, dividers, small highlights. NEVER primary text or background |

### 1.2 Functional Derivatives

These are NOT new colors -- they are opacity/context variants of the three core tokens.

| Derivative | Value | Usage |
|---|---|---|
| `burgundy-hover` | `#4A1619` at 85% opacity | Hover state on burgundy elements over white |
| `burgundy-tint` | `#4A1619` at 8% opacity | Subtle background wash for alternating content sections |
| `burgundy-overlay` | `rgba(74, 22, 25, 0.55)` | Photo overlay on hero images (NOT black -- warm charcoal-burgundy) |
| `gold-border` | `#D4AF37` at 40% opacity | Thin ornamental borders (1px) |
| `gold-glow` | `#D4AF37` at 12% opacity | Hover glow on gold elements |
| `white-muted` | `#FFFFFF` at 85% opacity | Secondary text on burgundy backgrounds |

### 1.3 Section Color Logic

| Section | Background | Text | Accent |
|---|---|---|---|
| Hero | `burgundy` | `white` | `gold` (divider only) |
| Nossa Historia | `white` | `burgundy` | `gold-border` (frame) |
| Galeria | `white` | `burgundy` | none |
| Dress Code | `white` or `burgundy-tint` | `burgundy` | `gold` (icons) |
| Cronograma | `burgundy` | `white` | `gold` (timeline line) |
| Presentes | `white` | `burgundy` | `gold-border` |
| Mensagem | `burgundy` | `white` | `gold` (divider) |
| Countdown | `burgundy` | `white` | `gold` (numbers) |
| Footer | `burgundy` | `white-muted` | `gold-border` |

**Rule**: The site opens and closes in burgundy. Content sections alternate white and burgundy-tint. Maximum two consecutive white sections before a burgundy section restores rhythm.

### 1.4 Gradient Definitions

**Bridesmaids dress gradient** (for dress code visual reference only):

```
linear-gradient(135deg,
  #BF7B75 0%,      /* Dusty Rose */
  #8C4646 40%,     /* Copper Rust */
  #592828 70%,     /* Buccaneer */
  #4A1619 100%     /* Burgundy */
)
```

This gradient appears ONLY in the dress code section as a visual swatch, never as a decorative element.

### 1.5 Prohibited Colors

- `#4A90FF` and any REIS [IA] blue -- zero usage
- `#FFD700` (bright gold) -- destroys sophistication
- `#000000` (pure black) -- always use `burgundy` for dark contexts
- Any pastel pink as structural color
- Terracotta, earthy tones
- Any neon or saturated accent

---

## 2. Typography System

### 2.1 Display Pair

**Primary display**: Fraunces (Google Fonts, variable)
- Role: ALL display typography -- hero, section headings, dates, the wordmark, editorial moments
- Variable axes: `opsz` (optical size), `SOFT` (softness), `WONK` (wonkiness), `wght` (weight)
- Display configuration: `font-variation-settings: "opsz" 144, "SOFT" 50, "WONK" 1`
- Body configuration: `font-variation-settings: "opsz" 14, "SOFT" 0, "WONK" 0`
- Why: Fraunces at high optical size has a calligraphic warmth that reads like hand-set type on cotton paper -- organic, soft, romantic without resorting to script fonts. At low optical size it becomes more geometric and legible for body text.

**UI companion**: Inter (Google Fonts, variable)
- Role: Metadata, labels, button text, form inputs, date stamps in uppercase tracking
- Weights in play: 300 (Light), 400 (Regular)
- Why: Inter disappears. It exists to serve function without competing with Fraunces for emotional attention.

**Script**: NONE. No Great Vibes, no Alex Brush, no cursive decorative. The identity is Fraunces only. The ampersand in Fraunces italic already provides the decorative calligraphic moment.

### 2.2 Text Scale

Modular scale: Non-modular editorial jumps. Wedding typography demands dramatic scale shifts between display and body -- a smooth modular ratio would make everything feel like a blog.

| Level | Desktop | Mobile | Weight | Font |
|---|---|---|---|---|
| Hero wordmark | `clamp(48px, 8vw, 120px)` | min 48px | 300 | Fraunces, opsz 144, SOFT 50 |
| H1 (section title) | `clamp(40px, 5vw, 72px)` | min 40px | 300 | Fraunces, opsz 144, SOFT 50 |
| H2 (subsection) | `clamp(28px, 3.5vw, 48px)` | min 28px | 300 | Fraunces, opsz 72, SOFT 30 |
| H3 (card/label heading) | `clamp(22px, 2.5vw, 32px)` | min 22px | 400 | Fraunces, opsz 48, SOFT 20 |
| Body lede | `clamp(18px, 1.4vw, 22px)` | min 18px | 300 | Fraunces, opsz 14, SOFT 0 |
| Body | `clamp(16px, 1.1vw, 18px)` | min 16px | 300 | Fraunces, opsz 14, SOFT 0 |
| Caption / meta | `clamp(11px, 0.85vw, 13px)` | min 11px | 400 | Inter |
| Label / UI | `clamp(11px, 0.8vw, 12px)` | min 11px | 400 | Inter, uppercase |
| Date stamp | `clamp(13px, 1vw, 15px)` | min 13px | 300 | Inter, uppercase |

### 2.3 Tracking (letter-spacing)

| Context | Value | Rationale |
|---|---|---|
| Hero wordmark | `+0.015em` | Slight opening for monumental scale. Fraunces at 8vw+ needs breath. |
| H1 section titles | `+0.02em to +0.04em` | Per Dior ref #06 -- tracking at display scale = elegance, not volume |
| H2 | `+0.01em` | Minimal -- Fraunces at this size reads well with natural spacing |
| H3 | `0em` | Natural |
| Body | `-0.005em` | Fraunces body benefits from very slight tightening for warmth |
| Inter uppercase labels | `+0.10em to +0.14em` | Wide tracking on uppercase sans = editorial whisper |
| Inter date stamps | `+0.08em` | Airy, formal |
| Ampersand (decorative) | `+0.12em` padding each side | Visual breathing room as pivot between names |

### 2.4 Leading (line-height)

| Context | Value |
|---|---|
| Hero wordmark | `1.05` -- tight, cinematic, names stacked close |
| H1 | `1.10 to 1.15` |
| H2 | `1.15 to 1.20` |
| H3 | `1.20` |
| Body lede | `1.60` -- generous for readability in romantic serif |
| Body | `1.70` -- Fraunces in body needs more air than a sans would |
| Caption / meta | `1.45` |
| Inter labels | `1.30` |

### 2.5 OpenType Features

| Feature | When | Why |
|---|---|---|
| `liga` | Always on | Standard ligatures in Fraunces (fi, fl, etc.) |
| `calt` | Always on | Contextual alternates for natural flow |
| `onum` (oldstyle numerals) | Body text, dates in prose context | Oldstyle figures sit on the baseline with descenders, reading as text not data |
| `lnum` (lining numerals) | Countdown timer, tabular data | Lining figures for vertical alignment in the countdown |
| `tnum` (tabular numerals) | Countdown timer only | Fixed-width digits prevent layout shift as timer ticks |
| `ss01` | Test per Fraunces specimen | Check if stylistic set 1 improves the ampersand or other key glyphs |
| `frac` | If date ratios appear (e.g., "12/06") | Proper fraction rendering |

**Font loading**:
```
font-display: swap
```
Fraunces variable loaded as single file with all axes. Inter loaded as variable with wght axis only (300-400 range subset).

### 2.6 Responsive Type Behavior

| Breakpoint | Behavior |
|---|---|
| 390px (mobile) | Hero wordmark drops to 48px minimum. Names stack vertically. Body stays at 16px. Section titles at 40px. |
| 768px (tablet) | Hero wordmark at ~6vw. Grid shifts to single column for story sections. |
| 1024px (small desktop) | Full grid activates. Type scale at midpoint of clamp ranges. |
| 1440px (desktop) | Optimal reading experience. Max-widths engage. |
| 1920px+ (wide) | Clamp maxima hold. Content does not stretch beyond max-width. |

The scale **compresses** on mobile but never collapses -- hero wordmark never goes below 48px. The hierarchy gap between display and body WIDENS on mobile (bigger relative jump) to maintain drama on small screens.

### 2.7 Micro-typography

| Rule | Implementation |
|---|---|
| Orphan/widow handling | Non-breaking space (`&nbsp;`) before the final word of all headlines and body paragraphs in Portuguese |
| Hanging punctuation | Not implemented (Fraunces does not benefit from hanging punctuation at display sizes due to optical size axis) |
| Em-dash | `---` rendered as `---` with thin spaces (`&thinsp;`) on each side. Used for parenthetical asides in the couple's story. |
| En-dash | `--` for ranges: "18h -- 23h" |
| Quotation marks | Curly always. Portuguese convention: open with aspas (`"`) not guillemets |
| Apostrophes | Curly. Never straight. |
| Small caps | Not used. Inter uppercase + tracking serves the label role instead. |
| Superscript | For ordinals in dates: "12 de junho" -- no superscript needed in Portuguese |

### 2.8 Hierarchy Rules

1. Never more than 3 type sizes visible in a single viewport without narrative intention
2. Weight contrast preferred over size contrast: Fraunces 300 vs 400 creates subtle voice shifts without scale change
3. One headline = one voice. Never mix Fraunces weights within the same headline.
4. Caps + wide tracking for labels and metadata (Inter only). Never for body, never for headings.
5. Italic Fraunces for the ampersand and for voice/emphasis in body text. Never italic for section titles.
6. The wordmark "Moroni Reis & Daphine Oliveira" is always set in Fraunces 300, mixed case, with the ampersand in Fraunces italic 300 at 70% opacity with 0.12em horizontal padding.

---

## 3. Spacing & Layout

### 3.1 Base Unit

**8px base unit**. All spacing tokens are multiples of 8.

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Micro adjustments only (icon-to-label gaps) |
| `space-2` | 8px | Tight internal padding |
| `space-3` | 16px | Default internal padding, gap between related elements |
| `space-4` | 24px | Paragraph spacing, card padding |
| `space-5` | 32px | Between content groups |
| `space-6` | 48px | Between subsections |
| `space-7` | 64px | Between major sections (mobile) |
| `space-8` | 96px | Between major sections (desktop) |
| `space-9` | 128px | Hero top/bottom padding (desktop) |
| `space-10` | 160px | Maximum breathing room between monumental sections |

### 3.2 Web Grid

**Desktop (1024px+)**:
- 12-column grid
- Max content width: 1120px
- Column gap (gutter): 24px
- Margin (page edge to grid): `max(32px, 5vw)`
- Content column for prose: 8 columns centered (max ~720px for optimal line length with Fraunces at 18px)

**Editorial section variations**:
- Full-bleed photography: 12/12 columns, edge to edge
- Story section: 5/7 split (text 5 columns, photo 7 columns) -- alternating left/right per Cecilia & Lucas ref
- Gallery: 3-column asymmetric (2:1:1 ratio per Junebug ref #04)
- Timeline: single centered column (6/12)
- Countdown: single centered column (6/12)

**Tablet (768px)**:
- 8-column grid
- Gutter: 20px
- Story sections stack: photo full width, text full width below

**Mobile (390px)**:
- 4-column grid
- Gutter: 16px
- Margin: 24px
- Everything stacks single column
- Gallery shifts to 2-column or single column carousel

### 3.3 Vertical Rhythm

Vertical spacing follows a ratio system, not a strict baseline grid. Fraunces body at 18px/1.7 produces a 30.6px line -- forcing everything to a 30px baseline grid creates unnecessary rigidity for a romantic site.

Instead: **section-to-section spacing is always `space-8` (96px) on desktop, `space-7` (64px) on mobile.** Within sections, elements use `space-4` through `space-6` based on semantic relationship.

**Breathing rule**: after every hero-scale element (wordmark, section title, hero photo), insert at least `space-6` (48px) before the next element. Luxury has patience -- tight layouts feel rushed.

### 3.4 Print Material Specs

| Material | Size | Bleed | Trim | Safe Zone | DPI |
|---|---|---|---|---|---|
| Convite principal | 148mm x 210mm (A5) | 3mm each side | At bleed edge | 10mm from trim | 300 |
| RSVP card | 105mm x 148mm (A6) | 3mm | At bleed edge | 8mm from trim | 300 |
| Menu card | 100mm x 210mm (DL) | 3mm | At bleed edge | 8mm from trim | 300 |
| Envelope liner | Match envelope size | 5mm | At bleed edge | N/A | 300 |
| Place card | 90mm x 55mm | 3mm | At bleed edge | 5mm from trim | 300 |
| Table number | 105mm x 148mm (A6) | 3mm | At bleed edge | 8mm from trim | 300 |
| Program/timeline | 148mm x 210mm (A5) | 3mm | At bleed edge | 10mm from trim | 300 |

**Print color mode**: CMYK. Burgundy #4A1619 converts to approximately C:30 M:90 Y:80 K:50. Gold #D4AF37 prints best as Pantone 7405 C or hot foil stamping.

**Digital-to-print translation**: 
- Fraunces renders identically in print (variable font exported at specific instance)
- Body text in print: 11pt Fraunces, leading 15pt
- Display text in print: 24-48pt Fraunces 300
- Gold elements in print: specify hot foil or Pantone metallic, never process CMYK gold

---

## 4. Graphic Elements

### 4.1 Botanical Line Art

**Style rules**:
- Stroke weight: 0.5px to 1px (hairline). Never above 1.5px.
- Color: `burgundy` (#4A1619) on white backgrounds. `white` (#FFFFFF) at 20-30% opacity on burgundy backgrounds.
- Subject matter: Roses, peonies, tulips, eucalyptus stems, olive branches. Consistent with the existing Manual do Convidado and Dress Code materials already designed.
- Drawing style: Engraving-inspired line work -- NOT flat vector, NOT watercolor, NOT clip art. Think copper-plate botanical illustration from a 19th-century horticultural journal. Fine cross-hatching for shadow. Single-weight strokes for outline.
- Complexity: Medium-high for section backgrounds (full botanical compositions). Low for inline decorations (single stem, single bloom).
- Usage: Section backgrounds at 8-15% opacity as texture. Frame elements around headings. Transition pieces between sections. Never more than one full botanical composition visible in a single viewport.

**Source**: The existing wedding materials (Manual do Convidado, Dress Code) already use burgundy floral line art borders and small icons. The digital system must match this established style -- not introduce a new illustration language.

### 4.2 Border & Frame Treatments

| Type | Spec | Usage |
|---|---|---|
| Thin line | 1px solid `burgundy` | Section dividers on white backgrounds |
| Gold hairline | 1px solid `gold-border` (40% opacity) | Ornamental dividers, monogram frame |
| Ornamental frame | 1px `gold-border` with botanical corner elements | Around the wordmark in hero (per Emily & John ref) |
| Card border | 1px solid `burgundy` at 15% opacity | Content cards on white background |

**Rule**: Maximum ONE gold-bordered frame per page (the hero wordmark frame). All other frames use burgundy at reduced opacity. Gold overuse is the fastest path to kitsch.

### 4.3 Dividers & Separators

| Type | Spec | Where |
|---|---|---|
| Thin horizontal | 1px `burgundy` at 20% opacity, max-width 120px, centered | Between subsections within a section |
| Gold hairline | 1px `gold`, max-width 80px, centered | Between hero elements (date and venue) |
| Botanical divider | Single stem illustration, burgundy, max-height 60px | Between major sections (max 2 per page) |
| Whitespace divider | `space-8` (96px) of empty space | Default. Silence is the best separator. |

### 4.4 Icons (Manual do Convidado style)

- Stroke weight: 1px, matching botanical line art
- Style: Line icons only, no fill, no solid
- Color: `burgundy` on white, `white` on burgundy
- Subjects: Church/temple, clock, champagne glass, utensils, music note, camera, car/map pin, gift
- Size: 32px x 32px at desktop, 24px x 24px at mobile
- Source: Custom drawn to match existing Manual do Convidado icons, or curated from a line icon set adjusted to 1px weight

### 4.5 Texture

**Paper grain (digital)**:
- SVG noise filter at 3-5% opacity over white/cream sections
- `feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3"`
- Blend mode: multiply (on white sections), overlay (on burgundy sections)
- This is the digital equivalent of laid paper texture. Without it, white sections feel sterile.

**Vellum overlay feel**:
- On select photography sections: a `rgba(255,255,255,0.04)` overlay with the noise filter creates a translucent paper-over-photo effect
- Use sparingly -- one section maximum

---

## 5. Component Library

### 5.1 Buttons

**Primary button**:
- Background: `burgundy`
- Text: `white`, Inter 400, 12px, uppercase, tracking +0.12em
- Padding: 16px 40px
- Border: none
- Border-radius: 0px (sharp corners -- no rounding)
- Hover: background lightens to `burgundy` at 85% opacity
- Transition: background 400ms ease-out

**Secondary button (ghost)**:
- Background: transparent
- Text: `burgundy`, Inter 400, 12px, uppercase, tracking +0.12em
- Padding: 16px 40px
- Border: 1px solid `burgundy`
- Border-radius: 0px
- Hover: background fills to `burgundy`, text inverts to `white`
- Transition: all 400ms ease-out

**Gold ghost button** (used on burgundy backgrounds):
- Background: transparent
- Text: `white`, Inter 400, 12px, uppercase, tracking +0.12em
- Padding: 16px 40px
- Border: 1px solid `gold-border`
- Border-radius: 0px
- Hover: border-color transitions to full `gold`, text stays `white`
- Transition: border-color 400ms ease-out

**Rule**: No rounded buttons. No gradient fills. No shadows on buttons. Sharp rectangles only -- the sharpness of the button references the sharp edge of a printed invitation.

### 5.2 Cards

**Content card** (for gift list items, FAQ items):
- Background: `white`
- Border: 1px solid `burgundy` at 10% opacity
- Padding: 32px
- Border-radius: 0px
- Shadow: none (shadows break the print/stationery feel)
- Hover: border-color transitions to `burgundy` at 30% opacity

**Feature card** (for timeline events):
- Background: `burgundy-tint` (8% opacity)
- Border: none
- Padding: 40px
- Border-radius: 0px
- No hover state

### 5.3 Form Inputs (Lista de Presentes / future RSVP)

- Background: transparent
- Border: none on top/left/right, 1px solid `burgundy` at 30% on bottom only (underline style)
- Text: Fraunces 300, 18px, `burgundy`
- Label: Inter 400, 11px, uppercase, tracking +0.12em, `burgundy` at 60% opacity
- Focus state: bottom border transitions to full `burgundy`, 2px
- Focus ring color: `burgundy` at 20% (NOT browser default blue)
- Placeholder: Fraunces 300 italic, `burgundy` at 30%

**Rule**: Forms must feel like writing on paper, not filling out a SaaS signup. Underline inputs, not boxed inputs.

### 5.4 Navigation

**Desktop navigation**:
- Position: fixed top, transparent initially
- Background on scroll: `rgba(74, 22, 25, 0.96)` with `backdrop-filter: blur(8px)` (per Squarespace ref #29)
- Height: 72px
- Links: Inter 400, 12px, uppercase, tracking +0.10em, `white`
- Link hover: `gold` underline (1px, draw-in from left, 400ms)
- Wordmark in nav: "M & D" in Fraunces 300, 16px (secondary mark, not the full wordmark)
- Transition: background-color 600ms ease-out

**Mobile navigation**:
- Hamburger icon: 3 lines, 1px stroke, `white`
- Menu overlay: full screen, background `burgundy`
- Links: Fraunces 300, 32px, `white`, centered, stacked vertically with `space-5` (32px) between
- Close: X icon, 1px stroke, `white`, top-right
- Entry animation: opacity 0 to 1, 600ms ease-out. Links stagger in at 100ms intervals.

### 5.5 Timeline Component

**Layout**: Vertical, centered, single column

**Structure**:
```
        [Time]                    Inter 300, 13px, uppercase, tracking +0.08em
          |                       1px gold line, height 48px
    [Event title]                 Fraunces 300, H3 scale
   [Description]                  Fraunces 300, body scale
          |                       1px gold line, height 48px
        [Time]
          |
        ...
```

- Timeline line: 1px `gold` at 40% opacity, continuous vertical
- Time labels: Inter, uppercase, on alternating left/right sides on desktop; always above on mobile
- Event nodes: small circle, 8px diameter, 1px `gold` border, `white` fill (on white bg) or `burgundy` fill (on burgundy bg)
- Content: centered on mobile, alternating left/right on desktop (classic timeline pattern)

### 5.6 Countdown Component

**Layout**: Horizontal row of 4 units (Dias, Horas, Min, Seg)

**Number display**: Fraunces 300, `clamp(36px, 5vw, 72px)`, `white` (on burgundy background)
- `font-variant-numeric: tabular-nums lining-nums` to prevent layout shift
- Letter-spacing: `-0.02em` (numbers should be tight and monumental)

**Labels**: Inter 400, 11px, uppercase, tracking +0.14em, `white` at 60% opacity

**Separators**: 1px vertical `gold` at 20% opacity between each unit, height 40px

**Animation**: Numbers update with a subtle vertical slide transition (old number slides up and fades, new slides in from below). Duration: 300ms, easing: ease-out. Only the changing digit animates -- static digits hold still.

### 5.7 Gallery Grid

**Desktop**: Masonry-inspired asymmetric grid
- Primary layout: 3 columns with varying heights
- Column ratio: 2:1:1 (one large hero image, two smaller supporting images per row) per Junebug ref #04
- Gap: 8px
- Images: no border-radius, sharp edges
- Hover: subtle scale 1.02 with overflow hidden, 600ms ease-out

**Mobile**: 2-column grid
- Gap: 4px
- Alternating single full-width image and two half-width images
- Tap to expand to lightbox

**Lightbox**:
- Background: `burgundy` at 95% opacity with `backdrop-filter: blur(16px)`
- Close button: `white`, X icon, top-right
- Caption: Fraunces 300 italic, 14px, `white` at 70%, centered below image
- Navigation: left/right arrows, 1px `white` stroke, or swipe on mobile
- Entry: opacity 0 to 1, image scales from 0.9 to 1.0, 600ms ease-out

### 5.8 Section Transitions

Sections do NOT use hard cuts. Between sections:
- If transitioning white-to-white: `space-8` whitespace + optional thin horizontal divider
- If transitioning white-to-burgundy: no divider. The color change IS the transition. A full-bleed burgundy section simply begins.
- If transitioning burgundy-to-white: same. No gradient. No fade between background colors. Sharp cut. The contrast is dramatic and intentional.
- Botanical line art MAY appear as a transitional element between sections (max 2 per page total)

---

## 6. Motion Language

### 6.1 Foundation

**Lenis smooth scroll**: `lerp: 0.08` (20% heavier than default). `smoothWheel: true`. `wheelMultiplier: 0.9`. `touchMultiplier: 1.5`. This makes every scroll feel deliberate, formal, weighted -- like turning pages of a heavy album.

**Minimum transition duration**: 600ms. Nothing faster. Luxury has patience.

**Prohibited easings**: No spring, no bounce, no elastic, no overshoot. These are playful. This site is formal.

**Default easing**: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` -- the Armani curve. Starts with gentle acceleration, decelerates with an exhale. Elements arrive as if by their own volition.

**`prefers-reduced-motion`**: All motion replaced with instant state changes (opacity 0 to 1, no transform, no delay). Countdown numbers update without slide transition. Parallax disabled entirely.

### 6.2 Hero Entry (on page load)

| Element | Delay | Duration | Transform | Easing |
|---|---|---|---|---|
| Botanical frame | 0ms | 1400ms | opacity 0 > 1, scale 0.95 > 1 | Armani curve |
| Names wordmark | 200ms | 1400ms | opacity 0 > 1, translateY 32px > 0 | Armani curve |
| Ampersand | 400ms | 1200ms | opacity 0 > 0.7 | ease-out |
| Date | 600ms | 1200ms | opacity 0 > 1, translateY 16px > 0 | Armani curve |
| Gold divider | 800ms | 1200ms | width 0% > 100% | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Scroll indicator | 1200ms | 800ms | opacity 0 > 0.4 | ease-out |

Total hero reveal: ~2.4 seconds from first paint. This is intentionally slow. The visitor opens the envelope.

### 6.3 Scroll-Triggered Section Reveals

Each section enters viewport with:
- Trigger: IntersectionObserver, threshold 0.2 (element 20% visible)
- Animation: opacity 0 > 1 (dissolve only, per NOWNESS ref #21)
- Duration: 900ms
- Easing: ease-out
- NO translateY. Pure dissolve. Photographs especially should not slide -- they should materialize.

**Exception**: The gold dividers animate width from 0 to 100% when they enter the viewport, using the gold-border-reveal easing (`cubic-bezier(0.16, 1, 0.3, 1)`, 1200ms).

### 6.4 Parallax

- Background photographs: `translateY` at `scrollY * 0.15` (per Tom Ford ref #24 -- NOT the common 0.5 which feels like a tech demo)
- Foreground text: static, no parallax
- **Disabled entirely on mobile** (touch parallax degrades UX)
- **Disabled for `prefers-reduced-motion`**

### 6.5 Hover States

| Element | Effect | Duration |
|---|---|---|
| Navigation links | Gold 1px underline draws in from left | 400ms |
| Primary button | Background lightens | 400ms |
| Ghost button | Background fills, text inverts | 400ms |
| Gallery images | Scale 1.02 with overflow hidden | 600ms |
| Gift list items | Border-color intensifies | 300ms |

No color transitions on text hover. No scale on text. Only structural changes (underline, border, background).

### 6.6 Botanical Line Draw-On (optional enhancement)

If SVG botanical illustrations are inlined (not rasterized), they can animate stroke with `stroke-dasharray` and `stroke-dashoffset`:
- Total draw duration: 3000ms (slow, deliberate)
- Easing: ease-in-out
- Trigger: scroll into viewport
- Only for ONE botanical element per page (the hero frame or a section transition piece)
- This is a "moment" -- if overused it becomes a gimmick

### 6.7 Page Transitions (if multi-page)

If the site has separate pages (lista-de-presentes, informacoes):
- Exit: opacity 1 > 0, 400ms ease-in
- Enter: opacity 0 > 1, 600ms ease-out
- Total transition: ~1000ms
- Background holds at `burgundy` during transition (never white flash)

---

## 7. Photography Direction

### 7.1 Color Treatment

- Warm grade: +15 warm color temperature, -10 cyan
- Consistent "candlelight" temperature across all images (per Once Wed ref #01)
- Saturation: slightly desaturated (-10%) for sophistication -- never oversaturated
- Shadows: lifted slightly (never crushed to pure black) with warm tone in shadow areas
- Optional: radial gradient overlay `radial-gradient(from center, rgba(212,175,55,0.06) 0%, transparent 70%)` -- 6% gold tone from center. Imperceptible individually, felt across the gallery. (Per Ralph Lauren ref #07.)

### 7.2 Hero Image Treatment

- Primary hero: couple photo on burgundy-overlay (`rgba(74, 22, 25, 0.55)`)
- The overlay shifts the photo into the burgundy world without desaturating it
- Photo should be wide/landscape crop, shallow depth of field
- Alternative hero: NO photo. Pure typographic hero on solid burgundy -- names and date only. The couple appears in the story section below. This is the Emily & John approach (ref #03) and may be more elegant.

### 7.3 Gallery Presentation

- No borders on photos
- No rounded corners
- Sharp rectangular crops
- Mix of orientations: landscape (dominant), portrait, square
- No filters beyond the consistent warm grade described above
- Temple photos (Sao Paulo Temple): may receive slightly different treatment -- more formal, less warm. Keep natural but not cold.

### 7.4 Anti-stock Rules

- No posed "looking at camera smiling" shots as hero
- No aerial/drone shots
- No filtered-to-death Instagram aesthetic
- No black and white (this wedding has color -- the burgundy palette IS the point)
- No desaturated "fine art" treatment (we archived that direction already)
- Detail shots (flowers, rings, hands, table settings) are preferred over full-body formal portraits for section heroes

---

## 8. Handoff Notes

### For designer-agent

- Use the 3-token color system strictly. Resist the urge to add cream, blush, or charcoal as new tokens.
- Fraunces variable font must be loaded with ALL axes available. The optical size axis is doing critical work -- display vs body are the same font but feel entirely different.
- The hero can be either photo-with-overlay OR pure typographic. Produce both variants for Moroni's review as Vercel previews.
- Gallery grid follows the Junebug 2:1:1 asymmetric pattern, not a uniform grid.
- All buttons are sharp rectangles. Zero border-radius across the entire site.
- Icons match the existing Manual do Convidado line weight (1px stroke, no fill).

### For vfx-motion-designer

- Lenis at lerp 0.08 is non-negotiable. This is the foundation.
- The Armani easing `cubic-bezier(0.25, 0.46, 0.45, 0.94)` is the default for all element entries.
- Gold border reveal uses a different easing: `cubic-bezier(0.16, 1, 0.3, 1)`.
- Hero entry is a staggered sequence with total duration ~2.4s. Each element has specific delays documented in section 6.2.
- Parallax ratio is 0.15 -- NOT 0.5. Lower is more luxurious.
- Reference patterns from `brain/design-library/patterns/SEED.md`: #6 (noise grain), #9 (Lenis setup), #10 (clip-path reveal -- adapt for gold border), #11 (IntersectionObserver fade as reduced-motion fallback).
- The botanical line draw-on (section 6.6) is optional and should only be attempted if SVG illustrations are inlined. Rasterized botanicals do not animate.

### For visual-qa-agent

- Judge against mood report: `brain/design-library/mood-reports/casamento-moroni-daphine/wedding-romantic-burgundy.md`
- Key references for comparison: Emily & John (ref-03), Cecilia & Lucas (cecilialucas/), Valentino Beauty (ref #05 in mood report)
- Anti-patterns to watch: pastel pink creep, gold overuse (#FFD700 vs #D4AF37), script fonts appearing anywhere, any blue from REIS [IA] palette, bounce/spring easings, buttons with border-radius
- The site should feel like the Cecilia & Lucas reference in structure but with the burgundy/botanical warmth of Emily & John in decoration
- Typography test: Fraunces at large optical size should feel warm and organic. If it looks stiff, the `SOFT` axis value may need adjustment.

### Accessibility

- Color contrast: `burgundy` (#4A1619) on `white` (#FFFFFF) = contrast ratio ~13.5:1 (exceeds AAA)
- `white` on `burgundy` = same ratio inverted, AAA compliant
- `gold` (#D4AF37) on `white` = contrast ratio ~2.8:1 -- FAILS. Gold text must NEVER appear on white. Gold is for decorative borders/lines only, never for readable text.
- `gold` on `burgundy` = contrast ratio ~4.9:1 -- passes AA for large text only. Gold text on burgundy allowed only at display scale (24px+).
- `prefers-reduced-motion`: all animations replaced with instant state, parallax disabled
- Reading order: semantic HTML (h1 > h2 > h3, nav > main > footer)
- Focus states: 2px `burgundy` outline with 2px offset on interactive elements
- Alt text: all gallery images must have descriptive Portuguese alt text
- Skip-to-content link: hidden visually, first focusable element

---

## Appendix A: File Naming Convention

```
moroniedaphine/
  src/
    styles/
      tokens.css          -- color, spacing, typography tokens
      typography.css       -- Fraunces + Inter setup, scale, OpenType
      global.css           -- resets, grain overlay, base styles
    components/
      Navigation.astro
      Hero.astro
      Timeline.astro
      Countdown.astro
      Gallery.astro
      GiftCard.astro
      Footer.astro
    layouts/
      BaseLayout.astro
    pages/
      index.astro
      lista-de-presentes.astro
      informacoes.astro
    assets/
      fonts/               -- self-hosted Fraunces + Inter variable
      images/              -- optimized couple photos
      botanicals/          -- SVG line art illustrations
  public/
    favicon.svg            -- M&D monogram in burgundy
    og-image.jpg           -- social share card
```

## Appendix B: CSS Custom Properties (Token Reference)

```css
:root {
  /* Color */
  --color-burgundy: #4A1619;
  --color-white: #FFFFFF;
  --color-gold: #D4AF37;
  --color-burgundy-hover: rgba(74, 22, 25, 0.85);
  --color-burgundy-tint: rgba(74, 22, 25, 0.08);
  --color-burgundy-overlay: rgba(74, 22, 25, 0.55);
  --color-gold-border: rgba(212, 175, 55, 0.40);
  --color-gold-glow: rgba(212, 175, 55, 0.12);
  --color-white-muted: rgba(255, 255, 255, 0.85);

  /* Typography */
  --font-display: 'Fraunces', Georgia, serif;
  --font-ui: 'Inter', system-ui, sans-serif;
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 32px;
  --space-6: 48px;
  --space-7: 64px;
  --space-8: 96px;
  --space-9: 128px;
  --space-10: 160px;

  /* Grid */
  --grid-max-width: 1120px;
  --grid-gutter: 24px;
  --grid-margin: max(32px, 5vw);

  /* Motion */
  --ease-armani: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-gold-reveal: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-min: 600ms;
  --duration-reveal: 900ms;
  --duration-hero-element: 1400ms;
  --duration-gold-line: 1200ms;
}
```

---

*This document governs all visual output for the Moroni & Daphine wedding project. When in doubt, choose the slower, quieter, more restrained option. This is an envelope being opened, not a stage being lit.*
