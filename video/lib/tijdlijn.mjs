// Van draaiboek + gemeten opnames naar een tijdlijn in seconden en frames.
// Puur: zowel Remotion als de scripts gebruiken dit, zodat beeld en
// ondertitels dezelfde tijden hebben.
export const FPS = 30;
export const MAX_SECONDEN = 180;
export const PAUZE_TUSSEN_REGELS = 0.5;
export const SCENE_AANLOOP = 0.4;
export const SCENE_UITLOOP = 0.8;

export function bouwTijdlijn(draaiboek, timing, fps = FPS) {
  let t = 0;
  const scenes = draaiboek.scenes.map((scene) => {
    const start = t;
    t += SCENE_AANLOOP;
    const regels = scene.regels.map((regel, index) => {
      const opname = timing.regels?.[regel.id];
      if (!opname) throw new Error(`Geen opname voor regel ${regel.id}.`);
      const regelStart = t;
      t += opname.duur;
      const laatste = index === scene.regels.length - 1;
      const resultaat = { ...regel, bestand: opname.bestand, start: regelStart, duur: opname.duur, eind: regelStart + opname.duur };
      t += regel.pauzeNa ?? (laatste ? 0 : PAUZE_TUSSEN_REGELS);
      return resultaat;
    });
    t += SCENE_UITLOOP;
    return { ...scene, start, eind: t, regels };
  });

  const frame = (seconden) => Math.round(seconden * fps);
  return {
    fps,
    totaalSeconden: t,
    totaalFrames: frame(t),
    scenes: scenes.map((scene) => ({
      ...scene,
      startFrame: frame(scene.start),
      duurFrames: frame(scene.eind) - frame(scene.start),
      regels: scene.regels.map((regel) => ({
        ...regel,
        startFrame: frame(regel.start),
        duurFrames: Math.max(1, frame(regel.eind) - frame(regel.start))
      }))
    }))
  };
}

export function controleerLengte(tijdlijn, max = MAX_SECONDEN) {
  return { ok: tijdlijn.totaalSeconden <= max, seconden: tijdlijn.totaalSeconden };
}
