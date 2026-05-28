import {
  ArrowLeft,
  ArrowRight,
  CheckSquare,
  FileText,
  Grid3X3,
  Maximize2,
  MousePointer2,
  PenLine,
  Redo2,
  Shapes,
  Undo2
} from 'lucide-react';
import { getPresenterObjectLabel } from '../../lib/presenterObjects';

const objectTypes = [
  'rectangle',
  'ellipse',
  'line',
  'arrow',
  'triangle',
  'polygon',
  'axes',
  'table',
  'angle'
];

const instrumentTypes = [
  { id: 'ruler', label: 'Liniaal' },
  { id: 'triangle', label: 'Geodriehoek' },
  { id: 'compass', label: 'Passer' },
  { id: 'protractor', label: 'Gradenboog' }
];

const categories = [
  { id: 'pen', label: 'Pen', icon: PenLine },
  { id: 'objects', label: 'Objecten', icon: Shapes },
  { id: 'lesson', label: 'Lesstof', icon: FileText, disabled: true },
  { id: 'background', label: 'Achtergrond', icon: Grid3X3 },
  { id: 'pages', label: "Pagina's", icon: CheckSquare }
];

const iconButtonClass =
  'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-slate-700 bg-slate-900 text-slate-100 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40';

const popoverButtonClass =
  'inline-flex min-h-12 shrink-0 items-center justify-center rounded-md border px-4 text-sm font-black transition';

