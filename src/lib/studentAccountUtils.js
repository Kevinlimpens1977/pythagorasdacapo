export const enrichStudentsWithClassName = (students = [], klassen = []) => {
  const classById = new Map(klassen.map((klas) => [klas.id, klas]));

  return students.map((student) => {
    const klas = student.klasId ? classById.get(student.klasId) : null;
    return {
      ...student,
      klasName: klas?.name || 'Geen klas'
    };
  });
};

export const filterStudentAccounts = (students = [], query = '') => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return students;

  return students.filter((student) => {
    const haystack = [
      student.displayName,
      student.email,
      student.klasName,
      student.uid
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
};
