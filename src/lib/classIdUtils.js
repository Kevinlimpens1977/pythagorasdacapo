export const getEffectiveKlasId = ({ authKlasId = '', userData = null, klasData = null } = {}) =>
  authKlasId || userData?.klasId || klasData?.klasId || klasData?.id || '';
