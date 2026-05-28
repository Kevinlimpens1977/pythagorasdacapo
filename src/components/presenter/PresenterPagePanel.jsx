import { Copy, Plus, Trash2 } from 'lucide-react';
import PresenterPageThumbnail from './PresenterPageThumbnail';

export default function PresenterPagePanel({
  pages,
  activePageId,
  open,
  onSelectPage,
  onAddPage,
  onDuplicatePage,
  onDeletePage
}) {
  if (!open) return null;

  const safePages = Array.isArray(pages) ? pages : [];
  const activePage = safePages.find((page) => page.id === activePageId);

  return (
    <aside className="absolute bottom-24 left-3 z-20 w-[min(24rem,calc(100vw-1.5rem))] overflow-hidden rounded-lg border border-slate-300 bg-slate-50 shadow-xl sm:left-5">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <h2 className="text-base font-black text-slate-950">Pagina&apos;s</h2>
        <button
          type="button"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-3 text-sm font-black text-slate-50 transition hover:bg-slate-800"
          onClick={onAddPage}
        >
          <Plus size={18} strokeWidth={2.4} />
          Nieuw
        </button>
      </div>

      <div className="max-h-[52vh] overflow-y-auto p-2">
        {safePages.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm font-semibold text-slate-500">Geen pagina&apos;s</p>
        ) : (
          <ol className="space-y-2">
            {safePages.map((page, index) => {
              const isActive = page.id === activePageId;

              return (
                <li
                  key={page.id || index}
                  className={`rounded-md border p-2 ${
                    isActive ? 'border-slate-950 bg-slate-100' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <button
                    type="button"
                    className="flex min-h-24 w-full items-center gap-3 rounded-md p-2 text-left transition hover:bg-slate-200/70"
                    onClick={() => onSelectPage?.(page.id)}
                  >
                    <PresenterPageThumbnail active={isActive} page={page} pageNumber={index + 1} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-black text-slate-950">
                        {page.title || `Pagina ${index + 1}`}
                      </span>
                      <span className="block text-xs font-semibold text-slate-500">
                        {isActive ? 'Actief' : 'Tik om te openen'}
                      </span>
                      <span className="mt-2 block text-xs font-semibold text-slate-400">
                        {(Array.isArray(page.strokes) ? page.strokes.length : 0)} lijnen &middot;{' '}
                        {(Array.isArray(page.objects) ? page.objects.length : 0)} objecten
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      <div className="border-t border-slate-200 bg-slate-100 px-4 py-3">
        <p className="mb-2 truncate text-xs font-black uppercase tracking-wide text-slate-500">
          Actieve pagina: {activePage?.title || 'Geen pagina'}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md border border-slate-300 bg-slate-50 px-2 text-sm font-black text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-45"
            onClick={() => onDuplicatePage?.()}
            disabled={!activePage}
          >
            <Copy size={17} strokeWidth={2.4} />
            Dupliceer
          </button>
          <button
            type="button"
            className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md border border-red-200 bg-slate-50 px-2 text-sm font-black text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-45"
            onClick={() => onDeletePage?.()}
            disabled={!activePage}
          >
            <Trash2 size={17} strokeWidth={2.4} />
            Verwijder
          </button>
        </div>
      </div>
    </aside>
  );
}
