// WebAudio-geluiden voor PacoPacMan (geen bestanden nodig).
// Dot-eten loopt een toonladder op (reset na 8) - dat maakt ritmisch eten verslavend.
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

const toon = ({ frequentie, duurMs, type = 'sine', volume = 0.06, startNa = 0 }) => {
  const context = getContext();
  if (!context) return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const start = context.currentTime + startNa;
  const einde = start + duurMs / 1000;
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequentie, start);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, einde);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(einde + 0.05);
};

const LADDER = [392, 440, 494, 587, 659, 784, 880, 988];
let ladderIndex = 0;

export const speelDot = () => {
  toon({ frequentie: LADDER[ladderIndex], duurMs: 70, volume: 0.045 });
  ladderIndex = (ladderIndex + 1) % LADDER.length;
};

export const resetLadder = () => { ladderIndex = 0; };

export const speelPickup = () => {
  toon({ frequentie: 523, duurMs: 120 });
  toon({ frequentie: 784, duurMs: 160, startNa: 0.1 });
};

export const speelPower = () => {
  [523, 659, 784, 1047, 1319].forEach((frequentie, i) => (
    toon({ frequentie, duurMs: 140, startNa: i * 0.07, volume: 0.08 })
  ));
};

export const speelSpookGegeten = () => {
  toon({ frequentie: 220, duurMs: 90, type: 'square', volume: 0.05 });
  toon({ frequentie: 880, duurMs: 140, startNa: 0.08, volume: 0.07 });
};

export const speelDood = () => {
  [660, 550, 440, 330, 220].forEach((frequentie, i) => (
    toon({ frequentie, duurMs: 160, startNa: i * 0.11, type: 'triangle', volume: 0.06 })
  ));
};

export const speelFout = () => {
  toon({ frequentie: 180, duurMs: 200, type: 'triangle', volume: 0.05 });
};

export const speelLevelKlaar = () => {
  [523, 659, 784, 1047].forEach((frequentie, i) => (
    toon({ frequentie, duurMs: 180, startNa: i * 0.12, volume: 0.08 })
  ));
};

export const speelEindFanfare = () => {
  [392, 523, 659, 784, 1047, 1319].forEach((frequentie, i) => (
    toon({ frequentie, duurMs: 220, startNa: i * 0.13, volume: 0.09 })
  ));
};
