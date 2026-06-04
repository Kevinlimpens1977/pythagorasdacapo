import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8');
const appShell = readFileSync(new URL('../components/layout/AppShell.jsx', import.meta.url), 'utf8');
const cmsShell = readFileSync(new URL('../components/cms/CmsShell.jsx', import.meta.url), 'utf8');
const contentBlockBuilder = readFileSync(new URL('../components/cms/ContentBlockBuilder.jsx', import.meta.url), 'utf8');
const cropEditorPanel = readFileSync(new URL('../components/cms/CropEditorPanel.jsx', import.meta.url), 'utf8');
const adminKlassenPage = readFileSync(new URL('../pages/AdminKlassenPage.jsx', import.meta.url), 'utf8');
const classOverview = readFileSync(new URL('../components/dashboard/ClassOverview.jsx', import.meta.url), 'utf8');
const takenToewijzenPage = readFileSync(new URL('../pages/TakenToewijzenPage.jsx', import.meta.url), 'utf8');
const packageJson = readFileSync(new URL('../../package.json', import.meta.url), 'utf8');

const getCssRule = (selector) => {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escapedSelector}\\s*\\{([\\s\\S]*?)\\n\\}`, 'm'));
  return match?.[1] || '';
};

test('primary buttons use the Border Signal gradient border style', () => {
  const primaryRule = getCssRule('.btn-primary');

  assert.match(css, /--helix-gradient-border:/);
  assert.match(primaryRule, /border:\s*2px solid transparent/);
  assert.match(primaryRule, /padding-box/);
  assert.match(primaryRule, /border-box/);
  assert.match(primaryRule, /color:\s*var\(--helix-navy\)/);
  assert.doesNotMatch(primaryRule, /text-white/);
});

test('progress lens active tab uses the Border Signal gradient border style', () => {
  const activeRule = getCssRule('.dashboard-lens-tab-active');

  assert.match(activeRule, /border:\s*2px solid transparent/);
  assert.match(activeRule, /var\(--helix-gradient-border\) border-box/);
  assert.match(activeRule, /color:\s*var\(--helix-navy\)/);
  assert.doesNotMatch(activeRule, /blue/);
});

test('progress dashboard uses calm signal styling with selectable signal rows', () => {
  assert.match(classOverview, /signalCount = 0/);
  assert.match(classOverview, /openProgressSignals\.length/);
  assert.match(classOverview, /Alle signalen selecteren/);
  assert.match(classOverview, /Geselecteerde afvinken/);
  assert.match(classOverview, /CheckSquare/);
  assert.match(classOverview, /Square/);
  assert.match(classOverview, /helix-card border-orange-100 bg-orange-50\/45/);
  assert.doesNotMatch(classOverview, /\$\{card\.tone === 'warning' \? 'helix-alert'/);
});

test('admin header active nav uses the Border Signal gradient border style', () => {
  const activeRule = getCssRule('.admin-nav-tab-active');

  assert.match(activeRule, /border:\s*2px solid transparent/);
  assert.match(activeRule, /var\(--helix-gradient-border\) border-box/);
  assert.match(activeRule, /color:\s*var\(--helix-navy\)/);
  assert.doesNotMatch(activeRule, /text-white/);
});

test('admin logo opens the lesson workspace instead of settings', () => {
  assert.match(appShell, /const handleLogoClick = \(\) =>/);
  assert.match(appShell, /navigate\(isAdmin \? '\/admin\/lesstof' : '\/'\)/);
  assert.match(appShell, /aria-label=\{isAdmin \? 'Ga naar Lesstof' : 'Ga naar HELIX start'\}/);
});

test('Helix page background is drawn once on the document canvas', () => {
  const htmlRule = getCssRule('html');
  const bodyRule = getCssRule('body');
  const pageRule = getCssRule('.helix-page');

  assert.match(css, /--helix-page-background:/);
  assert.match(css, /radial-gradient\(circle at top left,\s*rgba\(255,\s*233,\s*220,\s*0\.72\),\s*transparent 34rem\)/);
  assert.match(css, /radial-gradient\(circle at 82% 12%,\s*rgba\(241,\s*233,\s*255,\s*0\.8\),\s*transparent 28rem\)/);
  assert.match(htmlRule, /background:\s*var\(--helix-page-background\)/);
  assert.match(htmlRule, /background-attachment:\s*fixed/);
  assert.match(htmlRule, /background-repeat:\s*no-repeat/);
  assert.match(bodyRule, /background:\s*transparent/);
  assert.match(pageRule, /background:\s*transparent/);
  assert.doesNotMatch(pageRule, /radial-gradient/);
});

test('clickable action cards show the Border Signal gradient only on interaction', () => {
  const cardRule = getCssRule('.helix-action-card');
  const hoverRule = getCssRule('.helix-action-card:hover');
  const focusRule = getCssRule('.helix-action-card:focus-visible');

  assert.match(cardRule, /border:\s*2px solid transparent/);
  assert.match(cardRule, /linear-gradient\(#dfe5ee,\s*#dfe5ee\) border-box/);
  assert.match(cardRule, /color:\s*var\(--helix-navy\)/);
  assert.doesNotMatch(cardRule, /var\(--helix-gradient-border\) border-box/);
  assert.match(hoverRule, /var\(--helix-gradient-border\) border-box/);
  assert.match(focusRule, /var\(--helix-gradient-border\) border-box/);
  assert.doesNotMatch(hoverRule, /text-white/);
});

test('secondary studio buttons use the Border Signal gradient on hover and focus only', () => {
  const secondaryRule = getCssRule('.btn-secondary');
  const hoverRule = getCssRule('.btn-secondary:hover');
  const focusRule = getCssRule('.btn-secondary:focus-visible');

  assert.match(secondaryRule, /border:\s*2px solid transparent/);
  assert.match(secondaryRule, /linear-gradient\(#dfe5ee,\s*#dfe5ee\) border-box/);
  assert.match(secondaryRule, /color:\s*var\(--helix-navy\)/);
  assert.doesNotMatch(secondaryRule, /var\(--helix-gradient-border\) border-box/);
  assert.match(hoverRule, /var\(--helix-gradient-border\) border-box/);
  assert.match(focusRule, /var\(--helix-gradient-border\) border-box/);
});

test('lesblok studio toolbar controls use compact outline states instead of filled gradients', () => {
  const controlRule = getCssRule('.studio-toolbar-control');
  const activeRule = getCssRule('.studio-toolbar-control-active');
  const hoverRule = getCssRule('.studio-toolbar-control:hover');

  assert.match(controlRule, /border:\s*2px solid transparent/);
  assert.match(controlRule, /linear-gradient\(#dfe5ee,\s*#dfe5ee\) border-box/);
  assert.doesNotMatch(controlRule, /var\(--helix-gradient-border\) border-box/);
  assert.match(activeRule, /var\(--helix-gradient-border\) border-box/);
  assert.match(activeRule, /color:\s*var\(--helix-navy\)/);
  assert.match(hoverRule, /var\(--helix-gradient-border\) border-box/);
  assert.doesNotMatch(contentBlockBuilder, /helix-gradient text-white/);
  assert.match(contentBlockBuilder, /studio-toolbar-control/);
});

test('presenter chrome uses the shared soft toolbar surface', () => {
  const chromeRule = getCssRule('.presenter-chrome-surface');

  assert.match(chromeRule, /rgba\(255,\s*233,\s*220,\s*0\.92\)/);
  assert.match(chromeRule, /rgba\(255,\s*230,\s*242,\s*0\.72\)/);
  assert.match(chromeRule, /rgba\(241,\s*233,\s*255,\s*0\.92\)/);
  assert.match(chromeRule, /color:\s*var\(--helix-navy\)/);
});

test('fullscreen crop editor header reuses the presenter soft chrome surface', () => {
  assert.match(cropEditorPanel, /presenter-chrome-surface/);
  assert.doesNotMatch(cropEditorPanel, /bg-slate-950 px-5 py-3 text-white/);
  assert.doesNotMatch(cropEditorPanel, /text-fuchsia-200">Crop\/OCR studio/);
  assert.match(cropEditorPanel, /btn-secondary/);
});

test('class and assignment admin pages use Helix layout without emoji icon fallbacks', () => {
  for (const page of [adminKlassenPage, takenToewijzenPage]) {
    assert.match(page, /helix-page/);
    assert.doesNotMatch(page, /min-h-screen bg-gray-50/);
    assert.doesNotMatch(page, /[\u{1F300}-\u{1FAFF}]/u);
    assert.doesNotMatch(page, /ð|Ã|Ÿ/);
    assert.doesNotMatch(page, /bg-blue-600 hover:bg-blue-700 text-white/);
  }

  assert.match(adminKlassenPage, /UsersRound|Lightbulb|Bot|Calculator|BookOpenCheck/);
  assert.match(adminKlassenPage, /dashboard-lens-tab/);
  assert.match(takenToewijzenPage, /dashboard-lens-tab/);
  assert.match(takenToewijzenPage, /btn-secondary/);
});

test('lesson route builder uses dnd-kit sortable cards with keyboard fallback', () => {
  assert.match(packageJson, /"@dnd-kit\/core"/);
  assert.match(packageJson, /"@dnd-kit\/sortable"/);
  assert.match(contentBlockBuilder, /DndContext/);
  assert.match(contentBlockBuilder, /SortableContext/);
  assert.match(contentBlockBuilder, /KeyboardSensor/);
  assert.match(contentBlockBuilder, /sortableKeyboardCoordinates/);
  assert.match(contentBlockBuilder, /items=\{sortableBlockIds\}/);
  assert.match(contentBlockBuilder, /useSortable/);
});

test('cms contentstudio keeps the left navigation rail full viewport height', () => {
  assert.match(cmsShell, /h-\[calc\(100dvh-5rem\)\]/);
  assert.match(cmsShell, /overflow-hidden/);
  assert.match(cmsShell, /self-stretch/);
  assert.match(cmsShell, /bg-white\/95/);
  assert.match(cmsShell, /className="custom-scrollbar flex-1 overflow-y-auto/);
});

test('question route blocks avoid duplicate linked-question wording', () => {
  assert.match(contentBlockBuilder, /formatQuestionLabel/);
  assert.match(contentBlockBuilder, /Titel in lesroute/);
  assert.match(contentBlockBuilder, /Vraag bewerken/);
  assert.doesNotMatch(contentBlockBuilder, /Gekoppeld aan vraag/);
  assert.doesNotMatch(contentBlockBuilder, /Open vraagstudio/);
  assert.doesNotMatch(contentBlockBuilder, /Vraag \\{vraag\.number\\}: \\{vraag\.title\\}/);
});
