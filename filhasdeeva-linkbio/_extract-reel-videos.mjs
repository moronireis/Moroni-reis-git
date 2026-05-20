import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const reelIds = ['DIgvflBtewU', 'DIRUTd1xF1x', 'DH_R6mkxvur', 'DYKrEdOR_BE', 'DWsMcEWR6J0', 'DWpnnluRPR0'];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  
  for (const id of reelIds) {
    try {
      const ctx = await browser.newContext({
        viewport: { width: 390, height: 844 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
        isMobile: true,
      });
      const page = await ctx.newPage();
      
      // Intercept video requests
      const videoUrls = [];
      page.on('response', async (response) => {
        const url = response.url();
        const type = response.headers()['content-type'] || '';
        if (type.includes('video') || url.includes('.mp4') || url.includes('video')) {
          videoUrls.push(url.substring(0, 500));
        }
      });
      
      await page.goto(`https://www.instagram.com/reel/${id}/`, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(5000);
      
      // Try to find video element
      const videoData = await page.evaluate(() => {
        const videos = document.querySelectorAll('video');
        return Array.from(videos).map(v => ({
          src: v.src?.substring(0, 500),
          poster: v.poster?.substring(0, 500),
          currentSrc: v.currentSrc?.substring(0, 500),
        }));
      });
      
      // Also try to get the og:video meta tag
      const ogVideo = await page.evaluate(() => {
        const meta = document.querySelector('meta[property="og:video"]');
        return meta?.content?.substring(0, 500);
      });
      
      results.push({
        id,
        videoElements: videoData,
        ogVideo,
        interceptedUrls: videoUrls.slice(0, 5),
      });
      
      console.log(`Reel ${id}: ${videoData.length} videos found, ${videoUrls.length} intercepted`);
      if (videoData.length > 0) console.log(`  src: ${videoData[0].src?.substring(0, 100)}`);
      if (videoData.length > 0 && videoData[0].poster) console.log(`  poster: ${videoData[0].poster?.substring(0, 100)}`);
      if (ogVideo) console.log(`  og:video: ${ogVideo.substring(0, 100)}`);
      
      await ctx.close();
    } catch (e) {
      console.log(`FAIL ${id}: ${e.message}`);
      results.push({ id, error: e.message });
    }
  }
  
  writeFileSync('_extracted/reel-videos.json', JSON.stringify(results, null, 2));
  await browser.close();
  console.log('\nDONE');
})();
