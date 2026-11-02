# « PASSINE — La reconversion » · XV Originals, épisode 2

Même format que `seb-xv/` : faux documentaire, tableau tactique à la craie.
- Script : `script-passine.md` (13 scènes ; partie 1 la légende, partie 2 la chute).
- Scènes : `src/scenes.tsx` (éléments communs dans `src/kit.tsx`) ; temps ESTIMÉS dans `src/timing.ts`.
- Rendu : `npm install` puis `npm run render` → `out/passine.mp4`.
- Témoignages : `public/temoin1.m4a` (le contrôle), `public/temoin2.m4a` (les 33 tirs), enregistrés au téléphone.
- `python3 build_audio.py` : nettoie, découpe et déforme les témoignages, monte `public/mix-passine.wav` et recalcule `src/timing.ts`.
  Sans `public/narrateur.mp3`, la place du narrateur est laissée vide (durées estimées). Quand il arrive : le déposer, remplir NP / CUT1 / CUT2 dans `build_audio.py`, relancer, puis `npm run render`.
- Aperçu actuel : `passine-apercu.mp4` (témoignages seulement, narrateur à venir).
