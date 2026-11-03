import React from 'react';
import {Composition} from 'remotion';
import {LucasXV, FPS, LucasProps} from './LucasXV';
import {END} from './timing';

// Props : voice = 'voix-lucas.mp3' ou mix = 'mix-lucas.wav' (fichiers dans public/), null = muet
const defaults: LucasProps = {voice: null, mix: 'mix-lucas.wav'};

export const Root: React.FC = () => (
  <Composition id="LucasXV" component={LucasXV} durationInFrames={Math.round(END * FPS)} fps={FPS} width={1080} height={1920} defaultProps={defaults} />
);
