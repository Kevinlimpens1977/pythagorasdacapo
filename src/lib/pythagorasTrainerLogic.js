export const PYTHAGORAS_TRAINER_ROUNDS = [
  {
    id: 'round-1',
    prompt: 'Een rechthoekige driehoek heeft rechthoekszijden 3 cm en 4 cm. Hoe lang is de schuine zijde?',
    sides: { a: 3, b: 4, c: null },
    target: 'c',
    answer: 5,
    unit: 'cm',
    hint: 'Bereken c met a^2 + b^2 = c^2.'
  },
  {
    id: 'round-2',
    prompt: 'Een ladder staat 8 m van de muur en raakt de muur op 15 m hoogte. Hoe lang is de ladder?',
    sides: { a: 8, b: 15, c: null },
    target: 'c',
    answer: 17,
    unit: 'm',
    hint: 'De ladder is de schuine zijde.'
  },
  {
    id: 'round-3',
    prompt: 'De schuine zijde is 13 cm. Een rechthoekszijde is 5 cm. Hoe lang is de andere rechthoekszijde?',
    sides: { a: 5, b: null, c: 13 },
    target: 'b',
    answer: 12,
    unit: 'cm',
    hint: 'Gebruik b^2 = c^2 - a^2.'
  },
  {
    id: 'round-4',
    prompt: 'Een rechthoek heeft zijden van 6 m en 8 m. Hoe lang is de diagonaal?',
    sides: { a: 6, b: 8, c: null },
    target: 'c',
    answer: 10,
    unit: 'm',
    hint: 'De diagonaal is de schuine zijde van twee rechthoekige driehoeken.'
  },
  {
    id: 'round-5',
    prompt: 'De schuine zijde is 25 cm. Een rechthoekszijde is 7 cm. Hoe lang is de andere rechthoekszijde?',
    sides: { a: 7, b: null, c: 25 },
    target: 'b',
    answer: 24,
    unit: 'cm',
    hint: 'Trek het kwadraat van 7 af van het kwadraat van 25.'
  }
];

export const normalizeNumericAnswer = (value) => {
  const normalized = String(value ?? '')
    .trim()
    .replace(',', '.');
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
};

export const isPythagorasAnswerCorrect = (value, answer, tolerance = 0.05) => {
  const parsed = normalizeNumericAnswer(value);
  if (parsed === null) return false;

  return Math.abs(parsed - answer) <= tolerance;
};

export const calculatePythagorasTrainerScore = (roundResults = []) => {
  return roundResults.filter((result) => result?.isCorrect).length;
};
