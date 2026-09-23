import { useEffect, useMemo, useState } from 'react';
import { Eye, EyeOff, Flag, PartyPopper, Users } from 'lucide-react';
import { complimentTitel, klasdoelProcent } from '../../lib/klasSamen';
import {
  sluitKlasDoel, startKlasDoel, subscribeKlasComplimenten, subscribeKlasDoel, verbergCompliment
} from '../../services/klasSamenService';

// Fase 3, samen: het klasdoel van deze klas en de complimenten die leerlingen
// elkaar gaven. Het doel zet jij; de server telt de punten.
export default function KlasSamenBeheer({ klasId = '', students = [] }) {
  const [doel, setDoel] = useState(null);
  const [complimenten, setComplimenten] = useState([]);
  const [titel, setTitel] = useState('');
  const [punten, setPunten] = useState('');
  const [fout, setFout] = useState('');
  const [bezig, setBezig] = useState(false);

  useEffect(() => {
    if (!klasId) return undefined;
    const stoppen = [
      subscribeKlasDoel(klasId, setDoel, (error) => setFout(error.message)),
      subscribeKlasComplimenten(klasId, setComplimenten, (error) => setFout(error.message))
    ];
    return () => stoppen.forEach((stop) => stop?.());
  }, [klasId]);

  const naamVan = useMemo(() => {
    const kaart = new Map(students.map((student) => [student.id, student.displayName || student.email || 'Leerling']));
    return (uid) => kaart.get(uid) || 'Onbekend';
  }, [students]);
  const richtwaarde = Math.max(20, students.length * 8);
  const lopend = doel && ['actief', 'gehaald'].includes(doel.status);

  const doe = async (actie) => {
    setBezig(true);
    try {
      await actie();
      setFout('');
    } catch (error) {
      setFout(error?.message || 'Dat lukte niet.');
    } finally {
      setBezig(false);
    }
  };

  if (!klasId) return null;

  return (
    <section className="helix-card space-y-4 p-5">
      <h2 className="flex items-center gap-2 text-lg font-black text-[var(--helix-navy)]"><Users size={20} aria-hidden="true" /> Klasdoel en complimenten</h2>
      {fout && <p className="rounded-lg bg-[var(--color-red-soft)] px-3 py-2 text-sm font-bold text-[var(--color-red-ink)]">{fout}</p>}

      {lopend ? (
        <div className="rounded-xl border border-[var(--helix-border)] p-4">
          <div className="flex flex-wrap items-center gap-3">
            {doel.status === 'gehaald'
              ? <PartyPopper size={22} className="text-[var(--color-green-ink)]" aria-hidden="true" />
              : <Flag size={22} className="text-[var(--helix-purple)]" aria-hidden="true" />}
            <p className="flex-1 font-black">{doel.titel}</p>
            <p className="font-black">{doel.stand} / {doel.doel}</p>
          </div>
          <span className="mt-2 block h-3 overflow-hidden rounded-full bg-[var(--helix-border)]" aria-hidden="true">
            <span className="block h-full bg-[var(--helix-purple)]" style={{ width: `${klasdoelProcent(doel)}%` }} />
          </span>
          <p className="mt-2 text-sm text-[var(--helix-muted)]">
            {doel.status === 'gehaald'
              ? 'Gehaald. Jij kiest het moment; sluit het doel af als het klasmoment geweest is.'
              : 'Elk blok dat een leerling voor het eerst afmaakt met 60% of meer telt 1 punt; hooguit 10 per leerling per week.'}
          </p>
          <button
            type="button"
            disabled={bezig}
            onClick={() => doe(() => sluitKlasDoel(klasId))}
            className="mt-3 rounded-lg border border-[var(--helix-border)] bg-white px-3 py-2 text-sm font-bold hover:border-[var(--helix-purple)] disabled:opacity-50"
          >
            {doel.status === 'gehaald' ? 'Klasmoment gehouden, afsluiten' : 'Doel stoppen'}
          </button>
        </div>
      ) : (
        <form
          className="grid gap-3 rounded-xl border border-dashed border-[var(--helix-border)] p-4 sm:grid-cols-[1fr_140px_auto] sm:items-end"
          onSubmit={(event) => {
            event.preventDefault();
            if (!titel.trim()) return;
            doe(() => startKlasDoel(klasId, { titel, doel: punten || richtwaarde })).then(() => { setTitel(''); setPunten(''); });
          }}
        >
          <label className="text-sm font-bold">
            Beloning
            <input value={titel} onChange={(event) => setTitel(event.target.value)} placeholder="Bijvoorbeeld: spelkwartier" className="mt-1 w-full rounded-lg border border-[var(--helix-border)] px-3 py-2 font-normal" maxLength={60} />
          </label>
          <label className="text-sm font-bold">
            Punten
            <input type="number" min="1" value={punten} onChange={(event) => setPunten(event.target.value)} placeholder={String(richtwaarde)} className="mt-1 w-full rounded-lg border border-[var(--helix-border)] px-3 py-2 font-normal" />
          </label>
          <button type="submit" disabled={bezig || !titel.trim()} className="helix-btn-solid">Klasdoel starten</button>
          <p className="text-xs text-[var(--helix-muted)] sm:col-span-3">
            Richtwaarde {richtwaarde} punten: ongeveer twee weken werk voor deze klas ({students.length} leerlingen).
          </p>
        </form>
      )}

      <div>
        <h3 className="font-black text-[var(--helix-navy)]">Complimenten ({complimenten.length})</h3>
        {complimenten.length === 0 ? (
          <p className="mt-1 text-sm text-[var(--helix-muted)]">Nog geen complimenten gegeven.</p>
        ) : (
          <ul className="mt-2 max-h-64 space-y-1 overflow-y-auto pr-1">
            {complimenten.slice(0, 40).map((compliment) => (
              <li key={compliment.id} className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${compliment.verborgen ? 'bg-[var(--helix-surface-soft)] text-[var(--helix-muted)] line-through' : 'bg-white'}`}>
                <span className="min-w-0 flex-1 truncate">
                  <strong>{naamVan(compliment.van)}</strong> aan <strong>{naamVan(compliment.aan)}</strong>: {complimentTitel(compliment.soort)}
                  <span className="ml-2 text-xs text-[var(--helix-muted)]">{compliment.week}</span>
                </span>
                <button
                  type="button"
                  onClick={() => doe(() => verbergCompliment(compliment.id, !compliment.verborgen))}
                  title={compliment.verborgen ? 'Weer tonen' : 'Verbergen'}
                  aria-label={compliment.verborgen ? 'Weer tonen' : 'Verbergen'}
                  className="rounded p-1 hover:bg-[var(--helix-surface-soft)]"
                >
                  {compliment.verborgen ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
