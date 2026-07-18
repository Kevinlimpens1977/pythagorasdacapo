const TAG_PATTERN = /<[^>]*>/g;
const HTML_SPACE_ENTITY_PATTERN = /&nbsp;|&#160;/gi;
const VISUAL_CONTENT_PATTERN = /<(img|iframe|video|audio|table|svg)\b/i;

// Bepaalt of lesblok-HTML echte inhoud bevat, of alleen lege tags/placeholder-ruimte.
export const hasRenderableLessonHtml = (html) => {
  if (!html) return false;
  const source = String(html);
  const text = source
    .replace(HTML_SPACE_ENTITY_PATTERN, ' ')
    .replace(TAG_PATTERN, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text) return true;
  return VISUAL_CONTENT_PATTERN.test(source);
};

// Rustig visueel accent per bloktype, zodat voorbeeld en samenvatting zich
// onderscheiden van theorie zonder drukke opmaak.
const LESSON_BLOCK_ACCENTS = {
  example: {
    eyebrow: 'Voorbeeld',
    className: 'rounded-3xl border border-sky-100 bg-sky-50/70 p-6'
  },
  summary: {
    eyebrow: 'Samenvatting',
    className: 'rounded-3xl border border-fuchsia-100 bg-[var(--helix-soft-lavender)]/60 p-6'
  }
};

export const getLessonBlockAccent = (type) => LESSON_BLOCK_ACCENTS[type] || null;
