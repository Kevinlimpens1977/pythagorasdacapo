import {
  ArrowLeft,
  ArrowRight,
  CheckSquare,
  FileText,
  FilePlus2,
  Grid3X3,
  Highlighter,
  Maximize2,
  MousePointer2,
  PenLine,
  Plus,
  Redo2,
  Shapes,
  Trash2,
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
  { id: 'highlighter', label: 'Markeerstift', icon: Highlighter },
  { id: 'objects', label: 'Objecten', icon: Shapes },
  { id: 'lesson', label: 'Lesstof', icon: FileText },
  { id: 'background', label: 'Achtergrond', icon: Grid3X3 },
  { id: 'pages', label: "Pagina's", icon: CheckSquare }
];

const penColors = [
  { label: 'Zwart', value: '#111827' },
  { label: 'Blauw', value: '#2563eb' },
  { label: 'Rood', value: '#dc2626' },
  { label: 'Groen', value: '#16a34a' },
  { label: 'Oranje', value: '#ea580c' },
  { label: 'Paars', value: '#7c3aed' }
];

const penWidths = [
  { label: 'Dun', value: 3 },
  { label: 'Normaal', value: 6 },
  { label: 'Dik', value: 10 },
  { label: 'Extra dik', value: 16 }
];

const highlighterColors = [
  { label: 'Geel', value: '#facc15' },
  { label: 'Oranje', value: '#fb923c' },
  { label: 'Mint', value: '#5eead4' },
  { label: 'Roze', value: '#f9a8d4' },
  { label: 'Lavendel', value: '#c4b5fd' }
];

const highlighterWidths = [
  { label: 'Smal', value: 16 },
  { label: 'Normaal', value: 24 },
  { label: 'Breed', value: 32 }
];

const shellClass = 'border-[#6f4a87] bg-[#2b1838] text-[#fbf7ff]';
const panelClass = `rounded-lg border ${shellClass} shadow-xl`;
const idleButtonClass = 'border-[#6f4a87] bg-[#3a224b] text-[#fbf7ff] hover:bg-[#472b5b]';
const activeButtonClass = 'border-[#f4e8ff] bg-[#f4e8ff] text-[#24122f]';
const dividerClass = 'bg-[#6f4a87]';

const iconButtonClass =
  `inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border ${idleButtonClass} transition disabled:cursor-not-allowed disabled:opacity-40`;

const popoverButtonClass =
  'inline-flex min-h-12 shrink-0 items-center justify-center rounded-md border px-4 text-sm font-black transition';

