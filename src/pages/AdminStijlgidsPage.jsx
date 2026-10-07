import { useState } from 'react';
import { BookOpen, Coins, House, Lightbulb, ListChecks, Lock, Presentation, RefreshCw } from 'lucide-react';

import { HoofdstukRij, Kaart, KaartKop, Keuzeknoppen, Label, PaginaKop, ParagraafRij, StartKnop } from '../components/leeromgeving';
import StudyStepRail from '../components/lesson/StudyStepRail';
import HelixLogo, { HelixLaden } from '../components/merk/HelixLogo';
import { aantalTekst, hoofdstukOnderregel } from '../lib/leeromgeving';

/**
 * Stijlgids van de HELIX Leeromgeving-stijl, met voorbeelddata. Leest niets uit
 * Firestore, zodat hij ook met de ontwikkelaarslogin werkt en door
 * tests/e2e/leeromgeving-stijl.spec.js opgemeten kan worden.
 * Dit is niet het Slide Design System.
 */

const VOORBEELD_H2 = [
  { code: '2.1', naam: 'Massa', blokken: 7 },
  { code: '2.2', naam: 'Volume', blokken: 11 },
  { code: '2.3', naam: 'Dichtheid', blokken: 9 }
];

const VMBO_KLASSEN = ['H1B1', 'H1B2', 'H1K1', 'H1K2', 'H1K3', 'H1TL1', 'H1TL2', 'H1TL3'].map((naam) => ({ id: naam, naam }));

const KLEUREN = [
  ['--lo-papier', '#FFFBF4'], ['--lo-papier-2', '#FBEBD0'], ['--lo-kaart', '#FFFFFF'], ['--lo-lijn', '#E8DCC3'],
  ['--lo-inkt', '#0B0D0F'], ['--lo-grijs', '#5B5648'], ['--lo-geel', '#FFD33D'], ['--lo-geel-zacht', '#FFF0B8'],
  ['--lo-blauw', '#087EB5'], ['--lo-blauw-inkt', '#066A99'], ['--lo-blauw-zacht', '#E1F0F8'], ['--lo-paars', '#793AC7'],
  ['--lo-paars-zacht', '#ECE3F8'], ['--lo-groen', '#2E9D63'], ['--lo-groen-zacht', '#DFF2E7'], ['--lo-oranje-zacht', '#FDE7D6'],
  ['--lo-rood', '#D83A2E'], ['--lo-rood-zacht', '#FADDDA']
];

const geenActie = () => {};

const VOORBEELD_STAPPEN = [
  { id: 's1', title: 'Presentatie', type: 'slidedeck', isDone: true, statusLabel: 'Bekeken' },
  { id: 's2', title: 'Theorie: wat is dichtheid?', type: 'theory', isDone: true },
  { id: 's3', title: 'Voorbeeld: een blokje hout', type: 'example', isActive: true },
  { id: 's4', title: 'Schriftopdracht', type: 'theory' },
  { id: 's5', title: 'Korte check', type: 'quiz' }
];

const STAP_ICONEN = { slidedeck: Presentation, theory: BookOpen, example: Lightbulb, quiz: ListChecks };

