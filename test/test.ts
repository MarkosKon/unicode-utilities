import path from "node:path";
import { EOL } from "node:os";
import { strict as assert /* deepEqual */ } from "node:assert";
import chalk from "chalk";

import { spawnPromise, handleError } from "./helpers.js";

{
  const test = "$ c2n {a..z} works";

  spawnPromise({
    command: "node",
    args: [
      "./dist/src/bin/character-to-number/entrypoint.js",
      ..."a b c d e f g h i j k l m n o p q r s t u v w x y z".split(" "),
    ],
  })
    .then((result) => {
      const { stdout, stderr, exitCode } = result;

      assert(
        stdout ===
          "97\n98\n99\n100\n101\n102\n103\n104\n105\n106\n107\n108\n109\n110\n111\n112\n113\n114\n115\n116\n117\n118\n119\n120\n121\n122\n"
      );
      assert(stderr === "");
      assert(exitCode === 0);

      console.log(`${chalk.green("✓")} ${test} passed`);
      return result;
    })
    .catch(handleError(test));
}

{
  const test = "$ c2n -x {a..z} works";

  spawnPromise({
    command: "node",
    args: [
      "./dist/src/bin/character-to-number/entrypoint.js",
      "-x",
      ..."a b c d e f g h i j k l m n o p q r s t u v w x y z".split(" "),
    ],
  })
    .then((result) => {
      const { stdout, stderr, exitCode } = result;

      assert(
        stdout ===
          "61\n62\n63\n64\n65\n66\n67\n68\n69\n6a\n6b\n6c\n6d\n6e\n6f\n70\n71\n72\n73\n74\n75\n76\n77\n78\n79\n7a\n"
      );
      assert(stderr === "");
      assert(exitCode === 0);

      console.log(`${chalk.green("✓")} ${test} passed`);
      return result;
    })
    .catch(handleError(test));
}

{
  const test = "$ c2n -r {65..75} works";

  spawnPromise({
    command: "node",
    args: [
      "./dist/src/bin/character-to-number/entrypoint.js",
      "-r",
      ..."65 66 67 68 69 70 71 72 73 74 75".split(" "),
    ],
  })
    .then((result) => {
      const { stdout, stderr, exitCode } = result;

      assert(stdout === "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\n");
      assert(stderr === "");
      assert(exitCode === 0);

      console.log(`${chalk.green("✓")} ${test} passed`);
      return result;
    })
    .catch(handleError(test));
}

{
  const test = "$ c2n -rx e4 e5 u+e6 U+B2 works";

  spawnPromise({
    command: "node",
    args: [
      "./dist/src/bin/character-to-number/entrypoint.js",
      "-rx",
      "e4",
      "e5",
      "u+e6",
      "U+B2",
    ],
  })
    .then((result) => {
      const { stdout, stderr, exitCode } = result;

      assert(stdout === "\u00E4\n\u00E5\n\u00E6\n\u00B2\n");
      assert(stderr === "");
      assert(exitCode === 0);

      console.log(`${chalk.green("✓")} ${test} passed`);
      return result;
    })
    .catch(handleError(test));
}

{
  const test = "$ ur2n AA works";

  spawnPromise({
    command: "node",
    args: ["./dist/src/bin/unicodeRangeToNumber.js", "AA"],
  })
    .then((result) => {
      const { stdout, stderr, exitCode } = result;

      assert(stdout === "AA 170\n");
      assert(stderr === "");
      assert(exitCode === 0);

      console.log(`${chalk.green("✓")} ${test} passed`);
      return result;
    })
    .catch(handleError(test));
}

{
  const test = "ur2n exits with error with out of order range 'FF-AA'";

  spawnPromise({
    command: "node",
    args: ["./dist/src/bin/unicodeRangeToNumber.js", "FF-AA"],
  })
    .then((result) => {
      const { stdout, stderr, exitCode } = result;

      assert(stdout === "");
      assert(stderr.includes("Invalid decimal range"));
      assert(exitCode === 1);

      console.log(`${chalk.green("✓")} ${test} passed`);
      return result;
    })
    .catch(handleError(test));
}

