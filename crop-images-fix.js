import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basePath = path.join(__dirname, 'boekafbeeldingen');
const outputDir = path.join(basePath, 'cropped');

const crops = [
  // Fix Q15 - Wouter schema (LEFT side, smaller box)
  {
    input: '7.3.1.jpg',
    output: 'q15_wouter_schema.jpg',
    crop: { left: 70, top: 575, width: 360, height: 165 },
    desc: 'Question 15a - Wouter schema (FIXED)'
  },
  // Fix Q15 - Annemiek schema (RIGHT side, larger box)
  {
    input: '7.3.1.jpg',
    output: 'q15_annemiek_schema.jpg',
    crop: { left: 485, top: 740, width: 240, height: 130 },
    desc: 'Question 15b - Annemiek schema (FIXED)'
  }
];

(async () => {
  console.log('\nRe-cropping Q15 images...\n');

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

  console.log('\n✓ Fixed images created!');
})();
