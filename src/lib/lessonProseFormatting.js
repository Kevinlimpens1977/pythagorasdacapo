// Leesopmaak voor de studeerroute.
//
// De lesstof komt als kale HTML uit de CMS: meestal één of twee <p>'s zonder
// kopjes en zonder vette begrippen. In een schoolboek springen de kernbegrippen
// er wél uit. Deze laag doet dat alsnog, zonder ook maar één woord aan de tekst
// toe te voegen of te veranderen: er wordt uitsluitend nadruk (<strong>) om
// bestaande woorden gezet.
//
// Twee bronnen, in deze volgorde:
// 1. Begrippen die de docent zelf meegaf (content.keyTerms / kernbegrippen).
// 2. Anders: begrippen die deterministisch uit de tekst zelf volgen — namen van
//    programma's en platforms (HELIX, OneDrive, Outlook, school-ELO). Die zijn
//    herkenbaar aan hun hoofdletters, niet aan een woordenlijst.
//
// Staat er al nadruk in de HTML, dan blijft de tekst onaangeraakt: de docent
// heeft het dan zelf opgemaakt.

const TAG_SEGMENT_PATTERN = /(<[^>]+>)/g;
const TAG_PATTERN = /<[^>]*>/g;
const EXPLICIT_EMPHASIS_PATTERN = /<(strong|b)\b/i;

