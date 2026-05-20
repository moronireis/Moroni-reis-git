import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function generatePDF() {
  console.log('Launching browser...');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set desktop viewport
  await page.setViewportSize({ width: 1440, height: 900 });

  // Load the local HTML file
  const htmlPath = join(__dirname, 'index-pdf.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });

  // Wait for fonts to load
  await page.waitForTimeout(3000);

  console.log('Generating PDF...');
  await page.pdf({
    path: join(__dirname, 'Priscilla-Andrade-Media-Kit-2026.pdf'),
    width: '1440px',
    height: '810px',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
  });

  console.log('PDF generated: Priscilla-Andrade-Media-Kit-2026.pdf');
  await browser.close();
}

generatePDF().catch(console.error);
