import { CONTENT_BLOCK_LABELS, htmlToPlainText, normalizeContentBlocks } from './contentBlockUtils.js';
import { normalizeMediaContent } from './mediaUtils.js';

const BLOCKS_WITH_PRESENTABLE_STATUS = new Set(['published', undefined, null]);

const decodeHtmlEntities = (value = '') =>
  String(value)
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const sanitizeHtmlForSlide = (html = '') =>
  String(html)
    .replace(/\sdata-[^=]+="[^"]*"/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .trim();

export const extractImageSource = (html = '') => {
  const match = String(html).match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  return match?.[1] || '';
};

export const extractImageAlt = (html = '') => {
  const match = String(html).match(/<img[^>]+alt=["']([^"']*)["'][^>]*>/i);
  return decodeHtmlEntities(match?.[1] || '');
};

const removeImages = (html = '') => String(html).replace(/<img\b[^>]*>/gi, '').trim();

const isHeadingToken = (html = '') => /^<h[1-6]\b/i.test(html.trim());
const isImageOnlyToken = (html = '') => {
  const clean = html.trim();
  return /^<img\b/i.test(clean) || (/^<p\b/i.test(clean) && extractImageSource(clean) && !htmlToPlainText(removeImages(clean)));
};

const splitHtmlIntoTokens = (html = '') => {
  const tokens = [];
  const pattern = /<(h[1-6]|p|ul|ol|blockquote)\b[\s\S]*?<\/\1>|<img\b[^>]*>/gi;
  let match;
  while ((match = pattern.exec(String(html))) !== null) {
    tokens.push(match[0]);
  }
  if (tokens.length === 0 && htmlToPlainText(html)) {
    tokens.push(`<p>${htmlToPlainText(html)}</p>`);
  }
  return tokens;
};

const createBaseSlide = (block, variant, segmentIndex, overrides = {}) => ({
  id: `${block.id || 'block'}-${variant}-${segmentIndex}`,
  blockId: block.id,
  sourceType: block.type || 'theory',
  variant,
  title: overrides.title || block.title || CONTENT_BLOCK_LABELS[block.type] || 'Lesblok',
  html: overrides.html || '',
  imageUrl: overrides.imageUrl || '',
  media: overrides.media || null,
  pdfStoragePath: overrides.pdfStoragePath || '',
  slidedeckPackageId: overrides.slidedeckPackageId || '',
  altText: overrides.altText || '',
  question: overrides.question || null,
  meta: {
    blockOrder: block.order || 0,
    segmentIndex,
    status: block.status || 'published',
    ...(overrides.meta || {})
  }
});

const slideHasContent = (slide) =>
  Boolean(
    htmlToPlainText(slide.html) ||
    slide.imageUrl ||
    slide.media?.mediaUrl ||
    slide.question?.promptHtml ||
    slide.question?.imageUrl
  );

const buildTextSlidesFromHtml = (block, html, fallbackImageUrl = '', fallbackAltText = '') => {
  const tokens = splitHtmlIntoTokens(html);
  const slides = [];
  let segmentIndex = 1;
  let current = createBaseSlide(block, 'text', segmentIndex);

  const flushCurrent = () => {
    if (!slideHasContent(current)) return;
    slides.push(current);
    segmentIndex += 1;
    current = createBaseSlide(block, 'text', segmentIndex);
  };

  tokens.forEach((token) => {
    const cleanToken = sanitizeHtmlForSlide(token);
    if (!cleanToken) return;

    if (isHeadingToken(cleanToken)) {
      flushCurrent();
      current.title = htmlToPlainText(cleanToken) || current.title;
      return;
    }

    if (isImageOnlyToken(cleanToken)) {
      const src = extractImageSource(cleanToken);
      const alt = extractImageAlt(cleanToken);
      if (htmlToPlainText(current.html)) {
        flushCurrent();
      }
      slides.push(createBaseSlide(block, 'image', segmentIndex, {
        imageUrl: src,
        altText: alt,
        title: current.title || block.title
      }));
      segmentIndex += 1;
      current = createBaseSlide(block, 'text', segmentIndex);
      return;
    }

    const imageSrc = extractImageSource(cleanToken);
    const textHtml = removeImages(cleanToken);
    if (imageSrc && !current.imageUrl) {
      current.variant = 'mixed';
      current.imageUrl = imageSrc;
      current.altText = extractImageAlt(cleanToken);
    }
    if (htmlToPlainText(textHtml)) {
      current.html = `${current.html}${sanitizeHtmlForSlide(textHtml)}`;
    }
  });

  if (fallbackImageUrl && !slides.some((slide) => slide.imageUrl) && !current.imageUrl) {
    if (htmlToPlainText(current.html)) {
      current.variant = 'mixed';
      current.imageUrl = fallbackImageUrl;
      current.altText = fallbackAltText;
    } else {
      slides.push(createBaseSlide(block, 'image', segmentIndex, {
        imageUrl: fallbackImageUrl,
        altText: fallbackAltText
      }));
      segmentIndex += 1;
    }
  }

  flushCurrent();
  return slides;
};

