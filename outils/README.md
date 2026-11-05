# Outils

## Transcription des audios (Whisper)
Permet de savoir ce que disent les témoignages et de faire les sous-titres.
```
python3 -m venv .stt && .stt/bin/pip install faster-whisper
.stt/bin/python outils/transcrire.py small fichier1.m4a fichier2.m4a        # texte avec horaires
.stt/bin/python outils/transcrire_json.py medium sortie.json fichier.wav    # mots horodatés -> segments de sous-titres
```
- Nécessite que l'environnement autorise Hugging Face (fait le 5/11/2026) : huggingface.co, cdn-lfs.huggingface.co, cdn-lfs.hf.co,
  cas-bridge.xethub.hf.co, cas-server.xethub.hf.co, transfer.xethub.hf.co, us.aws.cdn.hf.co.
- Transcrire les fichiers `public/temoinN-coupe.wav` (nettoyés, même timing que la version déformée), puis corriger à la main
  les mots mal compris (ex. « piéjon » → « pigeon »).
