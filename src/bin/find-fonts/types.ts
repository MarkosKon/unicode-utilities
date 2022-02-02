interface CommanderArguments {
  fontFiles: string[];
}

export interface CommanderOptions {
  unicodeRanges: string[];
  printcharsFieldSeparator: string;
  verbose: boolean;
  partial: boolean;
  partialThreshold: number;
  databaseFile?: string;
}

export type ProgramInput = CommanderArguments & CommanderOptions;

export interface FontDBEntry {
  fontFile: string;
  fontFullName: string;
  numberSet: number[];
}

export type EmptyObject = Record<string, never>;
