import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await ctx.newPage();
  
  // Go to reels tab
  await page.goto('https://www.instagram.com/filhasdeeva/reels/', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(8000);
  
  // Scroll to load more
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(1500);
  }
  
  // Extract all video/reel URLs and thumbnails
  const data = await page.evaluate(() => {
    const results = [];
    // Get all links that point to reels
    document.querySelectorAll('a[href*="/reel/"]').forEach(a => {
      const href = a.href;
      const img = a.querySelector('img');
      const video = a.querySelector('video');
      results.push({
        href: href,
        reelId: href.match(/\/reel\/([^/]+)/)?.[1],
        imgSrc: img?.src?.substring(0, 400),
        imgAlt: img?.alt?.substring(0, 200),
        videoSrc: video?.src?.substring(0, 400),
        videoPoster: video?.poster?.substring(0, 400),
      });
    });
    
    // Also get any video elements on page
    const videos = [];
    document.querySelectorAll('video').forEach(v => {
      videos.push({
        src: v.src?.substring(0, 400),
        poster: v.poster?.substring(0, 400),
      });
    });
    
    return { reels: results, videos };
  });
  
  writeFileSync('_extracted/reels-data.json', JSON.stringify(data, null, 2));
  console.log(`Found ${data.reels.length} reels, ${data.videos.length} videos`);
  
  // Take screenshot
  await page.screenshot({ path: '_extracted/instagram-reels.png', fullPage: false });
  
  // Print first 10
  data.reels.slice(0, 10).forEach((r, i) => {
    console.log(`\nReel ${i+1}: ${r.reelId}`);
    console.log(`  URL: ${r.href}`);
    console.log(`  Alt: ${r.imgAlt?.substring(0, 100)}`);
  });
  
  await browser.close();
  console.log('\nDONE');
})();
