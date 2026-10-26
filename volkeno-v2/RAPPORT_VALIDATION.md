# Rapport de validation — volkeno-consommer-local-v2.mp4

Les contrôles ont été faits automatiquement : `render/controle.js`, `render/test_retour.js` et `render/verifier.py`. Les résultats bruts sont dans `controle/controle.json` et `controle/verification.json`.

## 1. Caractéristiques techniques (mesurées sur le fichier exporté)

| Élément | Résultat |
|---|---|
| Durée réelle | **45,000 s** (1125 images) |
| Résolution | **1920 × 1080** (16:9) |
| Codec vidéo | **H.264**, profil High, niveau 4.1, yuv420p |
| Fréquence d'images | **25 i/s** |
| Audio | Piste AAC muette, ajoutée pour les lecteurs de salon qui refusent les fichiers sans son. La vidéo reste silencieuse |
| Taille | ≈ 7,4 Mo |
| Dépendances à la lecture | Aucune : MP4 autonome, aucun accès réseau |

## 2. QR code

- **Contenu :** `https://volkeno.com/demander-un-devis`, généré par une vraie bibliothèque d'encodage (qrcode-generator). Il est relu automatiquement.
- **Format :** version 3 (29 × 29 modules), correction d'erreur M, modules noirs sur fond blanc, marge de 4 modules, 14 px par module (taille entière, donc aucun flou), 518 × 518 px à l'écran.
- **Lecture sur des images extraites de la vidéo finale :** décodé correctement à **0 s, 35 s, 36 s, 38 s, 40 s, 42 s, 44 s et 44,96 s**, soit **8 sur 8**.
- **Simulation de distance** (image réduite) : lu à 100 %, 50 %, 35 %, 25 %, 20 % et 15 % de la taille, c'est-à-dire jusqu'à un QR de 78 px de large. **6 sur 6.**
- **Écran vu de biais** (perspective, largeur apparente réduite à 85 %, 70 % et 55 %) : **3 sur 3.**
- **Lien lisible sous le QR :** « volkeno.com/demander-un-devis » (28 px).

**Pourquoi l'URL sans paramètres de suivi :** le brief demande de n'utiliser l'URL avec paramètres UTM que si elle est compatible avec le formulaire et l'outil de mesure. volkeno.com ne répond pas depuis l'environnement de production, ce qui rend la vérification impossible. J'ai donc gardé l'URL officielle, qui donne aussi un QR plus simple et plus facile à lire de loin. Pour passer à l'URL de suivi, remplacez `qrUrl` dans `src/index.html` (la ligne est prête en commentaire), puis relancez le rendu et la vérification.

**Distance de scan (estimation) :** sur un écran de 55 pouces (≈ 68 cm de haut), le QR mesure environ 33 cm. Avec un smartphone courant, la lecture est confortable jusqu'à 2 à 3 m. Au-delà, le visiteur doit s'approcher du stand, ce qui est justement le but.

## 3. Lisibilité et mise en page

Taille des textes à l'écran (sur 1080 px de haut), mesurée sur 14 images de contrôle :

