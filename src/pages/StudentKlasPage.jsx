import { useCallback, useEffect, useState } from 'react';
import {
  Flame, HandHeart, Heart, Lightbulb, Loader2, MessageCircle, Mountain, PartyPopper, Star, User, Users, X
} from 'lucide-react';
import { useAuth } from '../components/auth/AuthProvider';
import HelixAvatar from '../components/avatar/HelixAvatar';
import HelixCompanion from '../components/avatar/HelixCompanion';
import { StemmingenSectie, WedstrijdSectie } from '../components/klas/StemEnWedstrijd';
import { COMPLIMENTEN, COMPLIMENTEN_PER_WEEK, complimentTitel, KLASDOEL_MAX_PER_WEEK, klasdoelProcent } from '../lib/klasSamen';
import { geefCompliment, getMijnKlas, updateVitrine } from '../services/klasSamenService';

// Mijn klas (fase 3, SPELOPZET-FASE3-SAMEN.md): de kaarten van klasgenoten,
// het klasdoel en complimenten. Geen ranglijst: de kaarten staan op naam.

const COMPLIMENT_ICOON = {
  geholpen: HandHeart,
  volgehouden: Mountain,
  uitleg: MessageCircle,
  samen: Users,
  inzet: Flame,
  idee: Lightbulb
};

function ComplimentIcoon({ soort, size = 14, className = '' }) {
  const Icoon = COMPLIMENT_ICOON[soort] || Heart;
  return <Icoon size={size} className={className} aria-hidden="true" />;
}

