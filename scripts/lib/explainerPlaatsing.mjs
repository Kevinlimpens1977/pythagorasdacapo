/**
 * Puur plan voor het plaatsen van een explainervideo: het media-blok direct
 * vóór de Samenvatting van een paragraaf, met ondertitels en poster. Geen
 * Firebase hier; scripts/plaats-explainer-video.mjs doet uploaden en schrijven.
 */
import { buildPublicContentBlockSnapshot } from '../../src/lib/publicContentBlockView.js';
import { validateContentBlockReadiness } from '../../src/lib/contentReadiness.js';
import { normalizeContentBlockSettings } from '../../src/lib/contentBlockUtils.js';
import { LES_TALEN, taalLabel } from '../../src/lib/lesTaal.js';
import { downloadUrl } from './slidedeckPlaatsing.mjs';

export const explainerBlokId = (hoofdstukId) => `block-${hoofdstukId.replace(/^hoofdstuk-/, '')}-explainer-video`;
export const explainerPad = (hoofdstukId, bestand) => `explainers/${hoofdstukId}/${bestand}`;

// Ondertitels: Nederlands altijd eerst, daarna de talen van de taalknop in de
// volgorde van LES_TALEN. Een andere taal hoort niet in een explainer.
const ONDERTITEL_TALEN = ['nl', ...LES_TALEN.map((taal) => taal.code)];
const ondertitelLabel = (taal) => (taal === 'nl' ? 'Nederlands' : taalLabel(taal));
const opTaalVolgorde = (a, b) => ONDERTITEL_TALEN.indexOf(a.taal) - ONDERTITEL_TALEN.indexOf(b.taal);

// Welke ondertitelbestanden uit de bronmap meegaan. ondertitels.nl.vtt is
// verplicht; een bestand in een taal buiten de taalknop slaat de plaatsing over.
// Het label is de naam van de taal in die taal zelf (taalLabel uit lesTaal.js).
export function ondertitelSporen(bestandsnamen = []) {
  const sporen = [];
  const overgeslagen = [];
  for (const naam of bestandsnamen) {
    const match = /^ondertitels\.([^.]+)\.vtt$/.exec(naam);
    if (!match) continue;
    const taal = match[1];
    if (ONDERTITEL_TALEN.includes(taal)) sporen.push({ taal, label: ondertitelLabel(taal), naam });
    else overgeslagen.push(naam);
  }
  if (!sporen.some((spoor) => spoor.taal === 'nl')) {
    throw new Error('ondertitels.nl.vtt ontbreekt: zonder Nederlandse ondertitels wordt er niets geplaatst.');
  }
  return { sporen: sporen.sort(opTaalVolgorde), overgeslagen };
}

// Welke vertaalde ondertitelbestanden zijn ouder dan ondertitels.nl.vtt? Dan
// zijn ze gemaakt voor een eerdere tijdlijn (andere timing of draaiboek) en
// lopen ze mogelijk niet meer gelijk met de stem. Invoer: [{ taal, mtimeMs }].
// Strikt ouder telt; gelijk is goed. Zonder nl is er niets om mee te vergelijken.
export function verouderdeOndertitels(bestanden = []) {
  const nl = bestanden.find((bestand) => bestand.taal === 'nl');
  if (!nl) return [];
  return bestanden
    .filter((bestand) => bestand.taal !== 'nl' && bestand.mtimeMs < nl.mtimeMs)
    .map((bestand) => bestand.taal);
}

// Bloktitel uit de draaiboektitel. Alleen de eerste letter gaat klein; een eerste
// woord met nog een hoofdletter erin (afkorting of naam: "DNS", "Wi-Fi") blijft
// staan. De Nederlandse IJ aan het begin wordt "ij" ("IJzer" wordt "ijzer").
export function explainerTitel(onderwerp) {
  const tekst = String(onderwerp).trim();
  if (/^IJ\p{Ll}/u.test(tekst)) return `Uitlegvideo: ij${tekst.slice(2)}`;
  const eersteWoord = tekst.split(/\s/)[0];
  const klein = /\p{Lu}/u.test(eersteWoord.slice(1)) ? tekst : `${tekst.charAt(0).toLocaleLowerCase('nl-NL')}${tekst.slice(1)}`;
  return `Uitlegvideo: ${klein}`;
}

