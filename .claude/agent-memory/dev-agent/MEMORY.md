# Memory Index

## Project
- [project_website_structure.md](project_website_structure.md) — reis-ia-website Astro project structure, confirmed component APIs, and page conventions.
- [project_brand_pillars.md](project_brand_pillars.md) — Active pillars: Systems, Builders, Marketing. Z7 permanently removed. Time Builders → Builders.
- [project_hub_structure.md](project_hub_structure.md) — reis-ia-hub/ Astro server app (auth portal): layouts, Supabase client, page routes, adapter config.

## Feedback
- [feedback_no_saas_patterns.md](feedback_no_saas_patterns.md) — PERMANENT: No pricing tables, tier cards, or SaaS patterns. All CTAs → /agendar or /aplicar.
- [feedback_no_azure_whisper.md](feedback_no_azure_whisper.md) — PERMANENT: Azure Whisper / Blue Shimmer Text effect permanently discarded. Never recreate.
- [feedback_brand_lockup.md](feedback_brand_lockup.md) — Brand name is REIS [IA]: "REIS" weight 300 white + "[IA]" weight 300 accent blue. Never write "Reis IA".
- [feedback_no_emojis_icons.md](feedback_no_emojis_icons.md) — Never use emojis in UI. Always use minimal geometric SVG icons matching the design system.
- [feedback_scroll_bugs.md](feedback_scroll_bugs.md) — 5 scroll/layout bugs confirmed in editorial sites: Lenis conflict, .section min-height, will-change overuse, font @import duplicate, inline styles.

## Project
- [project_castelo_dimatoso.md](project_castelo_dimatoso.md) — Castelo dos Lagos + Di Matoso Astro sites: structure, token system, build status, key decisions.
- [project_moroniedaphine_ds.md](project_moroniedaphine_ds.md) — M&D wedding design system preview: single index.html, deployed at moroniedaphine.vercel.app.

## Patterns
- For net-new projects (e.g. client demos), all files are IDS: CREATE. Log once at project start; no need to re-justify every file in the same empty directory.
- Astro scaffold via `npm create astro@latest` creates a default `index.astro` and `README.md` — always Read them before Write to avoid the "file not read" error.
- `@astrojs/tailwind` does not support Astro 6 (peer dep error). Use `@tailwindcss/vite` directly in `astro.config.mjs` `vite.plugins` instead — no `@astrojs/tailwind` needed.
- Tailwind v4 (CSS-first): `@import "tailwindcss"` must come AFTER any `@import url()` rules or the build emits a CSS ordering warning.
- For standalone cover/hero pages without sidebar, skip the Layout component and write a full `<!doctype html>` document directly in the page file.
- When a client page has its own bespoke layout (e.g. full-screen cover), `import '../styles/global.css'` in the page frontmatter still loads all tokens and custom classes — no need to duplicate styles inline.
- For simple static landing pages (single HTML file), skip Astro entirely. Use `vercel.json` with `outputDirectory: "."` and `framework: null` for zero-config static deploy.
- Static deploys: `vercel --prod --yes` in the project directory auto-creates the project and links it on first run.
- `reis-ia-agents-showcase` is a single `index.html` file. Agent data lives in the `SQUADS` JS array; the card HTML is rendered by JS into `#squads-root`. Edits to agent cards = edit the render template inside `SQUADS.forEach`.
