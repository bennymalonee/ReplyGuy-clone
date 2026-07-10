export interface SchemaProperty {
  name?: string;
  type?: string;
  description?: string;
  default?: unknown;
  enum?: string[];
  minValue?: number;
  maxValue?: number;
}

export interface SchemaModel {
  name: string;
  category: string;
  variant?: string;
  family?: string;
  description: string;
  input_schema: {
    schemas: {
      input_data: {
        endpoint_url: string;
        properties: Record<string, SchemaProperty>;
        required?: string[];
      };
    };
  };
}

export interface ModelInfo {
  name: string;
  category: string;
  endpoint: string;
  properties: Record<string, SchemaProperty>;
  required: string[];
  description: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface MuapiClientOptions {
  apiKey?: string;
  baseUrl?: string;
  preferCli?: boolean;
  schemaPath?: string;
  pollIntervalMs?: number;
  pollMaxAttempts?: number;
}

export interface CliRunOptions {
  args: string[];
  apiKey?: string;
  cwd?: string;
}

export interface PredictPollOptions {
  maxAttempts?: number;
  intervalMs?: number;
}
