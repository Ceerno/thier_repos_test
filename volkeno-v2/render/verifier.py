"""Vérifie la vidéo exportée : caractéristiques techniques, QR code lu sur des images extraites de la vidéo, boucle.
Usage : python3 render/verifier.py [export/volkeno-consommer-local-v2.mp4]"""
import json, re, subprocess, sys, io
from pathlib import Path
from PIL import Image
import zxingcpp

RACINE = Path(__file__).resolve().parent.parent
VIDEO = Path(sys.argv[1]) if len(sys.argv) > 1 else RACINE / 'export' / 'volkeno-consommer-local-v2.mp4'
ATTENDU = re.search(r"qrUrl:\s*'([^']+)'", (RACINE / 'src' / 'index.html').read_text(encoding='utf-8')).group(1)

def sonde():
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries',
                          'format=duration,size,bit_rate:stream=codec_type,codec_name,profile,level,width,height,pix_fmt,r_frame_rate,nb_frames',
                          '-of', 'json', str(VIDEO)], capture_output=True, text=True, check=True).stdout
    return json.loads(out)

def image(t):
    png = subprocess.run(['ffmpeg', '-loglevel', 'error', '-ss', f'{t:.3f}', '-i', str(VIDEO), '-frames:v', '1', '-f', 'image2pipe', '-c:v', 'png', '-'],
                         capture_output=True, check=True).stdout
    return Image.open(io.BytesIO(png)).convert('RGB')

def lire(img):
    r = zxingcpp.read_barcodes(img)
    return [x.text for x in r if 'QR' in str(x.format)]

def _coeffs(sortie, entree):
    # coefficients de Image.PERSPECTIVE (point de sortie -> point source), résolution d'un système 8×8
    m = []
    for (x, y), (u, v) in zip(sortie, entree):
        m.append([x, y, 1, 0, 0, 0, -u * x, -u * y, u])
        m.append([0, 0, 0, x, y, 1, -v * x, -v * y, v])
    n = 8
    for i in range(n):
        p = max(range(i, n), key=lambda r: abs(m[r][i])); m[i], m[p] = m[p], m[i]
        for r in range(n):
            if r != i:
                f = m[r][i] / m[i][i]
                m[r] = [a - f * b for a, b in zip(m[r], m[i])]
    return [m[i][8] / m[i][i] for i in range(n)]

def perspective(img, k):
    # écran vu de biais : largeur apparente réduite à k et bord droit plus court (point de fuite)
    w, h = img.size
    sortie = [(0, 0), (w * k, h * .08), (w * k, h * .92), (0, h)]
    c = _coeffs(sortie, [(0, 0), (w, 0), (w, h), (0, h)])
    return img.transform((w, h), Image.PERSPECTIVE, c, Image.BICUBIC, fillcolor=(11, 17, 32))

info = sonde()
v = next(s for s in info['streams'] if s['codec_type'] == 'video')
a = [s for s in info['streams'] if s['codec_type'] == 'audio']
num, den = map(int, v['r_frame_rate'].split('/'))
res = {'fichier': VIDEO.name, 'duree_s': round(float(info['format']['duration']), 3), 'taille_octets': int(info['format']['size']),
       'video': {'codec': v['codec_name'], 'profil': v.get('profile'), 'niveau': v.get('level'), 'resolution': f"{v['width']}×{v['height']}",
                 'pixels': v['pix_fmt'], 'images_par_seconde': num / den, 'images': int(v.get('nb_frames', 0))},
       'audio': [{'codec': s['codec_name']} for s in a], 'qr_attendu': ATTENDU, 'qr': [], 'qr_distance': [], 'qr_biais': []}

# 1. lecture du QR sur des images de la séquence finale (35 → 45 s) et sur la première image de la boucle
for t in [0.0, 35.0, 36.0, 38.0, 40.0, 42.0, 44.0, 44.96]:
    txt = lire(image(t))
    res['qr'].append({'t': t, 'lu': txt[0] if txt else None, 'ok': bool(txt) and txt[0] == ATTENDU})

# 2. simulation de distance : image réduite (le QR occupe moins de pixels, comme vu de plus loin)
ref = image(44.0)
for f in [1.0, .5, .35, .25, .2, .15]:
    im = ref.resize((round(1920 * f), round(1080 * f)), Image.LANCZOS) if f < 1 else ref
    txt = lire(im)
    res['qr_distance'].append({'echelle': f, 'largeur_qr_px': round(518 * f), 'ok': bool(txt) and txt[0] == ATTENDU})

# 3. écran vu de biais
for k in [.85, .7, .55]:
    txt = lire(perspective(ref.resize((960, 540), Image.LANCZOS), k))
    res['qr_biais'].append({'compression_horizontale': k, 'ok': bool(txt) and txt[0] == ATTENDU})

# 4. boucle : première et dernière image
f0 = image(0.0).resize((192, 108)).convert('L'); f1 = image(res['duree_s'] - 1 / 25).resize((192, 108)).convert('L')
res['boucle_ecart_moyen_sur_255'] = round(sum(abs(x - y) for x, y in zip(f0.tobytes(), f1.tobytes())) / (192 * 108), 3)

(RACINE / 'controle').mkdir(exist_ok=True)
(RACINE / 'controle' / 'verification.json').write_text(json.dumps(res, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(res, ensure_ascii=False, indent=2))
