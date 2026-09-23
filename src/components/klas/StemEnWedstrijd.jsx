import { useCallback, useEffect, useRef, useState } from 'react';
import { Brush, CheckCircle2, Clock, Loader2, Trophy, Upload, Vote, XCircle } from 'lucide-react';
import {
  afbeeldingUrl, getStemmingen, getWedstrijden, leverOntwerpIn, stem
} from '../../services/fase5Service';

// Fase 5 op Mijn klas: stemmen over wat de klas krijgt, en de ontwerpwedstrijd.

function Afbeelding({ pad, alt }) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    let actief = true;
    afbeeldingUrl(pad).then((gevonden) => { if (actief) setUrl(gevonden); }).catch(() => {});
    return () => { actief = false; };
  }, [pad]);
  return url
    ? <img src={url} alt={alt} className="h-full w-full object-contain" />
    : <span className="flex h-full items-center justify-center"><Loader2 size={20} className="animate-spin text-[var(--helix-muted)]" /></span>;
}

export function StemmingenSectie() {
  const [stemmingen, setStemmingen] = useState([]);
  const [bezig, setBezig] = useState('');
  const [fout, setFout] = useState('');

  const laad = useCallback(async () => {
    try {
      setStemmingen((await getStemmingen()).stemmingen || []);
    } catch (error) {
      console.warn('Stemmingen niet geladen:', error);
    }
  }, []);
  useEffect(() => { Promise.resolve().then(laad); }, [laad]);

  if (stemmingen.length === 0) return null;

  const kies = async (stemming, keuze) => {
    setBezig(stemming.id);
    try {
      await stem(stemming.id, keuze);
      setFout('');
      await laad();
    } catch (error) {
      setFout(error?.message || 'Stemmen is mislukt.');
    } finally {
      setBezig('');
    }
  };

  return (
    <section className="space-y-3">
      <h2 className="ds-display text-[26px]">Stem mee</h2>
      {fout && <p className="rounded-xl border-2 border-[#D83A2E] bg-[var(--color-red-soft)] px-4 py-2 font-bold text-[var(--color-red-ink)]">{fout}</p>}
      {stemmingen.map((stemming) => {
        const totaal = (stemming.uitslag || []).reduce((som, aantal) => som + aantal, 0);
        return (
          <article key={stemming.id} className="rounded-2xl border-2 border-[#0B0D0F] bg-white p-4">
            <p className="flex items-center gap-2 font-black text-[var(--helix-navy)]"><Vote size={18} aria-hidden="true" /> {stemming.vraag}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {stemming.opties.map((optie, index) => {
                const gekozen = stemming.mijnKeuze === index;
                const procent = stemming.uitslag && totaal ? Math.round((stemming.uitslag[index] / totaal) * 100) : null;
                return (
                  <button
                    key={index}
                    type="button"
                    disabled={stemming.mijnKeuze !== null || stemming.status !== 'open' || bezig === stemming.id}
                    onClick={() => kies(stemming, index)}
                    className={`relative overflow-hidden rounded-xl border-2 px-3 py-2 text-left text-sm font-extrabold ${gekozen ? 'border-[#087EB5] bg-[#DCEFFA]' : 'border-[#0B0D0F] bg-white enabled:hover:bg-[#FFF0B8]'}`}
                  >
                    {procent !== null && <span className="absolute inset-y-0 left-0 bg-[#FFD33D]/40" style={{ width: `${procent}%` }} aria-hidden="true" />}
                    <span className="relative flex items-center justify-between gap-2">
                      {optie}
                      {gekozen && <CheckCircle2 size={16} className="text-[#087EB5]" aria-label="Jouw stem" />}
                      {procent !== null && <span>{procent}%</span>}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs font-bold text-[var(--helix-muted)]">
              {stemming.mijnKeuze !== null ? 'Je hebt gestemd.' : stemming.status === 'open' ? 'Je kunt één keer stemmen.' : 'De stemming is gesloten.'}
              {!stemming.uitslag && ' De uitslag komt als je docent hem laat zien.'}
            </p>
          </article>
        );
      })}
    </section>
  );
}

const INZENDING_STATUS = {
  ingediend: { label: 'Ingeleverd; je docent kijkt ernaar', Icoon: Clock },
  goedgekeurd: { label: 'Goedgekeurd: je klas ziet je ontwerp', Icoon: CheckCircle2 },
  afgewezen: { label: 'Niet goedgekeurd. Je mag een nieuw ontwerp inleveren.', Icoon: XCircle }
};

export function WedstrijdSectie({ uid }) {
  const [wedstrijden, setWedstrijden] = useState([]);
  const [bezig, setBezig] = useState('');
  const [melding, setMelding] = useState('');
  const [fout, setFout] = useState('');
  const invoer = useRef({});

  const laad = useCallback(async () => {
    try {
      setWedstrijden((await getWedstrijden()).wedstrijden || []);
    } catch (error) {
      console.warn('Wedstrijden niet geladen:', error);
    }
  }, []);
  useEffect(() => { Promise.resolve().then(laad); }, [laad]);

  if (wedstrijden.length === 0) return null;

  const lever = async (wedstrijd, bestand) => {
    if (!bestand) return;
    setBezig(wedstrijd.id);
    try {
      await leverOntwerpIn({ uid, wedstrijdId: wedstrijd.id, bestand });
      setMelding('Je ontwerp is ingeleverd. Je docent kijkt ernaar.');
      setFout('');
      await laad();
    } catch (error) {
      setFout(error?.message || 'Inleveren is mislukt.');
      setMelding('');
    } finally {
      setBezig('');
    }
  };

  return (
    <section className="space-y-3">
      <h2 className="ds-display text-[26px]">Ontwerpwedstrijd</h2>
      {melding && <p className="rounded-xl border-2 border-[var(--color-green-ink)] bg-[var(--color-green-soft)] px-4 py-2 font-bold text-[var(--color-green-ink)]">{melding}</p>}
      {fout && <p className="rounded-xl border-2 border-[#D83A2E] bg-[var(--color-red-soft)] px-4 py-2 font-bold text-[var(--color-red-ink)]">{fout}</p>}
      {wedstrijden.map((wedstrijd) => {
        const status = wedstrijd.mijnInzending ? INZENDING_STATUS[wedstrijd.mijnInzending.status] : null;
        const magInleveren = wedstrijd.status === 'open' && (!wedstrijd.mijnInzending || wedstrijd.mijnInzending.status === 'afgewezen');
        return (
          <article key={wedstrijd.id} className="rounded-2xl border-2 border-[#0B0D0F] bg-white p-4">
            <p className="flex items-center gap-2 text-lg font-black text-[var(--helix-navy)]"><Brush size={20} aria-hidden="true" /> {wedstrijd.thema}</p>
            {wedstrijd.uitleg && <p className="mt-1 text-sm text-[var(--helix-muted)]">{wedstrijd.uitleg}</p>}
            <p className="mt-1 text-sm font-bold">Het winnende ontwerp komt in de tokenshop, met jouw naam erbij.</p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              {magInleveren && (
                <>
                  <input
                    ref={(element) => { invoer.current[wedstrijd.id] = element; }}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(event) => lever(wedstrijd, event.target.files?.[0])}
                  />
                  <button
                    type="button"
                    onClick={() => invoer.current[wedstrijd.id]?.click()}
                    disabled={bezig === wedstrijd.id}
                    className="flex items-center gap-1.5 rounded-lg border-2 border-[#0B0D0F] bg-[#FFD33D] px-3 py-2 text-sm font-extrabold"
                  >
                    {bezig === wedstrijd.id ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} aria-hidden="true" />}
                    Ontwerp inleveren
                  </button>
                  <span className="text-xs text-[var(--helix-muted)]">Een foto of afbeelding van je tekening, png of jpg, hooguit 4 MB.</span>
                </>
              )}
              {status && (
                <span className="flex items-center gap-1.5 text-sm font-bold"><status.Icoon size={16} aria-hidden="true" /> {status.label}</span>
              )}
              {wedstrijd.status === 'gesloten' && !status && <span className="text-sm font-bold text-[var(--helix-muted)]">Deze wedstrijd is gesloten.</span>}
            </div>

            {wedstrijd.galerij.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {wedstrijd.galerij.map((inzending) => (
                  <figure key={inzending.id} className={`overflow-hidden rounded-xl border-2 ${wedstrijd.winnaarId === inzending.id ? 'border-[#FFB400] ring-4 ring-[#FFD33D]/50' : 'border-[#0B0D0F]'}`}>
                    <div className="aspect-square bg-[var(--helix-surface-soft)]"><Afbeelding pad={inzending.publiekPad} alt={`Ontwerp van ${inzending.naam}`} /></div>
                    <figcaption className="flex items-center justify-center gap-1 px-2 py-1 text-xs font-bold">
                      {wedstrijd.winnaarId === inzending.id && <Trophy size={13} className="text-[#B4520E]" aria-label="Winnaar" />}
                      {inzending.naam}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}
