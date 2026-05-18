export const buildAdminDashboardStats = (klassen = []) => {
  const activeParagrafen = new Set();

  const studentCount = klassen.reduce((total, klas) => {
    (klas.enabledParagrafen || []).forEach((paragraafId) => activeParagrafen.add(paragraafId));
    return total + (klas.students || []).length;
  }, 0);

  return {
    classCount: klassen.length,
    studentCount,
    activeParagraphCount: activeParagrafen.size
  };
};
