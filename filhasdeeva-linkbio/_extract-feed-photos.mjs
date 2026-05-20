import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  // === 1. Download Instagram feed photos ===
  console.log('--- Downloading Instagram feed photos ---');
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await ctx.newPage();
  
  // Collect image URLs from network
  const imgUrls = [];
  page.on('response', async (resp) => {
    const ct = resp.headers()['content-type'] || '';
    const url = resp.url();
    if (ct.includes('image/jpeg') && url.includes('instagram') && url.includes('_n.jpg')) {
      const size = parseInt(resp.headers()['content-length'] || '0');
      if (size > 30000) { // Only substantial images
        imgUrls.push({ url, size });
      }
    }
  });
  
  await page.goto('https://www.instagram.com/filhasdeeva/?hl=pt-br', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(8000);
  
  // Scroll to load more images
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(1500);
  }
  await page.waitForTimeout(3000);
  
  console.log(`Found ${imgUrls.length} images from network`);
  
  // Download top 10 unique images (deduplicate by base URL)
  const seen = new Set();
  let count = 0;
  for (const { url } of imgUrls) {
    const baseUrl = url.split('?')[0];
    if (seen.has(baseUrl) || count >= 10) continue;
    seen.add(baseUrl);
    
    try {
      const resp = await page.goto(url, { timeout: 10000 });
      if (resp) {
        const buf = await resp.body();
        if (buf.length > 20000) {
          count++;
          writeFileSync(`assets/feed-${count}.jpg`, buf);
          console.log(`Saved feed-${count}.jpg (${(buf.length/1024).toFixed(0)}KB)`);
        }
      }
    } catch(e) {}
  }
  
  await ctx.close();
  
  // === 2. Find YouTube Shorts ===
  console.log('\n--- Finding YouTube Shorts ---');
  const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page2 = await ctx2.newPage();
  await page2.goto('https://www.youtube.com/@filhasdeeva/shorts', { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
  await page2.waitForTimeout(5000);
  
  const shortsData = await page2.evaluate(() => {
    const items = [];
    document.querySelectorAll('a[href*="/shorts/"]').forEach(a => {
      const href = a.href;
      const id = href.match(/\/shorts\/([^/?]+)/)?.[1];
      const img = a.querySelector('img');
      if (id && !items.find(x => x.id === id)) {
        items.push({ id, href, imgSrc: img?.src?.substring(0, 400) });
      }
    });
    return items;
  });
  
  console.log(`Found ${shortsData.length} shorts`);
  shortsData.slice(0, 8).forEach((s, i) => {
    console.log(`Short ${i+1}: ${s.id} — thumb: ${s.imgSrc?.substring(0, 80)}`);
  });
  
  writeFileSync('_extracted/shorts-data.json', JSON.stringify(shortsData, null, 2));
  
  await ctx2.close();
  await browser.close();
  console.log('\nDONE');
})();
