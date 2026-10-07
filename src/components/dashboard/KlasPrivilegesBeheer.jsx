import { useEffect, useState } from 'react';
import { BadgeCheck, Check, Coins, Printer, Sparkles, Ticket, X } from 'lucide-react';
import { eventActief } from '../../lib/privileges';
import {
  beoordeelPrivilege, geefKlasBonus, stopKlasEvent, subscribeKlasEvent, subscribeKlasPrivileges, zetKlasEvent
} from '../../services/privilegeService';

// Fase 4 (SPELOPZET-FASE4-PRIVILEGES.md): inwisselverzoeken, een klasbonus,
// een dubbele-XP-week en de weekcertificaten van de klas.

const STATUS_LABEL = { aangevraagd: 'Aangevraagd', goedgekeurd: 'Goedgekeurd', ingewisseld: 'Ingewisseld', afgewezen: 'Afgewezen' };
const vandaag = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Amsterdam' }).format(new Date());

export default function KlasPrivilegesBeheer({ klasId = '', students = [] }) {
  const [verzoeken, setVerzoeken] = useState([]);
  const [event, setEvent] = useState(null);
  const [bonus, setBonus] = useState({ bedrag: '10', reden: '' });
  const [periode, setPeriode] = useState({ van: vandaag(), tot: '' });
  const [melding, setMelding] = useState('');
  const [fout, setFout] = useState('');
  const [bezig, setBezig] = useState('');

  useEffect(() => {
    if (!klasId) return undefined;
    const stoppen = [
      subscribeKlasPrivileges(klasId, setVerzoeken, (error) => setFout(error.message)),
      subscribeKlasEvent(klasId, setEvent, (error) => setFout(error.message))
    ];
    return () => stoppen.forEach((stop) => stop?.());
  }, [klasId]);

  const doe = async (sleutel, actie, tekst) => {
    setBezig(sleutel);
    try {
      await actie();
      setMelding(tekst);
      setFout('');
    } catch (error) {
      setFout(error?.message || 'Dat lukte niet.');
      setMelding('');
    } finally {
      setBezig('');
    }
  };

  if (!klasId) return null;
  const open = verzoeken.filter((verzoek) => ['aangevraagd', 'goedgekeurd'].includes(verzoek.status));
  const afgehandeld = verzoeken.filter((verzoek) => !['aangevraagd', 'goedgekeurd'].includes(verzoek.status)).slice(0, 15);
  const eventLoopt = eventActief(event);

  const wijsAf = (verzoek) => {
    const reden = window.prompt(`Waarom wijs je "${verzoek.titel}" van ${verzoek.naam || 'deze leerling'} af? De leerling ziet dit.`, '');
    if (reden === null) return;
    doe(verzoek.id, () => beoordeelPrivilege(verzoek.id, 'afgewezen', reden), `Afgewezen; ${verzoek.prijs} tokens zijn terug.`);
  };

  return (
    <section className="helix-card space-y-5 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="lo-kaart-titel"><Ticket size={20} aria-hidden="true" /> Privileges, bonus en event</h2>
        <a href={`/admin/certificaten/${klasId}`} target="_blank" rel="noreferrer" className="lo-knop-tweede lo-knop--klein">
          <Printer size={16} aria-hidden="true" /> Weekcertificaten printen
        </a>
      </div>
      {melding && <p className="lo-melding lo-melding--goed">{melding}</p>}
      {fout && <p className="lo-melding lo-melding--fout">{fout}</p>}

      <div>
        <h3 className="font-extrabold text-[var(--lo-inkt)]">Inwisselverzoeken ({open.length} open)</h3>
        {open.length === 0 ? (
          <p className="mt-1 text-sm text-[var(--lo-grijs)]">Geen open verzoeken.</p>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {open.map((verzoek) => (
              <li key={verzoek.id} className="flex flex-wrap items-center gap-2 rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] bg-[var(--lo-kaart)] px-3 py-2 text-sm">
                <span className="min-w-0 flex-1"><strong>{verzoek.naam || 'Leerling'}</strong>: {verzoek.titel} <span className="text-xs text-[var(--lo-grijs)]">{verzoek.week}, {verzoek.prijs} tokens</span></span>
                <span className="lo-label bg-[var(--lo-papier-2)] text-[var(--lo-grijs)]">{STATUS_LABEL[verzoek.status]}</span>
                {verzoek.status === 'aangevraagd' && (
                  <button type="button" disabled={bezig === verzoek.id} onClick={() => doe(verzoek.id, () => beoordeelPrivilege(verzoek.id, 'goedgekeurd'), 'Goedgekeurd.')} className="lo-knop-start">
                    <Check size={14} aria-hidden="true" /> Goedkeuren
                  </button>
                )}
                <button type="button" disabled={bezig === verzoek.id} onClick={() => doe(verzoek.id, () => beoordeelPrivilege(verzoek.id, 'ingewisseld'), 'Ingewisseld.')} className="lo-knop-start">
                  <BadgeCheck size={14} aria-hidden="true" /> Ingewisseld
                </button>
                <button type="button" disabled={bezig === verzoek.id} onClick={() => wijsAf(verzoek)} className="lo-knop-tweede lo-knop--klein lo-knop-tweede--gevaar">
                  <X size={14} aria-hidden="true" /> Afwijzen
                </button>
              </li>
            ))}
          </ul>
        )}
        {afgehandeld.length > 0 && (
          <details className="mt-2 text-sm">
            <summary className="cursor-pointer font-bold text-[var(--lo-grijs)]">Afgehandeld ({afgehandeld.length})</summary>
            <ul className="mt-1 space-y-1">
              {afgehandeld.map((verzoek) => (
                <li key={verzoek.id} className="text-[var(--lo-grijs)]">{verzoek.week}: {verzoek.naam || 'Leerling'}, {verzoek.titel}, {STATUS_LABEL[verzoek.status]?.toLowerCase()}{verzoek.reden ? ` (${verzoek.reden})` : ''}</li>
              ))}
            </ul>
          </details>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <form
          className="space-y-2 rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] p-4"
          onSubmit={(formEvent) => {
            formEvent.preventDefault();
            const bedrag = Number(bonus.bedrag);
            if (!window.confirm(`Iedere leerling van deze klas (${students.length}) krijgt ${bedrag} tokens. Doorgaan?`)) return;
            doe('bonus', () => geefKlasBonus(klasId, bedrag, bonus.reden), `Klasbonus van ${bedrag} tokens gegeven.`)
              .then(() => setBonus({ bedrag: '10', reden: '' }));
          }}
        >
          <h3 className="flex items-center gap-2 font-extrabold text-[var(--lo-inkt)]"><Coins size={17} aria-hidden="true" /> Klasbonus</h3>
          <div className="grid grid-cols-[90px_1fr] gap-2">
            <input type="number" min="1" max="100" value={bonus.bedrag} onChange={(e) => setBonus({ ...bonus, bedrag: e.target.value })} className="lo-invoer" aria-label="Aantal tokens" />
            <input value={bonus.reden} onChange={(e) => setBonus({ ...bonus, reden: e.target.value })} placeholder="Reden: goed gewerkt vandaag" maxLength={80} className="lo-invoer" />
          </div>
          <button type="submit" disabled={bezig === 'bonus' || !(Number(bonus.bedrag) >= 1 && Number(bonus.bedrag) <= 100)} className="helix-btn-solid">Geef aan de hele klas</button>
          <p className="lo-onderregel">1 tot en met 100 tokens. Telt niet mee voor het weekplafond.</p>
        </form>

        <div className="space-y-2 rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] p-4">
          <h3 className="flex items-center gap-2 font-extrabold text-[var(--lo-inkt)]"><Sparkles size={17} aria-hidden="true" /> Dubbele-XP-week</h3>
          {event ? (
            <>
              <p className="text-sm">
                {eventLoopt ? 'Loopt nu' : event.van > vandaag() ? 'Gepland' : 'Afgelopen'}: {event.van} tot en met {event.tot}. Alleen XP telt dubbel; tokens niet.
              </p>
              <button type="button" disabled={bezig === 'event'} onClick={() => doe('event', () => stopKlasEvent(klasId), 'Event gestopt.')} className="lo-knop-tweede lo-knop--klein">
                {eventLoopt ? 'Nu stoppen' : 'Weghalen'}
              </button>
            </>
          ) : (
            <form
              className="space-y-2"
              onSubmit={(formEvent) => {
                formEvent.preventDefault();
                doe('event', () => zetKlasEvent(klasId, periode), 'Dubbele-XP-week staat klaar.');
              }}
            >
              <div className="grid grid-cols-2 gap-2">
                <label className="lo-veldlabel">Van<input type="date" value={periode.van} onChange={(e) => setPeriode({ ...periode, van: e.target.value })} className="lo-invoer mt-1" required /></label>
                <label className="lo-veldlabel">Tot en met<input type="date" value={periode.tot} min={periode.van} onChange={(e) => setPeriode({ ...periode, tot: e.target.value })} className="lo-invoer mt-1" required /></label>
              </div>
              <button type="submit" disabled={bezig === 'event' || !periode.van || !periode.tot || periode.tot < periode.van} className="helix-btn-solid">Event plannen</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
