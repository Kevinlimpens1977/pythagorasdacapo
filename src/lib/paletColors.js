/**
 * Color Palette & Emoji Constants
 * Pastel colors for hierarchy items (vak, leerjaar, niveau, hoofdstuk)
 */

export const PASTEL_COLORS = [
  { id: 'gray',   bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' },  // default
  { id: 'blue',   bg: '#DBEAFE', text: '#1E40AF', border: '#BFDBFE' },
  { id: 'indigo', bg: '#E0E7FF', text: '#3730A3', border: '#C7D2FE' },
  { id: 'purple', bg: '#EDE9FE', text: '#5B21B6', border: '#DDD6FE' },
  { id: 'pink',   bg: '#FCE7F3', text: '#9D174D', border: '#FBCFE8' },
  { id: 'red',    bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
  { id: 'orange', bg: '#FFEDD5', text: '#9A3412', border: '#FED7AA' },
  { id: 'amber',  bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
  { id: 'lime',   bg: '#ECFCCB', text: '#3F6212', border: '#D9F99D' },
  { id: 'green',  bg: '#DCFCE7', text: '#14532D', border: '#BBF7D0' },
  { id: 'teal',   bg: '#CCFBF1', text: '#134E4A', border: '#99F6E4' },
  { id: 'cyan',   bg: '#CFFAFE', text: '#164E63', border: '#A5F3FC' },
  { id: 'slate',  bg: '#F1F5F9', text: '#334155', border: '#CBD5E1' },
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
