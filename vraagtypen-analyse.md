# Vraagtypen analyse DV Leerplatform

Deze analyse is gebaseerd op de huidige codebase. Ik heb gezocht naar `vraagtype`, `antwoord`, `meerkeuze`, `numeriek`, `tabel`, `saveVoortgang`, `saveContentBlockVoortgang`, `isAnswerCorrect`, `options` en verwante termen in `src/`.

## 1. Bestaande vraagtypen

### Gedefinieerde waarden

De formele vraagtype-union staat in [src/types/cms.types.js](src/types/cms.types.js):

```js
/**
 * @typedef {Object} Vraag
 * @property {string} id - Unique question ID
 * @property {string} vakId - Parent vak ID
 * @property {string} leerjaarId - Parent leerjaar ID
 * @property {string} niveauId - Parent niveau ID
 * @property {string} hoofdstukId - Parent chapter ID
 * @property {string} paragraafId - Parent paragraph ID
 * @property {string} number - Question number (e.g., "14a")
 * @property {string} title - Question title
 * @property {"open"|"meerkeuze"|"numeriek"|"tabel"} vraagtype - Question type
 * @property {VraagContent} content - Question content
 * @property {VraagMetadata} vraagMetadata - Question metadata
 * @property {Object} antwoord - Answer (varies by type)
 * @property {number} order - Sort order within paragraph
 * @property {"draft"|"published"|"archived"} status - Publication status
 * @property {string} createdBy - Admin user ID
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {Date} lastAnswerAt - Last student answer time
 * @property {Object} analytics - Performance analytics
 * @property {boolean} isArchived - Is archived?
 */
```

Daarmee zijn formeel gedefinieerd:

- `open`
- `meerkeuze`
- `numeriek`
- `tabel`

In de CMS UI worden alleen deze drie opties aangeboden:

- `open`
- `meerkeuze`
- `numeriek`

Letterlijke code uit [src/components/cms/CreateQuestionModal.jsx](src/components/cms/CreateQuestionModal.jsx):

```jsx
<select
  value={vraagtype}
  onChange={(e) => setVraagtype(e.target.value)}
  className="input-standard w-full"
>
  <option value="open">Open vraag</option>
  <option value="meerkeuze">Meerkeuze</option>
  <option value="numeriek">Numeriek</option>
</select>
```

Letterlijke code uit [src/components/cms/QuestionEditor.jsx](src/components/cms/QuestionEditor.jsx):

```jsx
<select
  value={vraagtype}
  onChange={(e) => setVraagtype(e.target.value)}
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
>
  <option value="open">Open vraag</option>
  <option value="meerkeuze">Meerkeuze</option>
  <option value="numeriek">Numeriek</option>
</select>
```

Conclusie: `tabel` bestaat in de type-definitie, maar ik heb geen CMS-keuze gevonden waarmee een docent `tabel` kan instellen.

### Default vraagtype

Nieuwe vragen krijgen standaard `open` als `vraagtype`. Letterlijke code uit [src/services/cmsService.js](src/services/cmsService.js):

```js
await setDoc(doc(db, 'vraag', vraagId), {
  vakId: paragraaf.vakId,
  leerjaarId: paragraaf.leerjaarId,
  niveauId: paragraaf.niveauId,
  hoofdstukId: paragraaf.hoofdstukId,
  paragraafId,
  number: data.number,
  title: data.title,
  vraagtype: data.vraagtype || 'open',
  order: nextOrder,
  status: data.status || 'draft',
  createdBy: userId,
  createdAt: serverTimestamp(),
  content: {
    text: data.content?.text || '',
    images: data.content?.images || []
  },
  vraagMetadata: {
    difficulty: data.vraagMetadata?.difficulty || 3,
    hints: data.vraagMetadata?.hints || [],
    showCalculator: data.vraagMetadata?.showCalculator || false,
    calculatorMode: data.vraagMetadata?.calculatorMode || 'standard'
  },
  antwoord: data.antwoord || {},
  isArchived: false
});
```

Bij het toevoegen van een vraag-lesblok wordt ook expliciet een open vraag aangemaakt. Letterlijke code uit [src/components/cms/ContentBlockBuilder.jsx](src/components/cms/ContentBlockBuilder.jsx):

