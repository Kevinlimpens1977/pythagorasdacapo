// Pure spellogica voor PacoPacMan. Geen React, geen Firebase, geen wall-clock.
// Architectuur: vaste timestep (60 ticks/sec), stapSpel() is puur en deterministisch
// (RNG wordt geinjecteerd), zodat alles met node:test naspeelbaar is.
import {
  BANG_SPOOK_FACTOR,
  CHASE_TICKS,
  MINI_BOSS_SCHAAL,
  OGEN_SNELHEID_FACTOR,
  PACO_LEVELS,
  POWER_DUUR_TICKS,
  POWER_SPELER_FACTOR,
  SCATTER_TICKS,
  SPELER_SNELHEID,
  SPOOK_KLEUREN,
  SPOOK_PERSONA
} from './pacoLevels.js';
import { PACO_VRAGEN } from './pacoVragen.js';

export const TICKS_PER_SECONDE = 60;
export const PICKUP_PULSE_TICKS = 90;      // pickup is 1,5s zichtbaar voordat hij pakbaar is
export const AFTEL_TICKS = 150;            // 2,5s "3-2-1" aftellen
export const DOOD_TICKS = 80;
export const HITSTOP_TICKS = 12;           // korte bevriezing bij spook opeten
export const PICKUP_DREMPELS = [0.25, 0.5, 0.75];

export const PACO_SCORE = {
  dot: 10,
  vraagGoed: 250,
  spookGegeten: 100,
  bossGegeten: 300,
  miniBossGegeten: 150,
  levelBonus: 200,
  eindBonus: 400
};

export const RICHTINGEN = {
  links: { x: -1, y: 0 },
  rechts: { x: 1, y: 0 },
  omhoog: { x: 0, y: -1 },
  omlaag: { x: 0, y: 1 }
};

// Deterministische RNG (mulberry32) zodat tests exact naspeelbaar zijn.
export const maakRng = (seed) => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const parseMaze = (rijen) => {
  const hoogte = rijen.length;
  const breedte = rijen[0].length;
  const muren = new Set();
  const deuren = new Set();
  const dots = new Set();
  const teleports = [];
  const spookStarts = [];
  let spelerStart = null;

  const index = (x, y) => y * breedte + x;

  rijen.forEach((rij, y) => {
    [...rij].forEach((teken, x) => {
      if (teken === '#') muren.add(index(x, y));
      if (teken === '-') deuren.add(index(x, y));
      if (teken === '.') dots.add(index(x, y));
      if (teken === 'T') teleports.push({ x, y });
      if (teken === 'G') spookStarts.push({ x, y });
      if (teken === 'P') spelerStart = { x, y };
    });
  });

  return { breedte, hoogte, muren, deuren, dots, teleports, spookStarts, spelerStart, index };
};

export const kanBewegen = (veld, x, y, { magDoorDeur = false } = {}) => {
  if (y < 0 || y >= veld.hoogte) return false;
  // Horizontaal buiten beeld mag alleen op een teleportrij
  if (x < 0 || x >= veld.breedte) {
    return veld.teleports.some((teleport) => teleport.y === y);
  }
  const idx = veld.index(x, y);
  if (veld.muren.has(idx)) return false;
  if (veld.deuren.has(idx) && !magDoorDeur) return false;
  return true;
};

const tegengesteld = (a, b) => a && b && a.x === -b.x && a.y === -b.y;

