# « SEB — L'INCOMPRIS » (vidéo pour le groupe XV)

Faux documentaire sportif sur Seb, ton sobre : tableau tactique à la craie, pions, flèches, témoignages « anonymes ».

- Script de la voix : `script-seb.md` (12 lignes = 12 scènes, ≈ 1 min 25).
- Projet Remotion : `npm install`, puis `npm run render` (aperçu muet dans `out/seb.mp4`).
- Scènes : `src/scenes.tsx` ; temps (ESTIMÉS) : `src/timing.ts`.
- Voix : `public/narrateur.mp3` (ElevenLabs, Adam). Témoignages : déposer `public/temoin1.*` et `public/temoin2.*` (voix normales).
- `python3 build_audio.py` : déforme les témoignages, monte la bande-son (`public/mix-seb.wav`) et recalcule les temps des scènes (`src/timing.ts`). Puis `npm run render`.
- Aperçu actuel : `seb-apercu.mp4` (narrateur + 2 témoignages déformés). Témoignages : enregistrés au téléphone (temoin1.m4a, temoin2.m4a), nettoyés et déformés par build_audio.py.
