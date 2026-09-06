import { PDFDocument } from 'pdf-lib';

/**
 * Zet een PDF om naar een PDF met JPEG-pagina's, in de browser.
 *
 * Vaste huisregel (Kevin, 6 sep 2026): elk slidedeck dat geupload wordt gaat
 * eerst door deze molen. Decks komen vaak binnen als ongecomprimeerde bitmaps
 * (24 MB voor 16 dia's); als JPEG laden ze drie tot vier keer sneller, en op
 * schoolwifi is dat het verschil tussen een deck dat opent en een leeg scherm.
 *
 * De bron-PDF blijft altijd ongewijzigd bewaard; alleen de leerlingversie
 * (generated deck) wordt omgezet. Wordt het bestand er niet minstens 15
 * procent kleiner van, dan gaat het origineel door - dan was het al compact.
 */

const RENDER_SCHAAL = 1.5; // scherp genoeg voor digibordweergave
const JPEG_KWALITEIT = 0.82;
const MINIMALE_WINST = 0.85;

const canvasNaarJpeg = (canvas) =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('JPEG maken mislukt'))),
      'image/jpeg',
      JPEG_KWALITEIT
    );
  });

export async function comprimeerPdfNaarJpegPaginas(file, { onProgress } = {}) {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.mjs';

  const bronBytes = await file.arrayBuffer();
  const bron = await pdfjs.getDocument({ data: new Uint8Array(bronBytes.slice(0)) }).promise;
  const doel = await PDFDocument.create();

  for (let n = 1; n <= bron.numPages; n += 1) {
    const pagina = await bron.getPage(n);
    const viewport = pagina.getViewport({ scale: RENDER_SCHAAL });
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    await pagina.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;

    const jpeg = await doel.embedJpg(await (await canvasNaarJpeg(canvas)).arrayBuffer());
    const basis = pagina.getViewport({ scale: 1 });
    const blad = doel.addPage([basis.width, basis.height]);
    blad.drawImage(jpeg, { x: 0, y: 0, width: basis.width, height: basis.height });
    onProgress?.(n, bron.numPages);
  }

  const uitBytes = await doel.save();
  if (uitBytes.length >= bronBytes.byteLength * MINIMALE_WINST) {
    return { blob: file, omgezet: false, vanBytes: bronBytes.byteLength, naarBytes: bronBytes.byteLength };
  }
  return {
    blob: new Blob([uitBytes], { type: 'application/pdf' }),
    omgezet: true,
    vanBytes: bronBytes.byteLength,
    naarBytes: uitBytes.length
  };
}
