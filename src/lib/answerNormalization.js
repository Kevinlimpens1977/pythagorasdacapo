/**
 * Normalize answer string for comparison
 * Handles separators, letter order, and case sensitivity
 *
 * Examples:
 * - "ABC en ACD" = "BAC en ADC" = "abc & acd"
 * - All normalize to same value
 */
export const normalizeAnswer = (str) => {
  if (!str) return '';

  // 1. Replace separators with a common one (|)
  let normalized = str.toLowerCase()
    .replace(/\s+en\s+/g, '|')
    .replace(/\+/g, '|')
    .replace(/&/g, '|')
    .replace(/,/g, '|')
    .replace(/;/g, '|');

  // 2. Split into parts
  let parts = normalized.split('|').map(p => {
    // 3. For each part, remove all whitespace
    let clean = p.replace(/\s+/g, '');

    // 4. Sort letters alphabetically in each part (works for any length)
    if (/^[a-z]+$/.test(clean) && clean.length > 0) {
      return clean.split('').sort().join('');
    }
    return clean;
  }).filter(p => p !== '');

  // 5. Sort the parts alphabetically and join
  return parts.sort().join(' ');
};

/**
 * Check if student answer matches any of the correct answers
 * Uses normalization for flexible matching
 */
export const isAnswerCorrect = (studentAnswer, correctAnswers) => {
  const normalizedStudent = normalizeAnswer(studentAnswer?.toString() || '');
  const possibleAnswers = Array.isArray(correctAnswers) ? correctAnswers : [correctAnswers];

  return possibleAnswers.some(ans => normalizeAnswer(ans.toString()) === normalizedStudent);
};
