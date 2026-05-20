const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 54;
const LINE_HEIGHT = 15;

const escapePdfText = (value = '') =>
  String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\r/g, '');

const splitLines = (text = '', maxChars = 82) => {
  const paragraphs = String(text || '').split('\n');
  const lines = [];

  paragraphs.forEach((paragraph) => {
    const words = paragraph.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push('');
      return;
    }

    let current = '';
    words.forEach((word) => {
      const next = current ? `${current} ${word}` : word;
      if (next.length > maxChars && current) {
        lines.push(current);
        current = word;
      } else {
        current = next;
      }
    });
    if (current) lines.push(current);
  });

  return lines;
};

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const dataUrlToBytes = (dataUrl) => {
  const [, base64 = ''] = String(dataUrl).split(',');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
};

const bytesToHex = (bytes) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

const normalizeImageForPdf = async (file) => {
  const dataUrl = await blobToDataUrl(file);
  const image = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.86);

  return {
    name: file.name || 'afbeelding',
    width: canvas.width,
    height: canvas.height,
    bytes: dataUrlToBytes(jpegDataUrl)
  };
};

class PdfBuilder {
  constructor() {
    this.objects = [];
    this.pages = [];
  }

  addObject(content) {
    this.objects.push(content);
    return this.objects.length;
  }

  addPage(content, imageObject = null) {
    this.pages.push({ content, imageObject });
  }

  build() {
    const fontId = this.addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
    const pageIds = [];

    this.pages.forEach((page) => {
      const streamId = this.addObject(`<< /Length ${page.content.length} >>\nstream\n${page.content}\nendstream`);
      const xObjects = page.imageObject ? `/XObject << /Im${page.imageObject.name} ${page.imageObject.objectId} 0 R >>` : '';
      const resourceParts = [`/Font << /F1 ${fontId} 0 R >>`, xObjects].filter(Boolean).join(' ');
      const pageId = this.addObject(`<< /Type /Page /Parent PAGES_REF 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << ${resourceParts} >> /Contents ${streamId} 0 R >>`);
      pageIds.push(pageId);
    });

    const pagesId = this.addObject(`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`);
    const catalogId = this.addObject(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);
    this.objects = this.objects.map((object) => String(object).replaceAll('PAGES_REF', String(pagesId)));

    const parts = ['%PDF-1.4\n'];
    const offsets = [0];
    this.objects.forEach((object, index) => {
      offsets.push(parts.join('').length);
      parts.push(`${index + 1} 0 obj\n${object}\nendobj\n`);
    });
    const xrefOffset = parts.join('').length;
    parts.push(`xref\n0 ${this.objects.length + 1}\n0000000000 65535 f \n`);
    offsets.slice(1).forEach((offset) => {
      parts.push(`${String(offset).padStart(10, '0')} 00000 n \n`);
    });
    parts.push(`trailer\n<< /Size ${this.objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

    return new Blob(parts, { type: 'application/pdf' });
  }
}

const createTextPage = (title, lines, startLine = 0) => {
  const visibleLines = lines.slice(startLine, startLine + 42);
  const commands = [
    'BT',
    '/F1 20 Tf',
    `${MARGIN} ${PAGE_HEIGHT - 70} Td`,
    `(${escapePdfText(title)}) Tj`,
    '/F1 11 Tf',
    `0 -32 Td`
  ];

  visibleLines.forEach((line) => {
    commands.push(`(${escapePdfText(line)}) Tj`);
    commands.push(`0 -${LINE_HEIGHT} Td`);
  });

  commands.push('ET');
  return {
    content: commands.join('\n'),
    nextLine: startLine + visibleLines.length
  };
};

export const createSourcePdfBlob = async ({ title, learningGoals, sourceText, images = [] }) => {
  const pdf = new PdfBuilder();
  const textLines = [
    `Onderwerp: ${title || 'Naamloze les'}`,
    '',
    'Leerdoelen',
    ...splitLines(learningGoals || 'Nog geen leerdoelen ingevuld.', 78),
    '',
    'Brontekst / lesinhoud',
    ...splitLines(sourceText || 'Nog geen brontekst ingevuld.', 78)
  ];

  let nextLine = 0;
  while (nextLine < textLines.length) {
    const page = createTextPage(nextLine === 0 ? 'HELIX NotebookLM bronbestand' : title || 'Bronbestand', textLines, nextLine);
    pdf.addPage(page.content);
    nextLine = page.nextLine;
  }

  const normalizedImages = [];
  for (const imageFile of images) {
    normalizedImages.push(await normalizeImageForPdf(imageFile));
  }

  normalizedImages.forEach((image, index) => {
    const maxWidth = PAGE_WIDTH - MARGIN * 2;
    const maxHeight = PAGE_HEIGHT - 180;
    const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
    const width = image.width * scale;
    const height = image.height * scale;
    const x = (PAGE_WIDTH - width) / 2;
    const y = PAGE_HEIGHT - 135 - height;
    const objectId = pdf.addObject(
      `<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter [/ASCIIHexDecode /DCTDecode] /Length ${image.bytes.length * 2 + 1} >>\nstream\n${bytesToHex(image.bytes)}>\nendstream`
    );

    const header = [
      'BT',
      '/F1 18 Tf',
      `${MARGIN} ${PAGE_HEIGHT - 70} Td`,
      `(Afbeelding ${index + 1}: ${escapePdfText(image.name)}) Tj`,
      'ET',
      'q',
      `${width} 0 0 ${height} ${x} ${y} cm`,
      `/Im${index + 1} Do`,
      'Q'
    ].join('\n');

    pdf.addPage(header, { objectId, name: index + 1 });
  });

  return pdf.build();
};
