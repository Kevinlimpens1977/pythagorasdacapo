import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, CheckCircle2, ExternalLink, FileText, Image, PlayCircle } from 'lucide-react';
import { MEDIA_KINDS, parseYouTubeUrl } from '../../lib/mediaUtils.js';
import {
  getQuestionControlState,
  getQuestionFeedbackStatus,
  getPresenterImportedObjectModel
} from './presenterContentObjectUtils.js';

const htmlValue = (value = '') => ({ __html: value || '' });

const panelClass =
  'h-full w-full overflow-hidden rounded-[18px] border-[3px] bg-[rgb(253,252,249)] text-slate-900 shadow-[0_16px_36px_rgba(15,23,42,0.12)]';

const feedbackBorder = {
  idle: 'border-slate-200',
  correct: 'border-green-500',
  incorrect: 'border-red-500'
};

const getInitialOrderItems = (items = []) => (items.length > 1 ? [...items].reverse() : items);

export default function PresenterImportedObjectCard({ object }) {
  const model = useMemo(() => getPresenterImportedObjectModel(object), [object]);

  if (!model) return null;

  if (model.kind === 'question') return <QuestionCard model={model} />;
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
          <MediaSurface model={model} />
        </div>
        {model.media.caption ? <p className="shrink-0 text-[18px] font-bold leading-7 text-slate-600">{model.media.caption}</p> : null}
      </div>
    </CardShell>
  );
}

function MediaSurface({ model }) {
  const { mediaKind, mediaUrl, altText } = model.media;

  if (!mediaUrl) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center text-slate-500">
        <Image size={52} />
        <p className="text-[22px] font-black text-slate-800">Geen media gekoppeld</p>
      </div>
    );
  }

  if (mediaKind === MEDIA_KINDS.VIDEO) {
    return <video src={mediaUrl} controls playsInline className="h-full w-full bg-slate-950 object-contain" data-presenter-interactive="true" />;
  }

  if (mediaKind === MEDIA_KINDS.YOUTUBE) {
    const embedUrl = parseYouTubeUrl(mediaUrl)?.embedUrl;
    if (embedUrl) {
      return (
        <iframe
          src={`${embedUrl}?rel=0`}
          title={model.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full border-0 bg-slate-950"
          data-presenter-interactive="true"
        />
      );
    }
  }

  if (mediaKind === MEDIA_KINDS.PDF) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-5 p-8 text-center">
        <FileText className="text-slate-500" size={68} />
        <p className="max-w-[34rem] text-[24px] font-black leading-tight text-slate-950">{model.title}</p>
        <a
          href={mediaUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-14 items-center gap-3 rounded-2xl bg-slate-950 px-6 py-4 text-[18px] font-black text-slate-50"
          data-presenter-interactive="true"
        >
          <ExternalLink size={22} />
          PDF openen
        </a>
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center p-3">
      <img src={mediaUrl} alt={altText || model.title} className="max-h-full max-w-full rounded-xl object-contain" />
    </div>
  );
}

function SlidedeckCard({ model }) {
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
          {model.pdfUrl ? (
            <a
              href={model.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex min-h-14 items-center gap-3 rounded-2xl bg-slate-950 px-6 py-4 text-[18px] font-black text-slate-50"
              data-presenter-interactive="true"
            >
              <ExternalLink size={22} />
              Presentatie openen
            </a>
          ) : (
            <p className="mt-6 text-[18px] font-bold text-slate-500">
              {canOpen ? 'Presentatiepakket gekoppeld.' : 'Nog geen presentatie gekoppeld.'}
            </p>
          )}
        </div>
      </div>
    </CardShell>
  );
}

