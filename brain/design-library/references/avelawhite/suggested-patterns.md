# Avelã White — Suggested Patterns for Distillation
## Source: https://www.avelawhite.com/
## Extracted: 2026-05-01
## Status: PENDING ORCHESTRATOR APPROVAL

These are proposals only. The design-system-extractor does NOT write to `patterns/` directly.
Each entry references exact source lines in `html.html` and `design-tokens.md`.

---

## Priority 1 — Immediate Steal (universal luxury signals)

### `patterns/interactions/inactive-dimming.md`
**Why**: The single most powerful luxury interaction pattern on the site. When any item in a nav or list is hovered, ALL siblings fade to 40-50% opacity — the hovered item remains at 100%. This "spotlight" effect is used by Bottega Veneta, Loro Piana, and Avelã White alike. Zero JavaScript required. Pure CSS sibling selectors + transitions.

**Source reference** (html.html — custom.css block):
```css
/* Nav variant */
.header-nav-list:hover > .header-nav-item { opacity: 0.5; }
.header-nav-list:hover > .header-nav-item:hover { opacity: 1; }
.header-nav-folder-content { transition: ease-in-out 0.5s; }

/* List items variant (deeper fade) */
.user-items-list-simple:hover .list-item { opacity: 0.4; }
.user-items-list-simple:hover .list-item:hover {
  opacity: 1;
  transform: scale(1.03);
}
.user-items-list-simple .list-item {
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease;
}
```

**REIS [IA] application**: Navigation links, service cards, portfolio grids. Anywhere we have a horizontal list of items that need to communicate "choose one."

---

### `patterns/tokens/hsl-opacity-system.md`
**Why**: Architectural token pattern — define every color as an HSL triplet, consume via `hsla(var(--color-hsl), opacity)`. This eliminates the need for separate "transparent" or "muted" token variants. One token, infinite opacity levels. Directly applicable to REIS [IA]'s current `--color-primary: #4A90FF` token system.

**Source reference** (html.html — site.css :root, first 500 chars):
```css
:root {
  --black-hsl: 20, 14.75%, 11.96%;
  --white-hsl: 40, 52.94%, 96.67%;
  --accent-hsl: 28.33, 14.88%, 52.55%;
}
/* Usage throughout site: */
hsla(var(--black-hsl), 0.17)   /* dividers */
hsla(var(--black-hsl), 0.49)   /* header border */
hsla(var(--black-hsl), 1)      /* full text */
```

**REIS [IA] application**:
```css
/* Proposed REIS [IA] adaptation */
:root {
  --blue-hsl: 214, 100%, 64%;    /* #4A90FF */
  --white-hsl: 0, 0%, 100%;
  --black-hsl: 0, 0%, 0%;
}
/* Then use: hsla(var(--blue-hsl), 0.1) for subtle glow backgrounds */
```

---

### `patterns/motion/micro-scale-hover.md`
**Why**: The exact scale values matter. 1.02 for images, 1.03 for text-cards. Values above 1.05 read as playful/startup. Values below 1.01 are imperceptible. The 1.02-1.03 range is the "luxury scale hover" — it communicates tactility without drama.

**Source reference** (html.html — custom.css):
```css
/* Gallery images */
.gallery-reel-item:hover img {
  transform: scale(1.02);
  transition: 0.4s ease;
}

/* List item cards */
.user-items-list-simple:hover .list-item:hover {
  transform: scale(1.03);
}
```

**REIS [IA] application**: Product cards, service cards, collection thumbnails. Any clickable card element.

---

## Priority 2 — Typography Patterns

### `patterns/typography/ultra-light-serif-display.md`
**Why**: Using a serif font at weight 200 for display headings is the typographic signature of luxury fashion, fine hotels, and editorial design. It reads as "aristocratic" not "thin." Avelã White uses Editor's Note 200 — the free equivalent is Cormorant Garamond 300 or Playfair Display 300.

**Source reference** (html.html — style block 2):
```css
@font-face {
  font-family: 'editors-note-46p2ah';
  font-style: normal;
  font-weight: 200;
  src: url('...squarespace-cdn.com/.../font.otf') format('opentype');
}
@font-face {
  font-family: 'editors-note-46p2ah';
  font-style: italic;
  font-weight: 200;
  /* italic variant for em elements */
}
```

**Typography rules (custom.css)**:
```css
h2 { text-transform: uppercase; }
h1 em, h2 em, h3 em { text-transform: none !important; }  /* italics break uppercase */
@media (max-width: 799px) { h1 { font-size: 2.5rem; } }
```

**REIS [IA] application**: NOT directly applicable (we use Inter, dark mode, geometric aesthetic). BUT: the principle of using the lightest available weight for display type applies. Inter 300 for hero headings rather than 400 or 500.

---

### `patterns/typography/uppercase-tracked-label.md`
**Why**: A systematic "label" typographic style — geometric sans, uppercase, 0.1em letter-spacing, weight 400-500 — used consistently for nav items, captions, marquees, tab buttons, and section labels. Creates immediate visual hierarchy between display type (serif, mixed case) and UI type (sans, all-caps).

**Source reference** (html.html — custom.css):
```css
.sqsrte-small {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
  line-height: 1.4em;
}
.sqsrte-large {
  font-family: "pp-neue-montreal-mjs551";  /* or Inter */
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
}
.sqs-block-marquee p {
  font-family: "pp-neue-montreal-mjs551";
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 400;
}
```

