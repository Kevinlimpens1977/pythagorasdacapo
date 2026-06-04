import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckSquare, Clapperboard, FileStack } from 'lucide-react';

const actions = [
  {
    title: 'Lesmateriaal bouwen',
    description: 'Maak theorie, voorbeelden, vragen, afbeeldingen en lesroutes met de crop- en OCR-workflow.',
    actionLabel: 'Open CMS',
    path: '/admin/cms',
    icon: BookOpen
  },
  {
    title: 'Lesmateriaal klaarzetten',
    description: 'Koppel hoofdstukken, paragrafen of specifieke lesblokken aan een klas of individuele leerling.',
    actionLabel: 'Open klaarzetstudio',
    path: '/admin/taken-toewijzen',
    icon: CheckSquare
  },
  {
    title: 'Digibord presenteren',
    description: 'Open je vak, leerjaar, hoofdstuk en paragraaf als klassikale presentatie.',
    actionLabel: 'Open Digibord',
    path: '/admin/digibord',
    icon: Clapperboard
  },
  {
    title: 'Slidedecks / NotebookLM',
    description: 'Maak bron-PDFs en prompts voor NotebookLM en upload gegenereerde presentatie-PDFs terug naar Helix.',
    actionLabel: 'Open Slidedeckcreator',
    path: '/admin/slidedecks',
    icon: FileStack
  }
];

export default function AdminLesstofPage() {
  const navigate = useNavigate();

  return (
    <div className="helix-page min-h-screen">
      <div className="helix-container">
        <div>
          <p className="helix-eyebrow">Werkplek</p>
          <h1 className="mt-2 helix-heading-xl">Lesstof</h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-[var(--helix-muted)]">
            Een centrale plek voor lesmateriaal, crops, teksten, afbeeldingen, vragen en klassikale presentaties.
          </p>
        </div>

        <section className="mt-8 grid gap-4 lg:grid-cols-4">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.title}
                onClick={() => navigate(action.path)}
                className="group helix-action-card flex h-full flex-col p-6 text-left"
              >
                <div className="flex flex-1 items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-extrabold">{action.title}</h2>
                      <p className="mt-2 max-w-xl text-sm leading-6 opacity-80">{action.description}</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="mt-2 shrink-0 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="mt-auto pt-6 text-center text-sm font-black">{action.actionLabel}</p>
              </button>
            );
          })}
        </section>
      </div>
    </div>
  );
}
