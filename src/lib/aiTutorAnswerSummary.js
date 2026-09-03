import { getMathToolSummary } from './mathToolboxUtils.js';

const stripHtml = (value = '') =>
  String(value || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

const optionLabelForIndex = (index) => String.fromCharCode(97 + index);

const summarizeMultipleChoiceAnswer = ({ vraag = {}, previewAnswers = {} }) => {
  const options = Array.isArray(vraag?.antwoord?.options) ? vraag.antwoord.options : [];
  const selectedOptions = options
    .map((option, index) => {
      const fieldId = option.id || `option-${index + 1}`;
      return {
        label: optionLabelForIndex(index),
        text: String(option.text || `Optie ${index + 1}`).trim(),
        selected: Boolean(previewAnswers[fieldId]),
        correct: option.correct === true
      };
    })
    .filter((option) => option.selected);

  if (!selectedOptions.length) {
    return [
      'Vraagtype: meerkeuze',
      'Leerling heeft nog geen optie gekozen.',
      'Docentinstructie: laat de leerling eerst zelf een keuze maken.'
    ].join('\n');
  }

  const allSelectedOptionsAreCorrect = selectedOptions.every((option) => option.correct);
  const allCorrectOptionsSelected = options.every((option, index) => {
    const fieldId = option.id || `option-${index + 1}`;
    return Boolean(previewAnswers[fieldId]) === Boolean(option.correct);
  });
  const selectedStatus = allSelectedOptionsAreCorrect && allCorrectOptionsSelected ? 'juist' : 'onjuist';
  const selectedText = selectedOptions
    .map((option) => `${option.label}: ${option.text} (${option.correct ? 'juist' : 'onjuist'})`)
    .join(', ');

  return [
    'Vraagtype: meerkeuze',
    `Gekozen optie(s): ${selectedText}`,
    `Antwoordstatus: gekozen antwoord is ${selectedStatus}.`,
    'Docentinstructie: verklap het juiste antwoord niet; gebruik alleen of de gekozen optie klopt om een denkstapvraag te stellen.'
  ].join('\n');
};

/**
 * Samenvatting van een fout beantwoorde toets- of quizvraag voor Digidocent in
 * de herkansingsronde. De leerlingbrowser kent de sleutel niet, dus hier staat
 * alleen wat de leerling koos en dat dat onjuist was; de server voegt de
 * foutdiagnose toe uit de vraagdefinitie. De vaste regels ("Gekozen optie(s):",
 * "Antwoordstatus:") zijn dezelfde die de server herkent als echte poging.
 */
export const buildAssessmentItemTutorSummary = ({ item = {}, answer = null } = {}) => {
  const type = item.type || item.vraagtype || 'open';
  const prompt = stripHtml(item.prompt || '');
  const waarde = answer && typeof answer === 'object' && !Array.isArray(answer) && 'value' in answer ? answer.value : answer;

  if (type === 'meerkeuze' || type === 'waar-niet-waar') {
    const options = Array.isArray(item.answer?.options) && item.answer.options.length ? item.answer.options : (item.options || []);
    const gekozen = (Array.isArray(waarde) ? waarde : [waarde]).filter(Boolean);
    const gekozenTekst = options
      .map((option, index) => ({ label: optionLabelForIndex(index), text: String(option.text || '').trim(), id: option.id }))
      .filter((option) => gekozen.includes(option.id))
      .map((option) => `${option.label}: ${option.text} (onjuist)`)
      .join(', ');

    return [
      prompt ? `Vraag: ${prompt}` : '',
      'Vraagtype: meerkeuze',
      gekozenTekst ? `Gekozen optie(s): ${gekozenTekst}` : 'Leerling heeft nog geen optie gekozen.',
      'Antwoordstatus: gekozen antwoord is onjuist (eerste ronde), de leerling herkanst nu.',
      'Docentinstructie: verklap het juiste antwoord niet; help de leerling zien waarom de gekozen optie niet klopt.'
    ].filter(Boolean).join('\n');
  }

  return [
    prompt ? `Vraag: ${prompt}` : '',
    `Vraagtype: ${type}`,
    `Leerlingpoging: ${JSON.stringify(waarde ?? '')}`,
    'Antwoordstatus: gekozen antwoord is onjuist (eerste ronde), de leerling herkanst nu.',
    'Docentinstructie: verklap het juiste antwoord niet; stel een denkstapvraag over de gemaakte fout.'
  ].filter(Boolean).join('\n');
};

export const buildAiTutorStudentAnswerSummary = ({
  vraag = {},
  preview = {},
  previewAnswers = {},
  bodyHtml = ''
} = {}) => {
  const type = preview.type || vraag.vraagtype || vraag.antwoord?.type || 'open';
  const prompt = stripHtml(vraag.content?.text || bodyHtml || vraag.title || '');

  if (type === 'meerkeuze') {
    return [
      prompt ? `Vraag: ${prompt}` : '',
      summarizeMultipleChoiceAnswer({ vraag, previewAnswers })
    ].filter(Boolean).join('\n');
  }

  return [
    `Vraagtype: ${type}`,
    prompt ? `Vraag: ${prompt}` : '',
    `Leerlingpoging: ${JSON.stringify(previewAnswers)}`,
    getMathToolSummary(previewAnswers.mathTools)
  ].filter(Boolean).join('\n');
};
