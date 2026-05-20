# AwSales Design Tokens
## Extracted: 2026-04-26
## Source: https://www.awsales.io/
## Stack: Framer (framer.com) — published Apr 23, 2026

---

## Color System

### Page Background
```css
html body { background: rgb(7, 12, 20); }
/* Framer class: */
.framer-f9xb2b { background-color: #070c14; }
```

### CSS Token Variables (body-level)
```css
body {
  --token-47ff482a-1754-4adf-987c-87b8e7e7b72e: #fff;               /* White */
  --token-060abd4e-18d4-466d-82e6-94b1c8048e8a: #102240;            /* Dark Navy */
  --token-9ae56eb9-c849-4fda-b158-dcec14e432da: #c8d3e3;            /* Light Blue-Gray */
  --token-8d186d4c-7ccd-4919-bc3a-3f26be168bf7: #1065e3;            /* Primary Blue */
  --token-c6c2bf8d-5a1f-4f85-9872-83169fbb786a: #828e9d;            /* Mid Gray */
  --token-4effaf58-293c-49f1-9061-f8e4a08e6c0c: #f2f9fe;            /* Near White */
  --token-03bcfe91-169b-45ea-a262-afb118f9217b: #ffffff05;           /* White 3% */
  --token-c32c9378-043a-48e9-8528-eea04a72eab9: #ffffff1a;           /* White 10% */
}
```

### Additional Token Colors (found in inline styles)
```
--token-de8ed926-7001-46f9-ba04-3723118d36f7: rgb(248, 249, 254)   /* Near White BG */
--token-c62bf750-2672-415c-a5a7-3001871b2106: rgb(200, 211, 227)   /* Light Blue BG */
--token-b32213de-a677-4f6d-93ea-f0b7678127df: rgb(72, 94, 121)     /* Blue-Gray Text */
```

