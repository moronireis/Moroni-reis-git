# Luxury DNA Report: Fashion Houses

> Last updated: May 2026
> Produced by: luxury-brand-analyst (Protocolo Luxo)
> Brands analyzed: Chanel, Dior, Louis Vuitton, Bottega Veneta, Brunello Cucinelli (fashion); Aesop, Diptyque (beauty/fragrance); Cartier, Tiffany & Co. (jewelry)
> Purpose: Decode the visual grammar of luxury fashion houses for application in REIS [IA] projects

---

## 1. Vertical Overview

Fashion house digital presences share a common grammar that separates them from every other category of web design: **the interface exists to disappear.** The website is not the product, not the brand, and not the experience. It is the vitrine — the glass display case through which the product is seen. Every design decision serves this single imperative: make the frame invisible so the object inside commands total attention.

What unites the five fashion houses analyzed is a set of shared convictions expressed through design:

1. **Photography carries 100% of chromatic intensity.** The UI is monochrome or near-monochrome. Color enters exclusively through campaign imagery and product shots.
2. **Typography is identity.** Every house commissions or adopts a proprietary typeface that IS the brand on screen. The font does the work that a logo cannot do at body-text scale.
3. **Corners are sharp.** Border-radius 0px is the default — not by omission, but by conviction. The rectangle is the geometry of precision, architecture, and editorial print.
4. **Shadows are absent.** Depth comes from surface-color contrast (white vs. off-white) and photography, not from box-shadow elevation. The page is a printed surface, not a layered interface.
5. **Motion is slow.** Minimum 0.2s for micro-interactions, 0.4-1.2s for reveals. No bounce, no spring, no elastic curves. Slowness signals that the brand controls time.

What separates leaders from followers within this vertical:

- **Leaders** (Bottega Veneta, Chanel, Brunello Cucinelli) achieve identity through subtraction. They remove color, remove weight, remove decoration until only the essential remains. Their confidence is expressed through what is absent.
- **Mid-tier luxury digital** (many brands not analyzed here) confuses "luxury" with "expensive-looking" — they add gold gradients, heavy shadows, ornate borders, and competing typefaces. These additions are anti-luxury signals.
- **The editorial vanguard** (Louis Vuitton, Dior) pushes toward magazine-like density and cinematic motion, creating a richer content experience without sacrificing the core grammar.

---

## 2. Brand-by-Brand Analysis

### 2.1 Chanel — The Discipline of Absence

**Visual Identity Code**: Pure achromatic system. The palette runs from `#000000` through a finely calibrated 7-step gray scale (`#1d1d1d`, `#333333`, `#454545`, `#767676`, `#949494`, `#b6b6b6`) to `#ffffff`. There is zero chromatic accent anywhere in the UI — not even a muted navy or warm taupe. The only non-gray in the entire system is error red `#cd0000`, and even that is a deep, restrained crimson. Photography is the sole source of color on the page.

**Typography System**: Two proprietary sans-serif families create a display/body split:
- **abchanel-2022** for display headlines — weight 200 (extra-light), sizes 2.75-3.625rem. This ethereal thinness is the brand's typographic fingerprint.
- **abchanel-corpo** for all body and UI text — weight 300 (light) as the universal default, weight 600 reserved exclusively for buttons and interactive labels.
- **AWConqueror Pro Didot** (modern Didot serif) appears only in fashion editorial contexts, bridging print heritage.

The weight 200 headline / weight 300 body / weight 600 CTA hierarchy is the most precisely stratified type-weight system in the dataset.

**Color Discipline**: The most extreme in the dataset. No brand color. No accent color. Not even the heritage camellia or interlocking C's introduce hue. Button text is `#f9f9f9` (not pure white) — a micro-distinction that introduces imperceptible warmth.

**Motion Grammar**: Content reveals at `0.54s cubic-bezier(0.25, 0.1, 0.25, 1)`. Text-decoration underline transitions at `0.2s ease` serve as the primary hover signal. Modal backdrop uses `rgba(29, 29, 29, 0.6)` — matching `--color-primary-variant` rather than pure black. This is a system that measures easing curves to the hundredth.

**Photography/Video Direction**: Photography-first hierarchy. The UI withdraws completely. Full-viewport images use aspect-ratio-controlled CSS custom properties (`--aspect-ratio-desktop`, `--aspect-ratio-mobile`) with responsive srcset from Chanel's CDN.

**Layout Philosophy**: Percentage-based grid margins (~8% on desktop) with no max-width constraint until 1601px+. The grid uses 12 columns on desktop, 6 on mobile. Section padding values of 45px, 54px, and 108px create immense breathing room. The spacing system is non-standard — base-9 or base-18 with values like 27px and 45px.

**Navigation Pattern**: Three states — default (white, opaque), immersive (transparent overlay on hero imagery, appearing on hover), and high-contrast (inverted black). The header uses `--cc-header-position: fixed` and `--cc-header-opacity: 0` for immersive mode.

**Product Presentation**: Borderless, shadowless cards on `#f9f9f9`. Product photography fills the card edge-to-edge. Text metadata sits below with 27px vertical rhythm. The card IS the photograph.

