import type {
  ImageEditParams,
  ImageGenParams,
  JobHandle,
  JobResult,
  VideoI2VParams,
  VideoT2VParams,
} from "@ultimate-multimodal/shared";
import {
  cliAccountBalance,
  cliImageEdit,
  cliImageGenerate,
  cliPredictStatus,
  cliPredictWait,
  cliUpload,
  cliVideoFromImage,
  cliVideoGenerate,
  MuapiCliError,
  runMuapiCli,
} from "./cli";
import {
  buildPayload,
  getModel,
  listModels,
  loadSchema,
  validateParams,
} from "./schema";
import {
  extractRequestId,
  normalizeStatus,
  restAccountBalance,
  restPredictStatus,
  restPredictWait,
  restSubmit,
  restUpload,
  toJobResult,
} from "./rest";
import type { ModelInfo, MuapiClientOptions, PredictPollOptions, ValidationResult } from "./types";

export class MuapiClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly preferCli: boolean;
  private readonly schemaPath?: string;
  private readonly pollIntervalMs: number;
  private readonly pollMaxAttempts: number;

  constructor(options: MuapiClientOptions = {}) {
    const key = options.apiKey ?? process.env.MUAPI_API_KEY;
    if (!key) throw new Error("MUAPI_API_KEY is not configured");
    this.apiKey = key;
    this.baseUrl = options.baseUrl ?? "https://api.muapi.ai/api/v1";
    this.preferCli = options.preferCli ?? false;
    this.schemaPath = options.schemaPath;
    this.pollIntervalMs = options.pollIntervalMs ?? 3000;
    this.pollMaxAttempts = options.pollMaxAttempts ?? 120;
  }

  // --- Schema ---

  getModel(modelId: string): ModelInfo {
    return getModel(modelId, this.schemaPath);
  }

  listModels(category?: string): ModelInfo[] {
    return listModels(category, this.schemaPath);
  }

  validate(modelId: string, params: Record<string, unknown>): ValidationResult {
    return validateParams(modelId, params, this.schemaPath);
  }

  loadSchema() {
    return loadSchema(this.schemaPath);
  }

  // --- Upload ---

  async upload(file: Buffer, filename: string, mimeType: string): Promise<string> {
    if (this.preferCli) {
      const tmpPath = await this.writeTempFile(file, filename);
      try {
        return await cliUpload(tmpPath, this.apiKey);
      } finally {
        await this.removeTempFile(tmpPath);
      }
    }
    return restUpload(file, filename, mimeType, this.apiKey, this.baseUrl);
  }

  // --- Generation ---

  async imageGenerate(params: ImageGenParams): Promise<JobHandle> {
    const body = {
      prompt: params.prompt,
      aspect_ratio: params.aspectRatio ?? "1:1",
      num_images: params.numImages ?? 1,
    };
    return this.submitModel(params.model, body, () =>
      cliImageGenerate(params.prompt, params.model, {
        "aspect-ratio": params.aspectRatio ?? "1:1",
        "num-images": params.numImages ?? 1,
      }, this.apiKey)
    );
  }

  async imageEdit(params: ImageEditParams): Promise<JobHandle> {
    const body: Record<string, unknown> = {
      prompt: params.prompt,
      image_urls: params.imageUrls,
      aspect_ratio: params.aspectRatio,
      resolution: params.resolution,
    };
    return this.submitModel(params.model, body, () =>
      cliImageEdit(
        params.prompt,
        params.model,
        params.imageUrls[0],
        {
          "aspect-ratio": params.aspectRatio ?? "1:1",
          resolution: params.resolution ?? "1k",
        },
        this.apiKey
      )
    );
  }

  async videoFromImage(params: VideoI2VParams): Promise<JobHandle> {
    const body: Record<string, unknown> = {
      prompt: params.prompt,
      image_url: params.imageUrl,
      aspect_ratio: params.aspectRatio ?? "9:16",
      duration: params.duration ?? 10,
      generate_audio: params.generateAudio ?? true,
    };
    return this.submitModel(params.model, body, () =>
      cliVideoFromImage(
        params.prompt,
        params.model,
        params.imageUrl,
        {
          "aspect-ratio": params.aspectRatio ?? "9:16",
          duration: params.duration ?? 10,
          "generate-audio": params.generateAudio ?? true,
        },
        this.apiKey
      )
    );
  }

  async videoGenerate(params: VideoT2VParams): Promise<JobHandle> {
    const body: Record<string, unknown> = {
      prompt: params.prompt,
      aspect_ratio: params.aspectRatio ?? "16:9",
      duration: params.duration ?? 5,
    };
    return this.submitModel(params.model, body, () =>
      cliVideoGenerate(params.prompt, params.model, {
        "aspect-ratio": params.aspectRatio ?? "16:9",
        duration: params.duration ?? 5,
      }, this.apiKey)
    );
  }

  private async submitModel(
    modelId: string,
    params: Record<string, unknown>,
    cliFn: () => Promise<Record<string, unknown>>
  ): Promise<JobHandle> {
    if (this.preferCli) {
      return this.handleFromCli(await cliFn());
    }

    try {
      const { endpoint, payload } = buildPayload(modelId, params, this.schemaPath);
      return await restSubmit(endpoint, payload, this.apiKey, this.baseUrl);
    } catch (restError) {
      try {
        return this.handleFromCli(await cliFn());
      } catch (cliError) {
        const restMsg = restError instanceof Error ? restError.message : String(restError);
        const cliMsg = cliError instanceof MuapiCliError ? cliError.message : String(cliError);
        throw new Error(`MuAPI submit failed. REST: ${restMsg}. CLI: ${cliMsg}`);
      }
    }
  }

  private handleFromCli(data: Record<string, unknown>): JobHandle {
    const requestId = extractRequestId(data as { request_id?: string; id?: string });
    if (!requestId) throw new Error("CLI response missing request_id");
    return {
      requestId,
      status: normalizeStatus(data.status as string | undefined),
    };
  }

  // --- Polling ---

  async predictStatus(requestId: string): Promise<JobResult> {
    if (this.preferCli) {
      try {
        const data = await cliPredictStatus(requestId, this.apiKey);
        return toJobResult(requestId, data as Parameters<typeof toJobResult>[1]);
      } catch {
        return restPredictStatus(requestId, this.apiKey, this.baseUrl);
      }
    }
    return restPredictStatus(requestId, this.apiKey, this.baseUrl);
  }

  async predictWait(
    requestId: string,
    options: PredictPollOptions = {}
  ): Promise<JobResult> {
    const maxAttempts = options.maxAttempts ?? this.pollMaxAttempts;
    const intervalMs = options.intervalMs ?? this.pollIntervalMs;

    if (this.preferCli) {
      try {
        const data = await cliPredictWait(requestId, this.apiKey);
        return toJobResult(requestId, data as Parameters<typeof toJobResult>[1]);
      } catch {
        // fall through to REST polling
      }
    }

    return restPredictWait(
      requestId,
      this.apiKey,
      maxAttempts,
      intervalMs,
      this.baseUrl
    );
  }

  async getAccountBalance(): Promise<number | null> {
    if (this.preferCli) {
      const balance = await cliAccountBalance(this.apiKey);
      if (balance !== null) return balance;
    }
    return restAccountBalance(this.apiKey, this.baseUrl);
  }

  // --- Raw CLI access ---

  runCli(args: string[]): Promise<Record<string, unknown>> {
    return runMuapiCli({ args, apiKey: this.apiKey });
  }

  // --- Temp file helpers (CLI upload) ---

  private async writeTempFile(buffer: Buffer, filename: string): Promise<string> {
    const { mkdtemp, writeFile } = await import("fs/promises");
    const { join } = await import("path");
    const { tmpdir } = await import("os");
    const dir = await mkdtemp(join(tmpdir(), "muapi-upload-"));
    const filePath = join(dir, filename);
    await writeFile(filePath, buffer);
    return filePath;
  }

  private async removeTempFile(filePath: string): Promise<void> {
    const { unlink } = await import("fs/promises");
    try {
      await unlink(filePath);
    } catch {
      // ignore cleanup errors
    }
  }
}

export function createMuapiClient(options?: MuapiClientOptions): MuapiClient {
  return new MuapiClient(options);
}

export function getApiKey(): string {
  const key = process.env.MUAPI_API_KEY;
  if (!key) throw new Error("MUAPI_API_KEY is not configured");
  return key;
}

export function resolveApiKey(settingsKey?: string): string {
  const key = settingsKey ?? process.env.MUAPI_API_KEY;
  if (!key) throw new Error("MUAPI_API_KEY is not configured");
  return key;
}
