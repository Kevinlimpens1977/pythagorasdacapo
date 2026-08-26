// Splitst leerlingaccounts in actief en archief. Het archief is de wachtkamer
// voor definitief verwijderen: alleen wie hier staat kan echt weg.
export function splitArchivedStudents(students = []) {
  const actief = [];
  const archief = [];
  for (const student of students) {
    (student?.isArchived === true ? archief : actief).push(student);
  }
  return { actief, archief };
}
