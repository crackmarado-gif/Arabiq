"""Bruitages synthétisés pour « Passine » (aucun fichier externe).
Les instants sont exprimés en fraction de scène, exactement comme les animations (useAt dans scenes.tsx),
donc ils restent calés quand les temps de la voix changent.
Usage : from sfx import build; build(PT, END, 'public/sfx-passine.wav')
"""
import wave
import numpy as np

SR = 44100
FADE = 0.5  # même fondu que PassineXV.tsx (15 images)
rng = np.random.default_rng(7)


def lp(x, a):  # passe-bas simple (moyenne exponentielle)
    k = int(4 / a) + 1
    return np.convolve(x, a * (1 - a) ** np.arange(k))[:len(x)]


def hp(x, a):
    return x - lp(x, a)


def norm(y):
    m = np.max(np.abs(y)) or 1.0
    return y / m


def env(n, att=0.01, rel=None):
    t = np.arange(n) / SR
    e = 1 - np.exp(-t / max(att, 1e-4))
    if rel:
        e *= np.exp(-t / rel)
    return e


# ── sons de base ──
def boom(sec=1.4):  # impact grave « documentaire »
    n = int(SR * sec); t = np.arange(n) / SR
    f = 38 + 50 * np.exp(-t * 6)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.6)
    click = lp(rng.standard_normal(n), 0.3) * np.exp(-t * 45)
    return norm(body + 0.35 * click)


def whoosh(sec=0.7, up=True):
    n = int(SR * sec); u = np.linspace(0, 1, n); x = rng.standard_normal(n)
    a, b = (lp(x, 0.03), lp(x, 0.25)) if up else (lp(x, 0.25), lp(x, 0.03))
    return norm((a * (1 - u) + b * u) * np.sin(np.pi * u) ** 2)


def riser(sec=1.2):
    n = int(SR * sec); u = np.linspace(0, 1, n); x = rng.standard_normal(n)
    return norm((lp(x, 0.02) * (1 - u) + hp(x, 0.3) * u) * u ** 2.5)


def chalk(sec=0.45):  # craie qui gratte
    n = int(SR * sec); u = np.linspace(0, 1, n); t = np.arange(n) / SR
    x = hp(rng.standard_normal(n), 0.5)
    am = 0.55 + 0.45 * np.sign(np.sin(2 * np.pi * (28 + 8 * rng.random()) * t))
    return norm(lp(x, 0.7) * am * np.sin(np.pi * u) ** 0.6)


def chalk_tick():
    n = int(SR * 0.06); t = np.arange(n) / SR
    return norm(hp(rng.standard_normal(n), 0.4) * np.exp(-t * 70))


def kick():  # frappe de balle
    n = int(SR * 0.18); t = np.arange(n) / SR
    body = np.sin(2 * np.pi * (90 + 140 * np.exp(-t * 45)) * t) * np.exp(-t * 28)
    slap = hp(rng.standard_normal(n), 0.3) * np.exp(-t * 160)
    return norm(body + 0.5 * slap)


def thud():  # contact d'épaule / de dos
    n = int(SR * 0.22); t = np.arange(n) / SR
    return norm(np.sin(2 * np.pi * (60 + 40 * np.exp(-t * 30)) * t) * np.exp(-t * 18) + 0.2 * lp(rng.standard_normal(n), 0.2) * np.exp(-t * 40))


def whistle(sec=0.45):  # sifflet d'arbitre (roulette)
    n = int(SR * sec); t = np.arange(n) / SR
    trill = 1 + 0.5 * np.sign(np.sin(2 * np.pi * 32 * t))
    f = 2850 + 60 * np.sin(2 * np.pi * 32 * t)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * trill
    breath = hp(rng.standard_normal(n), 0.5) * 0.15
    e = np.minimum(1, t / 0.02) * np.minimum(1, (sec - t) / 0.05)
    return norm((tone + breath) * e)


def metal():  # « clang » du bouclier
    n = int(SR * 1.2); t = np.arange(n) / SR
    y = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, a, d in ((520, 1, 3), (1340, .6, 4.5), (2480, .4, 6), (3900, .25, 9)))
    return norm(y * (1 - np.exp(-t * 900)))


def stamp():
    n = int(SR * 0.4); t = np.arange(n) / SR
    return norm(np.sin(2 * np.pi * (70 + 70 * np.exp(-t * 30)) * t) * np.exp(-t * 12) + 0.5 * lp(rng.standard_normal(n), 0.4) * np.exp(-t * 60))


def cloth(sec=0.35):
    n = int(SR * sec); u = np.linspace(0, 1, n)
    return norm(lp(hp(rng.standard_normal(n), 0.15), 0.5) * np.sin(np.pi * u) ** 1.5)


def crowd(sec, swell=False):  # foule (murmure ou clameur)
    n = int(SR * sec); u = np.linspace(0, 1, n); t = np.arange(n) / SR
    x = rng.standard_normal(n)
    band = lp(hp(x, 0.04), 0.12)
    voices = sum(np.sin(2 * np.pi * (180 + 40 * k + 15 * np.sin(2 * np.pi * (0.3 + 0.1 * k) * t)) * t) * (0.5 + 0.5 * np.sin(2 * np.pi * (1.1 + 0.37 * k) * t + k)) for k in range(6)) * 0.08
    shape = (np.sin(np.pi * u) ** 0.5) if not swell else np.minimum(1, u / 0.25) * np.minimum(1, (1 - u) / 0.4)
    am = 0.75 + 0.25 * lp(rng.standard_normal(n), 0.0005) / 0.03
    return norm((band + voices) * shape * np.clip(am, 0.3, 1.3))


