import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Axis3d,
  Bold,
  Circle,
  Compass,
  Eraser,
  FileText,
  Gauge,
  Grid3X3,
  Hand,
  Highlighter,
  Italic,
  Layers,
  Lightbulb,
  Maximize2,
  Minus,
  Moon,
  MoreHorizontal,
  MousePointer2,
  MoveHorizontal,
  MoveRight,
  Palette,
  Pentagon,
  PenLine,
  Pin,
  Plus,
  Radius,
  Ratio,
  Redo2,
  Rows2,
  Ruler,
  Shapes,
  Sigma,
  Spline,
  Square,
  Table,
  Target,
  Timer,
  Triangle,
  TriangleRight,
  Type,
  Trash2,
  Undo2,
  Users,
  Wand2,
  X
} from 'lucide-react';
import { PRESENTER_ERASER_SIZES } from '../../lib/presenterEraser';
import { SPOTLIGHT_RADII } from '../../lib/presenterFocus';
import { getPresenterObjectLabel } from '../../lib/presenterObjects';

// Werkbalk in de vorm die een digibord vraagt: ÉÉN lage rij iconen die altijd
// staat, met daarboven een zwevend paneel dat alleen opengaat als je het vraagt.
// Het paneel duwt de balk niet omhoog en dekt dus veel minder bord af dan de
// vroegere stapel van handgreep + paneelstrook + brede knoppenbalk.
//
// Bediening zoals op een Prowise-bord:
//   - een ander gereedschap aantikken = dat gereedschap pakken (één tik);
//   - het AL ACTIEVE gereedschap nog eens aantikken = zijn paneel openen;
//   - het paneel blijft staan tot je het sluit of het bord aanraakt, zodat
//     kleur én dikte achter elkaar te kiezen zijn zonder opnieuw te openen.

const objectTypes = [
  { id: 'rectangle', icon: Square },
  { id: 'ellipse', icon: Circle },
  { id: 'line', icon: Minus },
  { id: 'arrow', icon: MoveRight },
  { id: 'triangle', icon: Triangle },
  { id: 'polygon', icon: Pentagon },
  { id: 'axes', icon: Axis3d },
  { id: 'table', icon: Table },
  { id: 'angle', icon: Radius },
  { id: 'ratioTableTool', icon: Ratio },
  { id: 'pythagorasTool', icon: Sigma }
];

const instrumentTypes = [
  { id: 'ruler', label: 'Liniaal', icon: Ruler },
  { id: 'triangle', label: 'Geodriehoek', icon: TriangleRight },
  { id: 'compass', label: 'Passer', icon: Compass },
  { id: 'protractor', label: 'Gradenboog', icon: Gauge }
];

// Gereedschappen staan in het midden van de balk, net als bij Prowise.
const toolCategories = [
  { id: 'select', label: 'Selecteren', icon: MousePointer2, hint: 'Selecteren (Esc)' },
  { id: 'pen', label: 'Pen', icon: PenLine, hint: 'Pen — nogmaals tikken voor kleur en dikte' },
  { id: 'highlighter', label: 'Markeerstift', icon: Highlighter, hint: 'Markeerstift — nogmaals tikken voor kleur en dikte' },
  { id: 'eraser', label: 'Gum', icon: Eraser, hint: 'Gum — nogmaals tikken voor de gumgrootte' },
  { id: 'text', label: 'Tekst', icon: Type, hint: 'Tekst' },
  { id: 'objects', label: 'Objecten', icon: Shapes, hint: 'Vormen, tabellen en meetinstrumenten' },
  { id: 'focus', label: 'Focus', icon: Lightbulb, hint: 'Spotlight, gordijn, laser, timer' }
];

// Bestands- en pagina-acties staan links, gescheiden van het gereedschap.
const fileCategories = [
  { id: 'lesson', label: 'Lesstof', icon: FileText, hint: 'Lesstof uit HELIX importeren' },
  { id: 'pages', label: "Pagina's", icon: Layers, hint: "Pagina-overzicht" }
];

// Categorieën met een eigen paneel boven de balk.
const PANEL_CATEGORIES = new Set(['pen', 'highlighter', 'eraser', 'text', 'objects', 'focus', 'background']);
// Tekengereedschap: eerste tik pakt het, tweede tik opent het paneel.
const DRAWING_CATEGORIES = new Set(['pen', 'highlighter', 'eraser']);

