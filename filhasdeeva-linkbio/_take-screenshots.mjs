import { chromium } from 'playwright';

const pages = [
  { name: '01-balbiguga-360link', url: 'https://360link.bio/balbiguga/', mobile: true },
  { name: '02-edens-bio', url: 'https://edens.academy/bio/?utm_source=ig&utm_medium=social&utm_content=link_in_bio', mobile: true },
  { name: '03-demo-atual', url: `file://${process.cwd()}/index.html`, mobile: true },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  for (const p of pages) {
    try {
      const ctx = await browser.newContext({
        viewport: { width: 390, height: 844 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        isMobile: p.mobile,
      });
      const page = await ctx.newPage();
      await page.goto(p.url, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
      
      // Wait for content to load
      await page.waitForTimeout(2000);
      
      // Take full page screenshot
      await page.screenshot({
        path: `_screenshots/${p.name}.png`,
        fullPage: true,
      });
      
      console.log(`OK: ${p.name}`);
      await ctx.close();
    } catch (e) {
      console.log(`FAIL: ${p.name} — ${e.message}`);
    }
  }
  
  await browser.close();
  console.log('DONE');
})();
