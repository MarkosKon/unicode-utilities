#! /usr/bin/env node

import { Command } from "commander";

import { characterToNumber } from "./main.js";
import { VERSION } from "../../shared/globals.js";
import { format, PROGRAM_NAME } from "./common.js";
import { CommanderOptions } from "./types.js";

// TODO .js extension
// TODO import package.json
// throw instead of process.exit(1) outside entry points?
// TODO: Needs tests to check for edge cases, for example, non-printable character conversion.

const program = new Command();

program
  .name(PROGRAM_NAME)
  .description(
    "Returns the code points of the one-length characters you provide (<args..>). See the options or the examples if you want different output."
  )
  .argument(
    "<args...>",
    "The characters you provide to the program. If you use the -r or --reverse option you instead provide code points (and you get characters). With the -x option, the numbers are not decimal code points but hexadecimal Unicode codes."
  )
  .option(
    "-r, --reverse",
    "Get the characters from the code points instead.",
    false
  )
  .option(
    "-x, --hex",
    "The numbers will be hexadecimal instead of decimal.",
    false
  )
  .option(
    // TODO implies h.
    "-a, --append-plus",
    'Append "U+" before the hexadecimal numbers.',
    false
  )
  .option(
    "-V, --verbose",
    "Include extra info about the conversion in each line.",
    false
  )
  .helpOption("-h, --help", "Show this help menu.")
  .version(VERSION, "-v, --version", "Show the version number.")
  .addHelpText(
    "afterAll",
    `\nExamples:
  1) ${PROGRAM_NAME} {a..z}
    Character to number conversion. Outputs the code points of the characters from a to z.

  2) ${PROGRAM_NAME} -x {a..z}
    Character to hex number conversion. With the -a flag it will also append U+ before the hex number.

  3) ${PROGRAM_NAME} -r {65..75}
    Number (code point) to character conversion.

  4) ${PROGRAM_NAME} -rx e4 e5 u+e6 U+B2
    Hex number to character conversion. The hex numbers can also start with U+.

Made by Markos Konstantopoulos (https://markoskon.com).
For bugs and feature requests, please open an issue at https://github.com/MarkosKon/unicode-utilities/issues.
`
  )
  .action((args: string[], options: CommanderOptions) => {
    characterToNumber({ args, ...options });
  })
  .configureOutput({
    outputError: (string, write) => {
      write(format("error", string.replace("error: ", "")));
    },
  })
  .parse();