export const maakSpelStaat = (levelIndex, seed = 1) => {
  const level = PACO_LEVELS[levelIndex];
  const veld = parseMaze(level.maze);
  const rng = maakRng(seed);

  const spoken = [];
  for (let i = 0; i < level.aantalSpoken; i += 1) {
    const start = veld.spookStarts[i % veld.spookStarts.length];
    spoken.push({
      id: `spook${i}`,
      persona: SPOOK_PERSONA[i % SPOOK_PERSONA.length],
      kleur: SPOOK_KLEUREN[i % SPOOK_KLEUREN.length],
      x: start.x,
      y: start.y,
      startX: start.x,
      startY: start.y,
      dir: null,
      progress: 0,
      modus: 'normaal',
      schaal: 1,
      inHuisTicks: i * 90,
      isBoss: false,
      hoekX: i % 2 === 0 ? 1 : veld.breedte - 2,
      hoekY: i < 2 ? 1 : veld.hoogte - 2
    });
  }

  if (level.heeftBoss) {
    const start = veld.spookStarts[0];
    spoken.push({
      id: 'boss',
      persona: 'jager',
      kleur: 'koning',
      x: start.x,
      y: start.y,
      startX: start.x,
      startY: start.y,
      dir: null,
      progress: 0,
      modus: 'normaal',
      schaal: 1.6,
      inHuisTicks: 420,
      isBoss: true,
      hoekX: Math.floor(veld.breedte / 2),
      hoekY: 1
    });
  }

  const vragen = [...(PACO_VRAGEN[level.nummer] || [])]
    .sort(() => rng() - 0.5)
    .slice(0, 3);

  return {
    levelIndex,
    levelNummer: level.nummer,
    fase: 'klaar',
    faseTicks: AFTEL_TICKS,
    veld,
    dots: new Set(veld.dots),
    totaalDots: veld.dots.size,
    speler: {
      x: veld.spelerStart.x,
      y: veld.spelerStart.y,
      startX: veld.spelerStart.x,
      startY: veld.spelerStart.y,
      dir: null,
      nextDir: null,
      progress: 0
    },
    spoken,
    spookSnelheid: level.spookSnelheid,
    powerTicks: 0,
    hitstopTicks: 0,
    klok: { modus: 'scatter', ticks: SCATTER_TICKS },
    pickup: { geplaatst: 0, actief: null },
    vragen,
    vraagIndex: 0,
    vragenGoed: [],
    vragenFout: [],
    score: 0,
    levens: 3,
    voltooid: false
  };
};

const spookDoel = (spook, speler, klokModus, veld) => {
  if (spook.modus === 'ogen') {
    return { x: veld.spookStarts[0].x, y: veld.spookStarts[0].y };
  }
  if (spook.modus === 'bang') return null; // willekeurig
  if (klokModus === 'scatter' && !spook.isBoss) return { x: spook.hoekX, y: spook.hoekY };

  switch (spook.persona) {
    case 'jager':
      return { x: speler.x, y: speler.y };
    case 'sluiper': {
      const dir = speler.dir || RICHTINGEN.rechts;
      return { x: speler.x + dir.x * 4, y: speler.y + dir.y * 4 };
    }
    case 'bang': {
      const afstand = Math.abs(spook.x - speler.x) + Math.abs(spook.y - speler.y);
      return afstand > 6 ? { x: speler.x, y: speler.y } : { x: spook.hoekX, y: spook.hoekY };
    }
    default:
      return null; // twijfelaar: willekeurig (wordt elders per kruispunt bepaald)
  }
};

export const kiesSpookRichting = (spook, veld, doel, rng) => {
  const opties = Object.values(RICHTINGEN).filter((dir) => {
    if (tegengesteld(dir, spook.dir)) return false;
    return kanBewegen(veld, spook.x + dir.x, spook.y + dir.y, { magDoorDeur: true });
  });

  if (opties.length === 0) {
    // Doodlopend: omkeren mag dan wel
    return spook.dir ? { x: -spook.dir.x, y: -spook.dir.y } : null;
  }

  if (!doel) {
    return opties[Math.floor(rng() * opties.length)];
  }

  let beste = opties[0];
  let besteAfstand = Infinity;
  for (const dir of opties) {
    const dx = spook.x + dir.x - doel.x;
    const dy = spook.y + dir.y - doel.y;
    const afstand = dx * dx + dy * dy;
    if (afstand < besteAfstand) {
      besteAfstand = afstand;
      beste = dir;
    }
  }
  return beste;
};

const teleporteer = (veld, entiteit) => {
  if (entiteit.x < 0) entiteit.x = veld.breedte - 1;
  else if (entiteit.x >= veld.breedte) entiteit.x = 0;
};

const CORNER_TOLERANTIE = 0.35;

