import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildProjectKompasToc,
  formatProjectKompasUpdatedAt,
  renderProjectKompasMarkdown,
  slugifyHeading
} from './projectKompasMarkdown.js';

test('slugifyHeading creates stable ids for Dutch headings', () => {
  assert.equal(slugifyHeading('Voortgang & Analytics Versterken'), 'voortgang-analytics-versterken');
  assert.equal(slugifyHeading('Digidocent/OpenRouter instellingen'), 'digidocent-openrouter-instellingen');
});

test('buildProjectKompasToc extracts heading levels and keeps duplicate ids unique', () => {
  const toc = buildProjectKompasToc(`# HELIX\n\n## Voortgang\n### Open\n## Voortgang`);

  assert.deepEqual(toc, [
    { id: 'helix', level: 1, title: 'HELIX' },
    { id: 'voortgang', level: 2, title: 'Voortgang' },
    { id: 'open', level: 3, title: 'Open' },
    { id: 'voortgang-2', level: 2, title: 'Voortgang' }
  ]);
});

test('renderProjectKompasMarkdown renders headings, lists and code blocks without executing html', () => {
  const result = renderProjectKompasMarkdown(`# Titel\n\n- Item met \`code\`\n\n<script>alert(1)</script>\n\n\`\`\`\n<a>\n\`\`\``);

  assert.match(result.html, /<h1 id="titel">Titel<\/h1>/);
  assert.match(result.html, /<li>Item met <code>code<\/code><\/li>/);
  assert.match(result.html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(result.html, /<pre><code>&lt;a&gt;<\/code><\/pre>/);
});

test('formatProjectKompasUpdatedAt formats valid timestamps and handles missing metadata', () => {
  assert.equal(formatProjectKompasUpdatedAt('geen datum'), 'Onbekend');
  assert.match(formatProjectKompasUpdatedAt('2026-06-03T10:15:00.000Z'), /2026|03|jun/);
});
