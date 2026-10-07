import { FileText } from 'lucide-react';
import { PaginaKop } from '../components/leeromgeving';
import { projectKompasMarkdown, projectKompasUpdatedAt } from 'virtual:project-kompas';
import {
  formatProjectKompasUpdatedAt,
  renderProjectKompasMarkdown
} from '../lib/projectKompasMarkdown';

const { html, toc } = renderProjectKompasMarkdown(projectKompasMarkdown);

export default function AdminProjectKompasPage() {
  return (
    <div className="helix-page beheer-stijl lo-tekst min-h-screen">
      <div className="helix-container flex max-w-[92rem] flex-col gap-8 py-10 md:py-12">
        <PaginaKop
          eyebrow="Projectkompas"
          titel="HELIX Projectkompas"
          uitleg="Actuele leesweergave van het markdownbestand dat als contextanker voor HELIX wordt gebruikt."
          acties={(
            <div className="lo-kaart flex-row items-center gap-3 px-4 py-3 text-sm">
              <FileText size={18} className="text-[var(--lo-blauw-inkt)]" />
              <div>
                <p className="lo-onderregel font-bold">Laatste wijziging .md</p>
                <p className="font-extrabold text-[var(--lo-inkt)]">
                  {formatProjectKompasUpdatedAt(projectKompasUpdatedAt)}
                </p>
              </div>
            </div>
          )}
        />

        <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <aside className="lo-kaart block max-h-[calc(100vh-8rem)] overflow-auto p-5 lg:sticky lg:top-28">
            <h2 className="lo-kaart-titel">Navigatie</h2>
            <nav className="mt-4 space-y-1">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block rounded-[var(--lo-hoek-m)] px-3 py-2 text-sm font-bold text-[var(--lo-grijs)] transition hover:bg-[var(--lo-blauw-zacht)] hover:text-[var(--lo-blauw-inkt)] ${
                    item.level === 1 ? '' : item.level === 2 ? 'ml-3' : 'ml-6 text-xs'
                  }`}
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </aside>

          <article className="lo-kaart block p-6 md:p-10">
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
