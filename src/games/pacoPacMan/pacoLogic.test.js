import test from 'node:test';
import assert from 'node:assert/strict';
import { PACO_LEVELS, SPELER_SNELHEID, POWER_SPELER_FACTOR, OGEN_SNELHEID_FACTOR } from './pacoLevels.js';
import { PACO_VRAGEN } from './pacoVragen.js';
import {
  berekenLevelMaxScore,
  berekenPacoMaxScore,
  buildPacoDetails,
  kanBewegen,
  kiesSpookRichting,
  maakRng,
  maakSpelStaat,
  PACO_SCORE,
  parseMaze,
  pasHerkansingToe,
  pasQuizResultaatToe,
  RICHTINGEN,
  splitsBoss,
  stapSpel,
  TICKS_PER_SECONDE
} from './pacoLogic.js';

const RICHTING_NAAM = { '1,0': 'rechts', '-1,0': 'links', '0,-1': 'omhoog', '0,1': 'omlaag' };

// BFS naar de dichtstbijzijnde dot; geeft de eerste stap-richting terug.
const bfsRichting = (veld, dots, start) => {
  const sleutel = (x, y) => `${x},${y}`;
  const bezocht = new Set([sleutel(start.x, start.y)]);
  const rij = [{ x: start.x, y: start.y, eerste: null }];

  while (rij.length > 0) {
    const huidig = rij.shift();
    if (dots.has(veld.index(huidig.x, huidig.y)) && huidig.eerste) return huidig.eerste;

    for (const dir of Object.values(RICHTINGEN)) {
      let nx = huidig.x + dir.x;
      const ny = huidig.y + dir.y;
      if (!kanBewegen(veld, nx, ny)) continue;
      if (nx < 0) nx = veld.breedte - 1;
      if (nx >= veld.breedte) nx = 0;
      const s = sleutel(nx, ny);
      if (bezocht.has(s)) continue;
      bezocht.add(s);
      rij.push({ x: nx, y: ny, eerste: huidig.eerste || RICHTING_NAAM[`${dir.x},${dir.y}`] });
    }
  }
  return null;
};

test('alle mazes zijn 15x13 met speler, spookhok, deur en dots', () => {
  assert.equal(PACO_LEVELS.length, 4);
  for (const level of PACO_LEVELS) {
    assert.equal(level.maze.length, 13, `level ${level.nummer} rijen`);
    for (const rij of level.maze) {
      assert.equal(rij.length, 15, `level ${level.nummer} rij "${rij}"`);
    }
    const veld = parseMaze(level.maze);
    assert.notEqual(veld.spelerStart, null, `level ${level.nummer} heeft P`);
    assert.equal(veld.spookStarts.length >= 3, true, `level ${level.nummer} heeft spookhok`);
    assert.equal(veld.deuren.size >= 1, true, `level ${level.nummer} heeft hokdeur`);
    assert.equal(veld.dots.size >= 60, true, `level ${level.nummer} heeft genoeg dots (${veld.dots.size})`);
  }
  // Finale heeft teleports en een boss
  const finale = parseMaze(PACO_LEVELS[3].maze);
  assert.equal(finale.teleports.length, 2);
  assert.equal(PACO_LEVELS[3].heeftBoss, true);
});

test('elk level heeft minstens 3 quizvragen met precies een goed antwoord', () => {
  for (const level of PACO_LEVELS) {
    const vragen = PACO_VRAGEN[level.nummer];
    assert.equal(vragen.length >= 3, true, `level ${level.nummer}`);
    for (const vraag of vragen) {
      assert.equal(vraag.opties.filter((optie) => optie.correct).length, 1, vraag.id);
      assert.equal(typeof vraag.uitleg, 'string');
    }
  }
});

test('geen enkele entiteit kan sneller dan 1 tile per tick', () => {
  const max = Math.max(
    SPELER_SNELHEID * POWER_SPELER_FACTOR,
    SPELER_SNELHEID * OGEN_SNELHEID_FACTOR
  );
  assert.equal(max / TICKS_PER_SECONDE < 1, true);
});

