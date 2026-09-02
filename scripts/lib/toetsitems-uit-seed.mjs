/**
 * Zet vragen uit een seedbestand om in toetsitems zoals de toetsstudio ze
 * opslaat. Gedeeld door plaats-nulmeting-brugklas.mjs en
 * plaats-kennischeck-devices.mjs.
 *
 * Ondersteunde types per vraag:
 *   meerkeuze      { opties: ['tekst', ...] + juist: index }  of
 *                  { opties: [{ tekst, juist, uitleg }] }; met meerdere juiste
 *                  opties toont de leerling vanzelf checkboxes.
 *   waar-niet-waar { juist: true|false }
 *   numeriek       { antwoord, tolerantie?, eenheid?, hint? }
 *   invullen       { tekst: 'Zin met [antwoord|alternatief] erin.' }
 *   koppelen       { paren: [{ links, rechts }] }
 *   volgorde       { stappen: ['eerst', 'dan', ...] }   (in de juiste volgorde)
 *   open           { modelantwoord, rubric?, docentnotitie? }
 */

import { normalizeAssessmentItems } from '../../src/lib/assessmentBlockUtils.js';

const itemId = (slug, vraag, index) => `${slug}-${String(vraag.nr ?? index + 1).padStart(2, '0')}`;

// Invultekst: "De hoofdstad is [Amsterdam|amsterdam]." -> segmenten + gaten.
const bouwInvullen = (id, tekst) => {
  const segments = [];
  const gaps = [];
  const regex = /\[([^\]]+)\]/g;
  let laatste = 0;
  let match;
  while ((match = regex.exec(tekst)) !== null) {
    if (match.index > laatste) segments.push({ type: 'text', text: tekst.slice(laatste, match.index) });
    const [antwoord, ...alternatieven] = match[1].split('|').map((s) => s.trim());
    const gapId = `${id}-gap-${gaps.length + 1}`;
    gaps.push({ id: gapId, answer: antwoord, alternatives: alternatieven });
    segments.push({ type: 'gap', id: gapId });
    laatste = regex.lastIndex;
  }
  if (laatste < tekst.length) segments.push({ type: 'text', text: tekst.slice(laatste) });
  return { type: 'invullen', text: tekst.replace(regex, '___'), segments, gaps };
};

const bouwAntwoord = (vraag, id) => {
  const type = vraag.type;
  if (type === 'meerkeuze') {
    return {
      type: 'meerkeuze',
      options: vraag.opties.map((optie, index) => ({
        id: `${id}-${String.fromCharCode(97 + index)}`,
        text: typeof optie === 'string' ? optie : optie.tekst,
        correct: typeof optie === 'string' ? index === vraag.juist : optie.juist === true,
        explanation: (typeof optie === 'object' && optie.uitleg) || '',
        misconception: ''
      }))
    };
  }
  if (type === 'waar-niet-waar') {
    return {
      type: 'meerkeuze',
      options: [
        { id: `${id}-waar`, text: 'Waar', correct: vraag.juist === true, explanation: vraag.juist === true ? vraag.uitleg || '' : (vraag.uitlegFout || ''), misconception: '' },
        { id: `${id}-niet-waar`, text: 'Niet waar', correct: vraag.juist === false, explanation: vraag.juist === false ? vraag.uitleg || '' : (vraag.uitlegFout || ''), misconception: '' }
      ]
    };
  }
  if (type === 'numeriek') {
    return { type: 'numeriek', expected: vraag.antwoord, tolerance: vraag.tolerantie ?? 0, unit: vraag.eenheid || '', hintBijFout: vraag.hint || '' };
  }
  if (type === 'invullen') return bouwInvullen(id, vraag.tekst);
  if (type === 'koppelen') {
    return { type: 'koppelen', pairs: vraag.paren.map((paar, index) => ({ id: `${id}-pair-${index + 1}`, left: paar.links, right: paar.rechts })) };
  }
  if (type === 'volgorde') {
    return { type: 'volgorde', items: vraag.stappen.map((stap, index) => ({ id: `${id}-stap-${index + 1}`, text: stap })) };
  }
  if (type === 'open') {
    return { type: 'open', modelAnswer: vraag.modelantwoord || '', rubric: vraag.rubric || '', teacherNotes: vraag.docentnotitie || '' };
  }
  throw new Error(`Onbekend vraagtype "${type}" bij vraag ${id}`);
};

export const bouwToetsitems = (vragen, { slug, leerdoel = '', scaffoldingRole = 'bewijs_leveren' } = {}) =>
  normalizeAssessmentItems(vragen.map((vraag, index) => {
    const id = itemId(slug, vraag, index);
    return {
      id,
      type: vraag.type,
      prompt: vraag.vraag,
      answer: bouwAntwoord(vraag, id),
      feedback: vraag.uitleg || '',
      tokens: Math.max(0, Math.round(Number(vraag.tokens) || 0)),
      taxonomy: {
        learningGoal: vraag.leerdoel || leerdoel,
        cognitiveSkill: vraag.vaardigheid || 'herkennen',
        masteryLevel: vraag.niveau || 'basis',
        scaffoldingRole
      }
    };
  }));

export const telTypes = (items) =>
  Object.entries(items.reduce((acc, item) => ({ ...acc, [item.type]: (acc[item.type] || 0) + 1 }), {}))
    .map(([type, aantal]) => `${aantal}x ${type}`)
    .join(', ');
