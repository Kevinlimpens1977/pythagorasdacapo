export const buildSlidedeckCreatorUrl = ({ paragraafId = '' } = {}) => {
  const params = new URLSearchParams();
  if (paragraafId) params.set('paragraafId', paragraafId);
  const query = params.toString();
  return query ? `/admin/slidedecks?${query}` : '/admin/slidedecks';
};
