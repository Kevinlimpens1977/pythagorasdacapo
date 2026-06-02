import {
  ArrowLeft,
  ArrowRight,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  CheckSquare,
  FileText,
  Grid3X3,
  Highlighter,
  Italic,
  Maximize2,
  MousePointer2,
  PenLine,
  Plus,
  Redo2,
  Shapes,
  Type,
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
  'angle',
  'ratioTableTool',
  'pythagorasTool'
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
  { id: 'text', label: 'Tekst', icon: Type },
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

const textColors = [
  { label: 'Zwart', value: '#111827' },
  { label: 'Blauw', value: '#2563eb' },
  { label: 'Rood', value: '#dc2626' },
  { label: 'Groen', value: '#16a34a' },
  { label: 'Paars', value: '#7c3aed' }
];

const textSizes = [
  { label: 'S', value: 36 },
  { label: 'M', value: 48 },
  { label: 'L', value: 64 },
  { label: 'XL', value: 84 }
];

const textFonts = [
  { label: 'HELIX', value: 'helix' },
  { label: 'Dyslexie', value: 'dyslexia' },
  { label: 'Handschrift', value: 'handwriting' }
];

const textAlignments = [
  { label: 'Links', value: 'left', icon: AlignLeft },
  { label: 'Midden', value: 'center', icon: AlignCenter },
  { label: 'Rechts', value: 'right', icon: AlignRight }
];

const mathSymbols = ['²', '√', 'π', '÷', '×', '≤', '≥'];

const shellClass =
  'border-[rgba(122,60,255,0.14)] bg-[linear-gradient(135deg,rgba(255,233,220,0.92),rgba(255,230,242,0.72),rgba(241,233,255,0.92))] text-[var(--helix-navy)] shadow-[0_16px_36px_rgba(122,60,255,0.11)]';
const panelClass = `rounded-xl border ${shellClass}`;
const idleButtonClass =
  'border-[rgba(255,255,255,0.78)] bg-white/70 text-[var(--helix-navy)] hover:border-white hover:bg-white hover:text-[var(--helix-purple)]';
const activeButtonClass =
  'border-white bg-white text-[var(--helix-purple)] shadow-[0_8px_18px_rgba(122,60,255,0.12)]';
const dividerClass = 'bg-[rgba(122,60,255,0.16)]';
const toolbarLabelClass = 'text-[var(--helix-purple)]';
const iconAccentClass = 'bg-[rgba(122,60,255,0.12)] text-[var(--helix-purple)]';

const iconButtonClass =
  `inline-flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg border text-[13px] font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${idleButtonClass}`;

const popoverButtonClass =
  'inline-flex min-h-[38px] shrink-0 items-center justify-center rounded-lg border px-3 py-2 text-[13px] font-bold transition';

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
  onCreateTextObject,
  onTextStyle,
  onTextSymbol,
  selectedTextStyle,
  hasSelectedTextObject = false,
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
    if (category.id === 'lesson') {
      runAction(onOpenImport);
      return;
    }
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
  const textStyle = selectedTextStyle || {};
  const activeTextStyle = {
    bold: Boolean(textStyle.bold),
    italic: Boolean(textStyle.italic),
    color: textStyle.color || '#111827',
    fontSize: Number.isFinite(textStyle.fontSize) && textStyle.fontSize > 0 ? textStyle.fontSize : 48,
    fontFamily: textStyle.fontFamily || 'helix',
    align: textStyle.align || 'left'
  };

  const handleTextStyle = (updates) => {
    onTextStyle?.(updates);
    onAction?.();
  };

  const handleTextSymbol = (symbol) => {
    onTextSymbol?.(symbol);
    onAction?.();
  };

  return (
    <div
      className={`group pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] transition-transform duration-200 ease-out sm:px-5 ${
        pinned || open ? 'translate-y-0' : 'translate-y-[calc(100%-3.75rem)] focus-within:translate-y-0'
      }`}
      onPointerEnter={onOpen}
    >
      <button
        type="button"
        className={`pointer-events-auto mx-auto mb-2 flex min-h-[38px] min-w-40 items-center justify-center rounded-lg border px-3.5 py-2 text-[13px] font-bold shadow-[0_10px_22px_rgba(122,60,255,0.12)] transition ${idleButtonClass}`}
        onClick={onTogglePinned}
        onPointerEnter={onOpen}
        onPointerDown={onOpen}
        aria-pressed={pinned}
      >
        {pinned ? 'Werkbalk vast' : 'Werkbalk openen'}
      </button>
      {activeCategory === 'pen' || activeCategory === 'highlighter' ? (
        <div className={`pointer-events-auto mx-auto mb-2 flex max-w-[min(56rem,calc(100vw-1.5rem))] flex-wrap items-center justify-center gap-2 p-2 ${panelClass}`} onPointerEnter={onOpen}>
          <div className="flex min-h-[38px] flex-wrap items-center justify-center gap-1.5">
            <span className={`px-1 text-[12px] font-black uppercase tracking-[0.14em] ${toolbarLabelClass}`}>{drawingColorLabel}</span>
            {drawingColors.map((color) => {
              const isActive = penColor === color.value;

              return (
                <button
                  key={color.value}
                  type="button"
                  className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg border transition ${
                    isActive ? activeButtonClass : idleButtonClass
                  }`}
                  onClick={() => runAction(() => onPenStyle?.({ id: drawingCategory, variant: drawingCategory, color: color.value }))}
                  aria-label={`${drawingToolLabel} kleur ${color.label}`}
                  aria-pressed={isActive}
                >
                  <span
                    className="block h-5 w-5 rounded-full ring-2 ring-white/80"
                    style={{ backgroundColor: color.value, opacity: previewOpacity }}
                  />
                </button>
              );
            })}
          </div>
          <div className={`min-h-[38px] w-px ${dividerClass} max-sm:hidden`} />
          <div className="flex min-h-[38px] flex-wrap items-center justify-center gap-1.5">
            <span className={`px-1 text-[12px] font-black uppercase tracking-[0.14em] ${toolbarLabelClass}`}>{drawingWidthLabel}</span>
            {drawingWidths.map((width) => {
              const isActive = penWidth === width.value;

              return (
                <button
                  key={width.value}
                  type="button"
                  className={`inline-flex min-h-[38px] min-w-16 shrink-0 items-center justify-center gap-1.5 rounded-lg border px-3 text-[13px] font-bold transition ${
                    isActive
                      ? activeButtonClass
                      : idleButtonClass
                  }`}
                  onClick={() => runAction(() => onPenStyle?.({ id: drawingCategory, variant: drawingCategory, width: width.value }))}
                  aria-label={`${drawingToolLabel} dikte ${width.label}`}
                  aria-pressed={isActive}
                >
                  <span className={`flex h-5 w-5 items-center justify-center rounded-md ${iconAccentClass}`}>
                    <span
                      className={isHighlighter ? 'block rounded-sm' : 'block rounded-full'}
                      style={{
                        backgroundColor: isActive ? '#7a3cff' : '#0b132b',
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
        <div className={`pointer-events-auto mx-auto mb-2 flex max-w-[min(42rem,calc(100vw-1.5rem))] flex-wrap items-center justify-center gap-1.5 p-2 ${panelClass}`} onPointerEnter={onOpen}>
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
      {activeCategory === 'text' ? (
        <div className={`pointer-events-auto mx-auto mb-2 flex max-w-[min(72rem,calc(100vw-1.5rem))] flex-wrap items-center justify-center gap-2 p-2 ${panelClass}`} onPointerEnter={onOpen}>
          <button
            type="button"
            className={`${popoverButtonClass} gap-2 ${idleButtonClass}`}
            onClick={() => runAction(onCreateTextObject)}
          >
            <Type size={16} strokeWidth={2.4} />
            Tekstvak
          </button>
          <div className={`min-h-[38px] w-px ${dividerClass} max-sm:hidden`} />
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <button
              type="button"
              className={`inline-flex h-[38px] w-[38px] items-center justify-center rounded-lg border transition ${activeTextStyle.bold ? activeButtonClass : idleButtonClass}`}
              onClick={() => handleTextStyle({ bold: !activeTextStyle.bold })}
              aria-label="Vet"
              aria-pressed={activeTextStyle.bold}
            >
              <Bold size={17} strokeWidth={2.8} />
            </button>
            <button
              type="button"
              className={`inline-flex h-[38px] w-[38px] items-center justify-center rounded-lg border transition ${activeTextStyle.italic ? activeButtonClass : idleButtonClass}`}
              onClick={() => handleTextStyle({ italic: !activeTextStyle.italic })}
              aria-label="Cursief"
              aria-pressed={activeTextStyle.italic}
            >
              <Italic size={17} strokeWidth={2.8} />
            </button>
            {textAlignments.map((alignment) => {
              const Icon = alignment.icon;
              const isActive = activeTextStyle.align === alignment.value;

              return (
                <button
                  key={alignment.value}
                  type="button"
                  className={`inline-flex h-[38px] w-[38px] items-center justify-center rounded-lg border transition ${isActive ? activeButtonClass : idleButtonClass}`}
                  onClick={() => handleTextStyle({ align: alignment.value })}
                  aria-label={`Uitlijnen ${alignment.label}`}
                  aria-pressed={isActive}
                >
                  <Icon size={17} strokeWidth={2.6} />
                </button>
              );
            })}
          </div>
          <div className={`min-h-[38px] w-px ${dividerClass} max-sm:hidden`} />
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {textColors.map((color) => {
              const isActive = activeTextStyle.color === color.value;

              return (
                <button
                  key={color.value}
                  type="button"
                  className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg border transition ${
                    isActive ? activeButtonClass : idleButtonClass
                  }`}
                  onClick={() => handleTextStyle({ color: color.value })}
                  aria-label={`Tekstkleur ${color.label}`}
                  aria-pressed={isActive}
                >
                  <span className="block h-5 w-5 rounded-full ring-2 ring-white/80" style={{ backgroundColor: color.value }} />
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {textSizes.map((size) => (
              <button
                key={size.value}
                type="button"
                className={`${popoverButtonClass} ${activeTextStyle.fontSize === size.value ? activeButtonClass : idleButtonClass}`}
                onClick={() => handleTextStyle({ fontSize: size.value })}
                aria-pressed={activeTextStyle.fontSize === size.value}
              >
                {size.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {textFonts.map((font) => (
              <button
                key={font.value}
                type="button"
                className={`${popoverButtonClass} ${activeTextStyle.fontFamily === font.value ? activeButtonClass : idleButtonClass}`}
                onClick={() => handleTextStyle({ fontFamily: font.value })}
                aria-pressed={activeTextStyle.fontFamily === font.value}
              >
                {font.label}
              </button>
            ))}
          </div>
          <div className={`min-h-[38px] w-px ${dividerClass} max-sm:hidden`} />
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {mathSymbols.map((symbol) => (
              <button
                key={symbol}
                type="button"
                className={`${popoverButtonClass} min-w-10 ${hasSelectedTextObject ? idleButtonClass : activeButtonClass}`}
                onClick={() => handleTextSymbol(symbol)}
                aria-label={`Wiskundesymbool ${symbol}`}
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {activeCategory === 'objects' ? (
        <div className={`pointer-events-auto mx-auto mb-2 flex max-w-[min(64rem,calc(100vw-1.5rem))] flex-wrap items-stretch justify-center gap-2 p-2 ${panelClass}`} onPointerEnter={onOpen}>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
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
          <div className={`min-h-[38px] w-px ${dividerClass} max-sm:hidden`} />
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {instrumentTypes.map((instrument) => (
              <button
                key={instrument.id}
                type="button"
                className={`${popoverButtonClass} border-[rgba(255,122,0,0.28)] bg-white/70 text-orange-700 hover:border-white hover:bg-white hover:text-[var(--helix-purple)]`}
                onClick={() => runAction(() => onInstrument?.(instrument.id))}
              >
                {instrument.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <div className={`pointer-events-auto mx-auto flex w-fit max-w-[calc(100vw-1.5rem)] flex-wrap items-center justify-center gap-1.5 overflow-visible p-2 ${panelClass}`} onPointerEnter={onOpen}>
        <div className="flex shrink-0 flex-wrap items-center justify-center gap-1">
          <button
            type="button"
            className={iconButtonClass}
            onClick={() => runAction(onPrev)}
            disabled={prevDisabled}
            aria-label="Vorige pagina"
          >
            <ArrowLeft size={17} strokeWidth={2.4} />
          </button>
          <div className="min-w-24 max-w-32 px-2 text-center text-[13px] font-black text-[var(--helix-navy)]">{pageLabel}</div>
          <button
            type="button"
            className={iconButtonClass}
            onClick={() => runAction(onNext)}
            disabled={nextDisabled}
            aria-label="Volgende pagina"
          >
            <ArrowRight size={17} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            className={iconButtonClass}
            onClick={() => runAction(onAddPage)}
            aria-label="Nieuwe pagina"
          >
            <Plus size={17} strokeWidth={2.4} />
          </button>
        </div>

        <div className={`mx-1 h-[34px] w-px shrink-0 ${dividerClass} max-[720px]:hidden`} />

        <div className="flex shrink-0 flex-wrap items-center justify-center gap-1">
          <button type="button" className={iconButtonClass} onClick={() => runAction(onSelect)} aria-label="Selecteren">
            <MousePointer2 size={17} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            className={iconButtonClass}
            onClick={canUndo ? () => runAction(onUndo) : undefined}
            disabled={!canUndo}
            aria-label="Ongedaan maken"
          >
            <Undo2 size={17} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            className={iconButtonClass}
            onClick={canRedo ? () => runAction(onRedo) : undefined}
            disabled={!canRedo}
            aria-label="Opnieuw"
          >
            <Redo2 size={17} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            className={iconButtonClass}
            onClick={canClearPage ? () => runAction(onClearPage) : undefined}
            disabled={!canClearPage}
            aria-label="Huidige pagina leegmaken"
            title="Huidige pagina leegmaken"
          >
            <Trash2 size={17} strokeWidth={2.4} />
          </button>
        </div>

        <div className={`mx-1 h-[34px] w-px shrink-0 ${dividerClass} max-[720px]:hidden`} />

        <div className="flex min-w-0 flex-wrap items-center justify-center gap-1">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                className={`inline-flex h-[38px] shrink-0 items-center justify-center gap-1.5 rounded-lg border px-3 text-[13px] font-bold transition disabled:cursor-not-allowed disabled:opacity-45 ${
                  isActive
                    ? activeButtonClass
                    : idleButtonClass
                }`}
                disabled={category.disabled}
                onClick={() => handleCategory(category)}
                aria-pressed={isActive}
              >
                <Icon size={17} strokeWidth={2.4} />
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
            <CheckSquare size={17} strokeWidth={2.4} />
          </button>
          <button type="button" className={iconButtonClass} onClick={onFullscreen} aria-label="Volledig scherm">
            <Maximize2 size={17} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </div>
  );
}
