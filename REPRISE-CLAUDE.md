# Document de reprise — projets vidéo (pour une nouvelle session Claude)

> **À lire en premier par Claude.** Ce fichier remplace la « mémoire » de la session précédente : Claude ne garde aucun souvenir d'une conversation à l'autre, tout ce qu'il faut savoir est ici et dans le dépôt.
> Dépôt GitHub : `crackmarado-gif/arabiq`, branche **`claude/recuperer-liens-jxsznz`** (tout le travail y est poussé).
> Mis à jour le 2 novembre 2026.

**Phrase à coller dans la nouvelle session :**
> « Va sur la branche claude/recuperer-liens-jxsznz du dépôt crackmarado-gif/arabiq, lis REPRISE-CLAUDE.md puis les README de chaque dossier, et reprends le travail. »

---

## 1. Ce que l'utilisatrice préfère (règles à respecter)

- **Langue** : tout en français, ton simple et direct.
- **Format vidéo** : TikTok vertical 1080×1920, 30 images/s.
- **Style** : 2D « flat » soigné ou « tableau tactique à la craie », sobre. **Rythme posé.**
- **Refusés après essai** (ne pas reproposer) :
  - effets « tac-tac-tac » (secousses, flashs, zooms brusques) ;
  - personnages dessinés (on utilise des objets, des pions, des symboles) ;
  - versions courtes / mèmes, styles 3D et pâte à modeler ;
  - images générées par IA type « avant / après » (jugées pas belles) ;
  - **bruitages** (essayés sur Passine, retirés : « pas fan »).
