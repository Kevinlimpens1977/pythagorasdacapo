import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowDown, ArrowUp, CheckCircle2, Eye, EyeOff, Keyboard, PlayCircle, RotateCcw } from 'lucide-react';
import {
  buildQuestionInitialAnswers,
  getQuestionControlState,
  getQuestionFeedbackStatus,
  getPresenterImportedObjectModel,
  gradeQuestionOnBoard
} from './presenterContentObjectUtils.js';
import PresenterBoardMedia from './PresenterBoardMedia.jsx';
import PresenterBoardKeyboard from './PresenterBoardKeyboard.jsx';
import PdfSlideDeckPresenter from '../digibord/PdfSlideDeckPresenter.jsx';
import { applyBoardKey } from '../../lib/presenterBoardKeyboard.js';
import {
  CLASSROOM_OUTCOMES,
  feedbackStatusToClassroomOutcome
} from '../../lib/presenterClassroomLog.js';

const htmlValue = (value = '') => ({ __html: value || '' });

const panelClass =
  'h-full w-full overflow-hidden rounded-[18px] border-[3px] bg-[rgb(253,252,249)] text-slate-900 shadow-[0_16px_36px_rgba(15,23,42,0.12)]';

// Rustige randen, net als in de leerlingroute. Geen schreeuwerige teksten,
// geen animaties: de rand doet het werk.
const feedbackBorder = {
  idle: 'border-slate-200',
  correct: 'border-green-500',
  incorrect: 'border-red-500',
  unknown: 'border-slate-400'
};

const feedbackText = {
  correct: 'Goed.',
  incorrect: 'Nog niet goed.',
  unknown: 'Deze vraag kijkt de docent na.',
  idle: ''
};

const feedbackTone = {
  correct: 'text-green-700',
  incorrect: 'text-red-700',
  unknown: 'text-slate-600',
  idle: 'text-slate-500'
};

// Alle knoppen op het bord zijn minstens 64 px hoog en 64 px breed: ruim boven
// de 44x44 die met een vinger nog te raken is, en leesbaar vanaf vier meter.
const boardButtonClass =
  'inline-flex min-h-16 items-center justify-center gap-3 rounded-2xl border-2 border-slate-300 bg-white px-6 text-[20px] font-black text-slate-900 active:bg-slate-100';

const primaryButtonClass =
  'inline-flex min-h-16 items-center justify-center gap-3 rounded-2xl bg-slate-950 px-7 text-[20px] font-black text-slate-50 active:bg-slate-800';

export default function PresenterImportedObjectCard({ object, onClassroomLog }) {
  const model = useMemo(() => getPresenterImportedObjectModel(object), [object]);

  if (!model) return null;

  if (model.kind === 'question') {
    return (
      <QuestionCard
        model={model}
        onClassroomLog={onClassroomLog ? (entry) => onClassroomLog(object.id, entry) : null}
      />
    );
  }
  if (model.kind === 'media') return <MediaCard model={model} />;
  if (model.kind === 'slidedeck') return <SlidedeckCard model={model} />;
  return <LessonCard model={model} />;
}

function CardShell({ model, children, className = '' }) {
  return (
    <section className={`${panelClass} ${className}`}>
      <div className="flex h-full min-h-0 flex-col">
        <header className="shrink-0 border-b border-slate-200/80 bg-slate-50/85 px-6 py-4">
          <p className="text-[13px] font-black uppercase tracking-[0.18em] text-slate-500">{model.label}</p>
          <h3 className="mt-1 truncate text-[30px] font-black leading-tight tracking-normal text-slate-950">{model.title}</h3>
        </header>
        <div className="min-h-0 flex-1 overflow-auto px-6 py-5">{children}</div>
      </div>
    </section>
  );
}

function LessonCard({ model }) {
  return (
    <CardShell model={model}>
      <div className={model.imageUrl ? 'grid h-full min-h-0 gap-5 lg:grid-cols-[minmax(0,1fr)_38%]' : 'h-full'}>
        <div
          className="prose prose-lg max-w-none text-[24px] leading-[1.55] text-slate-700 prose-headings:text-slate-950 prose-strong:text-slate-950"
          dangerouslySetInnerHTML={htmlValue(model.bodyHtml || '<p>Nog geen inhoud ingevuld.</p>')}
        />
        {model.imageUrl ? (
          <figure className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <img src={model.imageUrl} alt={model.caption || model.title} className="min-h-0 flex-1 object-contain p-2" />
            {model.caption ? <figcaption className="shrink-0 px-4 py-3 text-[17px] font-bold text-slate-600">{model.caption}</figcaption> : null}
          </figure>
        ) : null}
      </div>
    </CardShell>
  );
}

