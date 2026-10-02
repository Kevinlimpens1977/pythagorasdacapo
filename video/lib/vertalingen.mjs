// Controle van vertalingen.json naast het draaiboek: de ondertitels in de
// moedertaal van de leerling. `bron` is een momentopname van de Nederlandse
// tekst per regel; wijkt het draaiboek daarvan af, dan is de vertaling van die
// regel verouderd. Puur: geen bestanden, alleen meldingen (leeg = goed).
const EMOJI = /\p{Extended_Pictographic}/u;
const gevuld = (waarde) => typeof waarde === 'string' && waarde.trim() !== '';

// Bidi-isolaten (bij Arabisch): LRI, RLI en FSI openen, PDI sluit. Een opener
// zonder PDI zou de rest van de ondertitel in één onbreekbaar stuk veranderen en
// de leesrichting van wat erna komt verstoren; een los PDI doet niets. Beide
// zijn bijna zeker een typefout in de vertaling.
const ISOLAAT_OPEN = new Set(['⁦', '⁧', '⁨']);
const ISOLAAT_DICHT = '⁩';
const isolaatKlopt = (tekst) => {
  let diepte = 0;
  for (const teken of tekst) {
    if (ISOLAAT_OPEN.has(teken)) diepte += 1;
    else if (teken === ISOLAAT_DICHT) {
      if (diepte === 0) return false;
      diepte -= 1;
    }
  }
  return diepte === 0;
};

export function controleerVertalingen(draaiboek, vertalingen, taalCodes = []) {
  const fouten = [];
  const regels = (draaiboek?.scenes || []).flatMap((scene) => scene.regels || []);
  const bron = vertalingen?.bron || {};
  const talen = vertalingen?.talen || {};

  for (const regel of regels) {
    if (!gevuld(bron[regel.id])) {
      fouten.push(`Vertaling verouderd voor regel ${regel.id}: er staat geen bron-tekst in vertalingen.json.`);
    } else if (bron[regel.id] !== regel.tekst) {
      fouten.push(`Vertaling verouderd voor regel ${regel.id}: de tekst in het draaiboek is veranderd.`);
    }
  }

  for (const code of taalCodes) {
    const taal = talen[code];
    if (!taal || typeof taal !== 'object') {
      fouten.push(`Taal ${code} ontbreekt in vertalingen.json.`);
      continue;
    }
    for (const regel of regels) {
      const tekst = taal[regel.id];
      if (!gevuld(tekst)) fouten.push(`Taal ${code}: regel ${regel.id} ontbreekt of is leeg.`);
      else if (EMOJI.test(tekst)) fouten.push(`Taal ${code}: regel ${regel.id} bevat een emoji.`);
      else if (!isolaatKlopt(tekst)) fouten.push(`Taal ${code}: regel ${regel.id} heeft een bidi-isolaat zonder sluitteken (PDI, U+2069) of een los sluitteken.`);
    }
  }

  for (const code of Object.keys(talen)) {
    if (!taalCodes.includes(code)) fouten.push(`Taal ${code} staat niet in de lijst met talen (LES_TALEN).`);
  }

  return fouten;
}