test('speler beweegt met inputbuffering en kan altijd 180 graden omkeren', () => {
  const staat = maakSpelStaat(0, 42);
  staat.spoken = [];
  staat.fase = 'spelen';
  const rng = maakRng(1);

  stapSpel(staat, { richting: 'links' }, rng);
  for (let i = 0; i < 30; i += 1) stapSpel(staat, null, rng);
  assert.equal(staat.speler.x < staat.speler.startX, true, 'speler is naar links gelopen');

  const xVoorOmkeer = staat.speler.x;
  stapSpel(staat, { richting: 'rechts' }, rng);
  for (let i = 0; i < 30; i += 1) stapSpel(staat, null, rng);
  assert.equal(staat.speler.x > xVoorOmkeer, true, 'speler keerde direct om');
});

test('spoken keren nooit om in een gang', () => {
  const veld = parseMaze(PACO_LEVELS[0].maze);
  const rng = maakRng(7);
  // Gang op rij 7 (allemaal pad): spook beweegt naar rechts, mag niet links kiezen
  const spook = { x: 5, y: 7, dir: { x: 1, y: 0 }, modus: 'normaal', isBoss: false, hoekX: 1, hoekY: 1, persona: 'jager' };
  for (let i = 0; i < 50; i += 1) {
    const richting = kiesSpookRichting(spook, veld, { x: 1, y: 7 }, rng);
    assert.notDeepEqual(richting, { x: -spook.dir.x, y: -spook.dir.y }, 'geen 180 in gang');
    if (richting) spook.dir = richting;
  }
});

test('quiz bevriest het spel: posities en timers veranderen niet', () => {
  const staat = maakSpelStaat(0, 42);
  staat.fase = 'quiz';
  const rng = maakRng(1);
  const kopie = JSON.stringify({ x: staat.speler.x, power: staat.powerTicks, klok: staat.klok });

  for (let i = 0; i < 200; i += 1) stapSpel(staat, { richting: 'links' }, rng);
  assert.equal(JSON.stringify({ x: staat.speler.x, power: staat.powerTicks, klok: staat.klok }), kopie);
});

test('goed quizantwoord geeft power-mode en maakt spoken bang; fout niet', () => {
  const staat = maakSpelStaat(0, 42);
  staat.fase = 'quiz';
  staat.spoken.forEach((spook) => { spook.inHuisTicks = 0; });

  pasQuizResultaatToe(staat, true);
  assert.equal(staat.powerTicks > 0, true);
  assert.equal(staat.spoken.every((spook) => spook.modus === 'bang'), true);
  assert.equal(staat.score, PACO_SCORE.vraagGoed);
  assert.equal(staat.fase, 'klaar', 'aftellen voor hervatting');

  const staat2 = maakSpelStaat(0, 42);
  staat2.fase = 'quiz';
  pasQuizResultaatToe(staat2, false);
  assert.equal(staat2.powerTicks, 0);
  assert.equal(staat2.score, 0);
  assert.equal(staat2.vragenFout.length, 1);
});

test('botsing met bang spook eet hem op (ogen-modus); herkansing herstelt vraagpunten', () => {
  const staat = maakSpelStaat(0, 42);
  staat.fase = 'spelen';
  staat.spoken = staat.spoken.slice(0, 1);
  const spook = staat.spoken[0];
  spook.modus = 'bang';
  spook.inHuisTicks = 0;
  spook.x = staat.speler.x;
  spook.y = staat.speler.y;
  spook.dir = { x: 1, y: 0 };

  const events = stapSpel(staat, null, maakRng(1));
  assert.equal(spook.modus, 'ogen');
  assert.equal(staat.score >= PACO_SCORE.spookGegeten, true);
  assert.equal(events.some((event) => event.type === 'spookGegeten'), true);

  staat.vragenFout = ['hardware'];
  const gelukt = pasHerkansingToe(staat, 'hardware', true);
  assert.equal(gelukt, true);
  assert.equal(staat.vragenFout.length, 0);
});

