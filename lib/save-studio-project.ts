export interface SaveStudioProjectInput {
  name: string;
  workflow: string;
  campaignId?: string;
  inputs?: Record<string, string>;
  outputs: string[];
}

export async function saveStudioProject(input: SaveStudioProjectInput) {
  const response = await fetch("/api/media-studio/projects", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Failed to save project");
  }

  return data.project;
}
