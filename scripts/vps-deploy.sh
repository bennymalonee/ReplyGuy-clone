#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-$(cd "$(dirname "$0")/.." && pwd)}"
cd "$APP_DIR"

echo "==> Installing dependencies"
npm install --legacy-peer-deps

echo "==> Syncing database schema"
npm run db:push

echo "==> Building app"
npm run build

if command -v pm2 >/dev/null 2>&1; then
  echo "==> Restarting PM2 process"
  pm2 restart ecosystem.config.js --update-env || pm2 start ecosystem.config.js
  pm2 save
else
  echo "==> Build complete. Start with: npm run start"
fi
