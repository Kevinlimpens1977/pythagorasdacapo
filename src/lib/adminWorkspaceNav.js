export const ADMIN_WORKSPACES = [
  {
    id: 'lesstof',
    label: 'Lesstof',
    path: '/admin/lesstof',
    routePrefixes: ['/admin/lesstof', '/admin/cms', '/admin/digibord']
  },
  {
    id: 'voortgang',
    label: 'Voortgang',
    path: '/dashboard',
    routePrefixes: ['/dashboard']
  },
  {
    id: 'leerlingen',
    label: 'Leerlingen',
    path: '/admin/leerlingen',
    routePrefixes: ['/admin/leerlingen']
  },
  {
    id: 'beheer',
    label: 'Beheer',
    path: '/admin',
    routePrefixes: ['/admin', '/admin/klassen', '/admin/taken-toewijzen']
  }
];

export const getAdminWorkspaceForPath = (pathname = '') => {
  if (pathname === '/admin') return 'beheer';

  const workspace = ADMIN_WORKSPACES.find((item) =>
    item.routePrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
  );

  return workspace?.id || 'beheer';
};

export const isAdminWorkspaceActive = (workspace, pathname = '') => {
  return getAdminWorkspaceForPath(pathname) === workspace.id;
};