export default function AdminStijlgidsPage() {
  const [open, setOpen] = useState({ h1: false, h2: true });
  const [klas, setKlas] = useState('H1B1');
  const wissel = (sleutel) => setOpen((stand) => ({ ...stand, [sleutel]: !stand[sleutel] }));

  return (
    <div className="helix-page lo-tekst">
      <div className="helix-container flex flex-col gap-8 py-10 md:py-12">
        <PaginaKop
          eyebrow="Stijl"
          titel="Stijlgids leeromgeving"
          uitleg="Alle bouwstenen van de HELIX Leeromgeving-stijl, met voorbeelddata. Dit is de stijl van de website, niet het Slide Design System van de decks."
        />

        <div data-stijlgids="logo" className="lo-kaartenraster">
          <Kaart>
            <KaartKop titel="Logo" uitleg="Het woordmerk in de menubalk en op de inlogpagina; alleen het H-blok op een telefoon en als tabbladicoon." />
            <div className="flex flex-wrap items-end gap-8">
              <HelixLogo className="h-12" />
              <HelixLogo className="h-9" />
              <HelixLogo variant="blok" className="h-10" />
              <HelixLogo variant="blok" className="h-6" />
            </div>
          </Kaart>
          <Kaart>
            <KaartKop titel="Laden" uitleg="Als een pagina of onderdeel laadt: drie stipjes die om de beurt een klein beetje omhoog gaan." />
            <HelixLaden className="min-h-0 py-6" tekst="Voorbeeld van laden" />
          </Kaart>
        </div>

        <div className="lo-kaartenraster">
          <div data-stijlgids="optie-d">
            <Kaart>
              <KaartKop kolf titel="ER3L1A" uitleg="Binask · leerroute niveau-binask-eoa-1-lr3" />
              <div className="lo-lijst">
                <HoofdstukRij
                  nummer={1}
                  titel="Stoffen"
                  onderregel={hoofdstukOnderregel({ paragrafen: 4, lesblokken: 10 })}
                  open={open.h1}
                  onWissel={() => wissel('h1')}
                  onStart={geenActie}
                >
                  <ParagraafRij code="1.1" naam="Natuurwetenschappen" onderregel={aantalTekst(4, 'lesblok', 'lesblokken')} onStart={geenActie} />
                </HoofdstukRij>
                <HoofdstukRij
                  nummer={2}
                  titel="Massa, volume en dichtheid"
                  onderregel={hoofdstukOnderregel({ paragrafen: 6, lesblokken: 46 })}
                  open={open.h2}
                  onWissel={() => wissel('h2')}
                  onStart={geenActie}
                >
                  {VOORBEELD_H2.map((paragraaf) => (
                    <ParagraafRij
                      key={paragraaf.code}
                      code={paragraaf.code}
                      naam={paragraaf.naam}
                      onderregel={aantalTekst(paragraaf.blokken, 'lesblok', 'lesblokken')}
                      onStart={geenActie}
                    />
                  ))}
                </HoofdstukRij>
              </div>
              <div className="lo-kaart-voet">
                <span className="inline-flex flex-wrap items-center gap-2">
                  <Label kleur="blauw">23 testrecords</Label>
                  <span className="lo-tokens"><Coins size={15} aria-hidden="true" />150</span>
                </span>
                <StartKnop icoon={House} onClick={geenActie}>Start op de startpagina</StartKnop>
              </div>
            </Kaart>
          </div>

          <Kaart>
            <KaartKop
              titel="Digitale vaardigheden · 8 klassen"
              uitleg="Deze klassen zien precies dezelfde lesstof. Elke klas heeft wel een eigen testleerling."
            />
            <Keuzeknoppen label="Log in als testleerling van" opties={VMBO_KLASSEN} gekozen={klas} onKies={setKlas} />
            <div className="lo-lijst">
              <HoofdstukRij nummer={1} titel="Startklaar op je nieuwe school" onderregel={hoofdstukOnderregel({ paragrafen: 1, lesblokken: 2 })} onWissel={geenActie} onStart={geenActie} />
              <HoofdstukRij nummer={2} titel="Wat zit er in je device?" onderregel={hoofdstukOnderregel({ paragrafen: 3, lesblokken: 16 })} onWissel={geenActie} onStart={geenActie} />
              <HoofdstukRij nummer={3} titel="Hoe reist jouw bericht over internet?" opSlot onStart={geenActie} />
            </div>
          </Kaart>

          <Kaart inclusie>
            <KaartKop kolf titel="H1i1" uitleg="Inclusieklas: krijgt de inclusieversie van elk hoofdstuk." />
            <div className="lo-lijst">
              <HoofdstukRij
                nummer={2}
                titel="Wat zit er in je device?"
                onderregel={hoofdstukOnderregel({ paragrafen: 3, lesblokken: 41 })}
                labels={<Label kleur="paars">inclusie</Label>}
                onWissel={geenActie}
                onStart={geenActie}
              />
            </div>
          </Kaart>

          <Kaart>
            <KaartKop titel="Knoppen en labels" uitleg="De hoofdknop voor de ene belangrijkste handeling, de tweede knop ernaast." />
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" className="lo-knop">Start testsessie</button>
              <button type="button" className="lo-knop" disabled>Start testsessie</button>
              <button type="button" className="lo-knop-tweede"><RefreshCw size={16} aria-hidden="true" />Verversen</button>
              <StartKnop onClick={geenActie}>Start</StartKnop>
              <StartKnop disabled>Start</StartKnop>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Label kleur="blauw">5 testrecords</Label>
              <Label kleur="paars">inclusie</Label>
              <Label kleur="groen">af</Label>
              <Label kleur="oranje" icoon={Lock}>op slot</Label>
              <Label kleur="rood">2 problemen</Label>
            </div>
            <p className="lo-melding lo-melding--info">Voor deze klas staat geen lesstof klaar.</p>
            <p className="lo-melding lo-melding--fout">De testsessie kon niet gestart worden.</p>
          </Kaart>

          <Kaart>
            <KaartKop titel="Kleuren" uitleg="Altijd via de tokens, nooit een losse hexwaarde in een component." />
            <div className="lo-stalen">
              {KLEUREN.map(([token, waarde]) => (
                <div key={token} className="lo-staal">
                  <span style={{ background: `var(${token})` }} />
                  <span><b>{token}</b> {waarde}</span>
                </div>
              ))}
            </div>
          </Kaart>
        </div>

        <div data-stijlgids="lespagina" className="study-stijl lo-kaartenraster">
          <Kaart>
            <KaartKop titel="Stappenbalk" uitleg="Een lijst met scheidingslijnen. De huidige stap heeft een geel nummerblokje." />
            <div className="study-rail h-[600px] overflow-hidden rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)]">
              <StudyStepRail
                paragraafTitle="2.3 Dichtheid"
                hoofdstukTitle="H2 Stoffen"
                steps={VOORBEELD_STAPPEN}
                summary={{ total: 5, done: 2, percentage: 40 }}
                iconForType={(type) => STAP_ICONEN[type] || BookOpen}
                hasIntro
                isIntroDone
                onOpenIntro={geenActie}
                onSelectStep={geenActie}
                onExit={geenActie}
              />
            </div>
          </Kaart>

          <article className="study-block flex flex-col gap-6">
            <div className="lesson-prose">
              <h2>Dichtheid</h2>
              <p>Dichtheid zegt hoeveel massa er in één kubieke centimeter van een stof zit.</p>
              <ul>
                <li>Massa meet je in gram.</li>
                <li>Volume meet je in kubieke centimeter.</li>
              </ul>
            </div>
            <div className="study-example">
              <span className="study-example-label">Voorbeeld</span>
              <p className="mt-3">Een blokje hout van 10 cm³ weegt 6 g.</p>
            </div>
            <p className="helix-eyebrow">Presentatie</p>
            <input className="input-standard" aria-label="Voorbeeldantwoord" placeholder="Jouw antwoord" />
            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn-primary px-5 py-3 text-sm">Volgende stap</button>
              <button type="button" className="helix-btn-solid px-5 py-3 text-sm">Ik heb het gelezen</button>
            </div>
            <button type="button" className="btn-secondary px-5 py-3 text-sm">Vorige</button>
          </article>
        </div>
      </div>
    </div>
  );
}
