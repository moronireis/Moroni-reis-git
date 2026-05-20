const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
  console.log('Launching...');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1440, height: 810 });
  
  const htmlPath = path.join(__dirname, 'index-pdf-landscape-backup.html');
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(3000);
  
  const pdfPath = path.join(__dirname, 'mediakit-landscape.pdf');
  await page.pdf({
    path: pdfPath,
    width: '1440px',
    height: '810px',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
  });
  
  const size = fs.statSync(pdfPath).size;
  console.log('Done!', (size/1024/1024).toFixed(1), 'MB');
  await browser.close();
}

generatePDF().catch(console.error);
