import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bot, Bug, Coins, Palette } from 'lucide-react';
import { Kaart, KaartKop, PaginaKop } from '../components/leeromgeving';
import CmsResetButton from '../components/admin/CmsResetButton';
import DeleteStudentsButton from '../components/admin/DeleteStudentsButton';

const settingsSections = [
  {
    title: 'Digidocent instellingen',
    description: 'Beheer de OpenRouter-koppeling, het model, globale AI-hulp en de Digidocent-regels.',
    actionLabel: 'Open Digidocent',
    path: '/admin/ai-instellingen',
    icon: Bot,
    tone: 'text-[var(--lo-paars-inkt)]'
  },
  {
    title: 'Leerlingmeldingen',
    description: 'Bekijk open bugmeldingen van leerlingen en werk status of adminnotitie bij.',
    actionLabel: 'Open meldingen',
    path: '/admin/meldingen',
    icon: Bug,
    tone: 'text-[var(--lo-rood-inkt)]'
  },
  {
    title: 'Tokenbeheer',
    description: 'Beheer tokenbalansen, correcties, shopitems, afbeeldingen en tokenprijzen.',
    actionLabel: 'Open tokenbeheer',
    path: '/admin/tokenbeheer',
    icon: Coins,
    tone: 'text-[var(--lo-oranje-inkt)]'
  },
  {
    title: 'Stijlgids leeromgeving',
    description: 'Alle bouwstenen van de websitestijl naast elkaar: kaarten, rijen, H-blokjes, knoppen en kleuren.',
    actionLabel: 'Open stijlgids',
    path: '/admin/stijlgids',
    icon: Palette,
    tone: 'text-[var(--lo-oranje-inkt)]'
  }
];

export default function AdminSettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="helix-page lo-tekst beheer-stijl min-h-screen">
      <div className="helix-container flex max-w-5xl flex-col gap-8 py-10 md:py-12">
        <PaginaKop
          eyebrow="Werkplek"
          titel="Instellingen"
          uitleg="Beheer platformbrede instellingen die niet bij lesstof, leerlingen of voortgang horen."
        />

        <section className="lo-kaartenraster items-stretch">
          {settingsSections.map((section) => {
            const Icon = section.icon;

            return (
              <Kaart
                as="button"
                key={section.title}
                type="button"
                onClick={() => navigate(section.path)}
                className="group h-full cursor-pointer text-left transition-shadow hover:ring-2 hover:ring-[var(--lo-blauw)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--lo-blauw)]"
              >
                <div className="flex flex-1 items-start gap-3">
                  <span className={`lo-hblok lo-hblok--dicht ${section.tone}`}><Icon size={18} aria-hidden="true" /></span>
                  <div className="min-w-0 flex-1">
                    <KaartKop titel={section.title} uitleg={section.description} />
                  </div>
                  <ArrowRight size={20} aria-hidden="true" className="mt-1 shrink-0 text-[var(--lo-grijs)] transition-transform group-hover:translate-x-1" />
                </div>
                <p className="lo-onderregel mt-auto font-bold text-[var(--lo-blauw-inkt)]">{section.actionLabel}</p>
              </Kaart>
            );
          })}
        </section>

        {/* Stonden eerder in de menubalk; daar waren ze te makkelijk te raken. */}
        <Kaart>
          <KaartKop titel="Beheeracties" uitleg="Grote acties op de database. Elke knop vraagt eerst om een bevestiging." />
          <div className="lo-knoppenbalk">
            <DeleteStudentsButton />
            <CmsResetButton />
          </div>
        </Kaart>
      </div>
    </div>
  );
}
