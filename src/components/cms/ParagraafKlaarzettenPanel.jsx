/**
 * ParagraafKlaarzettenPanel
 * Vaste sectie in de paragraafweergave van het CMS: vink klassen aan om deze
 * paragraaf voor ze klaar te zetten. Schrijft hetzelfde veld als
 * TakenToewijzenPage (klassen/{id}.enabledParagrafen), via arrayUnion/arrayRemove.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, BarChart3, Loader, Users } from 'lucide-react';
import * as klasService from '../../services/klasService';
import {
  isParagraafKlaargezet,
  isParagraafZichtbaarVoorLeerlingen,
  sortKlassenByName
} from '../../lib/lesmateriaalStudio';

export default function ParagraafKlaarzettenPanel({ paragraaf }) {
  const [klassen, setKlassen] = useState(null); // null = nog aan het laden
  const [studentCounts, setStudentCounts] = useState({});
  const [savingKlasId, setSavingKlasId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const data = await klasService.getAvailableKlassen();
      if (!active) return;
      setKlassen(sortKlassenByName(data));

      // Leerlingaantal per klas komt uit dezelfde bron als AdminKlassenPage
      // (users met klasId); mislukt dat, dan laten we het aantal gewoon weg.
      const counts = await Promise.all(
        data.map(async (klas) => {
          const students = await klasService.getKlasStudents(klas.id);
          return [klas.id, students.length];
        })
      );
      if (active) setStudentCounts(Object.fromEntries(counts));
    };

    load().catch((err) => {
      console.error('Kon klassen niet laden:', err);
      if (active) {
        setKlassen([]);
        setError('Kon de klassen niet laden.');
      }
    });

    return () => {
      active = false;
    };
  }, []);

  if (!paragraaf?.id) return null;

  const paragraafZichtbaar = isParagraafZichtbaarVoorLeerlingen(paragraaf);

  const toggleKlas = async (klas) => {
    const wasKlaargezet = isParagraafKlaargezet(klas, paragraaf.id);

    try {
      setSavingKlasId(klas.id);
      setError(null);

      if (wasKlaargezet) await klasService.removeParagraafFromKlas(klas.id, paragraaf.id);
      else await klasService.addParagraafToKlas(klas.id, paragraaf.id);

      setKlassen((current) =>
        (current || []).map((item) => {
          if (item.id !== klas.id) return item;
          const huidige = Array.isArray(item.enabledParagrafen) ? item.enabledParagrafen : [];
          return {
            ...item,
            enabledParagrafen: wasKlaargezet
              ? huidige.filter((id) => id !== paragraaf.id)
              : [...huidige, paragraaf.id]
          };
        })
      );
    } catch (err) {
      console.error('Kon klaarzetten niet opslaan:', err);
      setError(`Kon de wijziging voor "${klas.name || klas.id}" niet opslaan.`);
    } finally {
      setSavingKlasId(null);
    }
  };

  return (
    <section className="helix-surface mb-5 px-5 py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Users size={18} className="shrink-0 text-[var(--helix-purple)]" />
            <h3 className="font-display text-lg font-extrabold text-[var(--helix-navy)]">
              Klaarzetten voor klassen
            </h3>
          </div>
          <p className="mt-1 text-sm leading-6 text-[var(--helix-muted)]">
            Vink een klas aan om deze paragraaf voor die leerlingen klaar te zetten.
          </p>

          {klassen === null ? (
            <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[var(--helix-muted)]">
              <Loader size={15} className="animate-spin" />
              Klassen laden...
            </p>
          ) : klassen.length === 0 ? (
            <p className="mt-3 text-sm font-bold text-[var(--helix-muted)]">
              Er zijn nog geen klassen. Maak eerst een klas aan via Klassenbeheer.
            </p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {klassen.map((klas) => {
                const klaargezet = isParagraafKlaargezet(klas, paragraaf.id);
                const aantal = studentCounts[klas.id];

                return (
                  <label
                    key={klas.id}
                    className={[
                      'inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition-colors',
                      klaargezet
                        ? 'border-fuchsia-200 bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]'
                        : 'border-[var(--helix-border)] bg-white text-[var(--helix-navy)] hover:bg-[var(--helix-surface-soft)]',
                      savingKlasId === klas.id ? 'opacity-60' : ''
                    ].join(' ')}
                  >
                    <input
                      type="checkbox"
                      checked={klaargezet}
                      disabled={savingKlasId !== null}
                      onChange={() => toggleKlas(klas)}
                      className="h-4 w-4 rounded border-slate-300 text-[var(--helix-purple)] focus:ring-fuchsia-100"
                    />
                    <span className="max-w-[12rem] truncate">{klas.name || klas.id}</span>
                    {Number.isFinite(aantal) && (
                      <span className="rounded-lg bg-white/80 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-[var(--helix-muted)]">
                        {aantal} {aantal === 1 ? 'leerling' : 'leerlingen'}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          )}

          {error && (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
              {error}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-start gap-2 lg:items-end">
          {!paragraafZichtbaar && (
            <p className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">
              <AlertTriangle size={14} className="shrink-0" />
              Leerlingen zien deze paragraaf pas na publiceren.
            </p>
          )}
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--helix-border)] bg-white px-3 py-2 text-sm font-bold text-[var(--helix-muted)] transition-colors hover:bg-[var(--helix-surface-soft)] hover:text-[var(--helix-navy)]"
          >
            <BarChart3 size={15} />
            Voortgang bekijken
          </Link>
        </div>
      </div>
    </section>
  );
}
