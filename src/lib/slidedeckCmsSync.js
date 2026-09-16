import { normalizeSlidedeckReviewStatus } from './slidedeckReview.js';

const REVIEW_GATED_STATUSES = new Set(['needs_review', 'rejected']);

const shouldProtectPublishedStatus = (reviewStatus) => REVIEW_GATED_STATUSES.has(reviewStatus);

export const buildSlidedeckCmsBlockSyncPatch = ({ block = {}, deckPackage = {} } = {}) => {
  if (block.type !== 'slidedeck' || !deckPackage.id) return null;

  const reviewStatus = normalizeSlidedeckReviewStatus(deckPackage.reviewStatus);
  const generatedDeckPdf = deckPackage.generatedDeckPdf || {};
  const sourcePdf = deckPackage.sourcePdf || {};
  const content = {
    ...(block.content || {}),
    slidedeckPackageId: deckPackage.id,
    deckTitle: deckPackage.title || block.content?.deckTitle || block.title || '',
    generatedDeckUrl: generatedDeckPdf.downloadURL || '',
    generatedDeckStoragePath: generatedDeckPdf.storagePath || '',
    sourcePdfUrl: sourcePdf.downloadURL || '',
    sourcePdfStoragePath: sourcePdf.storagePath || '',
    // Het aantal dia's reist mee met het lesblok, zodat de teller ook klopt
    // wanneer de viewer de PDF zelf niet kan inlezen en op de ingebouwde
    // PDF-weergave terugvalt. 0 betekent: onbekend.
    deckPageCount: Math.max(0, Math.round(Number(generatedDeckPdf.pageCount ?? block.content?.deckPageCount ?? 0))) || 0
  };

  return {
    status: block.status === 'published' && shouldProtectPublishedStatus(reviewStatus)
      ? 'needs_review'
      : block.status || 'draft',
    content,
    sourceReview: {
      reviewStatus,
      sourceTagsSummary: deckPackage.sourceTagsSummary || {},
      citations: Array.isArray(deckPackage.citations) ? deckPackage.citations : [],
      teacherDecisionNote: deckPackage.teacherDecisionNote || '',
      slidedeckPackageId: deckPackage.id
    }
  };
};
