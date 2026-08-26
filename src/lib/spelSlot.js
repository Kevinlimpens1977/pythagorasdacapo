/**
 * Het spel als afsluiting van een paragraaf: pas speelbaar wanneer alle andere
 * stappen af zijn. De klas-instelling spelAlsAfsluiting staat standaard AAN;
 * alleen een expliciete false zet het spel meteen open. De leerling mag de
 * spelstap altijd wel bekijken (vrije navigatie blijft), maar de speelknop
 * blijft op slot tot de lesstof af is.
 */
export const isSpelAfsluitingActief = (klasSettings = {}) =>
  klasSettings?.spelAlsAfsluiting !== false;

export const spelSlotStatus = ({ blocks = [], progressRecords = [], klasSettings = {} } = {}) => {
  if (!isSpelAfsluitingActief(klasSettings)) {
    return { vergrendeld: false, resterend: [] };
  }

  const klaarIds = new Set(
    (Array.isArray(progressRecords) ? progressRecords : [])
      .filter((r) => r?.completed === true)
      .map((r) => r.blockId || r.vraagId)
  );

  const resterend = (Array.isArray(blocks) ? blocks : [])
    .filter((b) => b && b.type !== 'game' && !klaarIds.has(b.id))
    .map((b) => b.title || 'stap');

  return { vergrendeld: resterend.length > 0, resterend };
};
