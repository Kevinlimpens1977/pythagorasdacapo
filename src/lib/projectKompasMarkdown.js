export const slugifyHeading = (text = '') => {
  const base = String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/`/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return base || 'sectie';
};

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const renderInlineMarkdown = (value = '') => {
  const escaped = escapeHtml(value);
  return escaped.replace(/`([^`]+)`/g, '<code>$1</code>');
};

export const buildProjectKompasToc = (markdown = '') => {
  const usedIds = new Map();

  return String(markdown)
    .split(/\r?\n/)
    .map((line) => line.match(/^(#{1,3})\s+(.+)$/))
    .filter(Boolean)
    .map((match) => {
      const level = match[1].length;
      const title = match[2].trim();
      const baseId = slugifyHeading(title);
      const count = usedIds.get(baseId) || 0;
      usedIds.set(baseId, count + 1);

      return {
        id: count === 0 ? baseId : `${baseId}-${count + 1}`,
        level,
        title
      };
    });
};

export const renderProjectKompasMarkdown = (markdown = '') => {
  const toc = buildProjectKompasToc(markdown);
  const headingIds = [...toc];
  const html = [];
  let inCodeBlock = false;
  let codeLines = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      html.push('</ul>');
      inList = false;
    }
  };

  const closeCodeBlock = () => {
    if (inCodeBlock) {
      html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
      inCodeBlock = false;
      codeLines = [];
    }
  };

  String(markdown).split(/\r?\n/).forEach((line) => {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        closeCodeBlock();
      } else {
        closeList();
        inCodeBlock = true;
        codeLines = [];
      }
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      closeList();
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();
      const heading = headingIds.shift();
      html.push(`<h${level} id="${heading?.id || slugifyHeading(title)}">${renderInlineMarkdown(title)}</h${level}>`);
      return;
    }

    const listMatch = line.match(/^\s*-\s+(.+)$/);
    if (listMatch) {
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push(`<li>${renderInlineMarkdown(listMatch[1])}</li>`);
      return;
    }

    if (!line.trim()) {
      closeList();
      return;
    }

    closeList();
    html.push(`<p>${renderInlineMarkdown(line.trim())}</p>`);
  });

  closeList();
  closeCodeBlock();

  return {
    toc,
    html: html.join('\n')
  };
};

export const formatProjectKompasUpdatedAt = (isoValue, locale = 'nl-NL') => {
  const date = new Date(isoValue);
  if (Number.isNaN(date.getTime())) return 'Onbekend';

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
};
