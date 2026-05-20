import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const reelIds = ['DIgvflBtewU', 'DIRUTd1xF1x', 'DH_R6mkxvur', 'DYKrEdOR_BE', 'DWsMcEWR6J0', 'DWpnnluRPR0'];

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  for (let i = 0; i < reelIds.length; i++) {
    const id = reelIds[i];
    try {
      const ctx = await browser.newContext({
        viewport: { width: 390, height: 844 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
        isMobile: true,
      });
      const page = await ctx.newPage();
      
      // Intercept the video response and save it
      let saved = false;
      page.on('response', async (response) => {
        if (saved) return;
        const type = response.headers()['content-type'] || '';
        if (type.includes('video/mp4')) {
          try {
            const buffer = await response.body();
            if (buffer.length > 50000) { // Only save substantial video files
              writeFileSync(`assets/reel-${i+1}.mp4`, buffer);
              console.log(`  Saved reel-${i+1}.mp4 (${(buffer.length/1024/1024).toFixed(1)}MB)`);
              saved = true;
            }
          } catch(e) {}
        }
      });
      
      await page.goto(`https://www.instagram.com/reel/${id}/`, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(8000);
      
      if (!saved) {
        // Try to get video src and download manually
        const src = await page.evaluate(() => {
          const v = document.querySelector('video');
          return v?.src || v?.currentSrc;
        });
        if (src) {
          const resp = await page.evaluate(async (url) => {
            const r = await fetch(url);
            const buf = await r.arrayBuffer();
            return Array.from(new Uint8Array(buf));
          }, src);
          writeFileSync(`assets/reel-${i+1}.mp4`, Buffer.from(resp));
          console.log(`  Downloaded reel-${i+1}.mp4 via fetch (${(resp.length/1024/1024).toFixed(1)}MB)`);
          saved = true;
        }
      }
      
      if (!saved) console.log(`  FAILED to download reel ${id}`);
      else console.log(`OK: ${id}`);
      
      await ctx.close();
    } catch (e) {
      console.log(`ERROR ${id}: ${e.message.substring(0, 100)}`);
    }
  }
  
  await browser.close();
  console.log('\nDONE');
})();
