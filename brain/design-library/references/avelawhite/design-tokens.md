# Avelã White — Design Tokens
## Source: https://www.avelawhite.com/
## Extracted: 2026-05-01
## Platform: Squarespace (custom-built on top of SQS fluid engine)

---

## Color System

### Root HSL Palette
All colors are defined as HSL triplets and used via `hsla(var(--token-hsl), opacity)`.
This allows per-component opacity control without color duplication — a notable pattern.

| Token               | HSL Value              | Hex Equivalent | Description                          |
|---------------------|------------------------|----------------|--------------------------------------|
| `--white-hsl`       | 40, 52.94%, 96.67%    | `#fbf8f2`      | Warm cream-white (NOT pure white)    |
| `--lightAccent-hsl` | 35.29, 16.5%, 79.8%   | `#d3ccc2`      | Warm greige / pale linen             |
| `--accent-hsl`      | 28.33, 14.88%, 52.55% | `#988573`      | Warm taupe-brown (primary accent)    |
| `--darkAccent-hsl`  | 20.87, 18.7%, 24.12%  | `#493a32`      | Deep warm brown                      |
| `--black-hsl`       | 20, 14.75%, 11.96%    | `#221c19`      | Warm near-black (NOT pure black)     |

### Semantic Color Mappings (from site.css :root)
```css
:root {
  --white-hsl: 40, 52.94%, 96.67%;        /* #fbf8f2 - warm cream */
  --lightAccent-hsl: 35.29, 16.5%, 79.8%; /* #d3ccc2 - linen */
  --accent-hsl: 28.33, 14.88%, 52.55%;    /* #988573 - taupe */
  --darkAccent-hsl: 20.87, 18.7%, 24.12%; /* #493a32 - espresso */
  --black-hsl: 20, 14.75%, 11.96%;        /* #221c19 - warm near-black */
}
```

### Opacity Variants in Use
The HSL system enables fine-grained opacity layering without extra tokens:
```css
hsla(var(--black-hsl), 0.17)   /* dividers, subtle borders */
hsla(var(--black-hsl), 0.19)   /* section dividers */
hsla(var(--black-hsl), 0.49)   /* header border */
hsla(var(--black-hsl), 1)      /* text, solid elements */
hsla(var(--white-hsl), 1)      /* header bg, cards */
hsla(var(--accent-hsl), 1)     /* accent bg blocks */
```

### Named Hex Values (from custom.css)
Specific hex values used in custom CSS overrides:
```css
#fbf8f2    /* cream background (matches --white-hsl) */
#fcf9f6    /* slightly lighter cream, used in dark sections */
#231d1a    /* deep near-black text */
#171412    /* darkest near-black (pricing toggles) */
#cbb7a7    /* warm sand — link hover color */
rgba(35, 29, 26, 0.15)   /* subtle borders */
rgba(35, 29, 26, 0.20)   /* filter borders */
```

