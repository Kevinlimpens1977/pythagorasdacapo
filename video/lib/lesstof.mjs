// Lesstof uit Firestore -> een compacte samenvatting om een draaiboek op te
// baseren. Opdrachten, checks en spellen horen niet in een uitlegvideo.
const RELEVANT = new Set(['theory', 'example', 'summary']);
const OPDRACHT = /^(Schriftopdracht|10-minutencheck|Eindcheck|Herhalingsopdrachten|Plusopdrachten)/i;

const ENTITEITEN = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' };

export function htmlNaarTekst(html = '') {
  return String(html)
    .replace(/<li[^>]*>/gi, '\n- ')
    .replace(/<\/(p|h[1-6]|li|ul|ol)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (m) => ENTITEITEN[m])
    .split('\n')
    .map((regel) => regel.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');
}

const titelVan = (item) => item.title || item.titel || '';

export function vatLesstofSamen({ hoofdstuk, paragrafen, blokken, nu = new Date().toISOString() }) {
  const opVolgorde = (a, b) => (a.order || 0) - (b.order || 0);
  return {
    hoofdstukId: hoofdstuk.id,
    titel: titelVan(hoofdstuk),
    vakId: hoofdstuk.vakId || '',
    gelezenOp: nu,
    paragrafen: [...paragrafen].sort(opVolgorde).map((p) => {
      const eigen = blokken.filter((b) => b.paragraafId === p.id).sort(opVolgorde);
      return {
        id: p.id,
        code: p.code || '',
        titel: titelVan(p),
        order: p.order || 0,
        heeftSamenvatting: eigen.some((b) => b.type === 'summary'),
        blokken: eigen
          .filter((b) => RELEVANT.has(b.type) && !OPDRACHT.test(titelVan(b)))
          .map((b) => ({
            id: b.id,
            type: b.type,
            titel: titelVan(b),
            tekst: htmlNaarTekst(b.content?.html || ''),
            kernbegrippen: (b.content?.kernbegrippen || b.kernbegrippen || []).map((k) => `${k.begrip}: ${k.uitleg}`)
          }))
      };
    })
  };
}

export function stelDoelParagraafVoor(lesstof) {
  const kandidaten = lesstof.paragrafen.filter((p) => p.heeftSamenvatting);
  const herhaling = kandidaten.find((p) => /herhal/i.test(p.titel));
  if (herhaling) return herhaling.id;
  const gewoon = kandidaten.filter((p) => !/plus|uitdaging|verdieping/i.test(p.titel));
  return gewoon.length ? gewoon[gewoon.length - 1].id : '';
}
