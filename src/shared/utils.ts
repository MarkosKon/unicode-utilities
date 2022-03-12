const hexToDecimal = (hex: string) => Number.parseInt(hex, 16);
const decimalToHex = (decimal: number) => decimal.toString(16);
const charToCodePoint = (char: string) => {
  const codePoint = char.codePointAt(0);
  if (codePoint === undefined)
    throw new Error(`Could not get the code point for char '${char}'.`);
  return codePoint;
};
const codePointToChar = (codePoint: number) => String.fromCodePoint(codePoint);

const hexToChar = (hex: string) => codePointToChar(hexToDecimal(hex));
const charToHex = (char: string) => decimalToHex(charToCodePoint(char));

const getHexDigit = (string: string) => {
  const hexRegExp = /^(u\+)?(?<hexDigit>[\da-f]+)$/i;

  const match = string.match(hexRegExp);
  if (!match || !match.groups) throw new Error(`Invalid hex number: ${string}`);

  return match.groups.hexDigit;
};

const toDecimalRange = (string: string): DecimalRange => {
  const rangeRegExp =
    /^(u\+)?(?<firstHexDigit>[\da-f]+)(-(?<secondHexDigit>[\da-f]+))?$/i;
  const rangeMatch = string.trim().match(rangeRegExp);

  if (!rangeMatch || !rangeMatch.groups) {
    throw new Error(`Invalid unicode range: ${string}`);
  }

  const { firstHexDigit, secondHexDigit } = rangeMatch.groups;
  const firstDigit = hexToDecimal(firstHexDigit);
  const secondDigit = hexToDecimal(secondHexDigit);

  // secondHexDigit can be undefined (due to ? in the regexp).
  const secondDigitIsNumber = !Number.isNaN(secondDigit);

  if (secondDigitIsNumber && firstDigit >= secondDigit) {
    throw new Error(
      `Invalid decimal range: ${string}. First digit (${firstHexDigit}) is greater or equal to second digit (${secondHexDigit}).`
    );
  }

  return secondDigitIsNumber ? { firstDigit, secondDigit } : { firstDigit };
};

const calculateNumberSet = (result: number[], decimalRange: DecimalRange) => {
  if (decimalRange.secondDigit === undefined) {
    return result.concat(decimalRange.firstDigit);
  }

  const arrayLength = decimalRange.secondDigit - decimalRange.firstDigit + 1;
  const numberArray = Array.from<number>({ length: arrayLength })
    .fill(1)
    .map((one, index) => decimalRange.firstDigit + one * index);
  return result.concat(numberArray);
};

export {
  hexToDecimal,
  decimalToHex,
  charToCodePoint,
  codePointToChar,
  hexToChar,
  charToHex,
  getHexDigit,
  toDecimalRange,
  calculateNumberSet,
};
