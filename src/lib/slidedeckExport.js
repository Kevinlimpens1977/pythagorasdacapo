const splitLines = (value = '') =>
  String(value || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

const escapeHtml = (value = '') =>
  String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const normalizeFileReference = (file = null) => ({
  fileName: file?.fileName || '',
  downloadURL: file?.downloadURL || '',
  storagePath: file?.storagePath || '',
  size: file?.size || 0,
  uploadedAt: file?.uploadedAt || ''
});

const normalizeLearningGoals = (deckPackage = {}) => {
  if (Array.isArray(deckPackage.sourceManifest?.learningGoals)) {
    return deckPackage.sourceManifest.learningGoals.filter(Boolean);
  }

  if (Array.isArray(deckPackage.learningGoals)) {
    return deckPackage.learningGoals.filter(Boolean);
  }

  return splitLines(deckPackage.learningGoals);
};

const normalizeAssets = (deckPackage = {}) => {
  const manifestAssets = Array.isArray(deckPackage.sourceManifest?.assets)
    ? deckPackage.sourceManifest.assets
    : [];
  const uploadedAssets = Array.isArray(deckPackage.sourceAssets) ? deckPackage.sourceAssets : [];

  if (manifestAssets.length > 0) {
    return manifestAssets.map((asset) => ({
      assetId: asset.assetId || '',
      fileName: asset.fileName || '',
      contentType: asset.contentType || '',
      size: asset.size || 0,
      sourceTag: asset.sourceTag || '',
      downloadURL: asset.downloadURL || '',
      storagePath: asset.storagePath || ''
    }));
  }

  return uploadedAssets.map((asset, index) => ({
    assetId: asset.assetId || `asset-${index + 1}`,
    fileName: asset.fileName || '',
    contentType: asset.contentType || '',
    size: asset.size || 0,
    sourceTag: asset.sourceTag || 'SOURCE_BASED',
    downloadURL: asset.downloadURL || '',
    storagePath: asset.storagePath || ''
  }));
};

export const buildSlidedeckExportMetadata = (deckPackage = {}, { exportedAt = new Date().toISOString() } = {}) => ({
  exportContract: 'helix-slidedeck-package',
  exportVersion: 1,
  exportedAt,
  packageId: deckPackage.id || '',
  title: deckPackage.title || '',
  status: deckPackage.status || '',
  linkedContext: deckPackage.linkedContext || null,
  learningGoals: normalizeLearningGoals(deckPackage),
  sourceText: deckPackage.sourceText || '',
  sourceManifest: {
    ...(deckPackage.sourceManifest || {}),
    assets: normalizeAssets(deckPackage)
  },
  files: {
    sourcePdf: normalizeFileReference(deckPackage.sourcePdf),
    generatedDeckPdf: normalizeFileReference(deckPackage.generatedDeckPdf)
  },
  prompt: {
    templateId: deckPackage.promptTemplateId || deckPackage.generationManifest?.promptTemplateId || null,
    templateName: deckPackage.promptTemplateName || deckPackage.generationManifest?.promptTemplateName || '',
    snapshot: deckPackage.promptSnapshot || '',
    snapshotLength: String(deckPackage.promptSnapshot || '').trim().length
  },
  generationManifest: deckPackage.generationManifest || {},
  review: {
    reviewStatus: deckPackage.reviewStatus || 'needs_review',
    teacherDecisionNote: deckPackage.teacherDecisionNote || '',
    sourceTagsSummary: deckPackage.sourceTagsSummary || {},
    citations: Array.isArray(deckPackage.citations) ? deckPackage.citations : [],
    teacherDecisionLog: Array.isArray(deckPackage.teacherDecisionLog) ? deckPackage.teacherDecisionLog : []
  }
});

export const buildSlidedeckJsonExport = (deckPackage = {}, options = {}) =>
  `${JSON.stringify(buildSlidedeckExportMetadata(deckPackage, options), null, 2)}\n`;

const renderList = (items = []) => {
  if (!items.length) return '<p>Geen gegevens vastgelegd.</p>';
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
};

const renderLink = (label, href) => {
  if (!href) return '<span>Niet beschikbaar</span>';
  return `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
};

export const buildSlidedeckHtmlExport = (deckPackage = {}, options = {}) => {
  const metadata = buildSlidedeckExportMetadata(deckPackage, options);
  const assets = metadata.sourceManifest.assets || [];

  return `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(metadata.title || 'HELIX slidedeck export')}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #172033; margin: 40px; line-height: 1.5; }
    h1, h2 { margin-bottom: 0.35rem; }
    section { border-top: 1px solid #d8dee9; padding-top: 1rem; margin-top: 1.5rem; }
    dt { font-weight: 700; margin-top: 0.7rem; }
    dd { margin-left: 0; }
    pre { white-space: pre-wrap; background: #f6f8fb; border: 1px solid #d8dee9; padding: 1rem; border-radius: 8px; }
    a { color: #1d4ed8; font-weight: 700; }
  </style>
</head>
<body>
  <h1>HELIX slidedeck export</h1>
  <p><strong>${escapeHtml(metadata.title || 'Naamloos slidedeck')}</strong></p>
  <dl>
    <dt>Pakket-ID</dt><dd>${escapeHtml(metadata.packageId || 'Onbekend')}</dd>
    <dt>Status</dt><dd>${escapeHtml(metadata.status || 'Onbekend')}</dd>
    <dt>Reviewstatus</dt><dd>${escapeHtml(metadata.review.reviewStatus)}</dd>
    <dt>Geexporteerd op</dt><dd>${escapeHtml(metadata.exportedAt)}</dd>
  </dl>

  <section>
    <h2>Leerdoelen</h2>
    ${renderList(metadata.learningGoals)}
  </section>

  <section>
    <h2>Bestanden</h2>
    <dl>
      <dt>Bron-PDF</dt><dd>${renderLink('Open bron-PDF', metadata.files.sourcePdf.downloadURL)}</dd>
      <dt>NotebookLM deck-PDF</dt><dd>${renderLink('Open deck-PDF', metadata.files.generatedDeckPdf.downloadURL)}</dd>
    </dl>
  </section>

  <section>
    <h2>Bronassets</h2>
    ${renderList(assets.map((asset) => `${asset.fileName || asset.assetId || 'Asset'} - ${asset.sourceTag || 'geen source tag'}`))}
  </section>

  <section>
    <h2>Brontekst</h2>
    <pre>${escapeHtml(metadata.sourceText || 'Geen brontekst vastgelegd.')}</pre>
  </section>

  <section>
    <h2>Promptsnapshot</h2>
    <pre>${escapeHtml(metadata.prompt.snapshot || 'Geen prompt vastgelegd.')}</pre>
  </section>

  <section>
    <h2>Metadata JSON</h2>
    <pre>${escapeHtml(JSON.stringify(metadata, null, 2))}</pre>
  </section>
</body>
</html>
`;
};

export const buildSlidedeckExportFileName = (deckPackage = {}, extension = 'json') => {
  const safeExtension = String(extension || 'json').replace(/^\./, '') || 'json';
  const slug = String(deckPackage.title || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const idSuffix = deckPackage.id ? `-${deckPackage.id}` : '';

  return `${slug || 'slidedeck-export'}${slug ? idSuffix : ''}.${safeExtension}`;
};
