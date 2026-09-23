// Korte WebAudio-tonen; geen geluidsbestanden. Faalt stil als audio niet kan.

let context = null;

function ctx() {
  if (typeof window === 'undefined') return null;
  try {
    if (!context) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      context = new AudioContextClass();
    }
    if (context.state === 'suspended') context.resume();
    return context;
  } catch {
    return null;
  }
}

function toon(frequenties, duur = 0.12, type = 'sine', volume = 0.08) {
  const audio = ctx();
  if (!audio) return;
  try {
    frequenties.forEach((frequentie, index) => {
      const start = audio.currentTime + index * duur;
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = type;
      osc.frequency.value = frequentie;
      gain.gain.setValueAtTime(volume, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duur);
      osc.connect(gain).connect(audio.destination);
      osc.start(start);
      osc.stop(start + duur + 0.02);
    });
  } catch {
    // geen geluid is ook goed
  }
}

export const speelGoed = () => toon([660, 880], 0.1, 'triangle');
export const speelFout = () => toon([220, 180], 0.14, 'sawtooth', 0.04);
export const speelPlons = () => toon([500, 380, 300], 0.07, 'sine', 0.05);
export const speelKlaar = () => toon([523, 659, 784, 1046], 0.12, 'triangle');
