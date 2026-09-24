import { useEffect, useMemo, useState } from 'react';
import { ClipboardCopy, GraduationCap, Lock, LockOpen } from 'lucide-react';
import * as cmsService from '../../services/cmsService';
import * as klasService from '../../services/klasService';
import { subscribeKlasCijfers } from '../../services/cijferService';
import { getVergrendeldeBlokken } from '../../lib/hoofdstukSlot';

// Cijfers uit spellen (Binask 2.2 Volume, 24 sep 2026) en de onderdelen die
// deze klas los op slot heeft. Het cijfer: 10 - 9 × minpunten / onderdelen;
// alleen de eerste ronde per spel telt, en pas als alle spellen af zijn.
export default function KlasCijfers({ klasId = '', klasData = null, students = [] }) {
  const [data, setData] = useState({ groepen: [], cijfers: [] });
  const [blokTitels, setBlokTitels] = useState({});
  const [opSlot, setOpSlot] = useState([]);
  const [melding, setMelding] = useState('');

  useEffect(() => subscribeKlasCijfers(klasId, setData, (error) => setMelding(error.message)), [klasId]);

  useEffect(() => {
    const ids = getVergrendeldeBlokken(klasData);
    let actief = true;
    Promise.resolve().then(() => { if (actief) setOpSlot(ids); });
    Promise.all(ids.map((id) => cmsService.getContentBlock(id).then((blok) => [id, blok?.title || id]).catch(() => [id, id])))
      .then((paren) => { if (actief) setBlokTitels(Object.fromEntries(paren)); });
    return () => { actief = false; };
  }, [klasData]);

  const leerlingen = useMemo(() => [...students]
    .sort((a, b) => String(a.displayName || '').localeCompare(String(b.displayName || ''), 'nl')), [students]);

  const zetOpen = async (blockId) => {
    const nieuw = opSlot.filter((id) => id !== blockId);
    await klasService.updateKlasVergrendeldeBlokken(klasId, nieuw);
    setOpSlot(nieuw);
    setMelding(`${blokTitels[blockId] || 'Het onderdeel'} staat open voor deze klas.`);
  };

  if (!klasId || (data.groepen.length === 0 && opSlot.length === 0)) return null;

  return (
    <section className="helix-card space-y-5 p-5">
      {melding && <p className="rounded-lg bg-[var(--color-green-soft)] px-3 py-2 text-sm font-bold text-[var(--color-green-ink)]">{melding}</p>}

      {opSlot.length > 0 && (
        <div>
          <h2 className="flex items-center gap-2 text-lg font-black text-[var(--helix-navy)]"><Lock size={20} aria-hidden="true" /> Onderdelen op slot</h2>
          <ul className="mt-2 space-y-1.5">
            {opSlot.map((id) => (
              <li key={id} className="flex flex-wrap items-center gap-2 rounded-lg border-2 border-dashed border-[#BDB3A0] bg-[#FFFCF6] px-3 py-2 text-sm">
                <span className="flex-1 font-bold">{blokTitels[id] || id}</span>
                <button type="button" onClick={() => zetOpen(id)} className="flex items-center gap-1 rounded-lg border border-[var(--helix-border)] bg-white px-2.5 py-1 text-xs font-extrabold hover:border-[var(--helix-success)]">
                  <LockOpen size={13} aria-hidden="true" /> Openzetten
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.groepen.map((groep) => {
        const perLeerling = new Map(data.cijfers.filter((cijfer) => cijfer.groepId === groep.id).map((cijfer) => [cijfer.studentUid, cijfer]));
        const cijfers = leerlingen.map((leerling) => perLeerling.get(leerling.id)?.cijfer).filter((cijfer) => typeof cijfer === 'number');
        const gemiddelde = cijfers.length ? (cijfers.reduce((som, cijfer) => som + cijfer, 0) / cijfers.length).toFixed(1).replace('.', ',') : '-';
        const kopieer = () => {
          const regels = leerlingen.map((leerling) => {
            const cijfer = perLeerling.get(leerling.id)?.cijfer;
            return `${leerling.displayName || leerling.email}\t${typeof cijfer === 'number' ? String(cijfer).replace('.', ',') : ''}`;
          });
          navigator.clipboard?.writeText(regels.join('\n'));
          setMelding('Namen en cijfers staan op je klembord. Plak ze in je cijferadministratie.');
        };
        return (
          <div key={groep.id}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-lg font-black text-[var(--helix-navy)]"><GraduationCap size={20} aria-hidden="true" /> Cijfer {groep.titel}</h2>
              <div className="flex items-center gap-3 text-sm font-bold">
                <span>{cijfers.length} van {leerlingen.length} klaar · gemiddeld {gemiddelde}</span>
                <button type="button" onClick={kopieer} className="flex items-center gap-1 rounded-lg border border-[var(--helix-border)] bg-white px-2.5 py-1 text-xs font-extrabold">
                  <ClipboardCopy size={13} aria-hidden="true" /> Kopiëren
                </button>
              </div>
            </div>
            <p className="mt-1 text-xs text-[var(--helix-muted)]">
              Cijfer = 10 - 9 × minpunten / onderdelen. Alleen de eerste ronde van elk spel telt; het cijfer komt als alle {groep.blockIds?.length || 0} spellen af zijn.
            </p>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-[var(--helix-muted)]">
                  <tr><th className="py-1 pr-3">Leerling</th><th className="py-1 pr-3">Cijfer</th><th className="py-1 pr-3">Minpunten</th><th className="py-1">Spellen</th></tr>
                </thead>
                <tbody>
                  {leerlingen.map((leerling) => {
                    const cijfer = perLeerling.get(leerling.id);
                    return (
                      <tr key={leerling.id} className="border-t border-[var(--helix-border)]">
                        <td className="py-1.5 pr-3 font-bold">{leerling.displayName || leerling.email}</td>
                        <td className="py-1.5 pr-3 text-base font-black">{typeof cijfer?.cijfer === 'number' ? String(cijfer.cijfer.toFixed(1)).replace('.', ',') : '-'}</td>
                        <td className="py-1.5 pr-3">{cijfer ? `${cijfer.minpunten} van ${cijfer.onderdelen}` : '-'}</td>
                        <td className="py-1.5">{cijfer ? `${cijfer.aantalAf} van ${cijfer.aantalNodig}` : `0 van ${groep.blockIds?.length || 0}`}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </section>
  );
}
