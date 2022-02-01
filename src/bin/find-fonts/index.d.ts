interface CommanderArguments {
  fontFiles: string[];
}

interface CommanderOptions {
  unicodeRanges: string[];
  printcharsFieldSeparator: string;
  verbose: boolean;
  partial: boolean;
  partialThreshold: number;
  databaseFile?: string;
}

type FindFontsInput = CommanderArguments & CommanderOptions;

interface FontDBEntry {
  fontFile: string;
  fontFullName: string;
  numberSet: number[];
}

type EmptyObject = Record<string, never>;
