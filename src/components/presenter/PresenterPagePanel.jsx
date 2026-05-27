import { Copy, Plus, Trash2 } from 'lucide-react';

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

  return (
    <aside className="absolute bottom-24 right-3 z-20 w-[min(24rem,calc(100vw-1.5rem))] overflow-hidden rounded-lg border border-slate-300 bg-slate-50 shadow-xl sm:right-5">
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

      <div className="max-h-[45vh] overflow-y-auto p-2">
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
                    className="flex min-h-12 w-full items-center gap-3 rounded-md px-2 text-left transition hover:bg-slate-200/70"
                    onClick={() => onSelectPage?.(page.id)}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-slate-900 text-sm font-black text-slate-50">
                      {index + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-black text-slate-950">
                        {page.title || `Pagina ${index + 1}`}
                      </span>
                      <span className="block text-xs font-semibold text-slate-500">
                        {isActive ? 'Actief' : 'Tik om te openen'}
                      </span>
                    </span>
                  </button>

                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md border border-slate-300 px-2 text-sm font-black text-slate-800 transition hover:bg-slate-100"
                      onClick={() => onDuplicatePage?.(page.id)}
                    >
                      <Copy size={17} strokeWidth={2.4} />
                      Dupliceer
                    </button>
                    <button
                      type="button"
                      className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md border border-red-200 px-2 text-sm font-black text-red-700 transition hover:bg-red-50"
                      onClick={() => onDeletePage?.()}
                    >
                      <Trash2 size={17} strokeWidth={2.4} />
                      Verwijder
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </aside>
  );
}
