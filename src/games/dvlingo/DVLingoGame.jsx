import { useCallback, useEffect, useRef, useState } from 'react';
import ExternalGameHost from '../../components/games/ExternalGameHost';
import { fetchDvlingoInstellingen } from '../../services/dvlingoService';
import { bouwSpelresultaat, leesSpelbericht } from './dvlingoScore';
import { bouwSpelLijst, isBruikbareEigenLijst } from './dvlingoWoordenlijst';

// DVLingo draait als losse statische map in public/games/. Deze component is
// alleen de koppeling met het platform: hij zet de woordenlijst klaar, start de
// schil en vertaalt de eindstand naar het scorecontract (onStart/onComplete).
// De spellogica zelf staat in de map hieronder en wordt hier niet aangeraakt.
const SPEL_URL = '/games/dvlingo/v1/index.html';
const BRON = 'dvlingo';

// De sleutel die het spel zelf gebruikt (js/opslag.js). Same-origin, dus het
// platform kan de lijst klaarzetten voordat het spel geladen wordt.
const OPSLAG_SLEUTEL = 'dvl.lijst.v1';

const zetWoordenlijstKlaar = (instellingen) => {
  const lijst = isBruikbareEigenLijst(instellingen)
    ? bouwSpelLijst(instellingen)
    : bouwSpelLijst({ gebruikEigenLijst: false, schud: false, woorden: [] });

  try {
    window.localStorage?.setItem(OPSLAG_SLEUTEL, JSON.stringify(lijst));
  } catch {
    // Opslag dicht of vol: het spel valt zelf terug op de ingebouwde lijst
    // digitale vaardigheden. Geen reden om het spel tegen te houden.
  }
};

export default function DVLingoGame({ onStart, onComplete }) {
  const [klaarVoorSpel, setKlaarVoorSpel] = useState(false);
  // Onthoudt welke eindstand al gemeld is, zodat één potje nooit twee keer
  // doorkomt. Een volgend potje mag wél opnieuw gemeld worden: de server
  // rekent zelf met replayDecay en het plafond per leerling.
  const laatsteEindstandRef = useRef('');

  // Eerst de woordenlijst klaarzetten, dan pas het spel laden: het spel leest
  // de lijst bij het opstarten en wij willen geen lijst van een vorige les.
  useEffect(() => {
    let actief = true;

    const voorbereiden = async () => {
      try {
        const instellingen = await fetchDvlingoInstellingen();
        if (!actief) return;
        zetWoordenlijstKlaar(instellingen);
      } catch {
        // Geen verbinding of geen rechten: spelen met de ingebouwde lijst.
        if (actief) zetWoordenlijstKlaar(null);
      } finally {
        if (actief) setKlaarVoorSpel(true);
      }
    };

    voorbereiden();
    return () => {
      actief = false;
    };
  }, []);

  const verwerkBericht = useCallback(
    (ruwBericht) => {
      const bericht = leesSpelbericht(ruwBericht);
      if (!bericht) return;

      if (bericht.soort === 'gestart') {
        onStart?.(bericht.op || new Date().toISOString());
        return;
      }

      if (bericht.soort === 'klaar') {
        const kenmerk = `${bericht.gestartOp}|${bericht.op}`;
        if (laatsteEindstandRef.current === kenmerk) return;
        laatsteEindstandRef.current = kenmerk;

        onComplete?.(
          bouwSpelresultaat({
            punten: bericht.punten,
            details: bericht.details,
            gestartOp: bericht.gestartOp,
            op: bericht.op
          })
        );
      }
    },
    [onComplete, onStart]
  );

  if (!klaarVoorSpel) {
    return (
      <div
        className="flex h-40 items-center justify-center rounded-2xl text-sm font-bold"
        style={{
          border: '1px solid var(--helix-border)',
          background: 'var(--helix-surface-soft)',
          color: 'var(--helix-muted)'
        }}
      >
        Het spel wordt klaargezet…
      </div>
    );
  }

  return (
    <ExternalGameHost
      bron={BRON}
      spelUrl={SPEL_URL}
      titel="DVLingo"
      onBericht={verwerkBericht}
    />
  );
}
