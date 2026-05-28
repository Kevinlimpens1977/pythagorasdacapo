import * as method1BlueBand from './method1BlueBand';
import * as method2RowBand from './method2RowBand';
import * as method3BlueComponents from './method3BlueComponents';
import * as method4ContrastBand from './method4ContrastBand';
import * as method5MultiPass from './method5MultiPass';

export const STUDENT_PHOTO_OCR_STRATEGIES = [
  method1BlueBand,
  method2RowBand,
  method3BlueComponents,
  method4ContrastBand,
  method5MultiPass
];

export const STUDENT_PHOTO_OCR_METHODS = STUDENT_PHOTO_OCR_STRATEGIES.map((strategy) => ({
  id: strategy.METHOD_ID,
  label: strategy.METHOD_LABEL
}));

export const DEFAULT_STUDENT_PHOTO_OCR_METHOD_ID = method3BlueComponents.METHOD_ID;

export const getStudentPhotoOcrStrategy = (methodId) =>
  STUDENT_PHOTO_OCR_STRATEGIES.find((strategy) => strategy.METHOD_ID === methodId) || method3BlueComponents;
