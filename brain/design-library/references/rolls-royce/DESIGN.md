---
# DESIGN.md — Rolls-Royce Motor Cars (rolls-roycemotorcars.com)
# Extraction method: Research-based (site blocks automated fetching — Cloudflare WAF)
# Confidence: MEDIUM-HIGH — based on Pentagram rebrand documentation (2021),
#   Awwwards/Creative Bloq analysis, official press materials, AKQA digital implementation
# Sources: Creative Bloq, Awwwards, Wikipedia, Pentagram case study references,
#   official Rolls-Royce press club materials, industry analysis
# Extracted: 2026-05-18
# Extractor: design-system-extractor agent (REIS [IA])
# Purpose: Protocolo Luxo knowledge base — consumed by art-director, designer-agent,
#   typography-specialist, visual-qa-agent

description: >
  Rolls-Royce Motor Cars digital design system. Pinnacle automotive luxury.
  2021 rebrand by Pentagram (Marina Willer). Digital implementation by AKQA.
  The design language communicates "the best car in the world" through restraint,
  not spectacle. Every element earns its place. Dark, architectural, unhurried.

tokens:
  colors:
    # --- Core Brand Palette ---
    purple-spirit: "#6B2D8B"          # from Pentagram 2021 rebrand — signature brand color
    purple-spirit-deep: "#4A1D6B"     # from dark-mode digital application — deeper variant
    purple-spirit-light: "#8B4DAB"    # from hover/highlight states — lighter tint
    charles-blue: "#1C3E6E"           # from heritage palette — Rolls-Royce navy
    midnight-blue: "#0A1628"          # from digital dark mode backgrounds
    black: "#000000"                  # from primary background — true black
    near-black: "#0D0D0D"            # from section backgrounds — off-black
    anthracite: "#1A1A1A"            # from card/panel backgrounds
    graphite: "#2C2C2C"             # from secondary surfaces
    gunmetal: "#3D3D3D"             # from borders, dividers
    silver: "#C0C0C0"               # from secondary text, metadata
    silver-light: "#D4D4D4"         # from body text on dark backgrounds
    white: "#FFFFFF"                # from primary text on dark backgrounds
    alabaster: "#F5F5F0"            # from light-mode accent surfaces (rare)
    spirit-gold: "#C4A265"          # from Spirit of Ecstasy accent — used sparingly
    spirit-gold-light: "#D4B87A"    # from hover state on gold accents

    # --- Functional Colors ---
    surface-primary: "#000000"       # from page background
    surface-elevated: "#0D0D0D"      # from elevated panels
    surface-card: "#1A1A1A"          # from card components
    text-primary: "#FFFFFF"          # from headings, primary content
    text-secondary: "#C0C0C0"        # from body text, captions
    text-tertiary: "#808080"         # from metadata, timestamps
    border-default: "#2C2C2C"        # from subtle dividers
    border-accent: "#6B2D8B"         # from active/focus states
    interactive-default: "#6B2D8B"   # from links, buttons
    interactive-hover: "#8B4DAB"     # from hover states
    overlay-dark: "rgba(0,0,0,0.7)"  # from image overlays, modals
    overlay-purple: "rgba(107,45,139,0.15)" # from subtle accent wash

  typography:
    # --- Primary Typeface: Riviera Nights ---
    # Custom typeface commissioned by Rolls-Royce, designed by Pentagram (2021)
    # Classification: Transitional serif with geometric sans-serif principles
    # Characteristics: Beveled/bezelled letterforms, extreme delicacy,
    #   high contrast stroke weight, wide character width, generous letter-spacing
    # Replaces: Gill Sans (used since 1930s)
    # License: Proprietary — Rolls-Royce exclusive
    # Fallback stack: Georgia, "Times New Roman", serif

    font-family-primary: "'Riviera Nights', Georgia, 'Times New Roman', serif"
    font-family-secondary: "'Riviera Nights Light', Georgia, serif"  # from lightweight display variant
    font-family-system: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"

    # --- Font Weights ---
    weight-light: 300               # from display headings, wordmark
    weight-regular: 400             # from body text, navigation
    weight-medium: 500              # from subheadings, UI elements (inferred)
    weight-bold: 700                # from emphasis, CTAs (used sparingly)

    # --- Type Scale (Desktop) ---
    # Philosophy: Generous sizing, extreme letter-spacing on display,
    #   comfortable reading size for body. Scale ratio ~1.333 (perfect fourth)
    display-hero: "80px"             # from hero headlines — configurator, model pages
    display-large: "56px"            # from section headlines
    display-medium: "40px"           # from subsection headlines
    heading-1: "32px"               # from page titles
    heading-2: "24px"               # from section titles
    heading-3: "20px"               # from card titles, feature names
    body-large: "18px"              # from lead paragraphs, feature descriptions
    body: "16px"                    # from standard body text
    body-small: "14px"              # from captions, metadata
    caption: "12px"                 # from legal text, fine print
    nav: "13px"                     # from navigation items — uppercase

    # --- Line Heights ---
    line-height-display: 1.1        # from display/hero text — tight
    line-height-heading: 1.2        # from headings
    line-height-body: 1.6           # from body text — generous reading
    line-height-caption: 1.4        # from small text

    # --- Letter Spacing ---
    # Rolls-Royce is defined by its letter-spacing discipline.
    # Wide tracking on uppercase = architectural authority
    tracking-display: "0.15em"       # from hero headlines — very wide
    tracking-heading: "0.08em"       # from section headlines
    tracking-nav: "0.2em"            # from navigation — extremely wide, uppercase
    tracking-body: "0.02em"          # from body text — subtle openness
    tracking-button: "0.15em"        # from CTA buttons — uppercase
    tracking-wordmark: "0.25em"      # from "ROLLS-ROYCE MOTOR CARS" lockup

    # --- Text Transform ---
    transform-nav: "uppercase"       # from all navigation items
    transform-button: "uppercase"    # from CTA buttons
    transform-display: "none"        # from hero text — sentence case for warmth
    transform-label: "uppercase"     # from form labels, metadata labels

  spacing:
    # Philosophy: Extreme generosity. Luxury = negative space.
    # The page breathes. Sections have cinematic separation.
    unit: "8px"                      # from base spacing unit
    xs: "8px"                        # from icon padding, fine adjustments
    sm: "16px"                       # from inline element spacing
    md: "24px"                       # from component internal padding
    lg: "32px"                       # from card padding
    xl: "48px"                       # from section padding (mobile)
    2xl: "64px"                      # from section padding (tablet)
    3xl: "96px"                      # from section padding (desktop)
    4xl: "128px"                     # from hero section vertical padding
    5xl: "160px"                     # from between major sections (desktop)
    section-gap: "120px"             # from gap between content sections — cinematic
    hero-padding-top: "200px"        # from hero section top padding — extreme
    hero-padding-bottom: "160px"     # from hero section bottom padding

  layout:
    max-width: "1440px"              # from content container max-width
    content-width: "1200px"          # from text content max-width
    narrow-width: "800px"            # from article/text-heavy content
    grid-columns: 12                 # from desktop grid system
    grid-gutter: "24px"              # from column gap
    grid-margin: "48px"              # from page edge margin (desktop)
    grid-margin-mobile: "24px"       # from page edge margin (mobile)

    # --- Breakpoints ---
    breakpoint-sm: "640px"           # from mobile
    breakpoint-md: "768px"           # from tablet portrait
    breakpoint-lg: "1024px"          # from tablet landscape
    breakpoint-xl: "1280px"          # from desktop
    breakpoint-2xl: "1440px"         # from large desktop
    breakpoint-3xl: "1920px"         # from ultra-wide

  borders:
    radius-none: "0px"               # from most elements — sharp geometry
    radius-sm: "2px"                 # from subtle rounding on inputs
    radius-md: "4px"                 # from buttons (if any rounding)
    radius-card: "0px"               # from cards — always sharp
    radius-full: "50%"               # from avatar/icon circles
    border-width: "1px"              # from standard borders
    border-color: "#2C2C2C"          # from default borders — barely visible

  shadows:
    # Rolls-Royce avoids drop shadows. Elevation is communicated through
    # color differentiation and subtle border, not shadow.
    elevation-none: "none"           # from most components
    elevation-subtle: "0 1px 3px rgba(0,0,0,0.3)"  # from floating UI elements
    elevation-modal: "0 8px 32px rgba(0,0,0,0.5)"  # from modals, lightboxes
    glow-purple: "0 0 40px rgba(107,45,139,0.2)"   # from accent highlight moments

  motion:
    # --- Philosophy: Unhurried. Deliberate. Like the car itself. ---
    # No fast snaps. No bouncy springs. Everything glides.
    # Think: power-assisted door closing, not sports car acceleration.
    # The Spirit of Ecstasy rising from the bonnet = the animation archetype.

    duration-instant: "100ms"        # from micro-interactions (opacity, color)
    duration-fast: "200ms"           # from button state changes
    duration-normal: "400ms"         # from component transitions
    duration-slow: "600ms"           # from section reveals, image transitions
    duration-stately: "1000ms"       # from page transitions, hero reveals
    duration-cinematic: "1500ms"     # from full-screen transitions, configurator
    duration-entrance: "800ms"       # from scroll-triggered element reveals

    easing-default: "cubic-bezier(0.25, 0.1, 0.25, 1.0)"    # from standard ease
    easing-enter: "cubic-bezier(0.0, 0.0, 0.2, 1.0)"        # from elements entering
    easing-exit: "cubic-bezier(0.4, 0.0, 1.0, 1.0)"         # from elements exiting
    easing-stately: "cubic-bezier(0.22, 0.61, 0.36, 1.0)"   # from slow, dignified reveals
    easing-glide: "cubic-bezier(0.16, 1, 0.3, 1)"           # from smooth scroll, parallax

    # --- Scroll Behavior ---
    scroll-behavior: "smooth"
    scroll-reveal-threshold: "0.15"  # from IntersectionObserver threshold
    parallax-factor: "0.3"          # from subtle parallax on hero images
    stagger-delay: "100ms"          # from staggered list/grid reveals

  components:
    # --- Navigation ---
    nav-height: "80px"               # from fixed header height
    nav-background: "rgba(0,0,0,0.95)" # from semi-transparent dark nav
    nav-backdrop-filter: "blur(20px)"  # from frosted glass effect
    nav-text-size: "13px"            # from navigation links
    nav-text-transform: "uppercase"
    nav-text-tracking: "0.2em"
    nav-logo-height: "28px"          # from Spirit of Ecstasy mark

    # --- Buttons ---
    button-height: "48px"            # from standard button height
    button-padding: "0 32px"         # from button horizontal padding
    button-font-size: "13px"
    button-tracking: "0.15em"
    button-transform: "uppercase"
    button-border: "1px solid #FFFFFF"  # from outlined primary button
    button-bg-primary: "transparent"    # from primary = ghost/outlined
    button-bg-hover: "#FFFFFF"
    button-text-hover: "#000000"
    button-transition: "all 400ms cubic-bezier(0.25,0.1,0.25,1.0)"
    # Note: Primary button is OUTLINED, not filled. Restraint > impact.

    # --- Cards ---
    card-bg: "#1A1A1A"              # from card surface
    card-border: "none"
    card-radius: "0px"              # from sharp corners
    card-padding: "32px"
    card-image-aspect: "16/9"       # from landscape automotive photography
    card-hover-transform: "none"    # from NO hover scale — dignity, not excitement

    # --- Hero Sections ---
    hero-min-height: "100vh"         # from full-viewport heroes
    hero-image-treatment: "object-fit: cover"
    hero-overlay: "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)"
    hero-text-position: "bottom"     # from text anchored at bottom over image
    hero-text-max-width: "800px"

    # --- Configurator (Bespoke) ---
    configurator-sidebar-width: "400px"
    configurator-bg: "#0A0A0A"
    configurator-swatch-size: "48px"
    configurator-swatch-border: "2px solid transparent"
    configurator-swatch-active: "2px solid #FFFFFF"

    # --- Image Gallery / Lightbox ---
    lightbox-bg: "rgba(0,0,0,0.95)"
    lightbox-close-size: "48px"
    lightbox-transition: "600ms cubic-bezier(0.22,0.61,0.36,1.0)"

  photography:
    # --- Direction: Vehicle as Architectural Subject ---
    # The car is photographed like a building: from below, with reverence.
    # Environment is secondary — the car dominates, environment serves.
    # No action shots, no motion blur, no lifestyle chaos.
    # Studio precision even in outdoor settings.
    aspect-ratios: ["21:9", "16:9", "4:3", "1:1"]  # from hero=21:9, cards=16:9, details=1:1
    primary-treatment: "low-key studio lighting, dark backgrounds"
    secondary-treatment: "architectural environment, dusk/twilight"
    color-grade: "desaturated, cool shadows, warm highlights on chrome"
    grain: "subtle film grain on hero images — 35mm cinema aesthetic"
    hero-format: "21:9 ultrawide — cinematic"
    detail-format: "1:1 square — macro on materials (leather, wood, metal)"

  z-index:
    base: 0
    card: 10
    sticky: 100
    nav: 1000
    overlay: 2000
    modal: 3000
    toast: 4000
