import { existsSync } from "fs";
import { join } from "path";

function findSkillsRoot(): string {
  const candidates = [
    join(process.cwd(), "media-studio", "skills", "library"),
    join(process.cwd(), "..", "skills", "library"),
    join(process.cwd(), "skills", "library"),
    join(process.cwd(), "..", "..", "skills", "library"),
  ];
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  return candidates[0];
}

export const SKILLS_ROOT = findSkillsRoot();