{
  const test =
    "ur2n exits with error with out of order range that also includes a good range. '00-20 FF-AA' 500. It also prints the good range in stdout.";

  spawnPromise({
    command: "node",
    args: ["./dist/src/bin/unicodeRangeToNumber.js", "00-20 FF-AA", "500"],
  })
    .then((result) => {
      const { stdout, stderr, exitCode } = result;

      assert(stdout === "500 1280\n");
      assert(stderr.includes("Invalid decimal range"));
      assert(exitCode === 1);

      console.log(`${chalk.green("✓")} ${test} passed`);
      return result;
    })
    .catch(handleError(test));
}

{
  const test =
    "ur2n sorts an out of order range and keeps unique decimals: ur2n 400 'AA-FF, 00-20'";

  spawnPromise({
    command: "node",
    args: ["./dist/src/bin/unicodeRangeToNumber.js", "400", "AA-FF, 00-20"],
  })
    .then((result) => {
      const { stdout, stderr, exitCode } = result;

      assert(
        stdout ===
          "400 1024\n" +
            "(sorted)AA-FF,00-20 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255\n"
      );
      assert(stderr === "");
      assert(exitCode === 0);

      console.log(`${chalk.green("✓")} ${test} passed`);
      return result;
    })
    .catch(handleError(test));
}

{
  const test = "ur2n exits with error with empty range ''";

  spawnPromise({
    command: "node",
    args: ["./dist/src/bin/unicodeRangeToNumber.js", ""],
  })
    .then((result) => {
      const { stdout, stderr, exitCode } = result;

      assert(stdout === "");
      assert(stderr.includes("unicode range is empty"));
      assert(exitCode === 1);

      console.log(`${chalk.green("✓")} ${test} passed`);
      return result;
    })
    .catch(handleError(test));
}

{
  const test = "$ ur2n AA-FF works";

  spawnPromise({
    command: "node",
    args: ["./dist/src/bin/unicodeRangeToNumber.js", "AA-FF"],
  })
    .then((result) => {
      const { stdout, stderr, exitCode } = result;

      assert(
        stdout ===
          "AA-FF 170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255\n"
      );
      assert(stderr === "");
      assert(exitCode === 0);

      console.log(`${chalk.green("✓")} ${test} passed`);
      return result;
    })
    .catch(handleError(test));
}

{
  const test = "$ ur2n u+365 works";

  spawnPromise({
    command: "node",
    args: ["./dist/src/bin/unicodeRangeToNumber.js", "u+365"],
  })
    .then((result) => {
      const { stdout, stderr, exitCode } = result;

      assert(stdout === "u+365 869\n");
      assert(stderr === "");
      assert(exitCode === 0);

      console.log(`${chalk.green("✓")} ${test} passed`);
      return result;
    })
    .catch(handleError(test));
}

{
  const test = "ur2n works with multiple arguments";

  spawnPromise({
    command: "node",
    args: ["./dist/src/bin/unicodeRangeToNumber.js", "U+60-0070", "400-410"],
  })
    .then((result) => {
      const { stdout, stderr, exitCode } = result;

      assert(
        stdout ===
          "U+60-0070 96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112\n" +
            "400-410 1024,1025,1026,1027,1028,1029,1030,1031,1032,1033,1034,1035,1036,1037,1038,1039,1040\n"
      );
      assert(stderr === "");
      assert(exitCode === 0);

      console.log(`${chalk.green("✓")} ${test} passed`);
      return result;
    })
    .catch(handleError(test));
}

{
  const test = "ur2n works with single comma-separated argument";

  spawnPromise({
    command: "node",
    args: ["./dist/src/bin/unicodeRangeToNumber.js", "U+60-0070,400-410"],
  })
    .then((result) => {
      const { stdout, stderr, exitCode } = result;

      assert(
        stdout ===
          "U+60-0070,400-410 96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,1024,1025,1026,1027,1028,1029,1030,1031,1032,1033,1034,1035,1036,1037,1038,1039,1040\n"
      );
      assert(stderr === "");
      assert(exitCode === 0);

      console.log(`${chalk.green("✓")} ${test} passed`);
      return result;
    })
    .catch(handleError(test));
}

