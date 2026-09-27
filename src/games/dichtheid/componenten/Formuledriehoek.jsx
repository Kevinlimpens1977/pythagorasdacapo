import { useRef } from 'react';
import { Hand } from 'lucide-react';
import { FORMULES, NAAM, SYMBOOL } from '../dichtheidLogic';
import Sleepbaar from './Sleepbaar';

const INK = '#0B0D0F';

// Waar de letters staan, in procenten van de driehoek (m boven, ρ × V onder).
const PLEK = { m: { x: 50, y: 36 }, rho: { x: 32, y: 74 }, V: { x: 68, y: 74 } };
const LETTERS = ['m', 'rho', 'V'];
// Waar de hand ligt en hoe groot hij is (d, in procenten van de breedte). Onderin
// dekt hij ook het ×-teken af: met de hand op ρ blijft m boven V over, een deelsom.
const HANDPLEK = { m: { x: 50, y: 38, d: 32 }, rho: { x: 38, y: 75.5, d: 38 }, V: { x: 62, y: 75.5, d: 38 } };

// De formuledriehoek met een ronde hand. Leg de hand op wat je zoekt; wat
// overblijft is de formule. `handOp`: de letter onder de hand (of null).
// Met `onLeg` is de hand te slepen; knoppen eronder doen hetzelfde.
export default function Formuledriehoek({ handOp = null, onLeg = null, klein = false, toonFormule = true }) {
  const refs = { m: useRef(null), rho: useRef(null), V: useRef(null) };
  const doelen = LETTERS.map((id) => ({ id, ref: refs[id] }));
  const formule = handOp ? FORMULES[handOp] : null;

  const hand = (
    <span className="flex aspect-square w-full items-center justify-center rounded-full border-[3px] border-[#0B0D0F] bg-[#FFD33D] shadow-[3px_3px_0_#0B0D0F]">
      <Hand className="h-1/2 w-1/2" aria-hidden="true" />
    </span>
  );
  const onder = handOp === 'rho' || handOp === 'V';
  const plek = handOp ? HANDPLEK[handOp] : null;

  return (
    <div className={`flex w-full flex-col items-center gap-2 ${klein ? 'max-w-[220px]' : 'max-w-[380px]'}`}>
      <div className="relative w-full" style={{ aspectRatio: '1 / 0.87' }}>
        <svg viewBox="0 0 200 174" className="absolute inset-0 h-full w-full" role="img" aria-label="Formuledriehoek: m boven, rho keer V onder">
          <path d="M 100 6 L 194 168 L 6 168 Z" fill="#FFF0B8" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <line x1="53" y1="87" x2="147" y2="87" stroke={INK} strokeWidth="4" />
          <line x1="100" y1="87" x2="100" y2="168" stroke={INK} strokeWidth="4" />
          {!onder && (
            <>
              <circle cx="100" cy="128" r="12" fill="#FFF0B8" stroke={INK} strokeWidth="2.5" />
              <text x="100" y="136" textAnchor="middle" fontSize="22" fontWeight="800" fill={INK} fontFamily="Arial, sans-serif">×</text>
            </>
          )}
          {LETTERS.map((letter) => (
            <text
              key={letter}
              x={PLEK[letter].x * 2}
              y={PLEK[letter].y * 1.74 + 15}
              textAnchor="middle"
              fontSize="44"
              fontWeight="800"
              fontStyle="italic"
              fill={INK}
              opacity={handOp === letter ? 0 : 1}
              fontFamily="Georgia, 'Times New Roman', serif"
            >
              {SYMBOOL[letter]}
            </text>
          ))}
        </svg>
        {LETTERS.map((letter) => (
          <div
            key={letter}
            ref={refs[letter]}
            className="absolute h-[34%] w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ left: `${PLEK[letter].x}%`, top: `${PLEK[letter].y}%` }}
          />
        ))}
        {plek && (
          <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${plek.x}%`, top: `${plek.y}%`, width: `${plek.d}%` }}>
            {onLeg ? (
              <Sleepbaar doelen={doelen.filter((doel) => doel.id !== handOp)} onDrop={onLeg} label="Hand. Sleep naar een letter.">{hand}</Sleepbaar>
            ) : hand}
          </div>
        )}
        {onLeg && !handOp && (
          <div className="absolute -right-2 -top-1 w-16">
            <Sleepbaar doelen={doelen} onDrop={onLeg} label="Hand. Sleep hem op de letter die je zoekt.">{hand}</Sleepbaar>
          </div>
        )}
      </div>
      {onLeg && (
        <div className="flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Leg de hand op">
          <span className="text-sm font-bold">Hand op:</span>
          {LETTERS.map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => onLeg(letter)}
              aria-pressed={handOp === letter}
              aria-label={`Hand op ${NAAM[letter]}`}
              className={`min-h-[40px] min-w-[44px] rounded-lg border-[2.5px] border-[#0B0D0F] px-2 font-serif text-xl font-extrabold italic ${handOp === letter ? 'bg-[#0B0D0F] text-[#FFD33D]' : 'bg-white'}`}
            >
              {SYMBOOL[letter]}
            </button>
          ))}
        </div>
      )}
      {toonFormule && formule && (
        <p className="rounded-xl border-2 border-[#0B0D0F] bg-white px-3 py-1 text-center font-bold">
          <span className="text-xl font-extrabold">{formule.tekst}</span>
          {!klein && <span className="block text-sm text-[#5B5648]">{formule.woorden}</span>}
        </p>
      )}
    </div>
  );
}