const stapSpeler = (staat, snelheidTilesPerTick) => {
  const { speler, veld } = staat;

  // 180 graden omkeren mag altijd direct (paniek-ontsnapping)
  if (speler.nextDir && tegengesteld(speler.nextDir, speler.dir)) {
    speler.x += speler.dir.x;
    speler.y += speler.dir.y;
    teleporteer(veld, speler);
    speler.dir = speler.nextDir;
    speler.nextDir = null;
    speler.progress = 1 - speler.progress;
  }

  // Cornering: vlak na een tile-centrum mag een ZIJbocht alsnog, met snap terug
  // naar het centrum. Alleen bij een andere richting dan de huidige, anders zou
  // een ingedrukt gehouden toets de voortgang steeds resetten.
  if (
    speler.dir && speler.nextDir &&
    (speler.nextDir.x !== speler.dir.x || speler.nextDir.y !== speler.dir.y) &&
    speler.progress <= CORNER_TOLERANTIE &&
    kanBewegen(veld, speler.x + speler.nextDir.x, speler.y + speler.nextDir.y)
  ) {
    speler.dir = speler.nextDir;
    speler.nextDir = null;
    speler.progress = 0;
  }

  if (!speler.dir) {
    if (speler.nextDir && kanBewegen(veld, speler.x + speler.nextDir.x, speler.y + speler.nextDir.y)) {
      speler.dir = speler.nextDir;
      speler.nextDir = null;
    } else {
      return;
    }
  }

  speler.progress += snelheidTilesPerTick;
  while (speler.progress >= 1) {
    speler.progress -= 1;
    speler.x += speler.dir.x;
    speler.y += speler.dir.y;
    teleporteer(veld, speler);

    // Op de nieuwe tile: gebufferde richting toepassen (voorsorteren), anders rechtdoor
    if (speler.nextDir && kanBewegen(veld, speler.x + speler.nextDir.x, speler.y + speler.nextDir.y)) {
      speler.dir = speler.nextDir;
      speler.nextDir = null;
    } else if (!kanBewegen(veld, speler.x + speler.dir.x, speler.y + speler.dir.y)) {
      speler.dir = null;
      speler.progress = 0;
      break;
    }
  }
};

const stapSpook = (staat, spook, rng) => {
  const { veld, speler } = staat;

  if (spook.inHuisTicks > 0) {
    spook.inHuisTicks -= 1;
    return;
  }

  const basis = SPELER_SNELHEID * staat.spookSnelheid;
  let snelheid = basis;
  if (spook.modus === 'bang') snelheid = basis * BANG_SPOOK_FACTOR;
  if (spook.modus === 'ogen') snelheid = SPELER_SNELHEID * OGEN_SNELHEID_FACTOR;
  if (spook.isBoss) snelheid = basis * 1.03;
  const perTick = snelheid / TICKS_PER_SECONDE;

  if (!spook.dir) {
    spook.dir = kiesSpookRichting(spook, veld, spookDoel(spook, speler, staat.klok.modus, veld), rng);
    if (!spook.dir) return;
  }

  spook.progress += perTick;
  while (spook.progress >= 1) {
    spook.progress -= 1;
    spook.x += spook.dir.x;
    spook.y += spook.dir.y;
    teleporteer(veld, spook);

    // Ogen thuis aangekomen: opnieuw meedoen
    if (spook.modus === 'ogen' && spook.x === veld.spookStarts[0].x && spook.y === veld.spookStarts[0].y) {
      spook.modus = 'normaal';
      spook.inHuisTicks = 120;
      spook.dir = null;
      spook.progress = 0;
      return;
    }

    const doel = spookDoel(spook, speler, staat.klok.modus, veld);
    const nieuweRichting = kiesSpookRichting(spook, veld, doel, rng);
    if (!nieuweRichting) {
      spook.dir = null;
      spook.progress = 0;
      return;
    }
    spook.dir = nieuweRichting;
  }
};

const keerSpokenOm = (spoken) => {
  for (const spook of spoken) {
    if (spook.dir && spook.modus !== 'ogen') {
      spook.dir = { x: -spook.dir.x, y: -spook.dir.y };
      spook.progress = Math.min(1, 1 - spook.progress);
    }
  }
};

const checkBotsingen = (staat, vorigePosities, events) => {
  const { speler, spoken } = staat;
  const vorigeSpeler = vorigePosities.speler;

  for (const spook of spoken) {
    if (spook.modus === 'ogen' || spook.inHuisTicks > 0) continue;
    const vorige = vorigePosities.spoken[spook.id];
    const zelfdeTile = spook.x === speler.x && spook.y === speler.y;
    const gewisseld = vorige &&
      spook.x === vorigeSpeler.x && spook.y === vorigeSpeler.y &&
      speler.x === vorige.x && speler.y === vorige.y;

    if (!zelfdeTile && !gewisseld) continue;

    if (spook.modus === 'bang') {
      if (spook.isBoss) {
        events.push({ type: 'bossGesplitst' });
        staat.score += PACO_SCORE.bossGegeten;
        splitsBoss(staat, spook);
      } else if (spook.isMiniBoss) {
        staat.score += PACO_SCORE.miniBossGegeten;
        events.push({ type: 'spookGegeten', spookId: spook.id, punten: PACO_SCORE.miniBossGegeten });
        spook.modus = 'ogen';
        spook.schaal = 1;
      } else {
        staat.score += PACO_SCORE.spookGegeten;
        events.push({ type: 'spookGegeten', spookId: spook.id, punten: PACO_SCORE.spookGegeten });
        spook.modus = 'ogen';
      }
      staat.hitstopTicks = HITSTOP_TICKS;
    } else {
      events.push({ type: 'dood' });
      staat.levens -= 1;
      staat.fase = 'dood';
      staat.faseTicks = DOOD_TICKS;
      return;
    }
  }
};

