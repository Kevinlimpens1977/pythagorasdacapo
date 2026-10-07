/** Geel H-blokje met het hoofdstuknummer; crème als het hoofdstuk dicht is. */
export default function HBlok({ nummer, dicht = false }) {
  const getal = Number(nummer);
  const tekst = Number.isFinite(getal) && getal < 999 ? getal : '?';
  return <span className={dicht ? 'lo-hblok lo-hblok--dicht' : 'lo-hblok'}>H{tekst}</span>;
}
