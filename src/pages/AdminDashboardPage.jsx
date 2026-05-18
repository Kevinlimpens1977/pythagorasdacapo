import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Users2, Presentation, MessageSquare, CheckSquare } from 'lucide-react';
import StudentLoginInfoModal from '../components/admin/StudentLoginInfoModal';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [showStudentLoginInfo, setShowStudentLoginInfo] = useState(false);

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

          {/* Taken Toewijzen Card */}
          <button
            onClick={() => navigate('/admin/taken-toewijzen')}
            className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-600 opacity-90 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity"></div>
            <div className="relative p-8 text-white h-full flex flex-col justify-between min-h-[280px]">
              <div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
                  <CheckSquare size={32} />
                </div>
                <h2 className="text-2xl font-black mb-2">Taken Toewijzen</h2>
                <p className="text-white/80 text-sm">Wijs content toe aan klassen en leerlingen</p>
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

      </div>


      {/* Student Login Info Modal */}
      <StudentLoginInfoModal
        isOpen={showStudentLoginInfo}
        onClose={() => setShowStudentLoginInfo(false)}
      />
    </div>
  );
}