```js
if (type === 'question') {
  const number = getNextQuestionNumber(vragen);
  linkedVraagId = await cmsService.createVraag(
    paragraaf.id,
    {
      number,
      title: `Vraag ${number}`,
      status: 'draft',
      vraagtype: 'open',
      content: { text: '<p></p>', images: [] },
      antwoord: { type: 'open' }
    },
    userId
  );
}
```

## 2. Studentweergave

### Moderne leerlingroute

De huidige leerlingroute staat in [src/pages/StudentLessonPage.jsx](src/pages/StudentLessonPage.jsx). Deze route kijkt naar `block.type`, niet naar `linkedVraag.vraagtype`.

Letterlijke code die de vraagtekst kiest:

```js
const bodyHtml =
  block?.type === 'question'
    ? linkedVraag?.content?.text || content.html || '<p>Nog geen vraagtekst ingevuld.</p>'
    : content.html || content.text || '';
```

Letterlijke code die bepaalt welk component de leerling ziet:

```jsx
{block.type === 'game' ? (
  <GameBlock block={block} onComplete={onGameComplete} />
) : block.type === 'slidedeck' ? (
  <SlidedeckBlock block={block} onOpen={onOpenSlidedeck} />
) : (
  <DefaultLearningBlock block={block} bodyHtml={bodyHtml} linkedVraag={linkedVraag} />
)}
```

`DefaultLearningBlock` rendert de vraag als HTML en optionele afbeelding. Er is hier geen switch op `vraagtype`.

```jsx
function DefaultLearningBlock({ block, bodyHtml, linkedVraag }) {
  const content = block.content || {};
  const imageUrl = content.imageUrl || content.mediaUrl || linkedVraag?.content?.images?.[0] || '';
  const caption = content.caption || content.altText || '';

  if (block.type === 'media') {
    return (
      <div className="space-y-6">
        {bodyHtml && (
          <div
            className="prose prose-lg max-w-none leading-8 text-[var(--helix-muted)] prose-headings:font-display prose-headings:text-[var(--helix-navy)]"
            dangerouslySetInnerHTML={htmlValue(bodyHtml)}
          />
        )}
        <MediaRenderer
          media={normalizeMediaContent(content)}
          title={block.title || 'Media'}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div
        className="prose prose-lg max-w-none leading-8 text-[var(--helix-muted)] prose-headings:font-display prose-headings:text-[var(--helix-navy)] prose-img:rounded-2xl prose-img:border prose-img:border-[var(--helix-border)]"
        dangerouslySetInnerHTML={htmlValue(bodyHtml || '<p>Nog geen inhoud ingevuld.</p>')}
      />

      {imageUrl && (
        <figure className="overflow-hidden rounded-3xl border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] p-3">
          <img src={imageUrl} alt={caption || block.title || ''} className="w-full rounded-xl object-contain" />
          {caption && <figcaption className="mt-3 px-1 text-sm font-semibold text-[var(--helix-muted)]">{caption}</figcaption>}
        </figure>
      )}
    </div>
  );
}
```

Conclusie voor de moderne leerlingroute: er is geen apart leerlingcomponent per `vraagtype` gevonden. Een vraagblok wordt als content weergegeven via `DefaultLearningBlock`.

### Legacy slide-route

Er is wel een oudere slide/exercise-route in [src/components/slides/SlideRenderer.jsx](src/components/slides/SlideRenderer.jsx). Daar wordt een gekoppelde CMS-vraag omgezet naar een `exercise` slide. Alleen `numeriek` krijgt automatisch een invulveld; andere vraagtypes krijgen `fields: []`.

```js
const vraagToExerciseSlide = (block, vraag) => ({
  id: block.id,
  blockId: block.id,
  type: 'exercise',
  heading: vraag?.title || block.title || 'Vraag',
  content: htmlToPlainText(vraag?.content?.text || block.content?.html || ''),
  paragraafId: block.paragraafId,
  hoofdstukId: block.hoofdstukId,
  exercise: {
    type: vraag?.vraagtype || 'open',
    fields: vraag?.vraagtype === 'numeriek'
      ? [
          {
            id: `${vraag.id}-antwoord`,
            label: vraag.number || 'Antwoord',
            answer: vraag.antwoord?.expected ?? vraag.antwoord?.correctValue ?? '',
            hint: vraag.antwoord?.hintBijFout || vraag.vraagMetadata?.hints?.[0] || ''
          }
        ]
      : []
  }
});
```

