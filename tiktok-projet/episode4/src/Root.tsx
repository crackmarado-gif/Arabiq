import React from 'react';
import {Composition} from 'remotion';
import {Episode4, FPS, Ep4Props} from './Episode4';
import {END} from './timing';

// Props : voice = 'voix-episode4.mp3' ou mix = 'mix-episode4.wav' (fichiers dans public/), null = muet
const defaults: Ep4Props = {voice: null, mix: null};

export const Root: React.FC = () => (
  <Composition id="Episode4" component={Episode4} durationInFrames={Math.round(END * FPS)} fps={FPS} width={1080} height={1920} defaultProps={defaults} />
);
