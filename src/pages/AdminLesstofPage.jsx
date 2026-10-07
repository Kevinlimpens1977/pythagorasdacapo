import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, BookOpen, CheckSquare, Clapperboard, FileStack, LockOpen, Scissors } from 'lucide-react';
import { Kaart, KaartKop, PaginaKop } from '../components/leeromgeving';

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
    title: 'Vrijgeven',
    description: 'Zet hele hoofdstukken per klas open of op slot. De klas ziet ze staan tot jij ze vrijgeeft.',
    actionLabel: 'Open vrijgeven',
    path: '/admin/vrijgeven',
    icon: LockOpen
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
    <div className="helix-page lo-tekst beheer-stijl min-h-screen">
      <div className="helix-container flex flex-col gap-8 py-10 md:py-12">
        <PaginaKop
          eyebrow="Werkplek"
          titel="Lesstof"
          uitleg="Bouw je lesmateriaal, zet het klaar voor je klassen en volg de voortgang."
        />

        <section className="lo-kaartenraster items-stretch">
          {hoofdacties.map((action) => {
            const Icon = action.icon;

            return (
              <Kaart
                as="button"
                key={action.title}
                onClick={() => navigate(action.path)}
                className="group h-full cursor-pointer text-left transition-shadow hover:ring-2 hover:ring-[var(--lo-blauw)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--lo-blauw)]"
              >
                <div className="flex flex-1 items-start gap-3">
                  <span className="lo-hblok lo-hblok--dicht"><Icon size={18} aria-hidden="true" /></span>
                  <div className="min-w-0 flex-1">
                    <KaartKop titel={action.title} uitleg={action.description} />
                  </div>
                  <ArrowRight size={20} aria-hidden="true" className="mt-1 shrink-0 text-[var(--lo-grijs)] transition-transform group-hover:translate-x-1" />
                </div>
                <p className="lo-onderregel mt-auto font-bold text-[var(--lo-blauw-inkt)]">{action.actionLabel}</p>
              </Kaart>
            );
          })}
        </section>

        <section className="lo-kaartenraster items-stretch">
          {overigeActies.map((action) => {
            const Icon = action.icon;

            return (
              <Kaart
                as="button"
                key={action.title}
                onClick={() => navigate(action.path)}
                className="group h-full cursor-pointer flex-row items-center gap-3 p-4 text-left transition-shadow hover:ring-2 hover:ring-[var(--lo-blauw)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--lo-blauw)]"
              >
                <span className="lo-hblok lo-hblok--dicht"><Icon size={18} aria-hidden="true" /></span>
                <div className="min-w-0 flex-1">
                  <KaartKop titel={action.title} uitleg={action.description} />
                </div>
                <ArrowRight size={18} aria-hidden="true" className="shrink-0 text-[var(--lo-grijs)] transition-transform group-hover:translate-x-1" />
              </Kaart>
            );
          })}
        </section>
      </div>
    </div>
  );
}
