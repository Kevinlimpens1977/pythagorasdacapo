// Vervangt in de opnamebrowser elke leerlingnaam door "Leerling A", "Leerling B", ...
// Namen komen uit de eerste kolom van tabellen met de kop "Leerling" en uit
// elementen met data-leerlingnaam; extra namen kunnen via window.__extraNamen.
// Leerlingfoto's (img met alt of in een avatar) worden verborgen achter een rondje.
(() => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const kaart = window.__aliasKaart || (window.__aliasKaart = new Map());
  const alias = (naam) => {
    const sleutel = naam.trim().toLowerCase();
    if (!kaart.has(sleutel)) {
      const i = kaart.size;
      kaart.set(sleutel, `Leerling ${letters[i % 26]}${i >= 26 ? Math.floor(i / 26) + 1 : ''}`);
    }
    return kaart.get(sleutel);
  };
  const namen = new Set(window.__extraNamen || []);
  document.querySelectorAll('table').forEach((tabel) => {
    const kop = tabel.querySelector('thead th, tr th');
    if (!kop || !/leerling|naam/i.test(kop.textContent)) return;
    tabel.querySelectorAll('tbody tr').forEach((rij) => {
      const cel = rij.querySelector('td');
      const tekst = cel?.innerText?.split('\n')[0]?.trim();
      if (tekst && tekst.length > 2 && tekst.length < 40 && !/^\d/.test(tekst)) namen.add(tekst);
    });
  });
  document.querySelectorAll('[data-leerlingnaam]').forEach((el) => namen.add(el.getAttribute('data-leerlingnaam')));
  // Kaartjes van klasgenoten (Mijn klas): de eerste vette regel in een kaart met "Compliment".
  document.querySelectorAll('article, section > div, li').forEach((kaart) => {
    if (!/Compliment/.test(kaart.innerText || '')) return;
    const naamEl = [...kaart.querySelectorAll('h2, h3, p, span')].find((el) => !el.children.length && /font-(extra)?bold|font-black/.test(el.className || '') && (el.textContent || '').trim().length > 2);
    const tekst = naamEl?.textContent?.trim();
    if (tekst && tekst.length < 40 && !/Niveau|Compliment|Dit ben jij|Pin|Leerling/i.test(tekst)) namen.add(tekst);
  });
  const lijst = [...namen].filter(Boolean).sort((a, b) => b.length - a.length);
  lijst.forEach(alias);
  const wandel = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let telling = 0;
  for (let knoop = wandel.nextNode(); knoop; knoop = wandel.nextNode()) {
    let t = knoop.nodeValue;
    for (const naam of lijst) {
      let laag = t.toLowerCase();
      let plek = laag.indexOf(naam.toLowerCase());
      while (plek !== -1) {
        t = t.slice(0, plek) + alias(naam) + t.slice(plek + naam.length);
        telling += 1;
        laag = t.toLowerCase();
        plek = laag.indexOf(naam.toLowerCase(), plek + 1);
      }
    }
    if (t !== knoop.nodeValue) knoop.nodeValue = t;
  }
  // Initialen in rondjes verraden de echte naam: vervang ze door de letter van de alias.
  document.querySelectorAll('span, div').forEach((el) => {
    if (el.children.length) return;
    const tekst = (el.textContent || '').trim();
    if (!/^[A-Za-z]{1,2}$/.test(tekst) || !/rounded-full/.test(el.className || '')) return;
    let ouder = el.parentElement;
    for (let i = 0; i < 4 && ouder; i += 1, ouder = ouder.parentElement) {
      const m = (ouder.innerText || '').match(/Leerling ([A-Z][0-9]?)/);
      if (m) { el.textContent = m[1]; return; }
    }
    el.textContent = '';
  });
  document.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src') || '';
    if (/photo|foto|avatar|leerling|students/i.test(src + (img.alt || '')) && !/logo|helix/i.test(src)) {
      img.style.filter = 'blur(14px)';
    }
  });
  return { namen: lijst.length, vervangen: telling };
})()
