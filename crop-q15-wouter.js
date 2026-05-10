import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basePath = path.join(__dirname, 'boekafbeeldingen');
const outputDir = path.join(basePath, 'cropped');

(async () => {
  try {
    const inputPath = path.join(basePath, '7.3.1.jpg');
    const outputPath = path.join(outputDir, 'q15_wouter_schema.jpg');

    // Better crop - includes full schema box
    await sharp(inputPath)
      .extract({ left: 65, top: 565, width: 410, height: 175 })
      .toFile(outputPath);

    console.log('✓ q15_wouter_schema.jpg re-cropped (complete)');
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
})();
