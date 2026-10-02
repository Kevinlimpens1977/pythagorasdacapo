// Gemeten duren -> timing.json, in de volgorde van het draaiboek.
export function bouwTiming(draaiboek, duren, fps = 30) {
  const regels = {};
  for (const scene of draaiboek.scenes) {
    for (const regel of scene.regels) {
      const meting = duren[regel.id];
      if (!meting) throw new Error(`Geen opname voor regel ${regel.id}.`);
      regels[regel.id] = { bestand: meting.bestand, duur: Math.round(meting.duur * 1000) / 1000 };
    }
  }
  return { fps, regels };
}
