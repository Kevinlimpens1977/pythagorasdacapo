export const ADMIN_WORKSPACES = [
  {
    id: 'lesstof',
    label: 'Lesstof',
    path: '/admin/lesstof',
    routePrefixes: ['/admin/lesstof', '/admin/cms', '/admin/digibord', '/admin/slidedecks']
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
    id: 'meldingen',
    label: 'Meldingen',
    path: '/admin/meldingen',
    routePrefixes: ['/admin/meldingen']
  },
  {
    id: 'spellen',
    label: 'Spellen',
    path: '/admin/spellen',
    routePrefixes: ['/admin/spellen']
  },
  {
    id: 'presenter',
    label: 'Presenter',
    path: '/admin/presenter',
    routePrefixes: ['/admin/presenter']
  },
  {
    id: 'beheer',
    label: 'Beheer',
    path: '/admin',
    routePrefixes: ['/admin', '/admin/klassen', '/admin/taken-toewijzen', '/admin/ai-instellingen']
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
