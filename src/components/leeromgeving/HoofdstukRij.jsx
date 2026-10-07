import { ChevronDown, ChevronRight, Lock } from 'lucide-react';

import HBlok from './HBlok';
import StartKnop from './StartKnop';

/**
 * Eén hoofdstuk in een lijst: H-blokje, titel, onderregel en een Start-knop.
 * Klapt uit tot paragraafrijen (children). Op slot: crème blokje, slotje,
 * knop uit, niet uit te klappen.
 */
export default function HoofdstukRij({
  nummer,
  titel,
  onderregel,
  slotTekst = 'op slot',
  labels = null,
  opSlot = false,
  open = false,
  onWissel,
  onStart,
  startTekst = 'Start',
  startUit = false,
  children
}) {
  const kanOpen = !opSlot && typeof onWissel === 'function';
  const Pijl = open ? ChevronDown : ChevronRight;

  return (
    <div className="lo-hoofdstuk">
      <div className="lo-rij">
        <button
          type="button"
          className="lo-rij-toggle"
          onClick={kanOpen ? onWissel : undefined}
          disabled={!kanOpen}
          aria-expanded={kanOpen ? open : undefined}
        >
          <HBlok nummer={nummer} dicht={opSlot} />
          <span className="lo-rij-tekst">
            <span className="lo-rij-titel">{titel}</span>
            <span className="lo-onderregel">{opSlot ? slotTekst : onderregel}</span>
          </span>
          {labels}
          {opSlot && <Lock size={15} aria-hidden="true" />}
          {kanOpen && <Pijl size={15} aria-hidden="true" />}
        </button>
        {onStart && (
          <StartKnop onClick={onStart} disabled={opSlot || startUit} aria-label={`${startTekst}: ${titel}`}>
            {startTekst}
          </StartKnop>
        )}
      </div>
      {open && !opSlot && children ? <div className="lo-paragrafen">{children}</div> : null}
    </div>
  );
}
