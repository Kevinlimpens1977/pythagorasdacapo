import { useCallback, useEffect, useRef, useState } from 'react';
import { Bell, CheckCircle2, Loader2 } from 'lucide-react';
import {
  MELDING_STATUSSEN,
  createMelding,
  markMeldingGelezenDoorMelder,
  subscribeToEigenMeldingen,
  uploadMeldingSchermafbeelding
} from '../../services/meldingenService';

/**
 * De meldbel: een belletje rechtsonder waarmee iedereen een fout kan
 * doorgeven, en waarin je daarna terugziet wat ermee gebeurd is.
 *
 * WAAROM RECHTSONDER EN NIET IN DE HEADER. Je meldt iets op het moment dat er
 * iets misgaat, en dat is zelden boven aan de pagina. Een knop die meescrollt
 * is er dan; een knop in de header moet je eerst gaan zoeken.
 *
 * WAAROM DE SCHERMAFBEELDING AUTOMATISCH GAAT. "Kun je een screenshot
 * meesturen" is precies de stap waarop een melding blijft liggen. De pagina
 * wordt bij het openen van het formulier nagetekend op een canvas, zonder dat
 * de melder iets hoeft te doen. Het is een natekening en geen echte foto:
 * video en ingesloten kaders komen niet mee. De bibliotheek (html2canvas-pro,
 * de fork die oklch-kleuren aankan) wordt pas opgehaald zodra iemand echt een
 * melding opent.
 *
 * WAAROM DE MELDER ZIJN EIGEN MELDINGEN TERUGZIET. Melden waar nooit iets van
 * terugkomt doe je een keer. Het rode bolletje telt de antwoorden die je nog
 * niet gelezen hebt.
 */

const AFBEELDING_BREEDTE = 1400;

// Hover- en pulsstijl kan niet inline; de component brengt zijn eigen blokje
// mee zodat er niets aan de globale css hoeft te veranderen.
const BELSTIJL = `
.helix-meldbel { position: relative; }
.helix-meldbel::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 999px;
  pointer-events: none;
  box-shadow: 0 0 0 0 rgb(239 68 68 / 0);
  transition: box-shadow 200ms ease-out;
}
.helix-meldbel--antwoord::after {
  box-shadow: 0 0 0 4px rgba(8, 126, 181, 0.28), 0 0 18px 4px rgba(8, 126, 181, 0.4);
  animation: helix-meldbel-puls 2200ms ease-in-out infinite;
}
.helix-meldbel:hover::after,
.helix-meldbel:focus-visible::after {
  animation: none;
  box-shadow: 0 0 0 4px rgba(8, 126, 181, 0.25), 0 0 20px 5px rgba(8, 126, 181, 0.45);
}
@keyframes helix-meldbel-puls {
  0%   { box-shadow: 0 0 0 0 rgba(8, 126, 181, 0.45), 0 0 14px 2px rgba(8, 126, 181, 0.3); }
  70%  { box-shadow: 0 0 0 12px oklch(0.52 0.19 300 / 0), 0 0 24px 8px rgba(8, 126, 181, 0.45); }
  100% { box-shadow: 0 0 0 0 oklch(0.52 0.19 300 / 0), 0 0 14px 2px rgba(8, 126, 181, 0.3); }
}
@media (prefers-reduced-motion: reduce) {
  .helix-meldbel--antwoord::after { animation: none; }
}
`;

