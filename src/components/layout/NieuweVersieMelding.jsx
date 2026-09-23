import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { entryUitHtml, isNieuweVersie } from '../../lib/appVersie';

const INTERVAL_MS = 5 * 60 * 1000;

function huidigeEntry() {
  if (typeof document === 'undefined') return null;
  const script = [...document.querySelectorAll('script[type="module"][src]')]
    .map((el) => new URL(el.src, window.location.origin).pathname)
    .find((pad) => entryUitHtml(pad));
  return script || null;
}

// Toont een balk zodra er na het openen van dit tabblad gedeployd is.
export default function NieuweVersieMelding() {
  const [nieuw, setNieuw] = useState(false);

  useEffect(() => {
    const huidig = huidigeEntry();
    if (!huidig) return undefined; // dev-server: geen gehashte build

    let gestopt = false;
    const controleer = async () => {
      try {
        const antwoord = await fetch('/', { cache: 'no-store' });
        const live = entryUitHtml(await antwoord.text());
        if (!gestopt && isNieuweVersie(huidig, live)) setNieuw(true);
      } catch {
        // offline of haperend netwerk: volgende keer opnieuw
      }
    };
    const bijTerugkomen = () => {
      if (document.visibilityState === 'visible') controleer();
    };

    const id = window.setInterval(controleer, INTERVAL_MS);
    document.addEventListener('visibilitychange', bijTerugkomen);
    return () => {
      gestopt = true;
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', bijTerugkomen);
    };
  }, []);

  if (!nieuw) return null;

  return (
    <div role="status" className="fixed inset-x-0 bottom-4 z-[1000] mx-auto flex w-[min(92vw,560px)] items-center justify-between gap-3 rounded-2xl border-[3px] border-[#0B0D0F] bg-[#FFD33D] px-4 py-3 text-[#0B0D0F] shadow-[4px_4px_0_#0B0D0F]">
      <p className="font-bold">Er is een nieuwe versie van HELIX.</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border-[2.5px] border-[#0B0D0F] bg-white px-4 font-extrabold"
      >
        <RefreshCw size={18} aria-hidden="true" />
        Vernieuwen
      </button>
    </div>
  );
}
