import React from 'react';
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Audio } from '@remotion/media';
import { KLEUR, KOLOM, MAAT } from './theme';
import type { Getekend, Klok, Scene as SceneType } from './types';
import { TitelVak } from './onderdelen/TitelVak';
import { ComicPaneel } from './onderdelen/ComicPaneel';
import { Kernwoorden } from './onderdelen/Kernwoorden';
import { SamiGroot, SprekerLabel } from './onderdelen/SprekerLabel';
import { Weegschaal } from './onderdelen/Weegschaal';
import { Maatcilinder } from './onderdelen/Maatcilinder';
import { Formule } from './onderdelen/Formule';
import { Driehoek } from './onderdelen/Driehoek';
import { Opgave } from './onderdelen/Opgave';
import { Kaarten } from './onderdelen/Kaarten';

type Props = { scene: SceneType; hoofdstukId: string; meta: string; zonderBeelden: boolean };

const maakKlok = (scene: SceneType): Klok => {
  const zoek = (id: string) => {
    const regel = scene.regels.find((r) => r.id === id);
    if (!regel) throw new Error(`Regel ${id} niet gevonden in scène ${scene.id}.`);
    return regel;
  };
  return {
    begin: (id) => zoek(id).startFrame - scene.startFrame,
    einde: (id) => zoek(id).startFrame + zoek(id).duurFrames - scene.startFrame,
  };
};

// De regel waarop een getekend onderdeel verschijnt. Een opgave heeft in het
// draaiboek geen `bij`, alleen `aftelBij`: de vraag staat er dan vanaf het
// moment dat de docent hem voorleest. Een onderdeel met geen van beide kan
// nergens verschijnen: dat is een fout in het draaiboek, geen ontbrekende regel.
const verschijntBij = (item: Getekend, sceneId: string): string => {
  const bij = item.bij ?? (typeof item.aftelBij === 'string' ? item.aftelBij : undefined);
  if (!bij) throw new Error(`Getekend onderdeel "${item.type}" in scène ${sceneId} heeft geen bij of aftelBij.`);
  return bij;
};

const GetekendOnderdeel: React.FC<{ item: Getekend; klok: Klok; sceneId: string }> = ({ item, klok, sceneId }) => {
  const start = klok.begin(verschijntBij(item, sceneId));
  // Het draaiboek is losse JSON per type. De validator controleert de verwijzingen naar regels
  // en de velden van een driehoek; de overige velden per type worden hier ongecontroleerd gelezen.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = item as Record<string, any>;
  switch (item.type) {
    case 'weegschaal':
      return <Weegschaal items={g.items} eenheid={g.eenheid} start={start} />;
    case 'maatcilinder':
      return <Maatcilinder van={g.van} naar={g.naar} max={g.max} stap={g.stap} eenheid={g.eenheid} start={start} stijg={g.stijgBij ? klok.begin(g.stijgBij) : undefined} voorwerp={g.voorwerp} labels={g.labels} oog={g.oog} />;
    case 'formule':
      return <Formule regels={g.regels.map((r: { tekst: string; bij: string }) => ({ tekst: r.tekst, start: klok.begin(r.bij) }))} />;
    case 'driehoek':
      return <Driehoek start={start} boven={g.boven} linksOnder={g.linksOnder} rechtsOnder={g.rechtsOnder} formules={g.formules} />;
    case 'opgave':
      return <Opgave vraag={g.vraag} antwoord={g.antwoord} aftelStart={klok.einde(g.aftelBij)} aftelSeconden={g.aftelSeconden} antwoordStart={klok.begin(g.antwoordBij)} />;
    case 'kaarten':
      return <Kaarten kaarten={g.kaarten} start={start} />;
    default:
      throw new Error(`Onbekend getekend onderdeel: ${item.type}`);
  }
};

export const Scene: React.FC<Props> = ({ scene, hoofdstukId, meta, zonderBeelden }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const klok = maakKlok(scene);
  const nu = scene.regels.find((r) => frame >= klok.begin(r.id) && frame < klok.einde(r.id));
  const laatsteSami = [...scene.regels].reverse().find((r) => r.spreker === 'sami' && klok.begin(r.id) <= frame);
  // Een scène zonder getekende onderdelen of kernwoorden mag: dan is de lijst leeg.
  const zichtbaar = (scene.getekend ?? []).filter((item) => frame >= klok.begin(verschijntBij(item, scene.id)) && (!item.tot || frame < klok.begin(item.tot)));
  const status = scene.indeling === 'STATUS';

  return (
    <AbsoluteFill style={{ background: KLEUR.paper }}>
      <TitelVak kop={scene.kop} fase={scene.fase} meta={meta} />
      {scene.shot && (
        <ComicPaneel
          hoofdstukId={hoofdstukId}
          naam={scene.shot.naam}
          frames={scene.shot.frames}
          startFrame={scene.shot.startBij ? klok.begin(scene.shot.startBij) : 0}
          x={scene.indeling === 'FOCUS' ? KOLOM.breed.x : KOLOM.links.x}
          w={scene.indeling === 'FOCUS' ? KOLOM.breed.w : KOLOM.links.w}
          zonderBeeld={zonderBeelden}
        />
      )}
      {scene.indeling === 'FOCUS' && laatsteSami && <SamiGroot uitdrukking={laatsteSami.samiUitdrukking || 'vragend'} zonderBeeld={zonderBeelden} />}
      {scene.indeling === 'SPLIT' && (
        <div style={{ position: 'absolute', left: KOLOM.midden.x, top: MAAT.vlakBoven, width: KOLOM.midden.w, height: MAAT.vlakHoogte }}>
          {zichtbaar.map((item) => (
            <div key={`${item.type}-${verschijntBij(item, scene.id)}`} style={{ position: 'absolute', inset: 0 }}>
              <GetekendOnderdeel item={item} klok={klok} sceneId={scene.id} />
            </div>
          ))}
        </div>
      )}
      {status && zichtbaar.map((item) => <GetekendOnderdeel key={`${item.type}-${verschijntBij(item, scene.id)}`} item={item} klok={klok} sceneId={scene.id} />)}
      {scene.indeling === 'SPLIT' && <Kernwoorden items={scene.kernwoorden ?? []} klok={klok} />}
      {nu?.spreker === 'sami' && scene.indeling !== 'FOCUS' && <SprekerLabel uitdrukking={nu.samiUitdrukking || 'vragend'} zonderBeeld={zonderBeelden} />}
      {scene.regels.map((regel) => (
        // Omhoog afronden op de echte duur: de frame-afgeronde duurFrames kan tot een frame korter zijn dan de mp3.
        <Sequence key={regel.id} from={klok.begin(regel.id)} durationInFrames={Math.ceil(regel.duur * fps)} layout="none" name={regel.id}>
          <Audio src={staticFile(`hoofdstukken/${hoofdstukId}/${regel.bestand}`)} />
        </Sequence>
      ))}
      {(scene.geluiden || []).map((geluid) => (
        <Sequence key={`${geluid.bestand}-${geluid.bij}`} from={klok.begin(geluid.bij) + Math.round(geluid.na * fps)} layout="none" name={geluid.bestand}>
          <Audio src={staticFile(`hoofdstukken/${hoofdstukId}/${geluid.bestand}`)} volume={0.6} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