De slide-renderer switcht op `currentSlide.type`, niet rechtstreeks op `vraagtype`:

```jsx
const renderSlideContent = () => {
  const isCompleted = userData?.completedSlides?.includes(currentSlide.id) || false;

  switch (currentSlide.type) {
    case 'presentation': return <PresentationSlide key={currentSlide.id} slide={currentSlide} chapterId={chapterId} />;
    case 'theory': return <TheorySlide key={currentSlide.id} slide={currentSlide} />;
    case 'exercise': return (
      <ExerciseSlide
        key={currentSlide.id}
        slide={currentSlide}
        chapterId={chapterId}
        isCompleted={isCompleted}
        onVerified={() => handleSlideVerified(currentSlide.id)}
      />
    );
    case 'evaluation': return (
      <EvaluationSlide
        key={currentSlide.id}
        slide={currentSlide}
        chapterId={chapterId}
        isCompleted={isCompleted}
        onVerified={() => handleSlideVerified(currentSlide.id)}
      />
    );
    case 'evaluation_summary': return <EvaluationSummarySlide key={currentSlide.id} userData={userData} chapterId={chapterId} />;
    case 'demo_exercise': return <DemoSlide key={currentSlide.id} slide={currentSlide} />;
    case 'summary': return <SummarySlide key={currentSlide.id} slide={currentSlide} />;
    case 'slidedeck': return <SlidedeckSlide key={currentSlide.id} slide={currentSlide} />;
    default:
      // Check if it's an exercise with special type
      if (currentSlide.type === 'exercise' && currentSlide.exercise?.type === 'pythagoras_proof') {
        return (
          <PythagorasProofSlide
            key={currentSlide.id}
            slide={currentSlide}
            chapterId={chapterId}
            isCompleted={isCompleted}
            onVerified={() => handleSlideVerified(currentSlide.id)}
          />
        );
      }
      return <div className="text-center p-8 text-slate-500">Onbekend slide type: {currentSlide.id}</div>;
  }
};
```

Componenten in deze route:

- `ExerciseSlide` rendert `currentSlide.type === 'exercise'`.
- `EvaluationSlide` rendert `currentSlide.type === 'evaluation'`.
- `PythagorasProofSlide` is bedoeld voor `currentSlide.exercise?.type === 'pythagoras_proof'`, maar deze check staat na de `case 'exercise'` en is daardoor in deze switch niet bereikbaar voor slides met `type: 'exercise'`.

## 3. CMS-weergave

### Componenten waarmee vraagtype gekozen wordt

Een docent kan het vraagtype kiezen in:

- [src/components/cms/CreateQuestionModal.jsx](src/components/cms/CreateQuestionModal.jsx)
- [src/components/cms/QuestionEditor.jsx](src/components/cms/QuestionEditor.jsx)

Initialisatie in `CreateQuestionModal`:

```js
const [vraagtype, setVraagtype] = useState('open');
```

Aanmaken in `CreateQuestionModal`:

```js
const vraagId = await cmsService.createVraag(
  paragraafId,
  {
    number: parseInt(number, 10),
    title: title.trim(),
    vraagtype,
    status: 'draft',
    content: {
      text: '<p></p>',
      images: []
    },
    vraagMetadata: {
      difficulty: 3,
      hints: [],
      showCalculator: false
    }
  },
  userId
);
```

Initialisatie in `QuestionEditor`:

```js
const [vraagtype, setVraagtype] = useState(vraag?.vraagtype || 'open');
```

### Antwoord-object per type

De type-definities beschrijven meerdere antwoordstructuren in [src/types/cms.types.js](src/types/cms.types.js):

