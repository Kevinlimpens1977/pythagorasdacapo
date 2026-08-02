// Levels van PacoPacMan als pure data. Elke maze is 15 kolommen x 13 rijen.
// Tekens: # muur · . datapunt · (spatie) leeg pad · P spelerstart
//         G spookstart (in het hok) · - hokdeur (alleen spoken) · T teleport (paar per rij)
// De integriteit van elke maze wordt afgedwongen door pacoLogic.test.js (bereikbaarheid, maten).
export const PACO_LEVELS = [
  {
    nummer: 1,
    naam: 'Het Schoolnetwerk',
    thema: 'Basis ICT: apparaten, wachtwoorden en phishing',
    achtergrond: 'achtergrond1.webp',
    introVideo: 'intro-level1.mp4',
    muurKleur: '#0ea5e9',
    aantalSpoken: 2,
    spookSnelheid: 0.75,
    maze: [
      '###############',
      '#.....#.#.....#',
      '#.###.#.#.###.#',
      '#.#.........#.#',
      '#.#.##---##.#.#',
      '#....#GGG#....#',
      '#.#.#######.#.#',
      '#.#.........#.#',
      '#.###.#.#.###.#',
      '#.....#.#.....#',
      '#.###.#.#.###.#',
      '#......P......#',
      '###############'
    ]
  },
  {
    nummer: 2,
    naam: 'De Kantoortoren',
    thema: 'Word en PowerPoint',
    achtergrond: 'achtergrond2.webp',
    introVideo: 'intro-level2.mp4',
    muurKleur: '#f59e0b',
    aantalSpoken: 3,
    spookSnelheid: 0.85,
    maze: [
      '###############',
      '#......#......#',
      '#.####.#.####.#',
      '#.............#',
      '#.##.##---##.##',
      '#....#GGG#....#',
      '#.##.#######.##',
      '#.............#',
      '#.####.#.####.#',
      '#......#......#',
      '#.####.#.####.#',
      '#......P......#',
      '###############'
    ]
  },
  {
    nummer: 3,
    naam: 'Social Media Stad',
    thema: 'Mediawijsheid: algoritmes, cyberpesten en nepnieuws',
    achtergrond: 'achtergrond3.webp',
    introVideo: 'intro-level3.mp4',
    muurKleur: '#8b5cf6',
    aantalSpoken: 4,
    spookSnelheid: 0.9,
    maze: [
      '###############',
      '#.....#.#.....#',
      '#.#.#.#.#.#.#.#',
      '#.#...........#',
      '#...##---##.#.#',
      '#.#.#GGGG#..#.#',
      '#.#.######.##.#',
      '#.#.........#.#',
      '#.#.#.###.#.#.#',
      '#...#..#..#...#',
      '#.#.##.#.##.#.#',
      '#......P......#',
      '###############'
    ]
  },
  {
    nummer: 4,
    naam: 'De AI-Kern',
    thema: 'AI en chatbots - de grote finale',
    achtergrond: 'achtergrond4.webp',
    introVideo: 'intro-level4.mp4',
    muurKleur: '#f43f5e',
    aantalSpoken: 4,
    spookSnelheid: 0.92,
    bonus: true,
    heeftBoss: true,
    maze: [
      '###############',
      '#.....#.#.....#',
      '#.###.#.#.###.#',
      '#.............#',
      '###.##---##.###',
      'T....#GGG#....T',
      '###.#######.###',
      '#.............#',
      '#.###.###.###.#',
      '#.#.........#.#',
      '#.#.###.###.#.#',
      '#......P......#',
      '###############'
    ]
  }
];

// Snelheden: speler = 100% referentie (advies spelbeleving-expert).
export const SPELER_SNELHEID = 4.2;          // tiles per seconde
export const POWER_SPELER_FACTOR = 1.15;     // speler sneller in power-mode
export const BANG_SPOOK_FACTOR = 0.6;        // bange spoken trager
export const OGEN_SNELHEID_FACTOR = 2;       // oogjes rennen snel naar huis

export const SPOOK_PERSONA = ['jager', 'sluiper', 'twijfelaar', 'bang'];
export const SPOOK_KLEUREN = ['rood', 'roze', 'cyaan', 'oranje'];

export const POWER_DUUR_TICKS = 8 * 60;      // 8 seconden power-mode (60 ticks/sec)
export const SCATTER_TICKS = 5 * 60;         // 5s adempauze...
export const CHASE_TICKS = 20 * 60;          // ...elke 20s jagen
export const BOSS_SCHAAL = 1.6;
export const MINI_BOSS_SCHAAL = 1.05;
