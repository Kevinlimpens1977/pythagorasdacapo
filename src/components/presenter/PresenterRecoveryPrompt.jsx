export default function PresenterRecoveryPrompt({ onRestore, onDiscard }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-8"
      role="presentation"
    >
      <section
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 text-slate-950 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="presenter-recovery-title"
        aria-describedby="presenter-recovery-description"
      >
        <h2 id="presenter-recovery-title" className="text-2xl font-black leading-tight">
          Vorige Presenter-sessie herstellen?
        </h2>
        <p id="presenter-recovery-description" className="mt-3 text-base leading-7 text-slate-700">
          Er staat nog werk klaar van een eerdere Presenter-sessie. Je kunt verdergaan waar je was gebleven of met
          een leeg bord starten.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="min-h-12 rounded-md border border-slate-300 px-5 text-base font-black text-slate-800 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
            onClick={onDiscard}
          >
            Leeg bord
          </button>
          <button
            type="button"
            className="min-h-12 rounded-md bg-slate-950 px-5 text-base font-black text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
            onClick={onRestore}
            autoFocus
          >
            Herstellen
          </button>
        </div>
      </section>
    </div>
  );
}
