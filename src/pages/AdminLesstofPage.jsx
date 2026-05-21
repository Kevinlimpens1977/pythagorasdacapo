import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckSquare, Clapperboard, Crop, FileStack, Image, Layers3 } from 'lucide-react';

const actions = [
  {
    title: 'Lesmateriaal bouwen',
    description: 'Maak theorie, voorbeelden, vragen, afbeeldingen en lesroutes met de crop- en OCR-workflow.',
    actionLabel: 'Open CMS',
    path: '/admin/cms',
    icon: BookOpen,
    tone: 'bg-[var(--helix-navy)] text-white'
  },
  {
    title: 'Lesmateriaal klaarzetten',
    description: 'Koppel hoofdstukken, paragrafen of specifieke lesblokken aan een klas of individuele leerling.',
    actionLabel: 'Open klaarzetstudio',
    path: '/admin/taken-toewijzen',
    icon: CheckSquare,
    tone: 'helix-gradient text-white'
  },
  {
    title: 'Digibord presenteren',
    description: 'Open je vak, leerjaar, hoofdstuk en paragraaf als klassikale presentatie.',
    actionLabel: 'Open Digibord',
    path: '/admin/digibord',
    icon: Clapperboard,
    tone: 'bg-white/90 text-[var(--helix-navy)] border border-[var(--helix-border)]'
  },
  {
    title: 'Slidedecks / NotebookLM',
    description: 'Maak bron-PDFs en prompts voor NotebookLM en upload gegenereerde presentatie-PDFs terug naar Helix.',
    actionLabel: 'Open Slidedeckcreator',
    path: '/admin/slidedecks',
    icon: FileStack,
    tone: 'bg-white/90 text-[var(--helix-navy)] border border-[var(--helix-border)]'
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
                className={`group rounded-3xl p-6 text-left shadow-[var(--helix-shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--helix-shadow-soft)] focus:outline-none ${action.tone}`}
              >
                <div className="flex items-start justify-between gap-4">
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
                <p className="mt-6 text-sm font-black">{action.actionLabel}</p>
              </button>
            );
          })}
        </section>

        <section className="mt-10">
          <h2 className="font-display text-xl font-extrabold text-[var(--helix-navy)]">Wat hoort hier?</h2>
          <p className="mt-1 text-sm text-[var(--helix-muted)]">Alles wat nodig is om lesmateriaal te produceren en te presenteren.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {capabilityCards.map((card) => {
              const Icon = card.icon;

              return (
                <div key={card.title} className="helix-card p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-4 font-display font-extrabold text-[var(--helix-navy)]">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--helix-muted)]">{card.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
