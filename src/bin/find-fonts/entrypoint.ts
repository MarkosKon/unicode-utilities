#! /usr/bin/env node
import { Command, Option } from "commander";

import { VERSION } from "../../shared/globals.js";
import { format, PROGRAM_NAME } from "./common.js";
import { findFonts } from "./main.js";
import { CommanderOptions } from "./types.js";

const program = new Command();

program
  .name(PROGRAM_NAME)
  .description("List fonts that support the given Unicode range.")
  .requiredOption(
    "-u, --unicode-ranges <unicode_range...>",
    "The Unicode ranges to search for inside the files or the file db."
  )
  .argument(
    "[font-file...]",
    "The font files you want to check if they support the Unicode range. For faster search, consider creating a database file with the printchars utility (which printchars). For example: 'find DIRECTORY -type f -name *ttf -print0 | xargs -0 printchars --separator = > fonts-db.txt'."
  )
  .addOption(
    new Option(
      "-f, --database-file <file>",
      "The database file that contains (equal sign '=' separated) the font file name, the full font name, and the code points (the code points comma-separated). You get all of these if you run the printchars utility on your font files with printchars --separator '='."
    ).argParser((value) => {
      if (value.length === 0) {
        console.error(format("error", "the database file is an empty string."));
        process.exit(1);
      }
      return value;
    })
  )
  .option(
    "-s, --printchars-field-separator <character>",
    "How to separate the 3 fields that the printchars utility outputs. I use '=' by default to avoid problems with paths that have spaces. It's not important what you choose, but if your paths have spaces, avoid the space as a separator. Also, if you use a database file, make sure that it's the same with the file's separator.",
    "="
  )
  .option(
    "-p, --partial",
    "Returns fonts that partially support the given Unicode ranges.",
    false
  )
  .addOption(
    new Option(
      "-t, --partial-threshold <percentage>",
      "The percentage of the accepted character coverage for the given Unicode ranges. It needs the -p or --partial option for it to work."
    )
      .default(50)
      .argParser((value) => {
        const min = 0;
        const max = 100;
        const defaultValue = 50;
        const percentage = Number.parseInt(value, 10);
        if (Number.isNaN(percentage)) {
          console.warn(
            format(
              "warning",
              `the percentage is not a number. Using the default value of ${defaultValue}.`
            )
          );
          return defaultValue;
        }

        if (percentage < min) {
          console.warn(
            format(
              "warning",
              `the percentage is less than ${min}. Using the default value of ${defaultValue}.`
            )
          );
          return defaultValue;
        }

        if (percentage > max) {
          console.warn(
            format(
              "warning",
              `the percentage is greater than ${max}. Using the default value of ${defaultValue}.`
            )
          );
          return max;
        }

        return percentage;
      })
  )
  .option("-V, --verbose", "Print extra information.", false)
  .helpOption("-h, --help", "Show this help menu.")
  .addHelpText(
    "afterAll",
    `\nExamples:
  1) ${PROGRAM_NAME} -f file-db.txt -u U+AA-FF
    Prints which fonts from the file db support the given Unicode ranges.

  2) ${PROGRAM_NAME} -pt 60 -f file-db.txt -u U+00-FF
    Prints the fonts that cover at least 60% of the characters for the given Unicode range.

  3) find DIRECTORY -type f -name "*ttf" -print0 | xargs -0 ${PROGRAM_NAME} -u U+41-5A 61-7A U+AA-FF --
    Prints which of the font files support the given Unicode ranges. Use -- after the -u option to denote the end of the Unicode ranges. This is because we have two arguments that are variable in size: the Unicode ranges and the fonts files. The -u option should be last.

  4) ${PROGRAM_NAME} -u U+41-5A 61-7A U+AA-FF -- DIRECTORY/*ttf
    Same as above but without the find command.

  5) ${PROGRAM_NAME} -u $(c2n --hex '&') -- fonts/*woff*
    Find which of the given fonts files have the & character. You do that with the character to number utility with command substitution.

  6) ${PROGRAM_NAME} -u $(c2n --hex '&' ä ß б ») -- fonts/*woff*
    Same as above but for more characters.

Made by Markos Konstantopoulos (https://markoskon.com).
For bugs and feature requests, please open an issue at https://github.com/MarkosKon/unicode-utilities/issues.
`
  )
  .version(VERSION, "-v, --version", "Show the version number.")
  .action((fontFiles: string[], options: CommanderOptions) => {
    findFonts({ fontFiles, ...options });
  })
  .configureOutput({
    outputError: (string, write) => {
      write(format("error", string.replace("error: ", "")));
    },
  })
  .parse();
