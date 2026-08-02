// Korte, rustige interfacegeluiden via WebAudio (geen geluidsbestanden nodig).
// Geluid is nooit noodzakelijk om te spelen; de mute-stand staat in de component.
let audioContext = null;

const getContext = () => {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioContext) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audioContext = new Ctx();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    return audioContext;
  } catch {
    return null;
  }
};

const speelToon = ({ frequentie, duurMs, type = 'sine', volume = 0.08, startNa = 0 }) => {
  const context = getContext();
  if (!context) return;

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const start = context.currentTime + startNa;
  const einde = start + duurMs / 1000;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequentie, start);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, einde);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(einde + 0.05);
};

export const speelGevonden = () => {
  speelToon({ frequentie: 620, duurMs: 120 });
  speelToon({ frequentie: 880, duurMs: 160, startNa: 0.09 });
};

export const speelMisklik = () => {
  speelToon({ frequentie: 180, duurMs: 140, type: 'triangle', volume: 0.05 });
};

export const speelKlik = () => {
  speelToon({ frequentie: 440, duurMs: 60, volume: 0.04 });
};

export const speelLevelVoltooid = () => {
  [523, 659, 784, 1047].forEach((frequentie, index) => {
    speelToon({ frequentie, duurMs: 180, startNa: index * 0.12 });
  });
};

export const speelEindscore = () => {
  [392, 523, 659, 784, 1047].forEach((frequentie, index) => {
    speelToon({ frequentie, duurMs: 220, startNa: index * 0.14, volume: 0.09 });
  });
};
