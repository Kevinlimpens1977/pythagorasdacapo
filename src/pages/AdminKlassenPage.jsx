import { useEffect, useState } from 'react';
import { Gamepad2,
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
  UsersRound,
  Waypoints
} from 'lucide-react';
import * as klasService from '../services/klasService';
import * as cmsService from '../services/cmsService';
import { useAuth } from '../components/auth/AuthProvider';
import { buildKlasRouteOpties, getKlasRouteLabel } from '../lib/klasRoute';
import { HBlok, Label, PaginaKop } from '../components/leeromgeving';
import { HelixLaden } from '../components/merk/HelixLogo';

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

  // De leerroute van de klas: welk niveau (Blauwe/Groene/Paarse route) de
  // leerlingen van deze klas te zien krijgen. Leeg = geen route = alles.
  const handleSelectRoute = async (klasId, niveauId) => {
    try {
      await klasService.updateKlasNiveau(klasId, niveauId || null);
      await loadKlassen();
    } catch (err) {
      console.error('Error updating klas route:', err);
      setError(err.message || 'Kon de route niet bijwerken');
    }
  };

  const handleToggleSetting = async (klasId, setting) => {
    try {
      const klas = klassen.find(k => k.id === klasId);
      if (!klas) return;

      // spelAlsAfsluiting staat standaard aan; zonder veld is de huidige stand
      // dus true en moet de eerste klik hem expliciet op false zetten.
      const defaultAan = setting === 'spelAlsAfsluiting';
      const huidig = defaultAan ? klas.settings?.[setting] !== false : Boolean(klas.settings?.[setting]);
      const newSettings = {
        ...klas.settings,
        [setting]: !huidig
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
  // Alle niveaus plat uit de geladen CMS-boom, voor de routekeuze en de labels
  // in de klassenlijst.
  const alleNiveaus = Object.values(cmsContent).flatMap(vakData =>
    Object.values(vakData.leerjaren).flatMap(leerjaarData =>
      Object.values(leerjaarData.niveaus)
        .map(({ niveau }) => niveau)
        .filter(Boolean)
    )
  );
  const routeOpties = buildKlasRouteOpties(alleNiveaus);
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
    },
    {
      key: 'spelAlsAfsluiting',
      label: 'Spel als afsluiting',
      description: 'Het spel in een paragraaf is pas speelbaar als alle andere stappen af zijn.',
      icon: Gamepad2,
      // Standaard aan: alleen een expliciete false zet het spel meteen open.
      defaultAan: true
    }
  ];

  return (
    <div className="helix-page beheer-stijl min-h-screen">
      <div className="helix-container max-w-7xl">
        <div className="mb-8">
          <PaginaKop
            eyebrow="Leerlingen"
            titel="Klassen beheren"
            uitleg="Beheer klassen, leerlingkoppelingen, lesmateriaal en instellingen per klas."
            acties={(
              <div className="hidden lg:block">
                <Label kleur="paars" icoon={UsersRound}>{klassen.length} klassen</Label>
              </div>
            )}
          />
        </div>

        {error && (
          <div className="lo-melding lo-melding--fout mb-6">
            {error}
          </div>
        )}

        {/* Create Class Section */}
        <section className="helix-card mb-8 p-5">
          <h2 className="lo-kaart-titel mb-4">
            <Plus size={18} className="lo-kolf" aria-hidden="true" /> Nieuwe klas aanmaken
          </h2>
          <form onSubmit={handleCreateClass} className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="Bijv. VMBO 1A"
              className="lo-invoer flex-1"
              disabled={creating}
            />
            <button
              type="submit"
              disabled={creating || !newClassName.trim()}
              className="lo-knop"
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
                <h3 className="text-[15px] font-extrabold text-[var(--lo-inkt)]">
                  Klassen ({klassen.length})
                </h3>
                <Users size={18} className="text-[var(--lo-grijs)]" />
              </div>

              {loading ? (
                <HelixLaden tekst="Klassen laden" className="min-h-0 py-10" />
              ) : klassen.length === 0 ? (
                <div className="p-6 text-center text-[var(--lo-grijs)]">
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
                        <div className="mt-1 text-xs font-bold text-[var(--lo-grijs)]">
                          {klassesWithStudents[klas.id]?.length || 0} leerlingen · {getKlasRouteLabel(klas, alleNiveaus)}
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
                <div className="border-b border-[var(--lo-lijn)] bg-[var(--lo-papier-2)] px-6 py-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-[var(--lo-inkt)]">
                      {selectedKlas.name}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-[var(--lo-grijs)]">Code: {selectedKlas.code}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteClass(selectedKlas.id)}
                    className="lo-knop-tweede lo-knop--klein lo-knop-tweede--gevaar"
                    title="Klas verwijderen"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Settings */}
                <div className="border-b border-[var(--lo-lijn)] p-6">
                  <h4 className="lo-onderregel mb-4 flex items-center gap-2 font-bold">
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
                          checked={setting.defaultAan ? selectedKlas.settings?.[setting.key] !== false : Boolean(selectedKlas.settings?.[setting.key])}
                          onChange={() => handleToggleSetting(selectedKlas.id, setting.key)}
                          className="mt-1 h-5 w-5 cursor-pointer rounded accent-[var(--lo-paars)]"
                        />
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2 font-extrabold text-[var(--lo-inkt)]">
                            <SettingIcon size={18} className="text-[var(--lo-paars)]" />
                            {setting.label}
                          </div>
                          <div className="text-sm leading-5 text-[var(--lo-grijs)]">
                            {setting.description}
                          </div>
                        </div>
                      </label>
                    );
                    })}
                  </div>

                  {/* Leerroute: welk niveau de leerlingen van deze klas zien. */}
                  <div className="mt-4 max-w-md">
                    <label
                      htmlFor="klas-route-keuze"
                      className="mb-1 flex items-center gap-2 font-extrabold text-[var(--lo-inkt)]"
                    >
                      <Waypoints size={18} className="text-[var(--lo-paars)]" />
                      Leerroute
                    </label>
                    <select
                      id="klas-route-keuze"
                      value={selectedKlas.niveauId || ''}
                      onChange={(e) => handleSelectRoute(selectedKlas.id, e.target.value)}
                      className="lo-invoer"
                    >
                      {routeOpties.map(optie => (
                        <option key={optie.id || 'geen-route'} value={optie.id}>
                          {optie.label}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm leading-5 text-[var(--lo-grijs)]">
                      Met een route ziet deze klas alleen de hoofdstukken en paragrafen van dat
                      niveau. Zonder route blijft alle toegewezen lesstof zichtbaar.
                    </p>
                  </div>
                </div>

                {/* Beschikbare Content (CMS) */}
                <div className="border-b border-[var(--lo-lijn)] p-6">
                  <h4 className="lo-onderregel mb-4 flex items-center gap-2 font-bold">
                    <BookMarked size={16} /> Lesstof toewijzing
                  </h4>

                  {contentLoading ? (
                    <HelixLaden tekst="Content laden..." className="min-h-0 py-10" />
                  ) : Object.keys(cmsContent).length === 0 ? (
                    <div className="text-sm text-[var(--lo-grijs)]">Geen content beschikbaar</div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {Object.entries(cmsContent).map(([vakId, vakData]) => (
                        <div key={vakId} className="helix-card-subtle overflow-hidden">
                          {/* Vak Header */}
                          <div className="border-b border-[var(--lo-lijn)] bg-white/80 px-4 py-3 font-extrabold text-[var(--lo-inkt)]">
                            {vakData.vak?.title || vakData.vak?.name || 'Vak'}
                          </div>

                          {/* Leerjaren */}
                          <div className="divide-y divide-[var(--lo-lijn)]">
                            {Object.entries(vakData.leerjaren).map(([leerjaargId, leerjaargData]) => (
                              <div key={leerjaargId} className="px-4 py-3">
                                <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-[var(--lo-inkt)]">
                                  <BookOpenCheck size={16} className="text-[var(--lo-paars)]" />
                                  {leerjaargData.leerjaar?.title || leerjaargData.leerjaar?.name || `Leerjaar ${leerjaargData.leerjaar?.year}`}
                                </div>

                                {/* Niveaus */}
                                <div className="space-y-3 ml-4">
                                  {Object.entries(leerjaargData.niveaus).map(([niveauId, niveauData]) => (
                                    <div key={niveauId}>
                                      <div className="lo-onderregel mb-2 font-bold">
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
                                            <div key={hoofdstukId} className="rounded-xl border border-[var(--lo-lijn)] bg-white px-3 py-2">
                                              {/* Hoofdstuk Toggle */}
                                              <div className="flex items-center gap-2 mb-2">
                                                <button
                                                  onClick={() => setExpandedHoofdstukken(prev => ({
                                                    ...prev,
                                                    [hoofdstukId]: !prev[hoofdstukId]
                                                  }))}
                                                  className="rounded-lg p-1 text-[var(--lo-grijs)] transition hover:bg-[var(--lo-papier-2)]"
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
                                                    className="h-4 w-4 rounded accent-[var(--lo-paars)]"
                                                  />
                                                  <HBlok nummer={hoofdstuk?.number} />
                                                  <span className="text-sm font-bold text-[var(--lo-inkt)]">
                                                    {hoofdstuk?.number && `${hoofdstuk.number}. `}{hoofdstuk?.title}
                                                  </span>
                                                  {someEnabled && !allEnabled && (
                                                    <Label kleur="oranje">Deels</Label>
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
                                                        className="flex items-center gap-2 cursor-pointer hover:bg-[var(--lo-papier-2)] px-2 py-1 rounded text-sm"
                                                      >
                                                        <input
                                                          type="checkbox"
                                                          checked={isEnabled}
                                                          onChange={() => handleToggleParagraaf(selectedKlas.id, paragraaf.id)}
                                                          className="h-4 w-4 rounded accent-[var(--lo-paars)]"
                                                        />
                                                        <span className="text-[var(--lo-grijs)]">
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
                  <h4 className="lo-onderregel mb-4 flex items-center gap-2 font-bold">
                    <Users size={16} /> Leerlingen ({selectedStudents.length})
                  </h4>

                  {selectedStudents.length === 0 ? (
                    <p className="text-sm text-[var(--lo-grijs)]">
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
                            <div className="font-extrabold text-[var(--lo-inkt)]">
                              {student.displayName || 'Geen naam'}
                            </div>
                            <div className="text-xs font-medium text-[var(--lo-grijs)]">
                              {student.email}
                            </div>
                          </div>
                          <UserCheck
                            size={18}
                            className={selectedStudent?.uid === student.uid ? 'text-[var(--lo-groen-inkt)]' : 'text-[var(--lo-grijs)]'}
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Student Override Panel */}
                  {selectedStudent && (
                    <div className="helix-card-subtle mt-6 p-4">
                      <h5 className="mb-3 font-extrabold text-[var(--lo-inkt)]">
                        Extra taken voor {selectedStudent.displayName}
                      </h5>
                      <p className="mb-3 text-xs font-medium text-[var(--lo-grijs)]">
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
                                      className="flex cursor-pointer items-center gap-2 rounded-xl border border-transparent p-2 text-sm hover:border-[var(--lo-lijn)] hover:bg-white"
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
                                        className="h-4 w-4 rounded accent-[var(--lo-paars)]"
                                      />
                                      <span className={override ? 'font-extrabold text-[var(--lo-inkt)]' : 'text-[var(--lo-grijs)]'}>
                                        {paragraaf.number && `${paragraaf.number}. `}{paragraaf.title}
                                      </span>
                                      {classDefault && <Label kleur="blauw">Klas</Label>}
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
                        className="lo-knop-tweede lo-knop--klein"
                      >
                        Gereed
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="helix-card p-12 text-center text-[var(--lo-grijs)]">
                Selecteer een klas om details te zien
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
