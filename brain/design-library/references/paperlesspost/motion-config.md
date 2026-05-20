# Paperless Post — Motion Config
Source: https://www.paperlesspost.com/
Harvest date: 2026-05-01
Method: WebFetch (markdown conversion — JS bundles not directly accessible)

---

## Library Detection Status

WebFetch converts HTML to markdown before returning, which strips `<script>` tags, JS bundle URLs, and inline scripts. The following detection results are based on behavioral signals inferred from page structure and interaction descriptions, not from direct source inspection.

| Library | Detected | Evidence | Confidence |
|---|---|---|---|
| GSAP / ScrollTrigger | NOT CONFIRMED | No scroll-triggered animations described; no GSAP class patterns in content | Low |
| Framer Motion | POSSIBLE | React/Next.js stack likely (client-side hydration signals); Framer Motion is common in React ecosystems | Medium |
| Three.js / R3F | NOT DETECTED | No 3D/WebGL elements observed on any page | None |
| Spline | NOT DETECTED | No Spline embeds or canvas elements referenced | None |
| Lenis (smooth scroll) | POSSIBLE | Smooth horizontal carousel scrolling described; scroll behavior feels controlled | Low |
| Custom WebGL shaders | NOT DETECTED | No shader patterns referenced | None |
| Canvas 2D particles | NOT DETECTED | No particle effects observed | None |
| CSS Transitions (native) | CONFIRMED | Card hover states, dropdown menus, filter panels — standard CSS transition patterns | High |
| CSS Animations (native) | LIKELY | Scroll-left/right carousels, nav dropdowns | Medium |

---

## Motion Patterns Observed (Behavioral Analysis)

### 1. Card Hover — Invitation Gallery

**Behavior**: Hovering a card tile reveals a "Preview with my photo" overlay link on the image area. Favorite heart icon also appears or becomes prominent.

**Inferred implementation**:
```css
.card-tile .card-overlay {
  opacity: 0;
  transition: opacity 200ms ease;
}
.card-tile:hover .card-overlay {
  opacity: 1;
}
.card-tile {
  transition: box-shadow 200ms ease, transform 150ms ease;
}
.card-tile:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  transform: translateY(-2px); /* subtle lift — inferred */
}
```

**Duration estimate**: 150–200ms
**Easing**: ease or ease-out

---

### 2. Horizontal Carousel Scroll

**Behavior**: "Shop by style", "Shop by designer", "Milestone birthdays", and other sections use horizontal scrolling with explicit left/right navigation affordances. Smooth scroll behavior implied.

**Inferred implementation**:
```css
.carousel-track {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}
.carousel-item {
  scroll-snap-align: start;
  flex-shrink: 0;
}
```

Or JavaScript-driven with arrow button click → `scrollLeft` animation via `requestAnimationFrame` or `scrollTo({ behavior: 'smooth' })`.

---

### 3. Navigation Mega Menu — Expand/Collapse

**Behavior**: Primary nav items reveal mega menus with nested categories on hover/click.

**Inferred implementation**:
```css
.mega-menu {
  opacity: 0;
  transform: translateY(-8px);
  pointer-events: none;
  transition: opacity 200ms ease, transform 200ms ease;
}
.nav-item:hover .mega-menu,
.nav-item:focus-within .mega-menu {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
```

---

### 4. Filter Panel — Open/Close

**Behavior**: Filter drawer/panel opens when "Filters icon" is clicked in the gallery.

**Inferred implementation**:
```css
.filter-panel {
  transform: translateX(-100%);
  transition: transform 300ms ease-out;
}
.filter-panel.is-open {
  transform: translateX(0);
}
```

Or a height/opacity expand for a top-bar filter dropdown.

---

### 5. FAQ Accordion

**Behavior**: FAQ items expand/collapse with chevron rotation.

**Inferred implementation**:
```css
.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 300ms ease-out;
}
.faq-item.is-open .faq-answer {
  max-height: 500px;
}
.faq-chevron {
  transition: transform 200ms ease;
}
.faq-item.is-open .faq-chevron {
  transform: rotate(180deg);
}
```

---

### 6. Pricing Calculator — Real-time Update

**Behavior**: Coin calculator on pricing/wedding pages updates the total dynamically as user changes inputs.

**Inferred implementation**: JavaScript-driven DOM update. No animation on the number change itself (purely functional).

---

### 7. Tab Navigation (Wedding page, Features page)

**Behavior**: Horizontal tab navigation with active state. Content updates on tab selection.

**Inferred implementation**:
```css
.tab-indicator {
  position: absolute;
  bottom: 0;
  height: 2px;
  background: currentColor;
  transition: left 250ms ease, width 250ms ease;
}
```

Or content section visibility toggle with opacity transition.

---

### 8. "Magic Art" AI Tool — No motion info

The AI-powered illustration tool ("Magic Art") generates custom illustrations. Generation state (loading → result) likely includes a spinner or skeleton loader, but no specific animation pattern was observable.

---

## Scroll Strategy

**No evidence of scroll-linked animations** (parallax, scroll-triggered entrance effects, ScrollTrigger GSAP patterns). The site is deliberately static-feeling — content is presented without scroll choreography.

This is a deliberate premium restraint: the product (the invitation) IS the motion. The shell around it is quiet.

**Inferred scroll approach**: standard browser scroll, with possible smooth scroll CSS (`scroll-behavior: smooth` on `<html>`). No GSAP ScrollTrigger or Intersection Observer-heavy entrance animations detected.

---

## Easing Reference (Estimated)

```
ease-default:    ease                              — standard transitions
ease-out-cubic:  cubic-bezier(0.215, 0.61, 0.355, 1) — nav dropdowns, panels
ease-in-out:     ease-in-out                       — accordion, toggles
ease-bounce:     cubic-bezier(0.34, 1.56, 0.64, 1)  — interactive feedback (unconfirmed)
```

---

## Duration Reference (Estimated)

```
duration-micro:    100ms  — checkbox toggles, swatch selections
duration-fast:     150ms  — hover micro-interactions
duration-standard: 200ms  — card hovers, nav items
duration-medium:   250ms  — tab transitions, tab indicators
duration-slow:     300ms  — panel open/close, accordion
duration-deliberate: 400ms — page-level transitions (if any)
```

---

## Key Motion Philosophy

Paperless Post uses **restraint as a premium signal**. The UI chrome is deliberately quiet — no entrance animations, no scroll choreography, no particle effects. Motion is limited to:

1. Functional feedback (hover states, dropdowns, accordions)
2. Navigation affordance (carousels with scroll cues)
3. State transitions (filter panels, tabs)

The design philosophy is: the invitation design IS the visual experience. Everything else steps aside.

This is the opposite of the "motion-forward" premium aesthetic (e.g., Linear, Vercel, Raycast). It is closer to the physical stationery world it emulates — where paper does not animate.

**What to steal**: the principle that restraint of motion CAN be premium. Not every premium site needs GSAP choreography.
