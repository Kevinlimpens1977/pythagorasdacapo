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
  assert.equal(getAdminWorkspaceForPath('/admin/taken-toewijzen'), 'lesstof');
});

test('getAdminWorkspaceForPath maps dashboard and student routes to the right workspace', () => {
  assert.equal(getAdminWorkspaceForPath('/dashboard'), 'voortgang');
  assert.equal(getAdminWorkspaceForPath('/admin/leerlingen'), 'leerlingen');
  assert.equal(getAdminWorkspaceForPath('/admin/klassen'), 'leerlingen');
  assert.equal(getAdminWorkspaceForPath('/admin/meldingen'), 'meldingen');
  assert.equal(getAdminWorkspaceForPath('/admin/spellen'), 'spellen');
  assert.equal(getAdminWorkspaceForPath('/admin'), 'instellingen');
  assert.equal(getAdminWorkspaceForPath('/admin/instellingen'), 'instellingen');
  assert.equal(getAdminWorkspaceForPath('/admin/ai-instellingen'), 'instellingen');
});

test('meldingen workspace is active only for report routes', () => {
  const meldingen = ADMIN_WORKSPACES.find((workspace) => workspace.id === 'meldingen');

  assert.ok(meldingen);
  assert.equal(isAdminWorkspaceActive(meldingen, '/admin/meldingen'), true);
  assert.equal(isAdminWorkspaceActive(meldingen, '/admin/leerlingen'), false);
});

test('getAdminWorkspaceForPath groups presenter under its own workspace', () => {
  assert.equal(getAdminWorkspaceForPath('/admin/presenter'), 'presenter');
  assert.equal(getAdminWorkspaceForPath('/admin/presenter/session'), 'presenter');
});

test('isAdminWorkspaceActive checks the current route group', () => {
  assert.equal(isAdminWorkspaceActive(ADMIN_WORKSPACES[0], '/admin/cms'), true);
  assert.equal(isAdminWorkspaceActive(ADMIN_WORKSPACES[0], '/dashboard'), false);
});

test('presenter workspace is active only for presenter routes', () => {
  const presenter = ADMIN_WORKSPACES.find((workspace) => workspace.id === 'presenter');

  assert.ok(presenter);
  assert.equal(isAdminWorkspaceActive(presenter, '/admin/presenter'), true);
  assert.equal(isAdminWorkspaceActive(presenter, '/admin/lesstof'), false);
});

test('instellingen workspace is active only for settings routes', () => {
  const instellingen = ADMIN_WORKSPACES.find((workspace) => workspace.id === 'instellingen');

  assert.ok(instellingen);
  assert.equal(isAdminWorkspaceActive(instellingen, '/admin/instellingen'), true);
  assert.equal(isAdminWorkspaceActive(instellingen, '/admin/ai-instellingen'), true);
  assert.equal(isAdminWorkspaceActive(instellingen, '/admin/klassen'), false);
});
