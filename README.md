# Unicode Utilities

Command line utilities to help you with Unicode/font stuff.

- `c2n` (Character to number) prints the code points of the given characters. It can also do the opposite, and it can work with hex numbers too. See the [help menu for usage and examples](help/c2n.txt).
- `ur2n`, (Unicode range to number) prints the code points for the given Unicode ranges. See the [help menu for usage and examples](help/ur2n.txt).
- `printchars`. Prints the code points for the given font files. See the [help menu for usage](help/printchars.txt).
- `ff`, (Find fonts) prints the fonts that support a Unicode range. See the [help menu for usage and examples](help/ff.txt).

## Installation

`npm install -g unicode-utilities`

## Run

Run one of the utilities in your command line:

- `c2n --help`
- `ur2n --help`
- `printchars --help`
- `ff --help`

## Usage

See the help menu below for each utility. See also the [recipes](recipes.md).

- [c2n help menu](help/c2n.txt)
- [ur2n help menu](help/ur2n.txt)
- [printchars help menu](help/printchars.txt)
- [ff help menu](help/ff.txt)

## Future improvements

- Migrate to TypeScript
- Add tests.
