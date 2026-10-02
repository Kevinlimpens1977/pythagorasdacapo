import React from 'react';
import { Composition } from 'remotion';
import { HelixExplainer, berekenMetadata, type ExplainerProps } from './HelixExplainer';

// zonderBeelden staat er expliciet in, zodat het veld in Remotion Studio zichtbaar en aan te zetten is.
const standaard: ExplainerProps = { hoofdstukId: 'hoofdstuk-binask-eoa-1-h2', zonderBeelden: false, draaiboek: null, timing: null };

export const RemotionRoot: React.FC = () => (
  <Composition
    id="HelixExplainer"
    component={HelixExplainer}
    durationInFrames={300}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={standaard}
    calculateMetadata={berekenMetadata}
  />
);
