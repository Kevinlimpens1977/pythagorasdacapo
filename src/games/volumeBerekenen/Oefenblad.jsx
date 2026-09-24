import { useState } from 'react';
import { CheckCircle2, PencilLine, RotateCcw, XCircle } from 'lucide-react';
import { GetalVeld, Knop } from './componenten/Ui';
import { formatGetal, PUNTEN_GOED, PUNTEN_HALF } from './volumeLogic';
import { maakOefenblad, oefenAntwoordGoed } from './volumeOefenblad';
import { speelFout, speelGoed } from './volumeSounds';

// Het oefenblad na de opgaven: acht invulsommen op één pagina. De leerling
// vult alles in en kijkt na. Foute sommen verbetert hij tot ze goed zijn. Elke
// foute poging kost een minpunt voor het cijfer, hooguit 2 per som (Kevin, 24
// sep 2026); na twee foute pogingen staan het antwoord en de uitwerking erbij.
const MAX_MINPUNTEN = 2;

export default function Oefenblad({ missie, onKlaar }) {
  const [vragen] = useState(() => maakOefenblad(missie));
  const [antwoorden, setAntwoorden] = useState(() => vragen.map(() => ''));
  const [foutePogingen, setFoutePogingen] = useState(() => vragen.map(() => 0));
  const [goedGezet, setGoedGezet] = useState(() => vragen.map(() => false));
  const [nagekeken, setNagekeken] = useState(false);

  const alleGoed = goedGezet.every(Boolean);
  const openVragen = vragen.map((_, index) => index).filter((index) => !goedGezet[index]);
  const allesIngevuld = openVragen.every((index) => antwoorden[index].trim() !== '');

  const kijkNa = () => {
    const nieuwGoed = [...goedGezet];
    const nieuwFout = [...foutePogingen];
    let ietsFout = false;
    for (const index of openVragen) {
      if (oefenAntwoordGoed(antwoorden[index], vragen[index].antwoord)) {
        nieuwGoed[index] = true;
      } else {
        nieuwFout[index] += 1;
        ietsFout = true;
      }
    }
    setGoedGezet(nieuwGoed);
    setFoutePogingen(nieuwFout);
    setNagekeken(true);
    if (ietsFout) speelFout();
    else speelGoed();
  };

  const klaar = () => onKlaar(vragen.map((vraag, index) => {
    const fout = foutePogingen[index];
    return {
      id: vraag.id,
      punten: fout === 0 ? PUNTEN_GOED : fout === 1 ? PUNTEN_HALF : 0,
      fouten: fout === 0 ? [] : ['oefenblad'],
      onderdelen: 1,
      minpunten: Math.min(MAX_MINPUNTEN, fout)
    };
  }));

  const aantalGoedInEen = foutePogingen.filter((fout, index) => fout === 0 && goedGezet[index]).length;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border-[3px] border-[#0B0D0F] bg-white p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="ds-display flex items-center gap-2 text-[28px]"><PencilLine size={26} aria-hidden="true" /> Oefenblad</p>
        <p className="text-[15px] font-bold text-[#5B5648]">
          {!nagekeken
            ? 'Vul alles in en kijk daarna na. Een komma mag.'
            : alleGoed
              ? `Alles goed. ${aantalGoedInEen} van ${vragen.length} in één keer.`
              : `Verbeter de rode sommen en kijk opnieuw na. Nog ${openVragen.length} te gaan.`}
        </p>
      </div>

      <ol className="grid gap-3 lg:grid-cols-2">
        {vragen.map((vraag, index) => {
          const goed = goedGezet[index];
          const fout = foutePogingen[index];
          const rood = nagekeken && !goed && fout > 0;
          return (
            <li
              key={vraag.id}
              className={`flex flex-col gap-2 rounded-xl border-[2.5px] p-3 ${
                goed ? 'border-[#2E9D63] bg-[#E3F5EA]' : rood ? 'border-[#D83A2E] bg-[#FADDDA]' : 'border-[#0B0D0F] bg-[#FFF7E8]'
              }`}
            >
              <p className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wide text-[#066A99]">
                <span>{index + 1}. {vraag.soort === 'omrekenen' ? 'Omrekenen' : 'Verhaalsom'}</span>
                {fout > 0 && <span className="text-[#B4520E]">{fout === 1 ? '1 minpunt' : `${Math.min(fout, MAX_MINPUNTEN)} minpunten`}</span>}
              </p>
              <p className="font-bold leading-snug">{vraag.vraag}</p>
              <div className="flex items-center gap-2">
                <GetalVeld
                  waarde={antwoorden[index]}
                  onChange={(waarde) => setAntwoorden(antwoorden.map((oud, i) => (i === index ? waarde : oud)))}
                  onEnter={allesIngevuld ? kijkNa : undefined}
                  eenheid={vraag.eenheid}
                  breed
                  disabled={goed}
                  fout={rood}
                  autoFocus={index === 0}
                />
                {goed && <CheckCircle2 size={24} className="text-[#237A4D]" aria-label="Goed" />}
                {rood && <XCircle size={24} className="text-[#D83A2E]" aria-label="Nog niet goed" />}
              </div>
              {rood && fout === 1 && <p className="text-sm font-semibold">Nog niet goed. Reken het nog eens na en verbeter je antwoord.</p>}
              {rood && fout >= MAX_MINPUNTEN && (
                <p className="text-sm font-semibold">
                  <span className="font-extrabold">Antwoord: {formatGetal(vraag.antwoord)} {vraag.eenheid}. </span>
                  {vraag.uitwerking} Vul het goede antwoord in.
                </p>
              )}
              {goed && fout > 0 && <p className="text-sm font-semibold">{vraag.uitwerking}</p>}
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap items-center gap-3">
        {alleGoed ? (
          <Knop variant="goed" onClick={klaar} autoFocus>Naar de uitslag</Knop>
        ) : (
          <>
            <Knop onClick={kijkNa} disabled={!allesIngevuld}>
              {nagekeken ? <><RotateCcw size={18} aria-hidden="true" />Opnieuw nakijken</> : 'Nakijken'}
            </Knop>
            {!allesIngevuld && <span className="text-sm font-bold text-[#5B5648]">Vul eerst alle open sommen in.</span>}
          </>
        )}
      </div>
    </div>
  );
}
