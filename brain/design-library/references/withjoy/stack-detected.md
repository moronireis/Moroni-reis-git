# WIthJoy — Stack Detected
**Source:** https://withjoy.com
**Harvested:** 2026-05-01
**Method:** WebFetch DOM inspection across 6 pages

---

## Library Checklist

### Animation & Motion
- [x] **Bodymovin / Lottie** — CONFIRMED
  - Evidence: `class="bodymovin"` in hero section DOM
  - Asset path: `/assets/public/marcom-prod/home/hero/bodymovin/slurpee/`
  - Animation ID: "slurpee" (fluid/paint-stroke color wash over hero photo)
  - Library: `lottie-web` (Airbnb's Bodymovin runtime)
- [ ] GSAP — not detected (no `gsap.`, `ScrollTrigger`, `CustomEase` markers)
- [ ] Three.js / R3F — not detected
- [ ] Framer Motion — not detected
- [ ] Lenis — not detected
- [ ] Spline — not detected
- [ ] Custom WebGL / GLSL shaders — not detected
- [ ] Canvas 2D particle systems — not detected

### CSS Framework
- [ ] Tailwind CSS — not detected (no utility class patterns: `flex`, `text-xl`, `bg-blue-500`)
- [ ] Bootstrap — not detected (no `col-md-`, `btn-primary` class patterns)
- [x] **Custom CSS** — CONFIRMED (proprietary class naming, no recognizable framework patterns)
- [ ] CSS Modules — inconclusive (external CSS not accessible)
- [ ] CSS-in-JS — not detected

### JavaScript Framework
- [ ] React / Next.js — not detected (`data-reactroot`, `__NEXT_DATA__` absent)
- [ ] Vue — not detected (`data-v-` attribute patterns absent)
- [ ] Angular — not detected
- [x] **Custom / Proprietary JS** — CONFIRMED (no standard framework markers; likely server-rendered with progressive enhancement)

### Carousel / Slider
- [x] **Carousel present** — CONFIRMED ("Slide 1 of 4" indicator, feature cards + blog cards)
- [ ] Swiper — inconclusive (no `swiper-` class patterns visible)
- [ ] Embla — inconclusive
- [ ] Slick — inconclusive
- [x] **Custom or unidentified slider** — most likely

### Image & Asset System
- [x] **Proprietary image CDN** — CONFIRMED
  - Pattern: `?m_resize=w{width}&opt=aggressive&ver=2`
  - Host: `withjoy.com/assets/public/marcom-prod/`
  - Aggressive compression + responsive resizing
- [x] **Lazy loading** — INFERRED (base64 placeholder data URIs detected in WebFetch output, standard lazy-load pattern)
- [x] **WebP format** — CONFIRMED (hero image returned as image/webp on direct fetch)

### Analytics & Tracking
- [x] **AdXcel conversion pixel** — CONFIRMED
  - URL: `https://data.adxcel-ec2.com/pixel/?ad_log=referer&action=content&pixid=aad0d74e-06ee-4d0e-8000-408c8e31396a`
- [x] **Pinterest CAPI** — CONFIRMED
  - Tag ID: `2617606439718`
  - URL: `https://ct.pinterest.com/v3/?tid=2617606439718&noscript=1`
- [x] **CCPA opt-out integration** — CONFIRMED
  - TrueVault / Polaris: `polaris.truevaultcdn.com/static/assets/icons/optout-icon-blue.svg`
  - Privacy portal: `privacy.withjoy.com`

### Internationalization
- [x] **Multi-locale routing** — CONFIRMED
  - Pattern: `?l={locale}` (e.g., `?l=en-US`, `?l=de-DE`, `?l=ja-JP`)
  - 8 locales: en-US, en-GB, en-AU, de-DE, es-ES, fr-FR, it-IT, ja-JP

### Infrastructure
- [x] **Proprietary asset pipeline** — CONFIRMED (`marcom-prod` namespace = marketing/comms production)
- [x] **Separate help subdomain** — `help.withjoy.com`
- [x] **Separate privacy subdomain** — `privacy.withjoy.com`
- [ ] Vercel — not detected
- [ ] Netlify — not detected
- [ ] AWS / CloudFront — unconfirmed (possible behind CDN)

---

## Evidence Snippets (verbatim from source)

### Bodymovin class
```html
<div class="bodymovin"
     data-animation-path="/assets/public/marcom-prod/home/hero/bodymovin/slurpee/"
     data-anim-loop="true">
</div>
```

### Image CDN URL pattern
```
https://withjoy.com/assets/public/marcom-prod/home/hero/bodymovin/slurpee/bg_stripping.jpg
  ?m_resize=w600
  &opt=aggressive
  &ver=2
```

### Flower assets (floating editorial elements)
```
flower1.png through flower14.png
Path: /assets/public/marcom-prod/home/studio-banner/
14 individual PNG files positioned absolutely in the promotional banner
```

### AdXcel pixel
```html
<img src="https://data.adxcel-ec2.com/pixel/?ad_log=referer&action=content&pixid=aad0d74e-06ee-4d0e-8000-408c8e31396a" width="1" height="1">
```

### Pinterest CAPI noscript
```html
<noscript>
  <img height="1" width="1" style="display:none;" alt=""
       src="https://ct.pinterest.com/v3/?tid=2617606439718&noscript=1">
</noscript>
```

### Locale switching
```
https://withjoy.com?l=en-US
https://withjoy.com?l=en-GB
https://withjoy.com?l=en-AU
https://withjoy.com?l=de-DE
https://withjoy.com?l=es-ES
https://withjoy.com?l=fr-FR
https://withjoy.com?l=it-IT
https://withjoy.com?l=ja-JP
```

### Wave SVG separator
```html
<img src="https://withjoy.com/assets/public/marcom-prod/home/hero/wave.svg
          ?m_resize=w600&opt=aggressive&ver=2"
     aria-hidden="true">
```

---

## Stack Summary

Joy is a **lightweight, custom-built consumer web app** with:
- One premium motion dependency (Lottie/Bodymovin) used surgically in the hero
- No heavy JS frameworks detectable on the marketing site
- Proprietary image CDN with aggressive optimization
- Custom CSS methodology (no framework)
- Progressive enhancement approach (CSS-only interactions, Lottie as enhancement layer)
- Standard analytics stack (AdXcel + Pinterest) targeting wedding/consumer audiences

This is not a "build in public with OSS" stack — it is a mature, internally maintained platform
that has optimized for performance and maintenance at scale rather than developer velocity.
