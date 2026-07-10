import "server-only";

import type { SkillDefinition, SkillInput } from "@ultimate-multimodal/shared";
import { readdir, readFile, stat } from "fs/promises";
import path from "path";
import { SKILLS_ROOT } from "./paths";

function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const result: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      result[key] = val;
    }
  }
  return result;
}

function parseInputsTable(content: string): SkillInput[] {
  const inputs: SkillInput[] = [];
  const section = content.match(/## Inputs[\s\S]*?\n\n([\s\S]*?)(?:\n## |\n---|\Z)/);
  if (!section) return inputs;

  const rows = section[1].split("\n").filter((l) => l.startsWith("|") && !l.includes("---"));
  for (const row of rows.slice(1)) {
    const cols = row.split("|").map((c) => c.trim()).filter(Boolean);
    if (cols.length < 4) continue;
    const [name, type, required, defaultVal, description] = cols;
    inputs.push({
      name: name.replace(/`/g, ""),
      type: type.replace(/`/g, ""),
      required: required.toLowerCase() === "yes",
      default: defaultVal === "—" ? undefined : defaultVal.replace(/`/g, ""),
      description: description ?? "",
    });
  }
  return inputs;
}

function categoryFromPath(relPath: string): string {
  const parts = relPath.split(path.sep);
  return parts[0] ?? "general";
}

export async function findSkillFiles(dir: string = SKILLS_ROOT): Promise<string[]> {
  const results: string[] = [];
  try {
    const entries = await readdir(dir);
    for (const entry of entries) {
      const full = path.join(dir, entry);
      const s = await stat(full);
      if (s.isDirectory()) {
        results.push(...(await findSkillFiles(full)));
      } else if (entry === "SKILL.md") {
        results.push(full);
      }
    }
  } catch {
    // skills dir may not exist in all contexts
  }
  return results;
}

export async function parseSkillFile(filePath: string): Promise<SkillDefinition> {
  const content = await readFile(filePath, "utf-8");
  const fm = parseFrontmatter(content);
  const rel = path.relative(SKILLS_ROOT, filePath);
  const category = categoryFromPath(rel);

  return {
    slug: fm.slug ?? path.basename(path.dirname(filePath)),
    name: fm.name ?? fm.slug ?? "unknown",
    description: fm.description ?? "",
    path: rel,
    inputs: parseInputsTable(content),
    category,
  };
}

export async function loadAllSkills(): Promise<SkillDefinition[]> {
  const files = await findSkillFiles();
  return Promise.all(files.map(parseSkillFile));
}

export async function loadSkillBySlug(slug: string): Promise<SkillDefinition | null> {
  const skills = await loadAllSkills();
  return skills.find((s) => s.slug === slug || s.path.includes(slug)) ?? null;
}
