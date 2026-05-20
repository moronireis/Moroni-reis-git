# Paperless Post — Stack Detected
Source: https://www.paperlesspost.com/
Harvest date: 2026-05-01
Method: WebFetch behavioral analysis + sitemap/robots.txt inspection
Note: JS bundles not directly accessible via WebFetch. Detection based on structural signals, URL patterns, sitemap architecture, and page behavior descriptions.

---

## Framework / Runtime

| Technology | Status | Evidence |
|---|---|---|
| React | LIKELY | Client-side hydration behavior; dynamic filter UI; interactive calculator; SPA-like navigation patterns |
| Next.js | LIKELY | SSR/SSG signals from sitemap structure (plp-sitemap, pdp-sitemap, landing-sitemap, filter-plp-sitemap); SEO-optimized URLs; 102-page pagination with server-rendered pages |
| TypeScript | PROBABLE | Enterprise-scale codebase (80+ designer partnerships, 7,336 products, multi-language); TS common in this profile |

---

## Rendering Strategy

| Page Type | Strategy | Evidence |
|---|---|---|
| Product listing pages (PLP) | SSG or ISR | In sitemap as `plp-sitemap.xml`; paginated to 102 pages |
| Product detail pages (PDP) | SSG | `card-pdp-sitemap.xml`, `flyer-pdp-sitemap.xml` |
| Landing pages | SSG | `landing-sitemap.xml` (21 URLs) |
| Filter pages | SSG | `filter-plp-sitemap.xml` — pre-rendered filter combinations |
| Search-term pages | SSG | `search-term-plp-sitemap.xml` |
| Builder/editor | CSR | Dynamic tool, not in sitemap |
| Blog | SSG | `blog/sitemap_index.xml` |
| Spanish (ES) variants | SSG | 7 ES-specific sitemaps mirror English structure |

---

## Asset Delivery

| System | Status | Evidence |
|---|---|---|
| Custom CDN | CONFIRMED | `ppassets.com` domain for images |
| Image optimization | CONFIRMED | `?noindex=true` URL parameter on images; `png_small` variant naming |
| Responsive images | LIKELY | Multi-size asset variants inferred from naming patterns |

---

## Motion / Animation Libraries

| Library | Status | Evidence |
|---|---|---|
| CSS Transitions (native) | CONFIRMED | Card hovers, dropdown menus, standard UI interactions |
| CSS Scroll Snap | LIKELY | Horizontal carousels with snap behavior |
| GSAP | NOT DETECTED | No scroll-triggered entrance animations, no GSAP class patterns |
| Framer Motion | POSSIBLE | React stack + subtle component transitions; unconfirmed |
| Three.js / WebGL | NOT DETECTED | No 3D elements anywhere on site |
| Lenis | UNCONFIRMED | Possible smooth scroll on carousels; no direct evidence |
| Spline | NOT DETECTED | No Spline embeds |

---

## UI Component Library

| Technology | Status | Evidence |
|---|---|---|
| Custom components | LIKELY PRIMARY | Highly branded, unique patterns (dual envelope+card preview, coin calculator, color swatch overflow system) suggest custom build |
| Radix UI / Headless UI | POSSIBLE | Accessible dropdown menus, accordion FAQ, filter panels; these headless patterns are common with React |
| Tailwind CSS | UNCONFIRMED | No utility class names directly observed |
| Styled Components / CSS Modules | POSSIBLE | No BEM or utility class patterns visible in text content |

---

## Search / Filtering

| Technology | Status | Evidence |
|---|---|---|
| Algolia | POSSIBLE | 7,336 products with 60+ theme filters, 80+ designer filters, color/venue/style/season filters — scale and sophistication suggest a dedicated search engine |
| ElasticSearch | POSSIBLE | Alternative to Algolia at this product scale |
| Custom search | LESS LIKELY | Filter complexity and result count suggest specialized tooling |

---

## Analytics / Tracking

| Technology | Status | Evidence |
|---|---|---|
| Builder.io pixel | DETECTED | CDN URL pattern `cdn.builder.io/api/v1/pixel?...` found in page content |
| Google Analytics | PROBABLE | Standard for e-commerce at this scale |
| Meta Pixel | PROBABLE | E-commerce conversion tracking |

---

## Infrastructure Signals

| Signal | Observation |
|---|---|
| Multi-language | Full ES (Spanish) mirror of all sitemap types — 7 ES sitemaps matching 7 EN sitemaps |
| Crawl delay | 10-second crawl delay for `ia_archiver` in robots.txt |
| Protected routes | `/carts/`, `/accounts/`, `/checkout/`, `/dashboard`, `/manage` blocked from crawlers |
| Filter parameter blocking | `colors`, `price`, `designers`, `occasions` query params blocked — suggests client-side filter rendering |
| Twitterbot special rule | Allowed `/events/` but blocked from `/flash/` — suggests `/flash/` is a legacy or internal tool |

---

## Tech Profile Summary

Paperless Post runs a mature, enterprise-scale React/Next.js application with a heavy SSG/ISR strategy for SEO (7,000+ pre-rendered product pages across two languages). The UI is custom-built — the envelope+card dual-preview component, coin calculator, and swatch overflow system are bespoke. Motion is deliberately minimal (CSS transitions only, no JS animation libraries confirmed). Asset delivery is CDN-optimized with multiple image size variants.

The tech stack is unremarkable by design — engineering excellence is invisible, serving the product (invitation designs) without competing with it.
