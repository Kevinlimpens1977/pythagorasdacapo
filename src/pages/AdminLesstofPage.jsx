import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Clapperboard, Crop, FileStack, Image, Layers3 } from 'lucide-react';

const actions = [
  {
    title: 'Lesmateriaal bouwen',
    description: 'Maak theorie, voorbeelden, vragen, afbeeldingen en lesroutes met de crop- en OCR-workflow.',
    actionLabel: 'Open CMS',
    path: '/admin/cms',
    icon: BookOpen,
    tone: 'bg-slate-900 text-white'
  },
  {
    title: 'Digibord presenteren',
    description: 'Open je vak, leerjaar, hoofdstuk en paragraaf als klassikale presentatie.',
    actionLabel: 'Open Digibord',
    path: '/admin/digibord',
    icon: Clapperboard,
    tone: 'bg-white text-slate-900 border border-slate-200'
  },
  {
    title: 'Slidedecks / NotebookLM',
    description: 'Maak bron-PDFs en prompts voor NotebookLM en upload gegenereerde presentatie-PDFs terug naar Helix.',
    actionLabel: 'Open Slidedeckcreator',
    path: '/admin/slidedecks',
    icon: FileStack,
    tone: 'bg-white text-slate-900 border border-slate-200'
  }
];

const capabilityCards = [
  { title: 'Crops en OCR', description: 'Zet bronmateriaal sneller om naar uitleg, afbeeldingen en vragen.', icon: Crop },
  { title: 'Theorie en voorbeelden', description: 'Bouw leerlingvriendelijke uitleg in vaste volgorde.', icon: Layers3 },
  { title: 'Media', description: 'Voeg afbeeldingen, crops en visuele ondersteuning toe.', icon: Image }
];

export default function AdminLesstofPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-8 md:py-12">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-blue-600">Werkplek</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900">Lesstof</h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
            Een centrale plek voor lesmateriaal, crops, teksten, afbeeldingen, vragen en klassikale presentaties.
          </p>
        </div>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.title}
                onClick={() => navigate(action.path)}
                className={`group rounded-lg p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-200 ${action.tone}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black">{action.title}</h2>
                      <p className="mt-2 max-w-xl text-sm leading-6 opacity-80">{action.description}</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="mt-2 shrink-0 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="mt-6 text-sm font-black">{action.actionLabel}</p>
              </button>
            );
          })}
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-black text-slate-900">Wat hoort hier?</h2>
          <p className="mt-1 text-sm text-slate-500">Alles wat nodig is om lesmateriaal te produceren en te presenteren.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {capabilityCards.map((card) => {
              const Icon = card.icon;

              return (
                <div key={card.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-4 font-black text-slate-900">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{card.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
