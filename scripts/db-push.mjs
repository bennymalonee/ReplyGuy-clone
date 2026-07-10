import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;

  const content = readFileSync(filePath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

const root = resolve(import.meta.dirname, "..");
loadEnvFile(resolve(root, ".env"));
loadEnvFile(resolve(root, ".env.local"));

try {
  execSync("prisma db push", {
    stdio: "inherit",
    env: process.env,
    cwd: root,
  });
} catch {
  console.error(
    "\nDatabase unreachable from this machine. If you use a VPS/Docker Postgres,\n" +
      "run migrations on the server instead:\n\n" +
      "  ssh your-user@your-vps\n" +
      "  cd ReplyGuy-clone && npm run db:push\n\n" +
      "Or use an SSH tunnel and set DATABASE_URL to 127.0.0.1 in .env.local.\n"
  );
  process.exit(1);
}
