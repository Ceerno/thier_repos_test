# Compte rendu — V2.1 (optimisation ciblée)

Fichier livré : `export/volkeno-consommer-local-v2.1.mp4` (45 s, 1920×1080, H.264, 25 i/s, sans son). La V2 reste dans `export/` pour comparaison.

## Ce qui a changé

1. **Accroche plus imposante.**
   - « LOCAL ? » et « PLUS LOIN ? » passent de 150 px à près de 300 px, en turquoise avec halo, et entrent avec un rebond.
   - Les produits sont présentés sur six grandes cartes à fonds clairs (contraste fort sur le bleu nuit) qui flottent doucement.
2. **Problèmes plus lisibles.** Les sous-titres sont supprimés : une seule idée par écran. Les titres passent à 108–124 px, et les illustrations sont légèrement réduites pour leur laisser la place.
3. **Démonstrations en avant → après.**
   - Chaque problème de la séquence 2 reçoit sa solution : commandes dispersées → **centralisées**, stocks suivis manuellement → **tableau de bord**, processus répétitifs → **opérations automatisées**.
   - La situation « avant » s'affiche, puis le Fil turquoise la balaie pour révéler l'interface « après ». Le texte « avant » est barré.
   - Le catalogue mobile est remplacé par une démonstration d'automatisation (facture, stock, livraison et SMS cochés seuls, « Saisies manuelles : 0 »). Elle répond directement au problème « tâches répétitives ».
4. **Signature mise en majesté.** Le message intermédiaire est retiré pour donner 4 s pleines à « LE DIGITAL AUSSI SE CONSOMME LOCAL. ». « LOCAL. » fait 240 px avec un halo, et les six produits locaux sont reliés par le Fil sous la signature.
5. **Conversion réécrite.**
   - Message principal : « ET SI ON PARLAIT DE VOTRE ENTREPRISE ? ».
   - Message secondaire : « NOTRE ÉQUIPE VOUS ATTEND SUR LE STAND. ».
   - QR « SCANNEZ POUR DEMANDER UN DEVIS » visible et immobile pendant les 10 dernières secondes.
   - Le halo et les coins de la carte respirent pour éviter un écran figé.
6. **Boucle plus douce.** L'aplat turquoise plein écran est remplacé par un balayage du Fil sur l'écran final. L'écart entre la dernière et la première image (0,24) équivaut à celui de deux images ordinaires.

Conservés :
- l'identité bleu nuit et turquoise ;
- le format, la durée et le rythme des séquences ;
- les illustrations des problèmes ;
- les tableaux de commandes et de stocks ;
- l'assemblage du logo ;
- le QR et son URL officielle.

## Tests effectués

- **Caractéristiques du fichier :** 45,000 s, 1125 images, 1920×1080, H.264 High 4.1, 25 i/s.
- **Captures :** 18 images de contrôle, à retrouver dans `controle/` et sur la planche `planche-controle.jpg`.
- **Lisibilité et chevauchements :** aucun texte coupé ni superposé. Un seul signalement, une carte en sortie animée à 4,8 s (voulu).
- **Fluidité :** analyse des 1125 images. Les transitions trop sèches à 21, 25 et 29 s ont été adoucies. La plus longue immobilité est de 1 s.
- **QR :** décodé sur 22 images sur 22 de la séquence finale et sur l'image de boucle. L'URL lue est **identique** à https://volkeno.com/demander-un-devis. Il se lit encore réduit à 15 % et vu de biais.
- **Boucle :** la première image est identique à la dernière. Les images sont identiques en avançant, en reculant et après un tour.

Reste à faire avant le salon : scanner le QR avec un téléphone pour confirmer que le formulaire s'ouvre, puis regarder la vidéo sur l'écran réel.
