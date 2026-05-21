/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckSquare, AlertCircle } from 'lucide-react';
import klasService from '../services/klasService';
import cmsService from '../services/cmsService';
import { getColorStyle } from '../lib/paletColors';
import { CONTENT_BLOCK_LABELS, buildContentBlockPreview, normalizeContentBlocks } from '../lib/contentBlockUtils';

const flowSteps = [
  {
    number: '1',
    title: 'Kies klas',
    description: 'Bepaal voor welke klas je lesmateriaal klaarzet.'
  },
  {
    number: '2',
    title: 'Kies lesmateriaal',
    description: 'Navigeer naar vak, hoofdstuk, paragraaf en lesblokken.'
  },
  {
    number: '3',
    title: 'Zet klaar',
    description: 'Kies klasbreed of extra materiaal voor een leerling.'
  },
  {
    number: '4',
    title: 'Volg voortgang',
    description: 'Bekijk daarna in Voortgang wat gestart en afgerond is.'
  }
];

const FlowSteps = ({ currentStep }) => (
  <div className="grid gap-3 md:grid-cols-4">
    {flowSteps.map((step, index) => {
      const stepNumber = index + 1;
      const isActive = stepNumber === currentStep;
      const isDone = stepNumber < currentStep;

      return (
        <div
          key={step.number}
          className={`rounded-lg border p-4 ${
            isActive
              ? 'border-blue-300 bg-blue-50'
              : isDone
                ? 'border-emerald-200 bg-emerald-50'
                : 'border-slate-200 bg-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : isDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600'
              }`}
            >
              {step.number}
            </div>
            <h2 className="font-black text-slate-900">{step.title}</h2>
          </div>
          <p className="mt-2 text-sm leading-5 text-slate-500">{step.description}</p>
        </div>
      );
    })}
  </div>
);

