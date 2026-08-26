import { useEffect, useState } from 'react';
import {
  Bot,
  BookMarked,
  BookOpenCheck,
  Calculator,
  ChevronDown,
  Lightbulb,
  Plus,
  Settings,
  Trash2,
  UserCheck,
  Users,
  UsersRound
} from 'lucide-react';
import * as klasService from '../services/klasService';
import * as cmsService from '../services/cmsService';
import { useAuth } from '../components/auth/AuthProvider';

export default function AdminKlassenPage() {
  const { currentUser } = useAuth();
  const [klassen, setKlassen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newClassName, setNewClassName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedKlasId, setSelectedKlasId] = useState(null);
  const [klassesWithStudents, setKlassesWithStudents] = useState({});
  const [cmsContent, setCmsContent] = useState({});
  const [contentLoading, setContentLoading] = useState(false);
  const [expandedHoofdstukken, setExpandedHoofdstukken] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Load all classes
  const loadKlassen = async () => {
    try {
      setLoading(true);
      const data = await klasService.getAvailableKlassen();
      setKlassen(data);

      // Load student counts
      const studentsMap = {};
      for (const klas of data) {
        const students = await klasService.getKlasStudents(klas.id);
        studentsMap[klas.id] = students;
      }
      setKlassesWithStudents(studentsMap);
    } catch (err) {
      console.error('Error loading classes:', err);
      setError('Kon klassen niet laden');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newClassName.trim() || !currentUser?.uid) return;

    try {
      setCreating(true);
      setError(null);
      await klasService.createKlas(newClassName.trim(), currentUser.uid);
      setNewClassName('');
      await loadKlassen();
    } catch (err) {
      console.error('Error creating class:', err);
      setError(err.message || 'Kon klas niet aanmaken');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteClass = async (klasId) => {
    if (!window.confirm('Weet je zeker dat je deze klas wilt verwijderen?')) return;

    try {
      await klasService.deleteKlas(klasId);
      if (selectedKlasId === klasId) {
        setSelectedKlasId(null);
      }
      await loadKlassen();
    } catch (err) {
      console.error('Error deleting class:', err);
      setError(err.message || 'Kon klas niet verwijderen');
    }
  };

  const handleToggleSetting = async (klasId, setting) => {
    try {
      const klas = klassen.find(k => k.id === klasId);
      if (!klas) return;

      const newSettings = {
        ...klas.settings,
        [setting]: !klas.settings[setting]
      };

      await klasService.updateKlasSettings(klasId, newSettings);
      await loadKlassen();
    } catch (err) {
      console.error('Error updating settings:', err);
      setError(err.message || 'Kon instelling niet bijwerken');
    }
  };

  // Load CMS content hierarchy (Vak > Leerjaar > Niveau > Hoofdstuk > Paragraaf)
  const loadCmsContent = async () => {
    try {
      setContentLoading(true);
      const vakken = await cmsService.getVakken();

      const content = {};
      for (const vak of vakken) {
        const leerjaren = await cmsService.getLeerjaren(vak.id);
        content[vak.id] = { vak, leerjaren: {} };

        for (const leerjaar of leerjaren) {
          const niveaus = await cmsService.getNiveaus(leerjaar.id);
          content[vak.id].leerjaren[leerjaar.id] = { leerjaar, niveaus: {} };

          for (const niveau of niveaus) {
            const hoofdstukken = await cmsService.getHoofdstukken(niveau.id);
            content[vak.id].leerjaren[leerjaar.id].niveaus[niveau.id] = { niveau, hoofdstukken: {} };

            for (const hoofdstuk of hoofdstukken) {
              const paragrafen = await cmsService.getParagrafen(hoofdstuk.id);
              content[vak.id].leerjaren[leerjaar.id].niveaus[niveau.id].hoofdstukken[hoofdstuk.id] = {
                hoofdstuk,
                paragrafen: paragrafen || []
              };
            }
          }
        }
      }
      setCmsContent(content);
    } catch (err) {
      console.error('Error loading CMS content:', err);
      setError('Kon content niet laden');
    } finally {
      setContentLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    void Promise.resolve().then(() => {
      if (cancelled) return;
      void loadKlassen();
      void loadCmsContent();
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Toggle paragraph for class
  const handleToggleParagraaf = async (klasId, paragraafId) => {
    try {
      const klas = klassen.find(k => k.id === klasId);
      if (!klas) return;

      const currentParagrafen = klas.enabledParagrafen || [];
      const newParagrafen = currentParagrafen.includes(paragraafId)
        ? currentParagrafen.filter(id => id !== paragraafId)
        : [...currentParagrafen, paragraafId];

      await klasService.updateKlasEnabledParagrafen(klasId, newParagrafen);
      await loadKlassen();
    } catch (err) {
      console.error('Error updating paragraaf:', err);
      setError(err.message || 'Kon paragraaf niet bijwerken');
    }
  };

  // Toggle all paragraphs in a chapter
  const handleToggleHoofdstuk = async (klasId, hoofdstukId) => {
    try {
      const klas = klassen.find(k => k.id === klasId);
      if (!klas) return;

      const paragraafIds = getAllParagrafenForHoofdstuk(hoofdstukId);
      const currentParagrafen = klas.enabledParagrafen || [];

      const allEnabled = paragraafIds.every(id => currentParagrafen.includes(id));

      let newParagrafen;
      if (allEnabled) {
        // Disable all
        newParagrafen = currentParagrafen.filter(id => !paragraafIds.includes(id));
      } else {
        // Enable all
        newParagrafen = [...new Set([...currentParagrafen, ...paragraafIds])];
      }

      await klasService.updateKlasEnabledParagrafen(klasId, newParagrafen);
      await loadKlassen();
    } catch (err) {
      console.error('Error updating hoofdstuk:', err);
      setError(err.message || 'Kon hoofdstuk niet bijwerken');
    }
  };

  // Get all paragraph IDs for a chapter
  const getAllParagrafenForHoofdstuk = (hoofdstukId) => {
    const result = [];
    Object.values(cmsContent).forEach(vak => {
      Object.values(vak.leerjaren).forEach(leerjaar => {
        Object.values(leerjaar.niveaus).forEach(niveau => {
          if (niveau.hoofdstukken[hoofdstukId]?.paragrafen) {
            result.push(...niveau.hoofdstukken[hoofdstukId].paragrafen.map(p => p.id));
          }
        });
      });
    });
    return result;
  };

  // Set student override for extra content
  const handleSetStudentOverride = async (klasId, studentUid, extraParagraafIds) => {
    try {
      if (extraParagraafIds.length === 0) {
        await klasService.removeStudentOverride(klasId, studentUid);
      } else {
        await klasService.setStudentOverride(klasId, studentUid, extraParagraafIds);
      }
      await loadKlassen();
      setSelectedStudent(null);
    } catch (err) {
      console.error('Error setting student override:', err);
      setError(err.message || 'Kon student override niet bijwerken');
    }
  };

  const selectedKlas = klassen.find(k => k.id === selectedKlasId);
  const selectedStudents = selectedKlasId ? klassesWithStudents[selectedKlasId] || [] : [];
  const classSettings = [
    {
      key: 'hintsEnabled',
      label: 'Hints beschikbaar',
      description: 'Leerlingen kunnen hints zien tijdens het werken.',
      icon: Lightbulb
    },
    {
      key: 'aiEnabled',
      label: 'Digidocent hulp beschikbaar',
      description: 'Leerlingen kunnen AI-hulp gebruiken binnen de afgesproken kaders.',
      icon: Bot
    },
    {
      key: 'calculatorEnabled',
      label: 'Rekenmachine beschikbaar',
      description: 'Leerlingen kunnen de ingebouwde rekenmachine gebruiken.',
      icon: Calculator
    }
  ];

  return (
    <div className="helix-page min-h-screen">
      <div className="helix-container max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="helix-eyebrow">Leerlingen</p>
            <h1 className="helix-heading-xl">Klassen beheren</h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-[var(--helix-muted)]">
              Beheer klassen, leerlingkoppelingen, lesmateriaal en instellingen per klas.
            </p>
          </div>
          <div className="hidden items-center gap-3 rounded-2xl border border-[var(--helix-border)] bg-white/80 px-4 py-3 shadow-sm lg:flex">
            <UsersRound size={20} className="text-[var(--helix-purple)]" />
            <span className="text-sm font-black text-[var(--helix-navy)]">{klassen.length} klassen</span>
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        {/* Create Class Section */}
        <section className="helix-card mb-8 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-[var(--helix-navy)]">
            <Plus size={20} className="text-[var(--helix-purple)]" /> Nieuwe klas aanmaken
          </h2>
          <form onSubmit={handleCreateClass} className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="Bijv. VMBO 1A"
              className="input-standard flex-1"
              disabled={creating}
            />
            <button
              type="submit"
              disabled={creating || !newClassName.trim()}
              className="btn-secondary w-auto px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating ? 'Aanmaken...' : 'Aanmaken'}
            </button>
          </form>
        </section>

        {/* Two-Column Layout */}
        <div className="grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
          {/* Classes List */}
          <aside>
            <div className="helix-card overflow-hidden p-4">
              <div className="mb-3 flex items-center justify-between px-1">
                <h3 className="font-black text-[var(--helix-navy)]">
                  Klassen ({klassen.length})
                </h3>
                <Users size={18} className="text-[var(--helix-muted)]" />
              </div>

              {loading ? (
                <div className="p-6 space-y-2">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="h-12 bg-gray-200 rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : klassen.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Geen klassen aangemaakt
                </div>
              ) : (
                <div className="space-y-2">
                  {klassen.map(klas => (
                    <button
                      key={klas.id}
                      onClick={() => setSelectedKlasId(klas.id)}
                      className={`dashboard-lens-tab w-full justify-start px-4 py-3 text-left ${
                        selectedKlasId === klas.id
                          ? 'dashboard-lens-tab-active'
                          : ''
                      }`}
                    >
                      <div>
                        <div>{klas.name}</div>
                        <div className="mt-1 text-xs font-bold text-[var(--helix-muted)]">
                          {klassesWithStudents[klas.id]?.length || 0} leerlingen
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Selected Class Details */}
          <main>
            {selectedKlas ? (
              <div className="helix-card overflow-hidden">
                {/* Header */}
                <div className="border-b border-[var(--helix-border)] bg-[var(--helix-surface-soft)] px-6 py-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-[var(--helix-navy)]">
                      {selectedKlas.name}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-[var(--helix-muted)]">Code: {selectedKlas.code}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteClass(selectedKlas.id)}
                    className="rounded-xl border border-red-200 bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
                    title="Klas verwijderen"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {/* Settings */}
                <div className="border-b border-[var(--helix-border)] p-6">
                  <h4 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-[var(--helix-muted)]">
                    <Settings size={16} /> Instellingen
                  </h4>

                  <div className="grid gap-3 md:grid-cols-3">
                    {classSettings.map(setting => {
                      const SettingIcon = setting.icon;
                      return (
                      <label
                        key={setting.key}
                        className="helix-action-card flex cursor-pointer items-start gap-3 p-4"
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(selectedKlas.settings?.[setting.key])}
                          onChange={() => handleToggleSetting(selectedKlas.id, setting.key)}
                          className="mt-1 h-5 w-5 cursor-pointer rounded accent-[var(--helix-purple)]"
                        />
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2 font-black text-[var(--helix-navy)]">
                            <SettingIcon size={18} className="text-[var(--helix-purple)]" />
                            {setting.label}
                          </div>
                          <div className="text-sm leading-5 text-[var(--helix-muted)]">
                            {setting.description}
                          </div>
                        </div>
                      </label>
                    );
                    })}
                  </div>
                </div>

                {/* Beschikbare Content (CMS) */}
                <div className="border-b border-[var(--helix-border)] p-6">
                  <h4 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-[var(--helix-muted)]">
                    <BookMarked size={16} /> Lesstof toewijzing
                  </h4>

                  {contentLoading ? (
                    <div className="text-sm text-[var(--helix-muted)]">Content laden...</div>
                  ) : Object.keys(cmsContent).length === 0 ? (
                    <div className="text-sm text-[var(--helix-muted)]">Geen content beschikbaar</div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {Object.entries(cmsContent).map(([vakId, vakData]) => (
                        <div key={vakId} className="helix-card-subtle overflow-hidden">
                          {/* Vak Header */}
                          <div className="border-b border-[var(--helix-border)] bg-white/80 px-4 py-3 font-black text-[var(--helix-navy)]">
                            {vakData.vak?.title || vakData.vak?.name || 'Vak'}
                          </div>

                          {/* Leerjaren */}
                          <div className="divide-y divide-[var(--helix-border)]">
                            {Object.entries(vakData.leerjaren).map(([leerjaargId, leerjaargData]) => (
                              <div key={leerjaargId} className="px-4 py-3">
                                <div className="mb-3 flex items-center gap-2 text-sm font-black text-[var(--helix-navy)]">
                                  <BookOpenCheck size={16} className="text-[var(--helix-purple)]" />
                                  {leerjaargData.leerjaar?.title || leerjaargData.leerjaar?.name || `Leerjaar ${leerjaargData.leerjaar?.year}`}
                                </div>

                                {/* Niveaus */}
                                <div className="space-y-3 ml-4">
                                  {Object.entries(leerjaargData.niveaus).map(([niveauId, niveauData]) => (
                                    <div key={niveauId}>
                                      <div className="mb-2 text-xs font-black uppercase tracking-wide text-[var(--helix-muted)]">
                                        {niveauData.niveau?.title || niveauData.niveau?.name || 'Niveau'}
                                      </div>

                                      {/* Hoofdstukken */}
                                      <div className="space-y-2 ml-3">
                                        {Object.entries(niveauData.hoofdstukken).map(([hoofdstukId, { hoofdstuk, paragrafen }]) => {
                                          const currentParagrafen = selectedKlas?.enabledParagrafen || [];
                                          const paragraafIds = paragrafen.map(p => p.id);
                                          const allEnabled = paragraafIds.every(id => currentParagrafen.includes(id));
                                          const someEnabled = paragraafIds.some(id => currentParagrafen.includes(id));

                                          return (
                                            <div key={hoofdstukId} className="rounded-xl border border-[var(--helix-border)] bg-white px-3 py-2">
                                              {/* Hoofdstuk Toggle */}
                                              <div className="flex items-center gap-2 mb-2">
                                                <button
                                                  onClick={() => setExpandedHoofdstukken(prev => ({
                                                    ...prev,
                                                    [hoofdstukId]: !prev[hoofdstukId]
                                                  }))}
                                                  className="rounded-lg p-1 text-[var(--helix-muted)] transition hover:bg-[var(--helix-surface-soft)]"
                                                >
                                                  <ChevronDown
                                                    size={16}
                                                    className={`transition-transform ${expandedHoofdstukken[hoofdstukId] ? 'rotate-180' : ''}`}
                                                  />
                                                </button>
                                                <label className="flex items-center gap-2 flex-1 cursor-pointer">
                                                  <input
                                                    type="checkbox"
                                                    checked={allEnabled}
                                                    onChange={() => handleToggleHoofdstuk(selectedKlas.id, hoofdstukId)}
                                                    className="h-4 w-4 rounded accent-[var(--helix-purple)]"
                                                  />
                                                  <span className="text-sm font-bold text-[var(--helix-navy)]">
                                                    {hoofdstuk?.number && `${hoofdstuk.number}. `}{hoofdstuk?.title}
                                                  </span>
                                                  {someEnabled && !allEnabled && (
                                                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-black text-amber-700">
                                                      Deels
                                                    </span>
                                                  )}
                                                </label>
                                              </div>

                                              {/* Paragrafen */}
                                              {expandedHoofdstukken[hoofdstukId] && (
                                                <div className="ml-6 space-y-1 mb-3">
                                                  {paragrafen.map(paragraaf => {
                                                    const isEnabled = currentParagrafen.includes(paragraaf.id);
                                                    return (
                                                      <label
                                                        key={paragraaf.id}
                                                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded text-sm"
                                                      >
                                                        <input
                                                          type="checkbox"
                                                          checked={isEnabled}
                                                          onChange={() => handleToggleParagraaf(selectedKlas.id, paragraaf.id)}
                                                          className="h-4 w-4 rounded accent-[var(--helix-purple)]"
                                                        />
                                                        <span className="text-[var(--helix-muted)]">
                                                          {paragraaf.number && `${paragraaf.number}. `}{paragraaf.title}
                                                        </span>
                                                      </label>
                                                    );
                                                  })}
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Students */}
                <div className="p-6">
                  <h4 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-[var(--helix-muted)]">
                    <Users size={16} /> Leerlingen ({selectedStudents.length})
                  </h4>

                  {selectedStudents.length === 0 ? (
                    <p className="text-sm text-[var(--helix-muted)]">
                      Nog geen leerlingen in deze klas
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {selectedStudents.map(student => (
                        <button
                          key={student.uid}
                          onClick={() => setSelectedStudent(selectedStudent?.uid === student.uid ? null : student)}
                          className={`helix-action-card w-full flex items-center justify-between p-3 text-left ${
                            selectedStudent?.uid === student.uid
                              ? 'helix-action-card-active'
                              : ''
                          }`}
                        >
                          <div className="text-left">
                            <div className="font-black text-[var(--helix-navy)]">
                              {student.displayName || 'Geen naam'}
                            </div>
                            <div className="text-xs font-medium text-[var(--helix-muted)]">
                              {student.email}
                            </div>
                          </div>
                          <UserCheck
                            size={18}
                            className={selectedStudent?.uid === student.uid ? 'text-emerald-600' : 'text-[var(--helix-muted)]'}
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Student Override Panel */}
                  {selectedStudent && (
                    <div className="helix-card-subtle mt-6 p-4">
                      <h5 className="mb-3 font-black text-[var(--helix-navy)]">
                        Extra taken voor {selectedStudent.displayName}
                      </h5>
                      <p className="mb-3 text-xs font-medium text-[var(--helix-muted)]">
                        Selecteer aanvullende taken boven op de klasinstelling
                      </p>

                      <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
                        {Object.values(cmsContent).flatMap(vakData =>
                          Object.values(vakData.leerjaren).flatMap(leerjaargData =>
                            Object.values(leerjaargData.niveaus).flatMap(niveauData =>
                              Object.values(niveauData.hoofdstukken).flatMap(({ paragrafen }) =>
                                paragrafen.map(paragraaf => {
                                  const classDefault = selectedKlas?.enabledParagrafen?.includes(paragraaf.id) || false;
                                  const override = selectedKlas?.studentOverrides?.[selectedStudent.uid]?.extraParagrafen?.includes(paragraaf.id) || false;

                                  return (
                                    <label
                                      key={paragraaf.id}
                                      className="flex cursor-pointer items-center gap-2 rounded-xl border border-transparent p-2 text-sm hover:border-[var(--helix-border)] hover:bg-white"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={override}
                                        onChange={(e) => {
                                          const current = selectedKlas?.studentOverrides?.[selectedStudent.uid]?.extraParagrafen || [];
                                          let updated;
                                          if (e.target.checked) {
                                            updated = [...new Set([...current, paragraaf.id])];
                                          } else {
                                            updated = current.filter(id => id !== paragraaf.id);
                                          }
                                          handleSetStudentOverride(selectedKlas.id, selectedStudent.uid, updated);
                                        }}
                                        className="h-4 w-4 rounded accent-[var(--helix-purple)]"
                                      />
                                      <span className={override ? 'font-black text-[var(--helix-navy)]' : 'text-[var(--helix-muted)]'}>
                                        {paragraaf.number && `${paragraaf.number}. `}{paragraaf.title}
                                      </span>
                                      {classDefault && <span className="text-xs bg-gray-300 px-2 py-0.5 rounded">Klas</span>}
                                    </label>
                                  );
                                })
                              )
                            )
                          )
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedStudent(null)}
                        className="btn-secondary px-4 py-2 text-sm"
                      >
                        Gereed
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="helix-card p-12 text-center text-[var(--helix-muted)]">
                Selecteer een klas om details te zien
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
