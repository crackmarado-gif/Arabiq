// Début (en secondes) de chaque paragraphe de la voix, scène par scène (11 scènes).
// ⚠️ Temps ESTIMÉS d'après le texte (débit de l'épisode 3), en attendant la vraie voix.
// Quand audio/voix-episode4.mp3 existe : repérer les silences avec
//   ffmpeg -i voix-episode4.mp3 -af silencedetect=n=-35dB:d=0.35 -f null -
// puis remplacer PT et END (fin de la voix + ~1,4 s), et copier le JSON dans audio/timing-episode4.json.
export const PT = [0.4, 7.2, 17.31, 28.83, 43.9, 51.12, 57.92, 68.44, 76.9, 88.33, 93.23];
export const END = 100.91;
