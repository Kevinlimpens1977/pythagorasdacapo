import { useState } from 'react';
import { ArrowBigUp, Delete, Eraser } from 'lucide-react';
import {
  BOARD_KEY_BACKSPACE,
  BOARD_KEY_CLEAR,
  BOARD_KEY_SPACE,
  BOARD_LETTER_ROWS,
  BOARD_NUMBER_ROW,
  BOARD_NUMERIC_ROWS,
  shiftBoardKey
} from '../../lib/presenterBoardKeyboard.js';

// Aan een digibord hangt zelden een toetsenbord. Invul- en getalvragen krijgen
// daarom hun eigen toetsen: minimaal 64 px hoog, altijd zichtbaar, geen hover
// nodig om ze te vinden.
const keyClass =
  'inline-flex h-16 min-w-16 flex-1 items-center justify-center rounded-2xl border-2 border-slate-300 bg-white px-3 text-[24px] font-black text-slate-900 active:bg-slate-100';

const actionKeyClass =
  'inline-flex h-16 min-w-16 items-center justify-center gap-2 rounded-2xl border-2 border-slate-300 bg-slate-100 px-4 text-[18px] font-black text-slate-700 active:bg-slate-200';

function BoardKey({ label, onPress, className = keyClass, ariaLabel }) {
  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel || String(label)}
      onClick={() => onPress()}
      data-presenter-interactive="true"
    >
      {label}
    </button>
  );
}

export default function PresenterBoardKeyboard({ mode = 'text', onKey, onClose }) {
  const [shifted, setShifted] = useState(false);

  const press = (key) => {
    onKey?.(shiftBoardKey(key, shifted));
    if (shifted && key.length === 1) setShifted(false);
  };

  if (mode === 'numeric') {
    return (
      <div
        className="shrink-0 rounded-2xl border-2 border-slate-200 bg-slate-50 p-3"
        data-presenter-interactive="true"
      >
        <div className="flex gap-3">
          <div className="grid flex-1 grid-cols-3 gap-3">
            {BOARD_NUMERIC_ROWS.flat().map((key) => (
              <BoardKey key={key} label={key} onPress={() => press(key)} />
            ))}
          </div>
          <div className="flex w-40 flex-col gap-3">
            <BoardKey
              label={<><Delete size={22} /> Wis</>}
              ariaLabel="Wis laatste teken"
              className={`${actionKeyClass} flex-1`}
              onPress={() => onKey?.(BOARD_KEY_BACKSPACE)}
            />
            <BoardKey
              label={<><Eraser size={22} /> Leeg</>}
              ariaLabel="Veld leegmaken"
              className={`${actionKeyClass} flex-1`}
              onPress={() => onKey?.(BOARD_KEY_CLEAR)}
            />
            {onClose ? (
              <BoardKey
                label="Klaar"
                className={`${actionKeyClass} flex-1`}
                onPress={() => onClose()}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="shrink-0 rounded-2xl border-2 border-slate-200 bg-slate-50 p-3"
      data-presenter-interactive="true"
    >
      <div className="flex gap-2">
        {BOARD_NUMBER_ROW.map((key) => (
          <BoardKey key={key} label={key} onPress={() => press(key)} />
        ))}
      </div>
      {BOARD_LETTER_ROWS.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="mt-2 flex gap-2">
          {rowIndex === 2 ? (
            <BoardKey
              label={<ArrowBigUp size={26} />}
              ariaLabel="Hoofdletter"
              className={`${actionKeyClass} ${shifted ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : ''}`}
              onPress={() => setShifted((current) => !current)}
            />
          ) : null}
          {row.map((key) => (
            <BoardKey key={key} label={shiftBoardKey(key, shifted)} onPress={() => press(key)} />
          ))}
          {rowIndex === 2 ? (
            <BoardKey
              label={<Delete size={24} />}
              ariaLabel="Wis laatste teken"
              className={actionKeyClass}
              onPress={() => onKey?.(BOARD_KEY_BACKSPACE)}
            />
          ) : null}
        </div>
      ))}
      <div className="mt-2 flex gap-2">
        <BoardKey
          label="Spatie"
          className={`${keyClass} flex-[4] text-[20px]`}
          onPress={() => onKey?.(BOARD_KEY_SPACE)}
        />
        <BoardKey
          label={<><Eraser size={22} /> Leeg</>}
          ariaLabel="Veld leegmaken"
          className={actionKeyClass}
          onPress={() => onKey?.(BOARD_KEY_CLEAR)}
        />
        {onClose ? <BoardKey label="Klaar" className={actionKeyClass} onPress={() => onClose()} /> : null}
      </div>
    </div>
  );
}
