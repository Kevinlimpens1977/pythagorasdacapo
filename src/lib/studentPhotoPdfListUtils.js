export const normalizePdfListSpaces = (value = '') => String(value || '').trim().replace(/\s+/g, ' ');

export const groupPdfWordsIntoLines = (words) => {
  const sorted = [...words].sort((a, b) => a.y - b.y || a.x - b.x);
  const lines = [];

  for (const word of sorted) {
    const line = lines.find((candidate) => Math.abs(candidate.y - word.y) <= Math.max(4, word.height * 0.65));
    if (!line) {
      lines.push({ y: word.y, words: [word] });
      continue;
    }
    line.words.push(word);
    line.y = line.words.reduce((total, item) => total + item.y, 0) / line.words.length;
  }

  return lines.map((line) => ({
    ...line,
    words: line.words.sort((a, b) => a.x - b.x)
  }));
};

export const splitPdfLineIntoNameSegments = (line, gapThreshold) => {
  const segments = [];

  for (const word of line.words) {
    const previous = segments[segments.length - 1];
    const previousWord = previous?.words[previous.words.length - 1];
    const gap = previousWord ? word.x - previousWord.right : 0;

    if (!previous || gap > gapThreshold) {
      segments.push({ words: [word] });
    } else {
      previous.words.push(word);
    }
  }

  return segments.map((segment) => {
    const left = Math.min(...segment.words.map((word) => word.x));
    const top = Math.min(...segment.words.map((word) => word.y));
    const right = Math.max(...segment.words.map((word) => word.right));
    const bottom = Math.max(...segment.words.map((word) => word.bottom));
    return {
      text: normalizePdfListSpaces(segment.words.map((word) => word.text).join(' ')),
      x: left,
      y: top,
      width: right - left,
      height: bottom - top,
      right,
      bottom
    };
  });
};

export const mergeWrappedPdfNameSegments = (segments, mergeGap) => {
  const sorted = [...segments].sort((a, b) => a.y - b.y || a.x - b.x);
  const groups = [];

  for (const segment of sorted) {
    const candidate = groups.find((group) => {
      const verticalGap = segment.y - group.bottom;
      const startsClose = Math.abs(segment.x - group.x) <= Math.max(mergeGap, group.width * 0.25);
      const overlap = Math.max(0, Math.min(segment.right, group.right) - Math.max(segment.x, group.x));
      return verticalGap >= -2 && verticalGap <= mergeGap && (startsClose || overlap > 0);
    });

    if (!candidate) {
      groups.push({ ...segment });
      continue;
    }

    const left = Math.min(candidate.x, segment.x);
    const top = Math.min(candidate.y, segment.y);
    const right = Math.max(candidate.right, segment.right);
    const bottom = Math.max(candidate.bottom, segment.bottom);
    candidate.text = normalizePdfListSpaces(`${candidate.text} ${segment.text}`);
    candidate.x = left;
    candidate.y = top;
    candidate.width = right - left;
    candidate.height = bottom - top;
    candidate.right = right;
    candidate.bottom = bottom;
  }

  return groups;
};

export const isLikelyPdfStudentName = (label) => {
  const text = normalizePdfListSpaces(label.text);
  if (text.length < 3) return false;
  if (/\d|@|pagina|schooljaar|locatie|docent|aantal|lesgroep|fotolijst/i.test(text)) return false;
  return /[A-Za-z\u00C0-\u017F]/.test(text);
};
