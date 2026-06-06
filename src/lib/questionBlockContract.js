import { normalizeContentBlockSettings } from './contentBlockUtils.js';

const getParagraafKey = (paragraaf = {}) =>
  String(paragraaf.code || paragraaf.id || '')
    .replaceAll('.', '')
    .replace(/[^a-zA-Z0-9_-]/g, '') || 'paragraaf';

export const buildQuestionContentBlockCreateBundle = ({
  paragraaf,
  vraagData = {},
  blockData = {},
  nextVraagOrder = 1,
  nextBlockOrder = 1,
  userId = 'unknown-admin',
  nowMs = Date.now(),
  timestamp = null
} = {}) => {
  if (!paragraaf?.id) throw new Error('Paragraaf not found');

  const paragraafKey = getParagraafKey(paragraaf);
  const number = vraagData.number || nextVraagOrder || 1;
  const vraagId = vraagData.id || `vraag-${paragraafKey}-${number}-${nowMs}`;
  const blockId = blockData.id || `block-${paragraafKey}-question-${nowMs}`;
  const vraagtype = vraagData.vraagtype || 'open';
  const createdAt = timestamp || new Date(nowMs).toISOString();

  const vraag = {
    id: vraagId,
    vakId: paragraaf.vakId || '',
    leerjaarId: paragraaf.leerjaarId || '',
    niveauId: paragraaf.niveauId || '',
    hoofdstukId: paragraaf.hoofdstukId || '',
    paragraafId: paragraaf.id,
    number,
    title: vraagData.title || `Vraag ${number}`,
    vraagtype,
    order: nextVraagOrder,
    status: vraagData.status || 'draft',
    createdBy: userId,
    createdAt,
    content: {
      text: vraagData.content?.text || '',
      images: vraagData.content?.images || []
    },
    vraagMetadata: {
      difficulty: vraagData.vraagMetadata?.difficulty || 3,
      hints: vraagData.vraagMetadata?.hints || [],
      showCalculator: vraagData.vraagMetadata?.showCalculator || false,
      calculatorMode: vraagData.vraagMetadata?.calculatorMode || 'standard',
      tokenConfig: vraagData.vraagMetadata?.tokenConfig || null
    },
    antwoord: vraagData.antwoord || {},
    isArchived: false
  };

  const block = {
    id: blockId,
    vakId: paragraaf.vakId || '',
    leerjaarId: paragraaf.leerjaarId || '',
    niveauId: paragraaf.niveauId || '',
    hoofdstukId: paragraaf.hoofdstukId || '',
    paragraafId: paragraaf.id,
    type: 'question',
    order: nextBlockOrder,
    title: blockData.title || 'Vraag',
    status: blockData.status || 'draft',
    content: blockData.content || { html: '' },
    settings: normalizeContentBlockSettings(blockData.settings, 'question'),
    linkedVraagId: vraagId,
    createdBy: userId,
    createdAt,
    updatedAt: createdAt,
    isArchived: false
  };

  return {
    vraagId,
    blockId,
    vraag,
    block
  };
};
