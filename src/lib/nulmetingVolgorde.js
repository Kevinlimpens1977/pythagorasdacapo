/**
 * Volgorde binnen de nulmeting: deel B gaat pas open als deel A helemaal af is.
 *
 * De delen staan als aparte toetsblokken in dezelfde paragraaf, herkenbaar aan
 * `content.nulmeting.deel` (A, B, ...). Een deel is af als elke vraag een
 * ingeleverd antwoord heeft (afgerond, of wachtend op de docent). Een concept
 * (tussentijds bewaard antwoord) telt niet. Navigeren naar de stap mag altijd;
 * alleen de vragen blijven op slot, net als bij het spel als afsluiting.
 */
const asArray = (value) => (Array.isArray(value) ? value : []);

const deelLetter = (block = null) =>
  String(block?.content?.nulmeting?.deel || '').trim().toUpperCase();

const isItemIngeleverd = (record = null) =>
  Boolean(record) && (
    record.completed === true ||
    record.attemptStatus === 'pending_teacher_review'
  );

export const nulmetingDeelSlot = ({ block = null, blocks = [], itemRecordsByBlock = {} } = {}) => {
  const deel = deelLetter(block);
  if (!deel) return { vergrendeld: false, vereist: [] };

  const vereist = asArray(blocks)
    .filter((ander) => ander && ander.id !== block?.id && deelLetter(ander) && deelLetter(ander) < deel)
    .map((ander) => {
      const items = asArray(ander.content?.items);
      const records = itemRecordsByBlock?.[ander.id] || {};
      const itemsAf = items.filter((item) => isItemIngeleverd(records[item?.id])).length;
      return {
        blockId: ander.id,
        deel: deelLetter(ander),
        title: ander.title || `Deel ${deelLetter(ander)}`,
        itemCount: items.length,
        itemsAf,
        klaar: itemsAf === items.length
      };
    })
    .filter((stand) => !stand.klaar);

  return { vergrendeld: vereist.length > 0, vereist };
};

/**
 * Staat de leerling midden in een deel van de nulmeting?
 *
 * De knop onderaan de paragraaf gaat naar de volgende stap, en die zit vlak bij
 * de knop naar de volgende vraag. Wie daar per ongeluk op klikt, laat een deel
 * halverwege achter: deel B blijft dan op slot tot deel A alsnog af is. Vandaar
 * een bevestiging, maar alleen zolang er nog vragen open staan - is het deel af,
 * dan is doorgaan juist de bedoeling en hoeft er niets gevraagd te worden.
 */
export const nulmetingDeelOnaf = ({ block = null, itemRecordsByBlock = {} } = {}) => {
  const deel = deelLetter(block);
  if (!deel) return { isNulmeting: false, onaf: false, deel: '', itemsAf: 0, itemCount: 0 };

  const items = asArray(block?.content?.items);
  const records = itemRecordsByBlock?.[block?.id] || {};
  const itemsAf = items.filter((item) => isItemIngeleverd(records[item?.id])).length;

  return { isNulmeting: true, onaf: itemsAf < items.length, deel, itemsAf, itemCount: items.length };
};