export default function TakenToewijzenPage() {
  const navigate = useNavigate();

  // Klas selection
  const [klassen, setKlassen] = useState([]);
  const [selectedKlasId, setSelectedKlasId] = useState(null);
  const [selectedKlas, setSelectedKlas] = useState(null);
  const [klasStudents, setKlasStudents] = useState([]);

  // CMS hierarchy
  const [vakken, setVakken] = useState([]);
  const [leerjaren, setLeerjaren] = useState([]);
  const [niveaus, setNiveaus] = useState([]);
  const [hoofdstukken, setHoofdstukken] = useState([]);
  const [paragrafen, setParagrafen] = useState([]);

  // Navigation state
  const [selectedVakId, setSelectedVakId] = useState(null);
  const [selectedLeerjaarId, setSelectedLeerjaarId] = useState(null);
  const [selectedNiveauId, setSelectedNiveauId] = useState(null);
  const [selectedHoofdstukId, setSelectedHoofdstukId] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  // UI state
  const [assignedParagrafen, setAssignedParagrafen] = useState([]);
  const [assignedContentBlocks, setAssignedContentBlocks] = useState({});
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [studentOverrides, setStudentOverrides] = useState({});
  const [studentContentBlockOverrides, setStudentContentBlockOverrides] = useState({});
  const [contentBlocksByParagraaf, setContentBlocksByParagraaf] = useState({});
  const [activeTab, setActiveTab] = useState('klas'); // 'klas' or 'leerlingen'
  const [, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load vakken on mount (CMS data, no auth needed)
  useEffect(() => {
    const loadVakken = async () => {
      try {
        const v = await cmsService.getVakken();
        setVakken(v);
      } catch (error) {
        console.error('Error loading vakken:', error);
      }
    };
    loadVakken();
  }, []);

  // Load all klassen on mount
  useEffect(() => {
    const loadKlassen = async () => {
      try {
        setLoading(true);
        const allKlassen = await klasService.getAvailableKlassen();
        setKlassen(allKlassen);
      } catch (error) {
        console.error('Error loading klassen:', error);
      } finally {
        setLoading(false);
      }
    };
    loadKlassen();
  }, []);

  // When klas is selected, load its data and students
  useEffect(() => {
    if (!selectedKlasId) return;

    const loadKlasData = async () => {
      try {
        const klas = await klasService.getKlas(selectedKlasId);
        setSelectedKlas(klas);
        setAssignedParagrafen(klas?.enabledParagrafen || []);
        setAssignedContentBlocks(klas?.enabledContentBlocks || {});

        // Load student overrides
        setStudentOverrides(klas?.studentOverrides
          ? Object.fromEntries(Object.entries(klas.studentOverrides).map(([uid, v]) => [uid, v.extraParagrafen || []]))
          : {}
        );
        setStudentContentBlockOverrides(klas?.studentOverrides
          ? Object.fromEntries(Object.entries(klas.studentOverrides).map(([uid, v]) => [uid, v.extraContentBlocks || {}]))
          : {}
        );

        const students = await klasService.getKlasStudents(selectedKlasId);
        setKlasStudents(students);
      } catch (error) {
        console.error('Error loading klas data:', error);
      }
    };

    loadKlasData();
  }, [selectedKlasId]);

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
        const lj = await cmsService.getLeerjaren(selectedVakId);
        setLeerjaren(lj);
        setBreadcrumbs([{ label: vakken.find(v => v.id === selectedVakId)?.naam || 'Vak', id: selectedVakId, type: 'vak' }]);
      } catch (error) {
        console.error('Error loading leerjaren:', error);
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
        const n = await cmsService.getNiveaus(selectedLeerjaarId);
        setNiveaus(n);
        const ljData = leerjaren.find(l => l.id === selectedLeerjaarId);
        setBreadcrumbs(prev => [...prev, { label: ljData?.name || 'Leerjaar', id: selectedLeerjaarId, type: 'leerjaar' }]);
      } catch (error) {
        console.error('Error loading niveaus:', error);
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
        const h = await cmsService.getHoofdstukken(selectedNiveauId);
        setHoofdstukken(h);
        const nData = niveaus.find(n => n.id === selectedNiveauId);
        setBreadcrumbs(prev => [...prev, { label: nData ? `${nData.label} - ${nData.name}` : 'Niveau', id: selectedNiveauId, type: 'niveau' }]);
      } catch (error) {
        console.error('Error loading hoofdstukken:', error);
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
        const p = await cmsService.getParagrafen(selectedHoofdstukId);
        setParagrafen(p);
        const hData = hoofdstukken.find(h => h.id === selectedHoofdstukId);
        setBreadcrumbs(prev => [...prev, { label: hData ? `${hData.number}. ${hData.title}` : 'Hoofdstuk', id: selectedHoofdstukId, type: 'hoofdstuk' }]);
      } catch (error) {
        console.error('Error loading paragrafen:', error);
      }
    };

    loadParagrafen();
  }, [selectedHoofdstukId, hoofdstukken]);

  useEffect(() => {
    let cancelled = false;

    const loadContentBlocks = async () => {
      if (paragrafen.length === 0) {
        if (!cancelled) setContentBlocksByParagraaf({});
        return;
      }

      try {
        const entries = await Promise.all(
          paragrafen.map(async (paragraaf) => {
            const blocks = await cmsService.getContentBlocks(paragraaf.id, false).catch(() => []);
            return [paragraaf.id, normalizeContentBlocks(blocks)];
          })
        );
        if (!cancelled) setContentBlocksByParagraaf(Object.fromEntries(entries));
      } catch (error) {
        console.error('Error loading content blocks:', error);
        if (!cancelled) setContentBlocksByParagraaf({});
      }
    };

    loadContentBlocks();

    return () => {
      cancelled = true;
    };
  }, [paragrafen]);

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

  const toggleParagraafAssignment = async (paragraafId) => {
    if (!selectedKlasId || !selectedKlas) return;

    try {
      setSaving(true);
      const newAssignments = assignedParagrafen.includes(paragraafId)
        ? assignedParagrafen.filter(id => id !== paragraafId)
        : [...assignedParagrafen, paragraafId];

      setAssignedParagrafen(newAssignments);
      await klasService.updateKlasEnabledParagrafen(selectedKlasId, newAssignments);
    } catch (error) {
      console.error('Error updating assignments:', error);
      setAssignedParagrafen(selectedKlas.enabledParagrafen || []);
    } finally {
      setSaving(false);
    }
  };

  const toggleHoofdstukAssignment = async () => {
    if (!selectedKlasId || paragrafen.length === 0) return;

    try {
      setSaving(true);
      const chapterParagraafIds = paragrafen.map((p) => p.id);
      const allAssigned = chapterParagraafIds.every((id) => assignedParagrafen.includes(id));
      const newAssignments = allAssigned
        ? assignedParagrafen.filter((id) => !chapterParagraafIds.includes(id))
        : [...new Set([...assignedParagrafen, ...chapterParagraafIds])];

      setAssignedParagrafen(newAssignments);
      await klasService.updateKlasEnabledParagrafen(selectedKlasId, newAssignments);
    } catch (error) {
      console.error('Error updating chapter assignments:', error);
      setAssignedParagrafen(selectedKlas?.enabledParagrafen || []);
    } finally {
      setSaving(false);
    }
  };

  const toggleContentBlockAssignment = async (paragraafId, blockId) => {
    if (!selectedKlasId || !paragraafId || !blockId) return;

    try {
      setSaving(true);
      const blocks = contentBlocksByParagraaf[paragraafId] || [];

      if (selectedStudentId) {
        const studentBlocksByParagraaf = studentContentBlockOverrides[selectedStudentId] || {};
        const current = studentBlocksByParagraaf[paragraafId] || [];
        const next = current.includes(blockId)
          ? current.filter((id) => id !== blockId)
          : [...current, blockId];
        const nextStudentOverrides = {
          ...studentBlocksByParagraaf,
          [paragraafId]: next
        };

        setStudentContentBlockOverrides((prev) => ({
          ...prev,
          [selectedStudentId]: nextStudentOverrides
        }));
        await klasService.setStudentContentBlockOverride(selectedKlasId, selectedStudentId, paragraafId, next);
        return;
      }

      const hasExplicitSelection = Array.isArray(assignedContentBlocks[paragraafId]);
      const current = hasExplicitSelection
        ? assignedContentBlocks[paragraafId]
        : blocks.map((block) => block.id);
      const next = current.includes(blockId)
        ? current.filter((id) => id !== blockId)
        : [...current, blockId];

      setAssignedContentBlocks((prev) => ({ ...prev, [paragraafId]: next }));
      await klasService.updateKlasEnabledContentBlocks(selectedKlasId, paragraafId, next);
    } catch (error) {
      console.error('Error updating content block assignment:', error);
      setAssignedContentBlocks(selectedKlas?.enabledContentBlocks || {});
    } finally {
      setSaving(false);
    }
  };

  const clearContentBlockSelection = async (paragraafId) => {
    if (!selectedKlasId || !paragraafId) return;

    try {
      setSaving(true);
      setAssignedContentBlocks((prev) => {
        const next = { ...prev };
        delete next[paragraafId];
        return next;
      });
      await klasService.clearKlasEnabledContentBlocks(selectedKlasId, paragraafId);
    } catch (error) {
      console.error('Error clearing content block selection:', error);
    } finally {
      setSaving(false);
    }
  };

  const removeAssignment = async (paragraafId) => {
    if (!selectedKlasId) return;
    await toggleParagraafAssignment(paragraafId);
  };

  const toggleStudentOverride = async (paragraafId) => {
    if (!selectedKlasId || !selectedStudentId) return;

    try {
      setSaving(true);
      const current = studentOverrides[selectedStudentId] || [];
      const newExtras = current.includes(paragraafId)
        ? current.filter(id => id !== paragraafId)
        : [...current, paragraafId];

      setStudentOverrides(prev => ({ ...prev, [selectedStudentId]: newExtras }));
      await klasService.setStudentOverride(selectedKlasId, selectedStudentId, newExtras);
    } catch (error) {
      console.error('Error updating student override:', error);
    } finally {
      setSaving(false);
    }
  };

  const getAssignedBlockCount = () => Object.values(assignedContentBlocks)
    .reduce((total, ids) => total + (Array.isArray(ids) ? ids.length : 0), 0);

  const currentFlowStep = selectedHoofdstukId
    ? 3
    : selectedKlasId
      ? 2
      : 1;

  // Check if no klas is selected
  if (!selectedKlasId) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-blue-600">Lesstof</p>
              <h1 className="mt-2 text-4xl font-black text-slate-900">Lesmateriaal klaarzetten</h1>
              <p className="text-slate-600 mt-2">
                Koppel gemaakte hoofdstukken, paragrafen of lesblokken aan een klas of individuele leerling.
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/lesstof')}
              className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Terug naar Lesstof
            </button>
          </div>

          <div className="mb-6">
            <FlowSteps currentStep={currentFlowStep} />
          </div>

          {/* Klas Selector */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <div className="mb-5">
              <h2 className="text-xl font-black text-slate-900">Start met een klas</h2>
              <p className="mt-1 text-sm text-slate-500">
                Daarna kies je welk lesmateriaal je klaarzet.
              </p>
            </div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Klas selecteren</label>
            <select
              value={selectedKlasId || ''}
              onChange={(e) => setSelectedKlasId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Kies een klas...</option>
              {klassen.map(klas => (
                <option key={klas.klasId} value={klas.klasId}>
                  {klas.name} ({klas.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/lesstof')}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Lesmateriaal klaarzetten</h1>
              <p className="text-slate-600 text-sm">
                {selectedKlas?.name} ({selectedKlas?.code})
              </p>
            </div>
          </div>

          {/* Klas Selector */}
          <select
            value={selectedKlasId}
            onChange={(e) => setSelectedKlasId(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          >
            {klassen.map(klas => (
              <option key={klas.klasId} value={klas.klasId}>
                {klas.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-6">
          <FlowSteps currentStep={currentFlowStep} />
        </div>

        <div className="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-blue-600">Klaarzetstudio</p>
              <h2 className="mt-1 text-xl font-black text-slate-900">Kies links het lesmateriaal, zet rechts de bestemming klaar</h2>
              <p className="mt-1 text-sm text-slate-500">
                Je kunt een heel hoofdstuk klaarzetten, losse paragrafen kiezen of binnen een paragraaf specifieke lesblokken selecteren.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Bekijk voortgang
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Left panel: Content Browser */}
          <div className="col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col overflow-hidden">
            {/* Breadcrumb */}
            {breadcrumbs.length > 0 && (
              <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
                <button
                  onClick={() => {
                    setSelectedVakId(null);
                    setSelectedLeerjaarId(null);
                    setSelectedNiveauId(null);
                    setSelectedHoofdstukId(null);
                  }}
                  className="text-sm text-slate-600 hover:text-slate-900 font-medium whitespace-nowrap"
                >
                  Home
                </button>
                {breadcrumbs.map((crumb, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <ChevronRight size={16} className="text-slate-400" />
                    <button
                      onClick={() => handleBreadcrumbClick(i)}
                      className="text-sm text-slate-600 hover:text-slate-900 font-medium whitespace-nowrap"
                    >
                      {crumb.label}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Student override mode banner */}
            {selectedStudentId && (
              <div className="px-6 py-3 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
                <span className="text-sm font-medium text-amber-800">
                  Extra lesmateriaal voor: {klasStudents.find(s => s.uid === selectedStudentId)?.displayName}
                </span>
                <button
                  onClick={() => setSelectedStudentId(null)}
                  className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                >
                  Terug naar klas
                </button>
              </div>
            )}

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {/* Vakken */}
              {!selectedVakId && (
                <>
                  {vakken.length === 0 ? (
                    <div className="text-center text-slate-500 py-12">
                      <AlertCircle size={48} className="mx-auto mb-3 opacity-50" />
                      <p>Geen vakken beschikbaar</p>
                    </div>
                  ) : (
                    vakken.map(vak => {
                      const style = getColorStyle(vak.color);
                      return (
                        <div
                          key={vak.id}
                          onClick={() => setSelectedVakId(vak.id)}
                          className="p-4 border rounded-lg hover:opacity-80 cursor-pointer transition-colors flex items-center gap-3"
                          style={{ backgroundColor: style.bg, borderColor: style.border, color: style.text }}
                        >
                          <span className="text-lg flex-shrink-0">{vak.emoji || '📚'}</span>
                          <span className="font-medium">{vak.naam}</span>
                          <ChevronRight size={16} className="ml-auto flex-shrink-0" style={{ opacity: 0.6 }} />
                        </div>
                      );
                    })
                  )}
                </>
              )}

              {/* Leerjaren */}
              {selectedVakId && !selectedLeerjaarId && (
                <>
                  {leerjaren.length === 0 ? (
                    <div className="text-center text-slate-500 py-12">
                      <p>Geen leerjaren beschikbaar</p>
                    </div>
                  ) : (
                    leerjaren.map(lj => {
                      const style = getColorStyle(lj.color);
                      return (
                        <div
                          key={lj.id}
                          onClick={() => setSelectedLeerjaarId(lj.id)}
                          className="p-4 border rounded-lg hover:opacity-80 cursor-pointer transition-colors flex items-center gap-3"
                          style={{ backgroundColor: style.bg, borderColor: style.border, color: style.text }}
                        >
                          <span className="text-lg flex-shrink-0">{lj.emoji || '📅'}</span>
                          <span className="font-medium">{lj.name}</span>
                          <ChevronRight size={16} className="ml-auto flex-shrink-0" style={{ opacity: 0.6 }} />
                        </div>
                      );
                    })
                  )}
                </>
              )}

              {/* Niveaus */}
              {selectedLeerjaarId && !selectedNiveauId && (
                <>
                  {niveaus.length === 0 ? (
                    <div className="text-center text-slate-500 py-12">
                      <p>Geen niveaus beschikbaar</p>
                    </div>
                  ) : (
                    niveaus.map(niveau => {
                      const style = getColorStyle(niveau.color);
                      return (
                        <div
                          key={niveau.id}
                          onClick={() => setSelectedNiveauId(niveau.id)}
                          className="p-4 border rounded-lg hover:opacity-80 cursor-pointer transition-colors flex items-center gap-3"
                          style={{ backgroundColor: style.bg, borderColor: style.border, color: style.text }}
                        >
                          <span className="text-lg flex-shrink-0">{niveau.emoji || '📊'}</span>
                          <div className="flex-1">
                            <div className="font-medium">{niveau.label}</div>
                            <div className="text-xs" style={{ opacity: 0.7 }}>{niveau.name}</div>
                          </div>
                          <ChevronRight size={16} className="flex-shrink-0" style={{ opacity: 0.6 }} />
                        </div>
                      );
                    })
                  )}
                </>
              )}

              {/* Hoofdstukken */}
              {selectedNiveauId && !selectedHoofdstukId && (
                <>
                  {hoofdstukken.length === 0 ? (
                    <div className="text-center text-slate-500 py-12">
                      <p>Geen hoofdstukken beschikbaar</p>
                    </div>
                  ) : (
                    hoofdstukken.map(h => {
                      const style = getColorStyle(h.color);
                      return (
                        <div
                          key={h.id}
                          onClick={() => setSelectedHoofdstukId(h.id)}
                          className="p-4 border rounded-lg hover:opacity-80 cursor-pointer transition-colors flex items-center gap-3"
                          style={{ backgroundColor: style.bg, borderColor: style.border, color: style.text }}
                        >
                          <span className="text-lg flex-shrink-0">{h.emoji || '📖'}</span>
                          <span className="font-medium">{h.number}. {h.title}</span>
                          <ChevronRight size={16} className="ml-auto flex-shrink-0" style={{ opacity: 0.6 }} />
                        </div>
                      );
                    })
                  )}
                </>
              )}

              {/* Paragrafen */}
              {selectedHoofdstukId && (
                <>
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-sm font-black text-slate-900">Hoofdstuk klaarzetten</h3>
                        <p className="text-xs text-slate-600">
                          Zet alle paragrafen uit dit hoofdstuk in een keer klaar.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={toggleHoofdstukAssignment}
                        disabled={saving || selectedStudentId || paragrafen.length === 0}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        title={selectedStudentId ? 'Bulkactie is alleen voor de klas. Kies losse extra paragrafen voor een leerling.' : ''}
                      >
                        Hoofdstuk aan/uit
                      </button>
                    </div>
                  </div>

                  {paragrafen.length === 0 ? (
                    <div className="text-center text-slate-500 py-12">
                      <p>Geen paragrafen beschikbaar</p>
                    </div>
                  ) : (
                    paragrafen.map(para => {
                      const isInClassDefault = assignedParagrafen.includes(para.id);
                      const studentExtras = studentOverrides[selectedStudentId] || [];
                      const isInStudentOverride = studentExtras.includes(para.id);
                      const isChecked = selectedStudentId ? (isInClassDefault || isInStudentOverride) : isInClassDefault;
                      const isDisabled = selectedStudentId && isInClassDefault;

                      return (
                        <div
                          key={para.id}
                          className={`p-4 border border-slate-200 rounded-lg transition-colors group ${
                            isDisabled ? 'opacity-50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => selectedStudentId ? toggleStudentOverride(para.id) : toggleParagraafAssignment(para.id)}
                              disabled={saving || isDisabled}
                              className="mt-1 h-5 w-5 cursor-pointer rounded text-blue-600"
                              title={isDisabled ? "Al in klassestandaard" : ""}
                            />
                            <div className="flex-1">
                              <div className="font-medium text-slate-900">{para.code}. {para.title}</div>
                              {para.beschrijving && (
                                <div className="text-xs text-slate-500 line-clamp-1">{para.beschrijving}</div>
                              )}
                              <div className="mt-1 text-xs text-slate-500">
                                {(contentBlocksByParagraaf[para.id] || []).length} lesblokken
                                {Array.isArray(assignedContentBlocks[para.id]) && (
                                  <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 font-bold text-blue-700">
                                    {assignedContentBlocks[para.id].length} geselecteerd
                                  </span>
                                )}
                              </div>
                            </div>
                            {isChecked && (
                              <CheckSquare size={18} className="mt-1 flex-shrink-0 text-green-600" />
                            )}
                          </div>

                          {isChecked && (contentBlocksByParagraaf[para.id] || []).length > 0 && (
                            <div className="mt-4 border-t border-slate-100 pt-3">
                              <div className="mb-2 flex items-center justify-between gap-3">
                                <span className="text-xs font-black uppercase tracking-wide text-slate-500">
                                  Onderdelen van deze paragraaf
                                </span>
                                {!selectedStudentId && Array.isArray(assignedContentBlocks[para.id]) && (
                                  <button
                                    type="button"
                                    onClick={() => clearContentBlockSelection(para.id)}
                                    className="text-xs font-bold text-blue-600 hover:text-blue-800"
                                  >
                                    Alle blokken tonen
                                  </button>
                                )}
                              </div>
                              <div className="space-y-2">
                                {(contentBlocksByParagraaf[para.id] || []).map((block) => {
                                  const classSelection = assignedContentBlocks[para.id];
                                  const classHasExplicitSelection = Array.isArray(classSelection);
                                  const isClassBlockSelected = classHasExplicitSelection
                                    ? classSelection.includes(block.id)
                                    : true;
                                  const studentBlockExtras = studentContentBlockOverrides[selectedStudentId]?.[para.id] || [];
                                  const isStudentBlockSelected = studentBlockExtras.includes(block.id);
                                  const blockChecked = selectedStudentId ? isStudentBlockSelected : isClassBlockSelected;
                                  const blockDisabled = selectedStudentId && isClassBlockSelected;

                                  return (
                                    <label
                                      key={block.id}
                                      className={`flex items-start gap-3 rounded-lg border px-3 py-2 text-sm ${
                                        blockDisabled
                                          ? 'border-slate-100 bg-slate-50 opacity-60'
                                          : 'border-slate-200 bg-white hover:border-blue-200'
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={blockChecked}
                                        disabled={saving || blockDisabled}
                                        onChange={() => toggleContentBlockAssignment(para.id, block.id)}
                                        className="mt-1 h-4 w-4 cursor-pointer rounded text-blue-600"
                                      />
                                      <span className="flex-1">
                                        <span className="block font-bold text-slate-900">
                                          Stap {block.order || '-'} - {CONTENT_BLOCK_LABELS[block.type] || 'Lesblok'} - {block.title || 'Naamloos'}
                                        </span>
                                        <span className="line-clamp-1 text-xs text-slate-500">
                                          {buildContentBlockPreview(block)}
                                        </span>
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right panel: Assignment Overview */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-slate-200 flex">
              <button
                onClick={() => setActiveTab('klas')}
                className={`flex-1 px-4 py-3 font-medium transition-colors ${
                  activeTab === 'klas'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Klaargezet ({assignedParagrafen.length})
              </button>
              <button
                onClick={() => setActiveTab('leerlingen')}
                className={`flex-1 px-4 py-3 font-medium transition-colors ${
                  activeTab === 'leerlingen'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Per leerling ({klasStudents.length})
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'klas' && (
                <div className="space-y-2">
                  <div className="mb-4 grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="text-2xl font-black text-slate-900">{assignedParagrafen.length}</div>
                      <div className="text-xs font-bold uppercase text-slate-500">Paragrafen</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="text-2xl font-black text-slate-900">{getAssignedBlockCount()}</div>
                      <div className="text-xs font-bold uppercase text-slate-500">Gekozen blokken</div>
                    </div>
                  </div>
                  {assignedParagrafen.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-8">
                      Nog geen lesmateriaal klaargezet
                    </p>
                  ) : (
                    assignedParagrafen.map(paragraafId => {
                      // Find paragraaf name from all loaded paragrafen
                      const foundParagraaf = paragrafen.find(p => p.id === paragraafId);
                      const displayName = foundParagraaf
                        ? `${foundParagraaf.code}. ${foundParagraaf.title}`
                        : `Para ${paragraafId}`;

                      return (
                        <div
                          key={paragraafId}
                          className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between text-sm"
                        >
                          <span className="font-medium text-slate-900">{displayName}</span>
                          <button
                            onClick={() => removeAssignment(paragraafId)}
                            className="text-red-600 hover:text-red-700 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {activeTab === 'leerlingen' && (
                <div className="space-y-2">
                  {klasStudents.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-8">
                      Geen leerlingen in klas
                    </p>
                  ) : (
                    klasStudents.map(student => {
                      const extras = studentOverrides[student.uid] || [];
                      const isSelected = selectedStudentId === student.uid;

                      return (
                        <div
                          key={student.uid}
                          className={`border rounded-lg transition-colors ${
                            isSelected ? 'border-amber-300 bg-amber-50' : 'border-slate-200'
                          }`}
                        >
                          {/* Header row - clickable */}
                          <div
                            onClick={() => setSelectedStudentId(isSelected ? null : student.uid)}
                            className="p-3 flex items-center justify-between cursor-pointer hover:bg-amber-50"
                          >
                            <div>
                              <div className="font-medium text-slate-900">{student.displayName}</div>
                              <div className="text-xs text-slate-500">{student.email}</div>
                            </div>
                            {extras.length > 0 && (
                              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium whitespace-nowrap ml-2">
                                +{extras.length}
                              </span>
                            )}
                          </div>

                          {/* Expanded: list of overrides */}
                          {isSelected && (
                            <div className="border-t border-amber-200 px-3 pb-3 pt-2 space-y-1 bg-amber-25">
                              {extras.length === 0 ? (
                                <p className="text-xs text-slate-500 py-2">Geen extra lesmateriaal. Selecteer links een paragraaf of lesblok.</p>
                              ) : (
                                extras.map(paraId => {
                                  const para = paragrafen.find(p => p.id === paraId);
                                  return (
                                    <div key={paraId} className="flex items-center justify-between text-xs bg-white border border-slate-200 rounded px-2 py-1">
                                      <span className="font-medium text-slate-900">{para ? `${para.code}. ${para.title}` : paraId}</span>
                                      <button
                                        onClick={() => toggleStudentOverride(paraId)}
                                        className="text-red-500 hover:text-red-700 font-bold ml-2"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
