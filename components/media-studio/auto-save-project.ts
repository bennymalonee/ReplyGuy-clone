"use client";

import { saveStudioProject } from "@/lib/save-studio-project";

interface AutoSaveStudioProjectOptions {
  name: string;
  workflow: string;
  campaignId?: string;
  inputs?: Record<string, string>;
  outputs: string[];
}

export async function autoSaveStudioProject(options: AutoSaveStudioProjectOptions) {
  if (!options.outputs.length) return null;

  try {
    return await saveStudioProject(options);
  } catch {
    return null;
  }
}
