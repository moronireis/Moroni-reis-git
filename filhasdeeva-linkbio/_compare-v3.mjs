import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    isMobile: true,
  });
  const page = await ctx.newPage();
  await page.goto(`file://${process.cwd()}/index.html`, { waitUntil: 'load', timeout: 15000 });
  await page.waitForTimeout(3000);
  
  // Scroll all to trigger reveals
  await page.evaluate(async () => {
    for (let i = 0; i < document.body.scrollHeight; i += 300) {
      window.scrollTo(0, i);
      await new Promise(r => setTimeout(r, 50));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1000);

  const height = await page.evaluate(() => document.body.scrollHeight);
  console.log(`V3 total height: ${height}px`);
  
  // Full page
  await page.screenshot({ path: '_screenshots/v3-full.png', fullPage: true });

  // Sections
  const positions = [0, 844, 1688, 2532, 3376, 4220, 5064, 5908, 6752, 7596, 8440, 9284];
  for (let i = 0; i < positions.length; i++) {
    if (positions[i] >= height) break;
    await page.evaluate((y) => window.scrollTo(0, y), positions[i]);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `_screenshots/v3-section-${String(i+1).padStart(2,'0')}.png` });
    console.log(`Section ${i+1} at y=${positions[i]}`);
  }
  
  await browser.close();
  console.log('DONE');
})();
