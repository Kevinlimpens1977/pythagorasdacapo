import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, CheckCircle2, PlayCircle } from 'lucide-react';

import { useStudentOutline } from '../../hooks/useStudentOutline';
import { useLesstofTaal } from '../../hooks/useLesstofTaal';
import { buildLessonPath, buildResumePointer } from '../../lib/chapterOutline';
import { zonderVergrendeldeHoofdstukken } from '../../lib/hoofdstukSlot';
import { hoofdstukKnopSleutel, paragraafKnopSleutel } from '../../lib/leeromgeving';
import { HoofdstukRij, Kaart, KaartKop, Label, PaginaKop, ParagraafRij } from '../leeromgeving';
import TaalSchakelaar from '../lesson/TaalSchakelaar';

/**
 * De lesstofpagina van de leerling: waar je verder moet, en daaronder je
 * hoofdstukken als lijst.
 *
 * Elk hoofdstuk is een rij met een H-blokje en een Start-knop; klap je hem uit,
 * dan staan de paragrafen eronder, elk met een eigen "Start hier". Bij openen
 * staat alles dicht. Een hoofdstuk op slot toont het slotje en een knop die uit
 * staat.
 */
export default function TableOfContents() {
  const navigate = useNavigate();
  const { chapters, loading } = useStudentOutline();
  const [open, setOpen] = useState({});

  // De taalknop van de leerling. Hij hoort op dezelfde plek te werken als in
  // de les: één keuze voor de hele route.
  const hoofdstukIds = useMemo(() => chapters.map((chapter) => chapter.id), [chapters]);
  const paragraafIds = useMemo(
    () => chapters.flatMap((chapter) => chapter.paragraphRows.map((row) => row.id)),
    [chapters]
  );
  const taal = useLesstofTaal({ hoofdstukIds, paragraafIds });
  const { tekst, aantal, paragraafInfo, hoofdstukInfo } = taal;

  if (loading) return <LesstofSkelet />;

  if (chapters.length === 0) {
    return (
      <PageShell>
        <Kaart>
          <KaartKop titel={tekst('lesstof.leeg.titel')} uitleg={tekst('lesstof.leeg.tekst')} />
        </Kaart>
      </PageShell>
    );
  }

  // Een hoofdstuk op slot hoort niet in "verder waar je was": daar zou de
  // knop naar een les wijzen die nog dicht is.
  const verder = buildResumePointer(zonderVergrendeldeHoofdstukken(chapters));
  const heeftPlus = chapters.some((chapter) => chapter.paragraphRows.some((row) => row.optioneel));
  // De teller bovenaan gaat over wat de leerling nu kan doen; een hoofdstuk op
  // slot zou hem anders met een achterstand laten beginnen.
  const totalen = zonderVergrendeldeHoofdstukken(chapters).reduce(
    (som, chapter) => ({
      done: som.done + chapter.progress.done,
      total: som.total + chapter.progress.total
    }),
    { done: 0, total: 0 }
  );

  return (
    <PageShell>
      <PaginaKop
        eyebrow={tekst('lesstof.kop')}
        titel={tekst('lesstof.titel')}
        uitleg={`${aantal('hoofdstuk.aantal', chapters.length)} · ${tekst('onderdeel.af', { done: totalen.done, total: totalen.total })}`}
        acties={
          <TaalSchakelaar
            taal={taal.lesTaal}
            actief={taal.taalActief}
            bezig={taal.bezig}
            onWissel={taal.wisselTaal}
          />
        }
      />

      <VerderKaart verder={verder} taal={taal} onStart={(pad) => navigate(pad)} />

      <Kaart>
        <div className="lo-lijst">
          {chapters.map((chapter) => {
            const opSlot = chapter.vergrendeld === true;
            const titel = hoofdstukInfo(chapter.id)?.titel || chapter.title;
            const onderregel = `${aantal('paragraaf.aantal', chapter.paragraphRows.length)} · ${tekst('onderdeel.af', { done: chapter.progress.done, total: chapter.progress.total })}`;
            return (
              <HoofdstukRij
                key={chapter.id}
                nummer={chapter.number}
                titel={titel}
                onderregel={onderregel}
                slotTekst={tekst(chapter.aangekondigd ? 'slot.komtEraan' : 'slot.uitleg')}
                labels={chapter.progress.isCompleted ? <Label kleur="groen" icoon={Check}>{tekst('status.af')}</Label> : null}
                opSlot={opSlot}
                open={open[chapter.id] === true}
                onWissel={() => setOpen((stand) => ({ ...stand, [chapter.id]: !stand[chapter.id] }))}
                onStart={() => navigate(`/hoofdstuk/${chapter.id}`)}
                startTekst={tekst(hoofdstukKnopSleutel(chapter.progress))}
              >
                {chapter.paragraphRows.map((row) => (
                  <ParagraafRij
                    key={row.id}
                    code={row.number || row.code}
                    naam={paragraafInfo(row.id)?.titel || row.title}
                    onderregel={row.vergrendeld ? tekst('slot.label') : tekst('onderdeel.af', { done: row.progress.done, total: row.progress.total })}
                    labels={row.optioneel ? <Label kleur="blauw">{tekst('plus.label')}</Label> : null}
                    onStart={() => navigate(buildLessonPath(row.id, row.resumeOnderdeelId))}
                    startTekst={tekst(paragraafKnopSleutel(row.progress))}
                    startUit={row.vergrendeld === true}
                  />
                ))}
              </HoofdstukRij>
            );
          })}
        </div>
      </Kaart>

      {heeftPlus && (
        <p className="lo-melding lo-melding--info">
          <span>
            <strong>{tekst('plus.label')}</strong> {tekst('plus.uitleg')}
          </span>
        </p>
      )}
    </PageShell>
  );
}