function MediaCard({ model }) {
  return (
    <CardShell model={model}>
      <div className="flex h-full min-h-0 flex-col gap-4">
        {model.bodyHtml ? (
          <div
            className="prose max-w-none text-[20px] leading-[1.45] text-slate-700"
            dangerouslySetInnerHTML={htmlValue(model.bodyHtml)}
          />
        ) : null}
        <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          <PresenterBoardMedia media={model.media} title={model.title} />
        </div>
        {model.media.caption ? <p className="shrink-0 text-[18px] font-bold leading-7 text-slate-600">{model.media.caption}</p> : null}
      </div>
    </CardShell>
  );
}

function SlidedeckCard({ model }) {
  const [open, setOpen] = useState(false);
  const canOpen = Boolean(model.pdfUrl || model.packageId || model.storagePath);

  return (
    <CardShell model={model}>
      <div className="flex h-full min-h-0 flex-col justify-center gap-5">
        {model.bodyHtml ? (
          <div
            className="prose prose-lg max-w-none text-[22px] leading-[1.45] text-slate-700"
            dangerouslySetInnerHTML={htmlValue(model.bodyHtml)}
          />
        ) : null}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
              <PlayCircle size={34} />
            </span>
            <div className="min-w-0">
              <p className="text-[24px] font-black leading-tight text-slate-950">{model.title}</p>
              <p className="mt-1 text-[18px] font-bold text-slate-600">Presentatieblok voor het digibord</p>
            </div>
          </div>
          {canOpen ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={`${primaryButtonClass} mt-6`}
              data-presenter-interactive="true"
            >
              <PlayCircle size={24} />
              Presentatie starten
            </button>
          ) : (
            <p className="mt-6 text-[18px] font-bold text-slate-500">Nog geen presentatie gekoppeld.</p>
          )}
        </div>
      </div>
      {/* De presentatie gaat via een portal naar document.body: een fixed
          overlay binnen de board-SVG is per browser onbetrouwbaar. */}
      {open && typeof document !== 'undefined'
        ? createPortal(
            <PdfSlideDeckPresenter
              slide={{
                title: model.title,
                imageUrl: model.pdfUrl,
                pdfStoragePath: model.storagePath,
                slidedeckPackageId: model.packageId
              }}
              onClose={() => setOpen(false)}
            />,
            document.body
          )
        : null}
    </CardShell>
  );
}

