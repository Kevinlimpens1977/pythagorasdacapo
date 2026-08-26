// Vaste woordenlijsten per level (allemaal digitale vaardigheden).
// VAST houden: de maxScore wordt hieruit berekend, dus geen willekeurige selectie.
// Volgorde tijdens het spelen mag wel geschud worden.
export const TURBO_LEVELS = [
  {
    nummer: 1,
    naam: 'Opwarmen',
    thema: 'Korte woorden, rustig tempo',
    gradient: 'from-sky-100 via-cyan-50 to-white',
    accent: '#0ea5e9',
    baanSeconden: 12.5,
    achtergrond: 'achtergrond1.webp',
    spawnIntervalMs: 4500,
    woorden: ['app', 'wifi', 'chat', 'mail', 'klik', 'muis', 'data', 'spam']
  },
  {
    nummer: 2,
    naam: 'Versnellen',
    thema: 'Iets langere woorden, iets sneller',
    gradient: 'from-emerald-100 via-teal-50 to-white',
    accent: '#10b981',
    baanSeconden: 10.5,
    achtergrond: 'achtergrond2.webp',
    spawnIntervalMs: 4000,
    woorden: ['code', 'cloud', 'login', 'virus', 'emoji', 'pixel', 'webcam', 'server', 'router']
  },
  {
    nummer: 3,
    naam: 'Op stoom',
    thema: 'Middellange woorden, vlot tempo',
    gradient: 'from-violet-100 via-purple-50 to-white',
    accent: '#8b5cf6',
    baanSeconden: 8.5,
    achtergrond: 'achtergrond3.webp',
    spawnIntervalMs: 3200,
    woorden: ['online', 'upload', 'cursor', 'browser', 'account', 'hashtag', 'monitor', 'bestand', 'computer', 'internet']
  },
  {
    nummer: 4,
    naam: 'Turbo',
    thema: 'Lange woorden, hoog tempo',
    gradient: 'from-amber-100 via-orange-50 to-white',
    accent: '#f59e0b',
    baanSeconden: 6.5,
    achtergrond: 'achtergrond4.webp',
    spawnIntervalMs: 2600,
    woorden: ['software', 'hardware', 'download', 'phishing', 'firewall', 'database', 'streamen', 'nepnieuws', 'wachtwoord', 'veiligheid']
  },
  {
    nummer: 5,
    naam: 'Meesterproef',
    thema: 'De langste woorden, topsnelheid',
    gradient: 'from-rose-100 via-pink-50 to-white',
    accent: '#f43f5e',
    baanSeconden: 6,
    achtergrond: 'achtergrond5.webp',
    spawnIntervalMs: 2400,
    woorden: [
      'verbinding', 'informatie', 'wachtwoordzin', 'toetsenbord', 'beeldscherm', 'beveiliging',
      'technologie', 'zoekmachine', 'luidspreker', 'instellingen', 'programmeren', 'mediawijsheid'
    ]
  }
];
