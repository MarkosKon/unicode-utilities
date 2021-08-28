const fs = require("fs");
const readline = require("readline");
// const fs_promises = require("fs/promises");
const path = require("path");
const cp = require("child_process");

const R = require("ramda");
const lodash = require("lodash");
const chalk = require("chalk");

const { toDecimalRange, calculateNumberSet } = require("../../shared/utils");

/**
  * Flattens the hex ranges from the args, in case an arg
  * contains multiple hex ranges comma-separated (this is
  * something the program can handle).
  */
const flattenHexRanges = (flattenedRanges, range) => {
  if (!range) return flattenedRanges;

  return flattenedRanges.concat(range.toString().split(","));
};

const toFontDBEntries = (verbose, printcharsFieldSeparator) =>
  /**
    * Lines to font DB Entries
    * @param line
    * @returns A line from the font db splitted in spaces.
    */
  (line) => {
    // TODO The result are slightly different when you don't trim the line.
    const lineItems = line.trim().split(printcharsFieldSeparator);

    if (lineItems.length !== 3) {

      console.error(`${chalk.yellow("Warning:")} Not a valid line from printchars utility. The program is expecting 3 fields per line and the fields are ${lineItems.length} with '${printcharsFieldSeparator}' as field separator. If you used a file database, try re-creating the db with: 'printchars --separator ='${verbose ? `. The line is: ${lineItems}` : ". Use --verbose for more details."}`);
      return {};
    }

    const stringNumberSet = lineItems[lineItems.length - 1];
    // old line
    // if (!stringNumberSet) return [lineItems[0]];

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
   * @param userSet
   * @returns
   */
const isSubset = (userSet) => (fontEntry) => {
  const userSetUnique = lodash.difference(userSet, fontEntry.numberSet);

  if (userSetUnique.length === 0) return true;
  return false;
};

/**
 * @param {String} item
 * @returns {void}
 */
const printItems = (item) => {
  console.log(item);
};

const main = async ({
  _: fontFiles,
  databaseFile,
  printcharsFieldSeparator,
  verbose,
  partial,
  partialThreshold,
  unicodeRanges: rangeArgs,
  // ...rest
}) => {

  if (verbose)
    console.error({
      state: {
        fontFiles,
        databaseFile,
        printcharsFieldSeparator,
        verbose,
        partial,
        partialThreshold,
        unicodeRanges: rangeArgs,
      }
    });

  if (!databaseFile && fontFiles.length === 0) {
    console.error(`${chalk.bold.red("Error:")} Provide some files or a file database (with the -f option) to search. If you provided files but you're still getting this error, add -- at the end of the options, just before the files.`);
    process.exit(1);
  }

  const handleError = (error) => {
    if (error.code === "ENOENT")
      console.error(`\n${chalk.bold.red("Error:")} Cannot open the database file '${databaseFile}'. \n`);
    else
      console.error(`\n${chalk.bold.red("Error:")} ${error.message}\n`);

    process.exit(1)
  }

  const calcPartiallySupported = (userSet) => (result, fontEntry) => {
    const intersection = lodash.intersection(fontEntry.numberSet, userSet);
    if (intersection.length === 0) return result;

    const supportPercentage = Math.round(
      (intersection.length / userSet.length) * 100
    );
    if (supportPercentage < partialThreshold) return result;

    const { fontFullName, fontFile } = fontEntry;
    return result.concat(`${chalk.green(fontFullName)} ${chalk.yellow(supportPercentage + "%")} ${fontFile}`);
  };

  // TODO It's not data anymore, it's a line.
  const getResults = (data, userSet) => {
    const lines = data.split(/\r?\n/);
    const fontDB = lines.map(toFontDBEntries(verbose, printcharsFieldSeparator));

    if (partial) {
      const calcUserSetPartiallySupported = calcPartiallySupported(userSet);
      return fontDB.reduce(calcUserSetPartiallySupported, []);
    } else {
      const isSubsetOfUserSet = isSubset(userSet);
      return fontDB
        .filter(isSubsetOfUserSet)
        .map((item) => `${chalk.green(item.fontFullName)} ${item.fontFile} `);
    }
  };


  try {
    const hexRanges = rangeArgs.reduce(flattenHexRanges, []);
    const decimalRanges = hexRanges.map(toDecimalRange);
    const sortedNumbers = decimalRanges
      .reduce(calculateNumberSet, [])
      .sort(R.subtract);
    const numberSet = Array.from(new Set(sortedNumbers));

    // TODO Use ramda transducer.
    // const calcNumberSetTr = R.transduce(
    //   R.map(R.identity),
    //   calculateNumberSet,
    //   []
    // );
    // const tr = R.compose(calcNumberSetTr, R.map(toDecimalRange));
    // const numberSet = R.uniq(R.transduce(tr, flattenHexRanges, [], rangeArgs));

    // const sortedNumbers = decimalRanges.reduce(calculateNumberSet, []).sort();
    // const numbersFTR = R.sort(R.subtract, calcNumberSetTr(decimalRanges));

    if (fontFiles.length == 0) {
      const readStream = fs.createReadStream(databaseFile, { encoding: "utf8" });

      readline
        .createInterface({ input: readStream })
        .on('line', line => {
          const results = getResults(line, numberSet);
          results.forEach(printItems);
        });

      readStream.on("error", (error) => {
        handleError(error);
      })

    } else {
      /**
       * - I chuck the files because you can't pass very large arrays of arguments
       *   to cp.spawn.
       * - Also, keep in mind, that if the file args are in the thousands, xargs
       *   will call the program multiple times with an arg count at around 500.
       */
      lodash.chunk(fontFiles, 100).forEach((fontFilesChunk) => {
        const filePaths = fontFilesChunk.map((filePath) =>
          path.resolve(filePath)
        );

        const printCharsBinary = path.resolve(__dirname, "../print_chars.py");

        const printChars = cp.spawn(
          "python",
          [
            printCharsBinary,
            "--separator",
            printcharsFieldSeparator,
            ...filePaths
          ],
          { encoding: "utf8", }
        );

        readline
          .createInterface({ input: printChars.stdout })
          .on('line', line => {
            const results = getResults(line, numberSet);
            results.forEach(printItems);
          });

        printChars.stderr.on("data", (data) => {
          console.error(`\n${chalk.bold.red("printchars error:")} ${data}`)
        });
      });
    }
  } catch (error) {
    handleError(error)
  }

}

exports.findFonts = main;