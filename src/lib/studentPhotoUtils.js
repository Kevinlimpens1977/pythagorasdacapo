const trimValue = (value) => String(value || '').trim();

export const getStudentPhotoDirectUrl = (student = {}) =>
  trimValue(
    student.photoURL ||
      student.photo?.thumbUrl ||
      student.photo?.thumbURL ||
      student.photo?.thumbDownloadURL ||
      student.photo?.downloadURL ||
      student.photo?.url
  );

export const getStudentPhotoStoragePath = (student = {}) =>
  trimValue(
    student.photo?.thumbStoragePath ||
      student.photo?.storagePath ||
      student.photoPath
  );

export const hasStudentPhoto = (student = {}) =>
  Boolean(getStudentPhotoDirectUrl(student) || getStudentPhotoStoragePath(student));

export const getStudentInitial = (student = {}) => {
  const identity = trimValue(student.displayName || student.name || student.email);
  return identity ? identity.charAt(0).toUpperCase() : '?';
};
