import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, PlayCircle } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import * as cmsService from '../../services/cmsService';
import * as klasService from '../../services/klasService';
import * as voortgangService from '../../services/voortgangService';
import { calculateLessonProgress } from '../../lib/studentLessonProgress';

export default function TableOfContents() {
  const navigate = useNavigate();
  const { klasData, currentUser } = useAuth();
  const [paragrafen, setParagrafen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoofdstukkenMap, setHoofdstukkenMap] = useState({});
  const [voortgangMap, setVoortgangMap] = useState({});

  useEffect(() => {
    const loadParagrafen = async () => {
      setLoading(true);

      try {
        const enabledParagraafIds = currentUser?.uid
          ? klasService.getStudentEffectiveParagrafen(klasData, currentUser.uid)
          : klasData?.enabledParagrafen || [];

        if (!enabledParagraafIds || enabledParagraafIds.length === 0) {
          setParagrafen([]);
          setHoofdstukkenMap({});
          setVoortgangMap({});
          setLoading(false);
          return;
        }

        const paragraafDetails = await Promise.all(
          enabledParagraafIds.map((id) => cmsService.getParagraaf(id).catch(() => null))
        );

        const validParagrafen = paragraafDetails.filter(Boolean);
        const paragraafWithContent = await Promise.all(
          validParagrafen.map(async (paragraaf) => {
            const [vragen, contentBlocks] = await Promise.all([
              cmsService.getVragen(paragraaf.id).catch(() => []),
              cmsService.getContentBlocks(paragraaf.id, false).catch(() => [])
            ]);

            return {
              ...paragraaf,
              vragen,
              vragenCount: vragen.length,
              contentBlocks,
              lesblokCount: contentBlocks.length
            };
          })
        );

        const progressMap = {};
        if (currentUser && klasData?.klasId) {
          for (const paragraaf of paragraafWithContent) {
            try {
              progressMap[paragraaf.id] = await voortgangService.getVoortgangForParagraaf(
                currentUser.uid,
                paragraaf.id
              );
            } catch (error) {
              console.error(`Error loading voortgang for ${paragraaf.id}:`, error);
              progressMap[paragraaf.id] = [];
            }
          }
        }

        const hoofdstukIds = [...new Set(paragraafWithContent.map((p) => p.hoofdstukId))];
        const hoofdstukkendataArray = await Promise.all(
          hoofdstukIds.map((id) => cmsService.getHoofdstuk(id).catch(() => null))
        );

        const hmapTemp = {};
        hoofdstukkendataArray.forEach((hoofdstuk) => {
          if (hoofdstuk) hmapTemp[hoofdstuk.id] = hoofdstuk;
        });

        setParagrafen(paragraafWithContent);
        setHoofdstukkenMap(hmapTemp);
        setVoortgangMap(progressMap);
      } catch (error) {
        console.error('Error loading paragraphs:', error);
        setParagrafen([]);
      } finally {
        setLoading(false);
      }
    };

    loadParagrafen();
  }, [klasData, currentUser]);

  const paragraafsByHoofdstuk = {};
  paragrafen.forEach((paragraaf) => {
    const hid = paragraaf.hoofdstukId;
    if (!paragraafsByHoofdstuk[hid]) {
      paragraafsByHoofdstuk[hid] = [];
    }
    paragraafsByHoofdstuk[hid].push(paragraaf);
  });

  const sortedHoofdstukIds = Object.keys(paragraafsByHoofdstuk).sort((a, b) => {
    const aOrder = hoofdstukkenMap[a]?.order || 999;
    const bOrder = hoofdstukkenMap[b]?.order || 999;
    return aOrder - bOrder;
  });

  if (loading) {
    return (
      <StudentShell>
        <div className="p-6 md:p-8">
          <div className="text-center text-slate-500">
            <p>Taken laden...</p>
          </div>
        </div>
      </StudentShell>
    );
  }

  if (paragrafen.length === 0) {
    return (
      <StudentShell>
        <div className="p-6 md:p-8">
          <div className="py-12 text-center">
            <BookOpen size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-medium text-slate-600">
              Nog geen taken klaarstaan voor jouw klas
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Je docent zet hier straks lessen voor je klaar.
            </p>
          </div>
        </div>
      </StudentShell>
    );
  }

  return (
    <StudentShell>
      <div className="p-6 md:p-8">
        <div className="space-y-8">
          {sortedHoofdstukIds.map((hoofdstukId) => {
            const hoofdstuk = hoofdstukkenMap[hoofdstukId];
            const paragrafenInHoofdstuk = paragraafsByHoofdstuk[hoofdstukId];

            return (
              <section key={hoofdstukId}>
                <h2 className="mb-4 border-b border-slate-200 pb-2 text-xl font-bold text-slate-800">
                  {hoofdstuk?.number && `${hoofdstuk.number}. `}
                  {hoofdstuk?.title || 'Hoofdstuk'}
                </h2>

                <div className="space-y-3">
                  {paragrafenInHoofdstuk.map((paragraaf) => {
                    const voortgang = voortgangMap[paragraaf.id] || [];
                    const hasLessonBlocks = paragraaf.lesblokCount > 0;
                    const blockProgress = calculateLessonProgress(paragraaf.contentBlocks || [], voortgang);
                    const completedQuestions = voortgang.filter((v) => v.completed === true && v.vraagId).length;
                    const totalQuestions = paragraaf.vragenCount || 0;
                    const totalItems = hasLessonBlocks ? blockProgress.totalBlocks : totalQuestions;
                    const completedItems = hasLessonBlocks ? blockProgress.completedBlocks : completedQuestions;
                    const progressPercent = hasLessonBlocks
                      ? blockProgress.percentage
                      : totalQuestions > 0
                        ? Math.round((completedQuestions / totalQuestions) * 100)
                        : 0;
                    const isCompleted = totalItems > 0 && completedItems === totalItems;

                    return (
                      <button
                        key={paragraaf.id}
                        onClick={() => navigate(`/chapter/${paragraaf.id}`)}
                        className="group flex w-full items-center justify-between gap-4 rounded-xl border border-transparent p-4 text-left transition-all hover:border-blue-100 hover:bg-blue-50 active:scale-[0.99]"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-4">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                              isCompleted
                                ? 'bg-green-100 text-green-600'
                                : 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 size={20} /> : <PlayCircle size={20} />}
                          </div>
                          <div className="min-w-0">
                            <h3 className="truncate text-lg font-semibold text-slate-800">
                              {paragraaf.number && `${paragraaf.number}. `}
                              {paragraaf.title}
                            </h3>
                            <span className="text-xs text-slate-500">
                              {hasLessonBlocks
                                ? `${paragraaf.lesblokCount} lesblok${paragraaf.lesblokCount !== 1 ? 'ken' : ''}`
                                : totalQuestions > 0
                                  ? `${totalQuestions} vraag${totalQuestions !== 1 ? 'en' : ''}`
                                  : 'Nog geen gepubliceerde lesblokken'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {totalItems > 0 && (
                            <div className="hidden flex-col items-end sm:flex">
                              <div className="mb-1 text-xs font-medium text-slate-500">
                                {completedItems} / {totalItems}
                              </div>
                              <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    isCompleted ? 'bg-green-500' : 'bg-blue-500'
                                  }`}
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                            </div>
                          )}
                          <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-600" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm font-semibold text-blue-900">
          Tip: open een les en werk de blokken rustig stap voor stap af. Helix onthoudt waar je gebleven bent.
        </div>
      </div>
    </StudentShell>
  );
}

function StudentShell({ children }) {
  return (
    <div className="mx-auto w-full max-w-6xl pad-content">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-slate-800 p-6 text-white sm:p-8">
          <div className="mb-2 flex items-center gap-3">
            <BookOpen size={30} className="text-blue-200" />
            <h1 className="text-2xl font-bold sm:text-3xl">Helix</h1>
          </div>
          <p className="ml-11 text-lg text-slate-300">Leeromgeving</p>
        </div>
        {children}
      </div>
    </div>
  );
}
