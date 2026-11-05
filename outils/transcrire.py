"""Transcrit des fichiers audio en français. Usage : python transcrire.py MODELE fichier1 [fichier2 ...]"""
import subprocess, sys, time
import numpy as np
from faster_whisper import WhisperModel

def load(f):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'])
    return np.frombuffer(raw, np.float32)

m = WhisperModel(sys.argv[1], device="cpu", compute_type="int8")
for f in sys.argv[2:]:
    t = time.time()
    segs, info = m.transcribe(load(f), language="fr", vad_filter=True, beam_size=5)
    print(f"== {f.split('/')[-1]}  ({info.duration:.1f} s)")
    for s in segs:
        print(f"[{s.start:6.2f} → {s.end:6.2f}] {s.text.strip()}")
    print(f"   (transcrit en {time.time()-t:.0f} s)", flush=True)