function QuestionCard({ model, onClassroomLog }) {
  const [answers, setAnswers] = useState(() => buildQuestionInitialAnswers(model));
  const [checked, setChecked] = useState(false);
  // Klassikale regie: de controleknop en feedback blijven verborgen tot de
  // docent ze onthult, zodat de klas eerst zelf kan nadenken.
  const [revealed, setRevealed] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [keyboardField, setKeyboardField] = useState('');
  const loggedRef = useRef('');

  const isExercise = model.type === 'exercise';
  const control = getQuestionControlState(model, answers);
  const status = revealed ? getQuestionFeedbackStatus(model, answers, checked) : 'idle';
  const grade = checked && revealed ? gradeQuestionOnBoard(model, answers) : null;

  // Lesregistratie: alleen dat de vraag klassikaal behandeld is. Geen leerling,
  // geen klas, geen tokens, geen voortgangsrecord.
  useEffect(() => {
    if (!onClassroomLog) return;
    if (!checked || !revealed) return;
    const uitkomst = feedbackStatusToClassroomOutcome(status);
    if (loggedRef.current === uitkomst) return;
    loggedRef.current = uitkomst;
    onClassroomLog({ uitkomst });
  }, [checked, revealed, status, onClassroomLog]);

  const setAnswer = (field, value) => {
    setAnswers((current) => ({ ...current, [field]: value }));
    setChecked(false);
  };

  const pressKey = (key) => {
    if (!keyboardField) return;
    setAnswers((current) => ({ ...current, [keyboardField]: applyBoardKey(current[keyboardField], key) }));
    setChecked(false);
  };

  const moveOrderItem = (fromIndex, toIndex) => {
    setAnswers((current) => {
      const items = [...(current.orderItems || [])];
      if (fromIndex < 0 || toIndex < 0 || fromIndex >= items.length || toIndex >= items.length) return current;
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      return { ...current, orderItems: items, orderTouched: true };
    });
    setChecked(false);
  };

  const resetAnswers = () => {
    setAnswers(buildQuestionInitialAnswers(model));
    setChecked(false);
    setShowModelAnswer(false);
    setKeyboardField('');
    loggedRef.current = '';
    onClassroomLog?.(null);
  };

  const markDiscussed = () => {
    loggedRef.current = CLASSROOM_OUTCOMES.BESPROKEN;
    onClassroomLog?.({ uitkomst: CLASSROOM_OUTCOMES.BESPROKEN });
    setShowModelAnswer(true);
  };

  const keyboardMode = model.type === 'numeriek' ? 'numeric' : 'text';
  const showKeyboard = Boolean(keyboardField);
  const canAutoCheck = !isExercise && control.hasInput;
  // Alleen bij een open vraag is een modelantwoord zinvol om te onthullen; de
  // andere typen kijken zichzelf na met de gedeelde grader.
  const canShowModelAnswer = model.type === 'open' && Boolean(model.modelAnswer);

  return (
    <CardShell model={model} className={feedbackBorder[status] || feedbackBorder.idle}>
      <div className="flex h-full min-h-0 flex-col gap-4">
        {model.promptHtml ? (
          <div
            className="shrink-0 max-h-[38%] overflow-auto prose prose-lg max-w-none text-[26px] leading-[1.5] text-slate-700 prose-headings:text-slate-950"
            dangerouslySetInnerHTML={htmlValue(model.promptHtml)}
          />
        ) : (
          <p className="shrink-0 text-[22px] font-bold text-slate-500">Nog geen vraagtekst ingevuld.</p>
        )}

        <div className="min-h-0 flex-1 overflow-auto">
          <QuestionAnswerUi
            model={model}
            answers={answers}
            setAnswer={setAnswer}
            moveOrderItem={moveOrderItem}
            keyboardField={keyboardField}
            onFocusField={setKeyboardField}
            grade={grade}
            revealed={revealed}
          />
          {showModelAnswer && canShowModelAnswer ? (
            <div className="mt-4 rounded-2xl border-2 border-slate-300 bg-slate-50 p-5">
              <p className="text-[15px] font-black uppercase tracking-[0.16em] text-slate-500">Modelantwoord</p>
              <p className="mt-2 whitespace-pre-wrap text-[24px] font-bold leading-[1.5] text-slate-900">{model.modelAnswer}</p>
            </div>
          ) : null}
        </div>

        {showKeyboard ? (
          <PresenterBoardKeyboard mode={keyboardMode} onKey={pressKey} onClose={() => setKeyboardField('')} />
        ) : null}

        <footer className="flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-4">
          <p className={`text-[22px] font-black ${feedbackTone[status] || feedbackTone.idle}`}>
            {feedbackText[status] || ''}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {!revealed ? (
              <button
                type="button"
                className={boardButtonClass}
                onClick={() => setRevealed(true)}
                data-presenter-interactive="true"
              >
                <Eye size={24} />
                Onthul controle
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className={boardButtonClass}
                  onClick={() => {
                    setRevealed(false);
                    setChecked(false);
                    setShowModelAnswer(false);
                  }}
                  data-presenter-interactive="true"
                  aria-label="Controle weer verbergen"
                >
                  <EyeOff size={24} />
                  Verberg
                </button>
                {checked || showModelAnswer ? (
                  <button
                    type="button"
                    className={boardButtonClass}
                    onClick={resetAnswers}
                    data-presenter-interactive="true"
                  >
                    <RotateCcw size={22} />
                    Reset antwoord
                  </button>
                ) : null}
                {canShowModelAnswer && !showModelAnswer ? (
                  <button
                    type="button"
                    className={boardButtonClass}
                    onClick={markDiscussed}
                    data-presenter-interactive="true"
                  >
                    Toon modelantwoord
                  </button>
                ) : null}
                {isExercise ? (
                  <button
                    type="button"
                    className={primaryButtonClass}
                    onClick={markDiscussed}
                    data-presenter-interactive="true"
                  >
                    <CheckCircle2 size={24} />
                    Besproken
                  </button>
                ) : null}
                {canAutoCheck ? (
                  <button
                    type="button"
                    className={primaryButtonClass}
                    onClick={() => setChecked(true)}
                    data-presenter-interactive="true"
                  >
                    <CheckCircle2 size={24} />
                    Controleer
                  </button>
                ) : null}
              </>
            )}
          </div>
        </footer>
      </div>
    </CardShell>
  );
}

const partStatusClass = (grade, partId) => {
  if (!grade?.canGrade) return '';
  const part = grade.parts.find((entry) => entry.id === partId);
  if (!part) return '';
  return part.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50';
};