- **Série climat** : uniquement des faits sourcés, sources en petit en bas de l'écran + en description. Vérifier les chiffres avant de les utiliser.
- **Vidéos entre potes (groupe XV)** : humour bienveillant, faux documentaire très sérieux (c'est le sérieux qui fait rire), pas de méchanceté.
- **Voix** : narrateur = ElevenLabs « Adam – American, Dark and Tough », modèle eleven v4, généré par l'utilisatrice sur iPhone (crédits limités). Les **témoignages** sont enregistrés par l'utilisatrice au téléphone (Dictaphone, .m4a), puis **déformés** par Claude (voix « incognito »).
- Elle arrête parfois une commande en cours : vérifier l'état (`git status`) avant de reprendre, et ne pas toucher à ce qu'elle a demandé de laisser.

---

## 2. Les projets et leur état

### A. Série TikTok « Toits verts contre les 1 % » — dossier `tiktok-projet/`
Lire `tiktok-projet/README.md` (historique, palette, pipeline des épisodes 1-3).

| Épisode | État |
|---|---|
| 1, 2, 3 | ✅ terminés (`tiktok-projet/videos/episode1-3.mp4`) |
| 4 « Comment on fait ? » | 🟡 texte + animation Remotion faits, **voix pas encore générée** |

- Épisode 4 : texte `tiktok-projet/texte-voix-episode4.md` (faits **vérifiés** le 1/11/2026, voir la fin du fichier) ; projet Remotion `tiktok-projet/episode4/` ; aperçu muet `tiktok-projet/videos/episode4-apercu-muet.mp4` (temps estimés).
- Corrections déjà faites : « −10 °C » remplacé par 80 °C / 29 °C (étude pour l'ADEME) ; « près de 400 espèces » ; « un toit de 14 000 m² » (pas 14 000 m² cultivés) ; loi Climat = « végétalisé **ou** solaire », bâtiments non résidentiels neufs/rénovés.
- À faire : voix ElevenLabs de l'épisode 4 → caler avec `silencedetect` (remplacer `PT`/`END` dans `episode4/src/timing.ts`) → mixage → rendu. Idée en attente : miniatures TikTok des 4 épisodes (Canva).

### B. « Seb — L'incompris » (XV Originals, épisode 1) — dossier `seb-xv/`
- ✅ **Terminé** : `seb-xv/seb-apercu.mp4` (1 min 38) = narrateur + 2 témoignages déformés.
- Script : `seb-xv/script-seb.md`. Faits réels utilisés : doublé de la tête « au Vesc », il a ramené sa copine au stade.
- Points ouverts (l'utilisatrice a dit de **laisser tomber** Seb pour l'instant, ne pas y toucher sans demande) :
  - l'écran affiche « Le doublé du **Vesque** » ; la bonne orthographe est **Vesc** ;
  - le sous-titre du témoignage 2 finit par « …ce match-là n'existe pas encore » mais elle a peut-être dit autre chose (« au niveau de Seb ») en enregistrant.

### C. « Passine — La reconversion » (XV Originals, épisode 2) — dossier `passine-xv/`
- ✅ **Terminé** : `passine-xv/passine-apercu.mp4` (2 min 07) = narrateur + 2 témoignages déformés, **sans bruitages**.
- Orthographes : **Yassine** (vrai prénom), surnom **Passine** (P-A-S-S-I-N-E), terrain **Vesc** (V-E-S-C).
- Faits réels : attaquant qui faisait peur ; style Eden Hazard (protège le ballon avec les fesses, « bouclier arrière ») ; toujours 2 maillots (Real Sociedad, ou Barça floqué Eto'o) ; joue au Vesc contre les gars du bled ; un contrôle « zidanesque » pendant un five (pas au Vesc) dont il parle tout le temps ; un soir, 33 tirs ratés d'affilée → s'est reconverti gardien / défenseur.
- Structure : partie 1 la légende, partie 2 la chute (demandé explicitement).
- Inventé pour la blague : « ce soir-là il portait le maillot d'Eto'o. Eto'o, lui, marquait. »

### D. Idée en attente : cours du CNAM en « mode prof »
- Elle veut s'entraîner en expliquant les cours comme si elle était la prof.
- Proposition faite : elle **télécharge et envoie les cours** (PDF, diapos, photos) — **ne jamais demander ses identifiants CNAM**. Claude en fait des présentations animées : idées dévoilées une par une, notes « ce que le prof dit » cachées, questions d'élèves pièges, quiz de fin. Fidèle au cours, signaler ce qui paraît faux.
- En attente : la matière + un premier chapitre pour tester.

---

## 3. Outils et environnement

### Environnement (session cloud Claude Code)
- Navigateur : Chromium déjà installé, chemin pour Remotion :
  `/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`
- `ffmpeg` / `ffprobe` disponibles ; Python 3 avec **numpy**.
- **Réseau restreint** (proxy) : bloqués à ce jour → `api.elevenlabs.io`, `canva.com` (téléchargements), `batiweb.com`, `data.iau-idf.fr`. Autorisés : npm, PyPI, apt, GitHub. Pour débloquer : réglages de l'environnement → Network access → domaines autorisés.
- Secret `ELEVENLABS_API_KEY` présent dans l'environnement, mais domaine bloqué (clé jamais testée).
- `espeak-ng` + voix MBROLA (`mbrola-fr1`) installables par apt pour une voix de synthèse — **qualité jugée insuffisante**, ne pas utiliser pour le rendu final.
- **Transcription disponible** depuis le 5/11/2026 : Hugging Face autorisé, faster-whisper (voir `outils/README.md`). Sert à savoir ce que disent les témoignages et à faire les sous-titres. L'alignement du narrateur peut toujours se faire avec `silencedetect` (voir §4).

### Outils de Claude utilisés
- Lecture/écriture de fichiers, terminal (bash), git (commit + push sur la branche).
- **Remotion 4.0.539** (React → vidéo) pour l'épisode 4, Seb et Passine ; pages HTML/SVG + Playwright pour les épisodes 1-3.
- **Recherche web** (vérification des faits de l'épisode 4, sources citées dans le texte).
- **Connecteur Canva** (génération d'images ; résultat refusé par l'utilisatrice).
- Envoi de fichiers à l'utilisatrice (vidéos d'aperçu, scripts, démos audio).

---

## 4. Procédures (comment c'est fabriqué)

### Projets Remotion (`tiktok-projet/episode4/`, `seb-xv/`, `passine-xv/`)
```
cd <dossier> && npm install
npm run render            # → out/<nom>.mp4
```
- `src/scenes.tsx` : une scène par paragraphe ; animations placées en **fraction de scène** (`useAt()(0.4)` = 40 % de la scène), donc elles suivent automatiquement les vrais temps de la voix.
- `src/timing.ts` : `PT` = début (s) de chaque scène, `END` = durée totale. Fondu de 0,5 s entre scènes.
- `src/ui.tsx` (et `src/kit.tsx` pour Passine) : palette, polices Oswald/Rubik (dans `public/`), éléments « craie » (terrain, pions, flèches, témoignages).
- Contrôle visuel : `npx remotion still` sur une image par scène, assemblées en planche avec ffmpeg `xstack`, pour repérer les chevauchements de texte.

### Bande-son XV (`seb-xv/build_audio.py`, `passine-xv/build_audio.py`)
`python3 build_audio.py` fait tout :
1. Témoignages `public/temoin1.*`, `public/temoin2.*` : coupe le bruit avant/après la voix et raccourcit les pauses > 0,7 s (fonction `trim_pauses`, découpage maison qui ne perd jamais la fin — le filtre `silenceremove` de ffmpeg coupait le dernier mot), puis :
   - nettoyage : `highpass=80, afftdn=nf=-25, loudnorm=I=-18`
   - déformation « incognito » : `asetrate=44100*0.78, aresample=44100, atempo=1.28, highpass=180, lowpass=3400, acompressor`
2. Insère les témoignages dans les silences du narrateur (`CUT1`, `CUT2`), recalcule `src/timing.ts`, mixe et normalise à −14 LUFS → `public/mix-*.wav`.
3. Puis `npm run render`.

**Caler une nouvelle voix de narrateur** : `ffmpeg -i narrateur.mp3 -af silencedetect=n=-35dB:d=0.3 -f null -`, faire correspondre chaque morceau de voix aux phrases du script, et noter le début de chaque paragraphe dans `NP` (et les coupures `CUT1/CUT2` au milieu des silences où vont les témoignages).

**Reconnaître quel enregistrement est quel témoignage** (sans transcription) : comparer le rythme (durée des morceaux de voix) avec la structure des phrases.

### Épisodes 1-3 (ancienne méthode)
Voir `tiktok-projet/README.md` : pages `src/epN_2d.html` capturées par `src/render2d.js` (Playwright), bruitages Python `audio/sfx-episodeN.py`, mixage ffmpeg avec `sidechaincompress`.

---

## 5. Prochaines étapes possibles
1. Cours CNAM en « mode prof » (attend un premier chapitre).
2. Épisode 4 climat : voix → calage → rendu final (+ éventuelle miniature).
3. XV Originals : un nouvel épisode sur un autre membre du groupe (même format, même pipeline : script → voix Adam → 2 témoignages au téléphone → `build_audio.py` → rendu).
4. Seb : seulement si elle le redemande (orthographe « Vesc », sous-titre du témoignage 2).
