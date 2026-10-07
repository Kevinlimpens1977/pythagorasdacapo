import { useEffect, useMemo, useState } from 'react';
import { Bell, ExternalLink, Loader2, MessageSquareReply, Save } from 'lucide-react';
import { HelixLaden } from '../components/merk/HelixLogo';
import { Label, PaginaKop } from '../components/leeromgeving';
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

// Kleur van het label per statussleutel; de service blijft de bron van de tekst.
const STATUS_KLEUR = { nieuw: 'blauw', opgepakt: 'oranje', opgelost: 'groen', afgewezen: 'blauw' };

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
    <div className="helix-page beheer-stijl lo-tekst">
      <div className="helix-container flex flex-col gap-8 py-10 md:py-12">
        <PaginaKop
          eyebrow="Meldingen"
          titel="Meldbel"
          uitleg="Alles wat via de bel rechtsonder is gemeld. Je antwoord komt bij de melder terug in diezelfde bel."
          acties={(
            <div className="lo-keuzes">
              {FILTERS.map(([sleutel, label]) => (
                <button
                  key={sleutel}
                  type="button"
                  onClick={() => setFilter(sleutel)}
                  aria-pressed={filter === sleutel}
                  className="lo-keuze"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        />

        {nieuwAantal > 0 ? (
          <p className="lo-melding lo-melding--info">
            {nieuwAantal} nieuwe {nieuwAantal === 1 ? 'melding' : 'meldingen'} sinds je laatste bezoek.
          </p>
        ) : null}

        <section>
          {loading ? (
            <HelixLaden tekst="Meldingen laden..." />
          ) : zichtbaar.length === 0 ? (
            <div className="lo-kaart items-center p-10 text-center">
              <Bell size={36} className="mx-auto text-[var(--lo-grijs)]" />
              <p className="mt-3 font-extrabold text-[var(--lo-inkt)]">
                {filter === 'open' ? 'Geen openstaande meldingen' : 'Geen meldingen gevonden'}
              </p>
              <p className="mt-1 text-sm text-[var(--lo-grijs)]">Zodra iemand op de bel klikt en iets meldt, verschijnt het hier.</p>
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
    <article className={`lo-kaart gap-0 overflow-hidden p-0 ${melding.gelezenDoorBeheer === false ? 'outline outline-2 outline-[var(--lo-blauw-zacht)]' : ''}`}>
      <button type="button" onClick={onToggle} className="flex w-full items-start gap-4 px-5 py-4 text-left">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Label kleur={STATUS_KLEUR[melding.status] || 'blauw'} className={melding.status === 'afgewezen' ? 'bg-[var(--lo-papier-2)] text-[var(--lo-grijs)]' : ''}>
              {s.label}
            </Label>
            {melding.gelezenDoorBeheer === false ? (
              <Label kleur="paars">Nieuw binnen</Label>
            ) : null}
            <span className="lo-onderregel">{datumLabel(melding.aangemaakt)}</span>
            <span className="lo-onderregel font-bold">
              {melding.melder?.naam} ({melding.melder?.rol})
            </span>
          </div>
          <p className="mt-2 font-bold text-[var(--lo-inkt)]">{melding.tekst}</p>
          <p className="lo-onderregel mt-1">Pagina: {melding.pagina || 'onbekend'} · Venster: {melding.venster || '-'}</p>
        </div>
      </button>

      {isOpen ? (
        <div className="border-t border-[var(--lo-lijn)] px-5 py-4">
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
                className="max-h-72 w-full rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] object-contain"
              />
              <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[var(--lo-blauw-inkt)]">
                <ExternalLink size={12} /> Groot bekijken
              </span>
            </a>
          ) : (
            <p className="mb-4 text-sm text-[var(--lo-grijs)]">Bij deze melding zit geen schermafbeelding.</p>
          )}

          <div className="grid gap-3 md:grid-cols-[220px_1fr_auto] md:items-end">
            <label className="block">
              <span className="lo-onderregel font-bold">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="lo-invoer mt-1"
              >
                {Object.entries(MELDING_STATUSSEN).map(([sleutel, waarde]) => (
                  <option key={sleutel} value={sleutel}>{waarde.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="lo-onderregel font-bold">
                <MessageSquareReply size={12} className="mr-1 inline" />
                Antwoord aan de melder
              </span>
              <input
                type="text"
                value={reactie}
                onChange={(e) => setReactie(e.target.value)}
                placeholder="Bijv: gevonden en opgelost, dank voor het melden!"
                className="lo-invoer mt-1"
              />
            </label>
            <button type="button" onClick={bewaar} disabled={bezig} className="lo-knop-tweede">
              {bezig ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {bewaard ? 'Bewaard' : 'Opslaan'}
            </button>
          </div>
        </div>
      ) : null}
    </article>
  );
};
