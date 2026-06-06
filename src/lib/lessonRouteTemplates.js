import { getDefaultContentForBlockType, normalizeContentBlockSettings } from './contentBlockUtils.js';

const createDraft = ({
  type,
  title,
  description = '',
  differentiationLevel = 'basis',
  questionTitle = ''
}) => ({
  type,
  title,
  status: 'draft',
  content: {
    ...getDefaultContentForBlockType(type),
    html: description ? `<p>${description}</p>` : getDefaultContentForBlockType(type).html || ''
  },
  settings: normalizeContentBlockSettings({ differentiationLevel }, type),
  question: type === 'question'
    ? {
        title: questionTitle || title,
        content: { text: '<p></p>', images: [] }
      }
    : null
});

export const LESSON_ROUTE_TEMPLATES = [
  {
    id: 'uitleg_oefenen',
    label: 'Uitleg + oefenen',
    description: 'Theorie, voorbeeld, drie checkvragen en samenvatting.',
    blocks: [
      { type: 'theory', title: 'Korte uitleg', description: 'Leg het nieuwe begrip kort en concreet uit.' },
      { type: 'example', title: 'Voorbeeld stap voor stap', description: 'Werk een voorbeeld hardop uit.' },
      { type: 'question', title: 'Checkvraag 1' },
      { type: 'question', title: 'Checkvraag 2' },
      { type: 'question', title: 'Checkvraag 3' },
      { type: 'summary', title: 'Samenvatting', description: 'Laat leerlingen de kern in eigen woorden herhalen.' }
    ]
  },
  {
    id: 'notebooklm_check',
    label: 'NotebookLM + check',
    description: 'Presentatieblok met twee directe controle-vragen.',
    blocks: [
      { type: 'slidedeck', title: 'NotebookLM presentatie', description: 'Klassikale uitleg via brongecontroleerd slidedeck.' },
      { type: 'question', title: 'Begripscheck' },
      { type: 'question', title: 'Toepassingscheck' },
      { type: 'summary', title: 'Afronding', description: 'Vat samen wat leerlingen nu moeten kunnen.' }
    ]
  },
  {
    id: 'herhalen',
    label: 'Herhaalroute',
    description: 'Kort ophalen, oefenen en afsluiten met quiz.',
    blocks: [
      { type: 'summary', title: 'Wat weet je nog?', description: 'Haal de voorkennis kort op.' },
      { type: 'example', title: 'Herhaalvoorbeeld', description: 'Laat nog een voorbeeld zien.' },
      { type: 'question', title: 'Zelf proberen' },
      { type: 'quiz', title: 'Korte quiz', description: 'Controleer of de basis weer staat.' }
    ]
  },
  {
    id: 'steunroute',
    label: 'Steunroute',
    description: 'Extra uitleg en begeleide oefening voor leerlingen die steun nodig hebben.',
    blocks: [
      { type: 'theory', title: 'Steunuitleg', differentiationLevel: 'steun', description: 'Maak de uitleg kleiner en taalarm.' },
      { type: 'example', title: 'Samen oefenen', differentiationLevel: 'steun', description: 'Doe een voorbeeld samen voor.' },
      { type: 'question', title: 'Begeleide oefening', differentiationLevel: 'steun' },
      { type: 'summary', title: 'Steun-samenvatting', differentiationLevel: 'steun', description: 'Herhaal de stappen in vaste volgorde.' }
    ]
  },
  {
    id: 'plusroute',
    label: 'Plusroute',
    description: 'Verdieping en transfer voor leerlingen die meer aankunnen.',
    blocks: [
      { type: 'example', title: 'Plusvoorbeeld', differentiationLevel: 'plus', description: 'Laat een moeilijker of nieuw scenario zien.' },
      { type: 'question', title: 'Plusopdracht', differentiationLevel: 'plus' },
      { type: 'quiz', title: 'Pluscheck', differentiationLevel: 'plus', description: 'Laat leerlingen hun aanpak controleren.' },
      { type: 'summary', title: 'Reflectie', differentiationLevel: 'plus', description: 'Laat leerlingen verwoorden wat anders was.' }
    ]
  }
];

export const getLessonRouteTemplate = (templateId = '') =>
  LESSON_ROUTE_TEMPLATES.find((template) => template.id === templateId) || null;

export const buildLessonRouteTemplateBlocks = (templateId = '') => {
  const template = getLessonRouteTemplate(templateId);
  if (!template) return [];
  return template.blocks.map((block) => createDraft(block));
};
