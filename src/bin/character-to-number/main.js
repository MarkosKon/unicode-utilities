const chalk = require("chalk");

const {
  codePointToChar,
  charToCodePoint,
  hexToChar,
  charToHex,
  getHexDigit,
} = require("../../shared/utils");

/**
 * @typedef {Object} CLIArguments
 * @property {string[]} args
 * @property {boolean} reverse
 * @property {boolean} hex
 * @property {boolean} appendUPlus
 * @property {boolean} verbose
 * 
 * @param {CLIArguments} cliArguments 
 */
const main = ({ args, reverse, hex, appendUPlus, verbose }) => {
  args.forEach((arg) => {
    try {
      // codePoint => char
      // or hex => char
      if (reverse) {
        const character = hex
          ? hexToChar(getHexDigit(arg))
          : codePointToChar(Number(arg));

        const output = verbose
          ? `${arg} ${character} ${hex ? "hex=>character" : "code_point=>character"
          }`
          : `${character}`;
        console.log(output);
      } else if (arg.length === 1) {
        // char => hex
        if (hex) {
          const hexDigit = charToHex(arg);
          const formatted = appendUPlus ? `U+${hexDigit}` : hexDigit;

          const output = verbose
            ? `${arg} ${formatted} character=>hex`
            : `${formatted}`;
          console.log(output);
          // char => codePoint
        } else {
          const codePoint = charToCodePoint(arg);
          const output = verbose
            ? `${arg} ${codePoint} character=>code_point`
            : `${codePoint}`;
          console.log(output);
        }
      } else
        console.error(`${chalk.bold.red("Error:")} Invalid character: '${arg}'`);
    } catch (err) {
      if (err instanceof RangeError)
        console.error(`${chalk.bold.red("Error:")} Invalid code point: ${arg}`);
      else console.error(`${chalk.bold.red("Unknown error:")} ${err.message}`);
    }
  });
};

exports.characterToNumber = main;


