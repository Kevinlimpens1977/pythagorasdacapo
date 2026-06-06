import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, PlayCircle } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import * as cmsService from '../../services/cmsService';
import * as klasService from '../../services/klasService';
import * as voortgangService from '../../services/voortgangService';
import { calculateLessonProgress } from '../../lib/studentLessonProgress';
import { getEffectiveContentBlocks } from '../../lib/assignmentUtils';
import { getEffectiveKlasId } from '../../lib/classIdUtils';
import helixLogo from '../../afbeeldingen/logo.png';

export default function TableOfContents() {
  const navigate = useNavigate();
  const { klasData, currentUser, userData, klasId: authKlasId } = useAuth();
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
              cmsService.getPublicVragen(paragraaf.id).catch(() => []),
              cmsService.getAssignedPublicContentBlocks({
                paragraafId: paragraaf.id,
                klasData,
                userId: currentUser?.uid || ''
              }).catch(() => [])
            ]);
            const visibleContentBlocks = currentUser?.uid
              ? getEffectiveContentBlocks(klasData, currentUser.uid, paragraaf.id, contentBlocks)
              : contentBlocks;

            return {
              ...paragraaf,
              vragen,
              vragenCount: vragen.length,
              contentBlocks: visibleContentBlocks,
              lesblokCount: visibleContentBlocks.length
            };
          })
        );

        const progressMap = {};
        const effectiveKlasId = getEffectiveKlasId({ authKlasId, userData, klasData });
        if (currentUser && effectiveKlasId) {
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
  }, [authKlasId, klasData, currentUser, userData]);

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
          <div className="text-center text-[var(--helix-muted)]">
            <p className="font-bold">Taken laden...</p>
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
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]">
              <BookOpen size={34} />
            </div>
            <p className="font-display text-xl font-extrabold text-[var(--helix-navy)]">
              Nog geen taken klaarstaan voor jouw klas
            </p>
            <p className="mt-2 text-sm text-[var(--helix-muted)]">
              Je docent zet hier straks lessen voor je klaar.
            </p>
          </div>
        </div>
      </StudentShell>
    );
  }

  return (
    <StudentShell>
      <div className="p-5 md:p-8">
        <div className="space-y-8">
          {sortedHoofdstukIds.map((hoofdstukId) => {
            const hoofdstuk = hoofdstukkenMap[hoofdstukId];
            const paragrafenInHoofdstuk = paragraafsByHoofdstuk[hoofdstukId];

            return (
              <section key={hoofdstukId}>
                <h2 className="mb-4 border-b border-[var(--helix-border)] pb-3 font-display text-xl font-extrabold text-[var(--helix-navy)]">
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
                        className="group helix-action-card flex w-full items-center justify-between gap-4 p-4 text-left"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-4">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                              isCompleted
                                ? 'bg-green-100 text-green-600'
                                : 'bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)] group-hover:bg-[var(--helix-purple)] group-hover:text-white'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 size={20} /> : <PlayCircle size={20} />}
                          </div>
                          <div className="min-w-0">
                            <h3 className="truncate font-display text-lg font-bold text-[var(--helix-navy)]">
                              {paragraaf.number && `${paragraaf.number}. `}
                              {paragraaf.title}
                            </h3>
                            <span className="text-xs font-semibold text-[var(--helix-muted)]">
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
                              <div className="mb-1 text-xs font-bold text-[var(--helix-muted)]">
                                {completedItems} / {totalItems}
                              </div>
                              <div className="helix-progress-track h-2 w-24">
                                <div
                                  className={isCompleted ? 'h-full rounded-full bg-green-500 transition-all duration-500' : 'helix-progress-fill'}
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                            </div>
                          )}
                          <ArrowRight size={18} className="text-slate-300 group-hover:text-[var(--helix-pink)]" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <div className="helix-alert mt-8 px-5 py-4 text-sm font-semibold">
          Tip: open een les en werk de blokken rustig stap voor stap af. Helix onthoudt waar je gebleven bent.
        </div>
      </div>
    </StudentShell>
  );
}

function StudentShell({ children }) {
  return (
    <div className="mx-auto w-full max-w-6xl pad-content">
      <div className="helix-surface overflow-hidden">
        <div className="relative overflow-hidden bg-[var(--helix-navy)] p-6 text-white sm:p-8">
          <div className="helix-login-visual-bg absolute inset-0 opacity-80" />
          <div className="relative">
            <div className="inline-flex h-24 w-48 items-center justify-center overflow-hidden rounded-2xl bg-white/96 shadow-[0_18px_38px_rgba(11,19,43,0.22)]">
              <img src={helixLogo} alt="HELIX" className="h-28 w-28 max-w-none scale-[1.5] object-contain" />
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
