import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Scissors, BookOpen, Zap, Trash2, AlertCircle, Users2, Presentation, Download, MessageSquare } from 'lucide-react';
import { createDummyData, deleteDummyData, dummyDataExists } from '../services/dummyDataService';
import { migratePythagorasToFirestore, isPythagorasMigrated, deletePythagorasMigration, deleteAllCmsContent } from '../services/migrationService';
import { auth } from '../services/firebase';
import StudentLoginInfoModal from '../components/admin/StudentLoginInfoModal';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [dummyDataActive, setDummyDataActive] = useState(false);
  const [dummyDataLoading, setDummyDataLoading] = useState(false);
  const [showDummyConfirmDialog, setShowDummyConfirmDialog] = useState(null);

  const [pythagorasMigrated, setPythagorasMigrated] = useState(false);
  const [migrationLoading, setMigrationLoading] = useState(false);
  const [migrationError, setMigrationError] = useState(null);

  const [fullResetLoading, setFullResetLoading] = useState(false);
  const [showFullResetDialog, setShowFullResetDialog] = useState(false);
  const [fullResetConfirmText, setFullResetConfirmText] = useState('');
  const [showStudentLoginInfo, setShowStudentLoginInfo] = useState(false);

  // Check if dummy data and migration exist on mount
  useEffect(() => {
    const checkInitialState = async () => {
      try {
        console.log('🔐 [AdminDashboard] Current auth state:', {
          isAuthenticated: !!auth.currentUser,
          uid: auth.currentUser?.uid,
          email: auth.currentUser?.email,
        });

        const dummyExists = await dummyDataExists();
        setDummyDataActive(dummyExists);
        console.log(`📊 [AdminDashboard] Dummy data exists: ${dummyExists}`);

        const migrated = await isPythagorasMigrated();
        setPythagorasMigrated(migrated);
        console.log(`📊 [AdminDashboard] Pythagoras migrated: ${migrated}`);
      } catch (error) {
        console.error('❌ [AdminDashboard] Error checking state:', error);
      }
    };
    checkInitialState();
  }, []);

  const handleToggleDummyData = async () => {
    if (dummyDataActive) {
      setShowDummyConfirmDialog('delete');
    } else {
      setDummyDataLoading(true);
      console.log('🚀 [AdminDashboard] Starting dummy data creation...');
      try {
        await createDummyData();
        setDummyDataActive(true);
        console.log('✅ [AdminDashboard] Dummy data created successfully!');
        alert('✅ Dummy data created! Je kan nu de CMS testen.');
      } catch (error) {
        console.error('❌ [AdminDashboard] Error creating dummy data:', error);
        alert('❌ Error creating dummy data. Check console for details.');
      } finally {
        setDummyDataLoading(false);
      }
    }
  };

  const handleConfirmDeleteDummy = async () => {
    setDummyDataLoading(true);
    try {
      await deleteDummyData();
      setDummyDataActive(false);
      setShowDummyConfirmDialog(null);
      alert('✅ Dummy data deleted!');
    } catch (error) {
      console.error('Error deleting dummy data:', error);
      alert('❌ Error deleting dummy data. Check console.');
    } finally {
      setDummyDataLoading(false);
    }
  };

  const handleMigratePythagoras = async () => {
    if (!auth.currentUser?.uid) {
      setMigrationError('User not authenticated');
      return;
    }

    setMigrationLoading(true);
    setMigrationError(null);
    try {
      console.log('🚀 [AdminDashboard] Starting Pythagoras migration...');
      const result = await migratePythagorasToFirestore(auth.currentUser.uid);
      setPythagorasMigrated(true);
      alert(`✅ Migratie voltooid!\n${result.count} slides geïmporteerd naar Firestore`);
    } catch (error) {
      console.error('❌ [AdminDashboard] Migration error:', error);
      setMigrationError(error.message || 'Migratie mislukt. Controleer de console.');
    } finally {
      setMigrationLoading(false);
    }
  };

  const handleDeletePythagorasMigration = async () => {
    if (!window.confirm('Weet je zeker dat je alle Pythagoras data uit Firestore wilt verwijderen? Dit kan niet ongedaan gemaakt worden.')) {
      return;
    }

    setMigrationLoading(true);
    setMigrationError(null);
    try {
      console.log('🗑️ [AdminDashboard] Deleting Pythagoras migration...');
      const result = await deletePythagorasMigration();
      setPythagorasMigrated(false);
      alert(`✅ Verwijderd!\n${result.count} docs verwijderd uit Firestore`);
    } catch (error) {
      console.error('❌ [AdminDashboard] Delete error:', error);
      setMigrationError(error.message || 'Verwijdering mislukt. Controleer de console.');
    } finally {
      setMigrationLoading(false);
    }
  };

  const handleFullReset = async () => {
    if (fullResetConfirmText !== 'WISSEN') {
      alert('❌ Typ "WISSEN" om te bevestigen');
      return;
    }

    setFullResetLoading(true);
    try {
      console.log('🗑️ [AdminDashboard] Starting FULL CMS reset...');
      const result = await deleteAllCmsContent();
      alert(`✅ VOLLEDIGE RESET VOLTOOID!\n${result.count} docs verwijderd uit Firestore\n\nJe kan nu opnieuw beginnen met "Dummy Data Laden" of "Pythagoras Importeren".`);
      setShowFullResetDialog(false);
      setFullResetConfirmText('');
      // Refresh state
      const dummyExists = await dummyDataExists();
      setDummyDataActive(dummyExists);
      setPythagorasMigrated(false);
    } catch (error) {
      console.error('❌ [AdminDashboard] Full reset error:', error);
      alert(`❌ FOUT bij reset: ${error.message || 'Controleer de console.'}`);
    } finally {
      setFullResetLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600 text-lg">Beheer je lesplatform</p>
        </div>

        {/* Main Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Leerlingresultaten Card */}
          <button
            onClick={() => navigate('/dashboard')}
            className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-90 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity"></div>
            <div className="relative p-8 text-white h-full flex flex-col justify-between min-h-[280px]">
              <div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                  <Users size={32} />
                </div>
                <h2 className="text-2xl font-black mb-2">Leerlingresultaten</h2>
                <p className="text-white/80 text-sm">Monitor voortgang van je leerlingen</p>
              </div>
              <div className="text-white/60 text-xs font-medium">KLIK OM TE OPENEN →</div>
            </div>
          </button>

          {/* Crop Tool Card */}
          <button
            onClick={() => navigate('/admin/crop-tool')}
            className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 opacity-90 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity"></div>
            <div className="relative p-8 text-white h-full flex flex-col justify-between min-h-[280px]">
              <div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                  <Scissors size={32} />
                </div>
                <h2 className="text-2xl font-black mb-2">Crop Tool</h2>
                <p className="text-white/80 text-sm">Breng afbeeldingen in tegen vragen</p>
              </div>
              <div className="text-white/60 text-xs font-medium">KLIK OM TE OPENEN →</div>
            </div>
          </button>

          {/* CMS Platform Card */}
          <button
            onClick={() => navigate('/admin/cms')}
            className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-90 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity"></div>
            <div className="relative p-8 text-white h-full flex flex-col justify-between min-h-[280px]">
              <div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                  <BookOpen size={32} />
                </div>
                <h2 className="text-2xl font-black mb-2">CMS Platform</h2>
                <p className="text-white/80 text-sm">Beheer je lesinhoud en vragen</p>
              </div>
              <div className="text-white/60 text-xs font-medium">KLIK OM TE OPENEN →</div>
            </div>
          </button>

          {/* Klassen Beheer Card */}
          <button
            onClick={() => navigate('/admin/klassen')}
            className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-600 opacity-90 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity"></div>
            <div className="relative p-8 text-white h-full flex flex-col justify-between min-h-[280px]">
              <div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                  <Users2 size={32} />
                </div>
                <h2 className="text-2xl font-black mb-2">Klassen Beheer</h2>
                <p className="text-white/80 text-sm">Creëer klassen en beheer instellingen</p>
              </div>
              <div className="text-white/60 text-xs font-medium">KLIK OM TE OPENEN →</div>
            </div>
          </button>

          {/* Digibord Card */}
          <button
            onClick={() => navigate('/admin/digibord')}
            className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-600 opacity-90 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity"></div>
            <div className="relative p-8 text-white h-full flex flex-col justify-between min-h-[280px]">
              <div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                  <Presentation size={32} />
                </div>
                <h2 className="text-2xl font-black mb-2">Digibord</h2>
                <p className="text-white/80 text-sm">Presenteer slides fullscreen</p>
              </div>
              <div className="text-white/60 text-xs font-medium">KLIK OM TE OPENEN →</div>
            </div>
          </button>

          {/* Publiceer Info op Bord Card */}
          <button
            onClick={() => setShowStudentLoginInfo(true)}
            className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-pink-600 opacity-90 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity"></div>
            <div className="relative p-8 text-white h-full flex flex-col justify-between min-h-[280px]">
              <div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                  <MessageSquare size={32} />
                </div>
                <h2 className="text-2xl font-black mb-2">Publiceer Info op Bord</h2>
                <p className="text-white/80 text-sm">Toon inloggeninstructies aan leerlingen</p>
              </div>
              <div className="text-white/60 text-xs font-medium">KLIK OM TE OPENEN →</div>
            </div>
          </button>
        </div>

        {/* Dummy Data Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border-2 border-slate-100">
          <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle size={24} className="text-amber-500" />
                <h3 className="text-2xl font-black text-slate-800">🧪 Dummy Data voor Testen</h3>
              </div>
              <p className="text-slate-600 text-sm">
                Laad tijdelijke test data om de CMS te testen. Dit overschrijft je bestaande data niet.
              </p>
              {dummyDataActive && (
                <div className="mt-4 flex items-center gap-2 text-green-600 font-semibold">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  Dummy data is actief
                </div>
              )}
            </div>
            <button
              onClick={handleToggleDummyData}
              disabled={dummyDataLoading}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all whitespace-nowrap disabled:opacity-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                dummyDataActive
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {dummyDataActive ? (
                <>
                  <Trash2 size={20} />
                  Dummy Data Verwijderen
                </>
              ) : (
                <>
                  <Zap size={20} />
                  Dummy Data Laden
                </>
              )}
            </button>
          </div>
        </div>

        {/* Pythagoras Migration Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border-2 border-slate-100">
          <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Download size={24} className="text-blue-500" />
                <h3 className="text-2xl font-black text-slate-800">📚 Pythagoras Importeren</h3>
              </div>
              <p className="text-slate-600 text-sm">
                Importeer alle Pythagoras slides naar Firestore CMS. Daarna zichtbaar in CMS en per-klas instelbaar.
              </p>
              {pythagorasMigrated && (
                <div className="mt-4 flex items-center gap-2 text-green-600 font-semibold">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  Pythagoras geïmporteerd
                </div>
              )}
              {migrationError && (
                <div className="mt-4 text-red-600 text-sm font-semibold">
                  ❌ Fout: {migrationError}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleMigratePythagoras}
                disabled={migrationLoading || pythagorasMigrated}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all whitespace-nowrap disabled:opacity-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                  pythagorasMigrated
                    ? 'bg-green-600 text-white cursor-default'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Download size={20} />
                {migrationLoading ? 'Importeren...' : pythagorasMigrated ? 'Geïmporteerd ✓' : 'Importeren'}
              </button>
              {pythagorasMigrated && (
                <button
                  onClick={handleDeletePythagorasMigration}
                  disabled={migrationLoading}
                  className="flex items-center gap-2 px-6 py-4 rounded-2xl font-bold bg-red-600 hover:bg-red-700 text-white transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50"
                  title="Verwijder alle geïmporteerde Pythagoras data"
                >
                  <Trash2 size={20} />
                  Verwijderen
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Full Reset Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border-2 border-red-100">
          <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle size={24} className="text-red-500" />
                <h3 className="text-2xl font-black text-slate-800">🗑️ Alles Wissen (Full Reset)</h3>
              </div>
              <p className="text-slate-600 text-sm">
                <strong>⚠️ DESTRUCTIEF:</strong> Verwijdert ALLE CMS content (vakken, klassen, vragen, etc). Dit kan NIET ongedaan gemaakt worden.
              </p>
              <p className="text-red-600 text-xs font-semibold mt-2">
                Gebruikers (inloggegevens) worden NIET verwijderd. Gebruik dit om met een schone DB te beginnen.
              </p>
            </div>
            <button
              onClick={() => setShowFullResetDialog(true)}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold bg-red-700 hover:bg-red-800 text-white transition-all whitespace-nowrap shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              <Trash2 size={20} />
              Alles Wissen
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for Deleting Dummy Data */}
      {showDummyConfirmDialog === 'delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 bg-red-50 border-b border-red-200">
              <h3 className="text-xl font-bold text-red-900">Dummy Data Verwijderen?</h3>
              <p className="text-red-700 text-sm mt-2">
                Dit verwijdert al je test data. Je bestaande data blijft intact.
              </p>
            </div>
            <div className="p-8 space-y-4">
              <p className="text-slate-600 text-sm">
                Weet je zeker dat je de dummy test data wilt verwijderen?
              </p>
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowDummyConfirmDialog(null)}
                disabled={dummyDataLoading}
                className="px-6 py-2 rounded-lg font-medium bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors disabled:opacity-50"
              >
                Annuleren
              </button>
              <button
                onClick={handleConfirmDeleteDummy}
                disabled={dummyDataLoading}
                className="px-6 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {dummyDataLoading ? 'Verwijderen...' : 'Verwijderen'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Full Reset */}
      {showFullResetDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 bg-red-100 border-b border-red-300">
              <h3 className="text-xl font-bold text-red-900">⚠️ VOLLEDIGE DATABASE RESET?</h3>
              <p className="text-red-800 text-sm mt-2 font-semibold">
                Dit verwijdert ALLES (vakken, klassen, vragen). Dit kan NIET ongedaan gemaakt worden!
              </p>
            </div>
            <div className="p-8 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                <p className="font-semibold mb-2">Om te bevestigen, typ: <code className="bg-red-100 px-2 py-1 rounded font-bold">WISSEN</code></p>
                <input
                  type="text"
                  value={fullResetConfirmText}
                  onChange={(e) => setFullResetConfirmText(e.target.value)}
                  placeholder="Typ WISSEN..."
                  className="w-full px-4 py-2 border border-red-300 rounded-lg font-mono text-center uppercase"
                  autoFocus
                />
              </div>
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowFullResetDialog(false);
                  setFullResetConfirmText('');
                }}
                disabled={fullResetLoading}
                className="px-6 py-2 rounded-lg font-medium bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors disabled:opacity-50"
              >
                Annuleren
              </button>
              <button
                onClick={handleFullReset}
                disabled={fullResetLoading || fullResetConfirmText !== 'WISSEN'}
                className="px-6 py-2 rounded-lg font-medium bg-red-700 text-white hover:bg-red-800 transition-colors disabled:opacity-50"
              >
                {fullResetLoading ? 'Resetten...' : 'ALLES WISSEN'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Login Info Modal */}
      <StudentLoginInfoModal
        isOpen={showStudentLoginInfo}
        onClose={() => setShowStudentLoginInfo(false)}
      />
    </div>
  );
}