```js
/**
 * @typedef {Object} MultiChoiceAntwoord
 * @property {Array<ChoiceOption>} options - Answer options
 */

/**
 * @typedef {Object} ChoiceOption
 * @property {string} id - Option ID (e.g., "opt_a")
 * @property {string} text - Display text
 * @property {boolean} correct - Is this correct?
 * @property {string} explanation - Why is this correct/wrong?
 */

/**
 * @typedef {Object} NumericAntwoord
 * @property {number} correctValue - Correct answer
 * @property {number} tolerance - Tolerance (Â±)
 * @property {string} unit - Unit (e.g., "cmÂ²")
 * @property {string} explanation - Explanation
 */

/**
 * @typedef {Object} OpenAntwoord
 * @property {string} modelAnswer - Model answer text
 * @property {string[]} keywords - Expected keywords
 * @property {Array<RubricPoint>} rubric - Scoring rubric
 */

/**
 * @typedef {Object} TableAntwoord
 * @property {number} tableIndex - Which table in content.tables
 * @property {Object<string, number>} correctValues - e.g. {"1,1": 16, "2,1": 30.25}
 * @property {number} tolerance - Tolerance for numeric cells
 */
```

De daadwerkelijke editor-save vanuit `QuestionEditor` wijkt hiervan af. `numeriek` gebruikt `expected`, niet `correctValue`. `open` en `meerkeuze` krijgen alleen `{ type: vraagtype }`.

```js
getFormState: () => ({
  title,
  vraagtype,
  status,
  difficulty,
  showCalculator,
  hints,
  antwoord: vraagtype === 'numeriek'
    ? {
        type: 'numeriek',
        expected: parseFloat(antwoordExpected) || 0,
        tolerance: parseFloat(antwoordTolerance) || 0.5,
        unit: antwoordUnit,
        hintBijFout: antwoordHint
      }
    : { type: vraagtype }
}),
```

Deze data wordt vervolgens opgeslagen via `DualPanelEditor`:

```js
await cmsService.updateVraag(vraag.id, {
  title: formState.title || vraag.title,
  vraagtype: formState.vraagtype || vraag.vraagtype,
  status: formState.status || vraag.status,
  content: {
    text: editor.getHTML(),
    images: vraag?.content?.images || [],
  },
  vraagMetadata: {
    difficulty: formState.difficulty || vraag.vraagMetadata?.difficulty || 3,
    hints: formState.hints || vraag.vraagMetadata?.hints || [],
    showCalculator: formState.showCalculator || vraag.vraagMetadata?.showCalculator || false,
    calculatorMode: 'standard',
  },
  antwoord: formState.antwoord || vraag?.antwoord || { type: formState.vraagtype || vraag.vraagtype },
});
```

### Antwoordopties voor meerkeuze

Er is een type-definitie voor `MultiChoiceAntwoord.options`, maar ik heb geen werkende CMS UI gevonden om antwoordopties toe te voegen, te bewerken of correct te markeren.

De huidige `QuestionEditor` toont voor `meerkeuze` alleen een placeholdermelding:

```jsx
{vraagtype === 'numeriek' ? (
  <div className="space-y-4">
    <p className="text-sm text-gray-600 mb-4">
      Definieer het verwachte antwoord. Studenten krijgen directe feedback.
    </p>

    {/* Expected Answer */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Verwacht antwoord
      </label>
      <input
        type="number"
        step="any"
        value={antwoordExpected}
        onChange={(e) => setAntwoordExpected(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Bijv. 5"
      />
    </div>

    {/* Tolerance */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tolerantie (±)
      </label>
      <input
        type="number"
        step="any"
        value={antwoordTolerance}
        onChange={(e) => setAntwoordTolerance(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="0.5"
      />
      <p className="text-xs text-gray-500 mt-1">
        Antwoorden binnen ±{antwoordTolerance} worden goed gerekend
      </p>
    </div>

    {/* Unit */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Eenheid (optioneel)
      </label>
      <input
        type="text"
        value={antwoordUnit}
        onChange={(e) => setAntwoordUnit(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="cm, m², ..."
      />
    </div>

    {/* Hint bij fout */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Hint bij fout antwoord
      </label>
      <textarea
        value={antwoordHint}
        onChange={(e) => setAntwoordHint(e.target.value)}
        rows={3}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Geef een hint..."
      />
    </div>
  </div>
) : vraagtype === 'open' ? (
  <div className="p-4 bg-gray-50 rounded-lg">
    <p className="text-sm text-gray-600">
      📝 <strong>Open vraag</strong> – Leerling typt vrij antwoord. Geen automatische controle. Docent beoordeelt.
    </p>
  </div>
) : vraagtype === 'meerkeuze' ? (
  <div className="p-4 bg-gray-50 rounded-lg">
    <p className="text-sm text-gray-600">
      🎯 <strong>Meerkeuze</strong> – Antwoord-schema wordt later uitgebouwd.
    </p>
  </div>
) : null}
```

