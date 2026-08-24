// Toetsenblokken voor het digibord. Aan een aanraakscherm hangt zelden een
// fysiek toetsenbord, dus invul- en getalvragen krijgen hun eigen grote
// toetsen. Pure logica, zodat het in src/lib getest kan worden.

export const BOARD_KEY_BACKSPACE = '{backspace}';
export const BOARD_KEY_CLEAR = '{clear}';
export const BOARD_KEY_SPACE = '{space}';

// Rijen van het letterbord. Bewust geen volledige pc-layout: alleen wat een
// leerling nodig heeft om een woord of getal in te typen.
export const BOARD_LETTER_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.']
];

export const BOARD_NUMBER_ROW = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

// Numeriek blok in telefoonindeling, met komma en minteken omdat Nederlandse
// leerlingen "3,5" en "-4" invoeren.
export const BOARD_NUMERIC_ROWS = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['-', '0', ',']
];

export const applyBoardKey = (value, key) => {
  const current = String(value ?? '');

  if (key === BOARD_KEY_CLEAR) return '';
  if (key === BOARD_KEY_BACKSPACE) return current.slice(0, -1);
  if (key === BOARD_KEY_SPACE) return `${current} `;
  if (typeof key !== 'string' || key === '') return current;

  return `${current}${key}`;
};

export const applyBoardKeys = (value, keys = []) =>
  keys.reduce((current, key) => applyBoardKey(current, key), String(value ?? ''));

export const getBoardKeyLabel = (key) => {
  if (key === BOARD_KEY_BACKSPACE) return 'Wis';
  if (key === BOARD_KEY_CLEAR) return 'Leeg';
  if (key === BOARD_KEY_SPACE) return 'Spatie';
  return String(key ?? '');
};

export const shiftBoardKey = (key, shifted) => {
  if (!shifted || typeof key !== 'string' || key.length !== 1) return key;
  return key.toUpperCase();
};
