#! /usr/bin/env node

const path = require("path");

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const lodash = require("lodash");
const chalk = require("chalk");

const { findFonts } = require('./main');

yargs(hideBin(process.argv))
  .scriptName("ff")
  .command({
    command: "$0 [options] [font_file..]",
    // command: "$0 [options] -u <unicode_ranges> [font_file..]",
    description:
      "List fonts that support the given unicode range.",
    builder: (yargs) => {
      return yargs
        .positional("font-files", {
          describe: "The font files you want to check if they support the unicode range. Tip: for faster search, consider creating a file database with: 'find DIRECTORY -type f -name *ttf -print0 | xargs -0 printchars --separator = > fonts-db.txt'.",
          type: "string",
        })
        .example(
          "$0 -f file-db.txt -u U+AA-FF",
          `Prints which fonts from the file db support the given unicode ranges.`
        )
        .example(
          "$0 -pt 60 -f file-db.txt -u U+00-FF",
          "Prints the fonts that cover at least 60% of the characters for the given unicode range."
        )
        .example(
          'find DIRECTORY -type f -name "*ttf" -print0 | xargs -0 $0 -u U+41-5A 61-7A U+AA-FF --',
          "Prints which of the font files support the given unicode ranges. Use -- after the -u option to denote the end of the unicode ranges. This is because we have two arguments that are variable in size: the unicode ranges and the fonts files. The -u option should be last."
        )
        .example(
          "$0 -u U+41-5A 61-7A U+AA-FF -- DIRECTORY/*ttf",
          "Same as above but without the find command."
        )
        .example(
          "$0 -u $(c2n --hex '&') -- fonts/*woff*",
          "Find which of the given fonts files have the & character. You do that with the character to number utility with command substitution."
        )
        .example(
          "$0 -u $(c2n -h '&' ä ß б ») -- fonts/*woff*",
          "Same as above but for more characters."
        )
        .epilog(
          `Made by Markos Konstantopoulos https://markoskon.com. For bugs and features requests, please open an issue at https://github.com/MarkosKon/unicode-utilities/issues.`
        );
    },
    handler: (argv) => findFonts(argv),
  })
  .check((argv /*, options */) => {
    const { partialThreshold } = argv;

    // yargs, plz: https://github.com/yargs/yargs/issues/1079
    if (lodash.isNaN(partialThreshold)) {
      throw new Error(
        "The -t or --partial-threshold option is not a number. Check if you used previously and didn't remove the option."
      );
    }
    return true;
  })
  .option("database-file", {
    alias: "f",
    // default: path.resolve(__dirname, "../../../google-fonts-characters.txt"),
    describe:
      "The database file that contains (equal sign '=' separated) the font file name, the full font name, and the code points (the code points comma-separated). You get all of these if you run the printchars utility on your font files with printchars --separator '='.",
    type: "string",
  })
  .option("printchars-field-separator", {
    alias: "s",
    default: "=",
    describe: "How to separate the 3 fields that the printchars utility outputs. I use '=' by default to avoid problems with paths that have spaces. It's not important what you choose, but if your paths have spaces, avoid the space as a separator. Also, if you use a database file, make sure that it's the same with the file's separator.",
    type: "string",
  })
  .option("partial", {
    alias: "p",
    describe: "Returns fonts that partially support the given unicode ranges.",
    type: "boolean",
    default: false,
  })
  .option("partial-threshold", {
    alias: "t",
    describe:
      "The percentage of the accepted character coverage for the given unicode ranges. It needs the -p or --partial option for it to work.",
    type: "number",
    // implies: "p",
    default: 50,
  })
  .option("unicode-ranges", {
    alias: "u",
    describe: "The unicode ranges to search for inside the files or the file db.",
    demandOption:
      "The unicode ranges are required. Pass them with -u or --unicode-ranges.",
    type: "array",
  })
  .option("verbose", {
    alias: "V",
    describe: "Print extra information.",
    type: "boolean",
  })
  .describe("help", "Show help.")
  .describe("version", "Show version number.").argv;

