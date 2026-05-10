import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basePath = path.join(__dirname, 'boekafbeeldingen');
const outputDir = path.join(basePath, 'cropped');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log('✓ Created output directory:', outputDir);
}

// Define crops: { input: 'file', output: 'name', crop: { left, top, width, height } }
const crops = [
  // From 7.3.1.jpg
  {
    input: '7.3.1.jpg',
    output: 'q14_squares.jpg',
    crop: { left: 80, top: 190, width: 600, height: 150 },
    desc: 'Question 14a - Squares diagram'
  },
  {
    input: '7.3.1.jpg',
    output: 'q14b_table.jpg',
    crop: { left: 100, top: 350, width: 550, height: 100 },
    desc: 'Question 14b - Table'
  },
  {
    input: '7.3.1.jpg',
    output: 'q15_wouter_schema.jpg',
    crop: { left: 80, top: 560, width: 900, height: 200 },
    desc: 'Question 15a - Wouter schema'
  },
  {
    input: '7.3.1.jpg',
    output: 'q15_annemiek_schema.jpg',
    crop: { left: 350, top: 730, width: 650, height: 150 },
    desc: 'Question 15b - Annemiek schema'
  },

  // From 7.3.2.jpg
  {
    input: '7.3.2.jpg',
    output: 'theory_aanpak.jpg',
    crop: { left: 50, top: 50, width: 700, height: 220 },
    desc: 'Theory - Aanpak (how to calculate)'
  },
  {
    input: '7.3.2.jpg',
    output: 'example_triangle_ac.jpg',
    crop: { left: 60, top: 280, width: 260, height: 180 },
    desc: 'Example - Triangle AC'
  },
  {
    input: '7.3.2.jpg',
    output: 'q16_triangle_ghi.jpg',
    crop: { left: 40, top: 450, width: 250, height: 160 },
    desc: 'Question 16 - Triangle GHI'
  },
  {
    input: '7.3.2.jpg',
    output: 'q17_rectangle.jpg',
    crop: { left: 460, top: 670, width: 280, height: 150 },
    desc: 'Question 17 - Rectangle diagonal'
  },

  // From 7.3.3.jpg
  {
    input: '7.3.3.jpg',
    output: 'q18_billard_diagram.jpg',
    crop: { left: 420, top: 50, width: 310, height: 170 },
    desc: 'Question 18 - Billard table'
  },
  {
    input: '7.3.3.jpg',
    output: 'q19_roof_photo.jpg',
    crop: { left: 50, top: 270, width: 340, height: 220 },
    desc: 'Question 19 - Roof photo'
  },
  {
    input: '7.3.3.jpg',
    output: 'q19_roof_diagram.jpg',
    crop: { left: 380, top: 360, width: 310, height: 130 },
    desc: 'Question 19 - Roof diagram'
  },
  {
    input: '7.3.3.jpg',
    output: 'q20_triangle_pqr.jpg',
    crop: { left: 410, top: 550, width: 300, height: 150 },
    desc: 'Question 20 - Triangle PQR'
  },
  {
    input: '7.3.3.jpg',
    output: 'leerdoelen_triangle_def.jpg',
    crop: { left: 380, top: 720, width: 310, height: 170 },
    desc: 'Learning objectives - Triangle DEF'
  }
];

// Process each crop
(async () => {
  console.log('\nStarting image cropping...\n');

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

  console.log('\n✓ All images cropped successfully!');
  console.log(`  Output: ${outputDir}`);
})();
