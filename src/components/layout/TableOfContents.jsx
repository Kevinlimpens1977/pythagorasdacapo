import { useNavigate } from 'react-router-dom';
import { Lock, PlayCircle, CheckCircle2, BookOpen } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import * as cmsService from '../../services/cmsService';
import { useState, useEffect } from 'react';

export default function TableOfContents() {
  const navigate = useNavigate();
  const { klasData } = useAuth();
  const [paragrafen, setParagrafen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoofdstukkenMap, setHoofdstukkenMap] = useState({});

  // Load paragraphs and their details when klasData changes
  useEffect(() => {
    const loadParagrafen = async () => {
      setLoading(true);

      try {
        // Get list of enabled paragraph IDs for this class
        const enabledParagraafIds = klasData?.enabledParagrafen || [];

        if (!enabledParagraafIds || enabledParagraafIds.length === 0) {
          setParagrafen([]);
          setHoofdstukkenMap({});
          setLoading(false);
          return;
        }

        // Load all paragraph details in parallel
        const paragraafDetailsPromises = enabledParagraafIds.map(id =>
          cmsService.getParagraaf(id).catch(() => null)
        );
        const paragraafDetails = await Promise.all(paragraafDetailsPromises);

        // Filter out null results and load their questions
        const validParagrafen = paragraafDetails.filter(p => p !== null);

        // Load questions for each paragraph
        const paragraafWithQuestions = await Promise.all(
          validParagrafen.map(async (paragraaf) => {
            const vragen = await cmsService.getVragen(paragraaf.id).catch(() => []);
            return {
              ...paragraaf,
              vragen: vragen || [],
              vragenCount: (vragen || []).length
            };
          })
        );

        // Load hoofdstuk details for grouping
        const hoofdstukIds = [...new Set(paragraafWithQuestions.map(p => p.hoofdstukId))];
        const hoofdstukDetailsPromises = hoofdstukIds.map(id =>
          cmsService.getHoofdstuk(id).catch(() => null)
        );
        const hoofdstukkendataArray = await Promise.all(hoofdstukDetailsPromises);

        const hmapTemp = {};
        hoofdstukkendataArray.forEach(h => {
          if (h) {
            hmapTemp[h.id] = h;
          }
        });

        setParagrafen(paragraafWithQuestions);
        setHoofdstukkenMap(hmapTemp);
        setLoading(false);
      } catch (error) {
        console.error('Error loading paragraphs:', error);
        setParagrafen([]);
        setLoading(false);
      }
    };

    loadParagrafen();
  }, [klasData]);

  // Group paragraphs by hoofdstuk
  const paragraafsByHoofdstuk = {};
  paragrafen.forEach(paragraaf => {
    const hid = paragraaf.hoofdstukId;
    if (!paragraafsByHoofdstuk[hid]) {
      paragraafsByHoofdstuk[hid] = [];
    }
    paragraafsByHoofdstuk[hid].push(paragraaf);
  });

  // Sort hoofdstukken by order
  const sortedHoofdstukIds = Object.keys(paragraafsByHoofdstuk).sort((a, b) => {
    const aOrder = hoofdstukkenMap[a]?.order || 999;
    const bOrder = hoofdstukkenMap[b]?.order || 999;
    return aOrder - bOrder;
  });

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto pad-content">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-800 text-white p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📐</span>
              <h1 className="text-2xl sm:text-3xl font-bold">Stelling van Pythagoras</h1>
            </div>
            <p className="text-slate-300 ml-11 text-lg">Hoofdstuk 7</p>
          </div>
          <div className="p-6 md:p-8">
            <div className="text-center text-slate-500">
              <p>Taken laden...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state when no paragraphs are enabled for this class
  if (paragrafen.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto pad-content">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-800 text-white p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📐</span>
              <h1 className="text-2xl sm:text-3xl font-bold">Stelling van Pythagoras</h1>
            </div>
            <p className="text-slate-300 ml-11 text-lg">Hoofdstuk 7</p>
          </div>
          <div className="p-6 md:p-8">
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600 text-lg font-medium">
                Nog geen taken klaarstaan voor jouw klas
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Neem contact op met je docent om taken toe te voegen
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto pad-content">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-800 text-white p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📐</span>
            <h1 className="text-2xl sm:text-3xl font-bold">Stelling van Pythagoras</h1>
          </div>
          <p className="text-slate-300 ml-11 text-lg">Hoofdstuk 7</p>
        </div>

        <div className="p-6 md:p-8">
          <div className="space-y-8">
            {sortedHoofdstukIds.map((hoofdstukId) => {
              const hoofdstuk = hoofdstukkenMap[hoofdstukId];
              const paragraafenInHoofdstuk = paragraafsByHoofdstuk[hoofdstukId];

              return (
                <div key={hoofdstukId}>
                  <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">
                    {hoofdstuk?.number && `${hoofdstuk.number}. `}{hoofdstuk?.title || 'Untitled Chapter'}
                  </h2>

                  <div className="space-y-4">
                    {paragraafenInHoofdstuk.map((paragraaf) => {
                      // Calculate progress based on question completion
                      // For now, show 0% since voortgangService doesn't exist yet
                      const completedQuestions = 0;
                      const totalQuestions = paragraaf.vragenCount || 0;
                      const progressPercent =
                        totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;
                      const isCompleted = totalQuestions > 0 && completedQuestions === totalQuestions;
                      const status = isCompleted ? 'completed' : 'available';

                      return (
                        <div
                          key={paragraaf.id}
                          onClick={() => navigate(`/chapter/${paragraaf.id}`)}
                          className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                            status === 'completed'
                              ? 'hover:bg-blue-50 cursor-pointer active:scale-[0.99] group border border-transparent hover:border-blue-100'
                              : 'hover:bg-blue-50 cursor-pointer active:scale-[0.99] group border border-transparent hover:border-blue-100'
                          }`}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                status === 'completed'
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors'
                              }`}
                            >
                              {status === 'completed' ? (
                                <CheckCircle2 size={20} />
                              ) : (
                                <PlayCircle size={20} />
                              )}
                            </div>
                            <div className="flex flex-col flex-1">
                              <h3 className="font-semibold text-lg text-slate-800">
                                {paragraaf.number && `${paragraaf.number}. `}{paragraaf.title}
                              </h3>
                              {totalQuestions > 0 && (
                                <span className="text-xs text-slate-500">
                                  {totalQuestions} vraag{totalQuestions !== 1 ? 'en' : ''}
                                </span>
                              )}
                            </div>
                          </div>

                          {totalQuestions > 0 && (
                            <div className="flex items-center gap-4">
                              <div className="flex flex-col items-end">
                                <div className="text-xs font-medium text-slate-500 mb-1">
                                  {completedQuestions} / {totalQuestions}
                                </div>
                                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                                    }`}
                                    style={{ width: `${progressPercent}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 px-4 pb-2">
            <h3 className="font-semibold text-slate-800 mb-4 text-lg">Toetsing</h3>
            <div className="space-y-2">
              <div className="flex items-center p-4 rounded-xl opacity-60 bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mr-4">
                  <Lock size={18} />
                </div>
                <h3 className="font-semibold text-lg text-slate-600">📝 Oefentoets</h3>
              </div>
              <div className="flex items-center p-4 rounded-xl opacity-60 bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mr-4">
                  <Lock size={18} />
                </div>
                <h3 className="font-semibold text-lg text-slate-600">📝 Eindtoets</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
