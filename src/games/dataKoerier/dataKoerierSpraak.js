// Voorleeshulp voor de route-introducties. Probeert eerst een vooraf
// gegenereerd mp3-bestand (Higgsfield TTS); ontbreekt dat of faalt het
// afspelen, dan valt hij terug op de ingebouwde browser-spraak (nl-NL),
// die op school-Chromebooks standaard beschikbaar is. Belangrijk voor
// leerlingen die zwak lezen: de uitleg wordt altijd ook getoond als tekst.

const kiesNederlandseStem = () => {
  try {
    const stemmen = window.speechSynthesis?.getVoices?.() || [];
    return (
      stemmen.find((stem) => stem.lang === 'nl-NL' && /google|natural/i.test(stem.name))
      || stemmen.find((stem) => stem.lang === 'nl-NL')
      || stemmen.find((stem) => stem.lang?.startsWith('nl'))
      || null
    );
  } catch {
    return null;
  }
};

const spreekMetBrowser = (tekst) => {
  try {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null;
    window.speechSynthesis.cancel();
    const uiting = new SpeechSynthesisUtterance(tekst);
    uiting.lang = 'nl-NL';
    uiting.rate = 0.95;
    const stem = kiesNederlandseStem();
    if (stem) uiting.voice = stem;
    window.speechSynthesis.speak(uiting);
    return () => {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // stil falen: spraak is een extra, nooit blokkerend
      }
    };
  } catch {
    return null;
  }
};

// Start de voiceover voor een route-intro. Geeft een stop-functie terug.
export const startIntroSpraak = ({ audioUrl, tekst }) => {
  let stopBrowser = null;
  let audio = null;
  let gestopt = false;

  try {
    audio = new Audio(audioUrl);
    audio.preload = 'auto';
    audio.onerror = () => {
      audio = null;
      if (!gestopt) stopBrowser = spreekMetBrowser(tekst);
    };
    audio.play().catch(() => {
      audio = null;
      if (!gestopt) stopBrowser = spreekMetBrowser(tekst);
    });
  } catch {
    stopBrowser = spreekMetBrowser(tekst);
  }

  return () => {
    gestopt = true;
    try {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    } catch {
      // opruimen mag nooit crashen
    }
    if (stopBrowser) stopBrowser();
    try {
      window.speechSynthesis?.cancel();
    } catch {
      // idem
    }
  };
};
