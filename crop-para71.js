import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basePath = path.join(__dirname, 'boekafbeeldingen');
const outputDir = path.join(basePath, 'cropped');

const crops = [
  // From 7punt11.jpg
  {
    input: '7punt11.jpg',
    output: 'p71_geodriehoek.jpg',
    crop: { left: 500, top: 150, width: 300, height: 280 },
    desc: 'Geodriehoek example'
  },
  {
    input: '7punt11.jpg',
    output: 'p71_twee_driehoeken.jpg',
    crop: { left: 80, top: 385, width: 580, height: 110 },
    desc: 'Two triangles ABC and DEF'
  },
  {
    input: '7punt11.jpg',
    output: 'p71_sides_voorbeeld.jpg',
    crop: { left: 60, top: 740, width: 680, height: 180 },
    desc: 'Example 1 & 2 - rechthoekszijden and langste zijde'
  },

  // From 7punt12.jpg
  {
    input: '7punt12.jpg',
    output: 'p71_driehoek_klm.jpg',
    crop: { left: 280, top: 90, width: 280, height: 200 },
    desc: 'Triangle KLM'
  },
  {
    input: '7punt12.jpg',
    output: 'p71_rechthoek_efgh.jpg',
    crop: { left: 430, top: 310, width: 290, height: 180 },
    desc: 'Rectangle EFGH with diagonal'
  },
  {
    input: '7punt12.jpg',
    output: 'p71_puzzle.jpg',
    crop: { left: 60, top: 550, width: 760, height: 280 },
    desc: 'Puzzle with triangles'
  },
  {
    input: '7punt12.jpg',
    output: 'p71_driehoek_efg.jpg',
    crop: { left: 580, top: 910, width: 210, height: 200 },
    desc: 'Triangle EFG'
  },

  // From 7punt13.jpg
  {
    input: '7punt13.jpg',
    output: 'p71_vier_driehoeken.jpg',
    crop: { left: 270, top: 210, width: 560, height: 140 },
    desc: 'Four triangles FGH, KLM, etc'
  },
  {
    input: '7punt13.jpg',
    output: 'p71_rechthoek_abcd.jpg',
    crop: { left: 270, top: 430, width: 500, height: 140 },
    desc: 'Rectangle ABCD with diagonals'
  },
  {
    input: '7punt13.jpg',
    output: 'p71_huis_leerdoelen.jpg',
    crop: { left: 570, top: 680, width: 380, height: 280 },
    desc: 'House for learning objectives'
  }
];

(async () => {
  console.log('\nCropping para71 diagrams...\n');

  for (const item of crops) {
    try {
      const inputPath = path.join(basePath, item.input);
      const outputPath = path.join(outputDir, item.output);

      await sharp(inputPath)
        .extract(item.crop)
        .toFile(outputPath);

      console.log(`✓ ${item.output}`);
      console.log(`  ${item.desc}`);
    } catch (error) {
      console.error(`✗ Error processing ${item.output}:`, error.message);
    }
  }

  console.log('\n✓ Para71 diagrams cropped!');
})();
