// Zonder animatie als de leerling dat in zijn systeem heeft aangezet.
export function wilMinderBeweging() {
  try {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  } catch {
    return false;
  }
}
