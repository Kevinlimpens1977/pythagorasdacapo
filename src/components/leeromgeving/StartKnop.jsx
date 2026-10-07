import { Loader2, LogIn } from 'lucide-react';

/** De lichtblauwe Start-knop uit de bijlage. `icoon={null}` voor Start hier; `bezig` toont een draaiende spinner. */
export default function StartKnop({ children = 'Start', onClick, disabled = false, bezig = false, icoon: Icoon = LogIn, ...rest }) {
  return (
    <button type="button" className="lo-knop-start" onClick={onClick} disabled={disabled} {...rest}>
      {bezig
        ? <Loader2 size={15} className="animate-spin" aria-hidden="true" />
        : Icoon && <Icoon size={15} aria-hidden="true" />}
      {children}
    </button>
  );
}
