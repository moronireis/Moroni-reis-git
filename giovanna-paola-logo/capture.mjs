import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

const exportPath = join(__dirname, 'export.html');
await page.goto(`file://${exportPath}`, { waitUntil: 'networkidle0' });

// Wait for font to load
await page.waitForFunction(() => document.fonts.ready);
await new Promise(r => setTimeout(r, 1000));

const outputPath = join(process.env.HOME, 'Downloads', 'giovanna-paola-compacto.png');
await page.screenshot({ path: outputPath, type: 'png' });

console.log(`Saved: ${outputPath}`);
await browser.close();
