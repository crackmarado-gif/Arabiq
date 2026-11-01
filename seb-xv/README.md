# « SEB — L'INCOMPRIS » (vidéo pour le groupe XV)

Faux documentaire sportif sur Seb, ton sobre : tableau tactique à la craie, pions, flèches, témoignages « anonymes ».

- Script de la voix : `script-seb.md` (12 lignes = 12 scènes, ≈ 1 min 25).
- Projet Remotion : `npm install`, puis `npm run render` (aperçu muet dans `out/seb.mp4`).
- Scènes : `src/scenes.tsx` ; temps (ESTIMÉS) : `src/timing.ts`.
- Avec la voix : mettre le mix dans `public/` et `npm run render -- --props='{"voice":null,"mix":"mix-seb.wav"}'`.
