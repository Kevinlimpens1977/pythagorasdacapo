import { CONTENT_BLOCK_TYPES } from './contentBlockUtils.js';

const normalizeText = (value = '') => String(value).toLowerCase().trim();

const visibleBlocks = (blocks = []) => blocks.filter((block) => block && block.isArchived !== true);

export const getContentBlockTypeCounts = (blocks = []) => {
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

  visibleBlocks(blocks).forEach((block) => {
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
  { query = '' } = {}
) => {
  const normalizedQuery = normalizeText(query);

  const tree = vakken.map((vak) => {
    const vakLeerjaren = leerjaren.filter((leerjaar) => leerjaar.vakId === vak.id);

    return {
      ...vak,
      type: 'vak',
      label: vak.name || 'Vak zonder naam',
      counts: {
        leerjaren: vakLeerjaren.length
      },
      children: vakLeerjaren.map((leerjaar) => {
        const leerjaarNiveaus = niveaus.filter((niveau) => niveau.leerjaarId === leerjaar.id);

        return {
          ...leerjaar,
          type: 'leerjaar',
          label: leerjaar.label || `Jaar ${leerjaar.year}`,
          counts: {
            niveaus: leerjaarNiveaus.length
          },
          children: leerjaarNiveaus.map((niveau) => {
            const niveauHoofdstukken = hoofdstukken.filter((hoofdstuk) => hoofdstuk.niveauId === niveau.id);

            return {
              ...niveau,
              type: 'niveau',
              label: `${niveau.label || niveau.name || 'Niveau'}${niveau.name && niveau.name !== niveau.label ? ` - ${niveau.name}` : ''}`,
              counts: {
                hoofdstukken: niveauHoofdstukken.length
              },
              children: niveauHoofdstukken.map((hoofdstuk) => {
                const hoofdstukParagrafen = paragrafen.filter((paragraaf) => paragraaf.hoofdstukId === hoofdstuk.id);

                return {
                  ...hoofdstuk,
                  type: 'hoofdstuk',
                  label: `${hoofdstuk.number}. ${hoofdstuk.title}`,
                  counts: {
                    paragrafen: hoofdstukParagrafen.length
                  },
                  children: hoofdstukParagrafen.map((paragraaf) => {
                    const paragraafVragen = vragen.filter((vraag) => vraag.paragraafId === paragraaf.id);
                    const paragraafBlocks = contentBlocks.filter((block) => block.paragraafId === paragraaf.id);

                    return {
                      ...paragraaf,
                      type: 'paragraaf',
                      label: `${paragraaf.code}. ${paragraaf.title}`,
                      counts: {
                        vragen: paragraafVragen.length,
                        blocks: getContentBlockTypeCounts(paragraafBlocks)
                      },
                      children: paragraafVragen.map((vraag) => ({
                        ...vraag,
                        type: 'vraag',
                        label: `Q${vraag.number}: ${vraag.title || 'Naamloze vraag'}`,
                        counts: {},
                        children: []
                      }))
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
