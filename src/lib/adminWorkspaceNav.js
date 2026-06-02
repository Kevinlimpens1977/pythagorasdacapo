export const ADMIN_WORKSPACES = [
  {
    id: 'lesstof',
    label: 'Lesstof',
    path: '/admin/lesstof',
    routePrefixes: ['/admin/lesstof', '/admin/cms', '/admin/digibord', '/admin/slidedecks', '/admin/taken-toewijzen']
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
    routePrefixes: ['/admin/leerlingen', '/admin/klassen']
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
    id: 'instellingen',
    label: 'Instellingen',
    path: '/admin/instellingen',
    routePrefixes: ['/admin/instellingen', '/admin/ai-instellingen']
  }
];

export const getAdminWorkspaceForPath = (pathname = '') => {
  if (pathname === '/admin') return 'instellingen';

  const workspace = ADMIN_WORKSPACES.find((item) =>
    item.routePrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
  );

  return workspace?.id || 'instellingen';
};

export const isAdminWorkspaceActive = (workspace, pathname = '') => {
  return getAdminWorkspaceForPath(pathname) === workspace.id;
};
