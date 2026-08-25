#!/usr/bin/env node
// Synchroniseert de gedeelde beoordelingslaag naar de Cloud Functions.
//
// WAAROM DIT BESTAAT
// De nakijklogica staat in src/lib/questionGrading.js. Die laag is bewust EEN
// bron: het digibord (client) en de leerlingroute (server) moeten hetzelfde
// oordeel geven. `functions/` is echter een apart npm-pakket dat bij een deploy
// los wordt geupload; `../src/lib` bestaat daar niet meer. Een tweede,
// handgeschreven kopie van de nakijklogica in functions/ is precies wat we niet
// willen - die loopt gegarandeerd uit de pas.
//
// De oplossing: een build-stap die de volledige importgraaf van de
// beoordelingslaag BYTE-IDENTIEK naar functions/shared/ kopieert, plus een
// drift-test aan beide kanten (src/lib/functionsSharedGrading.test.js en
// functions/sharedGrading.test.js) die faalt zodra de kopie afwijkt. Zo is er
// nog steeds maar een plek waar je de logica bewerkt: src/lib. functions/shared
// is gegenereerd en read-only.
//
// functions/shared/package.json zet `type: module`, zodat de gekopieerde ESM
// bestanden onveranderd blijven werken binnen het CommonJS functions-pakket.
// index.js laadt ze met een dynamische `import()`.
//
// Gebruik: node scripts/sync-functions-shared.mjs [--check]

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
export const SOURCE_DIR = join(REPO_ROOT, 'src', 'lib');
export const SHARED_DIR = join(REPO_ROOT, 'functions', 'shared');

// Alles wat de callable server-side nodig heeft. De rest van de graaf volgt
// automatisch uit de imports.
export const SHARED_ENTRY_POINTS = [
  'questionGrading.js',
  'questionPreviewUtils.js',
  // Toets- en quizitems lopen door dezelfde beoordelingslaag; de callable heeft
  // de adapter dus ook server-side nodig.
  'assessmentItemGrading.js'
];

export const SHARED_PACKAGE_JSON = `${JSON.stringify(
  {
    name: 'helix-shared-grading',
    private: true,
    type: 'module',
    description:
      'Gegenereerd door scripts/sync-functions-shared.mjs. Bewerk src/lib, niet deze map.'
  },
  null,
  2
)}\n`;

export const SHARED_README = `# functions/shared (gegenereerd)

Deze map is een byte-identieke kopie van de gedeelde beoordelingslaag uit
\`src/lib\`. Bewerk hier niets: pas \`src/lib/questionGrading.js\` (of een module
die daaruit volgt) aan en draai daarna:

    node scripts/sync-functions-shared.mjs

De tests \`src/lib/functionsSharedGrading.test.js\` en
\`functions/sharedGrading.test.js\` falen zodra kopie en bron uit elkaar lopen.
`;

const RELATIVE_IMPORT_PATTERN = /(?:from|import)\s*\(?\s*['"](\.[^'"]+)['"]/g;

const readSource = (fileName) => readFileSync(join(SOURCE_DIR, fileName), 'utf8');

const getRelativeImports = (source) => {
  const found = new Set();
  let match = RELATIVE_IMPORT_PATTERN.exec(source);
  while (match) {
    found.add(match[1]);
    match = RELATIVE_IMPORT_PATTERN.exec(source);
  }
  RELATIVE_IMPORT_PATTERN.lastIndex = 0;
  return [...found];
};

/**
 * Volledige importgraaf van de beoordelingslaag, als gesorteerde bestandsnamen.
 * Gooit als een module buiten src/lib importeert: de gedeelde laag hoort
 * afhankelijkheidsvrij te blijven (geen React, geen Firebase, geen services).
 */
export const collectSharedGradingFiles = (entryPoints = SHARED_ENTRY_POINTS) => {
  const queue = [...entryPoints];
  const seen = new Set();

  while (queue.length > 0) {
    const fileName = queue.shift();
    if (seen.has(fileName)) continue;
    seen.add(fileName);

    getRelativeImports(readSource(fileName)).forEach((specifier) => {
      if (!specifier.startsWith('./') || specifier.slice(2).includes('/')) {
        throw new Error(
          `${fileName} importeert "${specifier}" buiten src/lib. De gedeelde beoordelingslaag moet plat en afhankelijkheidsvrij blijven.`
        );
      }
      queue.push(basename(specifier));
    });
  }

  return [...seen].sort();
};

const readIfExists = (path) => (existsSync(path) ? readFileSync(path, 'utf8') : null);

/**
 * Vergelijkt de kopie in functions/shared met de bron in src/lib.
 * Gebruikt door de drift-tests aan beide kanten van de pakketgrens.
 */
export const verifySharedGradingSync = () => {
  const expectedFiles = collectSharedGradingFiles();
  const missing = [];
  const drifted = [];

  expectedFiles.forEach((fileName) => {
    const copied = readIfExists(join(SHARED_DIR, fileName));
    if (copied === null) {
      missing.push(fileName);
      return;
    }
    if (copied !== readSource(fileName)) {
      drifted.push(fileName);
    }
  });

  const presentFiles = existsSync(SHARED_DIR)
    ? readdirSync(SHARED_DIR).filter((name) => name.endsWith('.js'))
    : [];
  const stale = presentFiles.filter((name) => !expectedFiles.includes(name)).sort();

  const packageJson = readIfExists(join(SHARED_DIR, 'package.json'));

  return {
    expectedFiles,
    missing,
    drifted,
    stale,
    packageJsonInSync: packageJson === SHARED_PACKAGE_JSON,
    inSync:
      missing.length === 0 &&
      drifted.length === 0 &&
      stale.length === 0 &&
      packageJson === SHARED_PACKAGE_JSON
  };
};

export const syncSharedGrading = () => {
  const files = collectSharedGradingFiles();
  mkdirSync(SHARED_DIR, { recursive: true });

  files.forEach((fileName) => {
    writeFileSync(join(SHARED_DIR, fileName), readSource(fileName));
  });

  readdirSync(SHARED_DIR)
    .filter((name) => name.endsWith('.js') && !files.includes(name))
    .forEach((name) => rmSync(join(SHARED_DIR, name)));

  writeFileSync(join(SHARED_DIR, 'package.json'), SHARED_PACKAGE_JSON);
  writeFileSync(join(SHARED_DIR, 'README.md'), SHARED_README);

  return files;
};

const isDirectRun = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  if (process.argv.includes('--check')) {
    const status = verifySharedGradingSync();
    if (!status.inSync) {
      console.error('functions/shared loopt uit de pas met src/lib:', {
        missing: status.missing,
        drifted: status.drifted,
        stale: status.stale,
        packageJsonInSync: status.packageJsonInSync
      });
      console.error('Draai: node scripts/sync-functions-shared.mjs');
      process.exit(1);
    }
    console.log(`functions/shared is in sync (${status.expectedFiles.length} bestanden).`);
  } else {
    const files = syncSharedGrading();
    console.log(`functions/shared bijgewerkt: ${files.join(', ')}`);
  }
}
