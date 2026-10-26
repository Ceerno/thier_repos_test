// Captures de contrôle + vérifications de mise en page (zone de sécurité, débordements, tailles de texte).
// Usage : node render/controle.js
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const { ouvrir, RACINE } = require('./serveur');
const DOSSIER = path.join(RACINE, 'controle');
const INSTANTS = [
  [0.3, '00-transition-boucle'], [1.4, '01-vous-produisez-local'], [2.6, '02-produits'], [4.8, '03-plus-loin'],
  [7.6, '04-commandes-dispersees'], [10.6, '05-stocks'], [13.6, '06-taches-repetitives'], [15.9, '07-vos-outils'],
  [17.7, '08-avant-commandes'], [19.9, '09-apres-commandes'], [21.7, '10-avant-stocks'], [23.9, '11-apres-tableau-de-bord'],
  [25.7, '12-avant-processus'], [28.2, '13-apres-automatisation'], [29.9, '14-logo'], [33.6, '15-signature'],
  [36.6, '16-conversion'], [44.9, '17-ecran-final']
];
(async () => {
  fs.mkdirSync(DOSSIER, { recursive: true });
  const { browser, page, bloquees, polices } = await ouvrir(chromium);
  const rapport = { polices, requetes_bloquees: bloquees, instants: [] };
  for (const [t, nom] of INSTANTS) {
    await page.evaluate(t => window.__fil.seek(t), t);
    await page.screenshot({ path: path.join(DOSSIER, nom + '.jpg'), type: 'jpeg', quality: 92 });
    const res = await page.evaluate(() => {
      const stage = document.getElementById('stage'), sr = stage.getBoundingClientRect();
      const zone = { g: 96, d: 1824, h: 54, b: 1026 };
      const visible = el => {
        let o = 1;
        for (let e = el; e && e !== stage; e = e.parentElement) {
          const cs = getComputedStyle(e);
          if (cs.visibility === 'hidden' || cs.display === 'none') return false;
          o *= parseFloat(cs.opacity);
        }
        if (o < .6) return false;
        const ln = el.closest('.ln');
        if (ln) { const a = el.getBoundingClientRect(), b = ln.getBoundingClientRect(); const inter = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); if (inter < a.height * .8) return false; }
        return true;
      };
      const sel = '.ln>span, .tag b, .tag span, .eyebrow, .chip-av, .chip-ap, .av-txt, .e5 p, .c5, .l5 b, .qr-t, .qr-u, .sig-eb, .exemple, .pcard span';
      const textes = [], problemes = [];
      document.querySelectorAll(sel).forEach(el => {
        if (!visible(el)) return;
        const r = el.getBoundingClientRect();
        const b = { x: r.left - sr.left, y: r.top - sr.top, r: r.right - sr.left, bas: r.bottom - sr.top };
        // taille de caractère réellement affichée (transformations comprises)
        const fs = parseFloat(getComputedStyle(el).fontSize) * (r.height / (el.offsetHeight || r.height));
        const txt = el.textContent.trim().slice(0, 48);
        textes.push({ txt, taille: Math.round(fs), boite: [b.x, b.y, b.r, b.bas].map(Math.round) });
        if (b.x < zone.g - 1 || b.r > zone.d + 1 || b.y < zone.h - 1 || b.bas > zone.b + 1) problemes.push('hors zone de sécurité : « ' + txt + ' » ' + JSON.stringify([b.x, b.y, b.r, b.bas].map(Math.round)));
        if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== 'visible') problemes.push('texte coupé : « ' + txt + ' »');
      });
      // chevauchement texte / QR code et texte / fenêtres d'interface
      const zones = ['#qr5', '#win', '#phC'].map(s => document.querySelector(s)).filter(e => e && visible(e)).map(e => { const r = e.getBoundingClientRect(); return { s: e.id, x: r.left - sr.left, y: r.top - sr.top, r: r.right - sr.left, b: r.bottom - sr.top }; });
      textes.forEach(t => zones.forEach(z => {
        const [x, y, r, b] = t.boite;
        const dedans = document.querySelector('#' + z.s).contains([...document.querySelectorAll(sel)].find(e => e.textContent.trim().slice(0, 48) === t.txt) || null);
        if (!dedans && x < z.r && r > z.x && y < z.b && b > z.y) problemes.push('chevauchement : « ' + t.txt + ' » / #' + z.s);
      }));
      return { textes, problemes, qr: window.__qr };
    });
    rapport.instants.push({ t, nom, ...res });
    console.log(String(t).padStart(5), nom.padEnd(26), res.problemes.length ? '⚠ ' + res.problemes.join(' | ') : 'ok', '· plus petit texte :', Math.min(...res.textes.map(x => x.taille)) + ' px');
  }
  fs.writeFileSync(path.join(DOSSIER, 'controle.json'), JSON.stringify(rapport, null, 2));
  await browser.close();
  if (bloquees.length) console.log('requêtes bloquées :', bloquees);
})();
