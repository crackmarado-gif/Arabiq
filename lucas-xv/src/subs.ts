// Sous-titres des témoignages (transcrits avec Whisper, corrigés à la main). Temps en s depuis le début de la voix du témoin.
export type Sub = {s: number; e: number; t: string};
export const SUBS1: Sub[] = [
  {s: 0.0, e: 2.8, t: 'La vie de ma mère, ce mec, il est pas comme nous.'},
  {s: 2.8, e: 6.0, t: "Il jouait avec sa casquette à l'envers, en 2021, au Vesc."},
  {s: 6.0, e: 9.0, t: 'Sur corner, on est au milieu de terrain, lui et moi.'},
  {s: 9.0, e: 10.2, t: '« T\'inquiète, frérot, tu vas voir. »'},
  {s: 10.2, e: 12.4, t: 'Je lui dis : « Lucas, enlève. » Il me dit : « T\'inquiète. »'},
  {s: 12.4, e: 15.6, t: 'Maintenant, il se passe quoi ? Il monte, il saute…'},
  {s: 15.6, e: 18.5, t: 'Tête. Évidemment, ça va tuer un pigeon.'},
  {s: 18.5, e: 21.8, t: "Mais j'ai vu la vitesse. Il me parlait d'aérodynamisme."},
  {s: 21.8, e: 24.6, t: "La vie de ma mère, j'te le dis : ce mec, il est trop loin pour nous."},
];
export const SUBS2: Sub[] = [
  {s: 0.0, e: 2.8, t: "J'étais là ce jour-là, et j'avais jamais vu ça."},
  {s: 2.8, e: 5.0, t: "Pourtant, j'avais déjà vu des horreurs."},
  {s: 5.0, e: 9.4, t: "J'avais vu Mounir. J'avais vu Pierre, là… Downfall."},
  {s: 9.4, e: 14.5, t: "Mais là, même l'arbitre, il a baissé les yeux. C'était dégueulasse."},
  {s: 14.5, e: 19.8, t: 'Et depuis, quand je vois ces deux attaquants ensemble… je peux plus.'},
  {s: 19.8, e: 25.2, t: "Même quand je vois deux attaquants, je pense à ça. J'en fais des cauchemars."},
];
