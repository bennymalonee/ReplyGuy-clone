export type JobStatus = "pending" | "processing" | "completed" | "failed";

export interface JobHandle {
  requestId: string;
  status: JobStatus;
}

export interface JobResult {
  requestId: string;
  status: JobStatus;
  outputs: string[];
  error?: string;
}

export interface ImageGenParams {
  prompt: string;
  model: string;
  aspectRatio?: string;
  numImages?: number;
}

export interface ImageEditParams {
  prompt: string;
  model: string;
  imageUrls: string[];
  aspectRatio?: string;
  resolution?: string;
}

export interface VideoI2VParams {
  prompt: string;
  model: string;
  imageUrl: string;
  aspectRatio?: string;
  duration?: number;
  generateAudio?: boolean;
}

export interface VideoT2VParams {
  prompt: string;
  model: string;
  aspectRatio?: string;
  duration?: number;
}

export type GenerateAction =
  | { type: "image_generate"; params: ImageGenParams }
  | { type: "image_edit"; params: ImageEditParams }
  | { type: "video_from_image"; params: VideoI2VParams }
  | { type: "video_generate"; params: VideoT2VParams };

export interface SkillInput {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
}

export interface SkillDefinition {
  slug: string;
  name: string;
  description: string;
  path: string;
  inputs: SkillInput[];
  category: string;
}

export interface Project {
  id: string;
  name: string;
  workflow: string;
  inputs: Record<string, string>;
  outputs: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StoredJob {
  id: string;
  type: string;
  model: string;
  status: JobStatus;
  outputs: string[];
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  muapiApiKey?: string;
  defaultImageModel: string;
  defaultVideoModel: string;
  outputDirectory: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  defaultImageModel: "flux-dev",
  defaultVideoModel: "kling-v3.0-pro",
  outputDirectory: "media_outputs",
};
