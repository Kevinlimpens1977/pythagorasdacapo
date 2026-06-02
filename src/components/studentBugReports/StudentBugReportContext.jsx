import { createContext, useContext } from 'react';

export const StudentBugReportContext = createContext({
  context: {},
  setContext: () => {}
});

export const useStudentBugReportContext = () => useContext(StudentBugReportContext);
