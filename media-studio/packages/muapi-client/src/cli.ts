import { spawn } from "child_process";
import type { CliRunOptions } from "./types";

export class MuapiCliError extends Error {
  constructor(
    message: string,
    readonly exitCode: number,
    readonly stderr: string
  ) {
    super(message);
    this.name = "MuapiCliError";
  }
}

function resolveMuapiCommand(): string {
  return process.platform === "win32" ? "muapi.cmd" : "muapi";
}

export async function runMuapiCli(
  options: CliRunOptions
): Promise<Record<string, unknown>> {
  const cmd = resolveMuapiCommand();
  const args = [...options.args, "--output-json"];

  return new Promise((resolve, reject) => {
    const env = { ...process.env };
    if (options.apiKey) env.MUAPI_API_KEY = options.apiKey;

    const child = spawn(cmd, args, {
      cwd: options.cwd,
      env,
      shell: process.platform === "win32",
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (d) => {
      stdout += d.toString();
    });
    child.stderr.on("data", (d) => {
      stderr += d.toString();
    });

    child.on("error", (err) => {
      reject(
        new MuapiCliError(
          `Failed to spawn muapi CLI: ${err.message}. Install with: npm install -g muapi-cli`,
          127,
          stderr
        )
      );
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new MuapiCliError(`muapi CLI exited with code ${code}`, code ?? 1, stderr));
        return;
      }
      try {
        const trimmed = stdout.trim();
        const jsonStart = trimmed.indexOf("{");
        const jsonArrStart = trimmed.indexOf("[");
        const start =
          jsonStart >= 0 && (jsonArrStart < 0 || jsonStart < jsonArrStart)
            ? jsonStart
            : jsonArrStart;
        if (start < 0) {
          resolve({ raw: trimmed });
          return;
        }
        resolve(JSON.parse(trimmed.slice(start)) as Record<string, unknown>);
      } catch {
        reject(new MuapiCliError("Failed to parse muapi CLI JSON output", 1, stdout));
      }
    });
  });
}

export async function cliUpload(
  filePath: string,
  apiKey?: string
): Promise<string> {
  const result = await runMuapiCli({
    args: ["upload", "file", filePath, "--jq", ".url"],
    apiKey,
  });
  const url = (result as { url?: string }).url ?? (result.raw as string | undefined);
  if (!url || typeof url !== "string") throw new Error("CLI upload did not return url");
  return url.replace(/^"|"$/g, "");
}

export async function cliPredictWait(
  requestId: string,
  apiKey?: string
): Promise<Record<string, unknown>> {
  return runMuapiCli({
    args: ["predict", "wait", requestId],
    apiKey,
  });
}

export async function cliPredictStatus(
  requestId: string,
  apiKey?: string
): Promise<Record<string, unknown>> {
  return runMuapiCli({
    args: ["predict", "result", requestId],
    apiKey,
  });
}

export async function cliAccountBalance(apiKey?: string): Promise<number | null> {
  try {
    const result = await runMuapiCli({
      args: ["account", "balance"],
      apiKey,
    });
    const balance = (result as { balance?: number; credits?: number }).balance ??
      (result as { balance?: number; credits?: number }).credits;
    return typeof balance === "number" ? balance : null;
  } catch {
    return null;
  }
}

export async function cliImageGenerate(
  prompt: string,
  model: string,
  extra: Record<string, string | number> = {},
  apiKey?: string
): Promise<Record<string, unknown>> {
  const args = ["image", "generate", prompt, "--model", model, "--no-wait"];
  for (const [k, v] of Object.entries(extra)) {
    args.push(`--${k.replace(/_/g, "-")}`, String(v));
  }
  return runMuapiCli({ args, apiKey });
}

export async function cliImageEdit(
  prompt: string,
  model: string,
  imageUrl: string,
  extra: Record<string, string | number> = {},
  apiKey?: string
): Promise<Record<string, unknown>> {
  const args = ["image", "edit", prompt, "--model", model, "--image", imageUrl, "--no-wait"];
  for (const [k, v] of Object.entries(extra)) {
    args.push(`--${k.replace(/_/g, "-")}`, String(v));
  }
  return runMuapiCli({ args, apiKey });
}

export async function cliVideoFromImage(
  prompt: string,
  model: string,
  imageUrl: string,
  extra: Record<string, string | number | boolean> = {},
  apiKey?: string
): Promise<Record<string, unknown>> {
  const args = ["video", "from-image"];
  if (prompt) args.push(prompt);
  args.push("--model", model, "--image", imageUrl, "--no-wait");
  for (const [k, v] of Object.entries(extra)) {
    args.push(`--${k.replace(/_/g, "-")}`, String(v));
  }
  return runMuapiCli({ args, apiKey });
}

export async function cliVideoGenerate(
  prompt: string,
  model: string,
  extra: Record<string, string | number> = {},
  apiKey?: string
): Promise<Record<string, unknown>> {
  const args = ["video", "generate", prompt, "--model", model, "--no-wait"];
  for (const [k, v] of Object.entries(extra)) {
    args.push(`--${k.replace(/_/g, "-")}`, String(v));
  }
  return runMuapiCli({ args, apiKey });
}
