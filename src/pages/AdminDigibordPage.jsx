import { useState, useEffect } from 'react';
import { ChevronRight, BookOpen, BarChart3, Layers, FileText, AlertCircle } from 'lucide-react';
import cmsService from '../services/cmsService';
import DigibordViewer from '../components/digibord/DigibordViewer';
import { getColorStyle } from '../lib/paletColors';

export default function AdminDigibordPage() {
  // Selection state
  const [selectedVakId, setSelectedVakId] = useState(null);
  const [selectedLeerjaarId, setSelectedLeerjaarId] = useState(null);
  const [selectedNiveauId, setSelectedNiveauId] = useState(null);
  const [selectedHoofdstukId, setSelectedHoofdstukId] = useState(null);
  const [selectedParagraafId, setSelectedParagraafId] = useState(null);

  // Data state
  const [vakken, setVakken] = useState([]);
  const [leerjaren, setLeerjaren] = useState([]);
  const [niveaus, setNiveaus] = useState([]);
  const [hoofdstukken, setHoofdstukken] = useState([]);
  const [paragrafen, setParagrafen] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  // Load vakken on mount
  useEffect(() => {
    const loadVakken = async () => {
      try {
        setLoading(true);
        const v = await cmsService.getVakken();
        setVakken(v);
      } catch (error) {
        console.error('Error loading vakken:', error);
      } finally {
        setLoading(false);
      }
    };
    loadVakken();
  }, []);

  // Load leerjaren when vak is selected
  useEffect(() => {
    if (!selectedVakId) {
      setLeerjaren([]);
      setSelectedLeerjaarId(null);
      setBreadcrumbs([]);
      return;
    }

    const loadLeerjaren = async () => {
      try {
        setLoading(true);
        const lj = await cmsService.getLeerjaren(selectedVakId);
        setLeerjaren(lj);
        const vakLabel = vakken.find(v => v.id === selectedVakId)?.naam || 'Vak';
        setBreadcrumbs([{ label: vakLabel, id: selectedVakId, type: 'vak' }]);
      } catch (error) {
        console.error('Error loading leerjaren:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeerjaren();
  }, [selectedVakId, vakken]);

  // Load niveaus when leerjaar is selected
  useEffect(() => {
    if (!selectedLeerjaarId) {
      setNiveaus([]);
      setSelectedNiveauId(null);
      return;
    }

    const loadNiveaus = async () => {
      try {
        setLoading(true);
        const n = await cmsService.getNiveaus(selectedLeerjaarId);
        setNiveaus(n);
        const ljLabel = leerjaren.find(l => l.id === selectedLeerjaarId)?.name || 'Leerjaar';
        setBreadcrumbs(prev => [...prev, { label: ljLabel, id: selectedLeerjaarId, type: 'leerjaar' }]);
      } catch (error) {
        console.error('Error loading niveaus:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNiveaus();
  }, [selectedLeerjaarId, leerjaren]);

  // Load hoofdstukken when niveau is selected
  useEffect(() => {
    if (!selectedNiveauId) {
      setHoofdstukken([]);
      setSelectedHoofdstukId(null);
      return;
    }

    const loadHoofdstukken = async () => {
      try {
        setLoading(true);
        const h = await cmsService.getHoofdstukken(selectedNiveauId);
        setHoofdstukken(h);
        const nData = niveaus.find(n => n.id === selectedNiveauId);
        const nLabel = nData ? `${nData.label} - ${nData.name}` : 'Niveau';
        setBreadcrumbs(prev => [...prev, { label: nLabel, id: selectedNiveauId, type: 'niveau' }]);
      } catch (error) {
        console.error('Error loading hoofdstukken:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHoofdstukken();
  }, [selectedNiveauId, niveaus]);

  // Load paragrafen when hoofdstuk is selected
  useEffect(() => {
    if (!selectedHoofdstukId) {
      setParagrafen([]);
      return;
    }

    const loadParagrafen = async () => {
      try {
        setLoading(true);
        const p = await cmsService.getParagrafen(selectedHoofdstukId);
        setParagrafen(p);
        const hData = hoofdstukken.find(h => h.id === selectedHoofdstukId);
        const hLabel = hData ? `${hData.number}. ${hData.title}` : 'Hoofdstuk';
        setBreadcrumbs(prev => [...prev, { label: hLabel, id: selectedHoofdstukId, type: 'hoofdstuk' }]);
      } catch (error) {
        console.error('Error loading paragrafen:', error);
      } finally {
        setLoading(false);
      }
    };

    loadParagrafen();
  }, [selectedHoofdstukId, hoofdstukken]);

  // Handle breadcrumb clicks to go back
  const handleBreadcrumbClick = (index) => {
    if (index === 0) {
      setSelectedVakId(null);
      setSelectedLeerjaarId(null);
      setSelectedNiveauId(null);
      setSelectedHoofdstukId(null);
    } else if (index === 1) {
      setSelectedLeerjaarId(null);
      setSelectedNiveauId(null);
      setSelectedHoofdstukId(null);
    } else if (index === 2) {
      setSelectedNiveauId(null);
      setSelectedHoofdstukId(null);
    } else if (index === 3) {
      setSelectedHoofdstukId(null);
    }
  };

  // If a paragraaf is selected, show the DigibordViewer
  if (selectedParagraafId) {
    return (
      <DigibordViewer
        chapterId={selectedParagraafId}
        onExit={() => setSelectedParagraafId(null)}
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-4xl font-black text-slate-900 mb-2">🎬 Digibord</h1>
          <p className="text-slate-600">Kies een lesfase om fullscreen te presenteren</p>

          {/* Breadcrumb Navigation */}
          {breadcrumbs.length > 0 && (
            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => {
                  setSelectedVakId(null);
                  setSelectedLeerjaarId(null);
                  setSelectedNiveauId(null);
                  setSelectedHoofdstukId(null);
                }}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap px-3 py-1 rounded hover:bg-slate-100 transition-colors"
              >
                Home
              </button>
              {breadcrumbs.map((crumb, i) => (
                <div key={i} className="flex items-center gap-2">
                  <ChevronRight size={16} className="text-slate-400 flex-shrink-0" />
                  <button
                    onClick={() => handleBreadcrumbClick(i)}
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap px-3 py-1 rounded hover:bg-slate-100 transition-colors"
                  >
                    {crumb.label}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block mb-4 p-2 bg-slate-200 rounded-full animate-pulse">
                <ChevronRight size={32} className="text-slate-600" />
              </div>
              <p className="text-slate-600">Content laden...</p>
            </div>
          </div>
        )}

        {!loading && !selectedVakId && (
          <>
            {vakken.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-lg p-12 border-2 border-slate-100 text-center">
                <AlertCircle size={48} className="mx-auto mb-3 text-slate-400" />
                <p className="text-slate-600 text-lg">Geen vakken beschikbaar in CMS</p>
                <p className="text-slate-500 text-sm mt-2">Voeg vakken toe via Admin → CMS Platform</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vakken.map(vak => {
                  const style = getColorStyle(vak.color);
                  return (
                    <button
                      key={vak.id}
                      onClick={() => setSelectedVakId(vak.id)}
                      className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left"
                      style={{ backgroundColor: style.bg }}
                    >
                      <div className="relative p-6 h-full flex flex-col justify-between min-h-[160px]">
                        <div>
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 text-2xl">
                            {vak.emoji || '📚'}
                          </div>
                          <h3 className="text-xl font-bold" style={{ color: style.text }}>
                            {vak.naam}
                          </h3>
                        </div>
                        <div className="text-xs font-medium" style={{ color: style.text, opacity: 0.6 }}>
                          SELECTEER →
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {!loading && selectedVakId && !selectedLeerjaarId && (
          <>
            {leerjaren.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-lg p-12 border-2 border-slate-100 text-center">
                <p className="text-slate-600 text-lg">Geen leerjaren beschikbaar</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {leerjaren.map(lj => {
                  const style = getColorStyle(lj.color);
                  return (
                    <button
                      key={lj.id}
                      onClick={() => setSelectedLeerjaarId(lj.id)}
                      className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left"
                      style={{ backgroundColor: style.bg }}
                    >
                      <div className="relative p-6 h-full flex flex-col justify-between min-h-[160px]">
                        <div>
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 text-2xl">
                            {lj.emoji || '📅'}
                          </div>
                          <h3 className="text-xl font-bold" style={{ color: style.text }}>
                            {lj.name}
                          </h3>
                        </div>
                        <div className="text-xs font-medium" style={{ color: style.text, opacity: 0.6 }}>
                          SELECTEER →
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {!loading && selectedLeerjaarId && !selectedNiveauId && (
          <>
            {niveaus.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-lg p-12 border-2 border-slate-100 text-center">
                <p className="text-slate-600 text-lg">Geen niveaus beschikbaar</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {niveaus.map(niveau => {
                  const style = getColorStyle(niveau.color);
                  return (
                    <button
                      key={niveau.id}
                      onClick={() => setSelectedNiveauId(niveau.id)}
                      className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left"
                      style={{ backgroundColor: style.bg }}
                    >
                      <div className="relative p-6 h-full flex flex-col justify-between min-h-[160px]">
                        <div>
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 text-2xl">
                            {niveau.emoji || '📊'}
                          </div>
                          <h3 className="text-xl font-bold" style={{ color: style.text }}>
                            {niveau.label}
                          </h3>
                          <p className="text-sm mt-1" style={{ color: style.text, opacity: 0.8 }}>
                            {niveau.name}
                          </p>
                        </div>
                        <div className="text-xs font-medium" style={{ color: style.text, opacity: 0.6 }}>
                          SELECTEER →
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {!loading && selectedNiveauId && !selectedHoofdstukId && (
          <>
            {hoofdstukken.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-lg p-12 border-2 border-slate-100 text-center">
                <p className="text-slate-600 text-lg">Geen hoofdstukken beschikbaar</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hoofdstukken.map(h => {
                  const style = getColorStyle(h.color);
                  return (
                    <button
                      key={h.id}
                      onClick={() => setSelectedHoofdstukId(h.id)}
                      className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left"
                      style={{ backgroundColor: style.bg }}
                    >
                      <div className="relative p-6 h-full flex flex-col justify-between min-h-[160px]">
                        <div>
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 text-2xl">
                            {h.emoji || '📖'}
                          </div>
                          <h3 className="text-xl font-bold" style={{ color: style.text }}>
                            {h.number}. {h.title}
                          </h3>
                        </div>
                        <div className="text-xs font-medium" style={{ color: style.text, opacity: 0.6 }}>
                          SELECTEER →
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {!loading && selectedHoofdstukId && (
          <>
            {paragrafen.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-lg p-12 border-2 border-slate-100 text-center">
                <p className="text-slate-600 text-lg">Geen paragrafen beschikbaar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {paragrafen.map(para => (
                  <button
                    key={para.id}
                    onClick={() => setSelectedParagraafId(para.id)}
                    className="w-full text-left p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl border-2 border-slate-100 hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-1 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                        <FileText size={24} className="text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900">
                          {para.code}. {para.title}
                        </h3>
                        {para.beschrijving && (
                          <p className="text-slate-600 text-sm mt-1 line-clamp-2">
                            {para.beschrijving}
                          </p>
                        )}
                      </div>
                      <div className="text-purple-600 font-bold group-hover:translate-x-1 transition-transform">
                        Presenteer →
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