test('botsing met normaal spook kost een leven en reset posities', () => {
  const staat = maakSpelStaat(0, 42);
  staat.fase = 'spelen';
  staat.spoken = staat.spoken.slice(0, 1);
  const spook = staat.spoken[0];
  spook.inHuisTicks = 0;
  spook.x = staat.speler.x;
  spook.y = staat.speler.y;

  stapSpel(staat, null, maakRng(1));
  assert.equal(staat.fase, 'dood');
  assert.equal(staat.levens, 2);

  // Dood-animatie uitzitten -> respawn-aftelling
  const rng = maakRng(1);
  for (let i = 0; i < 100; i += 1) stapSpel(staat, null, rng);
  assert.equal(staat.fase, 'klaar');
  assert.equal(staat.speler.x, staat.speler.startX);
});

test('boss splitst in twee mini-bosses', () => {
  const staat = maakSpelStaat(3, 42);
  const boss = staat.spoken.find((spook) => spook.isBoss);
  assert.notEqual(boss, undefined);
  splitsBoss(staat, boss);
  assert.equal(staat.spoken.filter((spook) => spook.isMiniBoss).length, 2);
  assert.equal(staat.spoken.includes(boss), false);
});

test('maxScore is deterministisch en telt dots, vragen en bonussen', () => {
  const verwacht = PACO_LEVELS.reduce((totaal, level) => {
    const veld = parseMaze(level.maze);
    return totaal + veld.dots.size * 10 + 3 * 250 + 200;
  }, 0) + 400;
  assert.equal(berekenPacoMaxScore(), verwacht);
  assert.equal(berekenLevelMaxScore(PACO_LEVELS[0]) > 0, true);
});

test('buildPacoDetails maakt compacte per-level statistieken', () => {
  const details = buildPacoDetails({
    levelResultaten: [{ nummer: 1, score: 1200, voltooid: true, vragenGoed: ['a'], vragenFout: [], levensOver: 2 }],
    totaleTijdSeconden: 300.4
  });
  assert.equal(details.levels.length, 1);
  assert.equal(details.totaleTijdSeconden, 300);
});

// De kroon op de tests: een BFS-bot speelt ELK level volledig uit (zonder spoken).
// Dit bewijst dat elke maze klopt: alle dots bereikbaar, teleports werken, level sluit af.
for (const [levelIndex, level] of PACO_LEVELS.entries()) {
  test(`BFS-bot speelt level ${level.nummer} (${level.naam}) volledig uit`, () => {
    const staat = maakSpelStaat(levelIndex, 1234);
    staat.spoken = [];
    staat.fase = 'spelen';
    const rng = maakRng(99);
    let klaar = false;

    for (let tick = 0; tick < 30000 && !klaar; tick += 1) {
      // Actieve (pakbare) pickup heeft voorrang, anders de dichtstbijzijnde dot
      const pickup = staat.pickup.actief;
      const doelen = pickup && pickup.pulseTicks === 0
        ? new Set([staat.veld.index(pickup.x, pickup.y)])
        : staat.dots;
      const richting = bfsRichting(staat.veld, doelen, staat.speler);
      const events = stapSpel(staat, richting ? { richting } : null, rng);
      for (const event of events) {
        if (event.type === 'quizStart') pasQuizResultaatToe(staat, true);
        if (event.type === 'levelKlaar') klaar = true;
      }
      // Tijdens aftellen gewoon doortikken
      if (staat.fase === 'klaar') {
        for (let i = 0; i < 200 && staat.fase === 'klaar'; i += 1) stapSpel(staat, null, rng);
      }
    }

    assert.equal(klaar, true, `level ${level.nummer} uitgespeeld`);
    assert.equal(staat.voltooid, true);
    assert.equal(staat.dots.size, 0, 'alle dots opgegeten');
    assert.equal(staat.vraagIndex, 3, 'alle 3 vragen langsgekomen');
    assert.equal(
      staat.score,
      staat.totaalDots * PACO_SCORE.dot + 3 * PACO_SCORE.vraagGoed + PACO_SCORE.levelBonus,
      'score klopt exact met het perfecte pad'
    );
  });
}
