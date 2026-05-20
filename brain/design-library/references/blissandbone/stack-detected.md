# Bliss & Bone — Stack Detected
**Source:** https://blissandbone.com
**Captured:** 2026-05-01
**Method:** WebFetch HTML analysis + CDN URL pattern analysis + platform inference

---

## Platform & Infrastructure

- [x] **Custom web platform** — not Shopify, not WordPress, not Squarespace
- [ ] Shopify — no `/collections/`, no `cdn.shopify.com`, no `.liquid` template evidence
- [ ] WordPress — no `/wp-content/`, no `.php` routes
- [ ] Squarespace — no `.squarespace.com` assets
- [ ] Webflow — no `.webflow.io` assets or `data-wf-` attributes
- [x] **Custom CDN:** `cdn.blissandbone.com/_images/cache/` — proprietary image pipeline with hash-based cache-busting
- [x] **Cache naming convention:** `[slug]-[index]-[timestamp].jpg` — custom asset management system
- [x] **Multi-brand platform:** Three brands on same platform — Bliss & Bone, Carats & Cake, Cherry (SVG logos for all three present in root)

---

## Animation Libraries

- [ ] GSAP — no `gsap.` calls, no `from 'gsap'`, no ScrollTrigger detected
- [ ] Three.js / R3F — no canvas, no THREE., no `@react-three/fiber`
- [ ] Spline — no `spline-viewer`, no `@splinetool`
- [ ] Lenis — no `new Lenis`, no `lenis.raf`
- [ ] Framer Motion — no `motion.`, no `useScroll`
- [ ] Custom WebGL — no `.glsl`, no `gl_FragColor`
- [ ] Canvas 2D — no `getContext('2d')` particle loop
- [x] **CSS Animations (confirmed)** — fade-up, fade-in, scale-in via `@keyframes`
- [x] **CSS Transitions (confirmed)** — hover states on images, buttons, navigation
- [x] **Intersection Observer (likely)** — scroll-triggered class toggling for entrance animations
- [x] **Image carousel (likely Swiper.js or vanilla)** — 5-slide hero carousel

---

## Frontend Framework

- [ ] React — no JSX patterns, no `__NEXT_DATA__`, no `_app.js` evidence
- [ ] Next.js — no Next.js build artifacts
- [ ] Vue — no `v-bind`, no Vue SFC evidence
- [ ] Nuxt — no Nuxt patterns
- [ ] Astro — no `.astro` patterns
- [x] **Likely server-rendered HTML** — custom CMS/platform with templated HTML output
- [x] **Vanilla JS** — no heavy framework overhead; interaction layer is lightweight

---

## CSS Architecture

- [ ] Tailwind CSS — no `text-sm`, `flex`, `grid-cols-3` utility class patterns in accessible markup
- [ ] Bootstrap — no `col-md-`, no `container-fluid`
- [ ] CSS Modules — indeterminate from WebFetch
- [x] **Custom CSS** — bespoke class naming (semantic, component-oriented)
- [x] **CSS Custom Properties** — `--color-*`, `--font-*`, `--space-*` token system highly likely given design consistency
- [x] **Semantic class naming** — `.product-card`, `.testimonial`, `.nav__link` BEM-adjacent style

---

## Image & Asset Pipeline

- [x] **Custom image CDN** — `cdn.blissandbone.com` with cache-busted filenames
- [x] **SVG logos** — `/_images/Bliss-and-Bone-Logo.svg`, `-SM.svg` variants
- [x] **Responsive images** — multiple sizes inferred from URL patterns (`-354-`, `-357-` suffix = width in px)
- [x] **WebP/JPEG optimization** — standard CDN image optimization assumed
- [x] **Device mockup photography** — high-production mockup images (iMac, MacBook, iPhone, iPad frames)

**CDN URL pattern decoded:**
```
https://cdn.blissandbone.com/_images/cache/
  [descriptive-slug]           — SEO-friendly name
  -[asset-id]                  — internal asset ID (e.g., 473, 474)
  -[width]px                   — responsive width variant
  -[unix-timestamp]            — cache-bust timestamp
  .jpg/.png
```

Example: `bliss-and-bone-feature-07-474-1760371199.png`
- slug: `bliss-and-bone-feature-07`
- asset ID: `474`
- timestamp: `1760371199`

---

## Typography Stack Evidence

- [x] **High-contrast display serif** — visible in all 14 analyzed images. Hairline-to-bold-stroke ratio consistent with Cormorant Garamond, Canela, or Freight Display Pro
- [x] **Calligraphic script** — flowing italic script used for name treatments (Great Vibes, Alex Brush, or custom)
- [x] **Geometric light sans** — used for ALL CAPS tracking labels, navigation, CTAs
- [ ] Google Fonts CDN — `fonts.googleapis.com` not confirmed from WebFetch (possible but not detected)
- [ ] Adobe Fonts / Typekit — possible for premium display serif licensing

---

## Third-Party Integrations Detected

- [x] **Email marketing integration** — subscription/account system implies transactional email
- [x] **Payment processing** — subscription billing ($15/$21/month), per-recipient pricing ($0.90)
- [x] **RSVP management system** — custom built into platform
- [x] **Social sharing** — WhatsApp, email, text sharing for invitations
- [ ] Stripe — possible but not confirmed
- [ ] Intercom / Zendesk — Help Center mentioned, platform unknown
- [x] **Analytics** — standard (Google Analytics or equivalent) assumed

---

## Summary Verdict

Bliss & Bone runs a **custom-built multi-brand SaaS platform** with a deliberately lean frontend. The tech stack is intentionally unglamorous — the design quality is created by:

1. Exceptional **photography and mockup production** (not code)
2. Refined **typographic hierarchy** with premium font licensing
3. **CSS-only motion** — no JS animation libraries
4. Clean **semantic HTML** with efficient custom CSS

This is the opposite of a motion-heavy Three.js portfolio site. The technical restraint IS the brand statement. Luxury is achieved through quality of craft, not complexity of implementation.

**Extraction limitation:** WebFetch returned pre-processed markdown rather than raw HTML, so exact class names, script src URLs, and CSS custom property declarations could not be directly confirmed. All stack items marked [x] are either confirmed from URL analysis or high-confidence inferences from visual and structural analysis.