**REIS [IA] application**: Directly applicable. REIS [IA] can formalize this as a `.label` utility class using Inter 500, uppercase, 0.1em tracking for all navigation, caption, and UI label contexts.

---

## Priority 3 — Motion Patterns

### `patterns/motion/clip-path-content-reveal.md`
**Why**: Content blocks enter via clip-path polygon animation rather than opacity fade. The "wipe" reveal feels more editorial and controlled than a fade — it implies the content is being uncovered rather than appearing. Two variants: vertical collapse (opens top-to-bottom) and horizontal wipe (opens left-to-right).

**Source reference** (html.html — site.css @keyframes):
```css
@keyframes tmpl-anim-clip-vertical-up {
  from, to { animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
  from {
    clip-path: polygon(
      50% 0%, 100% 0%, 100% 0%, 50% 0%,
      50% 100%, 0% 100%, 0% 100%, 50% 100%,
      50% 100%, 50% 100%
    );
    /* Collapsed to a vertical center line */
  }
  /* to: full rectangle */
}

@keyframes tmpl-anim-clip-horizontal-left {
  from, to { animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
  from {
    clip-path: polygon(
      0% 50%, 0% 100%, 0% 100%, 0% 50%,
      100% 50%, 100% 0%, 100% 0%, 100% 50%,
      100% 50%, 100% 50%
    );
    /* Collapsed to a horizontal center line */
  }
}

/* Config */
animation-duration: 800ms;
animation-fill-mode: both;
animation-delay: 0.6s;
animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
```

**REIS [IA] application**: Hero section content reveal, section entrance animations. Replace simple `opacity` + `translateY` entrances with clip-path wipes for more editorial feel.

---

### `patterns/motion/section-opacity-resting-state.md`
**Why**: Setting all interactive elements (links, cards) within a section to `opacity: 0.7` at rest — and `1.0` on hover — creates a subtle "everything is resting, interaction activates" feeling. Pairs with inactive-dimming for a complete luxury interaction system.

**Source reference** (html.html — custom.css):
```css
section[data-section-id="695412325017f0360e7f6a87"] p a {
  text-decoration: none;
  opacity: 0.7;
}
section[data-section-id="695412325017f0360e7f6a87"] p a:hover {
  text-decoration: none;
  opacity: 1;
}
```

**REIS [IA] application**: Footer links, secondary navigation, service description links. Any context where we want interaction to feel like "awakening" rather than "clicking."

---

## Priority 4 — Layout Patterns

### `patterns/layout/warm-monochrome-palette.md`
**Why**: The entire palette lives in a single warm hue family (orange/brown, 20-40° hue range) at varying saturation and lightness. Zero cold tones. This creates unconscious comfort — the site feels like natural materials (paper, linen, wood) rather than a screen.

**Source reference** (html.html — site.css :root):
```css
:root {
  --white-hsl:       40,   52.94%, 96.67%;   /* #fbf8f2 cream */
  --lightAccent-hsl: 35.29, 16.5%, 79.8%;   /* #d3ccc2 linen */
  --accent-hsl:      28.33, 14.88%, 52.55%; /* #988573 taupe */
  --darkAccent-hsl:  20.87, 18.7%, 24.12%;  /* #493a32 espresso */
  --black-hsl:       20,   14.75%, 11.96%;  /* #221c19 near-black */
}
```

**REIS [IA] application**: NOT a direct copy (REIS [IA] is cool-tone, not warm). BUT the principle applies: choose a hue family and stay in it. REIS [IA]'s neutrals could all shift toward cool-blue (200-220° hue range) rather than true grays, reinforcing the electric blue accent.

---

## Cross-Reference: REIS [IA] Compatibility

| Pattern                      | REIS [IA] Compatible? | Notes |
|------------------------------|-----------------------|-------|
| Inactive dimming             | YES — direct steal    | Works with any color scheme |
| HSL opacity token system     | YES — architecture    | Extend current token system |
| Micro-scale hover (1.02-1.03)| YES — direct steal    | Works with any color scheme |
| Ultra-light serif display    | PARTIAL               | Inter 300 adaptation only (no serif in brand) |
| Uppercase tracked label      | YES — direct steal    | Inter 500, 0.1em tracking for all labels |
| Clip-path content reveal     | YES — motion          | Replace fade-up with wipe reveals in hero |
| Resting opacity 0.7          | YES — direct steal    | All secondary links and interactive elements |
| Warm monochrome palette      | NO — principle only   | REIS [IA] is cool-dark, not warm-earth |

---

## Files To Create (Orchestrator Action Required)

```
patterns/interactions/inactive-dimming.md          — HIGH PRIORITY
patterns/tokens/hsl-opacity-system.md              — HIGH PRIORITY
patterns/motion/micro-scale-hover.md               — HIGH PRIORITY
patterns/typography/uppercase-tracked-label.md     — MEDIUM PRIORITY
patterns/motion/clip-path-content-reveal.md        — MEDIUM PRIORITY
patterns/motion/section-opacity-resting-state.md   — MEDIUM PRIORITY
patterns/typography/ultra-light-serif-display.md   — LOW (no serif in REIS [IA] brand)
patterns/layout/warm-monochrome-palette.md         — LOW (principle reference only)
```
