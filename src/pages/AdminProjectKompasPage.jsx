import { FileText } from 'lucide-react';
import { projectKompasMarkdown, projectKompasUpdatedAt } from 'virtual:project-kompas';
import {
  formatProjectKompasUpdatedAt,
  renderProjectKompasMarkdown
} from '../lib/projectKompasMarkdown';

const { html, toc } = renderProjectKompasMarkdown(projectKompasMarkdown);

export default function AdminProjectKompasPage() {
  return (
    <div className="helix-page min-h-screen">
      <div className="helix-container max-w-[92rem]">
        <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="helix-eyebrow">Projectkompas</p>
            <h1 className="mt-2 helix-heading-xl">HELIX Projectkompas</h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-[var(--helix-muted)]">
              Actuele leesweergave van het markdownbestand dat als contextanker voor HELIX wordt gebruikt.
            </p>
          </div>

          <div className="helix-card flex items-center gap-3 px-4 py-3 text-sm">
            <FileText size={18} className="text-[var(--helix-purple)]" />
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">Laatste wijziging .md</p>
              <p className="font-black text-[var(--helix-navy)]">
                {formatProjectKompasUpdatedAt(projectKompasUpdatedAt)}
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <aside className="helix-surface max-h-[calc(100vh-8rem)] overflow-auto p-5 lg:sticky lg:top-28">
            <h2 className="font-display text-lg font-extrabold text-[var(--helix-navy)]">Navigatie</h2>
            <nav className="mt-4 space-y-1">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block rounded-xl px-3 py-2 text-sm font-bold text-[var(--helix-muted)] transition hover:bg-[var(--helix-soft-lavender)] hover:text-[var(--helix-purple)] ${
                    item.level === 1 ? '' : item.level === 2 ? 'ml-3' : 'ml-6 text-xs'
                  }`}
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </aside>

          <article className="helix-surface p-6 md:p-10">
            <div
              className="project-kompas-document"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </article>
        </div>
      </div>
    </div>
  );
}
