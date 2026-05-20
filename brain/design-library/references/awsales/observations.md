# AwSales — Critical Analysis & Observations
## Extracted: 2026-04-26
## Source: https://www.awsales.io/
## Stack: Framer + React + Framer Motion

---

## Why This Site Feels Premium

AwSales achieves a high-conversion B2B dark-mode aesthetic through five compounding decisions that individually are common, but together produce a distinctive premium feel:

**1. The deep near-black base.** Not pure `#000000` — `#070c14` (7, 12, 20 in RGB). The faint blue undertone in the black prevents the harshness of true black and creates a sense of depth that reads as expensive rather than harsh. The secondary dark `#121212` for card backgrounds creates natural elevation without needing strong shadows.

**2. Radial gradient hero bottom glow.** The hero uses `radial-gradient(50% 50% at 50% 100%, #102240 0%, #000 100%)` — a dark navy glow radiating upward from the bottom center. This is a subtle atmospheric trick: it implies a light source below the content, making the hero feel like a stage rather than a flat canvas.

**3. Conic-gradient spinning arcs.** The signature visual is two large circles (833px and 746px) with conic-gradient fills in `#079ed6` (cyan) and `#121212` (near-black), blurred 3px, counter-rotating behind each other. Dark masking circles cut the inner areas, leaving only thin glowing arcs. This creates a high-tech holographic ring that signals AI/tech at a glance without any 3D library. Pure CSS + rotation animation.

**4. The Meta Partner card contrast inversion.** In a page of dark backgrounds, the Meta Business Partner card uses a white/light-blue gradient background (`linear-gradient(130deg, rgb(248, 249, 254) 20%, rgb(200, 211, 227) 100%)`). This deliberate light-on-dark interruption creates maximum visual salience — the eye goes there first. Inside the card, colored blobs are blurred 100px to create a soft color wash that feels premium without visible structure.

**5. Six-layer shadow system.** Cards use a progressive shadow ladder (6 box-shadow layers, each larger and more transparent) that mimics real-world penumbra falloff. The result reads as physically plausible depth rather than the flat single-shadow common in cheaper implementations.

---

## Detected Stack Checklist

- [x] Framer (site builder + SSR)
- [x] React (UI runtime)
- [x] Framer Motion (animation runtime)
- [ ] GSAP
- [ ] Three.js
- [ ] Lenis
- [ ] Spline
- [ ] Custom WebGL

---

## Signature Techniques Ranked

### 1. Conic-gradient spinning arc (HIGHEST VALUE)
Two counter-rotating conic-gradient circles behind dark masking discs. Creates a glowing arc halo. Completely CSS — no canvas, no WebGL. Highly replicable.

### 2. Radial-gradient hero depth glow
`radial-gradient(50% 50% at 50% 100%, #102240 0%, #000 100%)` bottom-center. Creates stage lighting feel. One line of CSS.

### 3. Conic-gradient CTA button
`conic-gradient(from 0deg at 53.6% -18.1%, #4090f7 108deg, #1065e3 169.2deg, #233447 262.8deg)` on a pill-shaped button. Creates 3D sphere surface illusion.

### 4. Light card on dark page (Meta Partner)
Deliberate background inversion for credential display. `linear-gradient(130deg, #f8f9fe 20%, #c8d3e3 100%)` with `border-radius: 23px` and blur blob background. High-contrast focus point.

### 5. Six-layer shadow ladder
```css
box-shadow:
  0 0.706px 0.706px -0.625px #00000026,
  0 1.806px 1.806px -1.25px  #00000024,
  0 3.621px 3.621px -1.875px #00000024,
  0 6.865px 6.865px -2.5px   #00000021,
  0 13.646px 13.646px -3.125px #0000001a,
  0 30px 30px -3.75px         #0000000d;
```

### 6. Shimmer separator lines
1px horizontal lines with `linear-gradient(90deg, #ffffff05 0%, #ffffff1a 50%, #ffffff05 100%)`. Invisible at edges, visible at center. Elegant section dividers.