export const splitsBoss = (staat, boss) => {
  staat.spoken = staat.spoken.filter((spook) => spook !== boss);
  for (let i = 0; i < 2; i += 1) {
    staat.spoken.push({
      id: `miniboss${i}`,
      persona: i === 0 ? 'jager' : 'sluiper',
      kleur: 'koning',
      x: boss.x,
      y: boss.y,
      startX: boss.startX,
      startY: boss.startY,
      dir: i === 0 ? { x: 1, y: 0 } : { x: -1, y: 0 },
      progress: 0,
      modus: 'bang',
      schaal: MINI_BOSS_SCHAAL,
      inHuisTicks: 0,
      isBoss: false,
      isMiniBoss: true,
      hoekX: boss.hoekX,
      hoekY: boss.hoekY
    });
  }
};

const kiesPickupTile = (staat, rng) => {
  const { veld, speler, spoken } = staat;
  const kandidaten = [];
  for (let y = 1; y < veld.hoogte - 1; y += 1) {
    for (let x = 1; x < veld.breedte - 1; x += 1) {
      if (!kanBewegen(veld, x, y)) continue;
      if (x === speler.x && y === speler.y) continue;
      const veiligVanSpoken = spoken.every((spook) => (
        Math.abs(spook.x - x) + Math.abs(spook.y - y) >= 6
      ));
      if (veiligVanSpoken) kandidaten.push({ x, y });
    }
  }
  if (kandidaten.length === 0) return { x: speler.startX, y: speler.startY };
  return kandidaten[Math.floor(rng() * kandidaten.length)];
};

export const stapSpel = (staat, invoer, rng) => {
  const events = [];

  if (invoer?.richting) {
    staat.speler.nextDir = RICHTINGEN[invoer.richting] || null;
  }

  if (staat.fase === 'quiz' || staat.fase === 'levelKlaar') {
    return events;
  }

  if (staat.fase === 'klaar' || staat.fase === 'dood') {
    staat.faseTicks -= 1;
    if (staat.faseTicks <= 0) {
      if (staat.fase === 'dood') {
        if (staat.levens <= 0) {
          staat.fase = 'levelKlaar';
          staat.voltooid = false;
          events.push({ type: 'levelKlaar', voltooid: false });
          return events;
        }
        // Reset posities, dots blijven staan
        const { speler } = staat;
        speler.x = speler.startX;
        speler.y = speler.startY;
        speler.dir = null;
        speler.nextDir = null;
        speler.progress = 0;
        staat.spoken.forEach((spook, i) => {
          spook.x = spook.startX;
          spook.y = spook.startY;
          spook.dir = null;
          spook.progress = 0;
          spook.modus = 'normaal';
          spook.inHuisTicks = 60 + i * 60;
        });
        staat.powerTicks = 0;
        staat.fase = 'klaar';
        staat.faseTicks = AFTEL_TICKS;
        events.push({ type: 'respawn' });
      } else {
        staat.fase = 'spelen';
        events.push({ type: 'start' });
      }
    }
    return events;
  }

  // fase === 'spelen'
  if (staat.hitstopTicks > 0) {
    staat.hitstopTicks -= 1;
    return events;
  }

  // Scatter/chase-klok (pauzeert automatisch tijdens quiz/aftellen omdat we hier pas komen)
  if (staat.powerTicks > 0) {
    staat.powerTicks -= 1;
    if (staat.powerTicks === 0) {
      events.push({ type: 'powerVoorbij' });
      staat.spoken.forEach((spook) => {
        if (spook.modus === 'bang') spook.modus = 'normaal';
      });
    }
  } else {
    staat.klok.ticks -= 1;
    if (staat.klok.ticks <= 0) {
      staat.klok.modus = staat.klok.modus === 'scatter' ? 'chase' : 'scatter';
      staat.klok.ticks = staat.klok.modus === 'scatter' ? SCATTER_TICKS : CHASE_TICKS;
      keerSpokenOm(staat.spoken);
    }
  }

  // Pickup pulseert eerst, wordt daarna pas pakbaar
  if (staat.pickup.actief && staat.pickup.actief.pulseTicks > 0) {
    staat.pickup.actief.pulseTicks -= 1;
    if (staat.pickup.actief.pulseTicks === 0) events.push({ type: 'pickupKlaar' });
  }

  const vorigePosities = {
    speler: { x: staat.speler.x, y: staat.speler.y },
    spoken: Object.fromEntries(staat.spoken.map((spook) => [spook.id, { x: spook.x, y: spook.y }]))
  };

  const spelerSnelheid = SPELER_SNELHEID * (staat.powerTicks > 0 ? POWER_SPELER_FACTOR : 1);
  stapSpeler(staat, spelerSnelheid / TICKS_PER_SECONDE);
  staat.spoken.forEach((spook) => stapSpook(staat, spook, rng));

  // Dot opeten
  const spelerIndex = staat.veld.index(staat.speler.x, staat.speler.y);
  if (staat.dots.has(spelerIndex)) {
    staat.dots.delete(spelerIndex);
    staat.score += PACO_SCORE.dot;
    events.push({ type: 'dot', resterend: staat.dots.size });

    // Nieuwe pickup spawnen op de dot-drempels
    const gegeten = staat.totaalDots - staat.dots.size;
    const voortgang = gegeten / staat.totaalDots;
    if (
      staat.pickup.geplaatst < staat.vragen.length &&
      !staat.pickup.actief &&
      voortgang >= PICKUP_DREMPELS[staat.pickup.geplaatst]
    ) {
      const tile = kiesPickupTile(staat, rng);
      staat.pickup.actief = { ...tile, pulseTicks: PICKUP_PULSE_TICKS };
      staat.pickup.geplaatst += 1;
      events.push({ type: 'pickupSpawn', tile });
    }
  }

  // Pickup oppakken -> quiz
  const actief = staat.pickup.actief;
  if (actief && actief.pulseTicks === 0 && actief.x === staat.speler.x && actief.y === staat.speler.y) {
    staat.pickup.actief = null;
    staat.fase = 'quiz';
    events.push({ type: 'quizStart', vraag: staat.vragen[staat.vraagIndex] });
    return events;
  }

  checkBotsingen(staat, vorigePosities, events);

  // Level klaar zodra alle dots op zijn
  if (staat.fase === 'spelen' && staat.dots.size === 0) {
    staat.fase = 'levelKlaar';
    staat.voltooid = true;
    staat.score += PACO_SCORE.levelBonus;
    events.push({ type: 'levelKlaar', voltooid: true });
  }

  return events;
};

