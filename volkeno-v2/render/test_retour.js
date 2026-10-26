// Vérifie que revenir en arrière dans la timeline (boucle, navigation) donne exactement la même image qu'en avançant.
const { chromium } = require('playwright');
const { ouvrir } = require('./serveur');
(async () => {
  const { browser, page } = await ouvrir(chromium);
  const shot = async t => { await page.evaluate(t => window.__fil.seek(t), t); return await page.screenshot({ type: 'png' }); };
  const instants = [0, 2.0, 4.8, 7.6, 10.6, 13.6, 15.9, 19.6, 23.4, 27.8, 30.2, 31.8, 34.2, 37.8, 44.9];
  const avant = {};
  for (const t of instants) avant[t] = await shot(t);          // passage 1 : en avançant
  const res = [];
  for (const t of instants.slice().reverse()) { const b = await shot(t); res.push([t, Buffer.compare(avant[t], b) === 0]); }   // passage 2 : en reculant
  await page.evaluate(() => window.__fil.seek(44.96));
  for (const t of instants) { const b = await shot(t); res.push(['boucle ' + t, Buffer.compare(avant[t], b) === 0]); }      // passage 3 : après un tour complet
  const ko = res.filter(r => !r[1]);
  console.log(ko.length ? 'DIFFÉRENCES : ' + ko.map(r => r[0]).join(', ') : 'identique dans les 3 sens (' + res.length + ' comparaisons)');
  await browser.close();
})();
