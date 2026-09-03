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
