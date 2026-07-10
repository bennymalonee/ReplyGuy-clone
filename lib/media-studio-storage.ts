import type { AppSettings, Project, StoredJob } from "@ultimate-multimodal/shared";
import { DEFAULT_SETTINGS } from "@ultimate-multimodal/shared";

import { prisma } from "@/lib/db";

function resolveApiKey(settingsKey?: string | null): string {
  return settingsKey ?? process.env.MUAPI_API_KEY ?? "";
}

function mapProject(row: {
  id: string;
  name: string;
  workflow: string;
  campaignId: string | null;
  inputs: unknown;
  outputs: unknown;
  createdAt: Date;
  updatedAt: Date;
}): Project {
  return {
    id: row.id,
    name: row.name,
    workflow: row.workflow,
    campaignId: row.campaignId ?? undefined,
    inputs:
      row.inputs && typeof row.inputs === "object" && !Array.isArray(row.inputs)
        ? (row.inputs as Record<string, string>)
        : {},
    outputs: Array.isArray(row.outputs) ? (row.outputs as string[]) : [],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function getMediaStudioSettings(userId: string): Promise<AppSettings> {
  const row = await prisma.mediaStudioSettings.findUnique({
    where: { userId },
  });

  if (!row) {
    return { ...DEFAULT_SETTINGS };
  }

  return {
    muapiApiKey: row.muapiApiKey ?? undefined,
    defaultImageModel: row.defaultImageModel,
    defaultVideoModel: row.defaultVideoModel,
    outputDirectory: row.outputDirectory,
  };
}

export async function getMediaStudioApiKey(userId: string): Promise<string> {
  const settings = await getMediaStudioSettings(userId);
  return resolveApiKey(settings.muapiApiKey);
}

export async function saveMediaStudioSettings(
  userId: string,
  settings: AppSettings
): Promise<void> {
  await prisma.mediaStudioSettings.upsert({
    where: { userId },
    create: {
      userId,
      muapiApiKey: settings.muapiApiKey,
      defaultImageModel: settings.defaultImageModel,
      defaultVideoModel: settings.defaultVideoModel,
      outputDirectory: settings.outputDirectory,
    },
    update: {
      muapiApiKey: settings.muapiApiKey,
      defaultImageModel: settings.defaultImageModel,
      defaultVideoModel: settings.defaultVideoModel,
      outputDirectory: settings.outputDirectory,
    },
  });
}

export async function getMediaStudioJobs(userId: string): Promise<StoredJob[]> {
  const rows = await prisma.mediaStudioJob.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return rows.map((row) => ({
    id: row.id,
    type: row.type,
    model: row.model,
    status: row.status as StoredJob["status"],
    outputs: Array.isArray(row.outputs) ? (row.outputs as string[]) : [],
    error: row.error ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export async function saveMediaStudioJob(
  userId: string,
  job: StoredJob
): Promise<void> {
  await prisma.mediaStudioJob.upsert({
    where: { id: job.id },
    create: {
      id: job.id,
      userId,
      type: job.type,
      model: job.model,
      status: job.status,
      outputs: job.outputs,
      error: job.error,
      createdAt: new Date(job.createdAt),
      updatedAt: new Date(job.updatedAt),
    },
    update: {
      userId,
      type: job.type,
      model: job.model,
      status: job.status,
      outputs: job.outputs,
      error: job.error,
      updatedAt: new Date(job.updatedAt),
    },
  });
}

export async function getMediaStudioProjects(
  userId: string,
  campaignId?: string
): Promise<Project[]> {
  const rows = await prisma.mediaStudioProject.findMany({
    where: {
      userId,
      ...(campaignId ? { campaignId } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return rows.map(mapProject);
}

export async function getMediaStudioProjectCountByCampaign(
  campaignId: string
): Promise<number> {
  return prisma.mediaStudioProject.count({
    where: { campaignId },
  });
}

export async function saveMediaStudioProject(
  userId: string,
  project: Project
): Promise<void> {
  await prisma.mediaStudioProject.upsert({
    where: { id: project.id },
    create: {
      id: project.id,
      userId,
      campaignId: project.campaignId,
      name: project.name,
      workflow: project.workflow,
      inputs: project.inputs,
      outputs: project.outputs,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
    },
    update: {
      campaignId: project.campaignId,
      name: project.name,
      workflow: project.workflow,
      inputs: project.inputs,
      outputs: project.outputs,
      updatedAt: new Date(project.updatedAt),
    },
  });
}

export function generateMediaStudioId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
