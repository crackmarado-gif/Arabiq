"""Transcrit (mots horodatés) et écrit un JSON de segments courts pour les sous-titres. Usage : modele sortie.json fichier"""
import json, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel
raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', sys.argv[3], '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'])
m = WhisperModel(sys.argv[1], device="cpu", compute_type="int8")
segs, _ = m.transcribe(np.frombuffer(raw, np.float32), language="fr", word_timestamps=True, beam_size=5, condition_on_previous_text=False)
words = [w for s in segs for w in s.words]
out, cur = [], []
for w in words:
    cur.append(w)
    txt = ''.join(x.word for x in cur).strip()
    if len(txt) > 38 or txt.endswith(('.', '?', '!', ',')) and len(txt) > 18:
        out.append({'s': round(cur[0].start, 2), 'e': round(cur[-1].end, 2), 't': txt}); cur = []
if cur: out.append({'s': round(cur[0].start, 2), 'e': round(cur[-1].end, 2), 't': ''.join(x.word for x in cur).strip()})
json.dump(out, open(sys.argv[2], 'w'), ensure_ascii=False, indent=0)
for o in out: print(f"[{o['s']:6.2f}-{o['e']:6.2f}] {o['t']}")
