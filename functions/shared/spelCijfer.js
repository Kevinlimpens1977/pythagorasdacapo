// Een cijfer uit spellen (Kevin, 24 sep 2026; eerst voor Binask 2.2 Volume).
// Elk invulveld is een onderdeel. Een onderdeel dat niet in één keer goed is,
// kost een minpunt; op het oefenblad per foute poging, hooguit 2. Het cijfer:
// 10 - 9 × minpunten / onderdelen, afgerond op één decimaal, nooit onder de 1.
// Alles in één keer goed is een 10; alles één keer fout een 1.
// Dit bestand gaat ook naar functions/shared.

export function cijferUitTelling({ onderdelen = 0, minpunten = 0 } = {}) {
  const totaal = Number(onderdelen) || 0;
  if (totaal <= 0) return null;
  const min = Math.max(0, Number(minpunten) || 0);
  const cijfer = 10 - (9 * min) / totaal;
  return Math.max(1, Math.round(cijfer * 10) / 10);
}

// Is dit een geloofwaardige telling uit een spel?
export function geldigeTelling(telling = {}) {
  const onderdelen = Number(telling?.onderdelen);
  const minpunten = Number(telling?.minpunten);
  return Number.isInteger(onderdelen) && onderdelen > 0 && onderdelen <= 300
    && Number.isInteger(minpunten) && minpunten >= 0 && minpunten <= onderdelen * 2;
}

// Het cijfer van een groep spellen samen: alle onderdelen en minpunten opgeteld.
// Pas een cijfer als elk spel een ronde heeft.
export function groepsCijfer(rondes = {}, blockIds = []) {
  const aanwezig = blockIds.filter((id) => rondes?.[id]);
  const telling = aanwezig.reduce((som, id) => ({
    onderdelen: som.onderdelen + (Number(rondes[id].onderdelen) || 0),
    minpunten: som.minpunten + (Number(rondes[id].minpunten) || 0)
  }), { onderdelen: 0, minpunten: 0 });
  return {
    ...telling,
    aantalAf: aanwezig.length,
    aantalNodig: blockIds.length,
    cijfer: aanwezig.length === blockIds.length && blockIds.length > 0 ? cijferUitTelling(telling) : null
  };
}
