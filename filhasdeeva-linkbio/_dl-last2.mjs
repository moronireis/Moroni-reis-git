import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
    isMobile: true,
  });
  const page = await ctx.newPage();
  let saved = false;
  page.on('response', async (resp) => {
    if (saved) return;
    const ct = resp.headers()['content-type'] || '';
    if (ct.includes('video/mp4')) {
      try {
        const buf = await resp.body();
        if (buf.length > 50000) {
          writeFileSync('assets/reel-6.mp4', buf);
          console.log(`Saved reel-6.mp4 (${(buf.length/1024/1024).toFixed(1)}MB)`);
          saved = true;
        }
      } catch(e) {}
    }
  });
  // Try a different reel
  await page.goto('https://www.instagram.com/reel/DWnC1EUxOOe/', { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(12000);
  if (!saved) {
    // Fallback: try fetching src directly
    const src = await page.evaluate(() => document.querySelector('video')?.src);
    if (src) {
      console.log('Found video src, fetching via page...');
      const r = await page.goto(src, { timeout: 30000 }).catch(() => null);
      if (r) {
        const buf = await r.body();
        writeFileSync('assets/reel-6.mp4', buf);
        console.log(`Saved reel-6.mp4 via direct fetch (${(buf.length/1024/1024).toFixed(1)}MB)`);
        saved = true;
      }
    }
  }
  if (!saved) console.log('FAIL');
  await ctx.close();
  await browser.close();
})();
