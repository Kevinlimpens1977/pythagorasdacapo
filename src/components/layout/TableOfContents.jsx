import { useNavigate } from 'react-router-dom';
import { Lock, PlayCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { CHAPTERS } from '../../data/chapters';

export default function TableOfContents() {
  const navigate = useNavigate();
  const { isAdmin, userData } = useAuth();

  const isChapterLocked = (chapter) => {
    if (isAdmin) return false;
    if (chapter.id === 'voorkennis') return false;
    if (!chapter.prerequisite) return false;

    const completed = userData?.completedChapters || [];
    if (completed.includes(chapter.prerequisite)) return false;

    // Robuuste fallback: Check of de leerling op de laatste slide van de vorige paragraaf is geweest
    const prereqChapter = CHAPTERS.find(c => c.id === chapter.prerequisite);
    if (userData?.lastChapter === chapter.prerequisite &&
        (userData?.lastSlide || 0) >= (prereqChapter?.totalSlides || 999)) {
      return false;
    }

    return true;
  };

  const getChapterStatus = (chapter) => {
    const completed = userData?.completedChapters || [];
    if (completed.includes(chapter.id)) return 'completed';

    // Check if they reached the last slide of THIS chapter too
    if (userData?.lastChapter === chapter.id &&
        (userData?.lastSlide || 0) >= chapter.totalSlides) {
      return 'completed';
    }

    if (isChapterLocked(chapter)) return 'locked';
    return 'available';
  };

  return (
    <div className="w-full max-w-6xl mx-auto pad-content">
      {/* Admin-only login instructions */}
      {isAdmin && (
        <div className="mb-8 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl shadow-md border-2 border-amber-200 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 flex items-center gap-3">
            <HelpCircle size={32} />
            <h2 className="text-2xl font-black">Leerlingen inloggen uitleg</h2>
          </div>

          <div className="p-8">
            <p className="text-lg text-slate-600 mb-8">
              Deel deze instructies met je leerlingen zodat zij correct kunnen inloggen:
            </p>

            <div className="space-y-6 bg-white rounded-xl p-8 border-2 border-amber-100">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center flex-shrink-0 font-black text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 mb-2">Account aanmaken</h3>
                  <p className="text-slate-600 text-lg">
                    Ga naar <strong className="text-blue-600 font-bold">pythagorasdacapo.vercel.app</strong>
                  </p>
                  <p className="text-slate-600 text-lg">
                    Klik op "Account aanmaken"
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center flex-shrink-0 font-black text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 mb-2">Vul je gegevens in</h3>
                  <div className="space-y-2 text-slate-600 text-lg">
                    <p>• <strong>Naam:</strong> Je volledige naam</p>
                    <p>• <strong>Schoolemail:</strong> .....@leerling.dacapo-college.nl</p>
                    <p>• <strong>Wachtwoord:</strong> Een sterk, veilig wachtwoord</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center flex-shrink-0 font-black text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 mb-2">Inloggen</h3>
                  <p className="text-slate-600 text-lg">
                    Log in met je emailadres en wachtwoord
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center flex-shrink-0 font-black text-lg">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 mb-2">Begin met de opgaven</h3>
                  <p className="text-slate-600 text-lg mb-3">
                    Volg deze volgorde:
                  </p>
                  <div className="space-y-2 text-slate-600 text-lg font-medium">
                    <p>✓ <strong>Voorkennis</strong> - maak alles</p>
                    <p>✓ <strong>Paragraaf 7.1</strong> - maak alles</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-slate-700 font-medium">
                💡 <strong>Tip:</strong> Je kunt de voortgang van leerlingen volgen via het "Klas Dashboard"
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        <div className="bg-slate-800 text-white p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📐</span>
            <h1 className="text-2xl sm:text-3xl font-bold">Stelling van Pythagoras</h1>
          </div>
          <p className="text-slate-300 ml-11 text-lg">Hoofdstuk 7</p>
        </div>

        <div className="p-6 md:p-8">
          <div className="space-y-4 md:space-y-6">
            {CHAPTERS.map((chapter) => {
              const status = getChapterStatus(chapter);
              const locked = status === 'locked';
              
              return (
                <div 
                  key={chapter.id}
                  onClick={() => !locked && navigate(`/chapter/${chapter.id}`)}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                    locked 
                      ? 'opacity-60 cursor-not-allowed bg-slate-50' 
                      : 'hover:bg-blue-50 cursor-pointer active:scale-[0.99] group border border-transparent hover:border-blue-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      locked
                        ? 'bg-slate-200 text-slate-500'
                        : status === 'completed'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors'
                    }`}>
                      {locked ? (
                        <Lock size={18} />
                      ) : status === 'completed' ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <PlayCircle size={20} />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <h3 className={`font-semibold text-lg ${locked ? 'text-slate-500' : 'text-slate-800'}`}>
                        {chapter.title}
                      </h3>
                      {locked && (
                        <span className="text-xs text-amber-600 font-medium italic">Eerst '{CHAPTERS.find(c => c.id === chapter.prerequisite)?.title}' afronden</span>
                      )}
                    </div>
                  </div>
                  {/* Evaluation score badge if available */}
                  {!locked && (() => {
                    const evalData = userData?.evaluationData?.[chapter.id];
                    if (!evalData) return null;
                    const results = Object.values(evalData);
                    if (results.length === 0) return null;
                    const correct = results.filter(r => r.isCorrect).length;
                    const total = results.length;
                    return (
                      <div className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold whitespace-nowrap">
                        📋 {correct}/{total}
                      </div>
                    );
                  })()}

                  <div className="flex items-center gap-4">
                    {!locked && (
                      <div className="flex flex-col items-end">
                        <div className="text-xs font-medium text-slate-500 mb-1">
                          {status === 'completed' ? chapter.totalSlides : (userData?.lastChapter === chapter.id ? userData?.lastSlide || 0 : 0)} / {chapter.totalSlides}
                        </div>
                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${(status === 'completed' ? 1 : (userData?.lastChapter === chapter.id ? (userData?.lastSlide || 0) / chapter.totalSlides : 0)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
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
