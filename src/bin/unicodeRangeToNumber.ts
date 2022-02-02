#! /usr/bin/env node

import chalk from "chalk";
import { formatOutput } from "../shared/formatOutput.js";

import { toDecimalRange, calculateNumberSet } from "../shared/utils.js";

const PROGRAM_NAME = "ur2n";
const format = formatOutput(PROGRAM_NAME);

const areRangesInOrder = (ranges: DecimalRange[]) => {
  const areRangesInOrderInner = (currentIndex: number): boolean => {
    if (currentIndex === ranges.length) return true;

    const previous = ranges[currentIndex - 1];
    const current = ranges[currentIndex];

    const previousDigitToCheck =
      previous.secondDigit !== undefined || previous.firstDigit;

    if (previousDigitToCheck < current.firstDigit)
      return areRangesInOrderInner(currentIndex + 1);
    return false;
  };

  return areRangesInOrderInner(1);
};

const showHelp = () => {
  console.log(`${chalk.bold(
    "USAGE:"
  )} ${PROGRAM_NAME} <unicode_range> [unicode_range..] [-h | --help | help]

Unicode range to number. Prints the code points for the given
unicode ranges. More  specifically, for each unicode range you
provide, it prints in a new line: the unicode range (echoes it),
a space, and the sorted code points for that range, comma-separated.

${chalk.bold("POSITIONALS:")}
  unicode_range:           See the examples for accepted unicode
                           ranges. For complex ranges (wrapped in
                           quotes), the sub-ranges must be in order.
                           For example, this is ${chalk.italic("not")} valid:
                           ${PROGRAM_NAME} "aa-ff 00-ff", but this ${chalk.italic(
    "is"
  )} valid:
                           ${PROGRAM_NAME} aa-ff 00-ff.

${chalk.bold("OPTIONS:")}
  -h, --help, help         Show help.   [boolean]

${chalk.bold("EXAMPLES:")}
  ${PROGRAM_NAME} AA                  Prints the code points for a single
                           character unicode range.
  ${PROGRAM_NAME} AA-FF               Prints the code points for a unicode range.
  ${PROGRAM_NAME} aa-ff               Prints the code points for a lower-case
                           unicode range.
  ${PROGRAM_NAME} U+AA-FF             Prints the code points for a unicode range
                           with a U+ prefix.
  ${PROGRAM_NAME} "U+AA-FF, 400-500"  Prints the code points for a complex range.
  ${PROGRAM_NAME} U+AA-FF, 400-500    (todo) Prints the code points for multiple ranges.
  ${PROGRAM_NAME} U+AA-FF 400-500     Prints the code points for multiple ranges.

Made by Markos Konstantopoulos https://markoskon.com. For bugs and new
features, please open an issue at https://github.com/MarkosKon/unicode-utilities/issues.
`);
};

const cliArguments = process.argv.slice(2);

if (
  cliArguments.some((argument) => ["-h", "--help", "help"].includes(argument))
) {
  showHelp();
  process.exit(0);
}

if (cliArguments.length === 0) {
  console.error(format("error", "please provide a unicode range."));
  process.exit(1);
}

cliArguments.forEach((argument) => {
  try {
    const decimalRange = argument.split(",").map(toDecimalRange);

    const inputNoSpaces = argument
      .split(",")
      .filter(Boolean)
      .map((item) => item.trim())
      .join(",");

    if (decimalRange.length > 0) {
      const rangesInOrder =
        decimalRange.length === 1 || areRangesInOrder(decimalRange);

      if (rangesInOrder) {
        const numbers = decimalRange.reduce(calculateNumberSet, []);

        console.log(`${inputNoSpaces} ${numbers.toString()}`);
      }
    }
  } catch (error) {
    process.exitCode = 1;
    if (error instanceof Error) {
      console.error(format("error", error.message));
    } else console.error(format("unknown error", String(error)));
  }
});
