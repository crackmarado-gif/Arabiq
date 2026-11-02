import React from 'react';
import {Composition} from 'remotion';
import {PassineXV, FPS, PassineProps} from './PassineXV';
import {END} from './timing';

// Props : voice = 'voix-passine.mp3' ou mix = 'mix-passine.wav' (fichiers dans public/), null = muet
const defaults: PassineProps = {voice: null, mix: null};

export const Root: React.FC = () => (
  <Composition id="PassineXV" component={PassineXV} durationInFrames={Math.round(END * FPS)} fps={FPS} width={1080} height={1920} defaultProps={defaults} />
);
