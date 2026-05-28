import { getFunctions, httpsCallable } from 'firebase/functions';
import app from './firebase';

export const PRESERVED_STUDENT_RESET_EMAILS = [
  'vragen@scheikundeles.nl',
  'kevlimpens@gmail.com'
];

const functions = getFunctions(app, 'europe-west1');

export const deleteAllStudentData = async () => {
  const deleteAllStudents = httpsCallable(functions, 'deleteAllStudentData');
  const result = await deleteAllStudents();

  return {
    deletedStudents: result.data?.deletedStudents || 0,
    deletedProgress: result.data?.deletedProgress || 0,
    deletedPendingStudents: result.data?.deletedPendingStudents || 0,
    cleanedClasses: result.data?.cleanedClasses || 0,
    preservedEmails: result.data?.preservedEmails || PRESERVED_STUDENT_RESET_EMAILS
  };
};

export default {
  deleteAllStudentData
};