**The Signature Move**: Zero border-radius on absolutely everything — buttons, cards, inputs, badges. In a web ecosystem drowning in 8px radius and pill shapes, Chanel's 0px posture is a statement as powerful as any color. Combined with the total absence of box-shadow (explicitly reset with `!important`), this creates the flattest, sharpest interface in luxury digital.

---

### 2.2 Dior — The Editorial Cathedral

**Visual Identity Code**: French haute couture elegance expressed as editorial architecture. Monochrome foundation (`#000000`, `#FFFFFF`, `#757575`, `#E8E8E8`) with a warm secondary register (`#F5F5F0` warm gray, `#FAF8F5` warm background). Heritage gold `#C4A35A` exists but is used with extreme restraint — couture/heritage contexts only, never as a primary UI accent. Dark navy `#1A1A2E` provides editorial depth.

**Typography System**: Three-tier family structure:
- **Dior** (custom serif) — display headings, brand wordmark. Hero at 72px weight 300 with 0.3em letter-spacing. This ultra-wide tracking on display type is Dior's typographic signature.
- **DiorPrimary** (serif) — body text, editorial content.
- **Helvetica Neue** (sans-serif) — UI elements, navigation, form labels. Nav at 12px weight 500 with 0.15em tracking, uppercase.

The letter-spacing gradient is the key: 0.3em at hero scale, narrowing to 0.1em at display, 0.05em at H2, arriving at 0em for body. This creates a perceptual funnel from architectural to intimate.

**Color Discipline**: Monochrome with surgical gold. The gold `#C4A35A` never touches a button, never fills a background — it appears only in heritage/couture visual contexts. Hover states transition black-to-gray, never introducing color.

**Motion Grammar**: The most deliberately unhurried of the fashion houses. Minimum duration 0.3s for any visible transition. Fade-in at 0.8s with `cubic-bezier(0.16, 1, 0.3, 1)`. Page transitions at 1.0s. Image scale hover at 0.6s. No bouncing, no elastic easing. Scroll-triggered reveals use intersection observer at 20% threshold.

**Photography/Video Direction**: Full-bleed editorial imagery dominates every viewport. 100vh hero sections. Parallax scroll on campaign imagery. Lazy loading with elegant fade-in (opacity 0 to 1, 0.8s). Aspect ratios: 16:9 (hero), 3:4 (product), 1:1 (square grid).

**Layout Philosophy**: Max width 1440px, content width 1200px, narrow editorial column at 800px. Section spacing reaches 160px — the most generous in the dataset. Product grids: 2/3/4 columns responsive. Full-bleed photography breaks the grid to fill viewport width.

**Navigation Pattern**: Fixed top bar, minimal height (~60px). Logo centered, navigation items flanking. All-caps, letter-spaced sans-serif. Mega-menu drops with editorial layout containing campaign imagery.

**Product Presentation**: No border, no shadow, no radius. Image dominant (3:4 for fashion, 1:1 for accessories). Minimal hover: image scale 1.02, transition 0.6s — the subtlest product-card interaction in the dataset.

**The Signature Move**: The letter-spacing system. Dior uses tracking as a hierarchy instrument more aggressively than any other brand — from 0.3em at hero to 0em at body. This creates a feeling that headlines exist in architectural space while body text is intimate and readable. Combined with 160px section spacing, the result is a digital cathedral.

---

### 2.3 Louis Vuitton — Scale as Editorial Weapon

**Visual Identity Code**: The most editorially ambitious fashion house digital presence. High-contrast black-and-white with heritage brown/tan as contextual accent. Warmer than Chanel (`#F9F6F1` off-white, `#F2EDE7` light beige, `#C19A6B` tan, `#6B4226` brown), reflecting the leather-goods heritage. Campaign pages introduce seasonal accent colors — always editorial, never UI chrome.

**Typography System**: Two families with extreme scale contrast:
- **LouisVuitton** (custom serif) — display headings at 80px hero size, weight 300, with negative letter-spacing (-0.03em). This is the largest hero type in the dataset.
- **LV Body** (sans-serif, Neue Helvetica base) — body text, navigation, UI. Nav at 11px weight 500 with 0.15em tracking, uppercase. The smallest nav text in the dataset.

The gap between hero (80px) and nav (11px) is a 7.3:1 ratio — the most dramatic scale contrast among all analyzed brands. This is a print-editorial technique: broadsheet headline vs. column label.

**Color Discipline**: High-contrast monochrome for most contexts. Brown/tan heritage colors appear only in leather goods and monogram-related content. Monogram brown `#8B6914` is product-contextual, not UI. Editorial dark sections use `#1A1A1A`.

