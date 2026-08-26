import { useEffect, useMemo, useState } from 'react';
import { Bell, ExternalLink, Loader2, MessageSquareReply, Save } from 'lucide-react';
import {
  MELDING_STATUSSEN,
  markMeldingGelezenDoorBeheer,
  saveMeldingAfhandeling,
  subscribeToAlleMeldingen
} from '../services/meldingenService';

/**
 * Het beheerscherm van de meldbel: alle meldingen, nieuwste eerst, met per
 * melding de schermafbeelding, een status en een antwoordveld. Het antwoord
 * komt bij de melder terug in de bel (met rood bolletje), dus schrijf het aan
 * de melder en niet als interne notitie.
 */

const datumLabel = (waarde) => {
  const d = waarde?.toDate ? waarde.toDate() : waarde;
  if (!d) return '';
  return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const FILTERS = [
  ['open', 'Open'],
  ['alles', 'Alles'],
  ['afgerond', 'Afgerond']
];

export default function AdminMeldingenPage() {
  const [meldingen, setMeldingen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('open');
  const [openMelding, setOpenMelding] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToAlleMeldingen(
      (rows) => { setMeldingen(rows); setLoading(false); },
      () => setLoading(false)
    );
    return unsubscribe;
  }, []);

  const zichtbaar = useMemo(() => {
    if (filter === 'open') return meldingen.filter((m) => m.status === 'nieuw' || m.status === 'opgepakt');
    if (filter === 'afgerond') return meldingen.filter((m) => m.status === 'opgelost' || m.status === 'afgewezen');
    return meldingen;
  }, [meldingen, filter]);

  const nieuwAantal = meldingen.filter((m) => m.gelezenDoorBeheer === false).length;

  return (
    <div className="helix-page">
      <div className="helix-container py-10 md:py-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="helix-eyebrow">Meldingen</p>
            <h1 className="helix-heading-xl mt-2">Meldbel</h1>
            <p className="helix-muted mt-3 max-w-2xl text-lg leading-8">
              Alles wat via de bel rechtsonder is gemeld. Je antwoord komt bij de melder terug in diezelfde bel.
            </p>
          </div>
          <div className="flex gap-2">
            {FILTERS.map(([sleutel, label]) => (
              <button
                key={sleutel}
                type="button"
                onClick={() => setFilter(sleutel)}
                className={`btn-tool min-h-11 px-4 text-sm ${filter === sleutel ? 'border-[var(--helix-purple)] text-[var(--helix-purple-dark)]' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {nieuwAantal > 0 ? (
          <p className="mt-6 rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-[var(--helix-soft-lavender)] px-4 py-3 text-sm font-bold text-[var(--helix-purple-dark)]">
            {nieuwAantal} nieuwe {nieuwAantal === 1 ? 'melding' : 'meldingen'} sinds je laatste bezoek.
          </p>
        ) : null}

        <section className="mt-8">
          {loading ? (
            <div className="helix-muted flex items-center gap-2 text-sm"><Loader2 size={16} className="animate-spin" /> Meldingen laden...</div>
          ) : zichtbaar.length === 0 ? (
            <div className="helix-surface p-10 text-center">
              <Bell size={36} className="mx-auto text-[var(--helix-purple)]/40" />
              <p className="mt-3 font-black text-[var(--helix-navy)]">
                {filter === 'open' ? 'Geen openstaande meldingen' : 'Geen meldingen gevonden'}
              </p>
              <p className="helix-muted mt-1 text-sm">Zodra iemand op de bel klikt en iets meldt, verschijnt het hier.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {zichtbaar.map((melding) => (
                <MeldingKaart
                  key={melding.id}
                  melding={melding}
                  isOpen={openMelding === melding.id}
                  onToggle={() => {
                    setOpenMelding(openMelding === melding.id ? null : melding.id);
                    if (melding.gelezenDoorBeheer === false) {
                      markMeldingGelezenDoorBeheer(melding.id).catch(() => {});
                    }
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

const MeldingKaart = ({ melding, isOpen, onToggle }) => {
  const s = MELDING_STATUSSEN[melding.status] || MELDING_STATUSSEN.nieuw;
  const [status, setStatus] = useState(melding.status);
  const [reactie, setReactie] = useState(melding.reactie || '');
  const [bezig, setBezig] = useState(false);
  const [bewaard, setBewaard] = useState(false);

  const bewaar = async () => {
    setBezig(true);
    setBewaard(false);
    try {
      await saveMeldingAfhandeling(melding.id, { status, reactie: reactie.trim() });
      setBewaard(true);
    } catch (e) {
      console.error('Afhandeling opslaan mislukt:', e);
    } finally {
      setBezig(false);
    }
  };

  return (
    <article className={`helix-surface overflow-hidden ${melding.gelezenDoorBeheer === false ? 'border-[var(--helix-purple)]/40' : ''}`}>
      <button type="button" onClick={onToggle} className="flex w-full items-start gap-4 px-5 py-4 text-left">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-2.5 py-0.5 text-[11px] font-black"
              style={{ color: s.kleur, background: s.achtergrond }}
            >
              {s.label}
            </span>
            {melding.gelezenDoorBeheer === false ? (
              <span className="rounded-full bg-[var(--helix-purple)] px-2.5 py-0.5 text-[11px] font-black text-white">Nieuw binnen</span>
            ) : null}
            <span className="text-xs text-slate-400">{datumLabel(melding.aangemaakt)}</span>
            <span className="text-xs font-bold text-[var(--helix-muted)]">
              {melding.melder?.naam} ({melding.melder?.rol})
            </span>
          </div>
          <p className="mt-2 font-bold text-[var(--helix-navy)]">{melding.tekst}</p>
          <p className="helix-muted mt-1 text-xs">Pagina: {melding.pagina || 'onbekend'} · Venster: {melding.venster || '-'}</p>
        </div>
      </button>

      {isOpen ? (
        <div className="border-t border-[var(--helix-border)] px-5 py-4">
          {melding.afbeeldingUrl ? (
            <a
              href={melding.afbeeldingUrl}
              target="_blank"
              rel="noreferrer"
              className="mb-4 block"
              title="Open de schermafbeelding groot in een nieuw tabblad"
            >
              <img
                src={melding.afbeeldingUrl}
                alt="Schermafbeelding bij de melding"
                className="max-h-72 w-full rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] object-contain"
              />
              <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[var(--helix-purple)]">
                <ExternalLink size={12} /> Groot bekijken
              </span>
            </a>
          ) : (
            <p className="helix-muted mb-4 text-sm">Bij deze melding zit geen schermafbeelding.</p>
          )}

          <div className="grid gap-3 md:grid-cols-[220px_1fr_auto] md:items-end">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wide text-slate-400">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="input-auth mt-1"
              >
                {Object.entries(MELDING_STATUSSEN).map(([sleutel, waarde]) => (
                  <option key={sleutel} value={sleutel}>{waarde.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wide text-slate-400">
                <MessageSquareReply size={12} className="mr-1 inline" />
                Antwoord aan de melder
              </span>
              <input
                type="text"
                value={reactie}
                onChange={(e) => setReactie(e.target.value)}
                placeholder="Bijv: gevonden en opgelost, dank voor het melden!"
                className="input-auth mt-1"
              />
            </label>
            <button type="button" onClick={bewaar} disabled={bezig} className="btn-tool min-h-11 px-4 text-sm">
              {bezig ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {bewaard ? 'Bewaard' : 'Opslaan'}
            </button>
          </div>
        </div>
      ) : null}
    </article>
  );
};
