interface CharacterToNumberArguments {
  args: string[];
}

interface CharacterToNumberOptions {
  reverse: boolean;
  hex: boolean;
  appendUPlus: boolean;
  verbose: boolean;
}

type CharacterToNumberInput = CharacterToNumberArguments &
  CharacterToNumberOptions;
