import { useEffect, useState } from 'react';
import { CheckCircle2, Target } from 'lucide-react';
import { isoWeekSleutel } from '../../lib/beloning';
import { subscribeLeerlingWeek } from '../../services/tokenService';

// Het DV-weekdoel in de kopbalk: het hoofdstuk van deze week. Verschijnt pas
// zodra de server het weekdoel kent (na het eerste blok van dat hoofdstuk).
export default function WeekdoelPill({ studentUid, disabled = false }) {
  const [week, setWeek] = useState(null);

  useEffect(() => {
    if (!studentUid || disabled) return undefined;
    return subscribeLeerlingWeek(
      studentUid,
      'dv',
      isoWeekSleutel(new Date()),
      setWeek,
      (error) => console.warn('Weekdoel kon niet worden geladen:', error)
    );
  }, [disabled, studentUid]);

  const doel = week?.weekdoel;
  if (!doel || !doel.totaal) return null;

  if (doel.gehaald) {
    return (
      <div className="hidden min-h-11 items-center gap-2 rounded-[var(--helix-radius-md)] border border-[var(--color-green-ink)] bg-[var(--color-green-soft)] px-3 text-sm font-black text-[var(--color-green-ink)] shadow-sm md:inline-flex">
        <CheckCircle2 size={17} aria-hidden="true" />
        <span>Weekdoel gehaald</span>
      </div>
    );
  }

  const procent = Math.round((doel.gedaan / doel.totaal) * 100);
  return (
    <div
      className="hidden min-h-11 items-center gap-2 rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-white px-3 text-sm font-black text-[var(--helix-navy)] shadow-sm md:inline-flex"
      title="Weekdoel: maak het hoofdstuk van deze week af. Dan krijg je de weekkist."
    >
      <Target size={17} className="text-[#087EB5]" aria-hidden="true" />
      <span>Weekdoel {doel.gedaan}/{doel.totaal}</span>
      <span className="h-1.5 w-12 overflow-hidden rounded-full bg-[var(--helix-border)]" aria-hidden="true">
        <span className="block h-full rounded-full bg-[#2E9D63]" style={{ width: `${procent}%` }} />
      </span>
    </div>
  );
}
