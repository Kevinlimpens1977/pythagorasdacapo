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

// Studeerweergave: elke stap staat in exact hetzelfde kader (.study-block). Het
// verschil tussen uitleg en een uitgewerkt voorbeeld zit daarom niet meer in de
// kaartvorm maar in één klein gekleurd labeltje bovenaan de inhoud.
const LESSON_READING_PRESENTATIONS = {
  example: {
    eyebrow: 'Voorbeeld',
    chipClass: 'bg-sky-100 text-sky-800'
  },
  summary: {
    eyebrow: 'Samenvatting',
    chipClass: 'bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]'
  }
};

export const getLessonReadingPresentation = (type) => LESSON_READING_PRESENTATIONS[type] || null;

const EXAMPLE_HEADING_TEXT_PATTERN = /^\s*(?:uitgewerkt\s+)?voorbeeld(?:en)?\b/i;

const headingText = (html = '') =>
  String(html)
    .replace(HTML_SPACE_ENTITY_PATTERN, ' ')
    .replace(TAG_PATTERN, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Docenten zetten een uitgewerkt voorbeeld vaak als kopje "Voorbeeld" midden in de
// theorietekst. In de studeerweergave knippen we dat eruit zodat het als apart
// voorbeeldblok onder de theorie komt te staan.
export const splitLessonExampleSection = (html) => {
  const source = String(html || '');
  const empty = { theoryHtml: source, exampleHtml: '', exampleLabel: '' };
  if (!source) return { theoryHtml: '', exampleHtml: '', exampleLabel: '' };

  const headingPattern = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match = headingPattern.exec(source);

  while (match) {
    const label = headingText(match[2]);
    if (EXAMPLE_HEADING_TEXT_PATTERN.test(label)) {
      const theoryHtml = source.slice(0, match.index);
      const exampleHtml = source.slice(match.index + match[0].length);
      // Zonder theorie ervoor is er niets om af te splitsen; laat het blok dan heel.
      if (!hasRenderableLessonHtml(theoryHtml)) return empty;
      if (!hasRenderableLessonHtml(exampleHtml)) return empty;
      return { theoryHtml, exampleHtml, exampleLabel: label };
    }
    match = headingPattern.exec(source);
  }

  return empty;
};

// Een blok kan zijn voorbeeld ook als apart veld meekrijgen; dat wint van de split.
export const resolveLessonReadingSections = ({ type = '', bodyHtml = '', content = {} } = {}) => {
  const source = String(bodyHtml || '');
  const explicitExample = content?.exampleHtml || content?.example || '';

  if (hasRenderableLessonHtml(explicitExample)) {
    return { theoryHtml: source, exampleHtml: String(explicitExample), exampleLabel: '' };
  }

  if (type !== 'theory') {
    return { theoryHtml: source, exampleHtml: '', exampleLabel: '' };
  }

  return splitLessonExampleSection(source);
};
