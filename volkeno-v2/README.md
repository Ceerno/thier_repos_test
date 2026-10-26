# Volkeno — vidéo stand V2 (Mois du Consommer Local 2026)

Vidéo motion design de 45 s en boucle pour l'écran du stand. Elle est générée par programme : une page HTML/CSS animée avec GSAP, rendue image par image dans Chromium (Playwright), puis encodée en H.264 avec FFmpeg.

## Contenu

```
src/index.html          la vidéo : scènes, styles, animations et RÉGLAGES (en tête du script)
src/assets/             logo Volkeno découpé en calques (trait gauche, grand trait, trait du bas, mot) + symbole
vendor/                 GSAP, générateur de QR code et polices (Montserrat, Inter, Caveat) pour un rendu sans réseau
render/serveur.js       ouvre la page dans Chromium en servant tous les fichiers en local
render/rendu.js         rendu image par image → export/volkeno-consommer-local-v2.mp4
render/controle.js      14 captures de contrôle + vérification de la zone de sécurité, des débordements et des chevauchements
render/test_retour.js   vérifie que la boucle et la navigation donnent des images identiques
render/verifier.py      caractéristiques du MP4, lecture du QR code sur des images de la vidéo, test de la boucle
STORYBOARD.md           séquences et durées
RAPPORT_VALIDATION.md   résultats des contrôles et limites
controle/               captures et rapports JSON
export/                 vidéo finale
```

## Modifier la vidéo

Tout se règle dans `src/index.html`, dans le bloc `CONFIG` en tête du script :

- **Messages :** `CONFIG.textes`. `|` force un retour à la ligne et `*mot*` passe un mot en turquoise. Les titres trop longs sont réduits automatiquement pour tenir dans leur colonne.
- **QR code :** `CONFIG.qrUrl`. La variante avec paramètres de suivi est prête en commentaire. `qrCorrection` règle le niveau de correction d'erreur (L, M, Q, H) et `qrTaille` la taille.
- **Couleurs :** variables CSS en tête de la feuille de style : `--nuit` (fond), `--accent` (turquoise), `--corail`, `--orange`, etc.
- **Durées :** l'objet `T` donne le début de chaque séquence. Les animations sont placées par rapport à ces repères (`T.s3 + 2`, …). Si vous changez la durée d'une séquence, décalez aussi les repères suivants et `T.fin`.
- **Illustrations :** les produits sont des symboles SVG (`<symbol id="p-bissap">`, …) réutilisés partout. Les interfaces (commandes, stocks, catalogue) sont en HTML dans la séquence 3.
- **Logo :** remplacez les PNG de `src/assets/` par des fichiers de mêmes dimensions.

Pour prévisualiser, ouvrez la page dans un navigateur (avec internet pour GSAP et les polices). La barre du bas permet de lire, de naviguer, d'afficher la zone de sécurité et de passer en plein écran.

## Refaire l'export

Il faut Node 18 ou plus, FFmpeg et Python 3.

```bash
npm install                      # Playwright
npx playwright install chromium
pip install zxing-cpp pillow     # lecture du QR pour la vérification

npm run controle                 # captures et contrôles de mise en page
npm run rendu                    # → export/volkeno-consommer-local-v2.mp4 (≈ 3 min)
npm run verifier                 # QR, durée, codec, boucle → controle/verification.json
```

Le rendu n'utilise jamais le réseau : toutes les requêtes sont servies depuis `src/` et `vendor/`, les autres sont bloquées et listées.
