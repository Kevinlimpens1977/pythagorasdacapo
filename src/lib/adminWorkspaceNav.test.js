import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ADMIN_WORKSPACES,
  getAdminWorkspaceForPath,
  isAdminWorkspaceActive
} from './adminWorkspaceNav.js';

test('getAdminWorkspaceForPath groups admin content routes under lesstof', () => {
  assert.equal(getAdminWorkspaceForPath('/admin/lesstof'), 'lesstof');
  assert.equal(getAdminWorkspaceForPath('/admin/cms'), 'lesstof');
  assert.equal(getAdminWorkspaceForPath('/admin/digibord'), 'lesstof');
  assert.equal(getAdminWorkspaceForPath('/admin/slidedecks'), 'lesstof');
});

test('getAdminWorkspaceForPath maps dashboard and student routes to the right workspace', () => {
  assert.equal(getAdminWorkspaceForPath('/dashboard'), 'voortgang');
  assert.equal(getAdminWorkspaceForPath('/admin/leerlingen'), 'leerlingen');
  assert.equal(getAdminWorkspaceForPath('/admin/spellen'), 'spellen');
  assert.equal(getAdminWorkspaceForPath('/admin'), 'beheer');
  assert.equal(getAdminWorkspaceForPath('/admin/klassen'), 'beheer');
  assert.equal(getAdminWorkspaceForPath('/admin/taken-toewijzen'), 'beheer');
});

test('isAdminWorkspaceActive checks the current route group', () => {
  assert.equal(isAdminWorkspaceActive(ADMIN_WORKSPACES[0], '/admin/cms'), true);
  assert.equal(isAdminWorkspaceActive(ADMIN_WORKSPACES[0], '/dashboard'), false);
});
