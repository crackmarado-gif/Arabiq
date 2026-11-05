import React from 'react';
import {Composition} from 'remotion';
import {HiverElNino, FPS, HiverProps} from './HiverElNino';
import {END} from './timing';

// Props : voice = 'voix-hiver.mp3' ou mix = 'mix-hiver.wav' (fichiers dans public/), null = muet
const defaults: HiverProps = {voice: null, mix: null};

export const Root: React.FC = () => (
  <Composition id="HiverElNino" component={HiverElNino} durationInFrames={Math.round(END * FPS)} fps={FPS} width={1080} height={1920} defaultProps={defaults} />
);
