import { accessSync } from "fs";
import { constants } from "fs/promises";
import path from "path";

export function findExecutable(command: string) {
  const dirPath = process.env.PATH;

  if (!dirPath) return "Please provide a PATH env variable!";

  const directories = dirPath.split(path.delimiter).map((item) => item.trim());

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

  return foundPath;
}
