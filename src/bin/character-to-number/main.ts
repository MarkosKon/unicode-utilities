import {
  codePointToChar,
  charToCodePoint,
  hexToChar,
  charToHex,
  getHexDigit,
} from "../../shared/utils.js";
import { format } from "./common.js";
import { ProgramInput } from "./types.js";

const main = ({ args, reverse, hex, appendUPlus, verbose }: ProgramInput) => {
  args.forEach((argument) => {
    try {
      // codePoint => char
      // or hex => char
      if (reverse) {
        const character = hex
          ? hexToChar(getHexDigit(argument))
          : codePointToChar(Number(argument));

        const output = verbose
          ? `${argument} ${character} ${
              hex ? "hex=>character" : "code_point=>character"
            }`
          : `${character}`;
        console.log(output);
        // https://mathiasbynens.be/notes/javascript-unicode#accounting-for-astral-symbols
      } else if (Array.from(argument).length === 1) {
        // char => hex
        if (hex) {
          const hexDigit = charToHex(argument);
          const formatted = appendUPlus ? `U+${hexDigit}` : hexDigit;

          const output = verbose
            ? `${argument} ${formatted} character=>hex`
            : `${formatted}`;
          console.log(output);
          // char => codePoint
        } else {
          const codePoint = charToCodePoint(argument);
          const output = verbose
            ? `${argument} ${codePoint} character=>code_point`
            : `${codePoint}`;
          console.log(output);
        }
      } else console.error(format("error", `invalid character: '${argument}'`));
    } catch (error) {
      if (error instanceof RangeError)
        console.error(format("error", `invalid code point: ${argument}`));
      else if (error instanceof Error)
        console.error(format("unknown error", error.message));
      else console.error(format("super unknown error", String(error)));
    }
  });
};

export { main as characterToNumber };
