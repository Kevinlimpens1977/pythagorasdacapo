const MAX_EXPRESSION_LENGTH = 160;

const normalizeExpression = (expression = '') =>
  String(expression || '')
    .toLowerCase()
    .replace(/,/g, '.')
    .replace(/[\u00d7x]/g, '*')
    .replace(/[:\u00f7]/g, '/')
    .replace(/\u221a/g, 'sqrt');

const tokenize = (expression = '') => {
  const source = normalizeExpression(expression);
  if (source.length > MAX_EXPRESSION_LENGTH) {
    throw new Error('Ongeldige berekening');
  }

  const tokens = [];
  let index = 0;

  while (index < source.length) {
    const char = source[index];

    if (/\s/.test(char)) {
      index += 1;
      continue;
    }

    if (/\d|\./.test(char)) {
      let value = '';
      while (index < source.length && /[\d.]/.test(source[index])) {
        value += source[index];
        index += 1;
      }
      if (!/^\d+(\.\d+)?$|^\.\d+$/.test(value)) {
        throw new Error('Ongeldige berekening');
      }
      tokens.push({ type: 'number', value: Number(value) });
      continue;
    }

    if ('+-*/^()'.includes(char)) {
      tokens.push({ type: char });
      index += 1;
      continue;
    }

    if (source.startsWith('sqrt', index)) {
      tokens.push({ type: 'sqrt' });
      index += 4;
      continue;
    }

    throw new Error('Ongeldige berekening');
  }

  return tokens;
};

export const evaluateCalculatorExpression = (expression = '') => {
  const tokens = tokenize(expression);
  let current = 0;

  const peek = () => tokens[current];
  const consume = (type) => {
    if (peek()?.type !== type) {
      throw new Error('Ongeldige berekening');
    }
    current += 1;
  };

  const parseExpression = () => {
    let value = parseTerm();

    while (peek()?.type === '+' || peek()?.type === '-') {
      const operator = peek().type;
      current += 1;
      const right = parseTerm();
      value = operator === '+' ? value + right : value - right;
    }

    return value;
  };

  const parseTerm = () => {
    let value = parsePower();

    while (peek()?.type === '*' || peek()?.type === '/') {
      const operator = peek().type;
      current += 1;
      const right = parsePower();
      if (operator === '/' && right === 0) {
        throw new Error('Delen door nul kan niet');
      }
      value = operator === '*' ? value * right : value / right;
    }

    return value;
  };

  const parsePower = () => {
    let value = parseUnary();

    while (peek()?.type === '^') {
      current += 1;
      value **= parseUnary();
    }

    return value;
  };

  const parseUnary = () => {
    if (peek()?.type === '+') {
      current += 1;
      return parseUnary();
    }
    if (peek()?.type === '-') {
      current += 1;
      return -parseUnary();
    }
    if (peek()?.type === 'sqrt') {
      current += 1;
      const value = parseUnary();
      if (value < 0) {
        throw new Error('Wortel van negatief getal kan niet');
      }
      return Math.sqrt(value);
    }
    return parsePrimary();
  };

  const parsePrimary = () => {
    const token = peek();

    if (token?.type === 'number') {
      current += 1;
      return token.value;
    }

    if (token?.type === '(') {
      current += 1;
      const value = parseExpression();
      consume(')');
      return value;
    }

    throw new Error('Ongeldige berekening');
  };

  if (!tokens.length) {
    throw new Error('Vul eerst een berekening in');
  }

  const result = parseExpression();
  if (current !== tokens.length || !Number.isFinite(result)) {
    throw new Error('Ongeldige berekening');
  }

  return Math.round(result * 1000000) / 1000000;
};
