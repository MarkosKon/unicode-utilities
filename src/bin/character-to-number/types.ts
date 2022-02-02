interface CommanderArguments {
  args: string[];
}

export interface CommanderOptions {
  reverse: boolean;
  hex: boolean;
  appendUPlus: boolean;
  verbose: boolean;
}

export type ProgramInput = CommanderArguments & CommanderOptions;
