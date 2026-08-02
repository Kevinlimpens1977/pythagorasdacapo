// WebAudio-geluiden voor Data Koerier (geen bestanden nodig).
// Correcte aanslagen tikken zacht oplopend mee met de streak, zodat een
// foutloze reeks hoorbaar "oploopt" zonder repetitief te worden.
let audioContext = null;

const getContext = () => {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioContext) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audioContext = new Ctx();
    }
    if (audioContext.state === 'suspended') audioContext.resume();
    return audioContext;
  } catch {
    return null;
  }
};

const toon = ({ frequentie, duurMs, type = 'sine', volume = 0.05, startNa = 0 }) => {
  const context = getContext();
  if (!context) return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const start = context.currentTime + startNa;
  const einde = start + duurMs / 1000;
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequentie, start);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, einde);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(einde + 0.05);
};

// Pentatonische trap: klinkt altijd goed, ook bij snel typen.
const TIK_TONEN = [523, 587, 659, 784, 880];

export const speelCorrect = (streak = 0) => {
  const index = Math.min(TIK_TONEN.length - 1, Math.floor((streak % 25) / 5));
  toon({ frequentie: TIK_TONEN[index], duurMs: 45, volume: 0.03 });
};

export const speelFout = () => {
  toon({ frequentie: 165, duurMs: 130, type: 'triangle', volume: 0.045 });
};

export const speelWoordAf = () => {
  toon({ frequentie: 659, duurMs: 90, volume: 0.05 });
  toon({ frequentie: 988, duurMs: 130, startNa: 0.07, volume: 0.055 });
};

export const speelPakketBezorgd = () => {
  [523, 659, 784].forEach((frequentie, i) => (
    toon({ frequentie, duurMs: 110, startNa: i * 0.06, volume: 0.055 })
  ));
};

export const speelStreakBonus = () => {
  [659, 784, 988, 1319].forEach((frequentie, i) => (
    toon({ frequentie, duurMs: 120, startNa: i * 0.05, volume: 0.06 })
  ));
};

export const speelRouteKlaar = () => {
  [392, 523, 659, 784, 1047].forEach((frequentie, i) => (
    toon({ frequentie, duurMs: 190, startNa: i * 0.11, volume: 0.07 })
  ));
};

export const speelRecord = () => {
  [523, 659, 784, 1047, 784, 1047, 1319].forEach((frequentie, i) => (
    toon({ frequentie, duurMs: 150, startNa: i * 0.09, volume: 0.07 })
  ));
};

export const speelNietGehaald = () => {
  [440, 392, 349].forEach((frequentie, i) => (
    toon({ frequentie, duurMs: 180, startNa: i * 0.12, type: 'triangle', volume: 0.045 })
  ));
};