**Motion Grammar**: The most cinematic motion language. Default transition at 0.4s (longer than most brands' default). Hero reveals at 1.2s with `cubic-bezier(0.16, 1, 0.3, 1)`. Video crossfade between campaigns at 1.5s. Continuous parallax on backgrounds. Staggered scroll-reveals at 100ms intervals. Full-screen page fade at 1.0s.

**Photography/Video Direction**: Video-first heroes — looping muted autoplay video is the default, static images are the fallback. This inverts the convention of most luxury sites. Text overlay on video with text-shadow. Ken Burns effect on fallback statics. Campaign video crossfades create a cinematic narrative flow.

**Layout Philosophy**: Max width 1600px — the widest in the dataset, accommodating modern ultra-wide displays. Content width 1280px. 12-column grid with 24px gutters. Asymmetric, broken-grid layouts for campaign content. Section spacing at 140px.

**Navigation Pattern**: Fixed black header bar with white text. Dense category system with multiple tiers reflecting LV's product breadth (fashion, leather goods, fragrance, watches, jewelry). Very small (11px), heavily tracked, all-uppercase nav. Mega-menu with editorial imagery and category trees.

**Product Presentation**: Minimal styling. White background product images (1:1 or 3:4). Small, clean sans-serif for names. No hover animations on product images — a notable absence that keeps product grids feeling like a catalog.

**The Signature Move**: The scale contrast system — 80px serif headlines against 11px tracked sans-serif navigation — creates an editorial tension that no other brand matches. Combined with video-first heroes and the widest max-width in the dataset, LV's digital presence reads like a moving editorial spread rather than a commerce site.

---

### 2.4 Bottega Veneta — The Reference Standard for Luxury Minimalism

**Visual Identity Code**: The most radically restrained digital presence in luxury. Pure black `#000000` serves as both brand identity AND the sole UI action color — there is no separate accent. The gray scale runs `#000000`, `#272727`, `#474747`, `#767676`, `#bfbfbf`, `#d8d8d8`, `#f1f3f2`, `#ffffff`. Zero chromatic accent in the interface. The only saturated colors are functional necessities: availability green `#009539` and error red `#eb0000`.

**Typography System**: Single proprietary serif typeface at two weights:
- **bottegaveneta-regular-webfont** (serif) — weight 400 for ALL text including headlines. Display hero at 57px. The brand voice is carried by one face at one weight.
- **bottegaveneta-bold-webfont** — weight 700 exclusively for buttons and navigation. Never for headings, never for body text.

Zero letter-spacing everywhere. No tracking manipulation at any size. The typeface is designed to set naturally without adjustment. `font-display: optional` — luxury confidence means the page loads clean even without the custom font.

**Color Discipline**: The most extreme after Chanel. The entire color philosophy: the product is the only thing that should carry color. The interface is a white gallery wall with black typographic labels. Even hover states remain `#000000` — no color change on interaction for most elements. BV links are never blue, never underlined by default.

**Motion Grammar**: Clinical and precise. `transition: all 0.2s linear` for micro-interactions — BV uses linear easing where most brands use ease-out. Navigation state changes at 1s opacity transition (deliberately slow). No GSAP, no Framer, no Lottie. Pure CSS animations. The carousel auto-advance is the most animated element on the site. No decorative motion whatsoever.

**Photography/Video Direction**: Product images fill their containers edge-to-edge — no padding, no margins, no rounded corners, no decorative framing. Full-viewport hero imagery. Product grid tiles are edge-to-edge with zero gap, creating a photographic mosaic. The intrecciato weave pattern appears exclusively in product photography, never as a UI texture.

**Layout Philosophy**: Full-bleed approach with no explicit max-width cap on product grids. Product listing grids use 2-column (mobile) to 3-4 (desktop) with zero gap between tiles. Category navigation uses slide-from-right panel. Section padding regularly exceeds 80px vertically. 3 breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px).

**Navigation Pattern**: Solid white `#ffffff`, no transparency, no backdrop-filter, no shadow. 12px bold uppercase nav items. 1px solid `#d8d8d8` bottom border. Opacity 1s transition for menu state changes. The header is minimal enough that you forget it exists until you need it.

**Product Presentation**: Zero border-radius, zero shadow, zero visible border. Product image fills 100% width with no padding. Product name at 14px weight 400 color `#272727`. Price at `#767676`. No hover effect on the card container — only text links get a subtle underline.

**The Signature Move**: The total absence of brand signifiers in the UI. No logo on products, no monogram pattern, no signature color. The custom serif typeface carries 100% of brand identity digitally. This is "stealth luxury" — the house that deleted all social media accounts in January 2021 because it did not need to participate in the attention economy.

---

### 2.5 Brunello Cucinelli — The Philosophy of Lightness

**Visual Identity Code**: Warm near-black `#262626` replaces pure `#000000` everywhere — a foundational decision that introduces the warmth of aged paper and natural fiber. The sole chromatic accent is cashmere taupe `#8d8277`, drawn from the Umbrian landscape surrounding Solomeo. Surfaces use parchment tones (`#f1f0ef` warm white, `#f2f2f2` parchment). No blues, no gradients, no saturated accents.

**Typography System**: The most sophisticated three-font system in the dataset:
- **IvyPresto Display** (serif) — headlines at weight 300. Sizes from 7rem (hero) to 4rem (section heading). This "silk thread" effect — hairline serifs almost transparent at display sizes — gives headlines a philosophical, contemplative quality.
- **GT Eesti Pro Display** (sans-serif) — UI workhorse. Weights 300/400/600. Navigation, buttons, forms, body text.
- **TT Livret Text** (text serif) — editorial body copy at weight 300. Designed for sustained reading.

