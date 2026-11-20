# Montage « Bébé ou pas bébé » : questions calées sur les réponses, photos animées au-dessus de la tête.
# Usage : python3 montage/monter.py   ->   montage/bebe-ou-pas-bebe.mp4
import subprocess, os, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "src")
OUT = os.path.join(HERE, "bebe-ou-pas-bebe.mp4")
W, H, FPS = 1080, 1920, 30
DUR = 41.73
FONT = "/usr/share/fonts/opentype/inter/Inter-Black.otf"
if not os.path.exists(FONT):
    FONT = "/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf"

# --- questions : (début, fin) dans la piste audio -> début dans la vidéo
CLIPS = [
    (1.00, 3.60, 0.85),    # « Ok Younes, on va faire le jeu bébé ou pas bébé »
    (4.40, 6.85, 6.40),    # « premier, Passine »
    (7.85, 9.00, 10.55),   # « compréhensible »
    (9.20, 10.30, 11.70),  # « deuxième, Popo »
    (12.68, 14.80, 14.95), # « troisième, Zemmour »
    (18.10, 22.30, 21.10), # « ok, quatrième, Martin Luther King, on est d'accord sur celle-là »
    (24.55, 27.20, 26.30), # « cinquième, Jeffrey Epstein »
    (30.55, 31.50, 32.60), # « sixième »
    (39.90, 41.35, 34.00), # « Adolphe Hitler »
]

# --- photos : (fichier, nom affiché, apparition, verdict, moment du verdict, disparition)
CARDS = [
    ("passine.jpg", "PASSINE", 8.20, "BÉBÉ", 9.10, 11.60),
    ("popo.png", "POPO", 12.10, "GROS BÉBÉ", 12.90, 15.60),
    ("zemmour.jpg", "ZEMMOUR", 16.30, "PAS BÉBÉ", 17.60, 20.70),
    ("mlk.jpg", "MARTIN LUTHER KING", 21.80, "BÉBÉ", 25.55, 26.50),
    ("epstein.webp", "JEFFREY EPSTEIN", 27.30, "GIGA MÉGA BÉBÉ", 29.30, 32.30),
    ("hitler.jpg", "ADOLF HITLER", 34.00, "DEMI BÉBÉ", 37.80, 39.90),
]
TITLE = ("BÉBÉ OU PAS BÉBÉ ?", 0.6, 4.6)

CARD_W, CARD_TOP = 600, 210
YELLOW, BLACK, WHITE, RED, GREEN = (255, 214, 0), (12, 12, 12), (255, 255, 255), (235, 50, 60), (40, 200, 110)


def font(size):
    return ImageFont.truetype(FONT, size)


def trim_borders(im):
    """Remove black bars and the light screenshot frame around a photo."""
    g = np.asarray(im.convert("L")).astype(int)
    rows = np.where((g > 25).mean(1) > 0.5)[0]
    im = im.crop((0, rows[0], im.width, rows[-1] + 1)) if len(rows) else im
    g = np.asarray(im.convert("L")).astype(int)
    cols = np.where((g < 235).mean(0) > 0.6)[0]
    rows = np.where((g < 235).mean(1) > 0.6)[0]
    return im.crop((cols[0], rows[0], cols[-1] + 1, rows[-1] + 1))


def pill(text, size, bg, fg, pad=(30, 16)):
    f = font(size)
    l, t, r, b = f.getbbox(text)
    w, h = r - l + pad[0] * 2, b - t + pad[1] * 2
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, w - 1, h - 1), radius=h // 2 if h < 120 else 24, fill=bg)
    d.text((pad[0] - l, pad[1] - t), text, font=f, fill=fg)
    return im