function QuestionCard({ model }) {
  const [answers, setAnswers] = useState(() => ({
    orderItems: getInitialOrderItems(model.orderItems)
  }));
  const [checked, setChecked] = useState(false);
  const control = getQuestionControlState(model, answers);
  const status = getQuestionFeedbackStatus(model, answers, checked);

  const setAnswer = (field, value) => {
    setAnswers((current) => ({ ...current, [field]: value }));
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

  return (
    <CardShell model={model} className={feedbackBorder[status]}>
      <div className="flex h-full min-h-0 flex-col gap-5">
        {model.promptHtml ? (
          <div
            className="prose prose-lg max-w-none text-[24px] leading-[1.5] text-slate-700 prose-headings:text-slate-950"
            dangerouslySetInnerHTML={htmlValue(model.promptHtml)}
          />
        ) : (
          <p className="text-[22px] font-bold text-slate-500">Nog geen vraagtekst ingevuld.</p>
        )}
        <div className="min-h-0 flex-1 overflow-auto">
          <QuestionAnswerUi model={model} answers={answers} setAnswer={setAnswer} moveOrderItem={moveOrderItem} />
        </div>
        <footer className="flex min-h-16 shrink-0 items-center justify-between gap-4 border-t border-slate-200 pt-4">
          <p className={`text-[20px] font-black ${status === 'correct' ? 'text-green-700' : status === 'incorrect' ? 'text-red-700' : 'text-slate-500'}`}>
            {status === 'correct' ? 'Goed gecontroleerd.' : status === 'incorrect' ? 'Kijk nog eens goed.' : ''}
          </p>
          {control.hasInput ? (
            <button
              type="button"
              className="inline-flex min-h-14 items-center gap-3 rounded-2xl bg-slate-950 px-6 py-4 text-[18px] font-black text-slate-50"
              onClick={() => setChecked(true)}
              data-presenter-interactive="true"
            >
              <CheckCircle2 size={22} />
              Controleer
            </button>
          ) : null}
        </footer>
      </div>
    </CardShell>
  );
}

function QuestionAnswerUi({ model, answers, setAnswer, moveOrderItem }) {
  if (model.type === 'invullen') {
    return (
      <div className="rounded-2xl bg-indigo-50/70 p-5 text-[24px] leading-[2.15] text-slate-900">
        {model.segments.map((segment, index) => {
          if (segment.type !== 'gap') {
            return <span key={`text-${index}`} className="whitespace-pre-wrap">{segment.text}</span>;
          }

          const fieldIndex = model.fields.findIndex((field) => field.id === segment.id);
          return (
            <input
              key={segment.id}
              type="text"
              value={answers[segment.id] || ''}
              onChange={(event) => setAnswer(segment.id, event.target.value)}
              className="mx-2 inline-flex min-h-12 min-w-36 rounded-xl border-2 border-indigo-200 bg-white px-4 py-2 text-[20px] font-black outline-none focus:border-indigo-500"
              placeholder={`Veld ${fieldIndex + 1}`}
              data-presenter-interactive="true"
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
          return (
            <button
              type="button"
              key={option.id}
              onClick={() => setAnswer(option.id, !selected)}
              className={`min-h-16 rounded-2xl border-2 px-5 py-4 text-left text-[20px] font-black text-slate-900 ${selected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'}`}
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
          <div key={item.id} className="flex min-h-16 items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-[20px] font-black text-slate-900">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[18px] text-indigo-700">{index + 1}</span>
            <span className="min-w-0 flex-1 whitespace-pre-wrap">{item.text}</span>
            <button type="button" aria-label="Omhoog" onClick={() => moveOrderItem(index, index - 1)} className="rounded-xl bg-slate-100 p-3" data-presenter-interactive="true">
              <ArrowUp size={21} />
            </button>
            <button type="button" aria-label="Omlaag" onClick={() => moveOrderItem(index, index + 1)} className="rounded-xl bg-slate-100 p-3" data-presenter-interactive="true">
              <ArrowDown size={21} />
            </button>
          </div>
        )) : <p className="rounded-2xl bg-slate-100 p-5 text-[20px] font-bold text-slate-500">Nog geen volgorde-items ingevuld.</p>}
      </div>
    );
  }

  if (model.type === 'numeriek') {
    return (
      <input
        type="number"
        value={answers.expectedValue || ''}
        onChange={(event) => setAnswer('expectedValue', event.target.value)}
        className="min-h-16 w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-[24px] font-black outline-none focus:border-indigo-500"
        placeholder="Vul je antwoord in"
        data-presenter-interactive="true"
      />
    );
  }

  return (
    <textarea
      value={answers.openAnswer || ''}
      onChange={(event) => setAnswer('openAnswer', event.target.value)}
      className="min-h-40 w-full resize-none rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-[22px] font-bold leading-8 outline-none focus:border-indigo-500"
      placeholder="Typ je antwoord..."
      data-presenter-interactive="true"
    />
  );
}