Conclusie: antwoordopties voor meerkeuze zijn wel als JSDoc-structuur beschreven, maar niet gevonden als werkende CMS-opslag/editorflow.

## 4. Scoring en validatie

### Moderne leerlingroute

In [src/pages/StudentLessonPage.jsx](src/pages/StudentLessonPage.jsx) wordt een vraagblok afgerond zodra de leerling op volgende klikt. Er wordt geen antwoord ingevoerd of gevalideerd op basis van `vraagtype`.

```js
const saveBlockProgress = async (block, completed = true, extra = {}) => {
  if (!block || !currentUser || isAdmin || !klasData?.klasId) return;

  await voortgangService.saveContentBlockVoortgang(
    currentUser.uid,
    block.id,
    block.paragraafId || paragraafId,
    block.hoofdstukId || paragraaf?.hoofdstukId || '',
    klasData.klasId,
    { completed, ...extra }
  );

  const refreshed = await voortgangService.getVoortgangForParagraaf(currentUser.uid, paragraafId);
  setProgressRecords(refreshed);
};

const goNext = async () => {
  if (currentBlock) {
    await saveBlockProgress(currentBlock, true);
  }

  if (currentIndex < blocks.length - 1) {
    setCurrentIndex((index) => index + 1);
  } else {
    navigate('/');
  }
};
```

Conclusie: in de moderne leerlingroute is geen scoring per vraagtype gevonden.

### Legacy slide-route

Er is wel een aparte scoring-helper in [src/lib/answerNormalization.js](src/lib/answerNormalization.js):

```js
/**
 * Normalize answer string for comparison
 * Handles separators, letter order, and case sensitivity
 *
 * Examples:
 * - "ABC en ACD" = "BAC en ADC" = "abc & acd"
 * - All normalize to same value
 */
export const normalizeAnswer = (str) => {
  if (!str) return '';

  // 1. Replace separators with a common one (|)
  let normalized = str.toLowerCase()
    .replace(/\s+en\s+/g, '|')
    .replace(/\+/g, '|')
    .replace(/&/g, '|')
    .replace(/,/g, '|')
    .replace(/;/g, '|');

  // 2. Split into parts
  let parts = normalized.split('|').map(p => {
    // 3. For each part, remove all whitespace
    let clean = p.replace(/\s+/g, '');

    // 4. Sort letters alphabetically in each part (works for any length)
    if (/^[a-z]+$/.test(clean) && clean.length > 0) {
      return clean.split('').sort().join('');
    }
    return clean;
  }).filter(p => p !== '');

  // 5. Sort the parts alphabetically and join
  return parts.sort().join(' ');
};

/**
 * Check if student answer matches any of the correct answers
 * Uses normalization for flexible matching
 */
export const isAnswerCorrect = (studentAnswer, correctAnswers) => {
  const normalizedStudent = normalizeAnswer(studentAnswer?.toString() || '');
  const possibleAnswers = Array.isArray(correctAnswers) ? correctAnswers : [correctAnswers];

  return possibleAnswers.some(ans => normalizeAnswer(ans.toString()) === normalizedStudent);
};
```

`ExerciseSlide` gebruikt die helper binnen de component:

