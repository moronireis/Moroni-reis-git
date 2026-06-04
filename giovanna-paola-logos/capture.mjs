import { chromium } from 'playwright';
import path from 'path';

const variants = [
  {
    name: 'giovanna-paola-v7-dark.png',
    textFill: '#1a1a1a',
    subFill: '#9C958F',
  },
  {
    name: 'giovanna-paola-v7-white.png',
    textFill: '#ffffff',
    subFill: '#ffffff',
  },
  {
    name: 'giovanna-paola-v7-rose.png',
    textFill: '#DBA99F',
    subFill: '#DBA99F',
  },
];

const browser = await chromium.launch();

for (const v of variants) {
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Montserrat:wght@400;500&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; }
  body { background: transparent; }
</style>
</head>
<body>
<svg width="1600" height="500" viewBox="0 0 520 160" xmlns="http://www.w3.org/2000/svg">
  <text x="260" y="65" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-size="48" font-weight="300" letter-spacing="2.5" fill="${v.textFill}">GIOVANNA PAOLA</text>
  <line x1="110" y1="82" x2="410" y2="82" stroke="#DBA99F" stroke-width="0.5"/>
  <text x="260" y="108" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="12" font-weight="500" letter-spacing="4.5" fill="${v.subFill}">GESTÃO DE EVENTOS</text>
</svg>
</body>
</html>`;

  const page = await browser.newPage();
  await page.setContent(html);
  await page.waitForTimeout(2000);
  await page.setViewportSize({ width: 1600, height: 500 });

  const el = await page.locator('svg');
  await el.screenshot({
    path: path.join('/Users/moronireis/Downloads', v.name),
    omitBackground: true,
  });
  console.log(`Saved ${v.name}`);
  await page.close();
}

await browser.close();
console.log('Done — 3 files saved to ~/Downloads/');
