import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const reelIds = [
  { id: 'DWoi_8jxF25', num: 4 },
  { id: 'DWnC1EUxOOe', num: 5 },
  { id: 'DWmE1-iRBrv', num: 6 },
];

(async () => {
  const browser = await chromium.launch({ headless: true });

  for (const { id, num } of reelIds) {
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
            writeFileSync(`assets/reel-${num}.mp4`, buf);
            console.log(`Saved reel-${num}.mp4 (${(buf.length/1024/1024).toFixed(1)}MB)`);
            saved = true;
          }
        } catch(e) {}
      }
    });

    await page.goto(`https://www.instagram.com/reel/${id}/`, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(10000);

    if (!saved) console.log(`FAIL: reel-${num} (${id})`);
    await ctx.close();
  }

  await browser.close();
  console.log('DONE');
})();