const buildQuestionSlide = (block, linkedQuestion = null) => {
  const content = block.content || {};
  const questionText = linkedQuestion?.content?.text || linkedQuestion?.text || content.html || content.text || '';
  const answerData = linkedQuestion?.antwoord || content.exercise || {};
  const answerHtml =
    answerData.explanation ||
    answerData.answer ||
    answerData.correctAnswer ||
    answerData.fields?.map((field) => `${field.label || 'Antwoord'}: ${field.answer || ''}`).filter(Boolean).join('<br>') ||
    '';

  return createBaseSlide(block, 'question', 1, {
    title: block.title || linkedQuestion?.title || CONTENT_BLOCK_LABELS.question,
    question: {
      promptHtml: sanitizeHtmlForSlide(questionText || '<p>Nog geen vraagtekst ingevuld.</p>'),
      imageUrl: linkedQuestion?.content?.images?.[0] || content.imageUrl || '',
      answerHtml: answerHtml ? `<p>${answerHtml}</p>` : '',
      explanationHtml: answerData.explanationHtml || ''
    }
  });
};

const buildSlidesForBlock = (block, linkedQuestions = {}) => {
  const content = block.content || {};

  if (block.type === 'game') {
    return [createBaseSlide(block, 'game', 1, {
      title: block.title || content.gameTitle || 'Game',
      html: content.html || `<p>${content.gameTitle || content.gameId || 'Game'} staat klaar voor de leerlingroute.</p>`,
      question: null
    })];
  }

  if (block.type === 'slidedeck') {
    return [createBaseSlide(block, 'slidedeck', 1, {
      title: block.title || content.deckTitle || 'Slidedeck',
      html: content.html || '<p>Open de presentatie-PDF om deze les klassikaal te bekijken.</p>',
      imageUrl: content.generatedDeckUrl || '',
      pdfStoragePath: content.generatedDeckStoragePath || '',
      slidedeckPackageId: content.slidedeckPackageId || '',
      altText: content.deckTitle || block.title || 'Slidedeck',
      meta: {
        pdfUrl: content.generatedDeckUrl || '',
        pdfStoragePath: content.generatedDeckStoragePath || '',
        slidedeckPackageId: content.slidedeckPackageId || ''
      }
    })];
  }

  if (block.type === 'question') {
    return [buildQuestionSlide(block, linkedQuestions[block.linkedVraagId] || null)];
  }

  if (block.type === 'media') {
    const html = content.caption || content.html || content.text || '';
    const normalizedMedia = normalizeMediaContent({
      ...content,
      mediaUrl: content.mediaUrl || content.imageUrl || content.videoUrl || content.pdfUrl || content.fileUrl || content.downloadURL || content.url || extractImageSource(html)
    });
    return [createBaseSlide(block, 'media', 1, {
      html,
      imageUrl: normalizedMedia.mediaKind === 'image' ? normalizedMedia.mediaUrl : '',
      media: normalizedMedia,
      altText: content.altText || content.caption || ''
    })];
  }

  if (block.type === 'example' && Array.isArray(content.steps) && content.steps.length > 0) {
    return content.steps.map((step, index) =>
      createBaseSlide(block, 'text', index + 1, {
        title: `${block.title || CONTENT_BLOCK_LABELS.example} - stap ${index + 1}`,
        html: `<p>${step}</p>`,
        imageUrl: index === 0 ? content.imageUrl || '' : ''
      })
    );
  }

  return buildTextSlidesFromHtml(
    block,
    content.html || content.text || '',
    content.imageUrl || content.mediaUrl || '',
    content.altText || content.caption || ''
  );
};

export const contentBlocksToDigibordSlides = (blocks = [], options = {}) => {
  const { includeDrafts = false, linkedQuestions = {} } = options;

  return normalizeContentBlocks(blocks)
    .filter((block) => includeDrafts || BLOCKS_WITH_PRESENTABLE_STATUS.has(block.status))
    .flatMap((block) => buildSlidesForBlock(block, linkedQuestions))
    .filter(slideHasContent)
    .map((slide, index) => ({
      ...slide,
      number: index + 1
    }));
};
