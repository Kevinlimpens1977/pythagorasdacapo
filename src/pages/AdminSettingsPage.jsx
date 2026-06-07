import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bot, Bug, Coins, SettingsIcon } from 'lucide-react';

const settingsSections = [
  {
    title: 'Digidocent instellingen',
    description: 'Beheer de OpenRouter-koppeling, het model, globale AI-hulp en de Digidocent-regels.',
    actionLabel: 'Open Digidocent',
    path: '/admin/ai-instellingen',
    icon: Bot,
    tone: 'text-violet-600 bg-violet-50'
  },
  {
    title: 'Leerlingmeldingen',
    description: 'Bekijk open bugmeldingen van leerlingen en werk status of adminnotitie bij.',
    actionLabel: 'Open meldingen',
    path: '/admin/meldingen',
    icon: Bug,
    tone: 'text-red-600 bg-red-50'
  },
  {
    title: 'Tokenbeheer',
    description: 'Beheer tokenbalansen, correcties, shopitems, afbeeldingen en tokenprijzen.',
    actionLabel: 'Open tokenbeheer',
    path: '/admin/tokenbeheer',
    icon: Coins,
    tone: 'text-amber-700 bg-amber-50'
  }
];

export default function AdminSettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="helix-page min-h-screen">
      <div className="helix-container max-w-5xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="helix-eyebrow">Werkplek</p>
            <h1 className="mt-2 helix-heading-xl">Instellingen</h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-[var(--helix-muted)]">
              Beheer platformbrede instellingen die niet bij lesstof, leerlingen of voortgang horen.
            </p>
          </div>

          <div className="hidden h-14 w-14 items-center justify-center rounded-2xl border border-[var(--helix-border)] bg-white/90 text-[var(--helix-purple)] shadow-[var(--helix-shadow-card)] sm:flex">
            <SettingsIcon size={26} />
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {settingsSections.map((section) => {
            const Icon = section.icon;

            return (
              <button
                key={section.title}
                type="button"
                onClick={() => navigate(section.path)}
                className="group helix-action-card p-5 text-left"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${section.tone}`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-extrabold text-[var(--helix-navy)]">{section.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-[var(--helix-muted)]">{section.description}</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="mt-2 shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-[var(--helix-pink)]" />
                </div>
                <p className="mt-6 text-sm font-black text-[var(--helix-purple)]">{section.actionLabel}</p>
              </button>
            );
          })}
        </section>
      </div>
    </div>
  );
}