---

# Rolls-Royce Motor Cars — Design System

## 1. Brand Identity

### Philosophy
Rolls-Royce communicates "the best car in the world" through **restraint, not spectacle**. The digital experience mirrors the ownership experience: unhurried, considered, impeccable. Every pixel earns its place. White space is not empty — it is architecture.

The 2021 rebrand by **Pentagram** (led by partner **Marina Willer**) repositioned Rolls-Royce from "car manufacturer" to **"house of luxury"** — competing not with BMW or Mercedes but with Hermes, Patek Philippe, and haute couture. The average client age dropped to 43, demanding a digital-first brand expression.

### Design Agency
- **Brand Identity**: Pentagram (Marina Willer, partner)
- **Digital Implementation**: AKQA
- **Year**: 2021 rebrand, ongoing digital evolution

### Spirit of Ecstasy
The Spirit of Ecstasy was elevated from hood ornament to **primary brand mark**, replacing the RR monogram as the hero symbol. Redesigned facing rightward with simplified geometry optimized for digital reproduction at small sizes. An abstract "expression" variant with fluid forms conveys forward motion.

### Wordmark
"ROLLS-ROYCE MOTOR CARS" — all uppercase, Riviera Nights Light (weight 300), letter-spacing `0.25em`. The extreme tracking creates architectural authority. The wordmark is never set in bold.

