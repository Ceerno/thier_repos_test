// Rendu image par image (timeline GSAP positionnée exactement) puis encodage H.264 avec FFmpeg.
// Usage : node render/rendu.js [sortie.mp4] [images/s]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const { ouvrir, RACINE } = require('./serveur');
const SORTIE = process.argv[2] || path.join(RACINE, 'export', 'volkeno-consommer-local-v2.1.mp4');
const FPS = +(process.argv[3] || 25);
(async () => {
  const { browser, page, bloquees, polices } = await ouvrir(chromium);
  console.log('polices :', polices.join(', '));
  const duree = await page.evaluate(() => window.__fil.duree);
  const total = Math.round(duree * FPS);
  // piste audio muette : certains lecteurs de salon refusent les fichiers sans piste son
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y',
    '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
    '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
    '-map', '0:v', '-map', '1:a', '-shortest',
    '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.1', '-preset', 'slow', '-crf', '16', '-tune', 'animation',
    '-pix_fmt', 'yuv420p', '-r', String(FPS), '-g', String(FPS * 2),
    '-c:a', 'aac', '-b:a', '64k', '-movflags', '+faststart', SORTIE], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = 0; f < total; f++) {
    await page.evaluate(t => window.__fil.seek(t), f / FPS);
    const img = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(img)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 250 === 0) console.log('image', f, '/', total, ((Date.now() - t0) / 1000).toFixed(0) + ' s');
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  if (bloquees.length) console.log('requêtes bloquées :', bloquees);
  console.log('terminé :', SORTIE, 'en', ((Date.now() - t0) / 1000).toFixed(0), 's');
})();
