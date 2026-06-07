import { createInterface } from "readline";
import { constants } from "fs/promises";
import path from "path";
import { accessSync } from "fs";
import { execFile } from "node:child_process";

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
      const dirPath = process.env.PATH;

      if (!dirPath) return "Please provide a PATH env variable!";

      const directories = dirPath
        .split(path.delimiter)
        .map((item) => item.trim());

      let foundPath: string | null = null;

      for (const dir of directories) {
        const fullPath = path.join(dir, command);

        try {
          accessSync(fullPath, constants.X_OK);

          foundPath = fullPath;
        } catch (err) {
          // Doesn't exist or its not executable, continue!
        }
      }

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
    // check if command is executable
    const dirPath = process.env.PATH;

    if (!dirPath) return "Please provide a PATH env variable!";

    const directories = dirPath
      .split(path.delimiter)
      .map((item) => item.trim());

    let foundPath: string | null = null;

    for (const dir of directories) {
      const fullPath = path.join(dir, command);

      try {
        accessSync(fullPath, constants.X_OK);

        foundPath = fullPath;
      } catch (err) {
        // Doesn't exist or its not executable, continue!
      }
    }

    // we found executable file
    if (foundPath) {
      // execute the program
      execFile(command, [...args], (error, stdout) => {
        if (error) {
          console.log(error.message);
          return;
        }

        console.log(stdout);
      });
      return;
    }

    console.log(`${command}: command not found`);
  }

  rl.prompt();
});
