import React, { useMemo } from 'react';
import { AbsoluteFill, Sequence, staticFile, type CalculateMetadataFunction } from 'remotion';
import { bouwTijdlijn } from '../lib/tijdlijn.mjs';
import { KLEUR } from './theme';
import { Scene } from './Scene';
import type { Draaiboek, Scene as SceneType, Timing } from './types';

// zonderBeelden: shots en portretten weglaten, om de compositie te testen
// voordat Blender en de portretten klaar zijn.
export type ExplainerProps = { hoofdstukId: string; zonderBeelden?: boolean; draaiboek: Draaiboek | null; timing: Timing | null };

export const berekenMetadata: CalculateMetadataFunction<ExplainerProps> = async ({ props }) => {
  const basis = `hoofdstukken/${props.hoofdstukId}`;
  const draaiboek = (await fetch(staticFile(`${basis}/draaiboek.json`)).then((r) => r.json())) as Draaiboek;
  const timing = (await fetch(staticFile(`${basis}/timing.json`)).then((r) => r.json())) as Timing;
  const tijdlijn = bouwTijdlijn(draaiboek, timing, 30);
  return { durationInFrames: tijdlijn.totaalFrames, props: { ...props, draaiboek, timing } };
};

export const HelixExplainer: React.FC<ExplainerProps> = ({ hoofdstukId, zonderBeelden = false, draaiboek, timing }) => {
  const tijdlijn = useMemo(() => (draaiboek && timing ? bouwTijdlijn(draaiboek, timing, 30) : null), [draaiboek, timing]);
  if (!tijdlijn || !draaiboek) return <AbsoluteFill style={{ background: KLEUR.paper }} />;
  return (
    <AbsoluteFill style={{ background: KLEUR.paper }}>
      {tijdlijn.scenes.map((scene: SceneType) => (
        <Sequence key={scene.id} from={scene.startFrame} durationInFrames={scene.duurFrames} name={scene.id}>
          <Scene scene={scene} hoofdstukId={hoofdstukId} meta={draaiboek.meta} zonderBeelden={zonderBeelden} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
