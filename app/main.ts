import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

rl.prompt();

const BUILT_IN_COMMANDS = ["exit", "type", "echo"];

rl.on("line", (command) => {
  if (command === "exit") {
    rl.close();
    return;
  } else if (command.startsWith("echo ")) {
    console.log(command.slice(5));
  } else if (command.startsWith("type ")) {
    const argsAfterType = command.slice(5);

    if (BUILT_IN_COMMANDS.includes(argsAfterType)) {
      console.log(`${argsAfterType} is a shell builtin`);
    } else {
      console.log(`${argsAfterType}: not found`);
    }
  } else {
    console.log(`${command}: command not found`);
  }

  rl.prompt();
});
