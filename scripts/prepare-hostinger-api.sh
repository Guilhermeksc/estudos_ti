#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
TARGET_DIR="$ROOT_DIR/deploy/hostinger/api"
STANDALONE_DIR="$BACKEND_DIR/.next/standalone/backend"
STATIC_DIR="$BACKEND_DIR/.next/static"

echo "[1/5] Building backend workspace..."
cd "$ROOT_DIR"
npm run build:backend

echo "[2/5] Preparing API deploy directory..."
rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"

echo "[3/5] Copying Next standalone server bundle..."
cp -R "$STANDALONE_DIR"/. "$TARGET_DIR"/

echo "[4/5] Copying Next static assets..."
mkdir -p "$TARGET_DIR/.next"
cp -R "$STATIC_DIR" "$TARGET_DIR/.next/static"

if [ -d "$BACKEND_DIR/public" ]; then
  echo "[5/5] Copying public assets..."
  cp -R "$BACKEND_DIR/public" "$TARGET_DIR/public"
else
  echo "[5/5] No public assets to copy."
fi

echo "Done. Upload the contents of: $TARGET_DIR"
echo "Node entrypoint after upload: server.js"
