/**
 * Download Reels from @castelodoslagosoficial
 * Run: node _scripts/get-reels.mjs
 */
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'assets', 'videos');

mkdirSync(OUT_DIR, { recursive: true });

const PROFILE_URL = 'https://www.instagram.com/castelodoslagosoficial/reels/';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    isMobile: true,
  });
  const page = await ctx.newPage();

  console.log('Loading profile reels page...');
  await page.goto(PROFILE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(e => console.log('Goto err:', e.message));
  await page.waitForTimeout(5000);

  // Extract reel IDs from page
  const reelIds = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href*="/reel/"]'));
    return [...new Set(links.map(l => {
      const m = l.href.match(/\/reel\/([^\/\?]+)/);
      return m ? m[1] : null;
    }).filter(Boolean))];
  });

  console.log(`Found ${reelIds.length} reels: ${reelIds.join(', ')}`);

  // Save reel IDs for download script
  writeFileSync(join(__dirname, 'reel-ids.json'), JSON.stringify(reelIds, null, 2));

  await browser.close();
  console.log('Done. Run _scripts/download-reels.mjs to download videos.');
})();