export default function StudentKlasPage() {
  const { currentUser, isAdmin, isDevBypass } = useAuth();
  const [klas, setKlas] = useState(null);
  const [fout, setFout] = useState('');
  const [melding, setMelding] = useState('');
  const [kiesVoor, setKiesVoor] = useState(null);
  const [bezig, setBezig] = useState('');

  const laad = useCallback(async () => {
    try {
      setKlas(await getMijnKlas());
    } catch (error) {
      console.error('Mijn klas laden mislukt:', error);
      setFout(error?.message || 'Mijn klas kon niet worden geladen.');
    }
  }, []);

  useEffect(() => {
    if (!currentUser?.uid || isDevBypass || isAdmin) return;
    // Laden gebeurt buiten de effect-body om, net als een abonnement.
    Promise.resolve().then(laad);
  }, [currentUser?.uid, isAdmin, isDevBypass, laad]);

  if (isAdmin) {
    return (
      <div className="helix-page"><div className="helix-container py-10">
        <p className="helix-muted">Mijn klas is voor leerlingen. Het klasdoel zet je in het klasoverzicht.</p>
      </div></div>
    );
  }

  const gegeven = klas?.gegevenDezeWeek || [];
  const over = Math.max(0, COMPLIMENTEN_PER_WEEK - gegeven.length);
  const doel = klas?.klasDoel && ['actief', 'gehaald'].includes(klas.klasDoel.status) ? klas.klasDoel : null;

  const geef = async (kaart, soort) => {
    setKiesVoor(null);
    setBezig(kaart.uid);
    try {
      await geefCompliment(kaart.uid, soort);
      setMelding(`Je gaf ${kaart.naam} een compliment: ${complimentTitel(soort)}.`);
      setFout('');
      await laad();
    } catch (error) {
      setFout(error?.message || 'Compliment geven is mislukt.');
      setMelding('');
    } finally {
      setBezig('');
    }
  };

  const zetVitrine = async (veld, waarde) => {
    setBezig('vitrine');
    try {
      await updateVitrine({ ...klas.vitrine, [veld]: waarde });
      await laad();
    } catch (error) {
      setFout(error?.message || 'Opslaan is mislukt.');
    } finally {
      setBezig('');
    }
  };

  return (
    <div className="helix-page min-h-full">
      <div className="helix-container py-8 md:py-10">
        <div className="overflow-hidden rounded-2xl border-[3px] border-[#0B0D0F] bg-[#FFF7E8] shadow-[6px_6px_0_#0B0D0F]">
          <header className="ds-anchor flex flex-wrap items-center justify-between gap-3 px-5 py-3">
            <h1 className="ds-display text-[34px]">Mijn klas</h1>
            <p className="rounded-xl border-2 border-[#0B0D0F] bg-white px-3 py-1.5 text-sm font-extrabold">
              Complimenten deze week: nog {over} van {COMPLIMENTEN_PER_WEEK}
            </p>
          </header>

          <div className="space-y-5 p-4 sm:p-6">
            {melding && <p className="rounded-xl border-2 border-[var(--color-green-ink)] bg-[var(--color-green-soft)] px-4 py-3 font-bold text-[var(--color-green-ink)]">{melding}</p>}
            {fout && <p className="rounded-xl border-2 border-[#D83A2E] bg-[var(--color-red-soft)] px-4 py-3 font-bold text-[var(--color-red-ink)]">{fout}</p>}

            {!klas && !fout && (
              <p className="flex items-center gap-2 font-bold text-[var(--helix-muted)]"><Loader2 size={18} className="animate-spin" /> Je klas wordt geladen.</p>
            )}

            {doel && <KlasDoelKaart doel={doel} />}

            {klas && (
              <section>
                <h2 className="ds-display mb-3 text-[26px]">Je klasgenoten</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {klas.kaarten.map((kaart) => (
                    <LeerlingKaart
                      key={kaart.uid}
                      kaart={kaart}
                      alGegeven={gegeven.some((item) => item.aan === kaart.uid)}
                      over={over}
                      bezig={bezig === kaart.uid}
                      kiesOpen={kiesVoor === kaart.uid}
                      onKies={() => setKiesVoor(kiesVoor === kaart.uid ? null : kaart.uid)}
                      onGeef={(soort) => geef(kaart, soort)}
                    />
                  ))}
                </div>
              </section>
            )}

            {klas && <StemmingenSectie />}
            {klas && <WedstrijdSectie uid={currentUser?.uid} />}

            {klas && (
              <div className="grid gap-4 md:grid-cols-2">
                <section className="rounded-2xl border-2 border-[#0B0D0F] bg-white p-4">
                  <h2 className="font-black text-[var(--helix-navy)]">Wat staat er op jouw kaart?</h2>
                  <p className="mt-1 text-sm text-[var(--helix-muted)]">Je avatar, naam en niveau staan er altijd op. Je saldo en je scores nooit.</p>
                  <div className="mt-3 space-y-2">
                    {[['toonTitel', 'Mijn titel laten zien'], ['toonPins', 'Mijn pins laten zien']].map(([veld, label]) => (
                      <label key={veld} className="flex items-center gap-3 text-sm font-bold">
                        <input
                          type="checkbox"
                          checked={klas.vitrine?.[veld] !== false}
                          disabled={bezig === 'vitrine'}
                          onChange={(event) => zetVitrine(veld, event.target.checked)}
                          className="h-5 w-5 accent-[#087EB5]"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border-2 border-[#0B0D0F] bg-white p-4">
                  <h2 className="flex items-center gap-2 font-black text-[var(--helix-navy)]"><Heart size={18} className="text-[#D83A2E]" aria-hidden="true" /> Complimenten voor jou</h2>
                  {(klas.ontvangen || []).length === 0 ? (
                    <p className="helix-muted mt-2 text-sm">Nog geen. Geef zelf eens een compliment; dat maakt de klas fijner.</p>
                  ) : (
                    <ul className="mt-3 space-y-1.5">
                      {klas.ontvangen.map((item, index) => (
                        <li key={index} className="flex items-center gap-2 rounded-lg bg-[var(--helix-surface-soft)] px-3 py-1.5 text-sm font-bold">
                          <ComplimentIcoon soort={item.soort} className="text-[var(--helix-purple)]" />
                          {complimentTitel(item.soort)}
                          <span className="font-normal text-[var(--helix-muted)]">van {item.van}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KlasDoelKaart({ doel }) {
  const gehaald = doel.status === 'gehaald';
  return (
    <section className={`rounded-2xl border-[3px] border-[#0B0D0F] p-4 shadow-[3px_3px_0_#0B0D0F] ${gehaald ? 'bg-[var(--color-green-soft)]' : 'bg-white'}`}>
      <div className="flex flex-wrap items-center gap-3">
        {gehaald
          ? <PartyPopper size={30} className="text-[var(--color-green-ink)]" aria-hidden="true" />
          : <Users size={30} className="text-[var(--helix-purple)]" aria-hidden="true" />}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-wide text-[var(--helix-muted)]">{gehaald ? 'Klasdoel gehaald' : 'Samen sparen voor'}</p>
          <p className="text-xl font-black text-[var(--helix-navy)]">{doel.titel}</p>
        </div>
        <p className="text-lg font-black">{doel.stand} / {doel.doel}</p>
      </div>
      <span className="mt-3 block h-4 overflow-hidden rounded-full border-2 border-[#0B0D0F] bg-white" aria-hidden="true">
        <span className="block h-full bg-[var(--helix-purple)]" style={{ width: `${klasdoelProcent(doel)}%` }} />
      </span>
      <p className="mt-2 text-sm font-bold text-[var(--helix-muted)]">
        {gehaald
          ? 'Knap gedaan, met z\'n allen. Je docent kiest het moment.'
          : `Elk blok dat je voor het eerst afmaakt met 60% of meer, telt 1 punt. Iedereen telt even zwaar: hooguit ${KLASDOEL_MAX_PER_WEEK} punten per leerling per week.`}
      </p>
    </section>
  );
}

function LeerlingKaart({ kaart, alGegeven, over, bezig, kiesOpen, onKies, onGeef }) {
  const telling = Object.entries(kaart.complimenten || {}).filter(([, aantal]) => aantal > 0);
  const kanGeven = !kaart.ikZelf && !alGegeven && over > 0;
  return (
    <article className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 bg-white p-4 text-center ${kaart.ikZelf ? 'border-[#087EB5] ring-4 ring-[#087EB5]/20' : 'border-[#0B0D0F]'}`}>
      {kaart.ikZelf && <span className="absolute left-2 top-2 rounded-full bg-[#087EB5] px-2 py-0.5 text-[11px] font-extrabold text-white">Dit ben jij</span>}
      <div className="relative">
      <div
        className="h-24 w-24 overflow-hidden rounded-full border-4 border-[#0B0D0F] bg-[var(--helix-surface-soft)]"
        style={kaart.frame?.accent ? { borderColor: kaart.frame.accent } : undefined}
      >
        {kaart.avatar ? (
          <HelixAvatar avatar={kaart.avatar} className="h-full w-full" titel={`Avatar van ${kaart.naam}`} />
        ) : kaart.plaatje?.imageUrl ? (
          <img src={kaart.plaatje.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full items-center justify-center text-[var(--helix-muted)]"><User size={40} /></span>
        )}
      </div>
      {kaart.companion && (
        <div className="absolute -bottom-1 -right-7 h-12 w-12">
          <HelixCompanion companion={kaart.companion} stadium={kaart.companion.stadium} className="h-full w-full" titel={`Maatje van ${kaart.naam}`} />
        </div>
      )}
      </div>
      <div>
        <p className="font-black text-[var(--helix-navy)]">{kaart.naam}</p>
        <p className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-[#FFF0B8] px-2 py-0.5 text-xs font-extrabold">
          <Star size={12} aria-hidden="true" /> Niveau {kaart.niveau}
        </p>
      </div>
      {kaart.titel && (
        <p className="flex items-center gap-1.5 text-sm font-bold" style={kaart.titel.accent ? { color: kaart.titel.accent } : undefined}>
          {kaart.titel.imageUrl && <img src={kaart.titel.imageUrl} alt="" className="h-5 w-5 object-contain" />}
          {kaart.titel.title}
        </p>
      )}
      {kaart.pins.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1">
          {kaart.pins.map((pin, index) => (
            <span key={index} className="flex items-center gap-1 rounded-full border border-[#0B0D0F] bg-[var(--helix-surface-soft)] py-0.5 pl-0.5 pr-2 text-[11px] font-bold">
              {pin.imageUrl ? <img src={pin.imageUrl} alt="" className="h-5 w-5 object-contain" /> : <span className="h-5 w-5 rounded-full" style={{ background: pin.accent || '#793AC7' }} />}
              {pin.title}
            </span>
          ))}
        </div>
      )}
      {telling.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5">
          {telling.map(([soort, aantal]) => (
            <span key={soort} title={complimentTitel(soort)} className="flex items-center gap-1 rounded-full bg-[var(--helix-soft-lavender)] px-2 py-0.5 text-xs font-extrabold text-[var(--helix-purple)]">
              <ComplimentIcoon soort={soort} size={12} /> {aantal}
            </span>
          ))}
        </div>
      )}

      {!kaart.ikZelf && (
        <div className="mt-auto w-full pt-1">
          <button
            type="button"
            onClick={onKies}
            disabled={!kanGeven || bezig}
            aria-expanded={kiesOpen}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border-2 border-[#0B0D0F] bg-[#FFD33D] px-3 py-1.5 text-sm font-extrabold disabled:bg-[var(--helix-surface-soft)] disabled:text-[var(--helix-muted)]"
          >
            {bezig ? <Loader2 size={15} className="animate-spin" /> : <Heart size={15} aria-hidden="true" />}
            {alGegeven ? 'Deze week gegeven' : 'Compliment geven'}
          </button>
          {kiesOpen && (
            <div className="absolute inset-x-2 bottom-2 z-10 rounded-xl border-2 border-[#0B0D0F] bg-white p-2 text-left shadow-[3px_3px_0_#0B0D0F]">
              <div className="mb-1 flex items-center justify-between px-1">
                <p className="text-xs font-black uppercase tracking-wide text-[var(--helix-muted)]">Kies een compliment</p>
                <button type="button" onClick={onKies} aria-label="Sluiten"><X size={14} /></button>
              </div>
              {COMPLIMENTEN.map((compliment) => (
                <button
                  key={compliment.id}
                  type="button"
                  onClick={() => onGeef(compliment.id)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-bold hover:bg-[var(--helix-soft-lavender)]"
                >
                  <ComplimentIcoon soort={compliment.id} className="text-[var(--helix-purple)]" />
                  {compliment.titel}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