```js
const handleCheck = () => {
  if (isRevealed) return;

  let newStatus = {};
  let allCorrect = true;

  // Standard fields
  const checkField = (f) => {
    const correct = isAnswerCorrect(answers[f.id], f.answer);

    newStatus[f.id] = correct ? 'correct' : 'incorrect';
    if (!correct) allCorrect = false;
  };

  // Standard fields
  fields.forEach(checkField);

  // Table fields
  if (slide.exercise?.type === 'table') {
    slide.exercise.rows.forEach(row => {
      row.fields.forEach(checkField);
    });
    
    if (slide.exercise.extraFields) {
      slide.exercise.extraFields.forEach(checkField);
    }
  }

  setStatus(newStatus);
  const newAttempts = attempts + 1;
  setAttempts(newAttempts);
```

`EvaluationSlide` gebruikt dezelfde helper:

```js
const handleCheck = () => {
  if (isEvaluationDone) return;

  let newStatus = {};
  let allCorrect = true;

  // Check all fields
  const checkField = (f) => {
    const correct = isAnswerCorrect(answers[f.id], f.answer);
    newStatus[f.id] = correct ? 'correct' : 'incorrect';
    if (!correct) allCorrect = false;
  };

  fields.forEach(checkField);
  setStatus(newStatus);
  const newAttempts = attempts + 1;
  setAttempts(newAttempts);
```

Conclusie: er is een aparte helper (`isAnswerCorrect`), maar de validatie- en voortganglogica gebeurt in `ExerciseSlide` en `EvaluationSlide`. De helper vergelijkt genormaliseerde strings; de `tolerance` velden uit de CMS/type-definities worden hier niet gebruikt.

## 5. Voortgang

### Moderne leerlingroute: content block progress

In de moderne leerlingroute wordt bijgehouden of een leerling een lesblok heeft afgerond. Dit gebeurt via [src/services/voortgangService.js](src/services/voortgangService.js), functie `saveContentBlockVoortgang`.

Firestore-pad:

```txt
voortgang/{userId}_{blockId}
```

Letterlijke code:

```js
export const saveContentBlockVoortgang = async (
  userId,
  blockId,
  paragraafId,
  hoofdstukId,
  klasId,
  data = {}
) => {
  if (!userId || !blockId || !paragraafId || !klasId) {
    throw new Error('userId, blockId, paragraafId, and klasId are required');
  }

  try {
    const docId = `${userId}_${blockId}`;
    const docRef = doc(db, 'voortgang', docId);

    let existingData = {};
    try {
      const existing = await getDoc(docRef);
      if (existing.exists()) {
        existingData = existing.data();
      }
    } catch {
      // Missing progress doc is fine for first visit.
    }

    const updates = {
      userId,
      blockId,
      paragraafId,
      hoofdstukId,
      klasId,
      progressType: 'contentBlock',
      completed: data.completed || false,
      isCorrect: data.isCorrect || false,
      attempts: data.attempts || existingData.attempts || 1,
      lastAnswer: data.lastAnswer || existingData.lastAnswer || null,
      updatedAt: serverTimestamp(),
      firstAttemptAt: existingData.firstAttemptAt || serverTimestamp()
    };

    if (data.completed && !existingData.completedAt) {
      updates.completedAt = serverTimestamp();
    }

    await setDoc(docRef, updates, { merge: true });
  } catch (error) {
    console.error('âŒ [Voortgang] Error saving content block progress:', error);
    throw error;
  }
};
```

Bij een standaard vraagblok in de moderne leerlingroute wordt geen `lastAnswer` opgeslagen, omdat er geen invoercomponent is. Bij games kan wel een resultaat als `lastAnswer` meegaan:

```jsx
<LessonBlockContent
  block={currentBlock}
  step={currentIndex + 1}
  totalSteps={blocks.length}
  isCompleted={completedIds.has(currentBlock?.id)}
  onOpenSlidedeck={setActiveSlidedeck}
  onGameComplete={(result) => saveBlockProgress(currentBlock, true, { lastAnswer: result })}
/>
```

### Legacy vraagprogressie

Voor legacy exercise/evaluation slides bestaat ook `saveVoortgang`.

Firestore-pad:

```txt
voortgang/{userId}_{vraagId}
```

Letterlijke code:

```js
export const saveVoortgang = async (
  userId,
  vraagId,
  paragraafId,
  hoofdstukId,
  klasId,
  data
) => {
  if (!userId || !vraagId || !paragraafId || !klasId) {
    throw new Error('userId, vraagId, paragraafId, and klasId are required');
  }

  try {
    const docId = `${userId}_${vraagId}`;
    const docRef = doc(db, 'voortgang', docId);

    // Get existing doc to preserve firstAttemptAt
    let existingData = {};
    try {
      const existing = await getDoc(docRef);
      if (existing.exists()) {
        existingData = existing.data();
      }
    } catch {
      // Doc doesn't exist yet, that's ok
    }

    const updates = {
      userId,
      vraagId,
      paragraafId,
      hoofdstukId,
      klasId,
      completed: data.completed || false,
      isCorrect: data.isCorrect || false,
      attempts: data.attempts || 1,
      lastAnswer: data.lastAnswer || null,
      updatedAt: serverTimestamp(),

      // Only set on first attempt
      firstAttemptAt: existingData.firstAttemptAt || serverTimestamp()
    };

    // Set completedAt if question is marked as completed
    if (data.completed && !existingData.completedAt) {
      updates.completedAt = serverTimestamp();
    }

    await setDoc(docRef, updates, { merge: true });
    console.log(`âœ… [Voortgang] Saved progress for vraag ${vraagId}`);
  } catch (error) {
    console.error('âŒ [Voortgang] Error saving progress:', error);
    throw error;
  }
};
```

`ExerciseSlide` schrijft bij een goed antwoord:

```js
voortgangService.saveVoortgang(
  currentUser.uid,
  slide.id,
  slide.paragraafId,
  slide.hoofdstukId,
  klasData.klasId,
  {
    completed: true,
    isCorrect: true,
    attempts: newAttempts,
    lastAnswer: answers
  }
).catch(err => console.error('Error saving voortgang:', err));
```

`ExerciseSlide` schrijft bij een fout antwoord:

```js
voortgangService.saveVoortgang(
  currentUser.uid,
  slide.id,
  slide.paragraafId,
  slide.hoofdstukId,
  klasData.klasId,
  {
    completed: false,
    isCorrect: false,
    attempts: newAttempts,
    lastAnswer: answers
  }
).catch(err => console.error('Error saving voortgang:', err));
```

Daarnaast schrijft `ExerciseSlide` legacy details naar het user-document:

```js
const updateData = {
  [`exerciseData.${chapterId}.${slide.id}.answers`]: answers,
  [`exerciseData.${chapterId}.${slide.id}.attempts`]: newAttempts,
  [`exerciseData.${chapterId}.${slide.id}.isCorrect`]: allCorrect,
  [`exerciseData.${chapterId}.${slide.id}.timestamp`]: new Date(),
  warning: null
};

updateDoc(userRef, updateData).catch(err => console.error("Error saving detailed results:", err));
```

`EvaluationSlide` schrijft op vergelijkbare manier naar `voortgang` en daarnaast naar `users/{uid}.evaluationData`:

```js
const updateData = {
  [`evaluationData.${chapterId}.${slide.id}.answers`]: answers,
  [`evaluationData.${chapterId}.${slide.id}.isCorrect`]: allCorrect,
  [`evaluationData.${chapterId}.${slide.id}.score`]: allCorrect ? 1 : 0,
  [`evaluationData.${chapterId}.${slide.id}.timestamp`]: new Date(),
};

updateDoc(userRef, updateData).catch(err => console.error("Error saving evaluation results:", err));
```

## Samenvatting van wat niet gevonden is

- Geen TypeScript `enum` gevonden; de vraagtypes staan als JSDoc union in `src/types/cms.types.js`.
- Geen werkende leerlingcomponent gevonden die in de moderne leerlingroute switcht op `vraagtype`.
- Geen moderne student-renderers gevonden voor `open`, `meerkeuze`, `numeriek` en `tabel` als losse vraagtype-componenten.
- Geen CMS UI gevonden om meerkeuze-opties (`options`) toe te voegen, te bewerken of correct te markeren.
- Geen CMS UI gevonden om `tabel` als vraagtype te kiezen.
- Geen scoring in de moderne leerlingroute gevonden voor vraagblokken.
- Geen numerieke tolerance-validatie gevonden in de scoring-helper; `isAnswerCorrect` vergelijkt genormaliseerde strings.