const penColors = [
  { label: 'Zwart', value: '#0B0D0F' },
  { label: 'Blauw', value: '#087EB5' },
  { label: 'Rood', value: '#B42F25' },
  { label: 'Groen', value: '#237A4D' },
  { label: 'Oranje', value: '#B4520E' },
  { label: 'Paars', value: '#087EB5' }
];

const penWidths = [
  { label: 'Dun', value: 3 },
  { label: 'Normaal', value: 6 },
  { label: 'Dik', value: 10 },
  { label: 'Extra dik', value: 16 }
];

const highlighterColors = [
  { label: 'Geel', value: '#FFD33D' },
  { label: 'Oranje', value: '#fb923c' },
  { label: 'Mint', value: '#5eead4' },
  { label: 'Roze', value: '#f9a8d4' },
  { label: 'Lavendel', value: '#BED8EA' }
];

const highlighterWidths = [
  { label: 'Smal', value: 16 },
  { label: 'Normaal', value: 24 },
  { label: 'Breed', value: 32 }
];

const textColors = [
  { label: 'Zwart', value: '#0B0D0F' },
  { label: 'Blauw', value: '#087EB5' },
  { label: 'Rood', value: '#B42F25' },
  { label: 'Groen', value: '#237A4D' },
  { label: 'Paars', value: '#087EB5' }
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

const backgroundKinds = [
  { id: 'white', label: 'Wit' },
  { id: 'lines', label: 'Lijntjes' },
  { id: 'grid', label: 'Ruitjes' },
  { id: 'mm', label: 'Millimeter' },
  { id: 'axes', label: 'Assenstelsel' }
];

const mathSymbols = ['π', '√', '²', '³', '×', '÷', '≤', '≥', '≈', '≠', '∠', '°'];

const panelClass = 'rounded-xl border presenter-chrome-surface';
const idleButtonClass =
  'border-[rgba(255,255,255,0.78)] bg-white/70 text-[var(--helix-navy)] hover:border-white hover:bg-white hover:text-[var(--helix-purple)]';
const activeButtonClass =
  'border-white bg-white text-[var(--helix-purple)] shadow-[0_8px_18px_rgba(122,60,255,0.12)]';
const instrumentIdleClass =
  'border-[rgba(255,122,0,0.28)] bg-white/70 text-orange-700 hover:border-white hover:bg-white hover:text-[var(--helix-purple)]';
const dividerClass = 'bg-[rgba(122,60,255,0.16)]';
const toolbarLabelClass = 'text-[var(--helix-purple)]';

// 44x44 raakvlak: haalbaar met een gestrekte arm voor een wandbord (WCAG 2.5.5).
const buttonBase =
  'relative inline-flex shrink-0 items-center justify-center rounded-xl border font-bold transition disabled:cursor-not-allowed disabled:opacity-40';
const squareButton = (isActive) => `${buttonBase} h-11 w-11 text-[13px] ${isActive ? activeButtonClass : idleButtonClass}`;
const labelButton = (isActive) =>
  `${buttonBase} h-11 px-3 text-[13px] ${isActive ? activeButtonClass : idleButtonClass}`;

// Achtergrondknoppen tonen het patroon zelf in plaats van het woord.
const backgroundSwatchStyle = (kind) => {
  const line = 'rgba(37,99,235,0.45)';

  if (kind === 'lines') {
    return { backgroundColor: '#ffffff', backgroundImage: `repeating-linear-gradient(180deg, ${line} 0 1px, transparent 1px 6px)` };
  }
  if (kind === 'grid') {
    return {
      backgroundColor: '#ffffff',
      backgroundImage: `repeating-linear-gradient(180deg, ${line} 0 1px, transparent 1px 7px), repeating-linear-gradient(90deg, ${line} 0 1px, transparent 1px 7px)`
    };
  }
  if (kind === 'mm') {
    return {
      backgroundColor: '#ffffff',
      backgroundImage: `repeating-linear-gradient(180deg, ${line} 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, ${line} 0 1px, transparent 1px 3px)`
    };
  }
  if (kind === 'axes') {
    return {
      backgroundColor: '#ffffff',
      backgroundImage: `linear-gradient(180deg, transparent 0 49%, ${line} 49% 51%, transparent 51% 100%), linear-gradient(90deg, transparent 0 49%, ${line} 49% 51%, transparent 51% 100%)`
    };
  }
  return { backgroundColor: '#ffffff' };
};

export default function PresenterToolbar({
  pageLabel = 'Pagina 0/0',
  activeCategory = 'pen',
  open = false,
  pinned = false,
  background = { kind: 'white', gridSize: 96 },
  penStyle = { color: '#0B0D0F', width: 6 },
  onTogglePinned,
  onOpen,
  onClosePanel,
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
  onInstrument,
  activeInstrument = null,
  onOpenImport,
  onFullscreen,
  eraserSize = 'medium',
  onEraserSize,
  recentColors = [],
  onCustomColor,
  penMode = 'free',
  onPenMode,
  shapeRecognition = false,
  onToggleShapeRecognition,
  fingerDrawing = true,
  onToggleFingerDrawing,
  focusKind = null,
  spotlightRadiusId = 'medium',
  curtainDirection = 'top',
  onFocusSelect,
  onSpotlightRadius,
  onCurtainDirection,
  onTimer,
  onStudentPicker,
  boardTheme = 'light',
  onToggleBoardTheme,
  toolbarAlign = 'center',
  onToolbarAlign
}) {
  const [symbolsOpen, setSymbolsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  // Gewone paneelknop: doet zijn werk en LAAT HET PANEEL STAAN, zodat kleur en
  // dikte achter elkaar te kiezen zijn.
  const runAction = (action) => {
    action?.();
    onAction?.();
  };

  // Afrondende knop: hierna is er niets meer te kiezen, dus het paneel gaat weg
  // en het bord is meteen weer vrij.
  const runClosingAction = (action) => {
    action?.();
    setSymbolsOpen(false);
    setMoreOpen(false);
    onClosePanel?.();
  };

  const handleCategory = (category) => {
    if (category.disabled) return;
    if (category.id === 'lesson') {
      onClosePanel?.();
      runAction(onOpenImport);
      return;
    }

    setSymbolsOpen(false);
    setMoreOpen(false);

    const wasActive = activeCategory === category.id;
    if (category.id === 'select') {
      onSelect?.();
    } else {
      onCategory?.(category.id);
    }
    onAction?.();

    if (DRAWING_CATEGORIES.has(category.id)) {
      // Eerste tik pakt het gereedschap, tweede tik opent (of sluit) het paneel.
      if (wasActive && open) onClosePanel?.();
      else if (wasActive) onOpen?.();
      else onClosePanel?.();
      return;
    }

    if (PANEL_CATEGORIES.has(category.id)) {
      if (wasActive && open) onClosePanel?.();
      else onOpen?.();
      return;
    }

    onClosePanel?.();
  };

  const renderCustomColorControls = (label, activeColor, applyColor) => (
    <>
      <label
        className={`relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border transition ${idleButtonClass}`}
        title={`${label}: eigen kleur kiezen`}
      >
        <Palette size={18} strokeWidth={2.4} />
        <input
          type="color"
          value={activeColor}
          onChange={(event) => {
            applyColor(event.target.value);
            onCustomColor?.(event.target.value);
          }}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-label={`${label}: eigen kleur kiezen`}
        />
      </label>
      {recentColors.map((color) => (
        <button
          key={`recent-${color}`}
          type="button"
          className={squareButton(activeColor === color)}
          onClick={() => applyColor(color)}
          aria-label={`${label}: recente kleur ${color}`}
          title={`Recente kleur ${color}`}
        >
          <span className="block h-5 w-5 rounded-full ring-2 ring-white/80" style={{ backgroundColor: color }} />
        </button>
      ))}
    </>
  );

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

  const penColor = penStyle?.color || '#0B0D0F';
  const penWidth = Number.isFinite(penStyle?.width) && penStyle.width > 0 ? penStyle.width : 6;
  const isHighlighter = activeCategory === 'highlighter';
  const drawingCategory = isHighlighter ? 'highlighter' : 'pen';
  const drawingColors = isHighlighter ? highlighterColors : penColors;
  const drawingWidths = isHighlighter ? highlighterWidths : penWidths;
  const drawingToolLabel = isHighlighter ? 'Markeerstift' : 'Pen';
  const previewOpacity = isHighlighter ? 0.42 : 1;
  const textStyle = selectedTextStyle || {};
  const activeTextStyle = {
    bold: Boolean(textStyle.bold),
    italic: Boolean(textStyle.italic),
    color: textStyle.color || '#0B0D0F',
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
    setSymbolsOpen(false);
    onAction?.();
  };

  const renderDrawingPanel = () => (
    <>
      <div className="flex flex-wrap items-center gap-1.5">
        {drawingColors.map((color) => (
          <button
            key={color.value}
            type="button"
            className={squareButton(penColor === color.value)}
            onClick={() => runAction(() => onPenStyle?.({ id: drawingCategory, variant: drawingCategory, color: color.value }))}
            aria-label={`${drawingToolLabel} kleur ${color.label}`}
            aria-pressed={penColor === color.value}
            title={color.label}
          >
            <span
              className="block h-6 w-6 rounded-full ring-2 ring-white/80"
              style={{ backgroundColor: color.value, opacity: previewOpacity }}
            />
          </button>
        ))}
        {renderCustomColorControls(drawingToolLabel, penColor, (color) =>
          runAction(() => onPenStyle?.({ id: drawingCategory, variant: drawingCategory, color }))
        )}
      </div>
      <div className={`h-9 w-px ${dividerClass}`} />
      <div className="flex flex-wrap items-center gap-1.5">
        {drawingWidths.map((width) => (
          <button
            key={width.value}
            type="button"
            className={squareButton(penWidth === width.value)}
            onClick={() => runAction(() => onPenStyle?.({ id: drawingCategory, variant: drawingCategory, width: width.value }))}
            aria-label={`${drawingToolLabel} dikte ${width.label}`}
            aria-pressed={penWidth === width.value}
            title={width.label}
          >
            <span
              className={isHighlighter ? 'block rounded-sm' : 'block rounded-full'}
              style={{
                backgroundColor: penColor,
                height: isHighlighter ? '9px' : `${Math.min(width.value + 2, 20)}px`,
                opacity: previewOpacity,
                width: isHighlighter ? `${Math.min(width.value, 28)}px` : `${Math.min(width.value + 2, 20)}px`
              }}
            />
          </button>
        ))}
      </div>
      {!isHighlighter ? (
        <>
          <div className={`h-9 w-px ${dividerClass}`} />
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              className={squareButton(penMode === 'free')}
              onClick={() => runAction(() => onPenMode?.('free'))}
              aria-pressed={penMode === 'free'}
              aria-label="Vrij tekenen"
              title="Vrij tekenen"
            >
              <Spline size={18} strokeWidth={2.4} />
            </button>
            <button
              type="button"
              className={squareButton(penMode === 'line')}
              onClick={() => runAction(() => onPenMode?.('line'))}
              aria-pressed={penMode === 'line'}
              aria-label="Rechte lijn"
              title="Rechte lijn; snapt op ruitjes, Shift = hoeksnap"
            >
              <Minus size={20} strokeWidth={3} />
            </button>
            <button
              type="button"
              className={squareButton(shapeRecognition)}
              onClick={() => runAction(onToggleShapeRecognition)}
              aria-pressed={shapeRecognition}
              aria-label="Vormherkenning"
              title="Vormherkenning: een getekende cirkel, rechthoek, driehoek of lijn wordt een net object"
            >
              <Wand2 size={18} strokeWidth={2.4} />
            </button>
            <button
              type="button"
              className={squareButton(fingerDrawing)}
              onClick={() => runAction(onToggleFingerDrawing)}
              aria-pressed={fingerDrawing}
              aria-label="Vinger tekent"
              title="Uit: vinger pant/scrollt, alleen de pen tekent"
            >
              <Hand size={18} strokeWidth={2.4} />
            </button>
          </div>
        </>
      ) : null}
    </>
  );

  const renderEraserPanel = () => (
    <div className="flex flex-wrap items-center gap-1.5">
      {PRESENTER_ERASER_SIZES.map((size) => (
        <button
          key={size.id}
          type="button"
          className={squareButton(eraserSize === size.id)}
          onClick={() => runAction(() => onEraserSize?.(size.id))}
          aria-label={`Gumgrootte ${size.label}`}
          aria-pressed={eraserSize === size.id}
          title={`Gumgrootte ${size.label}. De gum wist alleen pen- en markeerstiftstreken; objecten verwijder je via selectie.`}
        >
          <span
            className="block rounded-full border-2 border-slate-500 bg-white"
            style={{
              height: `${Math.min(26, Math.max(9, size.radius / 2.4))}px`,
              width: `${Math.min(26, Math.max(9, size.radius / 2.4))}px`
            }}
          />
        </button>
      ))}
    </div>
  );

  const renderFocusPanel = () => (
    <>
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          className={squareButton(focusKind === 'spotlight')}
          onClick={() => runAction(() => onFocusSelect?.('spotlight'))}
          aria-pressed={focusKind === 'spotlight'}
          aria-label="Spotlight"
          title="Verduister alles behalve een sleepbare cirkel"
        >
          <Lightbulb size={18} strokeWidth={2.4} />
        </button>
        {focusKind === 'spotlight'
          ? SPOTLIGHT_RADII.map((radius) => (
              <button
                key={radius.id}
                type="button"
                className={labelButton(spotlightRadiusId === radius.id)}
                onClick={() => runAction(() => onSpotlightRadius?.(radius.id))}
                aria-pressed={spotlightRadiusId === radius.id}
              >
                {radius.label}
              </button>
            ))
          : null}
        <button
          type="button"
          className={squareButton(focusKind === 'curtain')}
          onClick={() => runAction(() => onFocusSelect?.('curtain'))}
          aria-pressed={focusKind === 'curtain'}
          aria-label="Gordijn"
          title="Schuifbaar gordijn over het bord"
        >
          <Rows2 size={18} strokeWidth={2.4} />
        </button>
        {focusKind === 'curtain' ? (
          <>
            <button
              type="button"
              className={labelButton(curtainDirection === 'top')}
              onClick={() => runAction(() => onCurtainDirection?.('top'))}
              aria-pressed={curtainDirection === 'top'}
            >
              Boven
            </button>
            <button
              type="button"
              className={labelButton(curtainDirection === 'left')}
              onClick={() => runAction(() => onCurtainDirection?.('left'))}
              aria-pressed={curtainDirection === 'left'}
            >
              Links
            </button>
          </>
        ) : null}
        <button
          type="button"
          className={squareButton(focusKind === 'laser')}
          onClick={() => runAction(() => onFocusSelect?.('laser'))}
          aria-pressed={focusKind === 'laser'}
          aria-label="Laser"
          title="Rode aanwijsstip met vervagend spoor"
        >
          <Target size={18} strokeWidth={2.4} />
        </button>
      </div>
      <div className={`h-9 w-px ${dividerClass}`} />
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`px-1 ${toolbarLabelClass}`} aria-hidden="true">
          <Timer size={16} strokeWidth={2.6} />
        </span>
        {[1, 2, 5].map((minutes) => (
          <button
            key={minutes}
            type="button"
            className={labelButton(false)}
            onClick={() => runClosingAction(() => onTimer?.(minutes))}
            title={`Timer van ${minutes} ${minutes === 1 ? 'minuut' : 'minuten'} starten`}
          >
            {minutes} min
          </button>
        ))}
        <button
          type="button"
          className={squareButton(false)}
          onClick={() => runClosingAction(onStudentPicker)}
          aria-label="Leerlingkiezer"
          title="Kies een willekeurige leerling uit een klas"
        >
          <Users size={18} strokeWidth={2.4} />
        </button>
      </div>
    </>
  );

  const renderBackgroundPanel = () => (
    <>
      <div className="flex flex-wrap items-center gap-1.5">
        {backgroundKinds.map((kind) => (
          <button
            key={kind.id}
            type="button"
            className={squareButton(backgroundKind === kind.id)}
            onClick={() => handleBackground(kind.id)}
            aria-pressed={backgroundKind === kind.id}
            aria-label={`Achtergrond ${kind.label}`}
            title={kind.label}
          >
            <span
              className="block h-6 w-6 rounded border border-slate-300"
              style={backgroundSwatchStyle(kind.id)}
            />
          </button>
        ))}
      </div>
      <div className={`h-9 w-px ${dividerClass}`} />
      <button type="button" className={labelButton(false)} onClick={handleGridSizeToggle} title="Ruitmaat wisselen">
        Ruitmaat {nextGridSize}
      </button>
      <button
        type="button"
        className={squareButton(boardTheme === 'dark')}
        onClick={() => runAction(onToggleBoardTheme)}
        aria-pressed={boardTheme === 'dark'}
        aria-label="Donker bord"
        title="Donker bordvlak voor een verduisterd lokaal"
      >
        <Moon size={18} strokeWidth={2.4} />
      </button>
    </>
  );

  const renderTextPanel = () => (
    <>
      <button
        type="button"
        className={squareButton(false)}
        onClick={() => runClosingAction(onCreateTextObject)}
        aria-label="Tekstvak toevoegen"
        title="Tekstvak toevoegen"
      >
        <Type size={18} strokeWidth={2.4} />
      </button>
      <div className={`h-9 w-px ${dividerClass}`} />
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          className={squareButton(activeTextStyle.bold)}
          onClick={() => handleTextStyle({ bold: !activeTextStyle.bold })}
          aria-label="Vet"
          aria-pressed={activeTextStyle.bold}
        >
          <Bold size={18} strokeWidth={2.8} />
        </button>
        <button
          type="button"
          className={squareButton(activeTextStyle.italic)}
          onClick={() => handleTextStyle({ italic: !activeTextStyle.italic })}
          aria-label="Cursief"
          aria-pressed={activeTextStyle.italic}
        >
          <Italic size={18} strokeWidth={2.8} />
        </button>
        {textAlignments.map((alignment) => {
          const Icon = alignment.icon;

          return (
            <button
              key={alignment.value}
              type="button"
              className={squareButton(activeTextStyle.align === alignment.value)}
              onClick={() => handleTextStyle({ align: alignment.value })}
              aria-label={`Uitlijnen ${alignment.label}`}
              aria-pressed={activeTextStyle.align === alignment.value}
            >
              <Icon size={18} strokeWidth={2.6} />
            </button>
          );
        })}
      </div>
      <div className={`h-9 w-px ${dividerClass}`} />
      <div className="flex flex-wrap items-center gap-1.5">
        {textColors.map((color) => (
          <button
            key={color.value}
            type="button"
            className={squareButton(activeTextStyle.color === color.value)}
            onClick={() => handleTextStyle({ color: color.value })}
            aria-label={`Tekstkleur ${color.label}`}
            aria-pressed={activeTextStyle.color === color.value}
            title={color.label}
          >
            <span className="block h-6 w-6 rounded-full ring-2 ring-white/80" style={{ backgroundColor: color.value }} />
          </button>
        ))}
        {renderCustomColorControls('Tekstkleur', activeTextStyle.color, (color) => handleTextStyle({ color }))}
      </div>
      <div className={`h-9 w-px ${dividerClass}`} />
      <div className="flex flex-wrap items-center gap-1.5">
        {textSizes.map((size) => (
          <button
            key={size.value}
            type="button"
            className={squareButton(activeTextStyle.fontSize === size.value)}
            onClick={() => handleTextStyle({ fontSize: size.value })}
            aria-label={`Tekstgrootte ${size.label}`}
            aria-pressed={activeTextStyle.fontSize === size.value}
          >
            {size.label}
          </button>
        ))}
        {textFonts.map((font) => (
          <button
            key={font.value}
            type="button"
            className={labelButton(activeTextStyle.fontFamily === font.value)}
            onClick={() => handleTextStyle({ fontFamily: font.value })}
            aria-pressed={activeTextStyle.fontFamily === font.value}
          >
            {font.label}
          </button>
        ))}
      </div>
      <div className={`h-9 w-px ${dividerClass}`} />
      <div className="relative flex items-center">
        <button
          type="button"
          className={squareButton(symbolsOpen)}
          onClick={() => {
            setSymbolsOpen((current) => !current);
            onAction?.();
          }}
          aria-label="Wiskundesymbolen"
          aria-expanded={symbolsOpen}
          title="Wiskundesymbolen"
        >
          <Sigma size={19} strokeWidth={2.8} />
        </button>
        {symbolsOpen ? (
          <div className="absolute bottom-[calc(100%+0.5rem)] right-0 z-20 grid w-max max-w-[min(22rem,calc(100vw-2rem))] grid-cols-4 gap-1.5 rounded-xl border border-white/80 bg-white/95 p-2 shadow-[0_16px_32px_rgba(17,24,39,0.16)] backdrop-blur">
            {mathSymbols.map((symbol) => (
              <button
                key={symbol}
                type="button"
                className={`${buttonBase} h-11 w-11 bg-white text-[18px] text-[var(--helix-navy)] hover:border-[var(--helix-purple)] hover:text-[var(--helix-purple)]`}
                onClick={() => handleTextSymbol(symbol)}
                aria-label={`Wiskundesymbool ${symbol}`}
              >
                {symbol}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );

  const renderObjectsPanel = () => (
    <>
      <div className="flex flex-wrap items-center gap-1.5">
        {objectTypes.map((type) => {
          const Icon = type.icon;
          const label = getPresenterObjectLabel({ type: type.id });

          return (
            <button
              key={type.id}
              type="button"
              className={squareButton(false)}
              onClick={() => runClosingAction(() => onCreateObject?.(type.id))}
              aria-label={label}
              title={label}
            >
              <Icon size={18} strokeWidth={2.4} />
            </button>
          );
        })}
      </div>
      <div className={`h-9 w-px ${dividerClass}`} />
      <div className="flex flex-wrap items-center gap-1.5">
        {instrumentTypes.map((instrument) => {
          const Icon = instrument.icon;
          const isActive = activeInstrument === instrument.id;

          return (
            <button
              key={instrument.id}
              type="button"
              className={`${buttonBase} h-11 w-11 ${isActive ? activeButtonClass : instrumentIdleClass}`}
              onClick={() => runClosingAction(() => onInstrument?.(instrument.id))}
              aria-pressed={isActive}
              aria-label={instrument.label}
              title={isActive ? `${instrument.label} sluiten` : `${instrument.label} op het bord leggen`}
            >
              <Icon size={18} strokeWidth={2.4} />
            </button>
          );
        })}
      </div>
    </>
  );

  const panelRenderers = {
    pen: renderDrawingPanel,
    highlighter: renderDrawingPanel,
    eraser: renderEraserPanel,
    focus: renderFocusPanel,
    background: renderBackgroundPanel,
    text: renderTextPanel,
    objects: renderObjectsPanel
  };

  const panelTitles = {
    pen: 'Pen',
    highlighter: 'Markeerstift',
    eraser: 'Gum',
    focus: 'Focus',
    background: 'Achtergrond',
    text: 'Tekst',
    objects: 'Objecten en instrumenten'
  };

  const renderPanel = open ? panelRenderers[activeCategory] : null;
  const panelAnchorClass =
    toolbarAlign === 'left' ? 'left-0' : toolbarAlign === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2';
  const alignClass = toolbarAlign === 'left' ? 'mr-auto' : toolbarAlign === 'right' ? 'ml-auto' : 'mx-auto';

  const renderCategoryButton = (category) => {
    const Icon = category.icon;
    const isActive = activeCategory === category.id;
    const showsColor = category.id === 'pen' || category.id === 'highlighter';

    return (
      <button
        key={category.id}
        type="button"
        className={squareButton(isActive)}
        disabled={category.disabled}
        onClick={() => handleCategory(category)}
        aria-pressed={isActive}
        aria-expanded={isActive && PANEL_CATEGORIES.has(category.id) ? open : undefined}
        aria-label={category.label}
        title={category.hint || category.label}
      >
        <Icon size={19} strokeWidth={2.4} />
        {showsColor ? (
          <span
            aria-hidden="true"
            className="absolute bottom-1 left-1/2 h-1 w-5 -translate-x-1/2 rounded-full"
            style={{
              backgroundColor: category.id === activeCategory ? penColor : 'transparent',
              opacity: category.id === 'highlighter' ? 0.6 : 1
            }}
          />
        ) : null}
      </button>
    );
  };

  return (
    <div
      data-presenter-toolbar="true"
      data-presenter-toolbar-pinned={pinned ? 'true' : 'false'}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] sm:px-5"
    >
      <div className={`relative w-fit max-w-full ${alignClass}`}>
        {renderPanel ? (
          <div
            className={`pointer-events-auto absolute bottom-[calc(100%+0.5rem)] ${panelAnchorClass} flex w-max max-w-[calc(100vw-1.5rem)] flex-wrap items-center gap-1.5 p-1.5 ${panelClass}`}
            role="group"
            aria-label={`${panelTitles[activeCategory]} instellingen`}
          >
            {renderPanel()}
            <div className={`h-9 w-px ${dividerClass}`} />
            <button
              type="button"
              className={squareButton(false)}
              onClick={() => onClosePanel?.()}
              aria-label={`${panelTitles[activeCategory]} instellingen sluiten`}
              title="Paneel sluiten"
            >
              <X size={18} strokeWidth={2.6} />
            </button>
          </div>
        ) : null}

        <div className={`pointer-events-auto flex w-fit max-w-[calc(100vw-1.5rem)] flex-wrap items-center justify-center gap-1.5 p-1.5 ${panelClass}`}>
          <div className="flex shrink-0 items-center gap-1.5">{fileCategories.map(renderCategoryButton)}</div>

          <div className={`mx-0.5 h-9 w-px shrink-0 ${dividerClass}`} />

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              className={squareButton(false)}
              onClick={() => runAction(onPrev)}
              disabled={prevDisabled}
              aria-label="Vorige pagina"
              title="Vorige pagina (←)"
            >
              <ArrowLeft size={19} strokeWidth={2.4} />
            </button>
            <span className="min-w-14 px-1 text-center text-[13px] font-black leading-tight text-[var(--helix-navy)]" title={pageLabel}>
              {pageLabel.replace('Pagina ', '')}
            </span>
            <button
              type="button"
              className={squareButton(false)}
              onClick={() => runAction(onNext)}
              disabled={nextDisabled}
              aria-label="Volgende pagina"
              title="Volgende pagina (→)"
            >
              <ArrowRight size={19} strokeWidth={2.4} />
            </button>
            <button
              type="button"
              className={squareButton(false)}
              onClick={() => runAction(onAddPage)}
              aria-label="Nieuwe pagina"
              title="Nieuwe pagina"
            >
              <Plus size={19} strokeWidth={2.4} />
            </button>
          </div>

          <div className={`mx-0.5 h-9 w-px shrink-0 ${dividerClass}`} />

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              className={squareButton(false)}
              onClick={canUndo ? () => runAction(onUndo) : undefined}
              disabled={!canUndo}
              aria-label="Ongedaan maken"
              title="Ongedaan maken (Ctrl+Z)"
            >
              <Undo2 size={19} strokeWidth={2.4} />
            </button>
            <button
              type="button"
              className={squareButton(false)}
              onClick={canRedo ? () => runAction(onRedo) : undefined}
              disabled={!canRedo}
              aria-label="Opnieuw"
              title="Opnieuw (Ctrl+Y)"
            >
              <Redo2 size={19} strokeWidth={2.4} />
            </button>
          </div>

          <div className={`mx-0.5 h-9 w-px shrink-0 ${dividerClass}`} />

          <div className="flex shrink-0 items-center gap-1.5">{toolCategories.map(renderCategoryButton)}</div>

          <div className={`mx-0.5 h-9 w-px shrink-0 ${dividerClass}`} />

          <div className="flex shrink-0 items-center gap-1.5">
            {renderCategoryButton({ id: 'background', label: 'Achtergrond', icon: Grid3X3, hint: 'Achtergrond en bordkleur' })}
            <div className="relative flex items-center">
              <button
                type="button"
                className={squareButton(moreOpen)}
                onClick={() => setMoreOpen((current) => !current)}
                aria-label="Meer"
                aria-expanded={moreOpen}
                title="Meer: uitlijnen, vastzetten, volledig scherm, pagina leegmaken"
              >
                <MoreHorizontal size={19} strokeWidth={2.4} />
              </button>
              {moreOpen ? (
                <div className="absolute bottom-[calc(100%+0.5rem)] right-0 z-20 flex w-max items-center gap-1.5 rounded-xl border border-white/80 bg-white/95 p-1.5 shadow-[0_16px_32px_rgba(17,24,39,0.16)] backdrop-blur">
                  <button
                    type="button"
                    className={squareButton(false)}
                    onClick={() => {
                      const next = toolbarAlign === 'center' ? 'left' : toolbarAlign === 'left' ? 'right' : 'center';
                      onToolbarAlign?.(next);
                      onAction?.();
                    }}
                    aria-label="Werkbalk uitlijnen (links, midden of rechts)"
                    title={`Werkbalk uitlijnen (nu: ${toolbarAlign === 'center' ? 'midden' : toolbarAlign === 'left' ? 'links' : 'rechts'})`}
                  >
                    <MoveHorizontal size={19} strokeWidth={2.4} />
                  </button>
                  <button
                    type="button"
                    className={squareButton(pinned)}
                    onClick={onTogglePinned}
                    aria-pressed={pinned}
                    aria-label={pinned ? 'Paneel losmaken' : 'Paneel vastzetten'}
                    title={pinned ? 'Paneel losmaken: bord aanraken sluit het weer' : 'Paneel vastzetten: blijft open tijdens het tekenen'}
                  >
                    <Pin size={19} strokeWidth={2.4} />
                  </button>
                  <button
                    type="button"
                    className={squareButton(false)}
                    onClick={() => runClosingAction(onFullscreen)}
                    aria-label="Volledig scherm"
                    title="Volledig scherm"
                  >
                    <Maximize2 size={19} strokeWidth={2.4} />
                  </button>
                  <div className={`h-9 w-px ${dividerClass}`} />
                  <button
                    type="button"
                    className={squareButton(false)}
                    onClick={canClearPage ? () => runClosingAction(onClearPage) : undefined}
                    disabled={!canClearPage}
                    aria-label="Huidige pagina leegmaken"
                    title="Huidige pagina leegmaken"
                  >
                    <Trash2 size={19} strokeWidth={2.4} />
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
