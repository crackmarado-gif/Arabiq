"""Construit la bande-son et les temps des scènes à partir de la voix du narrateur.
- public/narrateur.mp3 : voix du narrateur (ElevenLabs), sans les témoignages
- public/temoin1.* / public/temoin2.* (optionnels) : voix brutes des témoignages, déformées ici
Sortie : public/mix-seb.wav et src/timing.ts
Usage : python3 build_audio.py
"""
import glob, json, subprocess

NARR = 'public/narrateur.mp3'
# Début de chaque paragraphe dans narrateur.mp3 (repéré avec silencedetect) — 10 paragraphes
NP = [0.0, 6.03, 8.34, 13.12, 22.12, 30.39, 36.52, 44.25, 55.06, 63.01]
CUT1, CUT2 = 36.2, 62.8          # coupures (dans des silences) où l'on insère les témoignages
EST = {1: 12.0, 2: 13.5}         # durée estimée des témoignages s'ils ne sont pas encore là
OFF, PAD = 0.3, 0.7              # décalage de départ, marge avant/après chaque témoignage
CLEAN = 'aresample=44100,highpass=f=80,afftdn=nf=-25,silenceremove=stop_periods=-1:stop_duration=0.7:stop_threshold=-38dB:stop_silence=0.45,loudnorm=I=-18:TP=-2'
DEFORM = CLEAN + ',aresample=44100,asetrate=44100*0.78,aresample=44100,atempo=1.28,highpass=f=180,lowpass=f=3400,acompressor=threshold=0.1:ratio=4,volume=2'

def dur(f):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))

total_narr = dur(NARR)
tem = {}
for n in (1, 2):
    fs = [f for f in glob.glob(f'public/temoin{n}.*') if 'deforme' not in f]
    if fs:
        out = f'public/temoin{n}-deforme.wav'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', fs[0], '-af', DEFORM + ',silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse', out], check=True)
        tem[n] = (out, dur(out))
slot = {n: PAD * 2 + (tem[n][1] if n in tem else EST[n]) for n in (1, 2)}

# Positions sur la timeline finale
t1 = OFF + CUT1                 # début de la scène témoignage 1
b0 = t1 + slot[1]               # reprise du narrateur (partie B)
t2 = b0 + (CUT2 - CUT1)         # début de la scène témoignage 2
c0 = t2 + slot[2]               # reprise du narrateur (partie C)
end = c0 + (total_narr - CUT2) + 1.6

def tl(x):  # temps narrateur -> timeline
    return OFF + x if x < CUT1 else (b0 + x - CUT1 if x < CUT2 else c0 + x - CUT2)

PT = [tl(x) for x in NP[:6]] + [t1] + [tl(x) for x in NP[6:9]] + [t2] + [tl(NP[9])]
PT[0] = 0.0
with open('src/timing.ts', 'w') as f:
    f.write('// Généré par build_audio.py (ne pas modifier à la main). Début (s) de chaque scène.\n')
    f.write(f'export const PT = {json.dumps([round(x, 2) for x in PT])};\nexport const END = {round(end, 2)};\n')

# Mixage
ins = ['-i', NARR]; parts = []
parts.append(f'[0:a]atrim=0:{CUT1},asetpts=PTS-STARTPTS,adelay={int(OFF*1000)}:all=1[a]')
parts.append(f'[0:a]atrim={CUT1}:{CUT2},asetpts=PTS-STARTPTS,adelay={int(b0*1000)}:all=1[b]')
parts.append(f'[0:a]atrim={CUT2},asetpts=PTS-STARTPTS,adelay={int(c0*1000)}:all=1[c]')
labels = ['[a]', '[b]', '[c]']; k = 1
for n, start in ((1, t1), (2, t2)):
    if n in tem:
        ins += ['-i', tem[n][0]]
        parts.append(f'[{k}:a]aresample=44100,adelay={int((start+PAD)*1000)}:all=1[t{n}]'); labels.append(f'[t{n}]'); k += 1
parts.append(''.join(labels) + f'amix=inputs={len(labels)}:normalize=0,apad=whole_dur={end},loudnorm=I=-14:TP=-1.5:LRA=11[out]')
subprocess.run(['ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', ';'.join(parts), '-map', '[out]', '-ar', '44100', '-ac', '2', 'public/mix-seb.wav'], check=True)
print('témoignages présents :', sorted(tem), '| PT =', [round(x, 2) for x in PT], '| END =', round(end, 2))