function BoardTextField({ id, value, placeholder, active, onFocusField, onChange, className = '' }) {
  return (
    <span className="relative inline-flex items-center">
      <input
        type="text"
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => onFocusField(id)}
        className={`${className} ${active ? 'border-indigo-500 ring-4 ring-indigo-100' : ''}`}
        placeholder={placeholder}
        data-presenter-interactive="true"
      />
      <button
        type="button"
        aria-label="Schermtoetsenbord"
        onClick={() => onFocusField(active ? '' : id)}
        className="ml-1 inline-flex h-12 w-12 items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-slate-500"
        data-presenter-interactive="true"
      >
        <Keyboard size={22} />
      </button>
    </span>
  );
}

function QuestionAnswerUi({ model, answers, setAnswer, moveOrderItem, keyboardField, onFocusField, grade }) {
  if (model.type === 'exercise') {
    return (
      <div className="grid gap-4">
        {model.fields.length > 0 ? model.fields.map((field, index) => (
          <label key={field.id} className="block rounded-2xl border-2 border-slate-200 bg-white p-5">
            <span className="block text-[22px] font-black leading-[1.4] text-slate-900">
              {index + 1}. {field.label}
            </span>
            <textarea
              value={answers[field.id] || ''}
              onChange={(event) => setAnswer(field.id, event.target.value)}
              className={`mt-3 min-h-24 w-full resize-none rounded-xl border-2 bg-white px-4 py-3 text-[22px] font-bold leading-8 outline-none ${keyboardField === field.id ? 'border-indigo-500' : 'border-slate-200'}`}
              placeholder="Antwoord van de klas"
              data-presenter-interactive="true"
            />
            <span className="mt-3 block">
              <KeyboardToggle
                active={keyboardField === field.id}
                onToggle={() => onFocusField(keyboardField === field.id ? '' : field.id)}
              />
            </span>
          </label>
        )) : (
          <p className="rounded-2xl bg-slate-100 p-5 text-[22px] font-bold text-slate-500">Deze opdracht heeft geen invulvelden.</p>
        )}
        <p className="text-[18px] font-bold text-slate-500">
          Dit is een inleveropdracht zonder antwoordsleutel. Bespreek hem klassikaal en markeer hem als besproken.
        </p>
      </div>
    );
  }

  if (model.type === 'invullen') {
    return (
      <div className="rounded-2xl bg-indigo-50/70 p-5 text-[26px] leading-[2.3] text-slate-900">
        {model.segments.map((segment, index) => {
          if (segment.type !== 'gap') {
            return <span key={`text-${index}`} className="whitespace-pre-wrap">{segment.text}</span>;
          }

          const fieldIndex = model.fields.findIndex((field) => field.id === segment.id);
          return (
            <BoardTextField
              key={segment.id}
              id={segment.id}
              value={answers[segment.id]}
              placeholder={`Veld ${fieldIndex + 1}`}
              active={keyboardField === segment.id}
              onFocusField={onFocusField}
              onChange={(value) => setAnswer(segment.id, value)}
              className={`mx-2 inline-flex min-h-14 min-w-40 rounded-xl border-2 bg-white px-4 py-2 text-[24px] font-black outline-none ${partStatusClass(grade, segment.id) || 'border-indigo-200'}`}
            />
          );
        })}
      </div>
    );
  }

  if (model.type === 'meerkeuze') {
    return (
      <div className="grid gap-3">
        {model.options.map((option) => {
          const selected = Boolean(answers[option.id]);
          const statusClass = partStatusClass(grade, option.id);
          return (
            <button
              type="button"
              key={option.id}
              onClick={() => setAnswer(option.id, !selected)}
              className={`min-h-20 rounded-2xl border-2 px-6 py-4 text-left text-[24px] font-black leading-[1.35] text-slate-900 ${statusClass || (selected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white')}`}
              data-presenter-interactive="true"
            >
              {option.text}
            </button>
          );
        })}
      </div>
    );
  }

  if (model.type === 'volgorde') {
    const items = answers.orderItems || [];
    return (
      <div className="grid gap-3">
        {items.length > 0 ? items.map((item, index) => (
          <div
            key={item.id}
            className={`flex min-h-20 items-center gap-3 rounded-2xl border-2 bg-white px-4 py-3 text-[24px] font-black text-slate-900 ${partStatusClass(grade, model.orderItems[index]?.id) || 'border-slate-200'}`}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[20px] text-indigo-700">{index + 1}</span>
            <span className="min-w-0 flex-1 whitespace-pre-wrap leading-[1.35]">{item.text}</span>
            <button
              type="button"
              aria-label="Omhoog"
              onClick={() => moveOrderItem(index, index - 1)}
              className="inline-flex h-16 w-16 items-center justify-center rounded-xl border-2 border-slate-200 bg-slate-50"
              data-presenter-interactive="true"
            >
              <ArrowUp size={26} />
            </button>
            <button
              type="button"
              aria-label="Omlaag"
              onClick={() => moveOrderItem(index, index + 1)}
              className="inline-flex h-16 w-16 items-center justify-center rounded-xl border-2 border-slate-200 bg-slate-50"
              data-presenter-interactive="true"
            >
              <ArrowDown size={26} />
            </button>
          </div>
        )) : <p className="rounded-2xl bg-slate-100 p-5 text-[22px] font-bold text-slate-500">Nog geen volgorde-items ingevuld.</p>}
      </div>
    );
  }

  if (model.type === 'koppelen') {
    const pairs = model.pairs || [];
    const selectedLeftId = answers.selectedLeftId || '';
    const rightItems = [...pairs].reverse();

    // Tikken links, dan tikken rechts. Bewust geen slepen: over een halve meter
    // scherm is een sleepdoel met een vinger niet betrouwbaar te raken.
    const chooseLeft = (pairId) => {
      setAnswer('selectedLeftId', selectedLeftId === pairId ? '' : pairId);
    };

    const chooseRight = (pairId) => {
      if (!selectedLeftId) return;
      setAnswer('pairs', {
        ...(answers.pairs || {}),
        [selectedLeftId]: pairId
      });
      setAnswer('selectedLeftId', '');
    };

    return (
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="grid gap-3">
          {pairs.map((pair, index) => {
            const selected = selectedLeftId === pair.id;
            const matchedRight = rightItems.find((item) => item.id === answers.pairs?.[pair.id]);
            const statusClass = partStatusClass(grade, pair.id);

            return (
              <button
                key={pair.id}
                type="button"
                onClick={() => chooseLeft(pair.id)}
                className={`min-h-20 rounded-2xl border-2 px-6 py-4 text-left text-[24px] font-black leading-[1.35] text-slate-900 ${statusClass || (selected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white')}`}
                data-presenter-interactive="true"
              >
                <span className="mr-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[19px] text-slate-700">
                  {index + 1}
                </span>
                {pair.left}
                {matchedRight ? (
                  <span className="mt-2 block text-[18px] font-bold text-indigo-700">Gekoppeld aan: {matchedRight.right}</span>
                ) : null}
              </button>
            );
          })}
        </div>
        <div className="grid gap-3">
          {rightItems.map((pair) => (
            <button
              key={pair.id}
              type="button"
              onClick={() => chooseRight(pair.id)}
              className="min-h-20 rounded-2xl border-2 border-slate-200 bg-white px-6 py-4 text-left text-[24px] font-black leading-[1.35] text-slate-900 disabled:opacity-50"
              disabled={!selectedLeftId}
              data-presenter-interactive="true"
            >
              {pair.right}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (model.type === 'numeriek') {
    return (
      <div className="flex items-center gap-3">
        <BoardTextField
          id="expectedValue"
          value={answers.expectedValue}
          placeholder="Vul het antwoord in"
          active={keyboardField === 'expectedValue'}
          onFocusField={onFocusField}
          onChange={(value) => setAnswer('expectedValue', value)}
          className={`min-h-20 w-full rounded-2xl border-2 bg-white px-6 py-4 text-[30px] font-black outline-none ${partStatusClass(grade, 'expected-value') || 'border-slate-200'}`}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <textarea
        value={answers.openAnswer || ''}
        onChange={(event) => setAnswer('openAnswer', event.target.value)}
        className={`min-h-44 w-full resize-none rounded-2xl border-2 bg-white px-6 py-4 text-[24px] font-bold leading-9 outline-none ${partStatusClass(grade, 'model-answer') || 'border-slate-200'} ${keyboardField === 'openAnswer' ? 'border-indigo-500' : ''}`}
        placeholder="Typ het antwoord van de klas..."
        data-presenter-interactive="true"
      />
      <KeyboardToggle
        active={keyboardField === 'openAnswer'}
        onToggle={() => onFocusField(keyboardField === 'openAnswer' ? '' : 'openAnswer')}
      />
    </div>
  );
}

function KeyboardToggle({ active, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex min-h-16 w-fit items-center gap-3 rounded-2xl border-2 border-slate-300 bg-white px-6 text-[18px] font-black text-slate-700"
      data-presenter-interactive="true"
    >
      <Keyboard size={24} />
      {active ? 'Toetsenbord sluiten' : 'Toetsenbord'}
    </button>
  );
}
