import { createInterface } from "readline";
import { execSync } from "node:child_process";
import { findExecutable } from "./utils";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

rl.prompt();

type Executable = (...args: string[]) => void;

const commands: Record<string, Executable> = {
  exit: (..._args) => process.exit(0),
  echo: (...args) => console.log(args.join(" ")),
  type: (...args) => {
    const [command] = args;

    if (!command) return console.log("null: not found");

    if (commands[command]) {
      console.log(`${command} is a shell builtin`);
    } else {
      const foundPath = findExecutable(command);

      if (foundPath) {
        console.log(`${command} is ${foundPath}`);
        return;
      }

      console.log(`${command}: not found`);
    }
  },
};

rl.on("line", (input) => {
  const [command, ...args] = input.split(" ");

  if (commands[command]) {
    commands[command](...args);
  } else {
    const foundPath = findExecutable(command);

    // we found executable file
    if (foundPath) {
      // execute the program
      execSync(input, { stdio: "inherit" });
    } else {
      console.log(`${command}: command not found`);
    }
  }

  rl.prompt();
});
