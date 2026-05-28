import * as pdfjsLib from 'pdfjs-dist';
import { loadImageData, validateAndClipCoordinates } from './cropService.js';
import {
  groupPdfWordsIntoLines,
  isLikelyPdfStudentName,
  mergeWrappedPdfNameSegments,
  normalizePdfListSpaces,
  splitPdfLineIntoNameSegments
} from '../lib/studentPhotoPdfListUtils';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.mjs';

const PDF_RENDER_SCALE = 3;
const CELL_GAP_PT = 12;
const WRAP_MERGE_GAP_PT = 16;
const PHOTO_WIDTH_PAGE_RATIO = 75 / 595.2756;
const PHOTO_ASPECT_RATIO = 1.5;

const renderPageToCanvas = async (page, scale = PDF_RENDER_SCALE) => {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas-context is niet beschikbaar.');

  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);
  await page.render({ canvasContext: context, viewport }).promise;
  return { canvas, viewport };
};

const getTextItemBox = (item, viewport) => {
  const [x, y] = viewport.convertToViewportPoint(item.transform[4], item.transform[5]);
  const width = Math.max(1, Number(item.width || 0) * viewport.scale);
  const height = Math.max(1, Number(item.height || 0) * viewport.scale);

  return {
    text: normalizePdfListSpaces(item.str),
    x,
    y: y - height,
    width,
    height,
    right: x + width,
    bottom: y
  };
};

const buildSelectionsFromLabels = ({ labels, canvas, pageWidth }) => {
  const photoWidth = Math.max(80, canvas.width * PHOTO_WIDTH_PAGE_RATIO);
  const photoHeight = photoWidth * PHOTO_ASPECT_RATIO;
  const bounds = { width: canvas.width, height: canvas.height };

  return labels
    .filter(isLikelyPdfStudentName)
    .map((label, index) => {
      const cropCoordinates = validateAndClipCoordinates(
        {
          x: label.x,
          y: label.y - photoHeight - Math.max(1, pageWidth * 0.001),
          width: photoWidth,
          height: photoHeight
        },
        bounds
      );

      if (!cropCoordinates) return null;
      const proposedName = normalizePdfListSpaces(label.text);
      return {
        id: `pdf_${Date.now()}_${index + 1}`,
        type: 'image',
        label: proposedName,
        proposedName,
        cropCoordinates,
        originalImageSize: {
          width: canvas.width,
          height: canvas.height
        },
        detectionConfidence: 1,
        detectionMethod: 'pdf-text-layer',
        rawOcrText: proposedName,
        cleanedOcrName: proposedName,
        ocrConfidence: 100,
        labelBox: {
          x: Math.round(label.x),
          y: Math.round(label.y),
          width: Math.round(label.width),
          height: Math.round(label.height)
        },
        labelMatchConfidence: 1,
        ocrMethodId: 'pdf-text-layer'
      };
    })
    .filter(Boolean);
};

export const extractStudentPhotoSelectionsFromPdf = async (file) => {
  if (!file || file.type !== 'application/pdf') {
    throw new Error('Kies een PDF-fotolijst.');
  }

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const page = await pdf.getPage(1);
  const { canvas, viewport } = await renderPageToCanvas(page);
  const textContent = await page.getTextContent();
  const words = textContent.items
    .map((item) => getTextItemBox(item, viewport))
    .filter((item) => item.text);
  const lines = groupPdfWordsIntoLines(words);
  const segments = lines.flatMap((line) => splitPdfLineIntoNameSegments(line, CELL_GAP_PT * viewport.scale));
  const labels = mergeWrappedPdfNameSegments(segments, WRAP_MERGE_GAP_PT * viewport.scale);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
  const imageData = await loadImageData(dataUrl);
  const selections = buildSelectionsFromLabels({ labels, canvas, pageWidth: viewport.width });

  if (!selections.length) {
    throw new Error('Geen leerlingnamen met foto-posities gevonden in deze PDF.');
  }

  return {
    imageData,
    selections,
    sourceMeta: {
      fileName: file.name,
      pageCount: pdf.numPages,
      detectedNames: selections.length,
      importMethod: 'pdf-text-layer'
    }
  };
};

export default {
  extractStudentPhotoSelectionsFromPdf
};
