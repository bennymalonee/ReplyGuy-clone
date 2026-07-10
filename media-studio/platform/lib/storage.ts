import type { AppSettings, Project, StoredJob } from "@ultimate-multimodal/shared";
import { DEFAULT_SETTINGS } from "@ultimate-multimodal/shared";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { DATA_DIR } from "./paths";

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

function dataPath(file: string) {
  return path.join(DATA_DIR, file);
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    await ensureDataDir();
    const raw = await readFile(dataPath(file), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  await ensureDataDir();
  await writeFile(dataPath(file), JSON.stringify(data, null, 2), "utf-8");
}

export async function getSettings(): Promise<AppSettings> {
  return readJson<AppSettings>("settings.json", DEFAULT_SETTINGS);
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await writeJson("settings.json", settings);
}

export async function getJobs(): Promise<StoredJob[]> {
  return readJson<StoredJob[]>("jobs.json", []);
}

export async function saveJob(job: StoredJob): Promise<void> {
  const jobs = await getJobs();
  const idx = jobs.findIndex((j) => j.id === job.id);
  if (idx >= 0) jobs[idx] = job;
  else jobs.unshift(job);
  await writeJson("jobs.json", jobs.slice(0, 100));
}

export async function getProjects(): Promise<Project[]> {
  return readJson<Project[]>("projects.json", []);
}

export async function saveProject(project: Project): Promise<void> {
  const projects = await getProjects();
  const idx = projects.findIndex((p) => p.id === project.id);
  if (idx >= 0) projects[idx] = project;
  else projects.unshift(project);
  await writeJson("projects.json", projects);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