// Binnen deze elementen wordt niets extra vet gezet: een kop is al nadruk, een
// link heeft zijn eigen opmaak en in code/pre zou markup de betekenis breken.
const SKIP_TAGS = new Set(['a', 'strong', 'b', 'em', 'i', 'code', 'pre', 'kbd', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

const MAX_KEY_TERMS = 6;

// Hoofdletterwoorden die als gewoon zinswoord voorkomen; die zijn geen begrip.
const TERM_STOPWORDS = new Set([
  'ik', 'je', 'jij', 'jouw', 'we', 'wij', 'u', 'hij', 'zij', 'het', 'de', 'een',
  'en', 'maar', 'want', 'dus', 'of', 'als', 'dan', 'zo', 'ook', 'niet', 'nee', 'ja',
  'let', 'op', 'tip', 'stap', 'vraag', 'antwoord', 'voorbeeld', 'opdracht'
]);

const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const tagName = (segment) => {
  const match = /^<\s*\/?\s*([a-zA-Z][a-zA-Z0-9-]*)/.exec(segment);
  return match ? match[1].toLowerCase() : '';
};

const isClosingTag = (segment) => /^<\s*\//.test(segment);
const isSelfClosingTag = (segment) => /\/\s*>$/.test(segment);

export const hasExplicitEmphasis = (html) => EXPLICIT_EMPHASIS_PATTERN.test(String(html || ''));

// Losse begrippenlijst uit de blokinhoud: mag een array of een komma-lijst zijn.
export const readExplicitKeyTerms = (content = {}) => {
  const raw =
    content?.keyTerms ??
    content?.kernbegrippen ??
    content?.begrippen ??
    content?.keywords ??
    null;

  const list = Array.isArray(raw) ? raw : typeof raw === 'string' ? raw.split(/[,;\n]/) : [];
  const seen = new Set();
  const terms = [];

  for (const entry of list) {
    const term = String(entry || '').trim();
    if (term.length < 2) continue;
    const key = term.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    terms.push(term);
  }

  return terms;
};

const plainTextFrom = (html) =>
  String(html || '')
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(TAG_PATTERN, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const TOKEN_PATTERN = /[\p{L}\p{N}]+(?:[-'’][\p{L}\p{N}]+)*/gu;

const looksLikeName = (token, isSentenceStart) => {
  if (token.length < 3) return false;
  // Codes als "21A" of "3D" zijn geen kernbegrip; een begrip begint met een letter.
  if (!/^\p{L}/u.test(token)) return false;
  if (TERM_STOPWORDS.has(token.toLowerCase())) return false;

  // OneDrive, school-ELO, iPad: een hoofdletter middenin het woord is altijd
  // een merk- of programmanaam, waar de zin ook begint.
  if (/[\p{Lu}]/u.test(token.slice(1))) return true;

  // HELIX: volledig kapitaal.
  if (token === token.toUpperCase() && /[\p{Lu}]{3,}/u.test(token)) return true;

  // Outlook, Word-bestand: hoofdletter middenin de zin, dus geen zinsopener.
  if (!isSentenceStart && /^[\p{Lu}]/u.test(token)) return true;

  return false;
};

// Leidt maximaal `limit` kernbegrippen uit de tekst zelf af. Volledig
// deterministisch: dezelfde tekst geeft altijd dezelfde begrippen.
export const deriveLessonKeyTerms = (html, { limit = MAX_KEY_TERMS } = {}) => {
  const text = plainTextFrom(html);
  if (!text) return [];

  const sentences = text.split(/(?:[.!?:;]+|\s[-–—]\s)/);
  const seen = new Set();
  const terms = [];

  for (const sentence of sentences) {
    const tokens = sentence.match(TOKEN_PATTERN);
    if (!tokens) continue;

    tokens.forEach((token, index) => {
      if (terms.length >= limit) return;
      if (!looksLikeName(token, index === 0)) return;
      const key = token.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      terms.push(token);
    });

    if (terms.length >= limit) break;
  }

  return terms;
};

const emphasizeTerms = (text, terms, used, caseSensitive) => {
  let result = text;

  for (const term of terms) {
    if (used.has(term)) continue;
    const flags = caseSensitive ? 'u' : 'iu';
    const pattern = new RegExp(`(^|[^\\p{L}\\p{N}-])(${escapeRegExp(term)})(?![\\p{L}\\p{N}-])`, flags);
    if (!pattern.test(result)) continue;
    result = result.replace(pattern, '$1<strong>$2</strong>');
    used.add(term);
  }

  return result;
};

// Docenten typen in de editor soms **zo** of __zo__; dat hoort vet te worden.
const MARKDOWN_BOLD_PATTERN = /\*\*([^*\n]+)\*\*|__([^_\n]+)__/g;

const applyMarkdownBold = (text) =>
  text.replace(MARKDOWN_BOLD_PATTERN, (match, starred, underscored) => {
    const inner = (starred ?? underscored ?? '').trim();
    return inner ? `<strong>${inner}</strong>` : match;
  });

// Zet nadruk in de lopende tekst, en laat alle bestaande markup met rust.
export const enhanceLessonProseHtml = (html, { keyTerms = [], caseSensitive = false } = {}) => {
  const source = String(html || '');
  if (!source) return '';

  const terms = keyTerms.filter((term) => String(term || '').trim().length >= 2);
  const used = new Set();
  const segments = source.split(TAG_SEGMENT_PATTERN);

  let skipDepth = 0;

  return segments
    .map((segment) => {
      if (!segment) return segment;

      if (segment.startsWith('<')) {
        const name = tagName(segment);
        if (SKIP_TAGS.has(name) && !VOID_TAGS.has(name) && !isSelfClosingTag(segment)) {
          if (isClosingTag(segment)) skipDepth = Math.max(0, skipDepth - 1);
          else skipDepth += 1;
        }
        return segment;
      }

      if (skipDepth > 0) return segment;

      let text = applyMarkdownBold(segment);
      if (terms.length) text = emphasizeTerms(text, terms, used, caseSensitive);
      return text;
    })
    .join('');
};

// Eén begrippenlijst per lesblok, ook als het blok in secties uiteenvalt
// (theorie boven, uitgewerkt voorbeeld eronder). Zo bepaalt de hele tekst welke
// begrippen tellen, niet het toevallige stukje dat als eerste gerenderd wordt.
export const createLessonReadingFormatter = (sourceHtml, content = {}) => {
  const source = String(sourceHtml || '');
  const explicit = readExplicitKeyTerms(content);
  const keyTerms = explicit.length ? explicit : hasExplicitEmphasis(source) ? [] : deriveLessonKeyTerms(source);
  const caseSensitive = explicit.length === 0;

  return (html) => {
    const section = String(html || '');
    if (!section.trim()) return section;
    return enhanceLessonProseHtml(section, { keyTerms, caseSensitive });
  };
};

// Wat de leesstap uiteindelijk toont. Eén ingang, zodat theorie, voorbeeld en
// samenvatting allemaal dezelfde behandeling krijgen.
export const formatLessonReadingHtml = (html, content = {}) =>
  createLessonReadingFormatter(html, content)(html);