### Color Philosophy
- ZERO cold grays or pure black/white. Every tone is warm — the entire palette lives in the warm beige-brown-cream spectrum
- Background color: warm cream (#fbf8f2), not white (#ffffff)
- Text color: warm near-black (#221c19), not pure black (#000000)
- The warmth creates an "aged luxury paper" feel throughout
- Accent (#988573) is used for interactive states and accent blocks — warm taupe reads as sophisticated, not bold

---

## Typography System

### Font Families
Two fonts loaded via Squarespace CDN (not Google Fonts):

#### 1. Editor's Note (Serif — for display/headings)
```css
@font-face {
  font-family: 'editors-note-46p2ah';
  font-style: italic;
  font-weight: 200;
  src: url('...squarespace-cdn.com/.../font.otf') format('opentype');
}
@font-face {
  font-family: 'editors-note-46p2ah';
  font-style: normal;
  font-weight: 200;
  src: url('...squarespace-cdn.com/.../font.otf') format('opentype');
}
```
- Role: Display headings, H1, H2
- Weight: 200 (ultra-light) — creates extreme elegance
- Italic variant: used for emphasis, em elements
- Character: classical editorial serif, similar to Cormorant or EB Garamond family

#### 2. PP Neue Montreal (Geometric Sans — for body/UI)
```css
@font-face {
  font-family: 'pp-neue-montreal-mjs551';
  font-style: normal;
  font-weight: 300;
  src: url('...squarespace-cdn.com/.../font.woff') format('woff');
}
@font-face {
  font-family: 'pp-neue-montreal-mjs551';
  font-style: normal;
  font-weight: 500;
  src: url('...squarespace-cdn.com/.../font.woff') format('woff');
}
```
- Role: Navigation, captions, labels, CTAs, body text
- Weights: 300 (light) and 500 (medium)
- Character: PP Neue Montreal is a premium geometric grotesque sans-serif
- Available commercially: https://pangrampangram.com/products/neue-montreal

#### 3. Inter (fallback/supplemental)
```css
/* Google Fonts fallback */
font-family: Inter;
font-weight: 300, 400, 500;
font-style: normal, italic;
```

### Typography Rules (from custom.css)
```css
h2 { text-transform: uppercase; }
h2 em { text-transform: none !important; }   /* italics never uppercase */
h1 em { text-transform: none !important; }   /* same rule for h1 */
h3 em { text-transform: none !important; }

/* Small text utility: uppercase sans with tracking */
.sqsrte-small {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
  line-height: 1.4em;
}

/* Large body sans override */
.sqsrte-large {
  font-family: "pp-neue-montreal-mjs551";
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
}

/* Marquee text */
.sqs-block-marquee p {
  font-family: "pp-neue-montreal-mjs551";
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 400;
}
```

### Heading Size (custom override)
```css
/* Mobile heading max */
@media (max-width: 799px) { h1 { font-size: 2.5rem; } }

/* Specific section override */
section[data-section-id="66b8d82f..."] h1 { font-size: 2.4rem; }
```

### Typography Pairing Logic
| Element     | Font               | Weight | Transform  | Tracking  |
|-------------|--------------------|--------|------------|-----------|
| H1, H2      | Editor's Note      | 200    | UPPERCASE  | default   |
| H2 italic   | Editor's Note      | 200    | none       | default   |
| H3, H4      | Editor's Note      | 200    | normal     | default   |
| Nav, Labels | PP Neue Montreal   | 500    | UPPERCASE  | 0.1em     |
| Body        | PP Neue Montreal   | 300    | none       | normal    |
| Captions    | PP Neue Montreal   | 400    | UPPERCASE  | 0.1em     |
| Marquee     | PP Neue Montreal   | 400    | UPPERCASE  | 0.1em     |

---

## Spacing System

### Grid System
```css
/* Mobile */
--sqs-mobile-site-gutter: 6vw;
/* Desktop */
--sqs-site-gutter: 4vw;
/* Max width */
--sqs-site-max-width: 1500px;
```

### Column Grid
- Mobile: 8-column grid
- Desktop: 24-column grid
- Column gap: 11px (fixed)
- Row unit: `calc(container-width * 0.0215)` (view-relative row heights)

### Container
```css
--container-width: min(1500px, calc(100vw - 4vw * 2 - var(--inset-padding)));
```

---

## Border & Divider System

```css
/* Light dividers */
hsla(var(--black-hsl), 0.17)   /* standard section divider */
hsla(var(--black-hsl), 0.19)   /* slightly heavier variant */

/* Borders: block-specific */
rgba(35, 29, 26, 0.15)         /* card/column separators */
rgba(35, 29, 26, 0.20)         /* filter bar borders */

/* Dark section borders */
1px solid #fcf9f6              /* cream borders on dark bg */
1px solid #fff                 /* newsletter on dark */

/* Pricing toggle border */
--toggle-border: 1px solid #171412;
```

---

## Motion & Transition System

### Squarespace Built-in Animations
```css
/* Section entrance animations */
@keyframes tmpl-anim-fade-up {
  from { opacity: 0; transform: matrix(1,0,0,1,0,25); }  /* 25px up */
  to { /* cubic-bezier(.4,0,.2,1) */ }
}

@keyframes tmpl-anim-fade-scale-up {
  from { opacity: 0; transform: matrix(.92,0,0,.92,0,0); }  /* 92% scale */
}

@keyframes tmpl-anim-fade-stretch-up {
  from { opacity: 0; transform: matrix(.9,0,0,1.3,0,25); }  /* stretch + translate */
  transform-origin: center 0;
}

@keyframes tmpl-anim-clip-vertical-up {
  /* clip-path reveal: bottom half first, then full reveal */
  animation-timing-function: cubic-bezier(.4,0,.2,1);
}

@keyframes tmpl-anim-clip-horizontal-left {
  /* clip-path wipe from left */
  animation-timing-function: cubic-bezier(.4,0,.2,1);
}
```

### Animation Timing
```css
animation-timing-function: cubic-bezier(.4, 0, .2, 1);  /* Material ease-in-out */
animation-duration: 800ms;                                /* primary duration */
animation-duration: 400ms;                                /* fast interactions */
animations-animation-delay: 0.6s;
animations-animation-duration: 0.9s;
```

### Transition Patterns (custom.css)
```css
/* Nav opacity fade on hover */
.header-nav-list:hover > .header-nav-item { opacity: 0.5; }
.header-nav-list:hover > .header-nav-item:hover { opacity: 1; }
.header-nav-folder-content { transition: ease-in-out 0.5s; }

/* Gallery item hover */
.gallery-reel-item img {
  transform: scale(1.02);
  transition: 0.4s ease;
}
.gallery-reel-item, .gallery-reel-item .gallery-caption {
  opacity: 0.7;
  transition: opacity 0.4s ease;
}
.gallery-reel-item:hover { opacity: 1; }

/* Product list hover */
.user-items-list-simple:hover .list-item { opacity: 0.4; }
.user-items-list-simple:hover .list-item:hover {
  opacity: 1;
  transform: scale(1.03);
}
.user-items-list-simple .list-item {
  transition: transform 0.4s cubic-bezier(.25,.46,.45,.94), opacity 0.4s ease;
}
```

### Scroll-Linked Animations
No GSAP, Lenis, or custom WebGL detected. Animations are:
1. CSS-only Squarespace template animations (fade-up, clip reveals)
2. Intersection Observer via Squarespace's own `block-animation` system
3. Gallery auto-scroll via custom JS (`setAutoScroll`) with 3000ms timing

```js
/* Gallery section auto scroller */
setAutoScroll({ gallery: 1, direction: 2, timing: 3000 });
```

---

## Shadow System

```css
/* Pricing table box shadow */
--bs-horizontal-offset: 0px;
--bs-vertical-offset: 5px;
--bs-blur: 15px;
--bs-color: rgba(0, 0, 0, 0.15);

/* Website mockup block */
--shadow: var(--medium);
--hover-shadow: var(--medium);
```

---

## Effects System

```css
/* Blur on header background */
backdrop-filter: blur(15px);
-webkit-backdrop-filter: blur(15px);
--blur-value: blur(15px);

/* Image overlay */
--image-component-overlay-opacity: 0;
--image-component-overlay-blend-mode: normal;
```

---

## Z-Index Layer System (from Squarespace)

```css
/* Section blocks use z-index 1-12 per section */
/* Typical stacking within sections */
z-index: 0;   /* background image */
z-index: 1;   /* base content */
z-index: 2-4; /* overlay text blocks */
z-index: 6-8; /* accent elements */
z-index: 12;  /* topmost interactive elements */
```

---

## Interactive States

### Button System
```css
/* Primary outline button */
.primary-button-style-outline .sqs-button-element--primary:not(:hover) {
  border: 1px solid;
}
/* Text transform on buttons */
.primary-button-style-outline .sqs-button-element--primary {
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
/* Padding */
.newsletter-block .newsletter-form-button {
  padding: 15px 20px;
}
```

### Form Inputs
```css
/* Minimal underline input style */
.newsletter-form-field-element {
  border-bottom: solid 1px;
  background-color: transparent;
  border-top: none;
  border-left: none;
  border-right: none;
}
/* Dark mode input variant */
.black .newsletter-form-field-element {
  border-bottom: solid 1px #fff;
}
.black input.field-element { color: #fcf9f6; }
.black input.field-element::placeholder { color: #fcf9f6; }
```

---

## Lightbox / Modal

```css
.sqs-modal-lightbox-content .lightbox-inner .lightbox-content {
  background: #fbf8f2;
  border: 3px solid #231d1a;
}
.sqs-modal-lightbox-content .lightbox-inner .lightbox-content .form-wrapper .form-title {
  font-size: 2.5rem;
}
```

---

## Underline Animation Pattern

```css
@keyframes underlineSlideOut {
  from { background-position: 0% bottom, 100% bottom; }
  to { background-position: 200% bottom, 300% bottom; }
}
@keyframes underlineSlideIn {
  from { background-position: -200% bottom, -100% bottom; }
  to { background-position: 0% bottom, 100% bottom; }
}
```
This is a CSS background-gradient underline animation — sophisticated alternative to `text-decoration`.

---

## Key Design System Observations

1. **Warm monochrome palette** — the entire site uses exactly 5 tones, all warm. No blues, greens, or cold grays.
2. **HSL opacity system** — single color defined as HSL, then used at multiple opacities, eliminates redundant variables.
3. **Type weight 200** — ultra-light serif for headings is the single most powerful luxury signal.
4. **Uppercase sans for labels** — PP Neue Montreal 500, 0.1em tracking is the systematic "label" style.
5. **Scale 1.02-1.03 hover** — gallery images and list items use micro-scale hover (not color change) for premium tactility.
6. **No shadows on cards** — luxury = no shadows. Cards are defined by borders (1px solid with low opacity) rather than shadows.
7. **Backdrop blur on header** — minimal 15px blur instead of solid header background on scroll.
