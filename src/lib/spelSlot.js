/**
 * Het spel als afsluiting van een paragraaf: pas speelbaar wanneer de stappen
 * ervóór af zijn. Staat het spel niet achteraan (Binask 2.6: eerst het lab, dan
 * de quiz), dan tellen de stappen erna niet mee; geef dan `spelBlok` mee. De klas-instelling spelAlsAfsluiting staat standaard AAN;
 * alleen een expliciete false zet het spel meteen open. De leerling mag de
 * spelstap altijd wel bekijken (vrije navigatie blijft), maar de speelknop
 * blijft op slot tot de lesstof af is.
 */
export const isSpelAfsluitingActief = (klasSettings = {}) =>
  klasSettings?.spelAlsAfsluiting !== false;

export const spelSlotStatus = ({ blocks = [], progressRecords = [], klasSettings = {}, spelBlok = null } = {}) => {
  if (!isSpelAfsluitingActief(klasSettings)) {
    return { vergrendeld: false, resterend: [] };
  }

  const klaarIds = new Set(
    (Array.isArray(progressRecords) ? progressRecords : [])
      .filter((r) => r?.completed === true)
      .map((r) => r.blockId || r.vraagId)
  );

  const lijst = Array.isArray(blocks) ? blocks : [];
  const plek = spelBlok ? lijst.findIndex((b) => b?.id === spelBlok.id) : -1;
  const ervoor = plek >= 0 ? lijst.slice(0, plek) : lijst;

  const resterend = ervoor
    .filter((b) => b && b.type !== 'game' && !klaarIds.has(b.id))
    .map((b) => b.title || 'stap');

  return { vergrendeld: resterend.length > 0, resterend };
};