Three registers mapped to three functions: contemplation (IvyPresto), function (GTEesti), narration (TTLivretText). Universal `font-feature-settings: "lnum"` ensures lining numerals throughout. The root font-size is set to 62.5% making `1rem = 10px`.

**Color Discipline**: The warmest palette in the fashion house dataset. `#262626` instead of `#000000` is a brand conviction, not a compromise. Secondary text at `#7a7a7b`. Cashmere taupe `#8d8277` appears only as carousel active indicator. The color system rejects digital convention entirely — no electric accents, no hover-state color shifts. Disabled states use `opacity: .3` rather than graying out.

**Motion Grammar**: Centered on two timing signatures:
- **0.22s ease-in-out** — the universal UI transition. Appears on headers, menus, buttons, opacity changes. This creates a quiet, unhurried rhythm.
- **0.6s cubic-bezier(.4,0,.4,1)** — the animated underline. A sweeping wipe that slides out left, repositions right, and slides back.
- **1.2s ease-in-out** — the image mask reveal. White curtain pseudo-elements (`::before`, `::after`) part horizontally to unveil photography. This single animation motif replaces what most brands accomplish with an entire motion library.

**Photography/Video Direction**: Full-bleed photography of Italian countryside, cashmere textures, and classical architecture. The image mask system imposes architectural margins of white that frame each photograph — at desktop, masks can occupy up to 42.2rem (422px) per side, meaning the actual visible image may be less than half the viewport width. Cloudinary `f_auto,q_auto` for optimization. Separate mobile and desktop video elements.

**Layout Philosophy**: Bootstrap-derived 12-column grid. 5 breakpoints including 2100px for ultra-wide. The image mask system is the most distinctive layout behavior — rather than letting images fill containers, masks impose deliberate whitespace framing at 11.2rem to 42.2rem per side on desktop, collapsing to 1.6rem on mobile. Input padding of 1.5rem 2rem (24px 32px) reflects luxury touch targets.

**Navigation Pattern**: Height 7.3rem (mobile) / 9.4rem (desktop). Transparent variant uses `linear-gradient(180deg, rgba(0,0,0,.6) 0, rgba(38,38,38,0) 100%)` — dark gradient fading to transparent over hero imagery. Menu overlay slides from top (mobile) or left (desktop) with `.22s ease-in-out`. No bottom border on the header — one of the few brands to achieve this.

**Product Presentation**: Minimal — invisible containers with no decoration. Photography carries all visual weight. The animated underline CTA ("EXPLORE", "DISCOVER MORE") replaces traditional button styles entirely.

**The Signature Move**: Weight 300 as the universal brand voice. Headlines, buttons, inputs, table headings, form labels — everything defaults to light. This feather-light typography, combined with the warm near-black `#262626` and the image mask curtain reveals at 1.2s, creates a digital experience that reads like a beautifully bound philosophical treatise rather than a commerce site.

---

## 3. Cross-Vertical Comparison (Beauty/Fragrance + Jewelry)

### Beauty/Fragrance: Aesop and Diptyque

Beauty/fragrance brands share the fashion house grammar but diverge in two critical ways:

