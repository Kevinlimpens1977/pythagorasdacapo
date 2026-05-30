import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Bot,
  BookOpen,
  CheckSquare,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Presentation,
  Users,
  Users2
} from 'lucide-react';
import StudentLoginInfoModal from '../components/admin/StudentLoginInfoModal';
import * as klasService from '../services/klasService';
import { buildAdminDashboardStats } from '../lib/adminDashboardStats';

const statConfig = [
  {
    key: 'classCount',
    label: 'Klassen',
    description: 'Aangemaakt in het platform',
    icon: GraduationCap,
    tone: 'text-blue-600 bg-blue-50'
  },
  {
    key: 'studentCount',
    label: 'Leerlingen',
    description: 'Gekoppeld aan klassen',
    icon: Users,
    tone: 'text-emerald-600 bg-emerald-50'
  },
  {
    key: 'activeParagraphCount',
    label: 'Actieve paragrafen',
    description: 'Toegewezen aan minstens één klas',
    icon: BookOpen,
    tone: 'text-amber-600 bg-amber-50'
  }
];

const quickActions = [
  {
    title: 'Lesstof bouwen',
    description: 'Open de plek voor CMS, crops, teksten, afbeeldingen en Digibord.',
    actionLabel: 'Open Lesstof',
    icon: BookOpen,
    path: '/admin/lesstof',
    tone: 'helix-gradient text-white shadow-[var(--helix-shadow-glow)]'
  },
  {
    title: 'Lesmateriaal klaarzetten',
    description: 'Koppel hoofdstukken, paragrafen of lesblokken aan klas of leerling.',
    actionLabel: 'Open klaarzetstudio',
    icon: CheckSquare,
    path: '/admin/taken-toewijzen',
    tone: 'bg-white/90 text-[var(--helix-navy)] hover:bg-white border border-[var(--helix-border)]'
  },
  {
    title: 'Voortgang bekijken',
    description: 'Bekijk klasresultaten, leerlingvoortgang en signalen.',
    actionLabel: 'Open Voortgang',
    icon: BarChart3,
    path: '/dashboard',
    tone: 'bg-[var(--helix-navy)] text-white hover:opacity-95'
  },
  {
    title: 'Leerlingen beheren',
    description: 'Bekijk accounts, klaskoppeling en accountstatus.',
    actionLabel: 'Open Leerlingen',
    icon: Users,
    path: '/admin/leerlingen',
    tone: 'bg-white/90 text-[var(--helix-navy)] hover:bg-white border border-[var(--helix-border)]'
  }
];

const workflowGroups = [
  {
    title: 'Lesstof',
    description: 'Maak, verrijk en presenteer lesmateriaal.',
    items: [
      {
        title: 'Lesstof werkplek',
        description: 'Centrale plek voor CMS, crops, media en Digibord.',
        actionLabel: 'Open Lesstof',
        icon: BookOpen,
        path: '/admin/lesstof',
        tone: 'text-violet-600 bg-violet-50'
      },
      {
        title: 'Digibord',
        description: 'Presenteer slides fullscreen.',
        actionLabel: 'Open digibord',
        icon: Presentation,
        path: '/admin/digibord',
        tone: 'text-blue-600 bg-blue-50'
      }
    ]
  },
  {
    title: 'Leerlingen',
    description: 'Beheer accountoverzicht en klaskoppeling.',
    items: [
      {
        title: 'Leerlingaccounts',
        description: 'Bekijk leerlingen, e-mailadressen en gekoppelde klassen.',
        actionLabel: 'Open Leerlingen',
        icon: Users,
        path: '/admin/leerlingen',
        tone: 'text-emerald-600 bg-emerald-50'
      },
      {
        title: 'Startinformatie',
        description: 'Toon inloginstructies aan leerlingen.',
        actionLabel: 'Toon info',
        icon: MessageSquare,
        modal: 'student-login-info',
        tone: 'text-rose-600 bg-rose-50'
      }
    ]
  },
  {
    title: 'Beheer',
    description: 'Organiseer klassen, taken en instellingen.',
    items: [
      {
        title: 'Klassen beheer',
        description: 'Maak klassen en beheer instellingen.',
        actionLabel: 'Beheer klassen',
        icon: Users2,
        path: '/admin/klassen',
        tone: 'text-amber-600 bg-amber-50'
      },
      {
        title: 'Lesmateriaal klaarzetten',
        description: 'Zet hoofdstukken, paragrafen of lesblokken klaar voor klassen en leerlingen.',
        actionLabel: 'Open klaarzetstudio',
        icon: CheckSquare,
        path: '/admin/taken-toewijzen',
        tone: 'text-emerald-600 bg-emerald-50'
      },
      {
        title: 'P-AI-co instellingen',
        description: 'Beheer OpenRouter-key, model en globale AI-hulp.',
        actionLabel: 'Open AI-beheer',
        icon: Bot,
        path: '/admin/ai-instellingen',
        tone: 'text-violet-600 bg-violet-50'
      }
    ]
  },
  {
    title: 'Inzicht',
    description: 'Volg voortgang en signalen.',
    items: [
      {
        title: 'Leerlingresultaten',
        description: 'Monitor voortgang van je leerlingen.',
        actionLabel: 'Bekijk resultaten',
        icon: BarChart3,
        path: '/dashboard',
        tone: 'text-indigo-600 bg-indigo-50'
      },
      {
        title: 'Klas dashboard',
        description: 'Bekijk klassikale voortgang en gemiddelden.',
        actionLabel: 'Open dashboard',
        icon: LayoutDashboard,
        path: '/dashboard',
        tone: 'text-sky-600 bg-sky-50'
      }
    ]
  },
];

