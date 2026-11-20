# Petite musique de fond originale, légère et sautillante (style interview de rue), générée en Python.
# Usage : python3 montage/musique.py [durée_en_s]   ->   montage/musique.wav
import sys, os, wave, numpy as np

SR, BPM = 48000, 102
DUR = float(sys.argv[1]) if len(sys.argv) > 1 else 42.0
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "musique.wav")
BEAT = 60 / BPM
BAR = 4 * BEAT
rng = np.random.default_rng(7)
n = int(DUR * SR) + SR
mix = np.zeros((n, 2))


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def add(sig, t, pan=0.0, gain=1.0):
    i = int(t * SR)
    if i >= n:
        return
    sig = sig[: n - i] * gain
    mix[i : i + len(sig), 0] += sig * (1 - pan) ** 0.5
    mix[i : i + len(sig), 1] += sig * (1 + pan) ** 0.5


def env(length, attack=0.003, decay=0.3):
    t = np.arange(int(length * SR)) / SR
    return np.minimum(1, t / attack) * np.exp(-t / decay), t


def marimba(m, length=0.6):
    e, t = env(length, 0.002, 0.18)
    f = hz(m)
    return e * (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t / 0.03))


def epiano(ms, length=0.5):
    e, t = env(length, 0.005, 0.28)
    s = sum(np.sin(2 * np.pi * hz(m) * t + 0.6 * np.sin(2 * np.pi * hz(m) * t)) for m in ms)
    return e * s / len(ms)


def bass(m, length=0.45):
    e, t = env(length, 0.004, 0.22)
    s = np.sin(2 * np.pi * hz(m) * t) + 0.25 * np.sin(2 * np.pi * 2 * hz(m) * t)
    return np.tanh(1.6 * s) * e


def kick():
    e, t = env(0.3, 0.001, 0.12)
    f = 45 + 90 * np.exp(-t / 0.03)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * e


def noise_hit(length, decay, hp):
    e, t = env(length, 0.001, decay)
    x = rng.standard_normal(len(t))
    for _ in range(hp):  # crude high-pass: repeated first difference
        x = np.diff(x, prepend=0)
    return x / (np.abs(x).max() + 1e-9) * e


# Fmaj7 - Em7 - Dm7 - Cmaj7, light and a bit jazzy
CHORDS = [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]]
ARP = [0, 2, 1, 3, 2, 1, 3, 2]  # chord tone per 8th note
SKIP = {3, 6}                   # rests that make it bounce

bars = int(DUR / BAR) + 1
for b in range(bars):
    t0 = b * BAR
    ch = CHORDS[b % 4]
    intro = b == 0
    for k in range(8):
        t = t0 + k * BEAT / 2 + (0.03 if k % 2 else 0)  # a little swing
        if k not in SKIP or b % 2:
            add(marimba(ch[ARP[k]] + 12), t, pan=0.3 if k % 2 else -0.2, gain=0.32)
        if not intro:
            add(noise_hit(0.06, 0.018, 3), t, pan=0.4, gain=0.06 if k % 2 else 0.1)  # hats
    if intro:
        continue
    for beat in (0, 2):
        add(kick(), t0 + beat * BEAT, gain=0.55)
    add(kick(), t0 + 2.5 * BEAT, gain=0.3)
    for beat in (1, 3):
        add(noise_hit(0.18, 0.05, 1), t0 + beat * BEAT, gain=0.22)  # snap
    for off in (1.5, 3.5):
        add(epiano([m + 12 for m in ch]), t0 + off * BEAT + 0.03, pan=-0.3, gain=0.22)
    root = ch[0] - 12
    for beat, m in ((0, root), (1.5, root), (2.5, root + 7), (3.5, root + 12)):
        add(bass(m), t0 + beat * BEAT, gain=0.38)

mix = mix[: int(DUR * SR)]
fade = int(1.5 * SR)
mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
mix[: int(0.3 * SR)] *= np.linspace(0, 1, int(0.3 * SR))[:, None]
mix = np.tanh(mix / np.abs(mix).max() * 1.2) * 0.8
with wave.open(OUT, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print("ok:", OUT)
