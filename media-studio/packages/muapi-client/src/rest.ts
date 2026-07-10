import type { JobHandle, JobResult, JobStatus } from "@ultimate-multimodal/shared";

const DEFAULT_BASE = "https://api.muapi.ai/api/v1";

interface PredictResponse {
  request_id?: string;
  id?: string;
  status?: string;
  outputs?: string[];
  output?: string[] | { url?: string };
  url?: string;
  error?: string;
}

export function normalizeStatus(status?: string): JobStatus {
  const s = (status ?? "pending").toLowerCase();
  if (s === "completed" || s === "succeeded" || s === "success") return "completed";
  if (s === "failed" || s === "error") return "failed";
  if (s === "processing" || s === "running" || s === "in_progress") return "processing";
  return "pending";
}

export function extractOutputs(data: PredictResponse): string[] {
  if (Array.isArray(data.outputs)) return data.outputs.filter(Boolean);
  if (Array.isArray(data.output)) return data.output.filter(Boolean);
  if (data.output && typeof data.output === "object" && "url" in data.output && data.output.url) {
    return [data.output.url];
  }
  if (data.url) return [data.url];
  return [];
}

export function extractRequestId(data: PredictResponse): string | null {
  return data.request_id ?? data.id ?? null;
}

export function toJobResult(requestId: string, data: PredictResponse): JobResult {
  return {
    requestId,
    status: normalizeStatus(data.status),
    outputs: extractOutputs(data),
    error: data.error,
  };
}

export async function restFetch<T>(
  path: string,
  apiKey: string,
  options: RequestInit = {},
  baseUrl = DEFAULT_BASE
): Promise<T> {
  const url = path.startsWith("http") ? path : `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "x-api-key": apiKey,
      "content-type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MuAPI error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

export async function restUpload(
  file: Buffer,
  filename: string,
  mimeType: string,
  apiKey: string,
  baseUrl = DEFAULT_BASE
): Promise<string> {
  const form = new FormData();
  const blob = new Blob([new Uint8Array(file)], { type: mimeType });
  form.append("file", blob, filename);

  const res = await fetch(`${baseUrl}/upload`, {
    method: "POST",
    headers: { "x-api-key": apiKey },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed ${res.status}: ${text}`);
  }

  const data = (await res.json()) as { url?: string };
  if (!data.url) throw new Error("Upload response missing url");
  return data.url;
}

export async function restSubmit(
  endpoint: string,
  payload: Record<string, unknown>,
  apiKey: string,
  baseUrl = DEFAULT_BASE
): Promise<JobHandle> {
  const data = await restFetch<PredictResponse>(
    `/${endpoint}`,
    apiKey,
    { method: "POST", body: JSON.stringify(payload) },
    baseUrl
  );
  const requestId = extractRequestId(data);
  if (!requestId) throw new Error("No request_id in MuAPI response");
  return { requestId, status: normalizeStatus(data.status) };
}

export async function restPredictStatus(
  requestId: string,
  apiKey: string,
  baseUrl = DEFAULT_BASE
): Promise<JobResult> {
  const data = await restFetch<PredictResponse>(
    `/predictions/${requestId}/result`,
    apiKey,
    { method: "GET" },
    baseUrl
  );
  return toJobResult(requestId, data);
}

export async function restPredictWait(
  requestId: string,
  apiKey: string,
  maxAttempts = 120,
  intervalMs = 3000,
  baseUrl = DEFAULT_BASE
): Promise<JobResult> {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await restPredictStatus(requestId, apiKey, baseUrl);
    if (result.status === "completed" || result.status === "failed") return result;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(`Prediction ${requestId} timed out after ${maxAttempts} attempts`);
}

export async function restAccountBalance(
  apiKey: string,
  baseUrl = DEFAULT_BASE
): Promise<number | null> {
  try {
    const data = await restFetch<{ balance?: number; credits?: number }>(
      "/account/balance",
      apiKey,
      { method: "GET" },
      baseUrl
    );
    return data.balance ?? data.credits ?? null;
  } catch {
    return null;
  }
}
