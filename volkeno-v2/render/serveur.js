// Ouvre la page dans Chromium (Playwright) en servant tout en local : aucune requête réseau réelle.
const fs = require('fs'), path = require('path');
const RACINE = path.resolve(__dirname, '..');
const SRC = path.join(RACINE, 'src'), VENDOR = path.join(RACINE, 'vendor');
const ORIGINE = 'http://volkeno.local/';

function pageComplete() {
  return '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body style="margin:0">'
    + fs.readFileSync(path.join(SRC, 'index.html'), 'utf8') + '</body></html>';
}
const type = f => ({ '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.woff2': 'font/woff2', '.html': 'text/html' })[path.extname(f)] || 'application/octet-stream';

async function ouvrir(chromium) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const bloquees = [];
  page.on('console', m => { if (m.type() === 'error') console.log('console :', m.text()); });
  page.on('pageerror', e => console.log('erreur page :', e.message));
  await page.route('**/*', route => {
    const url = route.request().url();
    let fichier = null;
    if (url === ORIGINE) return route.fulfill({ status: 200, contentType: 'text/html', body: pageComplete() });
    if (url.startsWith(ORIGINE)) fichier = path.join(SRC, decodeURIComponent(url.slice(ORIGINE.length)));
    else if (url.includes('cdnjs.cloudflare.com/ajax/libs/gsap/')) fichier = path.join(VENDOR, path.basename(url));
    else if (url.includes('cdn.jsdelivr.net/npm/qrcode-generator')) fichier = path.join(VENDOR, 'qrcode.js');
    else if (url.startsWith('https://fonts.googleapis.com/')) fichier = path.join(VENDOR, 'fonts', 'fonts.css');
    else if (url.startsWith('https://fonts.gstatic.com/')) fichier = path.join(VENDOR, 'fonts', url.replace('https://fonts.gstatic.com/', '').replace(/\//g, '_'));
    if (fichier && fs.existsSync(fichier)) return route.fulfill({ status: 200, contentType: type(fichier), body: fs.readFileSync(fichier) });
    bloquees.push(url);
    return route.abort();
  });
  await page.goto(ORIGINE);
  await page.evaluate(() => window.__fil.render());
  await page.evaluate(() => window.__fil.ready);
  const polices = await page.evaluate(() => [...new Set(Array.from(document.fonts).filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight))]);
  return { browser, page, bloquees, polices };
}
module.exports = { ouvrir, RACINE };
