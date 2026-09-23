import { useRef, useState } from 'react';

// Een vlak van de balk op ware grootte (40 px per cm) met een doorzichtige liniaal
// die je kunt verslepen (Stark Science). Pijltjestoetsen verschuiven 1 mm, met Shift 1 cm.

const INK = '#0B0D0F';
const PX_PER_CM = 40;
const RAND = 12;
const DIKTE = 48;
const BREEDTE = 620;
const HOOGTE = 440;

function Liniaal({ lengteCm }) {
  const streepjes = [];
  for (let mm = 0; mm <= lengteCm * 10; mm += 1) {
    const x = RAND + mm * (PX_PER_CM / 10);
    const cm = mm % 10 === 0;
    const half = !cm && mm % 5 === 0;
    streepjes.push(
      <line key={mm} x1={x} x2={x} y1={0} y2={cm ? 20 : half ? 13 : 8} stroke={INK} strokeWidth={cm ? 1.6 : 1} />
    );
    if (cm) {
      streepjes.push(
        <text key={`t${mm}`} x={x} y={34} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} fontFamily="Atkinson Hyperlegible Next Variable, Arial, sans-serif">
          {mm / 10}
        </text>
      );
    }
  }
  return (
    <g>
      <rect x="0" y="0" width={lengteCm * PX_PER_CM + RAND * 2} height={DIKTE} rx="4" fill="#FFE9A8" fillOpacity="0.72" stroke={INK} strokeWidth="2.5" />
      {streepjes}
      <text x={lengteCm * PX_PER_CM + RAND - 4} y={DIKTE - 5} textAnchor="end" fontSize="10" fontWeight="700" fill={INK} fontFamily="Atkinson Hyperlegible Next Variable, Arial, sans-serif">cm</text>
    </g>
  );
}

// richting 'horizontaal': meet de bovenrand van het vlak; 'verticaal': meet de linkerrand.
export default function MeetPaneel({ maatCm, andereCm, richting = 'horizontaal', kleur = '#3FA7DB', toonJuist = false }) {
  const svgRef = useRef(null);
  const sleep = useRef(null);
  const horizontaal = richting === 'horizontaal';
  const lengteCm = horizontaal ? 13 : 9;
  const [pos, setPos] = useState(horizontaal ? { x: 24, y: 40 } : { x: 30, y: 420 });

  const vlak = horizontaal
    ? { x: 80, y: 150, w: maatCm * PX_PER_CM, h: Math.min(andereCm, 6) * PX_PER_CM }
    : { x: 260, y: 400 - maatCm * PX_PER_CM, w: Math.min(andereCm, 8) * PX_PER_CM, h: maatCm * PX_PER_CM };

  const naarSvg = (event) => {
    const svg = svgRef.current;
    const punt = svg.createSVGPoint();
    punt.x = event.clientX;
    punt.y = event.clientY;
    return punt.matrixTransform(svg.getScreenCTM().inverse());
  };

  const start = (event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const p = naarSvg(event);
    sleep.current = { dx: p.x - pos.x, dy: p.y - pos.y };
  };
  const beweeg = (event) => {
    if (!sleep.current) return;
    const p = naarSvg(event);
    setPos({
      x: Math.max(-200, Math.min(BREEDTE - 40, p.x - sleep.current.dx)),
      y: Math.max(-200, Math.min(HOOGTE + 200, p.y - sleep.current.dy))
    });
  };
  const stop = () => { sleep.current = null; };

  const toets = (event) => {
    const stap = event.shiftKey ? PX_PER_CM : PX_PER_CM / 10;
    const delta = { ArrowLeft: [-stap, 0], ArrowRight: [stap, 0], ArrowUp: [0, -stap], ArrowDown: [0, stap] }[event.key];
    if (!delta) return;
    event.preventDefault();
    setPos((oud) => ({ x: oud.x + delta[0], y: oud.y + delta[1] }));
  };

  // Juiste plaatsing, als hulp na twee foute pogingen.
  // Horizontaal: streepjes tegen de bovenrand; verticaal: 0 onderaan tegen de linkerrand.
  const juistePos = horizontaal ? { x: vlak.x - RAND, y: vlak.y } : { x: vlak.x, y: vlak.y + vlak.h + RAND };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${BREEDTE} ${HOOGTE}`}
      className="h-auto w-full touch-none select-none rounded-2xl border-[3px] border-[#0B0D0F] bg-[#FFF7E8]"
      role="img"
      aria-label="Meetvlak met liniaal"
      onPointerMove={beweeg}
      onPointerUp={stop}
      onPointerCancel={stop}
    >
      <rect x={vlak.x} y={vlak.y} width={vlak.w} height={vlak.h} fill={kleur} stroke={INK} strokeWidth="3" />
      {horizontaal ? (
        <line x1={vlak.x} x2={vlak.x + vlak.w} y1={vlak.y} y2={vlak.y} stroke="#FFD33D" strokeWidth="8" strokeLinecap="butt" />
      ) : (
        <line x1={vlak.x} x2={vlak.x} y1={vlak.y} y2={vlak.y + vlak.h} stroke="#FFD33D" strokeWidth="8" strokeLinecap="butt" />
      )}
      {horizontaal ? (
        <line x1={vlak.x} x2={vlak.x + vlak.w} y1={vlak.y} y2={vlak.y} stroke={INK} strokeWidth="2" />
      ) : (
        <line x1={vlak.x} x2={vlak.x} y1={vlak.y} y2={vlak.y + vlak.h} stroke={INK} strokeWidth="2" />
      )}

      {toonJuist && (
        <g transform={horizontaal ? `translate(${juistePos.x} ${juistePos.y})` : `translate(${juistePos.x} ${juistePos.y}) rotate(-90)`} opacity="0.55">
          <Liniaal lengteCm={lengteCm} />
        </g>
      )}

      <g
        transform={horizontaal ? `translate(${pos.x} ${pos.y})` : `translate(${pos.x} ${pos.y}) rotate(-90)`}
        onPointerDown={start}
        onKeyDown={toets}
        tabIndex={0}
        role="slider"
        aria-label="Liniaal. Sleep of gebruik de pijltjestoetsen."
        aria-valuenow={Math.round(horizontaal ? pos.x : pos.y)}
        className="cursor-grab outline-none focus-visible:[filter:drop-shadow(0_0_4px_#087EB5)] active:cursor-grabbing"
      >
        <Liniaal lengteCm={lengteCm} />
      </g>
    </svg>
  );
}
