# « SEB — L'INCOMPRIS » · un documentaire XV

Faux documentaire sportif, ton sobre et très sérieux (c'est le sérieux qui rend ça drôle).
Format TikTok vertical, environ 1 min 25. Visuel : tableau tactique à la craie, pions, flèches.

Voix : **Narrateur** = voix grave de documentaire (ElevenLabs, par ex. la voix « Adam »).
**Témoignages** = une autre voix, puis déformée au mixage (plus grave, effet « anonyme »).
Les « … » marquent une pause. Une ligne = une scène.

---

**1. Ouverture (écran noir)** — Narrateur
> Certains joueurs, on les remarque tout de suite. D'autres… on met des années à les comprendre.

**2. Titre** — Narrateur
> Seb. L'incompris.

**3. Où est Seb ?** — Narrateur
> Sur le terrain, une question revient sans cesse : mais où est Seb ?

**4. Trois secondes d'avance** — Narrateur
> La réponse est simple. Seb ne joue pas en retard. Il joue avec trois secondes d'avance. Quand le ballon arrive… Seb est déjà parti.

**5. L'analyse tactique** — Narrateur
> Regardez cette action. Les autres suivent le ballon. Seb, lui, se place pour l'action d'après. Voire celle de la semaine prochaine.

**6. Les passes** — Narrateur
> Ses passes ? Il ne les rate pas. Il les donne à des coéquipiers… qui ne sont pas encore démarqués.

**7. Témoignage 1** — Coéquipier anonyme (voix déformée)
> Je l'ai jamais vu toucher le ballon. Jamais. Au début, je me disais qu'il était perdu… Et puis j'ai compris. Le ballon, c'est pour ceux qui ont besoin de preuves. Seb, il joue un niveau au-dessus.

**8. Les statistiques** — Narrateur
> Les chiffres parlent d'eux-mêmes. Distance parcourue : impossible à mesurer. Ballons touchés : confidentiel.

**9. Le doublé** — Narrateur
> Et puis, il y a eu ce jour, au Vesque. Deux centres. Deux têtes. Deux buts. Ce jour-là, pour une fois… le football avait rattrapé Seb.

**10. Le public** — Narrateur
> Seb est aussi le seul joueur de l'XV à avoir ramené son propre public au stade. Une supportrice. Cent pour cent de son kop.

**11. Témoignage 2** — Coéquipier anonyme (voix déformée)
> Depuis le doublé, on attend le troisième. Il dit qu'il le garde pour un grand match. On lui a demandé lequel… Il a juste répondu : « Vous verrez. » Franchement ? Je crois que ce match-là n'existe pas encore.

**12. Fin** — Narrateur
> Seb n'est pas sous-coté. Il est en avance. Le football… n'était pas prêt.

---

## Mixage prévu
- Musique : nappe grave et lente, montée sur la scène 9 (le doublé), silence juste avant « n'était pas prêt ».
- Voix déformée des témoignages : `ffmpeg -i temoin.mp3 -af "asetrate=44100*0.82,aresample=44100,atempo=1.2" temoin-deforme.wav`
- Petits bruitages : craie sur le tableau, sifflet, foule lointaine sur le doublé.
