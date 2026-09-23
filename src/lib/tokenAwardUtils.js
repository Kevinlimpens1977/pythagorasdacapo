const getSourceVersion = (block = {}) => (
  String(
    block.publishedVersion ||
      block.version ||
      block.updatedAt ||
      block.id ||
      'v1'
  )
);

export const shouldRequestTokenAward = ({ block = null, completed = false } = {}) => {
  if (!block || completed !== true) return false;
  if (block.type === 'game') {
    return Boolean(block.content?.gameId);
  }

  // Fase 1 (23 sep 2026): elk afgerond blok levert XP op, ook onder de 60%.
  // De server rekent XP en tokens naar beheersing uit.
  return true;
};

const alsGetal = (waarde) => (Number.isFinite(Number(waarde)) && waarde !== null && waarde !== '' ? Number(waarde) : undefined);

export const buildTokenAwardPayload = ({
  block = {},
  paragraafId = '',
  completed = false,
  extra = {}
} = {}) => {
  if (!shouldRequestTokenAward({ block, completed, extra })) return null;

  if (block.type === 'game') {
    const gameId = String(block.content?.gameId || '').trim();
    const result = extra.lastAnswer || {};
    return {
      sourceKind: 'game',
      sourceId: gameId,
      sourceVersion: String(block.publishedVersion || block.version || block.id || result.attemptId || 'v1'),
      sourceTitle: block.title || '',
      paragraafId: block.paragraafId || paragraafId,
      blockId: block.id || '',
      gameId,
      result: {
        ...result,
        completed: result.completed ?? true,
        passed: result.passed ?? true
      }
    };
  }

  return {
    sourceKind: 'contentBlock',
    sourceId: block.id || '',
    sourceVersion: getSourceVersion(block),
    sourceTitle: block.title || '',
    paragraafId: block.paragraafId || paragraafId,
    blockId: block.id || '',
    result: Object.fromEntries(Object.entries({
      completed,
      isCorrect: extra.isCorrect === true,
      resultTier: extra.resultTier || '',
      score: alsGetal(extra.score),
      maxScore: alsGetal(extra.maxScore),
      itemsCorrect: alsGetal(extra.itemsCorrect),
      itemCount: alsGetal(extra.itemCount)
    }).filter(([, waarde]) => waarde !== undefined))
  };
};

// Een goed resultaat laat de avatar zijn emote doen (Shop 2.0 deel 2C).
export const isGoedResultaat = (award = {}) => Boolean(award && award.awarded === true
  && (Number(award.percentage) >= 90 || award.ster || award.niveauOmhoog));

// De korte melding na een beloning, bijvoorbeeld "+30 XP · +12 tokens · 90% goed".
export const beloningMelding = (award = {}) => {
  if (!award || award.awarded !== true) return '';
  const delen = [];
  if (Number(award.xp) > 0) delen.push(`+${award.xp} XP`);
  const extra = ['niveauTokens', 'huiswerkTokens', 'kistTokens', 'mijlpaalTokens']
    .reduce((som, veld) => som + (Number(award[veld]) || 0), 0);
  const blokTokens = Math.max(0, (Number(award.amount) || 0) - extra);
  if (blokTokens > 0) delen.push(`+${blokTokens} tokens`);
  if (award.reden) delen.push(award.reden);
  if (award.dubbeleXp && Number(award.xp) > 0) delen.push('dubbele XP');
  let tekst = delen.join(' · ');
  if (award.ster) tekst += ' · ster verdiend';
  if (award.plafondBereikt) tekst += ' · weekplafond bereikt';
  if (award.niveauOmhoog) tekst += ` · niveau ${award.niveau} gehaald (+${award.niveauTokens} tokens)`;
  if (Number(award.huiswerkTokens) > 0) tekst += ` · huiswerkbonus +${award.huiswerkTokens}`;
  if (Number(award.kistTokens) > 0) {
    tekst += ` · weekdoel gehaald: weekkist +${award.kistTokens}`;
    if (award.reeks?.aantal) tekst += ` · weekreeks ${award.reeks.aantal}`;
    if (Number(award.mijlpaalTokens) > 0) tekst += ` (+${award.mijlpaalTokens})`;
  } else if (award.weekdoel && award.weekdoel.gehaald !== true) {
    tekst += ` · weekdoel ${award.weekdoel.gedaan} van ${award.weekdoel.totaal}`;
  }
  if (Array.isArray(award.nieuweBadges) && award.nieuweBadges.length) {
    tekst += ` · badge: ${award.nieuweBadges.join(', ')}`;
  }
  return tekst.replace(/^ · /, '');
};
