/**
 * Color Palette & Emoji Constants
 * Pastel colors for hierarchy items (vak, leerjaar, niveau, hoofdstuk).
 * Tinten uit het Helix Slide Design System v2 (soft-vlakken met ink-tekst).
 */

export const PASTEL_COLORS = [
  { id: 'gray',   bg: '#F5EDDB', text: '#433F36', border: '#D3C7AE' },  // default (paper-2)
  { id: 'blue',   bg: '#E1F0F8', text: '#066A99', border: '#BED8EA' },
  { id: 'indigo', bg: '#DCEAF4', text: '#175477', border: '#9CC7E0' },
  { id: 'purple', bg: '#ECE3F8', text: '#5F2C9E', border: '#D4C2EE' },
  { id: 'pink',   bg: '#FADDDA', text: '#8C2F26', border: '#F5A594' },
  { id: 'red',    bg: '#FADDDA', text: '#B42F25', border: '#F5A594' },
  { id: 'orange', bg: '#FDE7D6', text: '#B4520E', border: '#FFBF98' },
  { id: 'amber',  bg: '#FFF0B8', text: '#7C5A00', border: '#FFE58A' },
  { id: 'lime',   bg: '#E9F3E0', text: '#266745', border: '#C4E0C6' },
  { id: 'green',  bg: '#DFF2E7', text: '#237A4D', border: '#A3CEAC' },
  { id: 'teal',   bg: '#DCF1F1', text: '#0A6F72', border: '#A8DADB' },
  { id: 'cyan',   bg: '#D2ECEC', text: '#0A6F72', border: '#8FCDCE' },
  { id: 'slate',  bg: '#F5EDDB', text: '#433F36', border: '#D3C7AE' },
];

export const EMOJI_SET = [
  '📚','📖','📝','📐','📏','🔢','✏️','📌','🗒️','🗓️',
  '🎓','🏫','🔬','🔭','🎯','⭐','🌟','💡','🧮','🧪',
  '🧬','🎨','🎵','🌍','🗺️','🏆','🥇','💪','🚀','🌈',
  '🌊','⚡','🔥','❄️','🌸','🍎','🧩','🎲','📊','📈',
  '🔍','💼','🗂️','📋','📁','➕','✖️','➗','∑','🔑',
  '🎁','🎪','🎢','🎡','🎭','🎬','🎤','🎧','🎸','🎹',
  '✈️','🚗','🚢','🏠','🏛️','🗼','💻','⌚','📱','🖨️',
];

/**
 * Get color style object by color ID
 * Returns { bg, text, border } hex values
 * Falls back to gray (default) if ID not found
 */
export function getColorStyle(colorId) {
  const color = PASTEL_COLORS.find(c => c.id === colorId) || PASTEL_COLORS[0];
  return { bg: color.bg, text: color.text, border: color.border };
}

/**
 * Get color object by ID
 */
export function getColor(colorId) {
  return PASTEL_COLORS.find(c => c.id === colorId) || PASTEL_COLORS[0];
}
