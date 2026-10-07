import { LogIn } from 'lucide-react';

/** De lichtblauwe Start-knop uit de bijlage. `icoon={null}` voor Start hier. */
export default function StartKnop({ children = 'Start', onClick, disabled = false, icoon: Icoon = LogIn, ...rest }) {
  return (
    <button type="button" className="lo-knop-start" onClick={onClick} disabled={disabled} {...rest}>
      {Icoon && <Icoon size={15} aria-hidden="true" />}
      {children}
    </button>
  );
}
