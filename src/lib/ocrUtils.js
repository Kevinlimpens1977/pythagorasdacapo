export const DEFAULT_OCR_MODEL = 'openai/gpt-4o-mini';

export const buildOcrMessages = (base64Image, mimeType = 'image/jpeg') => {
  if (!base64Image) {
    throw new Error('base64Image is required');
  }

  return [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'Lees alle zichtbare tekst in deze afbeelding. Geef alleen de herkende tekst terug. Behoud regels, opsommingen, formules en getallen zo goed mogelijk. Als er geen tekst zichtbaar is, antwoord dan met: [geen tekst gevonden]'
        },
        {
          type: 'image_url',
          image_url: {
            url: `data:${mimeType};base64,${base64Image}`
          }
        }
      ]
    }
  ];
};

export const isOcrRefusalText = (text = '') => {
  const normalized = String(text).toLowerCase();
  return [
    "can't view",
    "can't extract",
    'unable to extract',
    'unable to view',
    'as a text-based model',
    "i'm sorry",
    'i apologize'
  ].some((fragment) => normalized.includes(fragment));
};
