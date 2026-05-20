export const createPdfJsLoadOptions = (url) => ({
  url,
  disableAutoFetch: true,
  disableRange: true,
  disableStream: true,
  withCredentials: false
});

export const buildPdfPageUrl = (url, pageNum) => {
  if (!url) return '';
  const [baseUrl] = String(url).split('#');
  return `${baseUrl}#page=${Math.max(1, Number(pageNum) || 1)}&toolbar=0&navpanes=0&scrollbar=0`;
};
