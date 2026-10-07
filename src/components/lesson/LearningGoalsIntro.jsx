import { useEffect, useRef } from 'react';
import { ArrowRight, Star, Target } from 'lucide-react';
import { nederlandseTaalhulp } from '../../hooks/useLesstofTaal';
import TaalSchakelaar from './TaalSchakelaar';

// Startscherm van een paragraaf: één compact venster met de leerdoelen als losse
// zinnen. Niet de route, niet de stappenlijst - alleen wat je gaat leren, en één
// knop om te beginnen.
//
// De taalknop staat hier ook. Dit venster ligt over de les heen, dus de knop in
// de balk eronder is onbereikbaar; zonder deze knop zou een leerling zijn eerste
// scherm van een paragraaf altijd in het Nederlands krijgen.
export default function LearningGoalsIntro({
  open,
  intro,
  paragraafTitle = '',
  hoofdstukTitle = '',
  optioneel = false,
  onContinue,
  taal = nederlandseTaalhulp
}) {
  const { tekst, aantal, studieduur } = taal;
  const continueRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    continueRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' || event.key === 'Enter') {
        event.preventDefault();
        onContinue?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onContinue, open]);

  if (!open || !intro?.items?.length) return null;

  // De leerdoelen van de paragraaf in de taal van de leerling. Zijn ze nog niet
  // vertaald (of staat de knop uit), dan blijven de Nederlandse staan: een half
  // vertaalde lijst is erger dan een Nederlandse.
  const vertaaldeDoelen = taal.paragraafInfo(intro.paragraafId || '')?.leerdoelen || [];
  const zichtbareItems = vertaaldeDoelen.length === intro.items.length ? vertaaldeDoelen : intro.items;

  // Studieduur en bewijsproduct zijn bijzaak: ze staan als één regel onder de
  // doelen, niet als rij badges die het venster hoger maakt.
  const caption = [
    intro.stepCount > 0 ? aantal('intro.stappen', intro.stepCount) : '',
    studieduur(intro.estimatedMinutes),
    intro.evidenceProduct
  ]
    .filter(Boolean)
    .join(' · ');
  const context = [hoofdstukTitle, paragraafTitle].filter(Boolean).join(' · ');

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[rgba(11,19,43,0.42)] p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="leerdoelen-intro-titel"
        className="lo-kaart max-h-[86vh] w-full max-w-lg gap-0 overflow-hidden p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="lo-hblok">
              <Target size={16} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2
                id="leerdoelen-intro-titel"
                className="lo-kaart-titel"
              >
                {tekst('intro.watJeGaatLeren')}
              </h2>
              {context && (
                <p className="lo-onderregel truncate">{context}</p>
              )}
            </div>
          </div>
          <TaalSchakelaar
            taal={taal.lesTaal}
            actief={taal.taalActief}
            bezig={taal.bezig}
            onWissel={taal.wisselTaal}
          />
        </div>

        {/* Een plusparagraaf zegt hier meteen wat hij is. Dit is het eerste dat
            een leerling van de paragraaf ziet, dus hier hoort de belofte te
            staan: je hoeft dit niet, je mag dit - en het levert tokens op. */}
        {optioneel && (
          <div className="mt-4 rounded-[var(--lo-hoek-l)] bg-[var(--lo-paars-zacht)] p-4">
            <p className="flex items-center gap-2 text-sm font-extrabold text-[var(--lo-paars-inkt)]">
              <Star size={15} />
              {tekst('plus.label')}
            </p>
            <p className="mt-1.5 text-sm leading-6 text-[var(--lo-inkt)]">
              {tekst('plus.uitleg')}
            </p>
          </div>
        )}

        <ul className="custom-scrollbar lo-lijst mt-4 min-h-0 overflow-y-auto">
          {zichtbareItems.map((item, index) => (
            <li key={`${index}-${item}`} className="flex items-start gap-2.5 px-4 py-3">
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--lo-blauw)]"
              />
              <span className="text-[15px] leading-6 text-[var(--lo-inkt)]">
                {item}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          {caption ? (
            <p className="lo-onderregel">{caption}</p>
          ) : (
            <span />
          )}
          <button ref={continueRef} type="button" onClick={onContinue} className="helix-btn-solid">
            {tekst('knop.verder')}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