| Séquence | Message principal | Texte secondaire le plus petit |
|---|---|---|
| Accroche | 140–150 px | 26 px (noms de produits) |
| Problèmes | 100–104 px | 30 px (bandeau de marque) |
| Transformation | 84–124 px | 40 px (phrases d'explication). Les mentions « Exemple d'interface » (20 px) et le contenu des interfaces sont volontairement discrets : ils ne sont pas nécessaires à la compréhension |
| Volkeno | 80–130 px | 40 px (« Basés à Dakar. ») |
| Conversion | 102 px | 28 px (lien sous le QR) |

- **Zone de sécurité** (90 %, marges de 96 px et 54 px) : **aucun texte hors zone** sur les 14 images.
- **Texte coupé ou débordant :** aucun.
- **Chevauchement texte / QR code / interfaces :** aucun.
- **Titres :** chaque titre est réduit automatiquement s'il dépasse sa largeur maximale, ce qui évite qu'il soit coupé si un message est modifié.
- **Polices :** Montserrat, Inter et Caveat, chargées en local pour le rendu. Aucune police de remplacement n'a été utilisée.
- **Effets :** aucun clignotement rapide, aucun glitch, aucun zoom agressif. Seul le léger flou de mouvement de l'assemblage du logo (0,7 s) est volontaire.

## 4. Boucle

- **Première image (0 s) et dernière image (44,96 s) :** écart moyen de **0,14 sur 255**, autrement dit identiques à l'œil.
- **Retour arrière :** les 15 instants de référence donnent exactement les mêmes pixels en avançant, en reculant et après un tour complet de boucle (30 comparaisons). C'est ce qui garantit une animatique fiable quand on navigue ou qu'elle boucle dans le navigateur.

## 5. Règle des cinq secondes (évaluation critique)

**Test 1 — 5 secondes : réussi.**
- De 0,8 s à 28,7 s, le bandeau « Volkeno | Solutions numériques pour les entreprises locales » est toujours visible, avec un message qui parle aux entreprises locales (« Vous produisez local ? », un problème concret ou une solution).
- De 29 à 35 s, le logo et « Des solutions numériques adaptées à votre activité » (dès 30,65 s), puis la signature.
- De 35 à 45 s, « Parlons-en sur notre stand » et le QR « demander un devis ».
- Point le plus faible : la fenêtre 29,0–30,6 s, où seul le logo s'assemble. Elle reste à moins de 5 s du message suivant.

**Test 2 — 20 secondes : réussi.** Toute fenêtre de 20 s contient au moins un problème complet (3 s) ou une transformation complète (4 s) avec son bénéfice écrit.

**Test 3 — 45 secondes : réussi.** Le spectateur sait :
- **ce que fait Volkeno :** des outils numériques sur mesure (centraliser les commandes, piloter stocks et activité, vendre en ligne) ;
- **pourquoi c'est pour lui :** il a reconnu un de ses problèmes ;
- **comment rencontrer l'équipe :** « Parlons-en sur notre stand », « Notre équipe est là pour vous écouter », les téléphones ;
- **comment demander un devis :** le QR et le lien écrit.

## 6. Limitations

1. **Sources externes inaccessibles :** volkeno.com, le formulaire de devis et consommerlocal.sn/fr/programme ne se résolvent pas depuis l'environnement de production. Je n'ai donc pas pu vérifier en ligne que le formulaire existe ni que les paramètres UTM sont compatibles, et le programme officiel n'a pas été consulté. **Aucune information sur l'événement n'a été inventée.** À faire avant le salon : scanner le QR avec un téléphone et vérifier que le formulaire s'ouvre.
2. **Pas de captures réelles dans le projet :** le dépôt ne contenait ni capture d'écran ni réalisation client. Les interfaces sont des démonstrations conçues pour la vidéo, signalées « Exemple d'interface ». Les noms (A. Diop, M. Fall…) et les montants sont des données d'exemple. Si vous avez des captures réelles autorisées, vous pouvez les intégrer dans les fenêtres d'interface.
3. **Illustrations :** les produits et les personnages sont des illustrations vectorielles, pas des photos. Des photos réelles d'entreprises locales, dont vous détenez les droits, renforceraient la crédibilité de l'accroche.
4. **Couleurs :** bleu nuit et turquoise repris de la V1. Les couleurs du logo (corail, turquoise, orange) ont été estimées à partir d'une photo du kakémono, faute de charte officielle dans le projet.
5. **Téléphones :** +221 76 626 35 68 et 77 112 64 34, tels que fournis. Les fichiers de la V1 contiennent encore l'ancien numéro (33 827 67 91) : ne plus les utiliser.
6. **Distances de lecture et de scan :** ce sont des estimations pour un écran de 55 pouces. À confirmer sur l'écran réel du stand, de face et de biais.
