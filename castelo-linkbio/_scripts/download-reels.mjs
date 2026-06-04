/**
 * Download Reels by ID — adapted from filhasdeeva-linkbio/_download-reels.mjs
 * Run: node _scripts/download-reels.mjs
 */
import { chromium } from 'playwright';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'assets', 'videos');
const IDS_FILE = join(__dirname, 'reel-ids.json');

// Load discovered IDs or use fallback
let reelIds = [];
if (existsSync(IDS_FILE)) {
  reelIds = JSON.parse(readFileSync(IDS_FILE, 'utf8')).slice(0, 6); // max 6 reels
} else {
  console.log('No reel-ids.json found. Run get-reels.mjs first.');
  process.exit(1);
}

console.log(`Downloading ${reelIds.length} reels...`);

(async () => {
  const browser = await chromium.launch({ headless: true });

  for (let i = 0; i < reelIds.length; i++) {
    const id = reelIds[i];
    const outPath = join(OUT_DIR, `reel-${i + 1}.mp4`);

    if (existsSync(outPath)) {
      console.log(`  SKIP reel-${i+1}.mp4 (already exists)`);
      continue;
    }

    console.log(`  [${i+1}/${reelIds.length}] Downloading ${id}...`);

    try {
      const ctx = await browser.newContext({
        viewport: { width: 390, height: 844 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        isMobile: true,
      });
      const page = await ctx.newPage();

      let saved = false;
      page.on('response', async (response) => {
        if (saved) return;
        const type = response.headers()['content-type'] || '';
        if (type.includes('video/mp4')) {
          try {
            const buffer = await response.body();
            if (buffer.length > 50000) {
              writeFileSync(outPath, buffer);
              console.log(`    Saved reel-${i+1}.mp4 (${(buffer.length/1024/1024).toFixed(1)}MB)`);
              saved = true;
            }
          } catch(e) {}
        }
      });

      await page.goto(`https://www.instagram.com/reel/${id}/`, {
        waitUntil: 'domcontentloaded',
        timeout: 25000
      }).catch(() => {});
      await page.waitForTimeout(8000);

      if (!saved) {
        const src = await page.evaluate(() => {
          const v = document.querySelector('video');
          return v?.src || v?.currentSrc;
        });
        if (src && src.startsWith('http')) {
          const resp = await page.evaluate(async (url) => {
            const r = await fetch(url);
            const buf = await r.arrayBuffer();
            return Array.from(new Uint8Array(buf));
          }, src);
          if (resp.length > 50000) {
            writeFileSync(outPath, Buffer.from(resp));
            console.log(`    Downloaded via fetch (${(resp.length/1024/1024).toFixed(1)}MB)`);
            saved = true;
          }
        }
      }

      if (!saved) console.log(`    FAILED: ${id}`);
      await ctx.close();
    } catch (e) {
      console.log(`    ERROR: ${e.message}`);
    }
  }

  await browser.close();
  console.log('\nDone.');
})();
