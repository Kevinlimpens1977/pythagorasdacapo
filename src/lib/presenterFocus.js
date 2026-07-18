// Focus-gereedschap-state voor Presenter: spotlight, gordijn en laser.

export const SPOTLIGHT_RADII = [
  { id: 'small', label: 'Klein', radius: 140 },
  { id: 'medium', label: 'Middel', radius: 240 },
  { id: 'large', label: 'Groot', radius: 380 }
];

export const getSpotlightRadius = (radiusId) =>
  (SPOTLIGHT_RADII.find((entry) => entry.id === radiusId) || SPOTLIGHT_RADII[1]).radius;

export const createSpotlight = (radiusId = 'medium') => ({
  kind: 'spotlight',
  x: 960,
  y: 640,
  radiusId
});

export const createCurtain = (direction = 'top') => ({
  kind: 'curtain',
  direction,
  progress: 1
});

export const createLaser = () => ({ kind: 'laser' });