export default function PresenterToolbar({
  pageLabel = 'Pagina 0/0',
  activeCategory = 'pen',
  pinned = false,
  background = { kind: 'white', gridSize: 96 },
  onTogglePinned,
  onCategory,
  onBackground,
  onPrev,
  onNext,
  prevDisabled = false,
  nextDisabled = false,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onSelect,
  onCreateObject,
  onInstrument,
  onFullscreen
}) {
  const handleCategory = (category) => {
    if (category.disabled) return;
    onCategory?.(category.id);
  };

  const currentGridSize = background?.gridSize || 96;
  const nextGridSize = currentGridSize === 96 ? 72 : 96;
  const backgroundKind = background?.kind || 'white';

  const handleBackground = (kind, gridSize = currentGridSize) => {
    onBackground?.({ kind, gridSize });
  };

  const handleGridSizeToggle = () => {
    const kind = backgroundKind === 'lines' ? 'lines' : 'grid';
    onBackground?.({ kind, gridSize: nextGridSize });
  };

  return (
    <div
      className={`group pointer-events-none absolute inset-x-0 bottom-0 z-30 px-3 pb-3 transition-transform duration-200 ease-out sm:px-5 ${
        pinned ? 'translate-y-0' : 'translate-y-[calc(100%-3.75rem)] hover:translate-y-0 focus-within:translate-y-0'
      }`}
    >
      <button
        type="button"
        className="pointer-events-auto mx-auto mb-2 flex min-h-11 min-w-40 items-center justify-center rounded-md border border-slate-700 bg-slate-950 px-4 text-sm font-black text-slate-50 shadow-lg transition hover:bg-slate-800"
        onClick={onTogglePinned}
        aria-pressed={pinned}
      >
        {pinned ? 'Werkbalk vast' : 'Werkbalk openen'}
      </button>
      {activeCategory === 'background' ? (
        <div className="pointer-events-auto mx-auto mb-2 flex max-w-2xl flex-wrap items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-950/95 p-2 text-slate-50 shadow-xl">
          <button
            type="button"
            className={`${popoverButtonClass} ${
              backgroundKind === 'white'
                ? 'border-slate-50 bg-slate-50 text-slate-950'
                : 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800'
            }`}
            onClick={() => handleBackground('white')}
            aria-pressed={backgroundKind === 'white'}
          >
            Wit
          </button>
          <button
            type="button"
            className={`${popoverButtonClass} ${
              backgroundKind === 'lines'
                ? 'border-slate-50 bg-slate-50 text-slate-950'
                : 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800'
            }`}
            onClick={() => handleBackground('lines')}
            aria-pressed={backgroundKind === 'lines'}
          >
            Lijntjes
          </button>
          <button
            type="button"
            className={`${popoverButtonClass} ${
              backgroundKind === 'grid'
                ? 'border-slate-50 bg-slate-50 text-slate-950'
                : 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800'
            }`}
            onClick={() => handleBackground('grid')}
            aria-pressed={backgroundKind === 'grid'}
          >
            Ruitjes
          </button>
          <button
            type="button"
            className={`${popoverButtonClass} border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800`}
            onClick={handleGridSizeToggle}
          >
            Ruitmaat {nextGridSize}
          </button>
        </div>
      ) : null}
      {activeCategory === 'objects' ? (
        <div className="pointer-events-auto mx-auto mb-2 flex max-w-4xl flex-wrap items-stretch justify-center gap-3 rounded-lg border border-slate-700 bg-slate-950/95 p-2 text-slate-50 shadow-xl">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {objectTypes.map((type) => (
              <button
                key={type}
                type="button"
                className={`${popoverButtonClass} border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800`}
                onClick={() => onCreateObject?.(type)}
              >
                {getPresenterObjectLabel({ type })}
              </button>
            ))}
          </div>
          <div className="min-h-12 w-px bg-slate-700 max-sm:hidden" />
          <div className="flex flex-wrap items-center justify-center gap-2">
            {instrumentTypes.map((instrument) => (
              <button
                key={instrument.id}
                type="button"
                className={`${popoverButtonClass} border-sky-400/70 bg-sky-950 text-sky-50 hover:bg-sky-900`}
                onClick={() => onInstrument?.(instrument.id)}
              >
                {instrument.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <div className="pointer-events-auto mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto rounded-lg border border-slate-700 bg-slate-950/95 p-2 text-slate-50 shadow-xl">
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            className={iconButtonClass}
            onClick={onPrev}
            disabled={prevDisabled}
            aria-label="Vorige pagina"
          >
            <ArrowLeft size={20} strokeWidth={2.4} />
          </button>
          <div className="min-w-28 px-2 text-center text-sm font-black text-slate-100">{pageLabel}</div>
          <button
            type="button"
            className={iconButtonClass}
            onClick={onNext}
            disabled={nextDisabled}
            aria-label="Volgende pagina"
          >
            <ArrowRight size={20} strokeWidth={2.4} />
          </button>
        </div>

        <div className="mx-1 h-9 w-px shrink-0 bg-slate-700" />

        <div className="flex shrink-0 items-center gap-1">
          <button type="button" className={iconButtonClass} onClick={onSelect} aria-label="Selecteren">
            <MousePointer2 size={20} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            className={iconButtonClass}
            onClick={canUndo ? onUndo : undefined}
            disabled={!canUndo}
            aria-label="Ongedaan maken"
          >
            <Undo2 size={20} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            className={iconButtonClass}
            onClick={canRedo ? onRedo : undefined}
            disabled={!canRedo}
            aria-label="Opnieuw"
          >
            <Redo2 size={20} strokeWidth={2.4} />
          </button>
        </div>

        <div className="mx-1 h-9 w-px shrink-0 bg-slate-700" />

        <div className="flex shrink-0 items-center gap-1">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md border px-3 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-45 ${
                  isActive
                    ? 'border-slate-50 bg-slate-50 text-slate-950'
                    : 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800'
                }`}
                disabled={category.disabled}
                onClick={() => handleCategory(category)}
                aria-pressed={isActive}
              >
                <Icon size={19} strokeWidth={2.4} />
                <span className="max-w-24 truncate">{category.label}</span>
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1">
          <button
            type="button"
            className={`${iconButtonClass} ${pinned ? 'bg-slate-50 text-slate-950 hover:bg-slate-200' : ''}`}
            onClick={onTogglePinned}
            aria-pressed={pinned}
            aria-label={pinned ? 'Werkbalk losmaken' : 'Werkbalk vastzetten'}
          >
            <CheckSquare size={20} strokeWidth={2.4} />
          </button>
          <button type="button" className={iconButtonClass} onClick={onFullscreen} aria-label="Volledig scherm">
            <Maximize2 size={20} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </div>
  );
}
