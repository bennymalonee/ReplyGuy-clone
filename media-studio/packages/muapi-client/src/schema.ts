import { existsSync, readFileSync } from "fs";
import { join } from "path";
import type { ModelInfo, SchemaModel, ValidationResult } from "./types";

const ASPECT_TO_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "1:1": { width: 1024, height: 1024 },
  "16:9": { width: 1344, height: 768 },
  "9:16": { width: 768, height: 1344 },
  "4:3": { width: 1152, height: 896 },
  "3:4": { width: 896, height: 1152 },
  "4:5": { width: 896, height: 1120 },
  "2:3": { width: 832, height: 1248 },
  "21:9": { width: 1536, height: 640 },
};

let cachedModels: SchemaModel[] | null = null;
let cachedSchemaPath: string | null = null;

function schemaCandidates(customPath?: string): string[] {
  if (customPath) return [customPath];
  return [
    join(process.cwd(), "media-studio", "skills", "schema_data.json"),
    join(process.cwd(), "..", "skills", "schema_data.json"),
    join(process.cwd(), "skills", "schema_data.json"),
    join(process.cwd(), "..", "..", "skills", "schema_data.json"),
  ];
}

export function resolveSchemaPath(customPath?: string): string {
  for (const candidate of schemaCandidates(customPath)) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error(
    `schema_data.json not found. Checked: ${schemaCandidates(customPath).join(", ")}`
  );
}

export function loadSchema(customPath?: string): SchemaModel[] {
  const path = resolveSchemaPath(customPath);
  if (cachedModels && cachedSchemaPath === path) return cachedModels;
  const raw = readFileSync(path, "utf-8");
  cachedModels = JSON.parse(raw) as SchemaModel[];
  cachedSchemaPath = path;
  return cachedModels;
}

export function getModel(modelId: string, customPath?: string): ModelInfo {
  const models = loadSchema(customPath);
  const model = models.find((m) => m.name === modelId);
  if (!model) {
    const sample = models.slice(0, 8).map((m) => m.name).join(", ");
    throw new Error(`Model '${modelId}' not found in schema_data.json. Examples: ${sample}...`);
  }
  const input = model.input_schema.schemas.input_data;
  return {
    name: model.name,
    category: model.category,
    endpoint: input.endpoint_url,
    properties: input.properties ?? {},
    required: input.required ?? [],
    description: model.description,
  };
}

export function listModels(category?: string, customPath?: string): ModelInfo[] {
  const models = loadSchema(customPath);
  return models
    .filter((m) => !category || m.category.toLowerCase().includes(category.toLowerCase()))
    .map((m) => getModel(m.name, customPath));
}

export function modelHasProperty(model: ModelInfo, prop: string): boolean {
  return prop in model.properties;
}

export function validateParams(
  modelId: string,
  params: Record<string, unknown>,
  customPath?: string
): ValidationResult {
  const errors: string[] = [];
  let model: ModelInfo;
  try {
    model = getModel(modelId, customPath);
  } catch (e) {
    return { valid: false, errors: [e instanceof Error ? e.message : String(e)] };
  }

  for (const req of model.required) {
    if (params[req] === undefined || params[req] === null || params[req] === "") {
      // image_urls satisfies image_url / images_list requirements
      if (
        req === "image_url" &&
        (params.image_url || (Array.isArray(params.image_urls) && params.image_urls[0]))
      ) {
        continue;
      }
      if (
        req === "images_list" &&
        Array.isArray(params.image_urls) &&
        params.image_urls.length > 0
      ) {
        continue;
      }
      errors.push(`Missing required parameter: ${req}`);
    }
  }

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    const prop = model.properties[key];
    if (!prop) continue;

    if (prop.enum && typeof value === "string" && !prop.enum.includes(value)) {
      errors.push(
        `Invalid ${key} '${value}'. Allowed: ${prop.enum.slice(0, 6).join(", ")}${prop.enum.length > 6 ? "..." : ""}`
      );
    }

    if (typeof value === "number") {
      if (prop.minValue !== undefined && value < prop.minValue) {
        errors.push(`${key} must be >= ${prop.minValue}`);
      }
      if (prop.maxValue !== undefined && value > prop.maxValue) {
        errors.push(`${key} must be <= ${prop.maxValue}`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export function buildPayload(
  modelId: string,
  params: Record<string, unknown>,
  customPath?: string
): { endpoint: string; payload: Record<string, unknown> } {
  const validation = validateParams(modelId, params, customPath);
  if (!validation.valid) {
    throw new Error(`Validation failed for '${modelId}': ${validation.errors.join("; ")}`);
  }

  const model = getModel(modelId, customPath);
  const payload: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && modelHasProperty(model, key)) {
      payload[key] = value;
    }
  }

  // Map image_urls array to model-specific fields
  if (params.image_urls && Array.isArray(params.image_urls)) {
    const urls = params.image_urls as string[];
    if (modelHasProperty(model, "image_urls")) {
      payload.image_urls = urls;
    } else if (modelHasProperty(model, "images_list")) {
      payload.images_list = urls;
    } else if (modelHasProperty(model, "image_url") && urls[0]) {
      payload.image_url = urls[0];
    }
  }

  if (params.image_url && modelHasProperty(model, "image_url")) {
    payload.image_url = params.image_url;
  }

  const aspectRatio = params.aspect_ratio as string | undefined;
  const supportsAspect = modelHasProperty(model, "aspect_ratio");

  if (aspectRatio && supportsAspect) {
    payload.aspect_ratio = aspectRatio;
  } else if (aspectRatio && !supportsAspect) {
    const dims = ASPECT_TO_DIMENSIONS[aspectRatio];
    if (dims) {
      if (modelHasProperty(model, "width")) payload.width = dims.width;
      if (modelHasProperty(model, "height")) payload.height = dims.height;
    }
  }

  // Ensure prompt is included when required
  if (model.required.includes("prompt") && params.prompt) {
    payload.prompt = params.prompt;
  }

  return { endpoint: model.endpoint, payload };
}

export function clearSchemaCache(): void {
  cachedModels = null;
  cachedSchemaPath = null;
}
