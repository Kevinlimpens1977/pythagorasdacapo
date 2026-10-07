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
import { HelixLaden } from '../components/merk/HelixLogo';
import { Kaart, KaartKop, Label, PaginaKop } from '../components/leeromgeving';

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
      <div className="helix-page lo-tekst"><div className="helix-container py-10">
        <p className="lo-melding lo-melding--info">Mijn klas is voor leerlingen. Het klasdoel zet je in het klasoverzicht.</p>
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
    <div className="helix-page lo-tekst min-h-full">
      <div className="helix-container flex flex-col gap-8 py-10 md:py-12">
        <PaginaKop
          titel="Mijn klas"
          acties={(
            <span className="lo-pil">
              <Heart size={17} className="lo-pil-icoon" aria-hidden="true" />
              Complimenten deze week: nog {over} van {COMPLIMENTEN_PER_WEEK}
            </span>
          )}
        />

        <div className="flex flex-col gap-6">
          {melding && <p className="lo-melding bg-[var(--lo-groen-zacht)] text-[var(--lo-groen-inkt)]">{melding}</p>}
          {fout && <p className="lo-melding lo-melding--fout">{fout}</p>}

          {!klas && !fout && (
            <HelixLaden tekst="Je klas wordt geladen" />
          )}

          {doel && <KlasDoelKaart doel={doel} />}

          {klas && (
            <section>
              <h2 className="lo-kaart-titel mb-3">Je klasgenoten</h2>
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
            <div className="grid items-start gap-4 md:grid-cols-2">
              <Kaart>
                <KaartKop titel="Wat staat er op jouw kaart?" uitleg="Je avatar, naam en niveau staan er altijd op. Je saldo en je scores nooit." />
                <div className="space-y-2">
                  {[['toonTitel', 'Mijn titel laten zien'], ['toonPins', 'Mijn pins laten zien']].map(([veld, label]) => (
                    <label key={veld} className="flex items-center gap-3 text-sm font-bold">
                      <input
                        type="checkbox"
                        checked={klas.vitrine?.[veld] !== false}
                        disabled={bezig === 'vitrine'}
                        onChange={(event) => zetVitrine(veld, event.target.checked)}
                        className="h-5 w-5 accent-[var(--lo-blauw)]"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </Kaart>

              <Kaart>
                <KaartKop titel={<><Heart size={18} className="text-[var(--lo-rood)]" aria-hidden="true" /> Complimenten voor jou</>} />
                {(klas.ontvangen || []).length === 0 ? (
                  <p className="text-sm text-[var(--lo-grijs)]">Nog geen. Geef zelf eens een compliment; dat maakt de klas fijner.</p>
                ) : (
                  <ul className="lo-lijst">
                    {klas.ontvangen.map((item, index) => (
                      <li key={index} className="lo-rij gap-2 text-sm font-bold">
                        <ComplimentIcoon soort={item.soort} className="text-[var(--lo-blauw)]" />
                        {complimentTitel(item.soort)}
                        <span className="font-normal text-[var(--lo-grijs)]">van {item.van}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Kaart>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KlasDoelKaart({ doel }) {
  const gehaald = doel.status === 'gehaald';
  return (
    <Kaart>
      <div className="flex flex-wrap items-center gap-3">
        {gehaald
          ? <PartyPopper size={30} className="text-[var(--lo-groen-inkt)]" aria-hidden="true" />
          : <Users size={30} className="text-[var(--lo-blauw)]" aria-hidden="true" />}
        <div className="min-w-0 flex-1">
          {gehaald
            ? <Label kleur="groen">Klasdoel gehaald</Label>
            : <p className="lo-eyebrow">Samen sparen voor</p>}
          <p className="lo-kaart-titel">{doel.titel}</p>
        </div>
        <p className="text-lg font-extrabold">{doel.stand} / {doel.doel}</p>
      </div>
      <span className="lo-voortgang" aria-hidden="true">
        <i style={{ width: `${klasdoelProcent(doel)}%` }} />
      </span>
      <p className="text-sm text-[var(--lo-grijs)]">
        {gehaald
          ? 'Knap gedaan, met z\'n allen. Je docent kiest het moment.'
          : `Elk blok dat je voor het eerst afmaakt met 60% of meer, telt 1 punt. Iedereen telt even zwaar: hooguit ${KLASDOEL_MAX_PER_WEEK} punten per leerling per week.`}
      </p>
    </Kaart>
  );
}

function LeerlingKaart({ kaart, alGegeven, over, bezig, kiesOpen, onKies, onGeef }) {
  const telling = Object.entries(kaart.complimenten || {}).filter(([, aantal]) => aantal > 0);
  const kanGeven = !kaart.ikZelf && !alGegeven && over > 0;
  return (
    <article className={`lo-kaart relative items-center gap-2 p-4 text-center ${kaart.ikZelf ? 'outline outline-2 outline-[var(--lo-blauw)]' : ''}`}>
      {kaart.ikZelf && <Label kleur="blauw" className="absolute left-2 top-2">Dit ben jij</Label>}
      <div className="relative">
      <div
        className="h-24 w-24 overflow-hidden rounded-full border-4 border-[var(--lo-lijn)] bg-[var(--lo-papier)]"
        style={kaart.frame?.accent ? { borderColor: kaart.frame.accent } : undefined}
      >
        {kaart.avatar ? (
          <HelixAvatar avatar={kaart.avatar} className="h-full w-full" titel={`Avatar van ${kaart.naam}`} />
        ) : kaart.plaatje?.imageUrl ? (
          <img src={kaart.plaatje.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full items-center justify-center text-[var(--lo-grijs)]"><User size={40} /></span>
        )}
      </div>
      {kaart.companion && (
        <div className="absolute -bottom-1 -right-7 h-12 w-12">
          <HelixCompanion companion={kaart.companion} stadium={kaart.companion.stadium} className="h-full w-full" titel={`Maatje van ${kaart.naam}`} />
        </div>
      )}
      </div>
      <div>
        <p className="font-extrabold text-[var(--lo-inkt)]">{kaart.naam}</p>
        <Label kleur="oranje" icoon={Star} className="mt-0.5">Niveau {kaart.niveau}</Label>
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
            <span key={index} className="flex items-center gap-1 rounded-full border border-[var(--lo-lijn)] bg-[var(--lo-papier)] py-0.5 pl-0.5 pr-2 text-[11px] font-bold">
              {pin.imageUrl ? <img src={pin.imageUrl} alt="" className="h-5 w-5 object-contain" /> : <span className="h-5 w-5 rounded-full" style={{ background: pin.accent || 'var(--lo-paars)' }} />}
              {pin.title}
            </span>
          ))}
        </div>
      )}
      {telling.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5">
          {telling.map(([soort, aantal]) => (
            <Label key={soort} kleur="blauw" title={complimentTitel(soort)} className="gap-1">
              <ComplimentIcoon soort={soort} size={12} /> {aantal}
            </Label>
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
            className="lo-knop-start w-full justify-center"
          >
            {bezig ? <Loader2 size={15} className="animate-spin" /> : <Heart size={15} aria-hidden="true" />}
            {alGegeven ? 'Deze week gegeven' : 'Compliment geven'}
          </button>
          {kiesOpen && (
            <div className="lo-kaart absolute inset-x-2 bottom-2 z-10 gap-0 rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] p-3 text-left">
              <div className="mb-1 flex items-center justify-between px-1">
                <p className="text-[13px] font-extrabold text-[var(--lo-grijs)]">Kies een compliment</p>
                <button type="button" onClick={onKies} aria-label="Sluiten" className="text-[var(--lo-grijs)]"><X size={14} /></button>
              </div>
              {COMPLIMENTEN.map((compliment) => (
                <button
                  key={compliment.id}
                  type="button"
                  onClick={() => onGeef(compliment.id)}
                  className="flex w-full items-center gap-2 rounded-[var(--lo-hoek-s)] px-2 py-1.5 text-sm font-bold hover:bg-[var(--lo-blauw-zacht)]"
                >
                  <ComplimentIcoon soort={compliment.id} className="text-[var(--lo-blauw)]" />
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
