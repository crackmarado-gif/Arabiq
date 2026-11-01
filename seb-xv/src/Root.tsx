import React from 'react';
import {Composition} from 'remotion';
import {SebXV, FPS, SebProps} from './SebXV';
import {END} from './timing';

// Props : voice = 'voix-seb.mp3' ou mix = 'mix-seb.wav' (fichiers dans public/), null = muet
const defaults: SebProps = {voice: null, mix: null};

export const Root: React.FC = () => (
  <Composition id="SebXV" component={SebXV} durationInFrames={Math.round(END * FPS)} fps={FPS} width={1080} height={1920} defaultProps={defaults} />
);
