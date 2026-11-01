#!/bin/sh
# Rend une voix « anonyme / incognito » (plus grave, son de reportage).
# Usage : sh deformer.sh enregistrement.m4a sortie.mp3
ffmpeg -y -i "$1" -af "aresample=44100,asetrate=44100*0.78,aresample=44100,atempo=1.28,highpass=f=180,lowpass=f=3400,acompressor=threshold=0.1:ratio=4,volume=2" -c:a libmp3lame -q:a 3 "$2"
