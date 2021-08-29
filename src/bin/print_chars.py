#!/usr/bin/env python

from argparse import ArgumentParser, BooleanOptionalAction
from fontTools.ttLib.ttFont import TTFont

parser = ArgumentParser(description='Print the code points of the given font files. More specifically, for each file you provide, the program prints a line with 3 fields (space separated by default): the font path, the font name, and the code points. The code points are comma separated.', prog='printchars', epilog='Made by Markos Konstantopoulos https://markoskon.com. For bugs and features requests, please open an issue at https://github.com/MarkosKon/unicode-utilities/issues.')
parser.add_argument('files',
                    metavar='FILE',
                    type=str,
                    nargs='+',
                    help='The files you want to parse.')
parser.add_argument('--separator',
                    '-s',
                    metavar='SEP',
                    type=str,
                    default=' ',
                    help='How to separate the 3 fields in a line. The fields are the path, the font name, and the code points comma-separated. Use it when your paths have spaces, where the default space separator won\'t work well.')
parser.add_argument('--only-codepoints',
                    '-o',
                    type=bool,
                    action=BooleanOptionalAction,
                    default=False,
                    help='Print only 1 field in a line, the code points.')
parser.add_argument('--verbose',
                    '-V',
                    type=bool,
                    action=BooleanOptionalAction,
                    default=False,
                    help='Print extra information.')

args = parser.parse_args()

if args.verbose:
    print('Program args: ', args)

for arg in args.files:
    ttf = TTFont(arg, 0, allowVID=0,
                 ignoreDecompileErrors=True,
                 fontNumber=-1)

    chars = ','.join(map(str, ttf.getBestCmap().keys()))

    full_font_name = str(ttf["name"].getName(4, 3, 1)).replace(" ", "")

    if args.only_codepoints:
        print(chars)
    else:
        print(arg, full_font_name, chars, sep=args.separator)

    ttf.close()
