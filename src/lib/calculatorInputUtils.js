export const ROOT_SYMBOL = '√';
export const SQUARED_SYMBOL = '²';

export const formatCalculatorInput = (value = '') => (
  String(value || '')
    .replace(/sqrt\s*/giu, ROOT_SYMBOL)
    .replace(/wortel\s*/giu, ROOT_SYMBOL)
    .replace(/\^2/gu, SQUARED_SYMBOL)
);

export const appendCalculatorInput = (current = '', value = '') => {
  const normalizedValue = formatCalculatorInput(value);
  const currentValue = String(current || '');

  if (!currentValue || currentValue === '0' || currentValue === 'Ongeldig') {
    return normalizedValue;
  }

  return `${currentValue}${normalizedValue}`;
};

export const normalizeCalculatorKeyboardValue = (value = '') => (
  formatCalculatorInput(value)
    .replace(/[×]/gu, 'x')
    .replace(/[÷]/gu, ':')
);