**Temperature shift.** Fashion houses operate on cool-to-neutral palettes (Chanel's pure white, Dior's cool gray, BV's clinical white). Beauty brands introduce perceptible warmth:
- Aesop: parchment `#F6F5E8`, warm white `#FAF9F4`, cream `#FFFEF2` — an earth-tone world of dried herbs, amber glass, and stone.
- Diptyque: cream `#F5F0E8`, ivory `#FAF7F2` — a Parisian apartment in palette form.

Fashion houses treat the background as a gallery wall (neutral, invisible). Beauty brands treat the background as a material — Aesop's parchment IS the brand as much as its typography.

**Product-as-art-object presentation.** Fashion houses show garments on models in editorial contexts. Beauty brands present products as sculptural objects:
- Aesop photographs bottles at 2-3x actual size on warm neutral grounds, making the amber glass and label typography legible and sculptural.
- Diptyque creates a signature warm glow around candles on dark backgrounds using `radial-gradient(ellipse, rgba(196,149,106,0.15) 0%, transparent 70%)`.

**Typographic discipline.** Aesop proves that a single sans-serif (Suisse Intl) can carry an entire luxury system if mastered. Display at weight 300 with -0.02em tracking, body at 400, labels at 500 with 0.06-0.08em tracking uppercase. One family, three registers. Diptyque takes the opposite approach — a custom calligraphic serif (Diptyque Saint-Germain) for brand identity, with sans-serif reserved for functional UI. Both succeed because the typographic choice is total and consistent.

**Shared patterns with fashion houses:**
- Zero border-radius on all interactive elements (both brands)
- Photography dominance with UI recession
- Slow motion (Aesop: 400-600ms; Diptyque: 300-600ms)
- Monochrome UI with color entering only through product
- No box-shadow, no elevation

**Key differentiator:** Beauty brands embrace editorial content as a first-class pillar. Aesop's "The Fabulist" literary magazine and Diptyque's calligram tradition treat brand storytelling as investment, not marketing. Fashion houses tell stories through imagery; beauty brands tell them through text and illustration.

### Jewelry: Cartier and Tiffany

Jewelry brands share the fashion grammar but introduce two distinctive mutations:

**Color as identity.** Where fashion houses are overwhelmingly monochrome, jewelry brands commit to a signature hue:
- Cartier: red `#A5182A` as the primary CTA accent — the only fashion-adjacent brand that uses a saturated color on interactive elements.
- Tiffany: robin's-egg blue `#81d8d0` as hover-state fills, header background, and focus indicators. Blue appears in perhaps 5% of pixel area, but that scarcity makes each appearance an event.

This color commitment creates instant brand recognition that monochrome fashion houses achieve through typography alone.

**Warm backgrounds.** Both jewelry brands default to warm-white rather than pure white:
- Cartier: `#FAF7F2` warm white as the primary background. Pure white `#FFFFFF` is used sparingly.
- Tiffany: `#f5f5f5` warm gray for alternate sections, though the press surface defaults to pure white.

The warmth mirrors the physical retail experience — entering a Cartier boutique feels warm and intimate, not gallery-cold.

**Vitrine presentation.** Jewelry demands a different product photography approach than fashion:
- Cartier: centered on white background with high-key lighting, as if displayed in a glass case. 1:1 aspect ratio for jewelry, 4:5 for watches.
- Tiffany: products shot on controlled backgrounds with visible detail and sparkle. Zoom functionality on hover.

**Typographic signature:**
- Cartier: custom serif at weight 300 with wide tracking (0.2em at hero, 0.08em at display). The serif IS the brand.
- Tiffany: Sterling Display Roman (serif, weight 400 only) for headlines + Santral (sans, binary 300/600 weight system) for UI. The binary weight system — text is either quiet or emphatic, never neutral — is a distinctive strategy.

**Motion tempo:** Both jewelry brands use slow transitions but Tiffany's 500ms hover fills are the slowest in the dataset. `transition: background 0.5s, color 0.5s` on every button. The underline animation (3px height, width 0 to 100%, 500ms) creates a ritual-like interaction. Cartier is slightly faster at 0.35s default.

**Key differentiator from fashion:** Jewelry brands are warmer, color-identified, and product-vitrine-focused. Fashion houses are colder, monochrome, and editorial-narrative-focused. The jewelry approach is more applicable to client projects where warmth and approachability matter alongside luxury signaling.

---

## 4. Universal Luxury Patterns

These patterns appear in 80%+ of the nine brands analyzed. They constitute the shared visual grammar of luxury digital design.

### Pattern 1: Zero Border-Radius (9/9 brands, 100%)
Every brand defaults to `border-radius: 0px` on buttons, cards, and inputs. Chanel, Bottega Veneta, Dior, Louis Vuitton, Brunello Cucinelli, Aesop, Diptyque, Cartier, and Tiffany all enforce sharp rectangles. The only exceptions are circular elements (radio buttons, carousel dots) and rare usability-driven deviations (Brunello Cucinelli's select dropdown at 0.4rem). This is the single most consistent signal in the dataset.

**Evidence**: Chanel explicitly resets with `border-radius: 0px` and avoids the 8-16px range. Bottega Veneta declares 0px across 6+ border-radius selectors. Tiffany's Do's/Don'ts explicitly state "no rounded corners, no pill buttons."

### Pattern 2: Photography/Video Dominance (9/9, 100%)
In every brand, the interface exists to frame imagery, never to compete with it. Product photography is full-bleed, oversized, or presented on neutral grounds. UI elements recede — thin borders, small text, transparent navigation overlays.

**Evidence**: Chanel's card system declares `shadow: none` and `border: transparent` — the card IS the photograph. Bottega Veneta uses zero-gap product grids creating photographic mosaics. Louis Vuitton defaults to video-first heroes. Aesop photographs products at 2-3x actual size as art objects.

### Pattern 3: Flat Surface Model (9/9, 100%)
No brand uses box-shadow as a design element. Depth comes from surface-color contrast (white vs. off-white) and photography. Several brands explicitly declare `box-shadow: none` on buttons and cards.

**Evidence**: Chanel resets `box-shadow: none !important` on most selectors. Bottega Veneta has no shadow vocabulary — the entire custom CSS contains one functional inset shadow. Tiffany sets `box-shadow: none` explicitly on cards and buttons. Brunello Cucinelli has exactly one shadow in the entire CSS (select dropdown only).

### Pattern 4: Monochrome Foundation + Restrained Accent (9/9, 100%)
Every brand builds on a black-white-gray foundation. Those that introduce color use ONE accent sparingly:
- **Zero accent**: Chanel, Bottega Veneta (pure monochrome)
- **Heritage accent** (<5% surface area): Dior gold `#C4A35A`, LV brown `#6B4226`, Brunello taupe `#8d8277`
- **Signature accent** (interactive only): Cartier red `#A5182A`, Tiffany blue `#81d8d0`
- **Earth-tone system**: Aesop forest `#333D2C`, Diptyque green `#2D4A3E`

### Pattern 5: Slow Motion (9/9, 100%)
Minimum transition duration across all brands is 0.2s (Bottega Veneta's linear micro-interactions). Most brands default to 0.3-0.5s. Hero reveals range from 0.6s (Brunello Cucinelli mask) to 1.5s (LV video crossfade). No brand uses bounce, spring, or elastic easing.

**Evidence**: Dior: minimum 0.3s. Louis Vuitton: minimum 0.4s. Tiffany: all hovers at 500ms. Brunello Cucinelli: `.22s ease-in-out` universal. Aesop: 400-600ms standard range.

### Pattern 6: Generous Negative Space (9/9, 100%)
Section spacing ranges from 80px (Aesop) to 200px (Dior). The minimum section break in any brand is higher than the maximum in most non-luxury sites. Content density is deliberately low.

**Evidence**: Chanel section padding: 45-108px. Dior section spacing: up to 160px. Brunello Cucinelli: image masks consuming up to 422px per side. Bottega Veneta: section padding regularly exceeds 80px.

### Pattern 7: Serif for Display, Sans for UI (8/9, 89%)
Eight brands use a serif typeface for display headings and a sans-serif for functional UI. The sole exception is Aesop, which uses Suisse Intl (sans-serif) for everything — but compensates with weight modulation (300 for display, 400 for body, 500 for labels) to create the same hierarchical separation.

**Evidence**: Chanel (abchanel-2022 + Didot for editorial), Dior (Dior serif + Helvetica Neue), LV (LouisVuitton serif + LVBody sans), Bottega Veneta (BV serif + BV bold for nav), Brunello Cucinelli (IvyPresto serif + GTEesti sans + TTLivretText text serif), Cartier (Cartier serif + Cartier Sans), Tiffany (Sterling Display + Santral), Diptyque (Diptyque Saint-Germain serif + system sans).

### Pattern 8: Full-Bleed Imagery (9/9, 100%)
Every brand includes at least one full-viewport-width image section per page. Heroes extend edge-to-edge. This creates "breathing points" in the scroll and establishes visual rhythm. Image aspect ratios converge on 16:9 or wider for heroes, 3:4 for product portraits, 1:1 for grid items.

---

## 5. Differentiating Strategies

### Temperature Spectrum: Cold --- Warm

```
COLD                                                                    WARM
|---- Chanel ---- BV ---- Dior ---- LV ---- Brunello ---- Aesop ---- Diptyque ---- Cartier ----|
#000/#fff       #000/#fff  #000/#F7F7F7  #000/#F9F6F1  #262626/#f1f0ef  #252525/#F6F5E8  #F5F0E8    #FAF7F2
```

Chanel and Bottega Veneta operate in pure clinical black-and-white. Moving right, backgrounds gain warmth — LV introduces `#F9F6F1` off-white, Brunello Cucinelli substitutes `#262626` for pure black, Aesop builds on parchment `#F6F5E8`, and Cartier defaults to warm white `#FAF7F2`. The temperature choice directly maps to brand personality: cold = intellectual/architectural, warm = humanist/approachable.

### Density Spectrum: Sparse --- Editorial

```
SPARSE                                                                EDITORIAL
|---- BV ---- Brunello ---- Chanel ---- Aesop ---- Tiffany ---- Cartier ---- Dior ---- LV ----|
```

Bottega Veneta and Brunello Cucinelli show the fewest elements per viewport — maximum whitespace, minimum text. Louis Vuitton and Dior pack more content into each scroll position, using magazine-like layouts with campaign imagery, editorial text, and dense navigation. The density choice correlates with product breadth: houses with wider catalogs (LV) need higher density; houses with curated ranges (BV) can afford extreme sparseness.

### Motion Spectrum: Still --- Cinematic

```
STILL                                                                  CINEMATIC
|---- BV ---- Chanel ---- Tiffany ---- Brunello ---- Aesop ---- Cartier ---- Diptyque ---- Dior ---- LV ----|
0.2s linear      0.2-0.54s    0.5s ease     0.22-1.2s     0.4-0.8s   0.35-0.7s    0.3-0.9s    0.3-1.0s    0.4-1.5s
```

Bottega Veneta uses linear easing and CSS-only transitions — the most austere motion language. Chanel is similarly restrained. Louis Vuitton occupies the cinematic extreme with 1.2s hero reveals, 1.5s video crossfades, continuous parallax, and scroll-triggered stagger reveals at 100ms intervals.

### Voice Spectrum: Whisper --- Statement

```
WHISPER                                                               STATEMENT
|---- BV ---- Brunello ---- Aesop ---- Chanel ---- Diptyque ---- Tiffany ---- Cartier ---- Dior ---- LV ----|
```

Bottega Veneta whispers — the brand name is barely visible, the product speaks, the UI is invisible. Louis Vuitton makes bold statements — oversized 80px headlines, video heroes, dense navigation, editorial narrative. Most brands cluster in the center: confident but not loud.

---

## 6. The Weight 300 Principle

Multiple brands in this dataset default to font-weight 300 (Light) for display headings, body text, or both. This convergence is not coincidental — lightness IS luxury in contemporary digital typography.

### Evidence Across Brands

| Brand | Display Weight | Body Weight | Button Weight | Lightest Used |
|-------|---------------|-------------|---------------|---------------|
| **Chanel** | 200 | 300 | 600 | 200 (extra-light) |
| **Dior** | 300 | 300-400 | 500 | 300 |
| **Louis Vuitton** | 300 | 400 | 500 | 300 |
| **Brunello Cucinelli** | 300 | 400 | 300 | 300 (buttons!) |
| **Aesop** | 300 | 400 | 400 | 300 |
| **Cartier** | 300 | 300-400 | 500 | 300 |
| **Tiffany** | 400 | 300 | 600 | 300 (body) |

Six of seven brands with documented weights use 300 for display headings. Chanel goes even lighter at 200. The outlier is Bottega Veneta at weight 400 — but BV's serif at 400 is optically lighter than most sans-serifs at 300, because the thin strokes of the BV serif read as visually delicate.

### Why Lightness Signals Luxury

1. **Confidence through restraint.** Bold type shouts. Light type whispers — and the whisper carries further because it demands the viewer lean in. A brand confident enough to set its hero heading at weight 300 is communicating: "We don't need to scream for your attention."

2. **Whitespace within letterforms.** Weight 300 creates more internal counter space — the voids within and between letters are larger. This means the typography itself generates negative space, multiplying the whitespace effect of the layout. The letters breathe.

3. **Typographic print heritage.** In luxury print — Vogue, Harper's Bazaar, Gentlewoman — display type is historically set light. Light serifs (Didone models like Bodoni, Didot) have been the signal for fashion and luxury since the 18th century. Digital weight 300 inherits this convention.

4. **Functional separation.** When body text defaults to 300 or 400, reserving higher weights (500-700) exclusively for interactive elements (buttons, navigation) creates an automatic visual hierarchy. The hierarchy is: light = reading, medium-bold = acting. The user's eye learns this grammar instantly.

5. **Anti-digital signal.** Most consumer web interfaces use weight 400-700. Light weight (300) reads as "different from the default web" — it signals intentionality and departure from convention, which itself is a luxury code.

### Brunello Cucinelli: The Extreme Case

Brunello Cucinelli sets buttons at weight 300 — the only brand in the dataset where the primary CTA is light rather than bold. Combined with the animated underline hover (no fill, no background change — just a sweeping bar), the button barely announces itself. The user must discover it. This is the digital equivalent of Cucinelli's philosophy: "We make clothes that you notice only when you look closely." The lightness is the message.

### Application Rule

When designing for luxury at REIS [IA]:
- **Display headings**: weight 300 (or 200 if the typeface supports it)
- **Body text**: weight 300-400 (never above 400 for reading text)
- **Interactive elements**: weight 500-600 (the only place bold appears)
- **Never use weight 700+ for headings.** Bold headings are an anti-luxury signal. They belong to SaaS landing pages and news sites, not to luxury digital.

---

## 7. Application Principles for REIS [IA] Luxury Projects

These are concrete, actionable rules extracted from the analysis. When building for a luxury client, the team must follow this checklist.

### Typography Rules

1. **One typeface family, two weights maximum for body/UI.** Select a serif or geometric sans that carries personality alone. BV uses one serif at two weights. Aesop uses one sans at three weights. Brunello Cucinelli is the exception with three families — but each maps to a distinct register. Never mix randomly.

2. **Display headings at weight 300.** This is the most consistent signal across all brands. If the typeface does not support weight 300, use 400 — never above.

3. **Negative letter-spacing on display type.** Aesop uses -0.02em, LV uses -0.03em at hero scale. Tightening display type creates density and modernity. But note: Bottega Veneta and Brunello Cucinelli use 0em — the typeface's native metrics matter. Only apply negative tracking to typefaces designed for it.

4. **Wide letter-spacing on labels and navigation.** 0.06-0.15em tracking on uppercase labels at 10-13px creates the "small and spaced" luxury label convention. This is universal: Chanel, Dior, LV, Aesop, Diptyque, Cartier, Tiffany all use it.

5. **Serif for display moments.** Even if the primary system is sans-serif, consider a serif for hero headlines. Seven of nine brands use a serif for display. The serif carries heritage, permanence, and editorial authority.

### Color Rules

6. **One chromatic accent maximum, used at <5% of surface area.** Cartier red. Tiffany blue. Aesop forest green. The accent is an event, not wallpaper. If the client brand has no signature color, consider pure monochrome (Chanel/BV model).

7. **Near-black rather than pure black for text.** Brunello Cucinelli `#262626`, Aesop `#252525`, Dior `#333333` for secondary text. The slight warmth makes extended reading more comfortable and signals intentionality.

8. **Warm backgrounds if the brand personality is humanist.** Aesop `#F6F5E8`, Cartier `#FAF7F2`, Brunello `#f1f0ef`. Cold white for architectural/intellectual brands. Never use warm backgrounds with blue accents — warm surfaces require warm accents.

### Layout Rules

9. **Section spacing minimum 80px vertical.** Below this, the layout reads as e-commerce, not luxury. Target range: 80-160px between major sections. Brunello Cucinelli's image masks demonstrate the extreme — up to 422px of deliberate negative space per side.

10. **Content max-width between 1200-1600px.** LV at 1600px for ultra-wide, Dior at 1440px, Cartier at 1440px. Narrow editorial columns at 720-800px for long-form text.

11. **Full-bleed imagery at least 2-3 times per page.** Edge-to-edge images create breathing points and establish rhythm. They are the digital equivalent of double-page spreads.

### Component Rules

12. **Border-radius: 0px on all interactive elements.** Non-negotiable. Rounded corners signal consumer/SaaS. The only exception: circular indicators (radio buttons, carousel dots) and select dropdowns where usability demands slight rounding.

13. **No box-shadow on any element.** Depth from surface-color steps only (`#ffffff` vs `#f9f9f9` vs `#f2f2f2`). If a floating panel absolutely requires separation, use achromatic shadow at rgba(0,0,0,0.08-0.15) maximum.

14. **Button vocabulary: 2 variants maximum.** Filled (primary) and outlined or text-underline (secondary). No ghost, pill, gradient, or icon buttons. Minimum button padding: 14px vertical, 24px horizontal. Minimum button width: 180px (Tiffany) is a strong reference.

15. **Underline-only inputs.** Bottom border inputs (Chanel, Aesop, Brunello Cucinelli) read as more refined than boxed inputs. Border color at rest: light gray (`#d8d8d8` to `#f2f2f2`). Focus: brand dark color.

### Motion Rules

16. **Minimum transition duration: 0.3s.** Below this, interactions feel utilitarian. Default should be 0.35-0.5s. Reserve 0.6-1.2s for hero reveals and page transitions.

17. **No bounce, spring, or elastic easing.** Use `ease-out`, `cubic-bezier(0.25, 0.1, 0.25, 1)`, or `cubic-bezier(0.16, 1, 0.3, 1)` (dramatic deceleration). Linear easing is acceptable for clinical brands (BV model).

18. **Scroll-triggered reveals with stagger.** Intersection observer at 10-20% threshold. Stagger timing: 50-100ms between elements. Fade + subtle translateY (8-24px, never more) is the standard entrance.

19. **Respect `prefers-reduced-motion`.** Explicitly mentioned in Dior, LV, Aesop, Diptyque documentation. All decorative motion must be disableable.

### Photography Rules

20. **Photography quality is a hard dependency.** These design systems FAIL with mediocre imagery. If client photography is not gallery-grade, do not use a luxury reference. Budget for photography before budgeting for development.

21. **Product on neutral ground.** White or warm off-white for catalog. Dark backgrounds for hero features. Never busy backgrounds, never lifestyle contexts that compete with the product.

22. **Image containers have no decoration.** No rounded corners, no padding, no drop-shadow, no border. The image fills its container edge-to-edge. The image IS the design element.

---

## 8. Recommended Further Extractions

### High Priority (would complete the fashion house vertical)

| Brand | URL | Why |
|-------|-----|-----|
| **Hermes** | hermes.com | Already extracted (in index) but not included in this DNA report. Unique warm approach with signature orange. Would anchor the "warm end" of the fashion spectrum. |
| **Loewe** | loewe.com | Art-meets-commerce under Jonathan Anderson. Unique approach to asymmetric editorial layout and hand-crafted aesthetic. |
| **Celine** | celine.com | Under Hedi Slimane — pure all-caps sans-serif aesthetic. Would represent the "rock editorial" end of the fashion spectrum. |
| **The Row** | therow.com | Ultra-quiet luxury. Uses system serif (Georgia). Would represent the absolute minimum viable luxury interface. |
| **Prada** | prada.com | Tech-forward luxury — WebGL, 3D elements. Would represent the experimental end of fashion digital. |

### Medium Priority (adjacent verticals that enrich luxury DNA)

| Brand | URL | Why |
|-------|-----|-----|
| **Aman Resorts** | aman.com | Hospitality quiet luxury. Weight 300 on body text confirmed. Architectural photography. |
| **Rolls-Royce** | rolls-roycemotorcars.com | Pinnacle automotive luxury. Cinematic motion, configurator UX. |
| **Le Labo** | lelabofragrances.com | Minimalist fragrance. Industrial/apothecary aesthetic different from Aesop. |
| **Berluti** | berluti.com | LVMH menswear luxury. Darker, more masculine palette. |
| **Van Cleef & Arpels** | vancleefarpels.com | Poetic luxury jewelry. Would contrast with Cartier's warmer approach. |

### Lower Priority (would add nuance)

| Brand | URL | Why |
|-------|-----|-----|
| **Balenciaga** | balenciaga.com | Demna's brutalist digital aesthetic. Anti-luxury-grammar as a luxury strategy. |
| **Byredo** | byredo.com | Modern fragrance. Dark mode default. Minimalist. |
| **Bang & Olufsen** | bang-olufsen.com | Premium tech that bridges luxury and technology. 3D product presentation. |
| **Patek Philippe** | patek.com | Pinnacle watchmaking. Heritage-heavy digital approach. |

---

*This report is the first in the Protocolo Luxo DNA series. It establishes the analytical framework and quality bar for all subsequent vertical reports (hospitality, automotive, fragrance, jewelry deep-dives). The data comes directly from 9 extracted DESIGN.md files totaling ~180KB of design system documentation.*
