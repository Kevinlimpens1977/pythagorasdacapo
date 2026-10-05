import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, Coins, Loader2, Mountain, Trophy } from 'lucide-react';
import ExternalGameHost from '../../components/games/ExternalGameHost';
import { useAuth } from '../../components/auth/AuthProvider';
import { leesKlimbitRecord, rondKlimbitPogingAf, startKlimbitPoging } from '../../services/klimbitService';
import { afgekaptTekst, KLIMBIT_BRON, leesKlimbitBericht } from './klimbitBericht';
import { KLIMBIT_BASIS_PER_KEER, KLIMBIT_DREMPEL_METER } from '../../lib/klimbitBeloning';

// KlimBit draait als losse statische map in public/games/ (net als DVLingo).
// Deze component is de koppeling met het platform: per poging vraagt hij de
// server om een pogingId (startKlimbitPoging) en rondt hij af met de
// piekhoogte (rondKlimbitPogingAf). De server meet de duur, erkent de hoogte,
// houdt het record bij en kent de tokens toe. Er gaat bewust geen onComplete
// naar de GamePlayer: die gaat uit van één uitslag per bezoek en zou via
// awardTokensForActivity onder het weekplafond uitbetalen.
const SPEL_URL = '/games/klimbit/v1/index.html';

const kaartStijl = {
  border: '1px solid var(--helix-border)',
  background: 'var(--helix-surface-soft)',
  borderRadius: 'var(--helix-radius-md)'
};

