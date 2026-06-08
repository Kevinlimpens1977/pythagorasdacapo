import { Fragment, useRef, useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import {
  addRatioColumn,
  canRemoveRatioColumn,
  createMathToolWork,
  MATH_TOOL_TYPES,
  normalizeMathTool,
  normalizePythagorasSide,
  removeRatioColumn,
  updateMathToolValue
} from '../../lib/mathToolboxUtils';
import { evaluateCalculatorExpression } from '../../lib/calculatorEvaluator';
import {
  appendCalculatorInput,
  normalizeCalculatorKeyboardValue,
  ROOT_SYMBOL,
  SQUARED_SYMBOL
} from '../../lib/calculatorInputUtils';

function ToolboxInput({ value, onChange, disabled, placeholder = '', ariaLabel }) {
  return (
    <input
      aria-label={ariaLabel}
      className="h-11 min-w-24 rounded-xl border border-[var(--helix-border)] bg-white px-3 text-center text-sm font-black text-[var(--helix-navy)] outline-none transition focus:border-[var(--helix-purple)] focus:ring-2 focus:ring-fuchsia-100 disabled:cursor-not-allowed disabled:opacity-70"
      disabled={disabled}
      onChange={(event) => onChange?.(event.target.value)}
      placeholder={placeholder}
      type="text"
      value={value || ''}
    />
  );
}

function RatioOperationInput({ value, onChange, disabled, placement = 'top', markerId }) {
  const isTop = placement === 'top';

  return (
    <div className="flex w-full flex-col items-center">
      {isTop ? (
        <input
          aria-label="Bewerking boven de verhoudingstabel"
          className="h-8 w-24 rounded-xl border border-fuchsia-100 bg-white px-2 text-center text-xs font-black text-[var(--helix-navy)] outline-none transition focus:border-[var(--helix-purple)] focus:ring-2 focus:ring-fuchsia-100 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={disabled}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder="bewerking"
          type="text"
          value={value || ''}
        />
      ) : null}
      <svg
        aria-hidden="true"
        className="h-10 w-full overflow-visible text-[var(--helix-purple)]"
        viewBox="0 0 96 42"
      >
        <defs>
          <marker
            id={markerId}
            markerHeight="8"
            markerUnits="strokeWidth"
            markerWidth="8"
            orient="auto"
            refX="7"
            refY="4"
          >
            <path d="M 0 0 L 8 4 L 0 8 z" fill="currentColor" />
          </marker>
        </defs>
        <path
          d={isTop ? 'M 8 32 C 24 8 68 8 88 28' : 'M 8 10 C 24 34 68 34 88 14'}
          fill="none"
          markerEnd={`url(#${markerId})`}
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="4"
        />
      </svg>
      {!isTop ? (
        <input
          aria-label="Bewerking onder de verhoudingstabel"
          className="h-8 w-24 rounded-xl border border-fuchsia-100 bg-white px-2 text-center text-xs font-black text-[var(--helix-navy)] outline-none transition focus:border-[var(--helix-purple)] focus:ring-2 focus:ring-fuchsia-100 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={disabled}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder="bewerking"
          type="text"
          value={value || ''}
        />
      ) : null}
    </div>
  );
}

function RatioTableWorksheet({ tool, disabled, onChange }) {
  const change = (path, value) => onChange?.(updateMathToolValue(tool, path, value));
  const addColumn = () => onChange?.(addRatioColumn(tool));
  const lastColumnIndex = tool.topValues.length - 1;
  const canRemoveLastColumn = canRemoveRatioColumn(tool, lastColumnIndex);
  const columnWidth = '7rem';
  const labelWidth = '9rem';

  return (
    <div className="overflow-x-auto pb-2">
      <div className="min-w-max space-y-2">
        <div
          className="grid items-center gap-2"
          style={{ gridTemplateColumns: `${labelWidth} repeat(${tool.topValues.length}, ${columnWidth})` }}
        >
          <span />
          {tool.topOperations.map((operation, index) => (
            <div
              className="col-span-1 flex items-center justify-center"
              key={`top-operation-${index}`}
              style={{ transform: `translateX(calc(${columnWidth} / 2))` }}
            >
              <RatioOperationInput
                disabled={disabled}
                markerId={`${tool.id}-presenter-top-${index}`}
                onChange={(value) => change(['topOperations', index], value)}
                placement="top"
                value={operation}
              />
            </div>
          ))}
        </div>

        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `${labelWidth} repeat(${tool.topValues.length}, ${columnWidth})` }}
        >
          <ToolboxInput
            ariaLabel="Rijnaam bovenste rij"
            disabled={disabled}
            onChange={(value) => change(['topLabel'], value)}
            placeholder="rijnaam"
            value={tool.topLabel}
          />
          {tool.topValues.map((value, index) => (
            <ToolboxInput
              ariaLabel={`Bovenste waarde kolom ${index + 1}`}
              disabled={disabled}
              key={`top-${index}`}
              onChange={(nextValue) => change(['topValues', index], nextValue)}
              value={value}
            />
          ))}
          <ToolboxInput
            ariaLabel="Rijnaam onderste rij"
            disabled={disabled}
            onChange={(value) => change(['bottomLabel'], value)}
            placeholder="rijnaam"
            value={tool.bottomLabel}
          />
          {tool.bottomValues.map((value, index) => (
            <ToolboxInput
              ariaLabel={`Onderste waarde kolom ${index + 1}`}
              disabled={disabled}
              key={`bottom-${index}`}
              onChange={(nextValue) => change(['bottomValues', index], nextValue)}
              value={value}
            />
          ))}
        </div>

        <div
          className="grid items-center gap-2"
          style={{ gridTemplateColumns: `${labelWidth} repeat(${tool.bottomValues.length}, ${columnWidth})` }}
        >
          <span />
          {tool.bottomOperations.map((operation, index) => (
            <div
              className="col-span-1 flex items-center justify-center"
              key={`bottom-operation-${index}`}
              style={{ transform: `translateX(calc(${columnWidth} / 2))` }}
            >
              <RatioOperationInput
                disabled={disabled}
                markerId={`${tool.id}-presenter-bottom-${index}`}
                onChange={(value) => change(['bottomOperations', index], value)}
                placement="bottom"
                value={operation}
              />
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--helix-purple)] px-3 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={disabled}
            onClick={addColumn}
            type="button"
          >
            <Plus size={14} />
            Kolom toevoegen
          </button>
          {tool.topValues.length > 2 ? (
            <button
              className="rounded-xl border border-[var(--helix-border)] bg-white px-3 py-2 text-xs font-black text-[var(--helix-muted)] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={disabled || !canRemoveLastColumn}
              onClick={() => onChange?.(removeRatioColumn(tool, lastColumnIndex))}
              title={canRemoveLastColumn ? 'Laatste lege kolom verwijderen' : 'Maak eerst de laatste kolom en de laatste bewerkingen leeg.'}
              type="button"
            >
              Laatste kolom verwijderen
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function PythagorasSideInput({ row, rowIndex, disabled, onChange }) {
  return (
    <input
      aria-label={`Zijde rij ${rowIndex + 1}`}
      className="h-11 w-full min-w-0 rounded-xl border border-[var(--helix-border)] bg-white px-2 text-center text-sm font-black uppercase tracking-[0.12em] text-[var(--helix-navy)] outline-none transition focus:border-[var(--helix-purple)] focus:ring-2 focus:ring-fuchsia-100 disabled:cursor-not-allowed disabled:opacity-70"
      disabled={disabled}
      maxLength={2}
      onChange={(event) => onChange(['rows', rowIndex, 'side'], normalizePythagorasSide(event.target.value))}
      type="text"
      value={row?.side || ''}
    />
  );
}

function PythagorasCalculator({ disabled = false }) {
  const [expression, setExpression] = useState('');
  const [display, setDisplay] = useState('0');

  const appendValue = (value) => {
    if (disabled) return;
    const nextValue = appendCalculatorInput(display, value);
    setExpression(nextValue);
    setDisplay(nextValue);
  };

  const reset = () => {
    setExpression('');
    setDisplay('0');
  };

  const backspace = () => {
    if (disabled) return;
    const nextValue = display === 'Ongeldig' ? '0' : display.slice(0, -1) || '0';
    setExpression(nextValue === '0' ? '' : nextValue);
    setDisplay(nextValue);
  };

  const handleDisplayChange = (event) => {
    if (disabled) return;
    const nextValue = normalizeCalculatorKeyboardValue(event.target.value);
    setExpression(nextValue);
    setDisplay(nextValue);
  };

  const handleDisplayFocus = (event) => {
    if (display === '0' || display === 'Ongeldig') {
      event.currentTarget.select();
    }
  };

  const handleDisplayKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      calculate();
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      reset();
    }
  };

  const calculate = () => {
    if (disabled) return;

    try {
      const result = evaluateCalculatorExpression(expression || display);
      setExpression(String(result));
      setDisplay(String(result));
    } catch {
      setDisplay('Ongeldig');
    }
  };

  const buttons = [
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: ':', value: ':' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: 'x', value: 'x' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '-', value: '-' },
    { label: '0', value: '0' },
    { label: ',', value: ',' },
    { label: ROOT_SYMBOL, value: ROOT_SYMBOL, ariaLabel: 'Wortel' },
    { label: '+', value: '+' },
    { label: '(', value: '(' },
    { label: ')', value: ')' },
    {
      id: 'square',
      label: (
        <>
          x<sup className="text-[0.7em] leading-none">2</sup>
        </>
      ),
      value: SQUARED_SYMBOL,
      ariaLabel: 'Kwadraat'
    },
    { label: '⌫', action: backspace, ariaLabel: 'Wis laatste teken' }
  ];

  return (
    <aside className="rounded-2xl border border-fuchsia-100 bg-white p-3">
      <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--helix-purple)]">Rekenmachine</p>
      <input
        aria-label="Rekenmachine invoer"
        className="mb-2 h-12 w-full rounded-xl bg-[var(--helix-navy)] px-3 py-2 text-right font-display text-xl font-black text-white outline-none ring-0 transition placeholder:text-white/55 focus:ring-2 focus:ring-[var(--helix-purple)] disabled:cursor-not-allowed disabled:opacity-70"
        disabled={disabled}
        inputMode="text"
        onChange={handleDisplayChange}
        onFocus={handleDisplayFocus}
        onKeyDown={handleDisplayKeyDown}
        spellCheck="false"
        type="text"
        value={display}
      />
      <div className="grid grid-cols-4 gap-1.5">
        {buttons.map((button) => (
          <button
            className="rounded-lg border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] px-2 py-2 text-xs font-black text-[var(--helix-navy)] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={disabled}
            key={button.id || button.label}
            onClick={button.action || (() => appendValue(button.value))}
            aria-label={button.ariaLabel}
            type="button"
          >
            {button.label}
          </button>
        ))}
        <button
          className="col-span-2 rounded-lg border border-[var(--helix-border)] bg-white px-2 py-2 text-xs font-black text-[var(--helix-muted)] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
          onClick={reset}
          type="button"
        >
          C
        </button>
        <button
          className="col-span-2 rounded-lg bg-[var(--helix-purple)] px-2 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
          onClick={calculate}
          type="button"
        >
          =
        </button>
      </div>
    </aside>
  );
}