{
  const test = "ur2n works with single space-separated argument";

  spawnPromise({
    command: "node",
    args: ["./dist/src/bin/unicodeRangeToNumber.js", "10-15 A-F"],
  })
    .then((result) => {
      const { stdout, stderr, exitCode } = result;

      assert(stdout === "10-15,A-F 16,17,18,19,20,21,10,11,12,13,14,15\n");
      assert(stderr === "");
      assert(exitCode === 0);

      console.log(`${chalk.green("✓")} ${test} passed`);
      return result;
    })
    .catch(handleError(test));
}

{
  const test = "ur2n works with irregular space-separated argument";

  spawnPromise({
    command: "node",
    args: ["./dist/src/bin/unicodeRangeToNumber.js", "10-15    A-F B0"],
  })
    .then((result) => {
      const { stdout, stderr, exitCode } = result;

      assert(
        stdout === "10-15,A-F,B0 16,17,18,19,20,21,10,11,12,13,14,15,176\n"
      );
      assert(stderr === "");
      assert(exitCode === 0);

      console.log(`${chalk.green("✓")} ${test} passed`);
      return result;
    })
    .catch(handleError(test));
}

{
  const test = "ur2n works with space-separated and comma-separated argument";

  spawnPromise({
    command: "node",
    args: ["./dist/src/bin/unicodeRangeToNumber.js", "10-15 A-F, C0-C4"],
  })
    .then((result) => {
      const { stdout, stderr, exitCode } = result;

      assert(
        stdout ===
          "10-15,A-F,C0-C4 16,17,18,19,20,21,10,11,12,13,14,15,192,193,194,195,196\n"
      );
      assert(stderr === "");
      assert(exitCode === 0);

      console.log(`${chalk.green("✓")} ${test} passed`);
      return result;
    })
    .catch(handleError(test));
}

{
  const test = "ur2n works with dangling comma in the range.";

  spawnPromise({
    command: "node",
    args: ["./dist/src/bin/unicodeRangeToNumber.js", "U+60-0070,", "400-410"],
  })
    .then((result) => {
      const { stdout, stderr, exitCode } = result;

      assert(
        stdout ===
          "U+60-0070 96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112\n" +
            "400-410 1024,1025,1026,1027,1028,1029,1030,1031,1032,1033,1034,1035,1036,1037,1038,1039,1040\n"
      );
      assert(stderr === "");
      assert(exitCode === 0);

      console.log(`${chalk.green("✓")} ${test} passed`);
      return result;
    })
    .catch(handleError(test));
}

{
  const test = "ff works with file DB";

  spawnPromise({
    command: "node",
    args: [
      "./dist/src/bin/find-fonts/entrypoint.js",
      "-f",
      "./test/fonts/fonts-db.txt",
      "-u",
      "u+AA-FF",
    ],
  })
    .then((result) => {
      const { stdout, stderr, exitCode } = result;

      assert(
        stdout ===
          "CommissionerThin test/fonts/Commissioner[slnt,wght].ttf\n" +
            "LatoExtraBold test/fonts/Lato-ExtraBold.ttf\n" +
            "LatoExtraBoldItalic test/fonts/Lato-ExtraBoldItalic.ttf\n" +
            "STIXTwoText test/fonts/STIX2Text-Regular.woff2\n"
      );
      assert(stderr === "");
      assert(exitCode === 0);

      console.log(`${chalk.green("✓")} ${test} passed`);
      return result;
    })
    .catch(handleError(test));
}

{
  const test = "ff works with partial threshold";

  spawnPromise({
    command: "node",
    args: [
      "./dist/src/bin/find-fonts/entrypoint.js",
      "-pt",
      "60",
      "-f",
      "./test/fonts/fonts-db.txt",
      "-u",
      "u+00-FF",
    ],
  })
    .then((result) => {
      const { stdout, stderr, exitCode } = result;

      assert(
        stdout ===
          "CommissionerThin 75% test/fonts/Commissioner[slnt,wght].ttf\n" +
            "LatoExtraBold 75% test/fonts/Lato-ExtraBold.ttf\n" +
            "LatoExtraBoldItalic 75% test/fonts/Lato-ExtraBoldItalic.ttf\n" +
            "MessapiaRegular 63% test/fonts/Messapia-Regular.otf\n" +
            "STIXTwoText 75% test/fonts/STIX2Text-Regular.woff2\n"
      );
      assert(stderr === "");
      assert(exitCode === 0);

      console.log(`${chalk.green("✓")} ${test} passed`);
      return result;
    })
    .catch(handleError(test));
}

