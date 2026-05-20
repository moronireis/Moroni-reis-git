import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  // ====== EXTRACT BALBIGUGA ======
  console.log('--- Extracting balbiguga ---');
  const ctx1 = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    isMobile: true,
  });
  const p1 = await ctx1.newPage();
  // Use domcontentloaded instead of networkidle — page has lots of resources
  await p1.goto('https://360link.bio/balbiguga/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await p1.waitForTimeout(8000); // Wait for JS rendering
  
  // Scroll to bottom to trigger lazy loading
  await p1.evaluate(async () => {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    for (let i = 0; i < document.body.scrollHeight; i += 300) {
      window.scrollTo(0, i);
      await delay(80);
    }
    window.scrollTo(0, 0);
  });
  await p1.waitForTimeout(3000);
  
  // Get full rendered HTML
  const html1 = await p1.content();
  writeFileSync('_extracted/balbiguga-full.html', html1);
  console.log(`balbiguga HTML: ${html1.length} chars`);
  
  // Get computed data
  const data1 = await p1.evaluate(() => {
    const data = {};
    
    // CSS from all stylesheets
    const sheets = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) sheets.push(rule.cssText);
      } catch(e) { sheets.push(`/* Cross-origin: ${sheet.href} */`); }
    }
    data.css = sheets.join('\n');
    
    // All links
    data.links = Array.from(document.querySelectorAll('a[href]')).map(a => ({
      href: a.href, text: a.textContent?.trim()?.substring(0, 100),
      class: a.className?.toString()?.substring(0, 80)
    }));
    
    // All images
    data.images = Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src?.substring(0, 250), alt: img.alt
    }));
    
    // Headings / section structure
    data.structure = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span,div'))
      .filter(el => el.textContent?.trim().length > 2 && el.textContent?.trim().length < 200 && el.children.length < 3)
      .map(el => ({ tag: el.tagName, text: el.textContent?.trim(), class: el.className?.toString()?.substring(0,80) }))
      .slice(0, 200);
    
    // Fonts
    const fonts = new Set();
    document.querySelectorAll('h1,h2,h3,h4,p,span,a,button,div').forEach(el => {
      const f = getComputedStyle(el).fontFamily;
      if (f) fonts.add(f.split(',')[0].trim().replace(/"/g,''));
    });
    data.fonts = Array.from(fonts);
    
    // Colors
    const colors = new Set();
    document.querySelectorAll('*').forEach(el => {
      const cs = getComputedStyle(el);
      [cs.color, cs.backgroundColor, cs.borderColor].forEach(c => {
        if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent' && c !== 'rgb(0, 0, 0)') colors.add(c);
      });
    });
    data.colors = Array.from(colors).slice(0, 60);
    
    return data;
  });
  
  writeFileSync('_extracted/balbiguga-styles.css', data1.css);
  writeFileSync('_extracted/balbiguga-data.json', JSON.stringify({
    links: data1.links, images: data1.images, structure: data1.structure,
    fonts: data1.fonts, colors: data1.colors
  }, null, 2));
  console.log(`CSS: ${data1.css.length} chars | Links: ${data1.links.length} | Images: ${data1.images.length} | Fonts: ${data1.fonts.join(', ')}`);
  await ctx1.close();

  // ====== EXTRACT EDENS BIO ======
  console.log('\n--- Extracting edens.academy/bio ---');
  const ctx2 = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    isMobile: true,
  });
  const p2 = await ctx2.newPage();
  await p2.goto('https://edens.academy/bio/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await p2.waitForTimeout(5000);
  await p2.evaluate(async () => {
    for (let i = 0; i < document.body.scrollHeight; i += 300) {
      window.scrollTo(0, i);
      await new Promise(r => setTimeout(r, 80));
    }
    window.scrollTo(0, 0);
  });
  await p2.waitForTimeout(2000);
  
  const html2 = await p2.content();
  writeFileSync('_extracted/edens-bio-full.html', html2);
  
  const data2 = await p2.evaluate(() => {
    const data = {};
    const sheets = [];
    for (const sheet of document.styleSheets) {
      try { for (const rule of sheet.cssRules) sheets.push(rule.cssText); } catch(e) {}
    }
    data.css = sheets.join('\n');
    data.links = Array.from(document.querySelectorAll('a[href]')).map(a => ({
      href: a.href, text: a.textContent?.trim()?.substring(0, 100)
    }));
    data.images = Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src?.substring(0, 250), alt: img.alt
    }));
    const fonts = new Set();
    document.querySelectorAll('*').forEach(el => {
      const f = getComputedStyle(el).fontFamily;
      if (f) fonts.add(f.split(',')[0].trim().replace(/"/g,''));
    });
    data.fonts = Array.from(fonts);
    const colors = new Set();
    document.querySelectorAll('*').forEach(el => {
      const cs = getComputedStyle(el);
      [cs.color, cs.backgroundColor].forEach(c => {
        if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') colors.add(c);
      });
    });
    data.colors = Array.from(colors).slice(0, 50);
    return data;
  });
  writeFileSync('_extracted/edens-bio-styles.css', data2.css);
  writeFileSync('_extracted/edens-bio-data.json', JSON.stringify(data2, null, 2));
  console.log(`HTML: ${html2.length} | CSS: ${data2.css.length} | Links: ${data2.links.length} | Fonts: ${data2.fonts.join(', ')}`);
  await ctx2.close();

  // ====== EXTRACT INSTAGRAM ======
  console.log('\n--- Extracting Instagram @filhasdeeva ---');
  const ctx3 = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const p3 = await ctx3.newPage();
  await p3.goto('https://www.instagram.com/filhasdeeva/?hl=pt-br', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  await p3.waitForTimeout(8000);
  
  const igData = await p3.evaluate(() => {
    return {
      title: document.title,
      metaDesc: document.querySelector('meta[name="description"]')?.content,
      ogImage: document.querySelector('meta[property="og:image"]')?.content,
      bodyText: document.body.innerText?.substring(0, 5000),
      images: Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src?.substring(0, 300), alt: img.alt?.substring(0, 300)
      })),
      links: Array.from(document.querySelectorAll('a[href]')).map(a => ({
        href: a.href?.substring(0, 200), text: a.textContent?.trim()?.substring(0, 100)
      }))
    };
  });
  writeFileSync('_extracted/instagram-filhasdeeva.json', JSON.stringify(igData, null, 2));
  await p3.screenshot({ path: '_extracted/instagram-profile-hires.png', fullPage: false });
  console.log(`Title: ${igData.title}`);
  console.log(`Meta: ${igData.metaDesc?.substring(0, 200)}`);
  console.log(`Images: ${igData.images.length}`);
  await ctx3.close();
  
  await browser.close();
  console.log('\nALL EXTRACTIONS DONE');
})();