def shadow(im, blur=22, offset=(0, 14), alpha=150):
    """Return the image on a larger canvas with a soft drop shadow; also the shift of the image inside it."""
    m = blur * 2
    can = Image.new("RGBA", (im.width + m * 2, im.height + m * 2), (0, 0, 0, 0))
    a = im.split()[3].point(lambda v: v * alpha // 255)
    sh = Image.new("RGBA", im.size, (0, 0, 0, 255))
    sh.putalpha(a)
    can.paste(sh, (m + offset[0], m + offset[1]), sh)
    can = can.filter(ImageFilter.GaussianBlur(blur))
    can.alpha_composite(im, (m, m))
    return can


def make_card(path, name):
    ph = trim_borders(Image.open(os.path.join(SRC, path)).convert("RGB"))
    inner = CARD_W - 28
    hmax = 640
    h = min(hmax, round(ph.height * inner / ph.width))
    ph = ImageOps.fit(ph, (inner, h), centering=(0.5, 0.3))
    card = Image.new("RGBA", (CARD_W, h + 28), (0, 0, 0, 0))
    ImageDraw.Draw(card).rounded_rectangle((0, 0, CARD_W - 1, h + 27), radius=34, fill=WHITE)
    mask = Image.new("L", ph.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, ph.width - 1, ph.height - 1), radius=24, fill=255)
    card.paste(ph, (14, 14), mask)
    # name tag overlapping the bottom edge, Konbini-like black pill with white type
    tag = pill(name, 46 if len(name) < 14 else 38, BLACK, WHITE)
    full = Image.new("RGBA", (CARD_W, card.height + tag.height // 2 + 10), (0, 0, 0, 0))
    full.alpha_composite(card, (0, 0))
    full.alpha_composite(tag, ((CARD_W - tag.width) // 2, card.height - tag.height // 2))
    return shadow(full)


def make_verdict(text):
    pas = text.startswith("PAS")
    p = pill(text, 64, RED if pas else YELLOW, WHITE if pas else BLACK, pad=(34, 20))
    p = shadow(p, blur=12, offset=(0, 8), alpha=140)
    return p.rotate(-7, resample=Image.BICUBIC, expand=True)


def ease_out_back(x, s=1.9):
    x -= 1
    return 1 + (s + 1) * x ** 3 + s * x ** 2


def anim(t, t0, t1, din=0.38, dout=0.22):
    """(scale, alpha) for something shown between t0 and t1, with a pop-in and a quick fade-out."""
    if t < t0 or t > t1:
        return None
    if t < t0 + din:
        k = (t - t0) / din
        return 0.55 + 0.45 * ease_out_back(k), min(1, k * 2.5)
    if t > t1 - dout:
        k = (t1 - t) / dout
        return 0.92 + 0.08 * k, k
    return 1.0 + 0.025 * (t - t0 - din) / max(0.1, t1 - t0), 1.0  # slow push-in while on screen


def paste(frame, im, cx, cy, scale, alpha, angle=0.0):
    if scale != 1:
        im = im.resize((max(1, round(im.width * scale)), max(1, round(im.height * scale))), Image.BICUBIC)
    if alpha < 1:
        a = im.split()[3].point(lambda v: round(v * alpha))
        im = im.copy()
        im.putalpha(a)
    frame.alpha_composite(im, (round(cx - im.width / 2), round(cy - im.height / 2)))


cards = [(make_card(f, n), make_verdict(v), t0, tv, t1) for f, n, t0, v, tv, t1 in CARDS]
title = shadow(pill(TITLE[0], 70, YELLOW, BLACK, pad=(40, 24)), blur=16)


def overlay(t):
    fr = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    a = anim(t, TITLE[1], TITLE[2])
    if a:
        paste(fr, title, W / 2, 470, *a)
    for card, verdict, t0, tv, t1 in cards:
        a = anim(t, t0, t1)
        if not a:
            continue
        cy = CARD_TOP + card.height / 2
        paste(fr, card, W / 2, cy, *a)
        v = anim(t, tv, t1, din=0.3)
        if v:
            # the verdict slams onto the lower right corner of the photo
            paste(fr, verdict, W / 2 + 190 * a[0], cy + card.height * 0.25 * a[0], v[0] * a[0], v[1] * a[1])
    return fr


# --- audio: the answers (video sound) boosted, the questions placed one by one
def build_audio(path):
    inputs = ["-i", os.path.join(SRC, "video.mov")]
    parts, labels = [], []
    for i, (s, e, at) in enumerate(CLIPS):
        inputs += ["-i", os.path.join(SRC, "questions.m4a")]
        d = int(at * 1000)
        parts.append(f"[{i+1}:a]atrim={s}:{e},asetpts=PTS-STARTPTS,afade=t=in:d=0.04,afade=t=out:st={e-s-0.06}:d=0.06,"
                     f"volume=4dB,adelay={d}|{d}[q{i}]")
        labels.append(f"[q{i}]")
    parts.append("[0:a]highpass=f=80,volume=14dB[v]")
    graph = ";".join(parts) + ";" + "[v]" + "".join(labels) + \
        f"amix=inputs={len(CLIPS)+1}:normalize=0:duration=first,alimiter=limit=0.9,aformat=sample_rates=48000:channel_layouts=stereo[a]"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", graph, "-map", "[a]",
                    "-c:a", "aac", "-b:a", "192k", path], check=True)


audio = os.path.join(HERE, ".audio.m4a")
build_audio(audio)

dec = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-i", os.path.join(SRC, "video.mov"),
                        "-vf", f"scale={W}:{H}:flags=lanczos", "-f", "rawvideo", "-pix_fmt", "rgba", "-"],
                       stdout=subprocess.PIPE)
enc = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", f"{W}x{H}",
                        "-r", str(FPS), "-i", "-", "-i", audio, "-map", "0:v", "-map", "1:a", "-c:v", "libx264",
                        "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-c:a", "copy", "-shortest",
                        "-movflags", "+faststart", OUT], stdin=subprocess.PIPE)
n = 0
while True:
    raw = dec.stdout.read(W * H * 4)
    if len(raw) < W * H * 4:
        break
    t = n / FPS
    base = Image.frombuffer("RGBA", (W, H), raw, "raw", "RGBA", 0, 1).copy()
    base.alpha_composite(overlay(t))
    enc.stdin.write(base.tobytes())
    n += 1
enc.stdin.close()
enc.wait()
dec.wait()
os.remove(audio)
print(f"ok: {OUT} ({n} images)")
