import { useEffect, useState } from 'react';
import { CheckCircle2, CircleHelp, Clock, X } from 'lucide-react';
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
        className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--helix-border)] bg-white px-3 py-2 text-xs font-black uppercase tracking-wide text-[var(--helix-navy)] transition hover:bg-[var(--helix-surface-soft)]"
        aria-haspopup="dialog"
      >
        <CircleHelp size={17} />
        <span className="hidden lg:inline">Help</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[300] flex justify-end bg-[#0B0D0F]/30" onClick={() => setOpen(false)}>
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={`Help: ${onderwerp.titel}`}
            onClick={(event) => event.stopPropagation()}
            className="flex h-full w-full max-w-xl flex-col overflow-hidden border-l-[3px] border-[#0B0D0F] bg-[var(--helix-bg)] shadow-2xl"
          >
            <header className="ds-anchor flex items-center justify-between gap-3 px-5 py-3">
              <h2 className="ds-display text-[28px]">Help</h2>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg border-2 border-[#0B0D0F] bg-white p-1.5" aria-label="Sluiten">
                <X size={18} />
              </button>
            </header>

            {HELP_ONDERWERPEN.length > 1 && (
              <nav className="flex flex-wrap gap-2 border-b border-[var(--helix-border)] px-5 py-3">
                {HELP_ONDERWERPEN.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setOnderwerpId(item.id)}
                    className={`rounded-full border px-3 py-1 text-sm font-bold ${item.id === onderwerp.id ? 'border-[var(--helix-navy)] bg-[var(--helix-navy)] text-white' : 'border-[var(--helix-border)] bg-white'}`}
                  >
                    {item.titel}
                  </button>
                ))}
              </nav>
            )}

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <h3 className="text-2xl font-black text-[var(--helix-navy)]">{onderwerp.titel}</h3>
              <p className="mt-2 text-[15px] leading-6">{onderwerp.samenvatting}</p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                <StatusLabel status={HELP_STATUS.NU} />
                <StatusLabel status={HELP_STATUS.STRAKS} />
              </div>

              {onderwerp.secties.map((sectie) => (
                <section key={sectie.titel} className="mt-6">
                  <h4 className="text-lg font-black text-[var(--helix-navy)]">{sectie.titel}</h4>
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
                          className={`rounded-xl border-2 p-3 ${optie.status === HELP_STATUS.NU ? 'border-[#0B0D0F] bg-white' : 'border-dashed border-[var(--helix-border)] bg-[var(--helix-surface-soft)]'}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-black text-[var(--helix-navy)]">{optie.titel}</p>
                            <StatusLabel status={optie.status} />
                          </div>
                          <p className="mt-1 text-[15px] leading-6">{optie.tekst}</p>
                          {optie.letOp && (
                            <p className="mt-2 rounded-lg bg-[var(--color-orange-soft)] px-3 py-2 text-sm leading-5">
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
                <p className="mt-8 text-xs text-[var(--helix-muted)]">Volledig plan: <code>{onderwerp.bron}</code></p>
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
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--color-green-soft)] px-2 py-0.5 text-xs font-bold text-[var(--color-green-ink)]">
        <CheckCircle2 size={13} /> Werkt nu
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--color-orange-soft)] px-2 py-0.5 text-xs font-bold text-[var(--color-orange-ink)]">
      <Clock size={13} /> Na de bouw
    </span>
  );
}
