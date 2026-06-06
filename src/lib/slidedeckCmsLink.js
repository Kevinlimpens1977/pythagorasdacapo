export const buildSlidedeckCreatorUrl = ({ paragraafId = '', contentBlockId = '' } = {}) => {
  const params = new URLSearchParams();
  if (paragraafId) params.set('paragraafId', paragraafId);
  if (contentBlockId) params.set('contentBlockId', contentBlockId);
  const query = params.toString();
  return query ? `/admin/slidedecks?${query}` : '/admin/slidedecks';
};
