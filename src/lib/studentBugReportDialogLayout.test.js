import test from 'node:test';
import assert from 'node:assert/strict';

import {
  STUDENT_BUG_REPORT_DIALOG_BODY_CLASS,
  STUDENT_BUG_REPORT_DIALOG_FORM_CLASS,
  STUDENT_BUG_REPORT_DIALOG_OVERLAY_CLASS,
  STUDENT_BUG_REPORT_DIALOG_PORTAL_TARGET
} from './studentBugReportDialogLayout.js';

test('student bug report dialog stays centered inside the viewport', () => {
  assert.match(STUDENT_BUG_REPORT_DIALOG_OVERLAY_CLASS, /grid/);
  assert.match(STUDENT_BUG_REPORT_DIALOG_OVERLAY_CLASS, /place-items-center/);
  assert.match(STUDENT_BUG_REPORT_OVERLAY_TEXT, /overflow-y-auto/);
});

test('student bug report form constrains height and scrolls only its body', () => {
  assert.match(STUDENT_BUG_REPORT_DIALOG_FORM_CLASS, /max-h-\[calc\(100dvh-2rem\)\]/);
  assert.match(STUDENT_BUG_REPORT_DIALOG_FORM_CLASS, /flex-col/);
  assert.match(STUDENT_BUG_REPORT_DIALOG_BODY_CLASS, /overflow-y-auto/);
});

test('student bug report dialog renders outside the header stacking context', () => {
  assert.equal(STUDENT_BUG_REPORT_DIALOG_PORTAL_TARGET, 'body');
});

const STUDENT_BUG_REPORT_OVERLAY_TEXT = STUDENT_BUG_REPORT_DIALOG_OVERLAY_CLASS;