function PageShell({ children }) {
  return (
    <div className="helix-page lo-tekst">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 md:py-10">{children}</div>
    </div>
  );
}

/**
 * Waar de leerling gebleven was, als eerste ding op het scherm.
 *
 * Zonder deze kaart begon elke les met zoeken: de kop zei wel hoeveel er af
 * was, maar niet wat er nu aan de beurt is, en de knop "Ga verder" stond ergens
 * tussen de rijen.
 */
function VerderKaart({ verder, taal, onStart }) {
  const { tekst, paragraafInfo, hoofdstukInfo } = taal;

  if (!verder) {
    return (
      <Kaart>
        <p className="lo-melding lo-melding--info">
          <CheckCircle2 size={16} aria-hidden="true" />
          <span>
            <strong>{tekst('verder.klaar.titel')}</strong> {tekst('verder.klaar.tekst')}
          </span>
        </p>
      </Kaart>
    );
  }

  const vertaaldeParagraaf = paragraafInfo(verder.paragraafId);

  return (
    <Kaart>
      <p className="lo-eyebrow">{tekst('verder.kop')}</p>
      <h2 className="lo-kaart-titel">
        {verder.paragraafNumber ? `${verder.paragraafNumber} ` : ''}
        {vertaaldeParagraaf?.titel || verder.paragraafTitle}
      </h2>
      <p className="lo-kaart-uitleg">
        {hoofdstukInfo(verder.chapterId)?.titel || verder.chapterTitle} ·{' '}
        {verder.isEersteStap
          ? tekst('status.nietBegonnen')
          : tekst('onderdeel.af', { done: verder.progress.done, total: verder.progress.total })}
      </p>
      <div className="lo-kaart-voet">
        <Label kleur="blauw" icoon={PlayCircle} className="min-w-0 shrink whitespace-normal text-left">{verder.onderdeelTitle}</Label>
        <button
          type="button"
          className="lo-knop"
          onClick={() => onStart(buildLessonPath(verder.paragraafId, verder.onderdeelId))}
        >
          {verder.isEersteStap ? tekst('knop.beginnen') : tekst('knop.gaVerder')}
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
      <span className="lo-voortgang" aria-hidden="true">
        <i style={{ width: `${verder.progress.percentage}%` }} />
      </span>
    </Kaart>
  );
}

/**
 * Tijdens het laden staan de vlakken al op hun plek. Een spinner liet de pagina
 * springen zodra de lesstof binnenkwam.
 */
function LesstofSkelet() {
  return (
    <PageShell>
      <div className="flex flex-col gap-6" aria-busy="true" aria-live="polite">
        <span className="sr-only">Lesstof laden</span>
        <div className="lo-kaart animate-pulse" style={{ height: 120 }} aria-hidden="true" />
        <div className="lo-kaart animate-pulse" style={{ height: 220 }} aria-hidden="true" />
        <div className="lo-kaart animate-pulse" style={{ height: 220 }} aria-hidden="true" />
      </div>
    </PageShell>
  );
}
