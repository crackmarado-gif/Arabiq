# « LUCAS — Le retour du Super Saiyan » · XV Originals, épisode 3

Même format que `seb-xv/` et `passine-xv/`.
- Script : `script-lucas.md` (14 scènes : le renard / la tragédie du duo Seb–Lucas en noir et blanc / la chute et la renaissance).
- Témoignages : `public/temoin1.m4a` (audio du pote, placé après « Super Saiyan ») et `public/temoin2.m4a` (placé après le downfall), sans sous-titres pour l'instant.
- `python3 build_audio.py` : nettoie / déforme les témoignages, monte `public/mix-lucas.wav`, recalcule `src/timing.ts`.
  Sans `public/narrateur.mp3`, la place du narrateur est vide (durées estimées). Quand il arrive : remplir NP / CUT1 / CUT2 (voir `passine-xv/build_audio.py` pour un exemple), relancer, puis `npm run render`.
- Narrateur : `public/narrateur.mp3` (ElevenLabs, Adam), NP / CUT1 / CUT2 remplis dans `build_audio.py`.
- Aperçu actuel : `lucas-apercu.mp4` (narrateur + 2 témoignages, 2 min 46).
