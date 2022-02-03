/* eslint-disable unicorn/no-process-exit */
import { spawn } from "node:child_process";
import chalk from "chalk";

type SpawnInput = {
  command: Parameters<typeof spawn>["0"];
  args: Parameters<typeof spawn>["1"];
  options?: Parameters<typeof spawn>["2"];
};

export type SpawnPromise = {
  stdout: string;
  stderr: string;
  exitCode: number;
};

export const spawnPromise = async ({
  command,
  args,
  options = {},
}: Omit<SpawnInput, "test">): Promise<SpawnPromise> => {
  return new Promise((resolve, reject) => {
    const testProcess = spawn(command, args, options);
    let stdout = "";
    let stderr = "";

    testProcess.on("error", (error) => {
      reject(error);
    });

    testProcess.stdout?.on("data", (data) => {
      stdout += data;
    });
    testProcess.stderr?.on("data", (data) => {
      stderr += data;
    });

    testProcess.on("close", (code) => {
      resolve({ stdout, stderr, exitCode: code ?? 1 });
    });
  });
};

export const handleError = (test: string) => (error: unknown) => {
  console.error(
    `${chalk.bold.red("X")} ${test} failed with error ${String(error)}`
  );
  process.exit(1);
};
