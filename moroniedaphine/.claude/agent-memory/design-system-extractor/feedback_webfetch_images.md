---
name: WebFetch image extraction technique
description: WebFetch downloads CDN images as binary to tool-results/; use Read tool (not WebFetch prompt) to view them as rendered images for visual analysis.
type: feedback
---

WebFetch cannot describe binary image content when prompted directly — it returns an error message about "corrupted PNG/JPEG data." However, the binary IS saved to disk at the path shown in the tool result output.

**Why:** The WebFetch small model processes the image as text and fails. The Read tool has multimodal vision and can render the image correctly.

**How to apply:** When fetching CDN image URLs via WebFetch:
1. Let WebFetch download the binary (it will show the saved path in its output)
2. Immediately follow with Read tool on that exact path
3. Read renders the image visually — full design analysis becomes possible

Example path pattern: `/Users/moronireis/.claude/projects/-Users-moronireis-Projetos-vscode/{session-id}/tool-results/webfetch-{timestamp}-{hash}.png`

This technique was validated in the blissandbone harvest (2026-05-01): 14 CDN images analyzed this way, yielding olive/cobalt/dark satin/taupe/marble palette documentation and botanical composition analysis that would have been impossible from text alone.

Batch efficiently: fetch 3–4 CDN images in parallel WebFetch calls, then batch Read them in parallel. Saves significant time vs sequential fetching.