## 2. Color System

### Primary Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `purple-spirit` | `#6B2D8B` | Signature accent — links, active states, brand moments |
| `charles-blue` | `#1C3E6E` | Heritage accent — secondary, formal contexts |
| `black` | `#000000` | Primary background — true black |
| `white` | `#FFFFFF` | Primary text, headings |
| `silver` | `#C0C0C0` | Secondary text, metadata |
| `spirit-gold` | `#C4A265` | Spirit of Ecstasy accent — extremely sparingly |

### Purple Spirit
The defining color of the 2021 rebrand. A deep, regal violet that signals "house of luxury" — distinct from automotive blue/red conventions. Used with extreme discipline: accent highlights, hover states, occasional section washes. Never as a background fill on large areas. The restraint amplifies its impact when it appears.

### Dark Mode Philosophy
Rolls-Royce is **dark-mode native** — this is not a "toggle" option, it IS the brand. The darkness creates the stage for the product to glow. True black (#000000) backgrounds with near-black (#0D0D0D) elevated surfaces. Contrast is controlled: white text on black, silver on near-black. No harsh borders — surfaces float through tonal separation.

### Surface Hierarchy

```
#000000  ──  Page background (true black)
#0D0D0D  ──  Elevated panels, sections
#1A1A1A  ──  Cards, interactive surfaces
#2C2C2C  ──  Borders, dividers (barely visible)
#3D3D3D  ──  Active borders, form inputs
```

## 3. Typography

### Riviera Nights

The custom typeface commissioned for the 2021 rebrand, replacing Gill Sans (which Rolls-Royce had used since the 1930s). Designed by Pentagram.

**Classification**: Transitional serif with geometric sans-serif clarity — a typeface that exists between eras, like the brand itself.

**Key Characteristics**:
- **Beveled/bezelled letterforms** — subtle chamfered edges that catch light, referencing the coach-built metalwork of the cars
- **Extreme delicacy** at light weights — thin strokes project effortless luxury
- **High stroke contrast** — thick/thin variation reminiscent of Didone typefaces
- **Wide character width** — letters breathe, occupying generous horizontal space
- **Optimized for both print and digital** — legible at small sizes despite decorative DNA

**Weights Available**:
- Light (300) — display headings, wordmark, navigation
- Regular (400) — body text, UI elements
- Medium (500) — subheadings, emphasis
- Bold (700) — rare emphasis moments (used sparingly)

**Fallback Stack**: `'Riviera Nights', Georgia, 'Times New Roman', serif`

### Type Scale

| Token | Size | Weight | Tracking | Transform | Usage |
|-------|------|--------|----------|-----------|-------|
| `display-hero` | 80px | 300 | 0.15em | none | Hero headlines |
| `display-large` | 56px | 300 | 0.08em | none | Section titles |
| `display-medium` | 40px | 400 | 0.08em | none | Subsections |
| `heading-1` | 32px | 400 | 0.05em | none | Page titles |
| `heading-2` | 24px | 400 | 0.05em | none | Card titles |
| `heading-3` | 20px | 500 | 0.03em | none | Feature names |
| `body-large` | 18px | 400 | 0.02em | none | Lead paragraphs |
| `body` | 16px | 400 | 0.02em | none | Body text |
| `nav` | 13px | 400 | 0.2em | uppercase | Navigation |
| `button` | 13px | 400 | 0.15em | uppercase | Buttons, CTAs |
| `caption` | 12px | 400 | 0.02em | none | Fine print |

### Letter-Spacing Philosophy
Rolls-Royce's letter-spacing is as deliberate as the panel gaps on a Phantom. Wide tracking on uppercase navigation and wordmarks creates **architectural authority** — text becomes a structural element, not just content. Body text uses subtle tracking (0.02em) for comfortable reading with Riviera Nights' wide characters.

## 4. Spacing

### Philosophy
**Luxury is negative space.** The Rolls-Royce website uses spacing the way the car uses silence — generously, confidently, without apology. Sections have cinematic separation (120px+). Hero areas breathe with 200px+ top padding. Content never crowds the viewport edges.

### Scale

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 8px | Icon padding, fine adjustments |
| `sm` | 16px | Inline spacing, tight grouping |
| `md` | 24px | Component padding |
| `lg` | 32px | Card padding, medium gaps |
| `xl` | 48px | Section padding (mobile) |
| `2xl` | 64px | Section padding (tablet) |
| `3xl` | 96px | Section padding (desktop) |
| `4xl` | 128px | Hero vertical padding |
| `5xl` | 160px | Major section separation |
| `section-gap` | 120px | Between content sections |

### Grid
- 12 columns, 24px gutter, 48px margin (desktop)
- Max content width: 1440px (container), 1200px (text), 800px (article)
- Mobile: 24px edge margins, fluid columns

## 5. Components

### Navigation
Fixed header, 80px height. Semi-transparent black (`rgba(0,0,0,0.95)`) with `backdrop-filter: blur(20px)`. Spirit of Ecstasy mark at left, model navigation in uppercase Riviera Nights at 13px with 0.2em tracking. Hamburger menu on mobile expands to full-screen overlay. No dropdown menus — full-screen takeover for model selection.

### Buttons
**Primary button = outlined, not filled.** This is the Rolls-Royce principle: the brand does not shout. 1px white border, transparent background, uppercase 13px text. On hover: fills white, text inverts to black. Transition: 400ms with stately easing. No border-radius (sharp corners).

**Purple accent buttons** appear only for configurator/bespoke CTAs — indicating "make it yours" moments.

### Cards
Sharp corners (0px radius). Dark surface (#1A1A1A) on true black background. No drop shadow — elevation through tonal shift. **No hover scale/lift** — the card remains dignified. Hover state: subtle border appearance or image overlay shift. Image aspect ratio 16:9 for landscape automotive photography.

### Hero Sections
Full viewport height (100vh). Full-bleed photography with gradient overlay darkening toward bottom where text lives. Text positioned at bottom third. Hero headline in display-hero (80px, light weight). Slow parallax on image (factor 0.3). Entry animation: 1000ms+ fade-up with stately easing.

### Configurator (Bespoke)
The crown jewel of the digital experience. Dark environment (#0A0A0A). 3D model viewer centered with material/color options in a side panel. Swatches (48px) with white border on active state. Smooth camera orbit transitions (1500ms). The configurator UX embodies "unhurried luxury" — no rapid switching, deliberate transitions between views.

## 6. Motion Design

### Philosophy: The Spirit of Ecstasy Rising
Every animation should feel like the Spirit of Ecstasy rising from the bonnet: **deliberate, graceful, unhurried.** Nothing snaps. Nothing bounces. Everything glides.

Reference: the power-assisted Rolls-Royce door closing — 600ms of pure controlled motion. This is the animation archetype.

### Timing

| Token | Duration | Usage |
|-------|----------|-------|
| `instant` | 100ms | Color/opacity micro-transitions |
| `fast` | 200ms | Button state changes |
| `normal` | 400ms | Component transitions |
| `slow` | 600ms | Section reveals, image cross-fades |
| `stately` | 1000ms | Page transitions, hero entrances |
| `cinematic` | 1500ms | Full-screen transitions, configurator camera |

### Easing
No linear or sharp easing. Everything uses custom bezier curves:
- **Default**: `cubic-bezier(0.25, 0.1, 0.25, 1.0)` — refined ease
- **Enter**: `cubic-bezier(0.0, 0.0, 0.2, 1.0)` — decelerate into view
- **Stately**: `cubic-bezier(0.22, 0.61, 0.36, 1.0)` — slow, dignified reveal
- **Glide**: `cubic-bezier(0.16, 1, 0.3, 1)` — smooth scroll parallax

### Scroll Behavior
Smooth scroll. Intersection Observer reveals with 0.15 threshold. Elements fade up with 20-30px translate. Staggered grid reveals at 100ms delay. Parallax on hero images (subtle, factor 0.3).

### Prohibited Motion
- No bounce easing — undignified
- No elastic/spring physics — frivolous
- No rapid state toggling — chaotic
- No particle effects — decorative noise
- No loading spinners visible (use skeleton screens or nothing)

## 7. Photography Direction

### Vehicle as Architectural Subject
The car is never "in action." It is presented as a **still monument** — photographed like architecture, with the reverence of a Hiroshi Sugimoto seascape.

**Primary Treatment**: Low-key studio lighting against dark backgrounds. Dramatic pools of light on the hood, flanks, grille. Deep shadows. The car emerges from darkness like a sculpture in a gallery.

**Secondary Treatment**: Architectural environments at dusk/twilight. Grand estates, modernist pavilions, urban boulevards emptied of people. The environment serves the car, never competes.

**Color Grading**: Desaturated, cool shadows, warm highlights on chrome and paint. Subtle film grain (35mm cinema aesthetic). No HDR, no oversaturation, no Instagram filters.

**Detail Photography**: 1:1 square format. Macro on materials — hand-stitched leather, open-pore wood, brushed aluminum, starlight headliner fiber optics. These shots sell the bespoke craft narrative.

**Prohibited**: Motion blur, worm's-eye "car ad" angles, people posing with cars, bright daylight flat lighting, visible logos of other brands in background.

## 8. Digital Experience Principles

### 1. Restraint is Luxury
Less interface, more content. Minimal chrome, maximum photography. The UI disappears — the product speaks.

### 2. Unhurried Pacing
No urgency. No countdown timers. No "limited offer" language. The content unfolds at a pace that respects the viewer's attention. Scroll-driven storytelling, not click-driven tunnels.

### 3. Bespoke as Verb
The configurator is not a "builder" — it is a bespoke consultation in digital form. The language is "commission" not "customize," "specify" not "configure."

### 4. Architecture Over Decoration
Sharp corners. Grid discipline. Typographic hierarchy. No ornament for ornament's sake. Every element is structural.

### 5. Darkness as Environment
The dark mode is not an aesthetic choice — it is an environmental design decision. The screen becomes a gallery wall. The car, lit against darkness, becomes a jewel in a velvet case.

## 9. Interaction Patterns

### Scroll Storytelling
Long-scroll pages with cinematic pacing. Each scroll position triggers a new "chapter" — vehicle angle, material detail, driving experience. The scroll bar is hidden. Progress is felt, not measured.

### Model Exploration
Full-viewport image → scroll to reveal specifications → scroll to gallery → scroll to configurator CTA. No tabs, no accordions. Linear narrative.

### Hover States
Subtle and purposeful. Text links: Purple Spirit underline reveal. Images: slight overlay opacity shift. Buttons: fill transition (400ms). Cards: no transform — border or overlay only.

### Page Transitions
Full-screen fade to black, content loads, fade from black. Duration: 1000ms. The black frame between pages = the cinema experience of a cut between scenes.

## 10. Accessibility & Performance

### Color Contrast
White (#FFFFFF) on black (#000000) = 21:1 ratio (AAA). Silver (#C0C0C0) on near-black (#0D0D0D) = 11.7:1 (AAA). Purple Spirit (#6B2D8B) on black = 4.6:1 (AA for large text only — used accordingly).

### Motion
`prefers-reduced-motion` respected — animations collapse to instant. Parallax disabled. Scroll reveals become immediate.

### Image Optimization
WebP/AVIF with JPEG fallback. Lazy loading below fold. Hero images: preloaded, progressive JPEG. Srcset with art-direction for mobile (tighter crops).

## 11. Technical Stack (Digital Platform)

| Layer | Technology |
|-------|-----------|
| Agency | AKQA (digital) |
| CMS | Adobe Experience Manager (AEM) |
| Frontend | HTML5, CSS3, vanilla JS + framework |
| Animation | CSS transitions + custom JS (no heavy GSAP dependency) |
| 3D Configurator | WebGL-based (custom) |
| Analytics | Adobe Analytics |
| CDN | Akamai |
| Protection | Cloudflare WAF |
| Responsive | Mobile-first, fluid up to 1920px |

## 12. Anti-Patterns (What Rolls-Royce Never Does)

- No pricing on the website (ever — "if you have to ask...")
- No comparison tables with competitors
- No star ratings or review widgets
- No pop-ups, no cookie banners that obscure content (integrated consent)
- No chatbots or floating help buttons
- No social media feeds embedded in pages
- No countdown timers or urgency tactics
- No animated gradients or mesh backgrounds
- No glassmorphism (the nav blur is functional, not decorative)
- No emoji or casual iconography
- No stock photography — every image is commissioned
- No user-generated content on the main site
- No visible loading states (skeleton screens or nothing)
