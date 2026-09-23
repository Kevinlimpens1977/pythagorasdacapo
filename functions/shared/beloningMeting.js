// Meten en bijsturen (fase 5): een kort advies bij de weekcijfers van een klas.
// De drempels zijn bewust grof; het is een duwtje, geen automatische aanpassing.
// Dit bestand gaat ook naar functions/shared.

export function adviesVoorWeek(week = {}) {
  const leerlingen = Math.max(0, Number(week.leerlingen) || 0);
  if (leerlingen === 0) return [];
  const advies = [];
  const actief = Math.max(0, Number(week.actief) || 0);
  const plafond = Math.max(0, Number(week.plafondGeraakt) || 0);
  const gekocht = Math.max(0, Number(week.aankopen) || 0) + Math.max(0, Number(week.privileges) || 0);
  const saldo = Math.max(0, Number(week.gemiddeldSaldo) || 0);

  if (actief / leerlingen < 0.5) {
    advies.push('Minder dan de helft werkte deze week in HELIX. Een klasdoel of een dubbele-XP-week kan helpen.');
  }
  if (plafond / leerlingen >= 0.3) {
    advies.push('Veel leerlingen raken het weekplafond. Overweeg het plafond wat hoger te zetten.');
  }
  if (actief >= 5 && gekocht === 0 && saldo >= 300) {
    advies.push('Er wordt gespaard maar niets gekocht. Kijk of de prijzen niet te hoog zijn, of zet een stemming uit over nieuwe items.');
  }
  if (Number(week.weekdoelTotaal) > 0 && Number(week.weekdoelGehaald) / Number(week.weekdoelTotaal) >= 0.8) {
    advies.push('Bijna iedereen haalde het weekdoel. Mooi; het hoofdstuk van volgende week mag iets meer vragen.');
  }
  return advies;
}
