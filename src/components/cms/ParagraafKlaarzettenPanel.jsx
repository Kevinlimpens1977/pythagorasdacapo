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
import { publishAllBlocksInParagraaf } from '../../services/cmsService';
import { HelixLaden } from '../merk/HelixLogo';
import {
  isParagraafKlaargezet,
  isParagraafZichtbaarVoorLeerlingen,
  sortKlassenByName
} from '../../lib/lesmateriaalStudio';

export default function ParagraafKlaarzettenPanel({ paragraaf, blocks = [], onRefresh }) {
  const [klassen, setKlassen] = useState(null); // null = nog aan het laden
  const [studentCounts, setStudentCounts] = useState({});
  const [savingKlasId, setSavingKlasId] = useState(null);
  const [error, setError] = useState(null);
  const [publishing, setPublishing] = useState(false);

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

  // De klassieke valkuil: blokken gebouwd, klas aangevinkt, maar de blokken
  // staan nog op concept - dan ziet de leerling niets en telt de toewijzing
  // nul lesblokken. Daarom hier de teller met een knop die alles tegelijk
  // publiceert.
  const conceptAantal = (Array.isArray(blocks) ? blocks : []).filter(
    (block) => block && block.status !== 'published' && block.isArchived !== true
  ).length;

  const publiceerAlles = async () => {
    setPublishing(true);
    setError(null);
    try {
      await publishAllBlocksInParagraaf(paragraaf.id);
      await onRefresh?.();
    } catch (err) {
      console.error('Alles publiceren mislukt:', err);
      setError('Publiceren is niet gelukt. Probeer het opnieuw.');
    } finally {
      setPublishing(false);
    }
  };

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
            <HelixLaden tekst="Klassen laden..." className="min-h-0 py-10" />
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
                      'inline-flex cursor-pointer items-center gap-2 rounded-[var(--lo-hoek-m)] border px-3 py-2 text-sm font-bold transition-colors',
                      klaargezet
                        ? 'border-[var(--lo-blauw)] bg-[var(--lo-blauw-zacht)] text-[var(--lo-blauw-inkt)]'
                        : 'border-[var(--lo-lijn)] bg-[var(--lo-kaart)] text-[var(--lo-inkt)] hover:border-[var(--lo-blauw)]',
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
                      <span className="rounded-full bg-[var(--lo-papier-2)] px-2 py-0.5 text-[11px] font-extrabold text-[var(--lo-grijs)]">
                        {aantal} {aantal === 1 ? 'leerling' : 'leerlingen'}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          )}

          {error && (
            <p className="lo-melding lo-melding--fout mt-3 font-bold">
              {error}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-start gap-2 lg:items-end">
          {!paragraafZichtbaar && (
            <p className="lo-melding lo-melding--info items-center text-xs font-bold">
              <AlertTriangle size={14} className="shrink-0" />
              Leerlingen zien deze paragraaf pas na publiceren.
            </p>
          )}
          {conceptAantal > 0 && (
            <div className="flex flex-col items-start gap-2 rounded-[var(--lo-hoek-m)] bg-[var(--lo-oranje-zacht)] px-3 py-2 lg:items-end">
              <p className="inline-flex items-center gap-2 text-xs font-bold text-[var(--lo-oranje-inkt)]">
                <AlertTriangle size={14} className="shrink-0" />
                {conceptAantal} {conceptAantal === 1 ? 'blok is' : 'blokken zijn'} nog concept en voor leerlingen onzichtbaar.
              </p>
              <button
                type="button"
                onClick={publiceerAlles}
                disabled={publishing}
                className="lo-knop lo-knop--klein"
              >
                {publishing ? <Loader size={13} className="animate-spin" /> : null}
                Alles publiceren
              </button>
            </div>
          )}
          <Link
            to="/dashboard"
            className="lo-knop-tweede lo-knop--klein"
          >
            <BarChart3 size={15} />
            Voortgang bekijken
          </Link>
        </div>
      </div>
    </section>
  );
}
