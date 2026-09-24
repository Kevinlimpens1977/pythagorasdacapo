import { useState } from 'react';
import { CheckCircle2, PencilLine, XCircle } from 'lucide-react';
import { GetalVeld, Knop } from './componenten/Ui';
import { formatGetal, PUNTEN_GOED } from './volumeLogic';
import { maakOefenblad, oefenAntwoordGoed } from './volumeOefenblad';
import { speelGoed } from './volumeSounds';

// Het oefenblad na de opgaven: acht invulsommen op één pagina. De leerling
// vult alles in en kijkt in één keer na; daarna staat bij elke som de
// uitwerking. Elke goede som telt 10 punten, net als een opgave.
export default function Oefenblad({ missie, onKlaar }) {
  const [vragen] = useState(() => maakOefenblad(missie));
  const [antwoorden, setAntwoorden] = useState(() => vragen.map(() => ''));
  const [nagekeken, setNagekeken] = useState(false);

  const goed = vragen.map((vraag, index) => oefenAntwoordGoed(antwoorden[index], vraag.antwoord));
  const aantalGoed = goed.filter(Boolean).length;
  const allesIngevuld = antwoorden.every((antwoord) => antwoord.trim() !== '');

  const kijkNa = () => {
    setNagekeken(true);
    if (aantalGoed > 0) speelGoed();
  };

  const klaar = () => onKlaar(vragen.map((vraag, index) => ({
    id: vraag.id,
    punten: goed[index] ? PUNTEN_GOED : 0,
    fouten: goed[index] ? [] : ['oefenblad']
  })));

  return (
    <div className="flex flex-col gap-4 rounded-2xl border-[3px] border-[#0B0D0F] bg-white p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="ds-display flex items-center gap-2 text-[28px]"><PencilLine size={26} aria-hidden="true" /> Oefenblad</p>
        <p className="text-[15px] font-bold text-[#5B5648]">
          {nagekeken ? `${aantalGoed} van ${vragen.length} goed` : 'Vul alles in en kijk daarna na. Een komma mag.'}
        </p>
      </div>

      <ol className="grid gap-3 lg:grid-cols-2">
        {vragen.map((vraag, index) => {
          const isGoed = goed[index];
          return (
            <li
              key={vraag.id}
              className={`flex flex-col gap-2 rounded-xl border-[2.5px] p-3 ${
                !nagekeken ? 'border-[#0B0D0F] bg-[#FFF7E8]' : isGoed ? 'border-[#2E9D63] bg-[#E3F5EA]' : 'border-[#D83A2E] bg-[#FADDDA]'
              }`}
            >
              <p className="text-xs font-extrabold uppercase tracking-wide text-[#066A99]">
                {index + 1}. {vraag.soort === 'omrekenen' ? 'Omrekenen' : 'Verhaalsom'}
              </p>
              <p className="font-bold leading-snug">{vraag.vraag}</p>
              <div className="flex items-center gap-2">
                <GetalVeld
                  waarde={antwoorden[index]}
                  onChange={(waarde) => setAntwoorden(antwoorden.map((oud, i) => (i === index ? waarde : oud)))}
                  eenheid={vraag.eenheid}
                  breed
                  disabled={nagekeken}
                  fout={nagekeken && !isGoed}
                  autoFocus={index === 0}
                />
                {nagekeken && (isGoed
                  ? <CheckCircle2 size={24} className="text-[#237A4D]" aria-label="Goed" />
                  : <XCircle size={24} className="text-[#D83A2E]" aria-label="Nog niet goed" />)}
              </div>
              {nagekeken && (
                <p className="text-sm font-semibold">
                  {!isGoed && <span className="font-extrabold">Antwoord: {formatGetal(vraag.antwoord)} {vraag.eenheid}. </span>}
                  {vraag.uitwerking}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap items-center gap-3">
        {!nagekeken ? (
          <>
            <Knop onClick={kijkNa} disabled={!allesIngevuld}>Nakijken</Knop>
            {!allesIngevuld && <span className="text-sm font-bold text-[#5B5648]">Vul eerst alle {vragen.length} sommen in.</span>}
          </>
        ) : (
          <Knop variant="goed" onClick={klaar} autoFocus>Naar de uitslag</Knop>
        )}
      </div>
    </div>
  );
}