### 7. Fade-out carousel edges
Logo carousel uses `linear-gradient(#457fd100 20%, #070c14 100%)` overlays at both edges to fade logos into the page background — seamless infinite scroll illusion.

### 8. Blur-blob card background
Colored PNG images (abstract shapes) with `filter: blur(100px)` inside the Meta Partner card. Far more performant than layered CSS gradients for complex color washes. GPU-composited.

### 9. Viewport-height sections
Key sections use `vh` units: `87.75vh` hero, `119.788vh` case study (taller than viewport for scroll effect), `119.788vh`. Creates cinematic proportions that change with screen size.

### 10. Font pairing: Poppins (headlines) + Manrope (body)
Poppins weight 700 for headlines — high contrast, rounded geometric feel. Manrope for body — humanist, warm, readable at small sizes. Together: technical confidence + human approachability.

---

## Non-Code Ideas Worth Stealing

**Editorial hierarchy of proof.** The page sequences: claim → client logos → case study with hard numbers → process explanation → more testimonials → credential badge → CTA. Each section earns permission for the next claim. This is a copywriting decision as much as a design decision.

**ROI as headline metric.** "9.95x ROI — 3º maior canal de receita" is more specific than any design element. The specificity (`9.95x` not `10x`, `3rd biggest channel` not `great results`) does more trust work than any animation.

**The "14 days" promise.** Every CTA section reinforces "Em até 14 dias". The design serves this message: the `119.788vh` case study section is tall enough to feel substantial but not exhausting, mirroring the "quick but real" positioning.

**Single CTA throughout.** Every "Começar Agora" button links to the same destination. No menu, no multiple offers. The design enforces focus.

**Avatar photos in testimonials.** Real headshots (not initials or avatars) in 384×384px. Combined with name, title, and company, these function as social proof credentials, not just quotes.

---

## Patterns to Distill

1. `patterns/motion/conic-arc-spinner.md` — CSS conic-gradient counter-rotating rings with masking discs. Pure CSS, no JS library.
2. `patterns/backgrounds/hero-radial-depth-glow.md` — radial-gradient from bottom center creating stage-light depth.
3. `patterns/buttons/conic-gradient-pill-cta.md` — pill CTA with conic-gradient creating sphere-surface illusion.
4. `patterns/cards/light-card-on-dark-page.md` — inverted-bg credential/badge card with blur-blob background and 23px radius.
5. `patterns/shadows/six-layer-progressive-shadow.md` — penumbra-falloff shadow ladder (6 layers, increasing spread + decreasing opacity).
6. `patterns/separators/shimmer-1px-line.md` — 1px gradient separator fading at edges, full opacity at center.
7. `patterns/carousels/fade-edge-logo-marquee.md` — infinite logo marquee with gradient-fade edge masking.
8. `patterns/backgrounds/blur-blob-card-fill.md` — colored PNG blobs blurred 100px as GPU-efficient card background wash.

---

## Extraction Limitations

- **Framer runtime animations not captured**: The spinning conic arcs, number counter animations, and rotating hero text are driven by Framer Motion at runtime. The static HTML shows initial state only (`opacity: 0; transform: translateY(30px)`). Exact easing curves, durations, and stagger values require viewing the Framer editor (not publicly accessible) or JavaScript deobfuscation.
- **Hero rotating text component**: Component dimensions `1440px × 306px` identified as a Framer interactive component, but exact text rotation/morph mechanism not captured in static HTML.
- **Logo carousel speed**: Marquee animation speed/direction inferred but not confirmed — JS bundle too small (10KB) to contain animation configs.
- **Hover states**: Button hover effects, card hover states, and nav hover transitions are Framer variant transitions — not visible in static CSS.
- **Mobile layout**: Partial — Framer generates separate variant styles for mobile (`hidden-1eymb8o` breakpoint ≤1199px). Mobile-specific component variants were observed in HTML but not exhaustively documented.
