#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
FRONTEND_DIST="$ROOT_DIR/frontend/dist/frontend"
TARGET_DIR="$ROOT_DIR/deploy/hostinger/site"

echo "[1/4] Building frontend workspace..."
cd "$ROOT_DIR"
npm run build:frontend

echo "[2/4] Preparing deploy directory..."
rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"

echo "[3/4] Copying static artifacts..."
cp -R "$FRONTEND_DIST"/. "$TARGET_DIR"/

echo "[4/4] Creating SPA rewrite .htaccess..."
cat > "$TARGET_DIR/.htaccess" <<'HTACCESS'
Options -MultiViews
RewriteEngine On
RewriteBase /

# Serve existing files directly
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Angular SPA fallback
RewriteRule ^ index.html [L]
HTACCESS

echo "Done. Upload the contents of: $TARGET_DIR"
echo "Suggested destination on Hostinger Sites: public_html/"