const datumLabel = (waarde) => {
  const d = waarde?.toDate ? waarde.toDate() : waarde;
  if (!d) return '';
  return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

export default function Meldbel({ user, rol = 'leerling' }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('melden');
  const [tekst, setTekst] = useState('');
  const [bezig, setBezig] = useState(false);
  const [klaar, setKlaar] = useState(false);
  const [fout, setFout] = useState(null);

  const [afbeelding, setAfbeelding] = useState(null);
  const [afbeeldingBezig, setAfbeeldingBezig] = useState(false);
  const [afbeeldingMee, setAfbeeldingMee] = useState(true);

  const [eigenMeldingen, setEigenMeldingen] = useState([]);
  const paneelRef = useRef(null);

  // Eigen meldingen live volgen, ook met het paneel dicht: het rode bolletje
  // moet verschijnen zodra er een antwoord binnenkomt.
  useEffect(() => {
    if (!user) return undefined;
    return subscribeToEigenMeldingen(user.uid, setEigenMeldingen, () => setEigenMeldingen([]));
  }, [user]);

  const ongelezen = eigenMeldingen.filter((m) => m.gelezenDoorMelder === false).length;

  // Sluiten met Escape en met een klik ernaast.
  useEffect(() => {
    if (!open) return undefined;
    const toets = (e) => { if (e.key === 'Escape') setOpen(false); };
    const buiten = (e) => {
      if (paneelRef.current && !paneelRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener('keydown', toets);
    document.addEventListener('mousedown', buiten);
    return () => {
      window.removeEventListener('keydown', toets);
      document.removeEventListener('mousedown', buiten);
    };
  }, [open]);

  // De pagina natekenen voordat het paneel opengaat, anders staat het
  // meldformulier zelf op de afbeelding.
  const maakSchermafbeelding = useCallback(async () => {
    setAfbeeldingBezig(true);
    try {
      const { default: html2canvas } = await import('html2canvas-pro');
      const canvas = await html2canvas(document.body, {
        logging: false,
        useCORS: true,
        backgroundColor: null,
        scale: Math.min(1, AFBEELDING_BREEDTE / Math.max(document.body.scrollWidth, 1)),
        windowWidth: document.documentElement.clientWidth,
        windowHeight: document.documentElement.clientHeight,
        x: window.scrollX,
        y: window.scrollY,
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      });
      setAfbeelding(canvas.toDataURL('image/jpeg', 0.7));
    } catch (e) {
      // Geen ramp: de melding kan ook zonder plaatje.
      console.warn('[meldbel] schermafbeelding mislukt', e);
      setAfbeelding(null);
    } finally {
      setAfbeeldingBezig(false);
    }
  }, []);

  const openMelder = useCallback(async () => {
    setFout(null);
    setKlaar(false);
    setTab('melden');
    await maakSchermafbeelding();
    setOpen(true);
  }, [maakSchermafbeelding]);

  const verstuur = useCallback(async () => {
    if (!user || !tekst.trim()) return;
    setBezig(true);
    setFout(null);
    try {
      let afbeeldingUrl = '';
      if (afbeelding && afbeeldingMee) {
        afbeeldingUrl = await uploadMeldingSchermafbeelding(user.uid, afbeelding);
      }

      await createMelding({
        pagina: `${window.location.pathname}${window.location.search}`,
        tekst: tekst.trim(),
        afbeeldingUrl,
        melder: {
          uid: user.uid,
          naam: user.displayName || user.email?.split('@')[0] || 'onbekend',
          email: user.email || '',
          rol
        },
        browser: navigator.userAgent,
        venster: `${window.innerWidth}x${window.innerHeight}`
      });

      setKlaar(true);
      setTekst('');
    } catch (e) {
      console.error('[meldbel] versturen mislukt', e);
      setFout('Versturen is niet gelukt. Probeer het zo nog eens.');
    } finally {
      setBezig(false);
    }
  }, [user, tekst, afbeelding, afbeeldingMee, rol]);

  const markeerGelezen = useCallback(async (melding) => {
    if (melding.gelezenDoorMelder !== false) return;
    try {
      await markMeldingGelezenDoorMelder(melding.id);
    } catch (e) {
      console.warn('[meldbel] gelezen markeren mislukt', e);
    }
  }, []);

  if (!user) return null;

  return (
    <>
      <style>{BELSTIJL}</style>

      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openMelder())}
        aria-label={ongelezen > 0 ? `Meldingen — ${ongelezen} nieuwe ${ongelezen === 1 ? 'reactie' : 'reacties'}` : 'Een fout melden'}
        title="Iets werkt niet? Meld het hier."
        className={`helix-meldbel${ongelezen > 0 ? ' helix-meldbel--antwoord' : ''}`}
        style={{
          position: 'fixed',
          right: 20,
          bottom: 20,
          zIndex: 90,
          width: 48,
          height: 48,
          borderRadius: 999,
          background: '#ffffff',
          border: '1px solid var(--helix-border)',
          boxShadow: '0 6px 20px rgb(15 23 42 / 0.12)',
          color: 'var(--helix-purple)',
          cursor: 'pointer',
          display: 'grid',
          placeItems: 'center'
        }}
      >
        {afbeeldingBezig ? <Loader2 size={22} className="animate-spin" /> : <Bell size={22} />}
        {ongelezen > 0 && (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              minWidth: 20,
              height: 20,
              padding: '0 5px',
              borderRadius: 999,
              background: '#B42F25',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 700,
              lineHeight: '20px',
              textAlign: 'center',
              border: '2px solid #ffffff'
            }}
          >
            {ongelezen > 9 ? '9+' : ongelezen}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={paneelRef}
          role="dialog"
          aria-label="Een fout melden"
          style={{
            position: 'fixed',
            right: 20,
            bottom: 80,
            zIndex: 91,
            width: 'min(380px, calc(100vw - 40px))',
            maxHeight: 'min(560px, calc(100vh - 120px))',
            display: 'flex',
            flexDirection: 'column',
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid var(--helix-border)',
            boxShadow: '0 20px 50px rgb(15 23 42 / 0.22)',
            overflow: 'hidden',
            fontSize: 14,
            color: 'var(--helix-navy)'
          }}
        >
          <div style={{ display: 'flex', borderBottom: '1px solid var(--helix-border)' }}>
            {[['melden', 'Iets melden'], ['mijn', `Mijn meldingen${ongelezen ? ` (${ongelezen})` : ''}`]].map(([sleutel, label]) => (
              <button
                key={sleutel}
                type="button"
                onClick={() => setTab(sleutel)}
                style={{
                  flex: 1,
                  padding: '12px 8px',
                  border: 'none',
                  background: tab === sleutel ? 'var(--helix-soft-lavender)' : 'transparent',
                  color: tab === sleutel ? 'var(--helix-purple-dark)' : '#7C7664',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={{ padding: 16, overflowY: 'auto' }}>
            {tab === 'melden' && !klaar && (
              <>
                <p style={{ margin: '0 0 10px', color: '#5B5648', lineHeight: 1.5 }}>
                  Wat ging er mis? Een of twee zinnen is genoeg — wat je deed en wat je verwachtte.
                </p>
                <textarea
                  value={tekst}
                  onChange={(e) => setTekst(e.target.value)}
                  placeholder="Bijv: ik klik op Opslaan en er gebeurt niets"
                  rows={4}
                  maxLength={4000}
                  style={{
                    width: '100%',
                    padding: 10,
                    borderRadius: 10,
                    border: '1px solid var(--helix-border)',
                    fontFamily: 'inherit',
                    fontSize: 14,
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />

                <label
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'flex-start',
                    margin: '10px 0',
                    color: '#5B5648',
                    cursor: afbeelding ? 'pointer' : 'default'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={afbeeldingMee && !!afbeelding}
                    disabled={!afbeelding}
                    onChange={(e) => setAfbeeldingMee(e.target.checked)}
                    style={{ marginTop: 3 }}
                  />
                  <span style={{ fontSize: 13, lineHeight: 1.45 }}>
                    {afbeelding
                      ? 'Stuur een afbeelding van dit scherm mee — dat scheelt meestal een hoop heen en weer'
                      : 'Van dit scherm kon geen afbeelding gemaakt worden; je melding gaat zonder'}
                  </span>
                </label>

                {afbeelding && afbeeldingMee && (
                  <img
                    src={afbeelding}
                    alt="Afbeelding van je scherm"
                    style={{ width: '100%', borderRadius: 8, border: '1px solid var(--helix-border)', marginBottom: 10 }}
                  />
                )}

                {fout && <p style={{ margin: '0 0 10px', color: '#B42F25', fontWeight: 600 }}>{fout}</p>}

                <button
                  type="button"
                  onClick={verstuur}
                  disabled={bezig || !tekst.trim()}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    borderRadius: 999,
                    border: 'none',
                    background: !tekst.trim() || bezig ? '#E8DCC3' : 'var(--helix-purple)',
                    color: !tekst.trim() || bezig ? '#A8A08C' : '#ffffff',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    cursor: !tekst.trim() || bezig ? 'default' : 'pointer'
                  }}
                >
                  {bezig ? <><Loader2 size={16} className="animate-spin" /> Versturen…</> : 'Versturen'}
                </button>
              </>
            )}

            {tab === 'melden' && klaar && (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <CheckCircle2 size={40} style={{ color: 'var(--helix-purple)', margin: '0 auto' }} />
                <p style={{ margin: '8px 0 4px', fontWeight: 700 }}>Bedankt, hij staat genoteerd</p>
                <p style={{ margin: 0, color: '#5B5648', lineHeight: 1.5 }}>
                  Zodra er iets mee gebeurt zie je dat hier terug, en verschijnt er een rood bolletje op de bel.
                </p>
                <button
                  type="button"
                  onClick={() => setTab('mijn')}
                  style={{
                    marginTop: 12,
                    padding: '8px 16px',
                    borderRadius: 999,
                    border: '1px solid var(--helix-border)',
                    background: '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Mijn meldingen
                </button>
              </div>
            )}

            {tab === 'mijn' && (
              eigenMeldingen.length === 0 ? (
                <p style={{ margin: 0, color: '#7C7664', lineHeight: 1.5 }}>
                  Je hebt nog niets gemeld. Kom je iets tegen dat niet klopt, dan horen we het graag — ook als het klein is.
                </p>
              ) : (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
                  {eigenMeldingen.map((m) => {
                    const s = MELDING_STATUSSEN[m.status] || MELDING_STATUSSEN.nieuw;
                    return (
                      <li
                        key={m.id}
                        onMouseEnter={() => markeerGelezen(m)}
                        style={{
                          border: '1px solid var(--helix-border)',
                          borderRadius: 12,
                          padding: 12,
                          background: m.gelezenDoorMelder === false ? '#FFF8E1' : '#ffffff'
                        }}
                      >
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: 999,
                              color: s.kleur,
                              background: s.achtergrond
                            }}
                          >
                            {s.label}
                          </span>
                          <span style={{ fontSize: 11, color: '#A8A08C' }}>{datumLabel(m.aangemaakt)}</span>
                        </div>
                        <p style={{ margin: 0, lineHeight: 1.45 }}>{m.tekst}</p>
                        {m.reactie ? (
                          <p
                            style={{
                              margin: '8px 0 0',
                              padding: 8,
                              borderRadius: 8,
                              background: 'var(--helix-soft-lavender)',
                              color: 'var(--helix-purple-dark)',
                              lineHeight: 1.45
                            }}
                          >
                            <strong>Antwoord:</strong> {m.reactie}
                          </p>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}
