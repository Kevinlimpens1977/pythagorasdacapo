import { ANGLE_LABEL_FONT_STACK } from '../../lib/presenterAngleTool';

// De tekening van een hoekmarkering: twee benen, een boogje in de hoek en het
// aantal graden klein bij dat boogje.
//
// Eén component voor twee plekken: de preview op de geodriehoek en de hoek die
// daarna als object op het bord staat. Zo kan er tussen "wat je ziet" en "wat je
// krijgt" niets verschuiven.
//
// De meetkunde komt uit getAngleFrameGeometry en staat in het lokale kader van
// het object; de aanroeper zet er de juiste transform omheen.
export default function PresenterAngleShape({ geometry, stroke, strokeWidth = 5 }) {
  if (!geometry) return null;

  const { angleDegrees, originX, originY, leg1End, leg2End, marker, label } = geometry;

  return (
    <g>
      <g fill="none" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>
        <line x1={originX} y1={originY} x2={leg1End.x} y2={leg1End.y} />
        {/* Bij 0 en 360 graden vallen de benen samen: dan is één been genoeg. */}
        {angleDegrees > 0 && angleDegrees < 360 ? (
          <line x1={originX} y1={originY} x2={leg2End.x} y2={leg2End.y} />
        ) : null}
        {marker.d ? <path d={marker.d} strokeWidth={Math.max(2, strokeWidth * 0.72)} /> : null}
      </g>
      {/* Het aantal graden is data, geen inkt: het wordt elke render opnieuw uit
          angleDegrees afgeleid en klopt dus per definitie. */}
      <text
        x={label.x}
        y={label.y}
        fill={stroke}
        stroke="none"
        fontFamily={ANGLE_LABEL_FONT_STACK}
        fontSize={label.fontSize}
        fontWeight="800"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {label.text}
      </text>
    </g>
  );
}
