import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Loader2, Lock, LockOpen, RefreshCw } from 'lucide-react';

import * as cmsService from '../services/cmsService';
import * as klasService from '../services/klasService';
import { isHoofdstukVergrendeld, wisselHoofdstukSlot } from '../lib/hoofdstukSlot';

/**
 * Hoofdstukken vrijgeven: één scherm, alle klassen naast elkaar.
 *
 * Kevin zet lesstof weken vooruit klaar. Het toewijzen gebeurt per paragraaf,
 * maar het vrijgeven denkt hij in hoofdstukken en in klassen: "H2 mag open voor
 * de kb-klassen". Daarom is dit een raster en geen serie schermen - één klik is
 * één hoofdstuk voor één klas, en de knop aan het begin van de rij doet hem
 * ineens voor alle klassen die dat hoofdstuk hebben.
 *
 * Een hokje betekent: op slot. Leeg betekent open. Een streepje betekent dat de
 * klas dat hoofdstuk niet toegewezen heeft gekregen; daar valt niets vrij te
 * geven.
 */

const klasNaam = (klas) => klas?.naam || klas?.name || klas?.id || 'Klas';

export default function AdminVrijgevenPage() {
  const [klassen, setKlassen] = useState([]);
  const [hoofdstukken, setHoofdstukken] = useState([]);
  const [paragrafenPerHoofdstuk, setParagrafenPerHoofdstuk] = useState({});
  const [loading, setLoading] = useState(true);
  const [fout, setFout] = useState('');
  const [bezig, setBezig] = useState('');
  const [melding, setMelding] = useState('');

  const laden = useCallback(async () => {
    setLoading(true);
    setFout('');

    try {
      const vakken = await cmsService.getVakken();
      const rijen = [];
      const paragrafenMap = {};

      for (const vak of vakken) {
        for (const leerjaar of await cmsService.getLeerjaren(vak.id)) {
          for (const niveau of await cmsService.getNiveaus(leerjaar.id)) {
            for (const hoofdstuk of await cmsService.getHoofdstukken(niveau.id)) {
              const paragrafen = await cmsService.getParagrafen(hoofdstuk.id);
              paragrafenMap[hoofdstuk.id] = paragrafen.map((paragraaf) => paragraaf.id);
              rijen.push({
                id: hoofdstuk.id,
                titel: hoofdstuk.title || 'Hoofdstuk',
                vak: vak.naam || vak.title || vak.id,
                niveau: niveau.naam || niveau.title || niveau.id,
                aantalParagrafen: paragrafen.length
              });
            }
          }
        }
      }

      const alleKlassen = await klasService.getAvailableKlassen();
      alleKlassen.sort((a, b) => klasNaam(a).localeCompare(klasNaam(b), 'nl-NL', { numeric: true }));

      setKlassen(alleKlassen);
      setHoofdstukken(rijen);
      setParagrafenPerHoofdstuk(paragrafenMap);
    } catch (error) {
      console.error('Vrijgeefscherm laden mislukt:', error);
      setFout('De hoofdstukken en klassen konden niet geladen worden.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    laden();
  }, [laden]);

  /** Heeft deze klas dit hoofdstuk überhaupt toegewezen gekregen? */
  const heeftHoofdstuk = useCallback((klas, hoofdstukId) => {
    const toegewezen = Array.isArray(klas?.enabledParagrafen) ? klas.enabledParagrafen : [];
    const paragrafen = paragrafenPerHoofdstuk[hoofdstukId] || [];
    return paragrafen.some((paragraafId) => toegewezen.includes(paragraafId));
  }, [paragrafenPerHoofdstuk]);

  const zichtbareHoofdstukken = useMemo(
    () => hoofdstukken.filter((hoofdstuk) => klassen.some((klas) => heeftHoofdstuk(klas, hoofdstuk.id))),
    [hoofdstukken, klassen, heeftHoofdstuk]
  );

  const schrijf = async (klas, nieuweLijst) => {
    // Wat nu van het slot af gaat, is vandaag vrijgegeven (voor het weekdoel).
    const vorige = Array.isArray(klas.vergrendeldeHoofdstukken) ? klas.vergrendeldeHoofdstukken : [];
    const vrijgegeven = vorige.filter((hoofdstukId) => !nieuweLijst.includes(hoofdstukId));
    await klasService.updateKlasVergrendeldeHoofdstukken(klas.id, nieuweLijst, { vrijgegeven });
    setKlassen((huidig) => huidig.map((rij) => (
      rij.id === klas.id ? { ...rij, vergrendeldeHoofdstukken: nieuweLijst } : rij
    )));
  };

  const wissel = async (klas, hoofdstukId) => {
    const sleutel = `${klas.id}:${hoofdstukId}`;
    setBezig(sleutel);
    setFout('');
    setMelding('');

    try {
      const opSlot = isHoofdstukVergrendeld(klas, hoofdstukId);
      await schrijf(klas, wisselHoofdstukSlot(klas, hoofdstukId, !opSlot));
      setMelding(opSlot
        ? `${klasNaam(klas)} kan nu in dit hoofdstuk.`
        : `${klasNaam(klas)} ziet dit hoofdstuk staan, maar kan er nog niet in.`);
    } catch (error) {
      console.error('Slot wisselen mislukt:', error);
      setFout('Opslaan lukte niet. Probeer het zo nog eens.');
    } finally {
      setBezig('');
    }
  };

  const heleRij = async (hoofdstuk, vergrendeld) => {
    setBezig(`rij:${hoofdstuk.id}`);
    setFout('');
    setMelding('');

    try {
      const doelen = klassen.filter((klas) => heeftHoofdstuk(klas, hoofdstuk.id)
        && isHoofdstukVergrendeld(klas, hoofdstuk.id) !== vergrendeld);
      for (const klas of doelen) {
        await schrijf(klas, wisselHoofdstukSlot(klas, hoofdstuk.id, vergrendeld));
      }
      setMelding(doelen.length
        ? `${hoofdstuk.titel}: ${doelen.length} klas(sen) ${vergrendeld ? 'op slot' : 'vrijgegeven'}.`
        : 'Er viel niets te wijzigen.');
    } catch (error) {
      console.error('Slot wisselen mislukt:', error);
      setFout('Opslaan lukte niet. Probeer het zo nog eens.');
    } finally {
      setBezig('');
    }
  };

  return (
    <div className="helix-page">
      <div className="helix-container py-10 md:py-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="helix-eyebrow">Lesstof</p>
            <h1 className="helix-heading-xl mt-2">Hoofdstukken vrijgeven</h1>
            <p className="helix-muted mt-3 max-w-2xl text-lg leading-8">
              Een vinkje betekent: op slot. De klas ziet het hoofdstuk wel staan, grijs en met een
              slotje, maar kan er nog niet in. Haal het vinkje weg en het hoofdstuk is meteen open.
            </p>
          </div>
          <button type="button" onClick={laden} className="btn-secondary inline-flex items-center gap-2" disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Verversen
          </button>
        </div>

        {fout && (
          <div className="mt-6 rounded-[var(--helix-radius-md)] border border-[var(--helix-danger)]/35 bg-[var(--helix-soft-pink)] p-4 text-sm font-semibold text-[var(--helix-danger)]">
            {fout}
          </div>
        )}
        {melding && !fout && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-[var(--helix-radius-md)] border border-[var(--helix-success)]/35 bg-[var(--helix-success)]/10 px-4 py-3 text-sm font-bold text-[var(--helix-success)]">
            <CheckCircle2 size={16} />
            {melding}
          </div>
        )}

        {loading ? (
          <div className="mt-10 flex items-center gap-3 text-[var(--helix-muted)]">
            <Loader2 size={18} className="animate-spin" />
            Bezig met laden...
          </div>
        ) : zichtbareHoofdstukken.length === 0 ? (
          <p className="helix-muted mt-10">
            Er staat nog geen lesstof klaar voor een klas, dus er valt niets vrij te geven.
          </p>
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-[var(--helix-surface)] p-3 text-left font-black text-[var(--helix-navy)]">
                    Hoofdstuk
                  </th>
                  {klassen.map((klas) => (
                    <th key={klas.id} className="p-3 text-center font-black text-[var(--helix-navy)]">
                      {klasNaam(klas)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {zichtbareHoofdstukken.map((hoofdstuk) => (
                  <tr key={hoofdstuk.id} className="border-t border-[var(--helix-border)]">
                    <td className="sticky left-0 z-10 bg-[var(--helix-surface)] p-3 align-top">
                      <p className="font-bold text-[var(--helix-navy)]">{hoofdstuk.titel}</p>
                      {/* Het niveau staat erbij omdat drie hoofdstukken dezelfde
                          naam kunnen dragen (de bb-, kb- en tl-versie van H1).
                          Zonder dat erbij kies je de verkeerde rij. */}
                      <p className="text-xs font-semibold text-[var(--helix-muted)]">
                        {hoofdstuk.vak} &middot; {hoofdstuk.niveau} &middot; {hoofdstuk.aantalParagrafen} paragrafen
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => heleRij(hoofdstuk, false)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--helix-border)] bg-white px-3 py-1 text-xs font-extrabold text-[var(--helix-navy)] transition hover:border-[var(--helix-success)] hover:text-[var(--helix-success)]"
                          disabled={bezig === `rij:${hoofdstuk.id}`}
                        >
                          <LockOpen size={13} />
                          Alles vrijgeven
                        </button>
                        <button
                          type="button"
                          onClick={() => heleRij(hoofdstuk, true)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--helix-border)] bg-white px-3 py-1 text-xs font-extrabold text-[var(--helix-navy)] transition hover:border-[var(--helix-warning)] hover:text-[var(--helix-warning)]"
                          disabled={bezig === `rij:${hoofdstuk.id}`}
                        >
                          <Lock size={13} />
                          Alles op slot
                        </button>
                      </div>
                    </td>

                    {klassen.map((klas) => {
                      const heeft = heeftHoofdstuk(klas, hoofdstuk.id);
                      const opSlot = isHoofdstukVergrendeld(klas, hoofdstuk.id);
                      const sleutel = `${klas.id}:${hoofdstuk.id}`;

                      if (!heeft) {
                        return (
                          <td key={klas.id} className="p-3 text-center text-[var(--helix-muted)]" title="Deze klas heeft dit hoofdstuk niet toegewezen gekregen">
                            &ndash;
                          </td>
                        );
                      }

                      return (
                        <td key={klas.id} className="p-3 text-center">
                          <label className="inline-flex cursor-pointer flex-col items-center gap-1">
                            <input
                              type="checkbox"
                              checked={opSlot}
                              onChange={() => wissel(klas, hoofdstuk.id)}
                              disabled={bezig === sleutel}
                              className="h-5 w-5 cursor-pointer accent-[var(--helix-warning)]"
                              aria-label={`${hoofdstuk.titel} op slot voor ${klasNaam(klas)}`}
                            />
                            <span className={`text-[11px] font-black uppercase tracking-wide ${opSlot ? 'text-[var(--helix-warning)]' : 'text-[var(--helix-success)]'}`}>
                              {bezig === sleutel ? '...' : opSlot ? 'Op slot' : 'Open'}
                            </span>
                          </label>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="helix-muted mt-6 max-w-2xl text-sm">
          Een streepje betekent dat de klas dat hoofdstuk niet toegewezen heeft gekregen. Toewijzen
          doe je in Lesstof of met <code className="font-mono">scripts/zet-klas-lesstof-klaar.mjs</code>;
          hier gaat alleen het slot eraf.
        </p>
      </div>
    </div>
  );
}
