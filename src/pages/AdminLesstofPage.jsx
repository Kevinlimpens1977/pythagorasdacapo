import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, BookOpen, CheckSquare, Clapperboard, FileStack, Scissors } from 'lucide-react';

// De drie stappen van de docentflow, in volgorde: bouwen → klaarzetten → volgen.
const hoofdacties = [
  {
    title: 'Bouwen',
    description: 'Maak vakken, hoofdstukken, paragrafen en lesblokken in het CMS.',
    actionLabel: 'Open bouwen',
    path: '/admin/cms',
    icon: BookOpen
  },
  {
    title: 'Klaarzetten',
    description: 'Kies per klas of leerling welke paragrafen en lesblokken zichtbaar zijn.',
    actionLabel: 'Open klaarzetten',
    path: '/admin/taken-toewijzen',
    icon: CheckSquare
  },
  {
    title: 'Voortgang',
    description: 'Volg per klas en per leerling hoe ver ze zijn met de lesstof.',
    actionLabel: 'Open voortgang',
    path: '/dashboard',
    icon: BarChart3
  }
];

const overigeActies = [
  {
    title: 'Crop-tool',
    description: 'Knip vragen en afbeeldingen uit een boekpagina of PDF, met OCR, direct je lesblokken in.',
    path: '/admin/crop-tool',
    icon: Scissors
  },
  {
    title: 'Digibord',
    description: 'Presenteer een paragraaf klassikaal op het digibord.',
    path: '/admin/digibord',
    icon: Clapperboard
  },
  {
    title: 'Slidedecks / NotebookLM',
    description: 'Maak bron-PDFs voor NotebookLM en upload presentaties terug naar Helix.',
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
            Bouw je lesmateriaal, zet het klaar voor je klassen en volg de voortgang.
          </p>
        </div>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          {hoofdacties.map((action) => {
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

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          {overigeActies.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.title}
                onClick={() => navigate(action.path)}
                className="group helix-action-card flex items-center gap-4 p-4 text-left"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]">
                  <Icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-base font-extrabold">{action.title}</h2>
                  <p className="mt-1 text-sm leading-5 opacity-80">{action.description}</p>
                </div>
                <ArrowRight size={18} className="shrink-0 transition-transform group-hover:translate-x-1" />
              </button>
            );
          })}
        </section>
      </div>
    </div>
  );
}
