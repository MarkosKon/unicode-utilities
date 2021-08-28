#! /usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const { characterToNumber } = require("./main")

yargs(hideBin(process.argv))
    .scriptName("c2n")
    .command({
        command: "$0 [options] <args..>",
        description:
            "Returns the code points of the one-length characters you provide (<args..>). See the options or the examples if you want different output.",
        builder: (yargs) => {
            return yargs
                .positional("args", {
                    describe:
                        "The characters you provide to the program. If you use the -r or --reverse option you instead provide code points (and you get characters). With the -h option, the numbers are not decimal code points but hexadecimal Unicode codes.",
                    type: "string",
                    // required: "Something better from the default? ==> Not enough non-option arguments: got 0, need at least 1",
                })
                .example(
                    "$0 {a..z}",
                    "Character to number conversion. Outputs the code points of the characters from a to z."
                )
                .example(
                    "$0 -h {a..z}",
                    "Character to hex number conversion. With the -a flag it will also append U+ before the hex number."
                )
                .example(
                    "$0 -r {65..75}",
                    "Number (code point) to character conversion."
                )
                .example(
                    "$0 -rh e4 e5 u+e6 U+B2",
                    "Hex number to character conversion. The hex numbers can also start with U+."
                )
                .epilog(
                    `Made by Markos Konstantopoulos https://markoskon.com. TODO: Needs tests to check for edge cases, for example, non-printable character conversion.`
                );
        },
        handler: (argv) => characterToNumber(argv),
    })
    .option("r", {
        alias: "reverse",
        description: "Get the characters from the code points instead.",
        type: "boolean",
        default: false,
    })
    .option("h", {
        alias: "hex",
        description: "The numbers will be hexadecimal instead of decimal.",
        type: "boolean",
        default: false,
    })
    .option("a", {
        alias: "append-u-plus",
        description: 'Append "U+" before the hexadecimal numbers.',
        type: "boolean",
        default: false,
        implies: "h",
    })
    .option("v", {
        alias: "verbose",
        description: "Include extra info about the conversion in each line.",
        type: "boolean",
        default: false,
    })
    .describe("help", "Show help.")
    .describe("version", "Show version number.").argv;