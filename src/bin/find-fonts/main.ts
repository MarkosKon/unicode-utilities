import fs from "node:fs";
import url from "node:url";
import readline from "node:readline";
import path from "node:path";
import cp from "node:child_process";
import {
  difference,
  intersection as lodashIntersection,
  chunk,
} from "lodash-es";
import chalk from "chalk";

import { toDecimalRange, calculateNumberSet } from "../../shared/utils.js";

/**
 * Flattens the hex ranges from the args, in case an arg
 * contains multiple hex ranges comma-separated (this is
 * something the program can handle).
 */
const flattenHexRanges = (flattenedRanges: string[], range: string) => {
  if (!range) return flattenedRanges;

  return flattenedRanges.concat(range.toString().split(","));
};

const toFontDBEntries =
  (verbose: boolean, printcharsFieldSeparator: string) =>
  (line: string): EmptyObject | FontDBEntry => {
    // TODO The result are slightly different when you don't trim the line.
    const lineItems = line.trim().split(printcharsFieldSeparator);

    if (lineItems.length !== 3) {
      console.error(
        `${chalk.yellow(
          "Warning:"
        )} Not a valid line from printchars utility. The program is expecting 3 fields per line and the fields are ${
          lineItems.length
        } with '${printcharsFieldSeparator}' as field separator. If you used a file database, try re-creating the db with: "printchars --separator ="${
          verbose
            ? `. The line is: ${lineItems.toString()}`
            : ". Use --verbose for more details."
        }`
      );
      return {};
    }

    const stringNumberSet = lineItems[lineItems.length - 1];

    return {
      fontFile: lineItems[0],
      fontFullName: lineItems[1],
      numberSet: stringNumberSet.split(",").map(Number),
    };
  };

/**
 * Returns the entries in the file db that have an 100% match
 * with the user set. In other words, if the user set doesn't
 * have any unique numbers, then it's a subset of the current
 * font set.
 */
const isSubset =
  (userSet: number[]) => (fontEntry: EmptyObject | FontDBEntry) => {
    const userSetUnique = difference(userSet, fontEntry.numberSet);

    if (userSetUnique.length === 0) return true;
    return false;
  };

const printItems = (item: string) => {
  console.log(item);
};

const main = ({
  fontFiles,
  databaseFile,
  printcharsFieldSeparator,
  verbose,
  partial,
  partialThreshold,
  unicodeRanges: rangeArguments,
}: FindFontsInput) => {
  if (verbose)
    console.error({
      state: {
        fontFiles,
        databaseFile,
        printcharsFieldSeparator,
        verbose,
        partial,
        partialThreshold,
        unicodeRanges: rangeArguments,
      },
    });

  if (databaseFile === undefined && fontFiles.length === 0) {
    console.error(
      `${chalk.bold.red(
        "Error:"
      )} Provide some files or a file database (with the -f option) to search. If you provided files but you're still getting this error, add -- at the end of the options, just before the files.`
    );

    process.exit(1);
  }

  const handleError = (error: Error) => {
    console.error(`\n${chalk.bold.red("Error:")} ${error.message}\n`);
    process.exit(1);
  };

  const calcPartiallySupported =
    (userSet: number[]) =>
    (result: string[], fontEntry: EmptyObject | FontDBEntry) => {
      const intersection = lodashIntersection(fontEntry.numberSet, userSet);
      if (intersection.length === 0) return result;

      const supportPercentage = Math.round(
        (intersection.length / userSet.length) * 100
      );
      if (supportPercentage < partialThreshold) return result;

      const { fontFullName, fontFile } = fontEntry;
      return result.concat(
        `${chalk.green(fontFullName)} ${chalk.yellow(
          `${supportPercentage}%`
        )} ${fontFile}`
      );
    };

  const getResults = (line: string, userSet: number[]) => {
    const lines = line.split(/\r?\n/);
    const fontDB = lines.map(
      toFontDBEntries(verbose, printcharsFieldSeparator)
    );

    if (partial) {
      const calcUserSetPartiallySupported = calcPartiallySupported(userSet);
      return fontDB.reduce(calcUserSetPartiallySupported, []);
    }
    const isSubsetOfUserSet = isSubset(userSet);
    return fontDB
      .filter(isSubsetOfUserSet)
      .map((item) => `${chalk.green(item.fontFullName)} ${item.fontFile} `);
  };

  try {
    const hexRanges = rangeArguments.reduce(flattenHexRanges, []);
    const decimalRanges = hexRanges.map(toDecimalRange);
    const sortedNumbers = decimalRanges
      .reduce(calculateNumberSet, [])
      .sort((a, b) => a - b);
    const numberSet = Array.from(new Set(sortedNumbers));

    if (fontFiles.length === 0 && databaseFile !== undefined) {
      const readStream = fs.createReadStream(databaseFile, {
        encoding: "utf8",
      });

      // TODO Better type for Error?
      readStream.on("error", (error: Error & { code: string }) => {
        if (error.code === "ENOENT") {
          console.error(
            `\n${chalk.bold.red(
              "Error:"
            )} Cannot open the database file '${databaseFile}'. \n`
          );
        } else console.error(`Unexpected ReadStream error: ${error.message}`);

        process.exit(1);
      });

      readline.createInterface({ input: readStream }).on("line", (line) => {
        const results = getResults(line, numberSet);
        results.forEach(printItems);
      });
    } else {
      if (databaseFile !== undefined) {
        console.warn(
          `${chalk.yellow(
            "Warning:"
          )} Ignoring database file (${databaseFile}) because you provided font files.`
        );
      }
      /**
       * - I chuck the files because you can't pass very large arrays of arguments
       *   to cp.spawn.
       * - Also, keep in mind, that if the file args are in the thousands, xargs
       *   will call the program multiple times with an arg count at around 500.
       */
      chunk(fontFiles, 100).forEach((fontFilesChunk) => {
        const filePaths = fontFilesChunk.map((filePath) =>
          path.resolve(filePath)
        );

        const printCharsBinary = path.resolve(
          path.dirname(url.fileURLToPath(import.meta.url)),
          "../../../src/bin/print_chars.py"
        );

        const printChars = cp.spawn("python", [
          printCharsBinary,
          "--separator",
          printcharsFieldSeparator,
          ...filePaths,
        ]);

        readline
          .createInterface({ input: printChars.stdout })
          .on("line", (line) => {
            const results = getResults(line, numberSet);
            results.forEach(printItems);
          });

        printChars.stderr.on("data", (data) => {
          console.error(
            `\n${chalk.bold.red("printchars error:")} ${String(data)}`
          );
        });
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      handleError(error);
    }
  }
};

export { main as findFonts };
