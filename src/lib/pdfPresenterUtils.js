export const PDF_LOAD_TIMEOUT_MS = 12000;

export const createPdfJsLoadOptions = (url) => ({
  url,
  disableAutoFetch: true,
  disableRange: true,
  disableStream: true,
  withCredentials: false
});

export const createPdfJsDataLoadOptions = (data) => ({
  data: data instanceof Uint8Array ? data : new Uint8Array(data),
  disableAutoFetch: true,
  disableRange: true,
  disableStream: true
});

export const buildPdfPageUrl = (url, pageNum) => {
  if (!url) return '';
  const [baseUrl] = String(url).split('#');
  return `${baseUrl}#page=${Math.max(1, Number(pageNum) || 1)}&toolbar=0&navpanes=0&scrollbar=0`;
};

export const withTimeout = (promise, timeoutMs = PDF_LOAD_TIMEOUT_MS, label = 'Actie') => {
  let timeoutId;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${label} duurde te lang.`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
};

export const getPdfLoadErrorMessage = (error) => {
  const message = String(error?.message || error || '').toLowerCase();

  if (
    message.includes('cors') ||
    message.includes('failed to fetch') ||
    message.includes('network') ||
    message.includes('xmlhttprequest') ||
    message.includes('object-not-found') ||
    message.includes('unauthorized')
  ) {
    return 'Firebase Storage blokkeert het in-browser laden van deze PDF. Stel CORS voor de Storage-bucket goed in om de presentatie als losse dia’s te tonen.';
  }

  if (message.includes('duurde te lang')) {
    return 'De presentatie-PDF reageerde niet op tijd. Controleer de Storage-instellingen of open de PDF apart.';
  }

  return 'Deze presentatie-PDF kon niet als losse dia’s worden geladen. Open de PDF apart om het bestand te controleren.';
};