export default function KlimbitGame({ onStart }) {
  const { currentUser, isAdmin } = useAuth();
  const uid = currentUser?.uid || '';
  const [record, setRecord] = useState(null);
  const [uitslag, setUitslag] = useState(null);
  const [bezigMetAfronden, setBezigMetAfronden] = useState(false);
  const [fout, setFout] = useState('');
  // pogingNr -> Promise met het pogingId van de server (of null bij een fout).
  // Een promise, omdat 'klaar' kan aankomen voordat 'gestart' terug is.
  const pogingenRef = useRef(new Map());
  const afgerondRef = useRef(new Set());
  const reserveNrRef = useRef(0);
  const laatsteNrRef = useRef(null);
  const houderRef = useRef(null);

  useEffect(() => {
    let actief = true;
    leesKlimbitRecord(uid)
      .then((data) => {
        if (actief) setRecord(Number.isFinite(Number(data?.besteHoogte)) ? Number(data.besteHoogte) : 0);
      })
      .catch((err) => {
        console.warn('KlimBit-record laden mislukt:', err);
        if (actief) setRecord(0);
      });
    return () => {
      actief = false;
    };
  }, [uid]);

  const verwerkBericht = useCallback(
    async (ruwBericht) => {
      const bericht = leesKlimbitBericht(ruwBericht);
      if (!bericht) return;

      if (bericht.soort === 'gestart') {
        reserveNrRef.current += 1;
        const nr = bericht.pogingNr ?? `reserve-${reserveNrRef.current}`;
        laatsteNrRef.current = nr;
        afgerondRef.current.delete(nr);
        onStart?.(new Date(bericht.op ?? Date.now()).toISOString());
        setUitslag(null);
        setFout('');
        pogingenRef.current.set(
          nr,
          startKlimbitPoging({ pogingNr: bericht.pogingNr ?? undefined })
            .then((data) => data?.pogingId || null)
            .catch((err) => {
              console.warn('KlimBit-poging starten mislukt:', err);
              return null;
            })
        );
        return;
      }

      if (bericht.soort !== 'klaar') return;

      // Zonder pogingNr nemen we de laatst gestarte poging.
      const nr = bericht.pogingNr ?? laatsteNrRef.current;
      const pogingBelofte = nr === null ? null : pogingenRef.current.get(nr);
      if (nr !== null && afgerondRef.current.has(nr)) return;
      if (nr !== null) afgerondRef.current.add(nr);

      if (!pogingBelofte) {
        setFout('Deze klim is niet goed gestart en telt niet mee. Begin een nieuwe klim.');
        return;
      }

      setBezigMetAfronden(true);
      try {
        const pogingId = await pogingBelofte;
        if (!pogingId) {
          setFout('Je klim kon niet worden opgeslagen. Controleer je verbinding en probeer het opnieuw.');
          return;
        }
        const resultaat = await rondKlimbitPogingAf({ pogingId, piekHoogte: bericht.piekHoogte });
        setUitslag(resultaat);
        if (Number.isFinite(Number(resultaat?.record))) setRecord(Number(resultaat.record));
      } catch (err) {
        console.warn('KlimBit-poging afronden mislukt:', err);
        setFout(err?.message ? `Je klim kon niet worden opgeslagen: ${err.message}` : 'Je klim kon niet worden opgeslagen.');
      } finally {
        pogingenRef.current.delete(nr);
        setBezigMetAfronden(false);
      }
    },
    [onStart]
  );

  // Een klik rond het spel (rand, laadscherm) zet het toetsenbord weer in het
  // spel. Een klik ín het spel geeft het iframe zelf al focus.
  const pakFocus = useCallback(() => {
    houderRef.current?.querySelector('iframe')?.contentWindow?.focus();
  }, []);

  const verschil = uitslag ? afgekaptTekst(uitslag) : '';

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm" style={kaartStijl}>
        <span className="flex items-center gap-2 font-black text-[var(--helix-navy)]">
          <Trophy size={18} className="text-[var(--helix-purple)]" />
          Jouw record:{' '}
          {record === null ? <Loader2 size={14} className="animate-spin" /> : `${record} m`}
        </span>
        <span className="helix-muted">
          {isAdmin
            ? 'Als beheerder speel je mee zonder tokens.'
            : `Boven ${KLIMBIT_DREMPEL_METER} m verdien je tokens: de eerste keer ${KLIMBIT_BASIS_PER_KEER[0]}, de tweede ${KLIMBIT_BASIS_PER_KEER[1]}, de derde ${KLIMBIT_BASIS_PER_KEER[2]}, plus 1 per meter boven ${KLIMBIT_DREMPEL_METER}.`}
        </span>
      </div>

      {bezigMetAfronden && (
        <div className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-[var(--helix-muted)]" style={kaartStijl} role="status">
          <Loader2 size={16} className="animate-spin" /> Je klim wordt opgeslagen...
        </div>
      )}

      {fout && (
        <div className="flex items-start gap-2 px-4 py-3 text-sm font-bold text-[var(--color-red-ink)]" style={kaartStijl} role="alert">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" /> {fout}
        </div>
      )}

      {uitslag && (
        <div className="grid gap-3 sm:grid-cols-3" role="status" aria-live="polite">
          <div className="px-4 py-3" style={kaartStijl}>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[var(--helix-muted)]">
              <Mountain size={14} /> Bereikte hoogte
            </p>
            <p className="mt-1 text-2xl font-black text-[var(--helix-navy)]">{uitslag.hoogte} m</p>
            {verschil && <p className="helix-muted mt-1 text-xs">{verschil}</p>}
          </div>
          <div className="px-4 py-3" style={kaartStijl}>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[var(--helix-muted)]">
              <Trophy size={14} /> Persoonlijk record
            </p>
            <p className="mt-1 text-2xl font-black text-[var(--helix-navy)]">{uitslag.record} m</p>
            <p className="helix-muted mt-1 text-xs">
              {uitslag.nieuwRecord ? 'Nieuw record, knap gedaan!' : 'Klim nog eens om je record te verbeteren.'}
            </p>
          </div>
          <div className="px-4 py-3" style={kaartStijl}>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[var(--helix-muted)]">
              <Coins size={14} /> Tokens
            </p>
            <p className={`mt-1 text-2xl font-black ${uitslag.tokens > 0 ? 'text-[var(--color-green-ink)]' : 'text-[var(--helix-navy)]'}`}>
              {uitslag.tokens > 0 ? `+${uitslag.tokens}` : '0'}
            </p>
            <p className="helix-muted mt-1 text-xs">{uitslag.uitleg}</p>
          </div>
        </div>
      )}

      <div ref={houderRef} onClickCapture={pakFocus}>
        <ExternalGameHost
          bron={KLIMBIT_BRON}
          spelUrl={SPEL_URL}
          titel="KlimBit"
          onBericht={verwerkBericht}
          waarschuwing="Je klim loopt nog. Maak hem af in het spel, anders telt hij niet mee."
        />
      </div>
    </div>
  );
}
