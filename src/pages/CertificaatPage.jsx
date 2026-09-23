import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Award, Heart, Loader2, Printer, Star, Target, User } from 'lucide-react';
import { useAuth } from '../components/auth/AuthProvider';
import HelixAvatar from '../components/avatar/HelixAvatar';
import { BADGES, isoWeekSleutel, niveauVoorXp } from '../lib/beloning';
import { getMijnKlas } from '../services/klasSamenService';
import { getKlasBeloning, subscribeLeerlingVoortgang, subscribeLeerlingWeek } from '../services/tokenService';

// Het weekcertificaat (fase 4): één A4 per leerling, om te printen. Een
// leerling print zijn eigen blad via /certificaat; de docent een hele klas
// via /admin/certificaten/:klasId. Geen saldo en geen scores.

const weekLabel = (sleutel) => {
  const [jaar, week] = String(sleutel).split('-W');
  return `week ${Number(week)}, ${jaar}`;
};

export function CertificaatBlad({ kaart, voortgang, weekDv, week }) {
  const xp = Number(voortgang?.xp) || 0;
  const niveau = niveauVoorXp(xp).niveau;
  const badges = (voortgang?.badges || []).map((id) => BADGES.find((badge) => badge.id === id)?.titel).filter(Boolean);
  const complimenten = Object.values(kaart.complimenten || {}).reduce((som, aantal) => som + aantal, 0);
  const doel = weekDv?.weekdoel;
  return (
    <article className="certificaat mx-auto flex aspect-[210/297] w-full max-w-[210mm] flex-col items-center overflow-hidden rounded-2xl border-[6px] border-[#0B0D0F] bg-[#FFF7E8] p-[8%] text-center text-[#0B0D0F] shadow-[6px_6px_0_#0B0D0F] print:rounded-none print:shadow-none">
      <p className="ds-display text-[22px] tracking-wide text-[#793AC7]">HELIX</p>
      <h1 className="ds-display mt-2 text-[56px] leading-none">Certificaat</h1>
      <p className="mt-2 text-lg font-extrabold">{weekLabel(week)}</p>

      <div className="mt-8 h-56 w-56 overflow-hidden rounded-full border-[6px] border-[#0B0D0F] bg-white">
        {kaart.avatar ? (
          <HelixAvatar avatar={kaart.avatar} className="h-full w-full" titel={`Avatar van ${kaart.naam}`} />
        ) : kaart.plaatje?.imageUrl ? (
          <img src={kaart.plaatje.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full items-center justify-center"><User size={96} /></span>
        )}
      </div>
      <p className="ds-display mt-5 text-[44px] leading-none">{kaart.naam}</p>

      <div className="mt-8 grid w-full grid-cols-2 gap-3 text-left">
        <div className="flex items-center gap-3 rounded-xl border-[3px] border-[#0B0D0F] bg-white p-3">
          <Star size={28} className="shrink-0 text-[#B4520E]" aria-hidden="true" />
          <div><p className="text-xs font-black uppercase tracking-wide">Niveau</p><p className="text-2xl font-black">{niveau}</p></div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border-[3px] border-[#0B0D0F] bg-white p-3">
          <Target size={28} className="shrink-0 text-[#087EB5]" aria-hidden="true" />
          <div>
            <p className="text-xs font-black uppercase tracking-wide">Weekdoel</p>
            <p className="text-lg font-black">{doel?.gehaald ? 'Gehaald' : doel?.totaal ? `${doel.gedaan} van ${doel.totaal}` : 'Geen deze week'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border-[3px] border-[#0B0D0F] bg-white p-3">
          <Award size={28} className="shrink-0 text-[#793AC7]" aria-hidden="true" />
          <div><p className="text-xs font-black uppercase tracking-wide">Badges</p><p className="text-2xl font-black">{badges.length}</p></div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border-[3px] border-[#0B0D0F] bg-white p-3">
          <Heart size={28} className="shrink-0 text-[#D83A2E]" aria-hidden="true" />
          <div><p className="text-xs font-black uppercase tracking-wide">Complimenten</p><p className="text-2xl font-black">{complimenten}</p></div>
        </div>
      </div>
      {badges.length > 0 && <p className="mt-4 text-sm font-bold">{badges.slice(0, 6).join(' · ')}</p>}

      <p className="mt-auto text-lg font-extrabold">Goed bezig. Ga zo door.</p>
    </article>
  );
}

function PrintKnop() {
  return (
    <button type="button" onClick={() => window.print()} className="helix-btn-solid flex items-center gap-2 print:hidden">
      <Printer size={18} aria-hidden="true" /> Printen
    </button>
  );
}

const PRINT_STIJL = `
  @page { size: A4; margin: 0; }
  @media print {
    body { background: #FFF7E8 !important; }
    .certificaat { break-after: page; height: 297mm; max-width: none; width: 210mm; border-width: 0; }
  }
`;

// Het blad van de leerling zelf.
export function EigenCertificaatPage() {
  const { currentUser } = useAuth();
  const week = isoWeekSleutel(new Date());
  const [kaart, setKaart] = useState(null);
  const [voortgang, setVoortgang] = useState(null);
  const [weekDv, setWeekDv] = useState(null);
  const [fout, setFout] = useState('');

  useEffect(() => {
    if (!currentUser?.uid) return undefined;
    let actief = true;
    getMijnKlas()
      .then((klas) => { if (actief) setKaart(klas.kaarten.find((item) => item.ikZelf) || null); })
      .catch((error) => { if (actief) setFout(error?.message || 'Laden mislukt.'); });
    const stoppen = [
      subscribeLeerlingVoortgang(currentUser.uid, setVoortgang, () => {}),
      subscribeLeerlingWeek(currentUser.uid, 'dv', week, setWeekDv, () => {})
    ];
    return () => { actief = false; stoppen.forEach((stop) => stop?.()); };
  }, [currentUser?.uid, week]);

  return (
    <div className="min-h-screen bg-[#EDE6D6] p-4 print:bg-[#FFF7E8] print:p-0">
      <style>{PRINT_STIJL}</style>
      <div className="mx-auto mb-4 flex max-w-[210mm] items-center justify-between print:hidden">
        <a href="/profiel" className="font-bold underline">Terug naar je profiel</a>
        <PrintKnop />
      </div>
      {fout && <p className="text-center font-bold text-[var(--color-red-ink)]">{fout}</p>}
      {!kaart && !fout && <p className="flex justify-center gap-2 font-bold"><Loader2 className="animate-spin" /> Je certificaat wordt gemaakt.</p>}
      {kaart && <CertificaatBlad kaart={kaart} voortgang={voortgang} weekDv={weekDv} week={week} />}
    </div>
  );
}

// Alle bladen van een klas, voor de docent.
export function KlasCertificatenPage() {
  const { klasId } = useParams();
  const week = isoWeekSleutel(new Date());
  const [klas, setKlas] = useState(null);
  const [beloning, setBeloning] = useState(null);
  const [fout, setFout] = useState('');

  useEffect(() => {
    let actief = true;
    getMijnKlas(klasId)
      .then(async (data) => {
        const beloningData = await getKlasBeloning({ klasId, studentIds: data.kaarten.map((kaart) => kaart.uid), weekSleutel: week });
        if (actief) { setKlas(data); setBeloning(beloningData); }
      })
      .catch((error) => { if (actief) setFout(error?.message || 'Laden mislukt.'); });
    return () => { actief = false; };
  }, [klasId, week]);

  const kaarten = useMemo(() => klas?.kaarten || [], [klas]);

  return (
    <div className="min-h-screen bg-[#EDE6D6] p-4 print:bg-[#FFF7E8] print:p-0">
      <style>{PRINT_STIJL}</style>
      <div className="mx-auto mb-4 flex max-w-[210mm] items-center justify-between print:hidden">
        <p className="font-bold">{kaarten.length} certificaten, {weekLabel(week)}</p>
        <PrintKnop />
      </div>
      {fout && <p className="text-center font-bold text-[var(--color-red-ink)]">{fout}</p>}
      {!klas && !fout && <p className="flex justify-center gap-2 font-bold"><Loader2 className="animate-spin" /> Certificaten worden gemaakt.</p>}
      <div className="space-y-6 print:space-y-0">
        {kaarten.map((kaart) => (
          <CertificaatBlad
            key={kaart.uid}
            kaart={kaart}
            voortgang={beloning?.voortgang?.[kaart.uid]}
            weekDv={beloning?.week?.[kaart.uid]?.dv}
            week={week}
          />
        ))}
      </div>
    </div>
  );
}