export const pasQuizResultaatToe = (staat, goed) => {
  const vraag = staat.vragen[staat.vraagIndex];
  staat.vraagIndex += 1;
  if (goed) {
    staat.vragenGoed.push(vraag.id);
    staat.score += PACO_SCORE.vraagGoed;
    staat.powerTicks = POWER_DUUR_TICKS;
    staat.spoken.forEach((spook) => {
      if (spook.modus === 'normaal' && spook.inHuisTicks <= 0) spook.modus = 'bang';
    });
    keerSpokenOm(staat.spoken);
  } else {
    staat.vragenFout.push(vraag.id);
  }
  staat.fase = 'klaar';
  staat.faseTicks = AFTEL_TICKS;
};

export const pasHerkansingToe = (staat, vraagId, goed) => {
  if (!goed) return false;
  staat.vragenFout = staat.vragenFout.filter((id) => id !== vraagId);
  staat.vragenGoed.push(vraagId);
  staat.score += PACO_SCORE.vraagGoed;
  return true;
};

export const berekenLevelMaxScore = (level) => {
  const veld = parseMaze(level.maze);
  return veld.dots.size * PACO_SCORE.dot + 3 * PACO_SCORE.vraagGoed + PACO_SCORE.levelBonus;
};

export const berekenPacoMaxScore = (levels = PACO_LEVELS) => (
  levels.reduce((totaal, level) => totaal + berekenLevelMaxScore(level), 0) + PACO_SCORE.eindBonus
);

export const buildPacoDetails = ({ levelResultaten = [], totaleTijdSeconden = 0 }) => ({
  levels: levelResultaten.map((resultaat) => ({
    nummer: resultaat.nummer,
    score: resultaat.score,
    voltooid: resultaat.voltooid,
    vragenGoed: resultaat.vragenGoed,
    vragenFout: resultaat.vragenFout,
    levensOver: resultaat.levensOver
  })),
  totaleTijdSeconden: Math.max(0, Math.round(Number(totaleTijdSeconden) || 0))
});
