import chalk from "chalk";

type Tag =
  | "default"
  | "error"
  | "printchars error"
  | "ReadStream error"
  | "success"
  | "super unknown error"
  | "unknown error"
  | "warning";

export const formatOutput =
  (programName: string) => (tag: Tag, message: string) => {
    switch (tag) {
      case "error":
      case "printchars error":
      case "ReadStream error":
      case "unknown error":
      case "super unknown error":
        return `${chalk.bold.red(tag)} (${programName}): ${message}`;
      case "warning":
        return `${chalk.yellow(tag)} (${programName}): ${message}`;
      case "success":
        return `${chalk.green(tag)} (${programName}): ${message}`;
      case "default":
        return `${programName}: ${message}`;
      default: {
        const exhaustive: never = tag;
        return exhaustive;
      }
    }
  };
