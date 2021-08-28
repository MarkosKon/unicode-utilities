const chalk = require("chalk");

/** @param {string} hex */
const hexToDecimal = (hex) => Number.parseInt(hex, 16);
/** @param {number} decimal */
const decimalToHex = (decimal) => decimal.toString(16);
/** @param {string} char */
const charToCodePoint = (char) => char.codePointAt();
/** @param {number} codePoint */
const codePointToChar = (codePoint) => String.fromCodePoint(codePoint);

/** @param {string} hex */
const hexToChar = (hex) => codePointToChar(hexToDecimal(hex));
/** @param {string} char */
const charToHex = (char) => decimalToHex(charToCodePoint(char));

/** @param {string} str */
const getHexDigit = (str) => {
  const hexRegExp = /^(U\+)?(?<hexDigit>[A-Fa-f0-9]+)$/i;

  const match = str.match(hexRegExp);
  if (!match) throw new Error(`${chalk.red.bold("Error:")} Invalid hex number: ${str}`);

  return match.groups.hexDigit;
};

/** 
 * @todo Type decimal range return.
 * @param {string} str
 */
const toDecimalRange = (str) => {
  const rangeRegExp = /^(U\+)?(?<firstHexDigit>[0-9A-Fa-f]+)(\-(?<secondHexDigit>[0-9A-Fa-f]+))?$/i;
  const rangeMatch = str.trim().match(rangeRegExp);

  if (!rangeMatch) return false;

  const { firstHexDigit, secondHexDigit } = rangeMatch.groups;
  const firstDigit = hexToDecimal(firstHexDigit);
  const secondDigit = hexToDecimal(secondHexDigit);

  if (secondDigit && firstDigit >= secondDigit) return false;

  return secondDigit ? { firstDigit, secondDigit } : { firstDigit };
};

/** 
 * @todo Type decimal range. If you can, take it from toDecimalRange.
 * @param {number[]} result
 * @param {any[]} decimalRange
 */
const calculateNumberSet = (result, decimalRange) => {
  if (!decimalRange.secondDigit) return result.concat(decimalRange.firstDigit);

  const arrayLength = decimalRange.secondDigit - decimalRange.firstDigit + 1;
  const numberArray = new Array(arrayLength)
    .fill(1)
    .map((one, i) => decimalRange.firstDigit + one * i);
  return result.concat(numberArray);
};

module.exports = {
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