def crackle(sec=0.45):  # grésillement « bande / témoin »
    n = int(SR * sec); u = np.linspace(0, 1, n)
    pops = (rng.random(n) > 0.9975) * rng.standard_normal(n) * 4
    hiss = hp(rng.standard_normal(n), 0.4) * 0.25
    return norm((pops + hiss) * np.minimum(1, (1 - u) / 0.3))


def buzzer():  # buzzer « raté »
    n = int(SR * 0.7); t = np.arange(n) / SR
    sq = np.sign(np.sin(2 * np.pi * 98 * t)) + np.sign(np.sin(2 * np.pi * 104 * t))
    return norm(lp(sq, 0.25) * np.minimum(1, t / 0.01) * np.minimum(1, (0.7 - t) / 0.08))


# ── placement ──
def build(PT, END, out):
    buf = np.zeros(int(SR * (END + 1)))

    def add(t, sig, g):
        i = int(t * SR); n = min(len(sig), len(buf) - i)
        if n > 0 and i >= 0:
            buf[i:i + n] += sig[:n] * g

    starts = [0.0] + [p - FADE for p in PT[1:]]
    ends = [s + FADE for s in starts[1:]] + [END]
    at = lambda i, fr: starts[i] + fr * (ends[i] - starts[i])

    # 1. Ouverture
    add(at(0, 0.02), boom(), 0.55)
    # transitions : petit souffle à chaque changement de scène
    for i in range(1, len(PT)):
        add(starts[i] - 0.15, whoosh(0.6), 0.16)
    # 2. Titre : riser, craie qui barre « YASSINE », impact sur PASSINE
    add(at(1, 0.70) - 1.2, riser(1.2), 0.22)
    add(at(1, 0.55), chalk(0.4), 0.3)
    add(at(1, 0.70), boom(), 0.6)
    # 3. Il faisait peur : coup de sifflet, conduite de balle
    add(at(2, 0.10), whistle(0.4), 0.22)
    t = at(2, 0.15)
    while t < at(2, 0.8):
        add(t, kick(), 0.18); t += 0.42
    add(at(2, 0.70), crowd(2.2), 0.12)
    # 4. Technique Hazard : chocs dans le dos, puis « clang » du bouclier
    k = 0
    while True:  # pics de poussée : sin(f/9) au maximum
        f = 9 * (np.pi / 2 + 2 * np.pi * k); tt = starts[3] + f / 30; k += 1
        if tt > ends[3] - FADE:
            break
        if tt > at(3, 0.3):
            add(tt, thud(), 0.35)
    add(at(3, 0.30), metal(), 0.16)
    add(at(3, 0.80), stamp(), 0.35)
    # 5. Maillots
    add(at(4, 0.48), cloth(), 0.3); add(at(4, 0.70), cloth(), 0.3)
    # 6. Vesc : ambiance de foule, tampon « IL TIENT TÊTE »
    add(at(5, 0.05), crowd(ends[5] - starts[5] - 0.3), 0.13)
    add(at(5, 0.85), stamp(), 0.5)
    # 7. Contrôle : chute du ballon, amorti, clameur
    add(at(6, 0.28), whoosh(at(6, 0.5) - at(6, 0.28), up=False), 0.28)
    add(at(6, 0.50), kick(), 0.45)
    add(at(6, 0.52), crowd(2.6, swell=True), 0.22)
    # 8 & 11. Témoignages : grésillement
    add(starts[7] + 0.1, crackle(), 0.18); add(starts[10] + 0.1, crackle(), 0.18)
    # 9. Partie 2 : boom sur « Rien… sauf ce soir-là »
    add(at(8, 0.60), boom(), 0.7)
    # 10. 33 tirs : un tir + un trait de craie à chaque raté, buzzer à 33, clameur ironique sur « Eto'o, lui, marquait »
    keys = [(0.03, 1), (0.16, 2), (0.28, 10), (0.33, 20), (0.44, 33)]
    prev = 0
    for (f0, n0), (f1, n1) in zip(keys, keys[1:]):
        for n in range(max(prev, n0), n1):
            tt = at(9, f0 + (f1 - f0) * (n - n0) / (n1 - n0))
            add(tt, chalk_tick(), 0.3)
            if n < 10 or n % 3 == 0:
                add(tt - 0.05, kick(), 0.14)
        prev = n1
    add(at(9, 0.03), chalk_tick(), 0.3)
    add(at(9, 0.45), buzzer(), 0.22)
    add(at(9, 0.87), crowd(2.0, swell=True), 0.16)
    # 12. Reconversion : craie qui barre « ATTAQUANT », long souffle pendant le recul
    add(at(11, 0.22), chalk(0.45), 0.3)
    add(at(11, 0.30), whoosh(at(11, 0.75) - at(11, 0.30), up=False), 0.18)
    # 13. Fin : impacts, puis triple coup de sifflet final
    add(at(12, 0.03), stamp(), 0.35); add(at(12, 0.30), stamp(), 0.35); add(at(12, 0.50), boom(), 0.5)
    for j, ln in enumerate((0.35, 0.35, 0.9)):
        add(at(12, 0.80) + j * 0.55, whistle(ln), 0.22)

    y = np.tanh(buf * 1.2) * 0.9
    with wave.open(out, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((y * 32767).astype(np.int16).tobytes())
