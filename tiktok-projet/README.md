# Série TikTok « Toits verts contre les 1 % »

Série d'explication en 4 épisodes, tirée du PowerPoint « Toits verts contre les 1 % » (justice climatique). Ce dossier sert de **point de reprise** pour une nouvelle session Claude Code.

## État au 1er novembre 2026

| Épisode | Titre | Statut | Fichier |
|---|---|---|---|
| 1 | Pourquoi il fait si chaud ? | ✅ Terminé (85 s) | `videos/episode1.mp4` |
| 2 | Qui est responsable ? | ✅ Terminé (97 s) | `videos/episode2.mp4` |
| 3 | Et nous, dans tout ça ? | ✅ Terminé, version « calme » (94 s) | `videos/episode3.mp4` |
| 4 | Comment on fait ? (les solutions) | 🟡 Texte + animation faits (Remotion), **voix à générer** | `episode4/`, aperçu muet `videos/episode4-apercu-muet.mp4` |

## Ce que l'utilisatrice préfère (décisions prises)

- **Format** : TikTok vertical 1080×1920, 30 i/s.
- **Style** : 2D « flat » soigné, palette du PowerPoint (crème `#F3EDE2`, noir `#1B1E1C`, orange `#FF6B35`, vert `#3CC47C`, nuit `#1E2440`), polices **Oswald** (titres) et **Rubik** (texte).
- **Rythme** : posé et agréable, comme les épisodes 1 et 2. **Pas** d'effets « tac-tac-tac » (secousses, flashs, zooms brusques, titres qui claquent) : testés, refusés.
- **Pas de personnages dessinés** (le dessin de Samia est jugé moche) : utiliser des objets et symboles (immeubles, fenêtres, téléphones, pancartes, thermomètres…). Les épisodes 1 et 2 contiennent encore Samia : à adapter éventuellement.
- **Accroche forte** dans la première seconde (ex. ép. 3 : « Arrête de culpabiliser. On t'a pris pour un pigeon. »), mais sans vrais gros mots.
- **Versions courtes / mèmes** : testés, refusés. On garde les épisodes d'environ 1 min 30.
- Styles 3D et pâte à modeler : testés, abandonnés au profit de la 2D.
- **Faits sourcés uniquement** ; sources affichées en petit en bas de l'écran et à mettre en description.

## Voix

Voix ElevenLabs « Adam – American, Dark and Tough » (modèle eleven v4), générée par l'utilisatrice sur iPhone. Les MP3 sont dans `audio/`.

## Comment ça marche (rendu actuel, épisodes 1-3)

1. Chaque épisode est une page HTML/SVG animée (`src/epN_2d.html`) avec une fonction `window.render(t)`.
2. `node src/render2d.js src/epN_2d.html <dossier_images>` capture chaque image avec Playwright (Chromium déjà installé dans l'environnement).
3. Les temps de début de chaque paragraphe de la voix (repérés avec `ffmpeg silencedetect`) sont dans `window.PT` de la page et dans `audio/timing-episodeN.json`.
4. Les bruitages sont synthétisés en Python (`audio/sfx-episodeN.py <timing.json> <sortie.wav>`).
5. Mixage : voix + bruitages baissés automatiquement sous la voix (`sidechaincompress`), normalisé à -14 LUFS :

```
ffmpeg -i voix.mp3 -i sfx.wav -filter_complex "[0:a]aresample=44100,apad=pad_dur=1.4,asplit=2[v][vsc];[1:a]aresample=44100,volume=0.55[s];[s][vsc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=300[sd];[v][sd]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[out]" -map "[out]" -ac 2 mix.wav
ffmpeg -framerate 30 -i images/f%05d.jpg -i mix.wav -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest episode.mp4
```

## Remotion (pour l'épisode 4)

Testé et fonctionnel (v4.0.539). Dans `remotion-test/` : `npm install`, copier les polices de `src/fonts/` dans `remotion-test/public/`, puis :

```
npx remotion render src/index.ts Demo out/demo.mp4 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
```

## Épisode 4 (Remotion) : où on en est

- Texte de la voix : `texte-voix-episode4.md` (11 paragraphes = 11 scènes, sources en bas). Faits vérifiés le 1er novembre 2026 (voir la fin du fichier).
- Projet : `episode4/` (`npm install`, polices déjà dans `public/`). Scènes dans `src/scenes.tsx`, temps dans `src/timing.ts`.
- Les temps actuels sont **estimés** (aperçu muet de 97 s). Les animations sont placées en fraction de scène, donc il suffit de remplacer `PT`/`END` par les vrais temps de la voix.
- Avec la voix : mettre `voix-episode4.mp3` (ou le mix) dans `episode4/public/`, puis
  `npm run render -- --props='{"voice":"voix-episode4.mp3","mix":null}'`
  (ou `{"voice":null,"mix":"mix-episode4.wav"}` après le mixage décrit plus haut).
- Scène 6 « Imagine ça sur les cités » : avant / après avec curseur, sur deux images créées avec Canva (même vue de cité ; marquées « SIMULATION » à l'écran).
  Canva : avant https://www.canva.com/M/MAHZtqu3bCY · après https://www.canva.com/M/MAHZtrduap0
  ⚠️ `episode4/public/cite-avant.png` et `cite-apres.png` sont pour l'instant des miniatures agrandies (floues) : télécharger les images en pleine résolution depuis Canva et les remplacer (mêmes noms), ou autoriser `canva.com` dans le réseau de l'environnement.
- 1er novembre 2026 : la clé `ELEVENLABS_API_KEY` est bien présente, mais `api.elevenlabs.io` est **bloqué par la politique réseau** de l'environnement (403 du proxy). À ajouter dans les domaines autorisés de l'environnement.

## Prochaines étapes prévues

1. **ElevenLabs** : l'utilisatrice ajoute `ELEVENLABS_API_KEY` dans les secrets de l'environnement et autorise `api.elevenlabs.io`. Ensuite : générer les voix directement, de vrais effets sonores, une musique douce, et les timings mot par mot.
2. **Épisode 4 « Comment on fait ? »** avec Remotion, même style posé : toits verts (80 °C pour un toit sombre contre 29 °C pour un toit végétalisé : étude pour l'ADEME), biodiversité (36 toits, près de 400 espèces de plantes, 611 invertébrés : ARB Île-de-France, GROOVES), ferme sur le toit Nature Urbaine (toit de 14 000 m², Paris), « imaginez ça sur les cités », limites (le toit n'appartient pas aux locataires, la loi Climat ne vise pas les logements, gentrification verte d'après Anguelovski et al. 2022, effet surtout au dernier étage, besoin d'eau, murs végétalisés), conclusion « Qui pollue ? les plus riches. Qui souffre ? les plus pauvres. Qui agit ? peut-être nous. ».
3. **Miniatures TikTok** des 4 épisodes avec Canva (connecteur Canva disponible).
4. Option : accroche forte au début des épisodes 1 et 2, et retrait du dessin de Samia.

## Textes des voix

### Épisode 2 : « Qui est responsable ? »

Qui est responsable de la chaleur chez Samia ? Premier suspect : l'État.
En 2021, c'est l'Affaire du siècle. Des associations, soutenues par des millions de signatures, attaquent la France pour inaction climatique. Le tribunal leur donne raison : l'État a commis une faute.
Pourtant, des promesses, il y en a eu. En 2020, la France devait atteindre vingt-trois pour cent d'énergies renouvelables. Résultat : dix-neuf. Seul pays de l'Union européenne à rater son objectif.
En 2003, la canicule fait quinze mille morts. Plus de vingt ans après, la loi ne fixe toujours aucune température maximale pour un logement. Ni au travail. Et l'obligation de toits végétalisés vise les centres commerciaux et les bureaux… pas les habitations.
Mais l'État n'est pas seul. Deuxième suspect : les plus riches.
Les un pour cent les plus riches de la planète émettent autant de CO2 que cinq milliards de personnes. Et cent vingt-cinq milliardaires, rien qu'avec leurs investissements, polluent autant que toute la France.
Troisième suspect : les géants du pétrole. Dès 1971, Total est alertée des conséquences catastrophiques des énergies fossiles. Puis vient le déni.
Et en 2025, TotalEnergies est condamnée pour greenwashing : ses publicités sur la neutralité carbone pouvaient tromper les consommateurs.
Au sommet climat de 2025, au Brésil, mille six cents lobbyistes des énergies fossiles. Un participant sur vingt-cinq.
Alors… les responsables, ce sont eux. Mais nous, dans tout ça ? Réponse dans l'épisode trois.

### Épisode 3 : « Et nous, dans tout ça ? »

Arrête de culpabiliser. On t'a pris pour un pigeon.
On te répète : éteins la lumière, trie tes déchets, prends des douches plus courtes. Comme si tout reposait sur toi.
Cette idée a une histoire. En 2004, le géant pétrolier BP popularise l'empreinte carbone, avec l'un des premiers calculateurs en ligne. Le message est clair : le problème, c'est toi.
Pourtant, selon le cabinet Carbone 4, les gestes individuels sont indispensables… mais largement insuffisants. L'essentiel dépend des entreprises et de l'État.
Le philosophe Michel Foucault avait un mot pour ça : la gouvernementalité. Gouverner, ce n'est pas seulement interdire. C'est faire en sorte que chacun se surveille et se sente responsable… à la place du pouvoir.
Foucault parle aussi de biopolitique : le pouvoir choisit qui il fait vivre… et qui il laisse mourir. Selon Oxfam, à l'été 2025, la surmortalité due à la chaleur était de trente et un pour cent plus élevée dans les zones les plus pauvres.
Et le sociologue Pierre Bourdieu l'explique : le capital économique devient du pouvoir politique. Ceux qui ont l'argent ont aussi l'oreille de ceux qui décident.
Alors non, Samia, ce n'est pas ta faute. Tu pollues peu… et tu souffres beaucoup.
Mais nous ne sommes pas impuissants. L'Affaire du siècle, ce sont des citoyens qui l'ont gagnée. Seuls, nos gestes comptent peu. Ensemble, ils changent les règles.
Si le changement ne vient pas d'en haut… il doit venir d'en bas. Comment ? Réponse dans l'épisode quatre.

## Sources principales

Météo-France (îlots de chaleur), ADEME, Tribunal administratif de Paris (2021), Commission européenne (2020), Inserm (2003), loi Climat et Résilience (art. 101), décret n° 2025-482 (chaleur au travail), Oxfam (2022, 2023, 2026), Bonneuil, Choquet & Franta (2021), Tribunal judiciaire de Paris (23 octobre 2025), Kick Big Polluters Out (2025), Carbone 4 « Faire sa part ? » (2019), M. Foucault, P. Bourdieu.
