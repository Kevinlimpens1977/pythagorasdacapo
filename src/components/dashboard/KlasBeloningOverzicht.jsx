import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Star } from 'lucide-react';
import { BADGES, isoWeekSleutel, niveauVoorXp } from '../../lib/beloning';
import { getKlasBeloning } from '../../services/tokenService';
import { HelixLaden } from '../merk/HelixLogo';

/**
 * Per leerling: niveau, XP, sterren, weekreeks, badges, het DV-weekdoel en de
 * tokens van deze week. Alleen lezen; de server rekent alles uit.
 */
export default function KlasBeloningOverzicht({ klasId = '', students = [] }) {
  const [data, setData] = useState(null);
  const [fout, setFout] = useState('');
  const week = isoWeekSleutel(new Date());
  const studentIds = useMemo(() => students.map((student) => student.id).filter(Boolean), [students]);
  const sleutel = `${klasId}|${studentIds.join(',')}`;

  useEffect(() => {
    if (!klasId || !studentIds.length) return undefined;
    let actief = true;
    getKlasBeloning({ klasId, studentIds, weekSleutel: week })
      .then((resultaat) => { if (actief) { setData(resultaat); setFout(''); } })
      .catch((error) => {
        console.error('Beloningsoverzicht laden mislukt:', error);
        if (actief) setFout('Het overzicht kon niet geladen worden.');
      });
    return () => { actief = false; };
    // sleutel vat klasId en de leerlingen samen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sleutel, week]);

  const rijen = useMemo(() => [...students]
    .sort((a, b) => String(a.displayName || a.email || '').localeCompare(String(b.displayName || b.email || ''), 'nl'))
    .map((student) => {
      const voortgang = data?.voortgang?.[student.id] || null;
      const weekDv = data?.week?.[student.id]?.dv || null;
      const weekBinask = data?.week?.[student.id]?.binask || null;
      return {
        student,
        niveau: niveauVoorXp(voortgang?.xp || 0).niveau,
        xp: voortgang?.xp || 0,
        sterren: voortgang?.sterren || 0,
        reeks: voortgang?.dvReeks?.aantal || 0,
        badges: Array.isArray(voortgang?.badges) ? voortgang.badges.length : 0,
        weekdoel: weekDv?.weekdoel || null,
        tokensDv: weekDv?.tokens || 0,
        tokensBinask: weekBinask?.tokens || 0
      };
    }), [data, students]);

  const gehaald = rijen.filter((rij) => rij.weekdoel?.gehaald).length;
  const metDoel = rijen.filter((rij) => rij.weekdoel).length;

  return (
    <section className="helix-card p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="lo-eyebrow">Tokens en XP</p>
          <h2 className="lo-kaart-titel mt-1">Niveau en weekdoel ({week})</h2>
          <p className="lo-kaart-uitleg">
            {metDoel > 0
              ? `${gehaald} van ${metDoel} leerlingen met een weekdoel hebben het gehaald.`
              : 'Nog geen DV-weekdoel deze week. Dat ontstaat zodra je een hoofdstuk vrijgeeft en een leerling eraan begint.'}
          </p>
        </div>
      </div>

      {fout && <p className="lo-melding lo-melding--fout mt-3">{fout}</p>}
      {!data && !fout && (
        <HelixLaden tekst="Laden..." className="min-h-0 py-10" />
      )}

      {data && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead className="text-[13px] font-extrabold text-[var(--lo-grijs)]">
              <tr>
                <th className="px-2 py-2">Leerling</th>
                <th className="px-2 py-2">Niveau</th>
                <th className="px-2 py-2">XP</th>
                <th className="px-2 py-2">Sterren</th>
                <th className="px-2 py-2">Badges</th>
                <th className="px-2 py-2">DV-weekdoel</th>
                <th className="px-2 py-2">Weekreeks</th>
                <th className="px-2 py-2">Tokens deze week</th>
              </tr>
            </thead>
            <tbody>
              {rijen.map((rij) => (
                <tr key={rij.student.id} className="border-t border-[var(--lo-lijn)]">
                  <td className="px-2 py-2 font-bold text-[var(--lo-inkt)]">{rij.student.displayName || rij.student.email}</td>
                  <td className="px-2 py-2 font-extrabold">{rij.niveau}</td>
                  <td className="px-2 py-2">{rij.xp}</td>
                  <td className="px-2 py-2"><span className="inline-flex items-center gap-1"><Star size={14} className="text-[var(--lo-oranje-inkt)]" />{rij.sterren}</span></td>
                  <td className="px-2 py-2">{rij.badges}/{BADGES.length}</td>
                  <td className="px-2 py-2">
                    {!rij.weekdoel && <span className="text-[var(--lo-grijs)]">-</span>}
                    {rij.weekdoel?.gehaald && (
                      <span className="inline-flex items-center gap-1 font-bold text-[var(--lo-groen-inkt)]"><CheckCircle2 size={15} /> gehaald</span>
                    )}
                    {rij.weekdoel && !rij.weekdoel.gehaald && `${rij.weekdoel.gedaan} van ${rij.weekdoel.totaal}`}
                  </td>
                  <td className="px-2 py-2">{rij.reeks}</td>
                  <td className="px-2 py-2">
                    {rij.tokensDv > 0 && <span className="mr-2">DV {rij.tokensDv}</span>}
                    {rij.tokensBinask > 0 && <span>Binask {rij.tokensBinask}</span>}
                    {!rij.tokensDv && !rij.tokensBinask && <span className="text-[var(--lo-grijs)]">0</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