### Full Color Palette
| Role | Value | Notes |
|------|-------|-------|
| Page BG | `#070c14` | Near-black deep navy |
| Secondary BG | `#121212` | Dark charcoal (card BG) |
| Dark Navy | `#102240` | Used in radial gradient bottoms |
| Primary Blue | `#1065e3` | Brand blue |
| Bright Blue (CTA) | `#4090f7` | CTA gradient start |
| Cyan Accent | `#079ed6` | Conic gradient accent |
| Dark Slate | `#233447` | CTA gradient end |
| White | `#ffffff` | Primary text |
| Light Blue-Gray | `#c8d3e3` | Secondary text |
| Mid Gray | `#828e9d` | Muted text |
| Grayish-Blue | `rgb(72, 94, 121)` | Meta Partner card body text |
| White 3% | `#ffffff05` | Separator line fade edges |
| White 10% | `#ffffff1a` | Separator line center |
| Link Blue | `#0099ff` (#09f) | Link color |

---

## Typography System

### Font Families (all loaded via Google Fonts)
1. **DM Sans** — weights 400, 500, 700 (italic + normal)
2. **Figtree** — weights 300, 400, 600, 700
3. **Manrope** — weights 400, 600, 700 (primary body font)
4. **Poppins** — weights 500, 700 (italic + normal)
5. Plus additional Framer-hosted custom fonts (woff2 assets)

### Observed Text Styles (from inline styles in HTML)
```css
/* Hero H1 */
font-family: "Poppins", "Poppins Placeholder", sans-serif;
font-weight: 700;
font-size: [large, ~64-80px based on container width 747px × 70px height];
letter-spacing: -0.04em;  /* tight tracking */
color: #ffffff;

/* Hero Subheading */
font-family: "Manrope", "Manrope Placeholder", sans-serif;
font-size: 18px;
line-height: 1.65em;
color: rgb(144, 157, 172);

/* Body paragraph */
font-family: "Manrope", "Manrope Placeholder", sans-serif;
font-size: 18px;
line-height: 1.65em;
color: rgb(144, 157, 172);  /* muted blue-gray */

/* Nav items */
font-family: "DM Sans";
font-size: 14px;
```

### Type Scale (inferred from container dimensions)
| Level | Size | Weight | Font | Notes |
|-------|------|--------|------|-------|
| Display H1 | ~72px | 700 | Poppins | Hero headline |
| H1 Section | ~52-64px | 700 | Poppins/Manrope | Section headers |
| H2 | ~36-42px | 700 | Manrope | Sub-headers |
| Body Large | 18px | 400 | Manrope | Hero subtext |
| Body | 16px | 400 | Manrope/DM Sans | General body |
| Small | 14px | 400 | DM Sans | Nav, captions |
| Tiny | 12px | 400 | DM Sans | Legal text |

---

## Spacing System

### Container Widths
```css
max-width: 1440px   /* Full page container */
max-width: 1300px   /* Content dividers */
max-width: 1200px   /* Standard content block */
max-width: 700px    /* Text column max */
max-width: 520px    /* Narrow text block */
```

### Section Padding Patterns
```css
padding: 120px 0 0        /* Large section top padding */
padding: 120px 0 50px     /* Testimonials section */
padding: 80px 60px 90px   /* CTA Meta Partner section */
padding: 70px 10px 0      /* Heading wrapper */
padding: 59px 10px 30px   /* Content wrapper */
padding: 40px             /* Card inner padding */
padding: 20px             /* Component inner padding */
padding: 15px 30px 15px 40px  /* CTA button */
padding: 0 0 20px         /* Nav bottom gap */
```

### Gap Values
```css
gap: 100px   /* Major section gap */
gap: 88px    /* Testimonials gap */
gap: 84px    /* Two-column layout gap */
gap: 60px    /* Logo grid gap */
gap: 51px    /* Section internal gap */
gap: 40px    /* Card content gap */
gap: 30px    /* Text block gap */
gap: 28px    /* Close stacking */
gap: 27px    /* CTA area gap */
gap: 24px    /* Sub-section gap */
gap: 22px    /* Footer gap */
gap: 20px    /* Component gap */
gap: 13px    /* Tight label gap */
gap: 10px    /* Micro gap */
gap: 6px     /* Tiny gap (label+value) */
```

### Border Radius
```css
border-radius: 422px   /* Conic gradient circles (full pill) */
border-radius: 200px   /* CTA button (full pill) */
border-radius: 23px    /* Meta Partner card */
border-radius: 8px     /* Nav items, chips */
```

---

## Shadow System

### Standard Card Shadow (multi-layer natural shadow)
```css
box-shadow:
  0 0.706592px 0.706592px -0.625px #00000026,
  0 1.80656px 1.80656px -1.25px #00000024,
  0 3.62176px 3.62176px -1.875px #00000024,
  0 6.8656px 6.8656px -2.5px #00000021,
  0 13.6468px 13.6468px -3.125px #0000001a,
  0 30px 30px -3.75px #0000000d;
```
This is a CSS shadow ladder — 6 layers of progressively larger, more transparent shadows. Creates the illusion of physical depth with natural penumbra falloff. Premium technique borrowed from real-world light behavior.

---

## Gradient System

### Hero Background Radial
```css
/* Desktop */
background: radial-gradient(50% 50% at 50% 100%, #102240 0%, #000 100%);
/* Tablet/Mobile */
background: radial-gradient(50% 88% at 48.2% 100%, #102240 0%, #000 100%);
```
Dark navy glow emanating from bottom center — creates depth without harsh lines.

### CTA Button (Conic Gradient)
```css
background: conic-gradient(from 0deg at 53.6% -18.1%, #4090f7 108deg, #1065e3 169.2deg, #233447 262.8deg);
border-radius: 200px;
```
Pill-shaped button with multi-stop conic gradient — appears as a blue sphere surface.

### Spinning Circles (Conic — animation background element)
```css
/* Outer ring */
.framer-8mo5vd {
  background: conic-gradient(#121212 53.5135deg, #079ed6 360deg);
  border-radius: 422px;
  width: 833px; height: 833px;
  filter: blur(3px);
}

/* Inner ring */
.framer-70kzve {
  background: conic-gradient(#079ed6 61.6216deg, #121212 264.324deg);
  border-radius: 422px;
  width: 746px; height: 746px;
  filter: blur(3px);
}

/* Masking circles (dark BG color) */
.framer-z4fkoi { background-color: #070c14; width: 832px; height: 832px; border-radius: 422px; }
.framer-11vbkww { background-color: #070c14; width: 744px; height: 744px; border-radius: 422px; }
```
Two conic-gradient arcs stacked inside masked circles create a glowing arc effect. The Framer animation spins these.

### Section Transition Gradients
```css
/* Fade from content to BG */
background: linear-gradient(#000 0%, #070c14 100%);
background: linear-gradient(#000 40%, #070c14 100%);
background: linear-gradient(#000 0%, #070c14 90%);

/* Top section bottom fade */
background: linear-gradient(#000 0%, #0000001a 83%, #0000 100%);

/* Fade-out on logo carousel edges */
background: linear-gradient(#457fd100 20.2703%, #070c14 100%);

/* White separator line (shimmering) */
background: linear-gradient(90deg, #ffffff05 0%, #ffffff1a 50%, #ffffff05 100%);

/* Card shimmer line */
background: linear-gradient(90deg, #fff0 0%, #ffffff26 50%, #fff0 100%);
```

### Meta Partner Card Background
```css
background: linear-gradient(130deg, rgb(248, 249, 254) 20%, rgb(200, 211, 227) 100%);
border-radius: 23px;
```
This is a LIGHT card on a dark page — deliberate contrast to create visual focus. Inside it has `filter: blur(100px)` colored blobs for a frosted glass premium effect.

---

## Layout System

### Grid Structure
- **Full page**: 1440px max-width, centered
- **Content blocks**: 1200px max-width  
- **Fluid sections**: `width: 100%` with responsive padding

### Key Section Heights
```css
.hero: height: 87.75vh (desktop) / 95.7092vh (mobile)
.case-study-section: height: 119.788vh (scrolling reveal)
.testimonials-area: height: 638px (wrapping flex grid)
.cta-circle-section: height: 483px
.stats-counter: height: 549px
```

### Responsive Breakpoints
```css
@media (min-width: 1440px)      { .hidden-f9xb2b }  /* ≥ 1440 XL */
@media (min-width: 1200px) and (max-width: 1439.98px) { .hidden-13rarv8 }  /* 1200-1439 LG */
@media (max-width: 1199.98px)   { .hidden-1eymb8o }  /* ≤ 1199 SM */
```

---

## Motion Tokens (CSS-level)

### Will-Change Strategy
```css
will-change: var(--framer-will-change-override, transform);
/* Safari override: will-change: transform (via @supports) */
/* Default: will-change: none (never speculative) */
```

### Framer Appear Animation
```css
/* Initial state for entrance animations */
opacity: 0;
transform: translateY(30px);
/* Triggered by Intersection Observer via Framer's appear system */
data-framer-appear-animation="no-preference"
```

### Blur Animation Elements
```css
filter: blur(3px);
-webkit-filter: blur(3px);
/* Applied to conic gradient circles to create soft glow arc */
```

### Blur Blobs (Meta Partner Card)
```css
filter: blur(100px);
-webkit-filter: blur(100px);
/* Colored PNG blobs blurred extreme to create background color wash */
```
