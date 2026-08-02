import { useState } from 'react';
import { ASSET_BASE_PATH } from './zoektochtConfig';

// Zoekplaat met onzichtbare hotspots: alle objecten zitten ín de achtergrondafbeelding;
// per object ligt er een transparante klikzone (button) op de juiste plek.
export default function SceneStage({
  level,
  gevondenIds,
  onObjectKlik,
  onMisklik,
  hintObjectId,
  gepauzeerd,
  interactief
}) {
  const [achtergrondMislukt, setAchtergrondMislukt] = useState(false);

  return (
    <div
      className="relative w-full select-none overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      style={{ aspectRatio: '16 / 9' }}
      onClick={() => {
        if (interactief && !gepauzeerd) onMisklik?.();
      }}
    >
      {!achtergrondMislukt ? (
        <img
          src={`${ASSET_BASE_PATH}/${level.achtergrond}`}
          alt={`Zoekplaat: ${level.titel}`}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
          onError={() => setAchtergrondMislukt(true)}
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${level.fallbackKleur}`}>
          <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-sm font-black text-slate-500">
            Zoekplaat kon niet laden. Herlaad de pagina.
          </p>
        </div>
      )}

      {level.objecten.map((object) => {
        const gevonden = gevondenIds.includes(object.id);
        const isHint = hintObjectId === object.id;

        return (
          <button
            key={`${level.id}-${object.id}`}
            type="button"
            aria-label={object.ariaLabel}
            disabled={!interactief || gepauzeerd || gevonden}
            onClick={(event) => {
              event.stopPropagation();
              if (interactief && !gepauzeerd && !gevonden) onObjectKlik?.(object.id);
            }}
            className={`absolute rounded-full border-0 bg-transparent p-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 ${
              gevonden ? 'pointer-events-none' : 'cursor-pointer'
            }`}
            style={{
              left: `${object.x}%`,
              top: `${object.y}%`,
              width: `${object.breedte + 2}%`,
              height: `${object.hoogte + 3}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {gevonden && (
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full border-4 border-emerald-500/90 bg-emerald-100/25">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-sm font-black text-white shadow">
                  ✓
                </span>
              </span>
            )}
            {isHint && (
              <span className="pointer-events-none absolute -inset-6 animate-ping rounded-full border-4 border-amber-400/80" />
            )}
          </button>
        );
      })}

      {gepauzeerd && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <p className="rounded-2xl bg-white px-6 py-4 text-lg font-black text-slate-800 shadow">⏸️ Gepauzeerd</p>
        </div>
      )}
    </div>
  );
}
