/** Geel H-blokje met het hoofdstuknummer; crème als het hoofdstuk dicht is. */
export default function HBlok({ nummer, dicht = false }) {
  // Number(null) is 0: zonder deze controle toonde een hoofdstuk zonder nummer "H0".
  const leeg = nummer == null || nummer === '';
  const getal = Number(nummer);
  const tekst = !leeg && Number.isFinite(getal) && getal < 999 ? getal : '?';
  return <span className={dicht ? 'lo-hblok lo-hblok--dicht' : 'lo-hblok'}>H{tekst}</span>;
}
