import { isOptionalParagraph } from './paragraphMetadata.js';

const getProgressPercent = (completed, total) => {
  if (!total) return 0;
  return Math.round((completed / total) * 100);
};

const getCompletedQuestionCount = (voortgang = []) => {
  return voortgang.filter((record) => record.completed === true).length;
};

export const buildStudentProgressSummary = (
  paragrafen = [],
  hoofdstukkenMap = {},
  voortgangMap = {}
) => {
  const sortedParagrafen = [...paragrafen].sort((a, b) => (a.order || 0) - (b.order || 0));

  const chapterMap = new Map();
  let totalQuestions = 0;
  let completedQuestions = 0;

  sortedParagrafen.forEach((paragraaf) => {
    // De teller is het aantal stappen (lesblokken) van de paragraaf: dat is
    // waar de voortgangsrecords bij horen. `vragen` blijft als terugval voor
    // oude paragrafen die nog losse vraagdocumenten hadden.
    const stappen = paragraaf.stappen || paragraaf.vragen || [];
    const paragraafTotal = stappen.length;
    const paragraafCompleted = getCompletedQuestionCount(voortgangMap[paragraaf.id] || []);
    // Een vrijwillige plusparagraaf staat wel in de lijst, maar telt niet mee in
    // het percentage dat een leerling af moet hebben.
    const optioneel = isOptionalParagraph(paragraaf);

    if (!optioneel) {
      totalQuestions += paragraafTotal;
      completedQuestions += paragraafCompleted;
    }

    const hoofdstuk = hoofdstukkenMap[paragraaf.hoofdstukId] || {
      id: paragraaf.hoofdstukId || 'zonder-hoofdstuk',
      title: 'Zonder hoofdstuk',
      order: 999
    };

    if (!chapterMap.has(hoofdstuk.id)) {
      chapterMap.set(hoofdstuk.id, {
        id: hoofdstuk.id,
        number: hoofdstuk.number,
        title: hoofdstuk.title || 'Zonder titel',
        order: hoofdstuk.order || 999,
        totalQuestions: 0,
        completedQuestions: 0,
        progressPercent: 0,
        paragrafen: []
      });
    }

    const chapter = chapterMap.get(hoofdstuk.id);
    if (!optioneel) {
      chapter.totalQuestions += paragraafTotal;
      chapter.completedQuestions += paragraafCompleted;
    }
    chapter.paragrafen.push({
      id: paragraaf.id,
      number: paragraaf.number || paragraaf.code,
      title: paragraaf.title || 'Zonder titel',
      optioneel,
      verplicht: !optioneel,
      totalQuestions: paragraafTotal,
      completedQuestions: paragraafCompleted,
      progressPercent: getProgressPercent(paragraafCompleted, paragraafTotal)
    });
  });

  const chapterGroups = [...chapterMap.values()]
    .map((chapter) => ({
      ...chapter,
      progressPercent: getProgressPercent(chapter.completedQuestions, chapter.totalQuestions)
    }))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return {
    totalQuestions,
    completedQuestions,
    progressPercent: getProgressPercent(completedQuestions, totalQuestions),
    chapterGroups
  };
};
