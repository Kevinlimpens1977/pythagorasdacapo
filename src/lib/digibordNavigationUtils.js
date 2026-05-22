const pluralize = (count, singular, plural) => `${count} ${count === 1 ? singular : plural} beschikbaar`;

export const getDigibordItemLabel = (type, item = {}) => {
  if (type === 'vak') return item.name || item.naam || 'Naamloos vak';
  if (type === 'leerjaar') return item.label || item.name || (item.year ? `Jaar ${item.year}` : 'Leerjaar');
  if (type === 'niveau') {
    if (item.label && item.name && item.label !== item.name) return `${item.label} - ${item.name}`;
    return item.label || item.name || 'Niveau';
  }
  if (type === 'hoofdstuk') return `${item.number ? `${item.number}. ` : ''}${item.title || item.name || 'Hoofdstuk'}`;
  if (type === 'paragraaf') return item.title || item.name || 'Paragraaf';
  return item.name || item.title || item.label || 'Onderdeel';
};

export const getDigibordCardMeta = (type, { childCount = 0 } = {}) => {
  if (type === 'vak') {
    return {
      eyebrow: 'Vak',
      subtitle: pluralize(childCount, 'leerjaar', 'leerjaren'),
      action: 'Kies leerjaar'
    };
  }
  if (type === 'leerjaar') {
    return {
      eyebrow: 'Leerjaar',
      subtitle: pluralize(childCount, 'niveau', 'niveaus'),
      action: 'Kies niveau'
    };
  }
  if (type === 'niveau') {
    return {
      eyebrow: 'Niveau',
      subtitle: pluralize(childCount, 'hoofdstuk', 'hoofdstukken'),
      action: 'Kies hoofdstuk'
    };
  }
  if (type === 'hoofdstuk') {
    return {
      eyebrow: 'Hoofdstuk',
      subtitle: pluralize(childCount, 'paragraaf', 'paragrafen'),
      action: 'Kies paragraaf'
    };
  }
  return {
    eyebrow: 'Paragraaf',
    subtitle: 'Fullscreen presenteren',
    action: 'Presenteer'
  };
};

export const getDigibordContextTitle = ({
  selectedVak,
  selectedLeerjaar,
  selectedNiveau,
  selectedHoofdstuk
}) => {
  if (selectedHoofdstuk) return `Kies een paragraaf binnen ${getDigibordItemLabel('hoofdstuk', selectedHoofdstuk)}`;
  if (selectedNiveau) return `Kies een hoofdstuk binnen ${getDigibordItemLabel('niveau', selectedNiveau)}`;
  if (selectedLeerjaar) return `Kies een niveau binnen ${getDigibordItemLabel('leerjaar', selectedLeerjaar)}`;
  if (selectedVak) return `Kies een leerjaar binnen ${getDigibordItemLabel('vak', selectedVak)}`;
  return 'Kies een vak';
};
