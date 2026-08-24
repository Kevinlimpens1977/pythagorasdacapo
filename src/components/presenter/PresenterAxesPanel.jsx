import { useState } from 'react';
import { AXES_LABEL_MAX_LENGTH, getAxesPanelPosition, validateAxesRange } from '../../lib/presenterAxes';

// ---------------------------------------------------------------------------
// Bewerkpaneel van het assenstelsel: het bereik per as en de naam per as.
//
// Het hangt aan de selectie en niet in een zijkolom, want een docent staat vóór
// het bord: op een digibord van 86 inch is heen en weer lopen naar een zijpaneel
// letterlijk meters. Om dezelfde reden als bij het gradenveldje van de
// geodriehoek is dit bewust een DOM-overlay en géén foreignObject in de
// object-SVG: die zou met het object mee schalen en verschuiven.
//
// De velden zijn echte <input>-elementen. De sneltoetsen van de shell laten
// invoervelden met rust (isEditableShortcutTarget) en elke toetsaanslag wordt
// hier bovendien gestopt, zodat Backspace nooit het geselecteerde object wist
// terwijl er een bereik wordt ingetypt.
// ---------------------------------------------------------------------------

const stopBoardPointer = (event) => {
  event.stopPropagation();
};

const fieldClass = (invalid) =>
  `h-12 w-full rounded-xl border-2 bg-white px-2 text-center text-xl font-black shadow-sm outline-none ${
    invalid ? 'border-red-500 text-red-700' : 'border-blue-600 text-slate-900'
  }`;

const labelClass = 'text-[11px] font-black uppercase tracking-[0.12em] text-slate-500';

const getDraft = (object) => ({
  xMin: String(object?.range?.xMin ?? ''),
  xMax: String(object?.range?.xMax ?? ''),
  yMin: String(object?.range?.yMin ?? ''),
  yMax: String(object?.range?.yMax ?? ''),
  labelX: String(object?.labels?.x ?? ''),
  labelY: String(object?.labels?.y ?? '')
});

const getSignature = (object) =>
  [
    object?.id,
    object?.range?.xMin,
    object?.range?.xMax,
    object?.range?.yMin,
    object?.range?.yMax,
    object?.labels?.x,
    object?.labels?.y
  ].join('|');

