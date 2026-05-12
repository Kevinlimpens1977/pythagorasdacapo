import { X, HelpCircle } from 'lucide-react';

export default function StudentLoginInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Blurred Background */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HelpCircle size={32} />
              <h2 className="text-2xl font-black">Leerlingen inloggen uitleg</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            <p className="text-lg text-slate-600 mb-8">
              Deel deze instructies met je leerlingen zodat zij correct kunnen inloggen:
            </p>

            <div className="space-y-6 bg-slate-50 rounded-xl p-8 border-2 border-slate-200">
              {/* Step 1 */}
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

              {/* Step 2 */}
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

              {/* Step 3 */}
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

              {/* Step 4 */}
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

            {/* Tip */}
            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-slate-700 font-medium">
                💡 <strong>Tip:</strong> Je kunt de voortgang van leerlingen volgen via het "Klas Dashboard"
              </p>
            </div>

            {/* Close Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-8 py-3 rounded-lg font-bold transition-colors"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
