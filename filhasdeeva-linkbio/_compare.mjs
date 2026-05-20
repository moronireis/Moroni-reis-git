import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    isMobile: true,
  });
  const page = await ctx.newPage();
  await page.goto(`file://${process.cwd()}/index.html`, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);

  // Full page
  await page.screenshot({ path: '_screenshots/v2-full.png', fullPage: true });
  
  const height = await page.evaluate(() => document.body.scrollHeight);
  console.log(`V2 total height: ${height}px`);
  
  // Sections
  const positions = [0, 844, 1688, 2532, 3376, 4220, 5064, 5908, 6752, 7596];
  for (let i = 0; i < positions.length; i++) {
    if (positions[i] >= height) break;
    await page.evaluate((y) => window.scrollTo(0, y), positions[i]);
    await page.waitForTimeout(400);
    await page.screenshot({ path: `_screenshots/v2-section-${String(i+1).padStart(2,'0')}.png` });
    console.log(`V2 section ${i+1} at y=${positions[i]}`);
  }
  
  await browser.close();
  console.log('DONE');
})();
