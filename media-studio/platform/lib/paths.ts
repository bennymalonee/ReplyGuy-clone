import { dirname, join } from "path";
import { existsSync } from "fs";

function findDataDir(): string {
  const candidates = [
    join(process.cwd(), "..", "data"),
    join(process.cwd(), "data"),
  ];
  for (const c of candidates) {
    const parent = dirname(c);
    if (existsSync(parent)) return c;
  }
  return candidates[0];
}

export const DATA_DIR = findDataDir();
