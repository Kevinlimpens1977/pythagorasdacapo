import { CONTENT_BLOCK_TYPES } from './contentBlockUtils.js';

const normalizeText = (value = '') => String(value).toLowerCase().trim();

export const isCmsItemArchived = (item = {}) => item.isArchived === true || item.isActive === false;

const visibleBlocks = (blocks = [], includeArchived = false) =>
  blocks.filter((block) => block && (includeArchived || !isCmsItemArchived(block)));

const visibleItems = (items = [], includeArchived = false) =>
  items.filter((item) => item && (includeArchived || !isCmsItemArchived(item)));

export const getCmsItemLabel = (type, item = {}) => {
  if (type === 'vak') return item.name || item.naam || 'Vak zonder naam';
  if (type === 'leerjaar') return item.label || item.name || (item.year ? `Jaar ${item.year}` : 'Leerjaar');
  if (type === 'niveau') {
    if (item.label && item.name && item.label !== item.name) return `${item.label} - ${item.name}`;
    return item.label || item.name || 'Niveau';
  }
  if (type === 'hoofdstuk') return item.title || item.name || (item.number ? `Hoofdstuk ${item.number}` : 'Hoofdstuk zonder naam');
  if (type === 'paragraaf') return item.title || item.name || 'Paragraaf zonder naam';
  return item.name || item.naam || item.title || item.label || 'Onderdeel';
};

export const getContentBlockTypeCounts = (blocks = [], { includeArchived = false } = {}) => {
  const counts = CONTENT_BLOCK_TYPES.reduce(
    (acc, type) => ({
      ...acc,
      [type]: 0
    }),
    {
      total: 0,
      published: 0,
      draft: 0
    }
  );

  visibleBlocks(blocks, includeArchived).forEach((block) => {
    counts.total += 1;
    if (CONTENT_BLOCK_TYPES.includes(block.type)) counts[block.type] += 1;
    if (block.status === 'published') counts.published += 1;
    else counts.draft += 1;
  });

  return counts;
};

const nodeMatchesQuery = (node, query) => {
  if (!query) return true;
  return normalizeText(`${node.label} ${node.searchText || ''}`).includes(query);
};

const filterNode = (node, query) => {
  const children = (node.children || [])
    .map((child) => filterNode(child, query))
    .filter(Boolean);
  const matches = nodeMatchesQuery(node, query);

  if (!matches && children.length === 0) return null;
  return {
    ...node,
    children
  };
};

export const buildCmsNavigationTree = (
  {
    vakken = [],
    leerjaren = [],
    niveaus = [],
    hoofdstukken = [],
    paragrafen = [],
    vragen = [],
    contentBlocks = []
  },
  { query = '', includeArchived = false } = {}
) => {
  const normalizedQuery = normalizeText(query);
  const visibleVakken = visibleItems(vakken, includeArchived);
  const visibleLeerjaren = visibleItems(leerjaren, includeArchived);
  const visibleNiveaus = visibleItems(niveaus, includeArchived);
  const visibleHoofdstukken = visibleItems(hoofdstukken, includeArchived);
  const visibleParagrafen = visibleItems(paragrafen, includeArchived);
  const visibleVragen = visibleItems(vragen, includeArchived);
  const visibleContentBlocks = visibleItems(contentBlocks, includeArchived);

  const tree = visibleVakken.map((vak) => {
    const vakLeerjaren = visibleLeerjaren.filter((leerjaar) => leerjaar.vakId === vak.id);

    return {
      ...vak,
      type: 'vak',
      archived: isCmsItemArchived(vak),
      label: getCmsItemLabel('vak', vak),
      counts: {
        leerjaren: vakLeerjaren.length
      },
      children: vakLeerjaren.map((leerjaar) => {
        const leerjaarNiveaus = visibleNiveaus.filter((niveau) => niveau.leerjaarId === leerjaar.id);

        return {
          ...leerjaar,
          type: 'leerjaar',
          archived: isCmsItemArchived(leerjaar),
          label: getCmsItemLabel('leerjaar', leerjaar),
          counts: {
            niveaus: leerjaarNiveaus.length
          },
          children: leerjaarNiveaus.map((niveau) => {
            const niveauHoofdstukken = visibleHoofdstukken.filter((hoofdstuk) => hoofdstuk.niveauId === niveau.id);

            return {
              ...niveau,
              type: 'niveau',
              archived: isCmsItemArchived(niveau),
              label: getCmsItemLabel('niveau', niveau),
              counts: {
                hoofdstukken: niveauHoofdstukken.length
              },
              children: niveauHoofdstukken.map((hoofdstuk) => {
                const hoofdstukParagrafen = visibleParagrafen.filter((paragraaf) => paragraaf.hoofdstukId === hoofdstuk.id);

                return {
                  ...hoofdstuk,
                  type: 'hoofdstuk',
                  archived: isCmsItemArchived(hoofdstuk),
                  label: getCmsItemLabel('hoofdstuk', hoofdstuk),
                  counts: {
                    paragrafen: hoofdstukParagrafen.length
                  },
                  children: hoofdstukParagrafen.map((paragraaf) => {
                    const paragraafBlocks = visibleContentBlocks.filter((block) => block.paragraafId === paragraaf.id);

                    return {
                      ...paragraaf,
                      type: 'paragraaf',
                      archived: isCmsItemArchived(paragraaf),
                      label: getCmsItemLabel('paragraaf', paragraaf),
                      counts: {
                        vragen: visibleVragen.filter((vraag) => vraag.paragraafId === paragraaf.id).length,
                        blocks: getContentBlockTypeCounts(paragraafBlocks, { includeArchived })
                      },
                      searchText: visibleVragen
                        .filter((vraag) => vraag.paragraafId === paragraaf.id)
                        .map((vraag) => `Q${vraag.number}: ${vraag.title || 'Naamloze vraag'}`)
                        .join(' '),
                      children: []
                    };
                  })
                };
              })
            };
          })
        };
      })
    };
  });

  if (!normalizedQuery) return tree;
  return tree.map((node) => filterNode(node, normalizedQuery)).filter(Boolean);
};