export default function PresenterAxesPanel({
  object,
  bounds,
  scale = 1,
  boardWidth = 1920,
  boardHeight = 1400,
  showGridSuggestion = false,
  onApplyRange,
  onApplyLabels,
  onEnableGrid,
  onDismissGridSuggestion,
  onClose
}) {
  const signature = getSignature(object);
  const [seed, setSeed] = useState(signature);
  const [draft, setDraft] = useState(() => getDraft(object));
  const [errors, setErrors] = useState({});

  // Het object is buiten dit paneel om veranderd (bereik toegepast, versleept,
  // ongedaan gemaakt): de velden lopen weer mee. Bewust tijdens het renderen en
  // niet in een effect, zodat er geen extra tekenronde met oude waarden is.
  if (seed !== signature) {
    setSeed(signature);
    setDraft(getDraft(object));
    setErrors({});
  }

  const position = getAxesPanelPosition({ bounds, scale, boardWidth, boardHeight });

  const setField = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const commitRange = () => {
    const result = validateAxesRange({
      xMin: draft.xMin,
      xMax: draft.xMax,
      yMin: draft.yMin,
      yMax: draft.yMax
    });

    setErrors(result.errors);
    if (!result.valid) return false;

    onApplyRange?.(result.range);
    return true;
  };

  const commitLabels = () => {
    onApplyLabels?.({ x: draft.labelX, y: draft.labelY });
  };

  const handleRangeKeyDown = (event) => {
    // Nooit doorlaten naar de sneltoetsen van het bord.
    event.stopPropagation();

    if (event.key === 'Enter') {
      event.preventDefault();
      if (commitRange()) event.currentTarget.blur();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setDraft(getDraft(object));
      setErrors({});
      event.currentTarget.blur();
    }
  };

  const handleLabelKeyDown = (event) => {
    event.stopPropagation();

    if (event.key === 'Enter') {
      event.preventDefault();
      commitLabels();
      event.currentTarget.blur();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setDraft(getDraft(object));
      event.currentTarget.blur();
    }
  };

  const renderBoundField = (key, label, ariaLabel) => (
    <label className="flex flex-1 flex-col gap-1">
      <span className={labelClass}>{label}</span>
      <input
        aria-invalid={Boolean(errors[key])}
        aria-label={ariaLabel}
        autoComplete="off"
        className={fieldClass(Boolean(errors[key]))}
        inputMode="numeric"
        onBlur={commitRange}
        onChange={(event) => setField(key, event.target.value)}
        onKeyDown={handleRangeKeyDown}
        type="text"
        value={draft[key]}
      />
    </label>
  );

  const message = errors.xMin || errors.xMax || errors.yMin || errors.yMax || null;

  return (
    <div className="absolute inset-0 z-40" style={{ pointerEvents: 'none' }}>
      <div
        aria-label="Bereik en asnamen van het assenstelsel"
        className="absolute flex flex-col gap-3 rounded-2xl border-2 border-blue-700 bg-white/97 p-3 shadow-2xl"
        onPointerDown={stopBoardPointer}
        role="group"
        style={{ left: `${position.left}px`, top: `${position.top}px`, width: `${position.width}px`, pointerEvents: 'auto' }}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-black text-slate-900">Assenstelsel</span>
          <button
            aria-label="Bewerkpaneel sluiten"
            className="h-11 rounded-xl border-2 border-blue-700 bg-white px-3 text-sm font-black text-blue-800"
            onClick={onClose}
            type="button"
          >
            Klaar
          </button>
        </div>

        <div className="flex items-end gap-2">
          <span className="pb-3 text-lg font-black italic text-slate-900">x</span>
          {renderBoundField('xMin', 'van', 'Kleinste getal op de x-as')}
          {renderBoundField('xMax', 'tot', 'Grootste getal op de x-as')}
        </div>
        <div className="flex items-end gap-2">
          <span className="pb-3 text-lg font-black italic text-slate-900">y</span>
          {renderBoundField('yMin', 'van', 'Kleinste getal op de y-as')}
          {renderBoundField('yMax', 'tot', 'Grootste getal op de y-as')}
        </div>

        {message ? (
          <p className="rounded-lg bg-red-50 px-2 py-1.5 text-sm font-bold text-red-700" role="status">
            {message}
          </p>
        ) : null}

        <div className="flex gap-2">
          <label className="flex flex-1 flex-col gap-1">
            <span className={labelClass}>naam x-as</span>
            <input
              aria-label="Naam van de x-as"
              autoComplete="off"
              className={fieldClass(false)}
              maxLength={AXES_LABEL_MAX_LENGTH}
              onBlur={commitLabels}
              onChange={(event) => setField('labelX', event.target.value)}
              onKeyDown={handleLabelKeyDown}
              placeholder="t (s)"
              type="text"
              value={draft.labelX}
            />
          </label>
          <label className="flex flex-1 flex-col gap-1">
            <span className={labelClass}>naam y-as</span>
            <input
              aria-label="Naam van de y-as"
              autoComplete="off"
              className={fieldClass(false)}
              maxLength={AXES_LABEL_MAX_LENGTH}
              onBlur={commitLabels}
              onChange={(event) => setField('labelY', event.target.value)}
              onKeyDown={handleLabelKeyDown}
              placeholder="s (m)"
              type="text"
              value={draft.labelY}
            />
          </label>
        </div>

        {/* Aanbieden, niet afdwingen: geen venster dat de les onderbreekt, maar
            één regel in het paneel dat toch al openstaat. Niet aanklikken is
            wegklikken. */}
        {showGridSuggestion ? (
          <div className="flex items-center justify-between gap-2 rounded-xl bg-amber-50 px-2 py-2">
            <span className="text-sm font-bold text-amber-900">Deze pagina heeft geen ruitjes.</span>
            <div className="flex gap-1">
              <button
                className="h-11 rounded-xl border-2 border-amber-600 bg-white px-3 text-sm font-black text-amber-900"
                onClick={onEnableGrid}
                type="button"
              >
                Ruitjes aan
              </button>
              <button
                aria-label="Ruitjesvoorstel wegklikken"
                className="h-11 w-11 rounded-xl border-2 border-amber-300 bg-white text-sm font-black text-amber-900"
                onClick={onDismissGridSuggestion}
                type="button"
              >
                ✕
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