export default function PresenterToolbar({
  pageLabel = 'Pagina 0/0',
  activeCategory = 'pen',
  open = false,
  pinned = false,
  background = { kind: 'white', gridSize: 96 },
  penStyle = { color: '#111827', width: 6 },
  onTogglePinned,
  onOpen,
  onAction,
  onCategory,
  onBackground,
  onPenStyle,
  onAddPage,
  onPrev,
  onNext,
  prevDisabled = false,
  nextDisabled = false,
  canUndo = false,
  canRedo = false,
  canClearPage = false,
  onUndo,
  onRedo,
  onClearPage,
  onSelect,
  onCreateObject,
  onInstrument,
  onOpenImport,
  onFullscreen
}) {
  const runAction = (action) => {
    action?.();
    onAction?.();
  };

  const handleCategory = (category) => {
    if (category.disabled) return;
    onCategory?.(category.id);
    onAction?.();
  };

  const currentGridSize = background?.gridSize || 96;
  const nextGridSize = currentGridSize === 96 ? 72 : 96;
  const backgroundKind = background?.kind || 'white';

  const handleBackground = (kind, gridSize = currentGridSize) => {
    onBackground?.({ kind, gridSize });
    onAction?.();
  };

  const handleGridSizeToggle = () => {
    const kind = backgroundKind === 'lines' ? 'lines' : 'grid';
    onBackground?.({ kind, gridSize: nextGridSize });
    onAction?.();
  };

  const penColor = penStyle?.color || '#111827';
  const penWidth = Number.isFinite(penStyle?.width) && penStyle.width > 0 ? penStyle.width : 6;
  const isHighlighter = activeCategory === 'highlighter';
  const drawingCategory = isHighlighter ? 'highlighter' : 'pen';
  const drawingColors = isHighlighter ? highlighterColors : penColors;
  const drawingWidths = isHighlighter ? highlighterWidths : penWidths;
  const drawingColorLabel = isHighlighter ? 'Markeerkleur' : 'Kleur';
  const drawingWidthLabel = isHighlighter ? 'Markeerdikte' : 'Dikte';
  const drawingToolLabel = isHighlighter ? 'Markeerstift' : 'Pen';
  const previewOpacity = isHighlighter ? 0.42 : 1;

  return (
    <div
      className={`group pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] transition-transform duration-200 ease-out sm:px-5 ${
        pinned || open ? 'translate-y-0' : 'translate-y-[calc(100%-3.75rem)] focus-within:translate-y-0'
      }`}
      onPointerEnter={onOpen}
    >
      <button
        type="button"
        className={`pointer-events-auto mx-auto mb-2 flex min-h-11 min-w-40 items-center justify-center rounded-md border px-4 text-sm font-black shadow-lg transition ${idleButtonClass}`}
        onClick={onTogglePinned}
        onPointerEnter={onOpen}
        onPointerDown={onOpen}
        aria-pressed={pinned}
      >
        {pinned ? 'Werkbalk vast' : 'Werkbalk openen'}
      </button>
      {activeCategory === 'pen' || activeCategory === 'highlighter' ? (
        <div className={`pointer-events-auto mx-auto mb-2 flex max-w-[min(56rem,calc(100vw-1.5rem))] flex-wrap items-center justify-center gap-3 p-3 ${panelClass}`} onPointerEnter={onOpen}>
          <div className="flex min-h-12 flex-wrap items-center justify-center gap-2">
            <span className="px-1 text-xs font-black uppercase tracking-[0.16em] text-[#d9c5e8]">{drawingColorLabel}</span>
            {drawingColors.map((color) => {
              const isActive = penColor === color.value;

              return (
                <button
                  key={color.value}
                  type="button"
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md border transition ${
                    isActive ? 'border-[#f4e8ff] bg-[#4d3161]' : idleButtonClass
                  }`}
                  onClick={() => runAction(() => onPenStyle?.({ id: drawingCategory, variant: drawingCategory, color: color.value }))}
                  aria-label={`${drawingToolLabel} kleur ${color.label}`}
                  aria-pressed={isActive}
                >
                  <span
                    className="block h-7 w-7 rounded-full ring-2 ring-[#2b1838]"
                    style={{ backgroundColor: color.value, opacity: previewOpacity }}
                  />
                </button>
              );
            })}
          </div>
          <div className={`min-h-12 w-px ${dividerClass} max-sm:hidden`} />
          <div className="flex min-h-12 flex-wrap items-center justify-center gap-2">
            <span className="px-1 text-xs font-black uppercase tracking-[0.16em] text-[#d9c5e8]">{drawingWidthLabel}</span>
            {drawingWidths.map((width) => {
              const isActive = penWidth === width.value;

              return (
                <button
                  key={width.value}
                  type="button"
                  className={`inline-flex min-h-12 min-w-20 shrink-0 items-center justify-center gap-2 rounded-md border px-3 text-sm font-black transition ${
                    isActive
                      ? activeButtonClass
                      : idleButtonClass
                  }`}
                  onClick={() => runAction(() => onPenStyle?.({ id: drawingCategory, variant: drawingCategory, width: width.value }))}
                  aria-label={`${drawingToolLabel} dikte ${width.label}`}
                  aria-pressed={isActive}
                >
                  <span className="flex h-7 w-7 items-center justify-center">
                    <span
                      className={isHighlighter ? 'block rounded-sm' : 'block rounded-full'}
                      style={{
                        backgroundColor: isActive ? '#24122f' : '#fbf7ff',
                        height: isHighlighter ? '8px' : `${Math.min(width.value, 16)}px`,
                        opacity: previewOpacity,
                        width: isHighlighter ? `${Math.min(width.value, 32)}px` : `${Math.min(width.value, 16)}px`
                      }}
                    />
                  </span>
                  <span>{width.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
      {activeCategory === 'background' ? (
        <div className={`pointer-events-auto mx-auto mb-2 flex max-w-[min(42rem,calc(100vw-1.5rem))] flex-wrap items-center justify-center gap-2 p-2 ${panelClass}`} onPointerEnter={onOpen}>
          <button
            type="button"
            className={`${popoverButtonClass} ${
              backgroundKind === 'white'
                ? activeButtonClass
                : idleButtonClass
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
                ? activeButtonClass
                : idleButtonClass
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
                ? activeButtonClass
                : idleButtonClass
            }`}
            onClick={() => handleBackground('grid')}
            aria-pressed={backgroundKind === 'grid'}
          >
            Ruitjes
          </button>
          <button
            type="button"
            className={`${popoverButtonClass} ${idleButtonClass}`}
            onClick={handleGridSizeToggle}
          >
            Ruitmaat {nextGridSize}
          </button>
        </div>
      ) : null}
      {activeCategory === 'objects' ? (
        <div className={`pointer-events-auto mx-auto mb-2 flex max-w-[min(64rem,calc(100vw-1.5rem))] flex-wrap items-stretch justify-center gap-3 p-2 ${panelClass}`} onPointerEnter={onOpen}>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {objectTypes.map((type) => (
              <button
                key={type}
                type="button"
                className={`${popoverButtonClass} ${idleButtonClass}`}
                onClick={() => runAction(() => onCreateObject?.(type))}
              >
                {getPresenterObjectLabel({ type })}
              </button>
            ))}
          </div>
          <div className={`min-h-12 w-px ${dividerClass} max-sm:hidden`} />
          <div className="flex flex-wrap items-center justify-center gap-2">
            {instrumentTypes.map((instrument) => (
              <button
                key={instrument.id}
                type="button"
                className={`${popoverButtonClass} border-[#f08a24] bg-[#5a341f] text-[#fff7ed] hover:bg-[#704020]`}
                onClick={() => runAction(() => onInstrument?.(instrument.id))}
              >
                {instrument.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {activeCategory === 'lesson' ? (
        <div className={`pointer-events-auto mx-auto mb-2 flex max-w-[min(36rem,calc(100vw-1.5rem))] flex-wrap items-center justify-center gap-2 p-2 ${panelClass}`} onPointerEnter={onOpen}>
          <button
            type="button"
            className={`${popoverButtonClass} gap-2 ${idleButtonClass}`}
            onClick={() => runAction(onOpenImport)}
          >
            <FilePlus2 size={18} strokeWidth={2.4} />
            Importeer uit CMS
          </button>
        </div>
      ) : null}
      <div className={`pointer-events-auto mx-auto flex w-fit max-w-[calc(100vw-1.5rem)] flex-wrap items-center justify-center gap-2 overflow-visible p-2 ${panelClass}`} onPointerEnter={onOpen}>
        <div className="flex shrink-0 flex-wrap items-center justify-center gap-1">
          <button
            type="button"
            className={iconButtonClass}
            onClick={() => runAction(onPrev)}
            disabled={prevDisabled}
            aria-label="Vorige pagina"
          >
            <ArrowLeft size={20} strokeWidth={2.4} />
          </button>
          <div className="min-w-24 max-w-32 px-2 text-center text-sm font-black text-[#fbf7ff]">{pageLabel}</div>
          <button
            type="button"
            className={iconButtonClass}
            onClick={() => runAction(onNext)}
            disabled={nextDisabled}
            aria-label="Volgende pagina"
          >
            <ArrowRight size={20} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            className={iconButtonClass}
            onClick={() => runAction(onAddPage)}
            aria-label="Nieuwe pagina"
          >
            <Plus size={20} strokeWidth={2.4} />
          </button>
        </div>

        <div className={`mx-1 h-9 w-px shrink-0 ${dividerClass} max-[720px]:hidden`} />

        <div className="flex shrink-0 flex-wrap items-center justify-center gap-1">
          <button type="button" className={iconButtonClass} onClick={() => runAction(onSelect)} aria-label="Selecteren">
            <MousePointer2 size={20} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            className={iconButtonClass}
            onClick={canUndo ? () => runAction(onUndo) : undefined}
            disabled={!canUndo}
            aria-label="Ongedaan maken"
          >
            <Undo2 size={20} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            className={iconButtonClass}
            onClick={canRedo ? () => runAction(onRedo) : undefined}
            disabled={!canRedo}
            aria-label="Opnieuw"
          >
            <Redo2 size={20} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            className={iconButtonClass}
            onClick={canClearPage ? () => runAction(onClearPage) : undefined}
            disabled={!canClearPage}
            aria-label="Huidige pagina leegmaken"
            title="Huidige pagina leegmaken"
          >
            <Trash2 size={20} strokeWidth={2.4} />
          </button>
        </div>

        <div className={`mx-1 h-9 w-px shrink-0 ${dividerClass} max-[720px]:hidden`} />

        <div className="flex min-w-0 flex-wrap items-center justify-center gap-1">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md border px-3 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-45 ${
                  isActive
                    ? activeButtonClass
                    : idleButtonClass
                }`}
                disabled={category.disabled}
                onClick={() => handleCategory(category)}
                aria-pressed={isActive}
              >
                <Icon size={19} strokeWidth={2.4} />
                <span className="max-w-24 truncate max-lg:hidden">{category.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-1 min-[920px]:ml-auto">
          <button
            type="button"
            className={`${iconButtonClass} ${pinned ? activeButtonClass : ''}`}
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
