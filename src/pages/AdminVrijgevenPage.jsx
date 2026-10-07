import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Lock, LockOpen, RefreshCw } from 'lucide-react';

import * as cmsService from '../services/cmsService';
import * as klasService from '../services/klasService';
import { getVergrendeldeParagrafen, isHoofdstukVergrendeld, wisselHoofdstukSlot, wisselParagraafSlot } from '../lib/hoofdstukSlot';
import { paragraafLabel } from '../lib/chapterOutline';
import { HBlok, Label, PaginaKop } from '../components/leeromgeving';
import { HelixLaden } from '../components/merk/HelixLogo';

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
  const [paragraafInfo, setParagraafInfo] = useState({});
  const [openHoofdstukken, setOpenHoofdstukken] = useState([]);

  const laden = useCallback(async () => {
    setLoading(true);
    setFout('');

    try {
      const vakken = await cmsService.getVakken();
      const rijen = [];
      const paragrafenMap = {};
      const info = {};

      for (const vak of vakken) {
        for (const leerjaar of await cmsService.getLeerjaren(vak.id)) {
          for (const niveau of await cmsService.getNiveaus(leerjaar.id)) {
            for (const hoofdstuk of await cmsService.getHoofdstukken(niveau.id)) {
              const paragrafen = await cmsService.getParagrafen(hoofdstuk.id);
              paragrafenMap[hoofdstuk.id] = paragrafen.map((paragraaf) => paragraaf.id);
              paragrafen.forEach((paragraaf) => { info[paragraaf.id] = paragraaf; });
              rijen.push({
                id: hoofdstuk.id,
                nummer: hoofdstuk.number,
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
      setParagraafInfo(info);
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

  // Een losse paragraaf op slot, zodat een hoofdstuk half open kan staan.
  const wisselParagraaf = async (klas, paragraafId) => {
    const sleutel = `${klas.id}:${paragraafId}`;
    setBezig(sleutel);
    setFout('');
    setMelding('');
    try {
      const opSlot = getVergrendeldeParagrafen(klas).includes(paragraafId);
      const nieuweLijst = wisselParagraafSlot(klas, paragraafId, !opSlot);
      await klasService.updateKlasVergrendeldeParagrafen(klas.id, nieuweLijst);
      setKlassen((huidig) => huidig.map((rij) => (
        rij.id === klas.id ? { ...rij, vergrendeldeParagrafen: nieuweLijst } : rij
      )));
      setMelding(opSlot
        ? `${klasNaam(klas)} kan nu in ${paragraafLabel(paragraafInfo[paragraafId] || {})}.`
        : `${klasNaam(klas)} ziet ${paragraafLabel(paragraafInfo[paragraafId] || {})} staan, maar kan er nog niet in.`);
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
    <div className="helix-page beheer-stijl">
      <div className="helix-container py-10 md:py-12">
        <PaginaKop
          eyebrow="Lesstof"
          titel="Hoofdstukken vrijgeven"
          uitleg="Een slotje betekent: op slot. Klik op een vakje om het te wisselen. De klas ziet het hoofdstuk wel staan, grijs en met een slotje, maar kan er nog niet in."
          acties={(
            <div className="lo-knoppenbalk">
              <button type="button" onClick={laden} className="lo-knop-tweede lo-knop--klein" disabled={loading}>
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Verversen
              </button>
            </div>
          )}
        />

        {fout && (
          <div className="lo-melding lo-melding--fout mt-6">
            {fout}
          </div>
        )}
        {melding && !fout && (
          <div className="lo-melding lo-melding--goed mt-6 w-fit">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            {melding}
          </div>
        )}

        {loading ? (
          <HelixLaden tekst="Bezig met laden..." className="min-h-0 py-10" />
        ) : zichtbareHoofdstukken.length === 0 ? (
          <p className="helix-muted mt-10">
            Er staat nog geen lesstof klaar voor een klas, dus er valt niets vrij te geven.
          </p>
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-[var(--lo-kaart)] p-3 text-left text-[13px] font-extrabold text-[var(--lo-grijs)]">
                    Hoofdstuk
                  </th>
                  {klassen.map((klas) => (
                    <th key={klas.id} className="p-3 text-center text-[13px] font-extrabold text-[var(--lo-grijs)]">
                      {klasNaam(klas)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {zichtbareHoofdstukken.map((hoofdstuk) => {
                  const toegewezenKlassen = klassen.filter((klas) => heeftHoofdstuk(klas, hoofdstuk.id));
                  const alleDicht = toegewezenKlassen.length > 0
                    && toegewezenKlassen.every((klas) => isHoofdstukVergrendeld(klas, hoofdstuk.id));
                  return (
                  <Fragment key={hoofdstuk.id}>
                  <tr className="border-t border-[var(--lo-lijn)]">
                    <td className="sticky left-0 z-10 bg-[var(--lo-kaart)] p-3 align-top">
                      <div className="flex items-start gap-3">
                        <HBlok nummer={hoofdstuk.nummer} dicht={alleDicht} />
                        <div className="min-w-0">
                          <p className="font-bold text-[var(--lo-inkt)]">{hoofdstuk.titel}</p>
                          {/* Het niveau staat erbij omdat drie hoofdstukken dezelfde
                              naam kunnen dragen (de bb-, kb- en tl-versie van H1).
                              Zonder dat erbij kies je de verkeerde rij. */}
                          <p className="lo-onderregel">
                            {hoofdstuk.vak} &middot; {hoofdstuk.niveau} &middot; {hoofdstuk.aantalParagrafen} paragrafen
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => heleRij(hoofdstuk, false)}
                          className="lo-knop-start"
                          disabled={bezig === `rij:${hoofdstuk.id}`}
                        >
                          <LockOpen size={15} aria-hidden="true" />
                          Alles vrijgeven
                        </button>
                        <button
                          type="button"
                          onClick={() => heleRij(hoofdstuk, true)}
                          className="lo-knop-start"
                          disabled={bezig === `rij:${hoofdstuk.id}`}
                        >
                          <Lock size={15} aria-hidden="true" />
                          Alles op slot
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOpenHoofdstukken((huidig) => (huidig.includes(hoofdstuk.id) ? huidig.filter((id) => id !== hoofdstuk.id) : [...huidig, hoofdstuk.id]))}
                        className="lo-knop-tweede lo-knop--klein mt-2"
                        aria-expanded={openHoofdstukken.includes(hoofdstuk.id)}
                      >
                        {openHoofdstukken.includes(hoofdstuk.id) ? 'Paragrafen verbergen' : 'Per paragraaf op slot'}
                      </button>
                    </td>

                    {klassen.map((klas) => {
                      const heeft = heeftHoofdstuk(klas, hoofdstuk.id);
                      const opSlot = isHoofdstukVergrendeld(klas, hoofdstuk.id);
                      const sleutel = `${klas.id}:${hoofdstuk.id}`;

                      if (!heeft) {
                        return (
                          <td key={klas.id} className="p-3 text-center text-[var(--lo-grijs)]" title="Deze klas heeft dit hoofdstuk niet toegewezen gekregen">
                            &ndash;
                          </td>
                        );
                      }

                      return (
                        <td key={klas.id} className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => wissel(klas, hoofdstuk.id)}
                            disabled={bezig === sleutel}
                            aria-pressed={opSlot}
                            aria-label={`${hoofdstuk.titel} op slot voor ${klasNaam(klas)}`}
                            className="lo-knop-tweede lo-knop--klein min-w-[6.5rem] justify-center"
                          >
                            {bezig === sleutel
                              ? '...'
                              : opSlot
                                ? <Label kleur="oranje" icoon={Lock}>op slot</Label>
                                : <Label kleur="groen" icoon={LockOpen}>open</Label>}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                  {openHoofdstukken.includes(hoofdstuk.id) && (paragrafenPerHoofdstuk[hoofdstuk.id] || []).map((paragraafId) => (
                    <tr key={paragraafId} className="bg-[var(--lo-papier-2)]/60">
                      <td className="sticky left-0 z-10 bg-[var(--lo-papier-2)] p-2 pl-6 text-xs font-bold text-[var(--lo-inkt)]">
                        {paragraafLabel(paragraafInfo[paragraafId] || {})}
                      </td>
                      {klassen.map((klas) => {
                        const toegewezen = Array.isArray(klas.enabledParagrafen) && klas.enabledParagrafen.includes(paragraafId);
                        if (!toegewezen) return <td key={klas.id} className="p-2 text-center text-[var(--lo-grijs)]">&ndash;</td>;
                        const hoofdstukDicht = isHoofdstukVergrendeld(klas, hoofdstuk.id);
                        const opSlot = hoofdstukDicht || getVergrendeldeParagrafen(klas).includes(paragraafId);
                        const sleutel = `${klas.id}:${paragraafId}`;
                        return (
                          <td key={klas.id} className="p-2 text-center">
                            <button
                              type="button"
                              disabled={hoofdstukDicht || bezig === sleutel}
                              onClick={() => wisselParagraaf(klas, paragraafId)}
                              aria-pressed={opSlot}
                              title={hoofdstukDicht ? 'Het hele hoofdstuk staat op slot' : ''}
                              className="lo-knop-start"
                              aria-label={`${paragraafLabel(paragraafInfo[paragraafId] || {})} op slot voor ${klasNaam(klas)}`}
                            >
                              {opSlot
                                ? <><Lock size={15} aria-hidden="true" />op slot</>
                                : <><LockOpen size={15} aria-hidden="true" />open</>}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  </Fragment>
                  );
                })}
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
