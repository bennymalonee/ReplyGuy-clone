import type { GenerateAction, ImageEditParams, ImageGenParams, JobHandle, JobResult, VideoI2VParams, VideoT2VParams } from "@ultimate-multimodal/shared";
import { createMuapiClient, getApiKey, resolveApiKey } from "./client";

export { MuapiClient, createMuapiClient, getApiKey, resolveApiKey } from "./client";
export { MuapiCliError } from "./cli";
export {
  buildPayload,
  clearSchemaCache,
  getModel,
  listModels,
  loadSchema,
  modelHasProperty,
  resolveSchemaPath,
  validateParams,
} from "./schema";
export {
  extractOutputs,
  extractRequestId,
  normalizeStatus,
  restAccountBalance,
  restPredictStatus,
  restPredictWait,
  restSubmit,
  restUpload,
  toJobResult,
} from "./rest";
export type { ModelInfo, MuapiClientOptions, SchemaModel, ValidationResult } from "./types";

function client(apiKey?: string) {
  return createMuapiClient({ apiKey: apiKey ?? getApiKey() });
}

/** @deprecated Use createMuapiClient().upload() */
export async function uploadFile(
  file: Buffer,
  filename: string,
  mimeType: string,
  apiKey?: string
): Promise<string> {
  return createMuapiClient({ apiKey: apiKey ?? resolveApiKey() }).upload(file, filename, mimeType);
}

export async function imageGenerate(params: ImageGenParams, apiKey?: string): Promise<JobHandle> {
  return client(apiKey).imageGenerate(params);
}

export async function imageEdit(params: ImageEditParams, apiKey?: string): Promise<JobHandle> {
  return client(apiKey).imageEdit(params);
}

export async function videoFromImage(params: VideoI2VParams, apiKey?: string): Promise<JobHandle> {
  return client(apiKey).videoFromImage(params);
}

export async function videoGenerate(params: VideoT2VParams, apiKey?: string): Promise<JobHandle> {
  return client(apiKey).videoGenerate(params);
}

export async function predictStatus(requestId: string, apiKey?: string): Promise<JobResult> {
  return client(apiKey).predictStatus(requestId);
}

export async function predictWait(
  requestId: string,
  apiKey?: string,
  maxAttempts = 120,
  intervalMs = 3000
): Promise<JobResult> {
  return client(apiKey).predictWait(requestId, { maxAttempts, intervalMs });
}

export async function getAccountBalance(apiKey?: string): Promise<number | null> {
  return client(apiKey).getAccountBalance();
}

export async function executeGenerate(action: GenerateAction, apiKey?: string): Promise<JobHandle> {
  const c = client(apiKey);
  switch (action.type) {
    case "image_generate":
      return c.imageGenerate(action.params);
    case "image_edit":
      return c.imageEdit(action.params);
    case "video_from_image":
      return c.videoFromImage(action.params);
    case "video_generate":
      return c.videoGenerate(action.params);
  }
}

export async function modelsList(category?: string, apiKey?: string): Promise<import("./types").ModelInfo[]> {
  return client(apiKey).listModels(category);
}
