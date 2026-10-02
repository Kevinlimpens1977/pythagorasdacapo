// Controle van een draaiboek vóór er geld aan stemmen of beelden opgaat.
const FASES = ['KIJK', 'CHECK', 'KLAAR'];
const INDELINGEN = ['FOCUS', 'SPLIT', 'STATUS'];
const SPREKERS = ['docent', 'sami'];
const UITDRUKKINGEN = ['vragend', 'verbaasd', 'blij', 'nadenkend'];
const EMOJI = /\p{Extended_Pictographic}/u;
// Voorwerpen die de getekende maatcilinder kan laten vallen. Zonder `voorwerp` stijgt alleen het water.
const VOORWERPEN = ['steen'];
const DRIEHOEK_SYMBOLEN = ['boven', 'linksOnder', 'rechtsOnder'];
const gevuld = (waarde) => typeof waarde === 'string' && waarde.trim() !== '';

// De velden die een getekend onderdeel nodig heeft om de juiste vakinhoud te tonen.
// Een driehoek zonder eigen symbolen en formules zou anders stil iets verkeerds laten zien.
function controleerGetekend(g, s) {
  const fouten = [];
  if (g.type === 'driehoek') {
    for (const veld of DRIEHOEK_SYMBOLEN) {
      if (!gevuld(g[veld])) fouten.push(`${s}: driehoek mist ${veld}.`);
    }
    if (!Array.isArray(g.formules) || g.formules.length !== 3 || !g.formules.every(gevuld)) {
      fouten.push(`${s}: driehoek heeft precies drie formules nodig.`);
    }
  }
  if (g.type === 'maatcilinder' && g.voorwerp !== undefined && !VOORWERPEN.includes(g.voorwerp)) {
    fouten.push(`${s}: voorwerp "${g.voorwerp}" bestaat niet in de maatcilinder.`);
  }
  return fouten;
}

export function valideerDraaiboek(d) {
  const fouten = [];
  for (const veld of ['hoofdstukId', 'doelParagraafId', 'titel', 'kijkvraag', 'meta']) {
    if (!String(d?.[veld] || '').trim()) fouten.push(`Veld ${veld} ontbreekt.`);
  }
  if (!Array.isArray(d?.scenes) || d.scenes.length === 0) {
    fouten.push('Er zijn geen scènes.');
    return fouten;
  }
  const regelIds = new Set();
  const sceneIds = new Set();
  for (const scene of d.scenes) {
    const s = `Scène ${scene.id}`;
    if (sceneIds.has(scene.id)) fouten.push(`${s}: scène-id komt dubbel voor.`);
    sceneIds.add(scene.id);
    const kop = String(scene.kop || '').trim();
    // Een lege kop telt via split nog als één woord, dus eerst op leeg controleren.
    if (!kop) fouten.push(`${s}: kop ontbreekt.`);
    else if (kop.split(/\s+/).length > 6) fouten.push(`${s}: kop heeft meer dan zes woorden.`);
    if (!FASES.includes(scene.fase)) fouten.push(`${s}: fase "${scene.fase}" bestaat niet.`);
    if (!INDELINGEN.includes(scene.indeling)) fouten.push(`${s}: indeling "${scene.indeling}" bestaat niet.`);
    if (scene.indeling !== 'STATUS' && !scene.shot?.naam) fouten.push(`${s}: FOCUS en SPLIT hebben een shot nodig.`);
    if (!Array.isArray(scene.regels) || scene.regels.length === 0) fouten.push(`${s}: geen regels.`);
    const eigenIds = new Set();
    for (const regel of scene.regels || []) {
      if (regelIds.has(regel.id)) fouten.push(`${s}: regel-id ${regel.id} komt dubbel voor.`);
      regelIds.add(regel.id);
      eigenIds.add(regel.id);
      if (!SPREKERS.includes(regel.spreker)) fouten.push(`${s}: spreker "${regel.spreker}" bestaat niet.`);
      if (!String(regel.tekst || '').trim()) fouten.push(`${s}: regel ${regel.id} heeft geen tekst.`);
      if (!String(regel.uitspraak || '').trim()) fouten.push(`${s}: regel ${regel.id} heeft geen uitspraak.`);
      if (EMOJI.test(`${regel.tekst}${regel.uitspraak}`)) fouten.push(`${s}: regel ${regel.id} bevat een emoji.`);
      if (/binask/i.test(regel.uitspraak || '')) fouten.push(`${s}: regel ${regel.id} spreekt BiNaSk uit; gebruik "in de les".`);
      if (regel.samiUitdrukking && !UITDRUKKINGEN.includes(regel.samiUitdrukking)) fouten.push(`${s}: uitdrukking "${regel.samiUitdrukking}" bestaat niet.`);
    }
    for (const g of scene.getekend || []) fouten.push(...controleerGetekend(g, s));
    const verwijzingen = [
      ...(scene.kernwoorden || []).map((k) => k.bij),
      ...(scene.getekend || []).flatMap((g) => [g.bij, g.tot, g.stijgBij, g.aftelBij, g.antwoordBij, ...(g.regels || []).map((r) => r.bij)]),
      ...(scene.geluiden || []).map((g) => g.bij),
      scene.shot?.startBij
    ].filter(Boolean);
    for (const bij of verwijzingen) {
      if (!eigenIds.has(bij)) fouten.push(`${s}: verwijst naar onbekende regel ${bij}.`);
    }
  }
  return fouten;
}
