import { useMemo, useState } from 'react';
import {
  addPresenterPage,
  createPresenterSession,
  getActivePresenterPage,
  setActivePresenterPage
} from '../../lib/presenterModel';
import PresenterBoard from './PresenterBoard';

export default function PresenterShell() {
  const [session, setSession] = useState(() => createPresenterSession());

  const activePage = getActivePresenterPage(session);
  const pages = useMemo(() => session.pages || [], [session.pages]);
  const activeIndex = useMemo(
    () => Math.max(0, pages.findIndex((page) => page.id === activePage?.id)),
    [activePage?.id, pages]
  );
  const pageLabel = pages.length > 0 ? `Pagina ${activeIndex + 1}/${pages.length}` : 'Pagina 0/0';

  const activatePageAt = (index) => {
    const page = pages[index];
    if (!page) return;

    setSession((currentSession) => setActivePresenterPage(currentSession, page.id));
  };

  const addPage = () => {
    setSession((currentSession) => addPresenterPage(currentSession));
  };

  return (
    <section className="flex min-h-[calc(100vh-5rem)] flex-col bg-slate-200">
      <header className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 px-4 py-3 text-slate-50 shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Presenter</p>
          <h1 className="text-lg font-black leading-tight">Digibord Core</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-md border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45"
            disabled={activeIndex <= 0}
            onClick={() => activatePageAt(activeIndex - 1)}
          >
            Vorige
          </button>
          <span className="min-w-24 text-center text-sm font-semibold text-slate-300">{pageLabel}</span>
          <button
            type="button"
            className="rounded-md border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45"
            disabled={activeIndex >= pages.length - 1}
            onClick={() => activatePageAt(activeIndex + 1)}
          >
            Volgende
          </button>
          <button
            type="button"
            className="rounded-md bg-slate-50 px-3 py-2 text-sm font-black text-slate-950 transition hover:bg-slate-200"
            onClick={addPage}
          >
            + Pagina
          </button>
        </div>
      </header>

      <PresenterBoard page={activePage} />
    </section>
  );
}
