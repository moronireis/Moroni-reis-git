import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });

  // --- BALBIGUGA sections ---
  const ctx1 = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
    isMobile: true,
  });
  const p1 = await ctx1.newPage();
  await p1.goto('https://360link.bio/balbiguga/', { waitUntil: 'networkidle', timeout: 20000 }).catch(() => {});
  await p1.waitForTimeout(3000);
  
  const height1 = await p1.evaluate(() => document.body.scrollHeight);
  console.log(`Balbiguga total height: ${height1}px`);
  
  // Take viewport-sized clips at different scroll positions
  const sections = [0, 844, 1688, 2532, 3376, 4220, 5064, 5908, 6752, 7596, 8440, 9284, 10128, 10972];
  for (let i = 0; i < sections.length; i++) {
    const y = sections[i];
    if (y >= height1) break;
    await p1.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await p1.waitForTimeout(500);
    await p1.screenshot({ path: `_screenshots/balbi-section-${String(i+1).padStart(2,'0')}.png` });
    console.log(`Balbi section ${i+1} at y=${y}`);
  }
  await ctx1.close();

  // --- EDENS sections ---
  const ctx2 = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
    isMobile: true,
  });
  const p2 = await ctx2.newPage();
  await p2.goto('https://edens.academy/bio/', { waitUntil: 'networkidle', timeout: 20000 }).catch(() => {});
  await p2.waitForTimeout(3000);
  
  const height2 = await p2.evaluate(() => document.body.scrollHeight);
  console.log(`Edens total height: ${height2}px`);
  
  const edenSections = [0, 844, 1688, 2532];
  for (let i = 0; i < edenSections.length; i++) {
    const y = edenSections[i];
    if (y >= height2) break;
    await p2.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await p2.waitForTimeout(500);
    await p2.screenshot({ path: `_screenshots/eden-section-${String(i+1).padStart(2,'0')}.png` });
    console.log(`Eden section ${i+1} at y=${y}`);
  }
  await ctx2.close();

  await browser.close();
  console.log('DONE');
})();
