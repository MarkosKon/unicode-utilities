# Unicode Utilities

Command line utilities to help you when you work with Unicode related stuff.

- `c2n` (Character to number) prints the code points of the given characters. It can also do the opposite, and it can work with hex numbers too. See the [help menu for usage and examples](help/c2n.txt).
- `ur2n`, (Unicode range to number) prints the code points for the given Unicode ranges. See the [help menu for usage and examples](help/ur2n.txt).
- `printchars`. Prints the code points for the given font files. See the [help menu for usage](help/printchars.txt).
- `ff`, (Find fonts) prints the fonts that support a Unicode range. See the [help menu for usage and examples](help/ff.txt).

## Installation

- Clone the repo `git clone https://github.com/MarkosKon/unicode-utilities.git`
- Change the directory `cd unicode-utilities`.
- Run one of the 4 executables.
- Or install it globally with `npm link`.

## Usage

See the help menu for each utility. See also the [recipes](recipes.md).

- [c2n help menu](help/c2n.txt)
- [ur2n help menu](help/ur2n.txt)
- [printchars help menu](help/printchars.txt)
- [ff help menu](help/ff.txt)

## Future improvements

- Migrate to TypeScript
- Add tests.
