import { Lock } from 'lucide-react';
import { bordVoorHoofdstuk } from '../../lib/klasbord';
import './klasbord.css';

const STATUS_KLASSE = { top: 'kb-top', goed: 'kb-goed', zwak: 'kb-zwak', rood: 'kb-rood', open: 'kb-open', slot: 'kb-slot' };
const STATUS_TEKST = { top: 'alles goed', goed: 'af', zwak: 'af, veel fouten', rood: 'afgevinkt, vragen niet gemaakt', open: 'nog te maken', slot: 'op slot' };

/**
 * Het bord van één klas voor één hoofdstuknummer: leerlingen in rijen,
 * lesblokken in kolommen. Dezelfde tabel voor de kaart (verkleind) en voor
 * het volledige scherm.
 */
export default function KlasbordTabel({ bord, nummer }) {
  if (!bord || nummer === null || nummer === undefined) {
    return <div className="kb-leeg">Deze klas heeft nog geen lesstof toegewezen.</div>;
  }
  const deel = bordVoorHoofdstuk(bord, nummer);
  if (!deel.totaal) return <div className="kb-leeg">Geen lesblokken in dit hoofdstuk.</div>;

  // Paragrafen en hoofdstukken als groepen kolommen, voor de kopregels.
  const paragrafen = [];
  const hoofdstukken = [];
  deel.kolommen.forEach((kolom, index) => {
    const laatsteP = paragrafen[paragrafen.length - 1];
    if (laatsteP?.id === kolom.paragraafId) laatsteP.span += 1;
    else paragrafen.push({ id: kolom.paragraafId, code: kolom.code, naam: kolom.paragraaf, span: 1, start: index });
    const laatsteH = hoofdstukken[hoofdstukken.length - 1];
    if (laatsteH?.id === kolom.hoofdstukId) laatsteH.span += 1;
    else hoofdstukken.push({ id: kolom.hoofdstukId, nr: kolom.hoofdstukNr, titel: kolom.hoofdstuk, span: 1, start: index });
  });
  const hoofdstukStart = new Set(hoofdstukken.map((h) => h.start));
  const paragraafStart = new Set(paragrafen.map((p) => p.start));
  const randVan = (index) => (hoofdstukStart.has(index) ? 'kb-hstart' : paragraafStart.has(index) ? 'kb-start' : '');

  return (
    <div className="kb-tabelvak">
      <table className="kb-tabel">
        <thead>
          <tr>
            <th className="kb-naamkop" rowSpan={3} />
            {hoofdstukken.map((h) => (
              <th key={h.id} colSpan={h.span} className={`kb-hfd kb-hstart`} title={h.titel}>
                <span>H{h.nr}</span>{h.titel}
              </th>
            ))}
            <th className="kb-afkop" rowSpan={3}>af</th>
          </tr>
          <tr>
            {paragrafen.map((p) => (
              <th
                key={p.id}
                colSpan={p.span}
                className={`kb-par ${p.span === 1 ? 'kb-smal' : ''} ${hoofdstukStart.has(p.start) ? 'kb-hstart' : 'kb-start'}`}
                title={`${p.code} ${p.naam}`}
              >
                {p.code}
                <small>{p.naam}</small>
              </th>
            ))}
          </tr>
          <tr>
            {deel.kolommen.map((kolom, index) => (
              <th key={kolom.blockId} className={`kb-nr ${randVan(index)}`} title={kolom.titel}>{kolom.nr}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {deel.rijen.length === 0 && (
            <tr>
              <td className="kb-leeg" colSpan={deel.kolommen.length + 2}>Nog geen leerlingen in deze klas.</td>
            </tr>
          )}
          {deel.rijen.map((rij) => (
            <tr key={rij.uid}>
              <td className="kb-naam" title={rij.label}>{rij.label}</td>
              {rij.cellen.map((cel, index) => {
                const kolom = deel.kolommen[index];
                const titel = `${rij.label} · ${kolom.code}.${kolom.nr} ${kolom.titel}: ${cel.detail || STATUS_TEKST[cel.status]}`;
                return (
                  <td key={kolom.blockId} className={`kb-vak ${STATUS_KLASSE[cel.status]} ${randVan(index)}`} title={titel}>
                    <b>{cel.status === 'slot' && <Lock aria-hidden="true" />}</b>
                  </td>
                );
              })}
              <td className="kb-afcel">
                {rij.af}
                <small>van {deel.totaal}</small>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const LEGENDA = [
  ['var(--kb-top, #1B6B42)', 'alles goed'],
  ['var(--kb-goed, #2E9D63)', 'af'],
  ['var(--kb-zwak, #A8DCBD)', 'veel fouten'],
  ['var(--kb-rood, #D83A2E)', 'afgevinkt, vragen niet gemaakt'],
  ['var(--kb-open, #FFF0B8)', 'nog te maken']
];

export function KlasbordLegenda() {
  return (
    <span className="kb-legenda kb-bord" style={{ height: 'auto', flexDirection: 'row' }}>
      {LEGENDA.map(([kleur, tekst]) => (
        <span key={tekst}><i style={{ background: kleur, boxShadow: tekst === 'nog te maken' ? 'inset 0 0 0 1.5px #EBD27A' : undefined }} />{tekst}</span>
      ))}
      <span><i style={{ background: 'var(--kb-open, #FFF0B8)', boxShadow: 'inset 0 0 0 1.5px #EBD27A' }}><Lock aria-hidden="true" /></i>op slot</span>
    </span>
  );
}