const StatCard = ({ stat, value, loading }) => {
  const Icon = stat.icon;

  return (
    <div className="helix-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[var(--helix-muted)]">{stat.label}</p>
          <div className="mt-2 font-display text-3xl font-extrabold text-[var(--helix-navy)]">
            {loading ? <span className="block h-9 w-16 animate-pulse rounded bg-slate-200" /> : value}
          </div>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.tone}`}>
          <Icon size={22} />
        </div>
      </div>
      <p className="mt-4 text-sm leading-5 text-[var(--helix-muted)]">{stat.description}</p>
    </div>
  );
};

const QuickAction = ({ action, onSelect }) => {
  const Icon = action.icon;

  return (
    <button
      onClick={() => onSelect(action)}
      className={`group rounded-3xl px-5 py-4 text-left shadow-sm transition-all hover:-translate-y-0.5 focus:outline-none ${action.tone}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Icon size={22} className="mt-0.5 shrink-0" />
          <div>
            <h3 className="font-black">{action.title}</h3>
            <p className="mt-1 text-sm leading-5 opacity-80">{action.description}</p>
          </div>
        </div>
        <ArrowRight size={18} className="mt-1 shrink-0 transition-transform group-hover:translate-x-0.5" />
      </div>
      <div className="mt-4 text-sm font-black">{action.actionLabel}</div>
    </button>
  );
};

const WorkflowItem = ({ item, onSelect }) => {
  const Icon = item.icon;

  return (
    <button
      onClick={() => onSelect(item)}
      className="group flex w-full items-start justify-between gap-4 rounded-2xl border border-[var(--helix-border)] bg-white/88 p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-[var(--helix-shadow-card)] focus:outline-none"
    >
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${item.tone}`}>
          <Icon size={20} />
        </div>
        <div>
          <h3 className="font-display font-extrabold text-[var(--helix-navy)]">{item.title}</h3>
          <p className="mt-1 text-sm leading-5 text-[var(--helix-muted)]">{item.description}</p>
          <p className="mt-3 text-sm font-black text-[var(--helix-purple)]">{item.actionLabel}</p>
        </div>
      </div>
      <ArrowRight size={18} className="mt-2 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--helix-pink)]" />
    </button>
  );
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [showStudentLoginInfo, setShowStudentLoginInfo] = useState(false);
  const [klassenWithStudents, setKlassenWithStudents] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError(null);

        const klassen = await klasService.getAvailableKlassen();
        const enrichedKlassen = await Promise.all(
          klassen.map(async (klas) => {
            try {
              const students = await klasService.getKlasStudents(klas.id);
              return { ...klas, students };
            } catch (error) {
              console.error(`Kon leerlingen voor klas ${klas.id} niet laden:`, error);
              return { ...klas, students: [] };
            }
          })
        );

        if (isMounted) {
          setKlassenWithStudents(enrichedKlassen);
        }
      } catch (error) {
        console.error('Kon Admin Hub statistieken niet laden:', error);
        if (isMounted) {
          setStatsError('Statistieken konden niet worden geladen.');
          setKlassenWithStudents([]);
        }
      } finally {
        if (isMounted) {
          setStatsLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(
    () => buildAdminDashboardStats(klassenWithStudents),
    [klassenWithStudents]
  );

  const handleSelect = (item) => {
    if (item.modal === 'student-login-info') {
      setShowStudentLoginInfo(true);
      return;
    }

    navigate(item.path);
  };

  return (
    <div className="helix-page min-h-screen">
      <div className="helix-container">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="helix-eyebrow">Werkplek</p>
            <h1 className="mt-2 helix-heading-xl">Beheer</h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-[var(--helix-muted)]">
              Je rustige startplek voor klassen, taken, leerlingen en platformacties.
            </p>
          </div>

          {statsError && (
            <div className="helix-alert flex max-w-md items-start gap-3 px-4 py-3 text-sm">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{statsError}</span>
            </div>
          )}
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {statConfig.map((stat) => (
            <StatCard
              key={stat.key}
              stat={stat}
              value={stats[stat.key]}
              loading={statsLoading}
            />
          ))}
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-extrabold text-[var(--helix-navy)]">Snel aan de slag</h2>
              <p className="mt-1 text-sm text-[var(--helix-muted)]">De acties die je op een lesdag het vaakst nodig hebt.</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            {quickActions.map((action) => (
              <QuickAction key={action.title} action={action} onSelect={handleSelect} />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4">
            <h2 className="font-display text-xl font-extrabold text-[var(--helix-navy)]">Beheer</h2>
            <p className="mt-1 text-sm text-[var(--helix-muted)]">Alle adminonderdelen gegroepeerd per werkstroom.</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {workflowGroups.map((group) => (
              <div key={group.title} className="helix-card p-5">
                <div className="mb-4">
                  <h2 className="font-display text-lg font-extrabold text-[var(--helix-navy)]">{group.title}</h2>
                  <p className="mt-1 text-sm text-[var(--helix-muted)]">{group.description}</p>
                </div>

                <div className="space-y-3">
                  {group.items.map((item) => (
                    <WorkflowItem key={item.title} item={item} onSelect={handleSelect} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <StudentLoginInfoModal
        isOpen={showStudentLoginInfo}
        onClose={() => setShowStudentLoginInfo(false)}
      />
    </div>
  );
}
