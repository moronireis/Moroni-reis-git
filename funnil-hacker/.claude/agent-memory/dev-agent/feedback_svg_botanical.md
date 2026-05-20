---
name: SVG botanical illustration conventions
description: How to draw botanical line art SVGs for the moroniedaphine wedding project. Copper-plate engraving style.
type: feedback
---

All flower illustrations must be inline SVG — no `<img>` tags, no external files, no photos.

**Why:** Moroni explicitly replaced all realistic flower photographs with SVG line art matching the copper-plate engraving style of the wedding printed materials (Manual do Convidado, Dress Code card).

**How to apply:**
- Stroke width: 0.5–0.9px for main paths, 0.3–0.5px for veins and secondary detail
- `stroke-linecap="round"` on all paths — gives organic hand-drawn feel
- Vary `opacity` per path (0.6–0.9) to simulate ink pressure depth
- Color: `#4A1619` (burgundy) on light backgrounds, `white` on burgundy backgrounds
- For background patterns (hero wallpaper): use `rgba(255,255,255,X)` strokes inside an SVG `<pattern>` element with `patternUnits="userSpaceOnUse"`
- Hero botanical bg opacity: 0.09. Corner decorations: 0.22. Invitation botanical: use gold (#D4AF37) at ~0.18 opacity.
- Three canonical flowers: Rosa (rose with layered petals, thorns, leaves), Tulipa (goblet cup, long narrow leaves), Copo de Leite / Calla Lily (curved spathe wrap, spadix, broad leaves)
- Never use `<circle>` for flower centers — draw with paths for consistency
