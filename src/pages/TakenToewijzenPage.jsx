import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, BookOpen, BarChart3, Layers, FileText, CheckSquare, AlertCircle } from 'lucide-react';
import klasService from '../services/klasService';
import cmsService from '../services/cmsService';
import { getColorStyle } from '../lib/paletColors';

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
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [studentOverrides, setStudentOverrides] = useState({});
  const [activeTab, setActiveTab] = useState('klas'); // 'klas' or 'leerlingen'
  const [loading, setLoading] = useState(true);
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

        // Load student overrides
        setStudentOverrides(klas?.studentOverrides
          ? Object.fromEntries(Object.entries(klas.studentOverrides).map(([uid, v]) => [uid, v.extraParagrafen || []]))
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
        setBreadcrumbs(prev => [...prev, { label: `${nData?.label} - ${nData?.name}` || 'Niveau', id: selectedNiveauId, type: 'niveau' }]);
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
        setBreadcrumbs(prev => [...prev, { label: `${hData?.number}. ${hData?.title}` || 'Hoofdstuk', id: selectedHoofdstukId, type: 'hoofdstuk' }]);
      } catch (error) {
        console.error('Error loading paragrafen:', error);
      }
    };

    loadParagrafen();
  }, [selectedHoofdstukId, hoofdstukken]);

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

  const removeAssignment = async (paragraafId) => {
    if (!selectedKlasId) return;
    const newAssignments = assignedParagrafen.filter(id => id !== paragraafId);
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

  // Check if no klas is selected
  if (!selectedKlasId) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-slate-900">Taken Toewijzen</h1>
              <p className="text-slate-600 mt-2">Wijs content toe aan klassen en leerlingen</p>
            </div>
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              ← Terug
            </button>
          </div>

          {/* Klas Selector */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Selecteer een klas
            </label>
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
              onClick={() => navigate('/admin')}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Taken Toewijzen</h1>
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
                  Extra content voor: {klasStudents.find(s => s.uid === selectedStudentId)?.displayName}
                </span>
                <button
                  onClick={() => setSelectedStudentId(null)}
                  className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                >
                  × Terug naar klas
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
                  {paragrafen.length === 0 ? (
                    <div className="text-center text-slate-500 py-12">
                      <p>Geen paragrafen beschikbaar</p>
                    </div>
                  ) : (
                    paragrafen.map(para => {
                      const isInClassDefault = assignedParagrafen.includes(para.id);
                      const studentExtras = studentOverrides[selectedStudentId] || [];
                      const isInStudentOverride = studentExtras.includes(para.id);
                      const isChecked = selectedStudentId ? isInStudentOverride : isInClassDefault;
                      const isDisabled = selectedStudentId && isInClassDefault;

                      return (
                        <div
                          key={para.id}
                          className={`p-4 border border-slate-200 rounded-lg transition-colors flex items-center gap-3 group ${
                            isDisabled ? 'opacity-50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => selectedStudentId ? toggleStudentOverride(para.id) : toggleParagraafAssignment(para.id)}
                            disabled={saving || isDisabled}
                            className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                            title={isDisabled ? "Al in klassestadaard" : ""}
                          />
                          <div className="flex-1">
                            <div className="font-medium text-slate-900">{para.code}. {para.title}</div>
                            {para.beschrijving && (
                              <div className="text-xs text-slate-500 line-clamp-1">{para.beschrijving}</div>
                            )}
                          </div>
                          {isChecked && (
                            <CheckSquare size={18} className="text-green-600 flex-shrink-0" />
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
                Klas ({assignedParagrafen.length})
              </button>
              <button
                onClick={() => setActiveTab('leerlingen')}
                className={`flex-1 px-4 py-3 font-medium transition-colors ${
                  activeTab === 'leerlingen'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Leerlingen ({klasStudents.length})
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'klas' && (
                <div className="space-y-2">
                  {assignedParagrafen.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-8">
                      Geen content toegewezen
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
                                <p className="text-xs text-slate-500 py-2">Geen extra content. Selecteer links.</p>
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
