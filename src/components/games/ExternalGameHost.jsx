import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

// Gedeelde schil voor spellen die als losse statische map in public/games/
// staan (eigen HTML, CSS en JS, zonder build-stap). Het spel draait in een
// same-origin iframe en praat via postMessage met het platform.
//
// Waarom een iframe en niet gewoon een React-component: zo'n spel brengt zijn
// eigen CSS-reset, eigen element-id's en eigen toetsenbordafhandeling mee. In
// het iframe raken die de rest van het platform nooit, blijft een fout in het
// spel binnen het spel, en is een nieuwe spelversie niet meer dan een nieuwe
// map. React-spellen in src/games/ blijven werken zoals ze werken; dit is een
// tweede route, geen vervanging.
//
// Het berichtcontract (spel -> platform), zie public/games/<spel>/<versie>/:
//   { bron, soort: 'gereed' }                      het spel staat klaar
//   { bron, soort: 'gestart', op }                 er is een potje begonnen
//   { bron, soort: 'bezig', bezig }                er loopt wel/geen potje
//   { bron, soort: 'klaar', punten, details, op }  eindstand bereikt
//
// Het platform stuurt zelf niets terug: alles wat het spel nodig heeft staat
// al klaar voordat het geladen wordt.
export default function ExternalGameHost({
  bron,
  spelUrl,
  titel = 'Spel',
  onBericht,
  waarschuwing = 'Je potje loopt nog. Pauzeer en kies "Stoppen en naar de uitslag" als je wilt stoppen, anders tellen je punten niet mee.',
  hoogteClassName = 'h-[min(78vh,760px)]'
}) {
  const iframeRef = useRef(null);
  const [geladen, setGeladen] = useState(false);
  const [bezig, setBezig] = useState(false);
  const berichtRef = useRef(onBericht);

  // De callback via een ref, zodat de listener niet bij elke render opnieuw
  // aan- en afgemeld wordt terwijl er een potje loopt.
  useEffect(() => {
    berichtRef.current = onBericht;
  }, [onBericht]);

  useEffect(() => {
    const verwerk = (event) => {
      // Alleen berichten van ons eigen iframe, van onze eigen origin.
      if (event.origin !== window.location.origin) return;
      if (!iframeRef.current || event.source !== iframeRef.current.contentWindow) return;
      if (!event.data || event.data.bron !== bron) return;

      if (event.data.soort === 'gereed') setGeladen(true);
      if (event.data.soort === 'bezig') setBezig(event.data.bezig === true);
      if (event.data.soort === 'klaar') setBezig(false);

      berichtRef.current?.(event.data);
    };

    window.addEventListener('message', verwerk);
    return () => window.removeEventListener('message', verwerk);
  }, [bron]);

  // Sluit de leerling het tabblad of ververst hij midden in een potje, dan
  // vraagt de browser om bevestiging. Navigeren binnen het platform kunnen we
  // niet blokkeren; daarvoor staat de melding hieronder in beeld.
  useEffect(() => {
    if (!bezig) return undefined;

    const waarschuw = (event) => {
      event.preventDefault();
      event.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', waarschuw);
    return () => window.removeEventListener('beforeunload', waarschuw);
  }, [bezig]);

  // Het spel wordt met het toetsenbord gespeeld; zonder focus in het iframe
  // komen de aanslagen niet aan.
  const pakFocus = useCallback(() => {
    iframeRef.current?.contentWindow?.focus();
  }, []);

  return (
    <div className="space-y-3">
      {bezig && (
        <div
          className="flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-bold"
          style={{
            borderColor: 'var(--helix-border)',
            background: 'var(--helix-surface-soft)',
            color: 'var(--helix-navy)'
          }}
          role="status"
        >
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <span>{waarschuwing}</span>
        </div>
      )}

      <div
        className={`relative w-full overflow-hidden ${hoogteClassName}`}
        style={{
          borderRadius: 'var(--helix-radius-lg)',
          border: '1px solid var(--helix-border)',
          background: 'var(--helix-surface-soft)'
        }}
      >
        {!geladen && (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3"
            style={{ background: 'var(--helix-surface-soft)', color: 'var(--helix-muted)' }}
          >
            <Loader2 size={28} className="animate-spin" />
            <p className="text-sm font-bold">Het spel wordt geladen…</p>
          </div>
        )}

        {/* Geen sandbox-attribuut: het spel deelt bewust de origin, zodat het
            zijn eigen opslag kan gebruiken en het platform de woordenlijst
            vooraf kan klaarzetten. De bestanden komen uit onze eigen map. */}
        <iframe
          ref={iframeRef}
          src={spelUrl}
          title={titel}
          className="h-full w-full border-0"
          allow="fullscreen; autoplay"
          onLoad={pakFocus}
          onMouseEnter={pakFocus}
        />
      </div>
    </div>
  );
}
