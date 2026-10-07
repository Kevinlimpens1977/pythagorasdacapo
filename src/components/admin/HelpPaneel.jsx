import { useEffect, useState } from 'react';
import { CheckCircle2, CircleHelp, Clock, X } from 'lucide-react';
import Label from '../leeromgeving/Label';
import { HELP_EVENT, HELP_ONDERWERPEN, HELP_STATUS, helpOnderwerp } from '../../lib/helpInhoud';

// Helpknop in de beheerbalk met een zijpaneel. Geheugensteun voor Kevin:
// hoe iets werkt en welke opties er zijn. Inhoud staat in src/lib/helpInhoud.js.
export default function HelpPaneel() {
  const [open, setOpen] = useState(false);
  const [onderwerpId, setOnderwerpId] = useState(HELP_ONDERWERPEN[0]?.id);

  useEffect(() => {
    const opEvent = (event) => {
      if (event.detail?.onderwerp) setOnderwerpId(event.detail.onderwerp);
      setOpen(true);
    };
    window.addEventListener(HELP_EVENT, opEvent);
    return () => window.removeEventListener(HELP_EVENT, opEvent);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const opToets = (event) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', opToets);
    return () => window.removeEventListener('keydown', opToets);
  }, [open]);

  const onderwerp = helpOnderwerp(onderwerpId);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lo-knop-tweede lo-knop--klein"
        aria-haspopup="dialog"
        title="Help"
      >
        <CircleHelp size={16} aria-hidden="true" />
        <span className="sr-only">Help</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[300] flex justify-end bg-[var(--lo-inkt)]/30" onClick={() => setOpen(false)}>
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={`Help: ${onderwerp.titel}`}
            onClick={(event) => event.stopPropagation()}
            className="lo-tekst flex h-full w-full max-w-xl flex-col overflow-hidden border-l border-[var(--lo-lijn)] bg-[var(--lo-kaart)] shadow-[var(--lo-schaduw-kaart)]"
          >
            <header className="flex items-center justify-between gap-3 border-b border-[var(--lo-lijn)] px-5 py-4">
              <h2 className="lo-kaart-titel">Help</h2>
              <button type="button" onClick={() => setOpen(false)} className="lo-knop-tweede h-10 w-10 justify-center p-0" aria-label="Sluiten">
                <X size={18} />
              </button>
            </header>

            {HELP_ONDERWERPEN.length > 1 && (
              <nav className="lo-keuzes border-b border-[var(--lo-lijn)] px-5 py-3">
                {HELP_ONDERWERPEN.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setOnderwerpId(item.id)}
                    className="lo-keuze"
                    aria-pressed={item.id === onderwerp.id}
                  >
                    {item.titel}
                  </button>
                ))}
              </nav>
            )}

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <h3 className="text-2xl font-extrabold text-[var(--lo-inkt)]">{onderwerp.titel}</h3>
              <p className="mt-2 text-[15px] leading-6">{onderwerp.samenvatting}</p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                <StatusLabel status={HELP_STATUS.NU} />
                <StatusLabel status={HELP_STATUS.STRAKS} />
              </div>

              {onderwerp.secties.map((sectie) => (
                <section key={sectie.titel} className="mt-6">
                  <h4 className="text-lg font-extrabold text-[var(--lo-inkt)]">{sectie.titel}</h4>
                  {sectie.tekst && (
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-6">
                      {sectie.tekst.map((regel) => <li key={regel}>{regel}</li>)}
                    </ul>
                  )}
                  {sectie.stappen && (
                    <ol className="mt-2 list-decimal space-y-1 pl-5 text-[15px] leading-6">
                      {sectie.stappen.map((stap) => <li key={stap}>{stap}</li>)}
                    </ol>
                  )}
                  {sectie.opties && (
                    <div className="mt-3 flex flex-col gap-3">
                      {sectie.opties.map((optie) => (
                        <article
                          key={optie.titel}
                          className={`rounded-[var(--lo-hoek-l)] border border-[var(--lo-lijn)] p-4 ${optie.status === HELP_STATUS.NU ? 'bg-[var(--lo-kaart)]' : 'border-dashed bg-[var(--lo-papier)]'}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-extrabold text-[var(--lo-inkt)]">{optie.titel}</p>
                            <StatusLabel status={optie.status} />
                          </div>
                          <p className="mt-1 text-[15px] leading-6">{optie.tekst}</p>
                          {optie.letOp && (
                            <p className="lo-melding lo-melding--info mt-2">
                              <strong>Let op:</strong> {optie.letOp}
                            </p>
                          )}
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              ))}

              {onderwerp.bron && (
                <p className="mt-8 text-xs text-[var(--lo-grijs)]">Volledig plan: <code>{onderwerp.bron}</code></p>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function StatusLabel({ status }) {
  if (status === HELP_STATUS.NU) {
    return <Label kleur="groen" icoon={CheckCircle2}>Werkt nu</Label>;
  }
  return <Label kleur="oranje" icoon={Clock}>Na de bouw</Label>;
}
