export const GAME_COMPONENT_KEYS = {
  WACHTWOORD_DETECTIVE: 'wachtwoordDetective',
  SOCIAL_MEDIA_ZOEKTOCHT: 'socialMediaZoektocht',
  TURBO_TYPEN: 'turboTypen',
  PACO_PAC_MAN: 'pacoPacMan',
  DATA_KOERIER: 'dataKoerier',
  DVLINGO: 'dvlingo',
  VOLUME_MAATCILINDER: 'volumeMaatcilinder',
  VOLUME_BALK: 'volumeBalk',
  VOLUME_ONDERDOMPELEN: 'volumeOnderdompelen'
};

export const PLAYABLE_GAME_COMPONENT_KEYS = Object.values(GAME_COMPONENT_KEYS);

export const isPlayableGameComponentKey = (componentKey) => {
  return PLAYABLE_GAME_COMPONENT_KEYS.includes(componentKey);
};
