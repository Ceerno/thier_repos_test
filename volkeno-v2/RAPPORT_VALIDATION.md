# Rapport de validation — volkeno-consommer-local-v2.1.mp4

Les contrôles ont été faits automatiquement : `render/controle.js`, `render/test_retour.js` et `render/verifier.py`. Les résultats bruts sont dans `controle/controle.json` et `controle/verification.json`.

## 1. Caractéristiques techniques (mesurées sur le fichier exporté)

| Élément | Résultat |
|---|---|
| Durée réelle | **45,000 s** (1125 images) |
| Résolution | **1920 × 1080** |
| Codec | **H.264**, profil High, niveau 4.1, yuv420p |
| Fréquence | **25 i/s** |
| Audio | Piste AAC muette, pour la compatibilité avec les lecteurs de salon |
| Lecture | MP4 autonome, aucune dépendance réseau |

## 2. QR code

- **URL encodée :** `https://volkeno.com/demander-un-devis`. Version 3, correction M, modules noirs sur fond blanc, marge de 4 modules, 518 px, 14 px par module.
- **Lecture sur des images du MP4 final :** 22 sur 22, à 0 s, puis toutes les 0,5 s de 35,0 à 44,5 s, puis à 44,96 s. **L'URL lue est identique à l'URL officielle.**
- **Visibilité :** entièrement visible, immobile et net de 35,0 s à la fin de la boucle. Aucun effet ne touche les modules : seuls le halo extérieur et les coins de la carte bougent.
- **Robustesse :** lu à 100 %, 50 %, 35 %, 25 %, 20 % et 15 % de la taille de l'image, et vu de biais (largeur apparente à 85 %, 70 % et 55 %).

## 3. Lisibilité (taille à l'écran, sur 1080 px de haut)

| Séquence | Message principal | Plus petit texte affiché |
|---|---|---|
| Accroche | **300 px** (« LOCAL ? »), 274 px (« PLUS LOIN ? ») | 27 px (noms des produits) |
| Problèmes | 108–124 px | 30 px (bandeau de marque) |
| Avant / après | Titre « après » de 104–108 px ; texte « avant » de 44–50 px | 20 px (« Exemple d'interface », volontairement discret) |
| Signature | **241 px** (« LOCAL. ») | 40 px (« Basés à Dakar. ») |
| Conversion | 112 px | 28 px (lien sous le QR) |

**Mise en page :** sur 18 images de contrôle, aucun texte n'est coupé ou superposé. Le seul signalement de zone de sécurité, à 4,8 s, vient d'une carte produit en train de sortir de l'écran pendant son animation de sortie, ce qui est voulu.

## 4. Fluidité

Écart moyen entre images consécutives, sur les 1125 images, en niveaux de gris sur 255 :

- **Écarts :** médiane 0,23 ; 95ᵉ centile 9,3 ; maximum 20,1.
- **Écarts les plus forts :** ils correspondent tous à des mouvements voulus et non à des coupures : entrée de la carte QR (34,8 s), sortie des produits (5,2 s), passage de la question à l'« avant » (17,0 s).
- **Correction faite pendant le contrôle :** les sorties de fenêtre d'interface à 21, 25 et 29 s accéléraient trop sur leur dernière image (écart d'environ 21). Leur courbe d'animation a été adoucie.
- **Plus longue immobilité :** 1,0 s, contre 4 s avant correction dans la séquence de conversion.

## 5. Transition de boucle

- **Dernière image (44,96 s) → première image (0 s) :** écart de **0,24**, du même ordre que deux images ordinaires (médiane 0,23). Il n'y a pas de coupure visible.
- La première image reproduit exactement l'écran final, puis le Fil turquoise le balaie en 0,6 s.
- **Retour arrière :** les 15 instants de référence donnent les mêmes pixels en avançant, en reculant et après un tour de boucle (30 comparaisons).

## 6. Règle des cinq secondes

**5 secondes : réussi.**
- De 0,9 à 28,7 s, le bandeau Volkeno accompagne un message très grand : « LOCAL ? », un problème, ou un titre « après ».
- De 29 à 35 s : logo et signature.
- De 35 à 45 s : « Et si on parlait de votre entreprise ? » et le QR.

**20 secondes : réussi.** Toute fenêtre de 20 s contient au moins un problème complet et sa solution, ou une solution et la conversion.

**45 secondes : réussi.** Le spectateur a vu les trois problèmes, leurs trois solutions, la signature, comment venir sur le stand (équipe, téléphones) et comment demander un devis (QR et lien).

## 7. Limites

- Je n'ai pas pu vérifier en ligne le formulaire volkeno.com/demander-un-devis : le domaine est inaccessible depuis l'environnement de production. **Scannez le QR avec un téléphone avant le salon.**
- Les interfaces et les données (noms, montants) sont des exemples, signalés comme tels.
- Les distances de lecture et de scan sont des estimations : à valider sur l'écran réel.
