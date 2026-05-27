export default function AdminPresenterPage() {
  return (
    <section className="flex min-h-[calc(100vh-5rem)] flex-col bg-slate-100">
      <div className="flex flex-1 items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 text-center shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Presenter</p>
          <h1 className="mt-2 text-3xl font-black text-[var(--helix-navy)]">Digibord Core</h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-[var(--helix-muted)]">
            Presenter V1a wordt hier opgebouwd als leeg digibord met pen, ruitjes, vormen en meetinstrumenten.
          </p>
        </div>
      </div>
    </section>
  );
}
