export const shouldCollapseAiTutorOnMouseLeave = ({ draftInput = '' } = {}) =>
  !String(draftInput || '').trim();

// Hover-openen is alleen gewenst op apparaten met een echte muisaanwijzer.
// Op touch-apparaten vuren emulated mouse-events het paneel anders open én
// direct weer dicht via de toggle-klik.
export const shouldExpandAiTutorOnHover = ({ supportsHover = true } = {}) => Boolean(supportsHover);