function PythagorasWorksheet({ tool, disabled, onChange }) {
  const workingTextRef = useRef(null);
  const change = (path, value) => onChange?.(updateMathToolValue(tool, path, value));
  const workingText = (tool.workingText || '').replace(/\^2/gu, SQUARED_SYMBOL);

  const insertWorkingSymbol = (symbol) => {
    const textarea = workingTextRef.current;
    const currentValue = workingText;
    const start = textarea?.selectionStart ?? currentValue.length;
    const end = textarea?.selectionEnd ?? currentValue.length;
    const nextValue = `${currentValue.slice(0, start)}${symbol}${currentValue.slice(end)}`
      .replace(/\^2/gu, SQUARED_SYMBOL);
    change(['workingText'], nextValue);

    window.requestAnimationFrame(() => {
      textarea?.focus();
      const cursor = start + symbol.length;
      textarea?.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <div className="grid w-full gap-4 xl:grid-cols-[minmax(0,1fr)_15rem]">
      <div className="space-y-4">
        <div className="overflow-hidden rounded-2xl border border-[var(--helix-border)] bg-white">
          <div className="grid grid-cols-[minmax(3.75rem,0.45fr)_minmax(7rem,1.1fr)_minmax(7rem,1.1fr)] bg-[var(--helix-soft-lavender)] text-xs font-black uppercase tracking-[0.12em] text-[var(--helix-purple)]">
            <div className="px-3 py-3">Zijde</div>
            <div className="px-3 py-3">Lengte</div>
            <div className="px-3 py-3">Kwadraat</div>
          </div>
          <div className="grid grid-cols-[minmax(3.75rem,0.45fr)_minmax(7rem,1.1fr)_minmax(7rem,1.1fr)] gap-x-2 gap-y-2 p-3">
            {tool.rows.map((row, index) => (
              <Fragment key={row.id}>
                <PythagorasSideInput disabled={disabled} onChange={change} row={row} rowIndex={index} />
                <ToolboxInput
                  ariaLabel={`Lengte rij ${index + 1}`}
                  disabled={disabled}
                  onChange={(value) => change(['rows', index, 'length'], value)}
                  value={row?.length}
                />
                <div className="space-y-1">
                  <ToolboxInput
                    ariaLabel={`Kwadraat rij ${index + 1}`}
                    disabled={disabled}
                    onChange={(value) => change(['rows', index, 'square'], value)}
                    value={row?.square}
                  />
                  {index === 1 ? (
                    <div aria-hidden="true" className="flex items-center gap-2 px-1">
                      <div className="h-0.5 flex-1 rounded-full bg-[var(--helix-navy)]" />
                      <span className="text-xl font-black leading-none text-[var(--helix-navy)]">+</span>
                    </div>
                  ) : null}
                </div>
              </Fragment>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--helix-border)] bg-white p-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <label
              className="text-xs font-black uppercase tracking-[0.14em] text-[var(--helix-muted)]"
              htmlFor={`${tool.id}-presenter-working`}
            >
              Berekening en uitwerking
            </label>
            <div className="flex gap-2">
              <button
                aria-label="Kwadraat invoegen"
                className="inline-flex items-center rounded-lg border border-fuchsia-100 bg-[var(--helix-soft-lavender)] px-3 py-1 text-sm font-black text-[var(--helix-purple)] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={disabled}
                onClick={() => insertWorkingSymbol(SQUARED_SYMBOL)}
                type="button"
              >
                x<sup className="text-[0.7em] leading-none">2</sup>
              </button>
              <button
                aria-label="Wortel invoegen"
                className="rounded-lg border border-fuchsia-100 bg-[var(--helix-soft-lavender)] px-3 py-1 text-sm font-black text-[var(--helix-purple)] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={disabled}
                onClick={() => insertWorkingSymbol('sqrt')}
                type="button"
              >
                sqrt
              </button>
            </div>
          </div>
          <textarea
            className="min-h-32 w-full resize-y rounded-2xl border border-[var(--helix-border)] bg-white px-4 py-3 text-sm font-semibold leading-7 text-[var(--helix-navy)] outline-none transition focus:border-[var(--helix-purple)] focus:ring-2 focus:ring-fuchsia-100 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={disabled}
            id={`${tool.id}-presenter-working`}
            onChange={(event) => change(['workingText'], event.target.value.replace(/\^2/gu, SQUARED_SYMBOL))}
            placeholder="Schrijf hier je berekening en uitwerking..."
            ref={workingTextRef}
            value={workingText}
          />
        </div>
      </div>

      <PythagorasCalculator disabled={disabled} />
    </div>
  );
}

export default function PresenterMathToolObject({ object, disabled = false, onChange }) {
  const normalized = normalizeMathTool(object?.content?.mathTool);
  if (!normalized) return null;

  const resetTool = () => onChange?.(createMathToolWork(normalized.type, normalized.id));

  return (
    <div
      className="h-full w-full overflow-auto rounded-2xl border border-fuchsia-100 bg-[var(--helix-surface-soft)] p-4 shadow-sm"
      data-presenter-interactive="true"
      xmlns="http://www.w3.org/1999/xhtml"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h4 className="font-display text-lg font-extrabold text-[var(--helix-navy)]">{normalized.title}</h4>
        <button
          className="inline-flex items-center gap-1 rounded-xl border border-[var(--helix-border)] bg-white px-3 py-2 text-xs font-black text-[var(--helix-muted)] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
          onClick={resetTool}
          type="button"
        >
          <RotateCcw size={14} />
          Leegmaken
        </button>
      </div>
      {normalized.type === MATH_TOOL_TYPES.ratioTable ? (
        <RatioTableWorksheet disabled={disabled} onChange={onChange} tool={normalized} />
      ) : (
        <PythagorasWorksheet disabled={disabled} onChange={onChange} tool={normalized} />
      )}
    </div>
  );
}
