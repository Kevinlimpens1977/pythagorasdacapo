/**
 * Testaccounts: de negen leerlingen waarmee de beheerder een klas naloopt.
 *
 * Ze staan in `users` als gewone leerling, met `isTestaccount: true` erbij.
 * Overal waar een klas geteld of getoond wordt, horen ze er niet bij: een
 * docent die "18 van 22 af" leest, mag daar geen testleerling in hebben zitten.
 * Firestore kan niet filteren op "veld afwezig of ongelijk", dus het filter
 * gebeurt na het ophalen, hier, op één plek.
 */

export const isTestaccount = (gebruiker) => gebruiker?.isTestaccount === true;

/** Dezelfde lijst zonder de testaccounts. Laat gewone leerlingen ongemoeid. */
export const zonderTestaccounts = (gebruikers = []) =>
  (Array.isArray(gebruikers) ? gebruikers : []).filter((gebruiker) => !isTestaccount(gebruiker));

/** De uid's van de testaccounts in een lijst, om voortgang mee te filteren. */
export const testaccountIds = (gebruikers = []) =>
  (Array.isArray(gebruikers) ? gebruikers : [])
    .filter(isTestaccount)
    .map((gebruiker) => gebruiker?.id || gebruiker?.uid || '')
    .filter(Boolean);