const ontsnap = (tekst) =>String(tekst).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

// ondertitels: [{ taal, label, token }], één per .vtt. tokens: { video, poster }.
export function bouwExplainerPlan({ hoofdstukId, paragraaf, blokken, titel, kijkvraag, tokens, ondertitels = [], maker }) {
  if (paragraaf.hoofdstukId !== hoofdstukId) {
    throw new Error(`Paragraaf ${paragraaf.id} hoort niet bij ${hoofdstukId}.`);
  }
  const talen = ondertitels.map((spoor) => spoor.taal);
  const onbekend = talen.find((taal) => !ONDERTITEL_TALEN.includes(taal));
  if (onbekend) throw new Error(`Ondertitels in een onbekende taal ${onbekend}: alleen nl en de talen van LES_TALEN.`);
  const dubbel = talen.find((taal, index) => talen.indexOf(taal) !== index);
  if (dubbel) throw new Error(`Ondertitels in ${dubbel} staan er dubbel in.`);
  if (!talen.includes('nl')) throw new Error('Geen Nederlandse ondertitels: nl is verplicht.');
  const sporen = [...ondertitels].sort(opTaalVolgorde);
  const gesorteerd = [...blokken].sort((a, b) => (a.order || 0) - (b.order || 0));
  const samenvatting = gesorteerd.find((b) => b.type === 'summary');
  if (!samenvatting) throw new Error(`Paragraaf ${paragraaf.id} heeft geen Samenvatting-blok.`);

  const id = explainerBlokId(hoofdstukId);
  const bestaand = gesorteerd.find((b) => b.id === id);
  const paden = {
    video: explainerPad(hoofdstukId, 'explainer.mp4'),
    poster: explainerPad(hoofdstukId, 'poster.png'),
    ondertitels: Object.fromEntries(sporen.map((spoor) => [spoor.taal, explainerPad(hoofdstukId, `ondertitels.${spoor.taal}.vtt`)]))
  };

  const order = bestaand ? bestaand.order : samenvatting.order;
  const verschuivingen = bestaand
    ? []
    : gesorteerd
      .filter((b) => (b.order || 0) >= samenvatting.order)
      .map((b) => ({ id: b.id, van: b.order || 0, naar: (b.order || 0) + 1 }));

  const blok = {
    id,
    vakId: samenvatting.vakId,
    leerjaarId: samenvatting.leerjaarId,
    niveauId: samenvatting.niveauId,
    hoofdstukId,
    paragraafId: paragraaf.id,
    type: 'media',
    order,
    title: titel,
    status: 'published',
    isArchived: false,
    linkedVraagId: null,
    settings: normalizeContentBlockSettings({}, 'media'),
    content: {
      html: `<p><strong>Kijkvraag:</strong> ${ontsnap(kijkvraag)}</p>`,
      mediaKind: 'video',
      mediaUrl: downloadUrl(paden.video, tokens.video),
      storagePath: paden.video,
      fileName: 'explainer.mp4',
      contentType: 'video/mp4',
      thumbnailUrl: downloadUrl(paden.poster, tokens.poster),
      caption: '',
      altText: titel,
      crops: [],
      ondertitels: sporen.map((spoor) => ({
        taal: spoor.taal,
        label: spoor.label || ondertitelLabel(spoor.taal),
        url: downloadUrl(paden.ondertitels[spoor.taal], spoor.token),
        storagePath: paden.ondertitels[spoor.taal]
      }))
    },
    createdBy: maker
  };

  const fouten = validateContentBlockReadiness(blok).errors.map((issue) => `${blok.id}: ${issue.message}`);
  // nieuw: het blok bestaat nog niet. Dan telt het als extra stap in de voortgang van de paragraaf.
  return { blok, snapshot: buildPublicContentBlockSnapshot(blok), verschuivingen, paden, fouten, nieuw: !bestaand };
}
