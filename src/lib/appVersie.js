// Herkent of er een nieuwe versie van HELIX live staat. De app is één pagina
// die zichzelf nooit herlaadt: een tabblad dat vóór een deploy openstond, blijft
// anders de oude code draaien (zo zag de spellenpagina de nieuwe spellen niet).

const ENTRY_PATROON = /\/assets\/index-[A-Za-z0-9_-]+\.js/;

// Het gehashte hoofdscript uit een stuk HTML, of null (bijvoorbeeld in dev).
export function entryUitHtml(html = '') {
  const match = String(html).match(ENTRY_PATROON);
  return match ? match[0] : null;
}

export function isNieuweVersie(huidig, live) {
  return Boolean(huidig && live && huidig !== live);
}