{
  const test = "ff works with files";

  spawnPromise({
    command: "find",
    args: [
      "./test/fonts",
      "-type",
      "f",
      "-name",
      "*ttf",
      "-print0",
      "|",
      "xargs",
      "-0",
      "./dist/src/bin/find-fonts/entrypoint.js",
      "-u",
      "u+41-5A",
      "61-7A",
      "U+AA-FF",
      "--",
    ],
    options: { shell: true },
  })
    .then((result) => {
      const { stdout, stderr, exitCode } = result;

      assert(
        stdout ===
          `CommissionerThin ${path.resolve(
            "./test/fonts/Commissioner[slnt,wght].ttf"
          )}
LatoExtraBold ${path.resolve("./test/fonts/Lato-ExtraBold.ttf")}
LatoExtraBoldItalic ${path.resolve("./test/fonts/Lato-ExtraBoldItalic.ttf")}\n`
      );
      assert(stderr === "");
      assert(exitCode === 0);

      console.log(`${chalk.green("✓")} ${test} passed`);
      return result;
    })
    .catch(handleError(test));
}

{
  const test = "$ ff -u $(c2n --hex '&' ä ß б ») -- fonts/*woff*";

  spawnPromise({
    command:
      "bash -c 'node ./dist/src/bin/find-fonts/entrypoint.js -u $(node ./dist/src/bin/character-to-number/entrypoint.js --hex \\& ä ß б ») -- test/fonts/*woff*'",
    args: [],
    options: { shell: "bash" },
  })
    .then((result) => {
      const { stdout, stderr, exitCode } = result;

      assert(
        stdout ===
          `STIXTwoText ${path.resolve(
            "./test/fonts/STIX2Text-Regular.woff2"
          )}\n`
      );
      assert(stderr === "");
      assert(exitCode === 0);

      console.log(`${chalk.green("✓")} ${test} passed`);
      return result;
    })
    .catch(handleError(test));
}

{
  const test = "ff requires the --unicode-ranges option";

  spawnPromise({
    command: "node",
    args: ["./dist/src/bin/find-fonts/entrypoint.js"],
  })
    .then((result) => {
      const { stdout, stderr, exitCode } = result;

      assert(stdout === "");
      assert(stderr.match(/required option.*--unicode-ranges/));
      assert(exitCode === 1);

      console.log(`${chalk.green("✓")} ${test} passed`);
      return result;
    })
    .catch(handleError(test));
}

{
  const test = "printchars returns only the codes";

  spawnPromise({
    command: "python",
    args: [
      "./src/bin/print_chars.py",
      "--only-codepoints",
      "./test/fonts/Messapia-Regular.otf",
    ],
  })
    .then((result) => {
      const { stdout, stderr, exitCode } = result;

      assert(
        stdout ===
          `32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,161,162,163,168,169,171,175,176,182,184,187,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,209,210,211,212,213,214,215,216,217,219,220,221,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,241,242,243,244,245,246,248,249,250,251,252,253,255,280,281,305,338,339,376,710,711,728,729,730,731,732,733,768,769,770,771,776,778,807,8211,8212,8216,8217,8218,8220,8221,8222,8226,8230,8249,8250,8364,8592,8593,8594,8595,8596,8597,8598,8599,8600,8601,8722${EOL}`
      );
      assert(stderr === "");
      assert(exitCode === 0);

      console.log(`${chalk.green("✓")} ${test} passed`);
      return result;
    })
    .catch(handleError(test));
}

process.on("exit", (code) => {
  if (code === 0)
    console.log(`${chalk.green("success:")} All tests have passed!`);
});
