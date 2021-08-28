#! /usr/bin/env node

const chalk = require("chalk");

const { toDecimalRange, calculateNumberSet } = require("../shared/utils");

/** 
 * @todo Type ranges. If you can, take it from toDecimalRange
 * because that's where it comes from.
 * @param {any[]} ranges
 */
const areRangesInOrder = (ranges) => {

  /** @param {number} currentIndex */
  const areRangesInOrderInner = (currentIndex) => {
    if (currentIndex === ranges.length) return true;

    const prev = ranges[currentIndex - 1];
    const current = ranges[currentIndex];

    const prevDigitToCheck = prev.secondDigit || prev.firstDigit;

    if (prevDigitToCheck < current.firstDigit)
      return areRangesInOrderInner(currentIndex + 1);
    else return false;
  };

  return areRangesInOrderInner(1);
};

const showHelp = () => {
  console.log(`${chalk.bold("USAGE:")} ur2n <unicode_range> [unicode_range..] [-h | --help | help]

Unicode range to number. Prints the code points for the given 
unicode ranges. More  specifically, for each unicode range you
provide, it prints in a new line: the unicode range (echoes it), 
a space, and the sorted code points for that range, comma-separated.

${chalk.bold("POSITIONALS:")}
  unicode_range:           See the examples for accepted unicode 
                           ranges. For complex ranges (wrapped in
                           quotes), the sub-ranges must be in order.
                           For example, this is ${chalk.italic("not")} valid: 
                           ur2n "aa-ff 00-ff", but this ${chalk.italic("is")} valid:
                           ur2n aa-ff 00-ff.

${chalk.bold("OPTIONS:")}
  -h, --help, help         Show help.   [boolean]

${chalk.bold("EXAMPLES:")}
  ur2n AA                  Prints the code points for a single 
                           character unicode range.  
  ur2n AA-FF               Prints the code points for a unicode range.
  ur2n aa-ff               Prints the code points for a lower-case 
                           unicode range.
  ur2n U+AA-FF             Prints the code points for a unicode range 
                           with a U+ prefix.
  ur2n "U+AA-FF, 400-500"  Prints the code points for a complex range.
  ur2n U+AA-FF, 400-500    Prints the code points for multiple ranges.
  ur2n U+AA-FF 400-500     Prints the code points for multiple ranges.

Made by Markos Konstantopoulos https://markoskon.com. For bugs and new
features, please open an issue at TODO.
`)
}

const args = process.argv.slice(2);

if (args.find(arg => ["-h", "--help", "help"].includes(arg))) {
  showHelp();
  process.exit(0);
};

if (args.length === 0) {
  console.error(`ur2n ${chalk.red("(error): ")} Please provide a unicode range.`);
  process.exit(1);
}

args.forEach((arg) => {
  const decimalRange = arg.split(",").map(toDecimalRange).filter(Boolean);

  const inputNoSpaces = arg
    .split(",")
    .filter(Boolean)
    .map((item) => item.trim())
    .join(",");

  if (decimalRange.length > 0) {
    const rangesInOrder =
      decimalRange.length === 1 || areRangesInOrder(decimalRange);

    if (rangesInOrder) {
      const numbers = decimalRange.reduce(calculateNumberSet, []);

      console.log(`${inputNoSpaces} ${numbers}`);
      return;
    }
  }

  console.error(`ur2n ${chalk.red("(error):")} Invalid unicode range: ${inputNoSpaces}`);
  process.exit(1);
});
