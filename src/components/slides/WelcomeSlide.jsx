import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function WelcomeSlide({ onStart }) {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
      <div className="max-w-4xl w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full font-black text-sm uppercase tracking-wider mb-6">
            Welkom! 👋
          </div>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-6 tracking-tighter">
            Stelling van Pythagoras
          </h1>
          <p className="text-2xl md:text-3xl text-slate-600 font-medium">
            Leer de beroemdste stelling uit de wiskunde
          </p>
        </div>

        {/* Instructions Box */}
        <div className="bg-white rounded-[3rem] shadow-2xl border-4 border-slate-100 p-12 mb-12">
          <h2 className="heading-lg mb-12">
            📚 Hoe begin je?
          </h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-8 items-start">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white text-3xl font-black">1</span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Account aanmaken</h3>
                <p className="text-xl text-slate-600">
                  Ga naar <strong>pythagorasdacapo.vercel.app</strong>, klik op "Account aanmaken" en vul je gegevens in.
                </p>
                <p className="text-lg text-slate-500 mt-2">Gebruik je schoolemail en kies een veilig wachtwoord.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-8 items-start">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white text-3xl font-black">2</span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Inloggen</h3>
                <p className="text-xl text-slate-600">
                  Log in met je emailadres en wachtwoord.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-8 items-start">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white text-3xl font-black">3</span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Maak de opgaven</h3>
                <p className="text-xl text-slate-600">
                  Volg de opdrachten in deze volgorde:
                </p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-500 flex-shrink-0" size={28} />
                    <span className="text-lg font-bold text-slate-700">Voorkennis (alles doen)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-500 flex-shrink-0" size={28} />
                    <span className="text-lg font-bold text-slate-700">Paragraaf 7.1 Rechthoekige driehoeken (alles doen)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-12 p-8 bg-amber-50 border-4 border-amber-200 rounded-[2rem]">
            <h3 className="text-2xl font-black text-amber-900 mb-4">💡 Tips</h3>
            <ul className="space-y-3 text-lg text-amber-800">
              <li>✓ Neem de tijd voor je antwoorden - haast heeft geen zin</li>
              <li>✓ Lees de hints als je een fout antwoord geeft</li>
              <li>✓ Je docent kan je voortgang volgen in het dashboard</li>
            </ul>
          </div>
        </div>

        {/* Start Button */}
        <div className="flex justify-center">
          <button
            onClick={onStart}
            className="flex items-center gap-4 px-12 py-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-2xl lg:text-3xl font-black rounded-[2.5rem] shadow-2xl transition-all hover:-translate-y-2 active:translate-y-0"
          >
            Start nu! <ArrowRight size={40} />
          </button>
        </div>
      </div>
    </div>
  );
}
