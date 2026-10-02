export type Spreker = 'docent' | 'sami';
export type Regel = {
  id: string; spreker: Spreker; tekst: string; uitspraak: string;
  samiUitdrukking?: 'vragend' | 'verbaasd' | 'blij' | 'nadenkend'; pauzeNa?: number;
  bestand: string; start: number; duur: number; eind: number; startFrame: number; duurFrames: number;
};
// bij ontbreekt bij `opgave`: die gebruikt aftelBij en antwoordBij.
export type Getekend = { type: string; bij?: string; tot?: string; [sleutel: string]: unknown };
export type Kernwoord = { tekst: string; bij: string; accent?: boolean };
export type Scene = {
  id: string; kop: string; fase: 'KIJK' | 'CHECK' | 'KLAAR'; indeling: 'FOCUS' | 'SPLIT' | 'STATUS';
  shot?: { naam: string; frames: number; startBij?: string };
  geluiden?: Array<{ bestand: string; bij: string; na: number }>;
  kernwoorden?: Kernwoord[]; getekend?: Getekend[]; regels: Regel[];
  startFrame: number; duurFrames: number;
};
export type Draaiboek = { hoofdstukId: string; titel: string; meta: string; scenes: Array<Omit<Scene, 'startFrame' | 'duurFrames'>> };
export type Timing = { fps: number; regels: Record<string, { bestand: string; duur: number }> };
// Frame binnen de scène waarop een regel begint of eindigt.
export type Klok = { begin: (regelId: string) => number; einde: (regelId: string) => number };
