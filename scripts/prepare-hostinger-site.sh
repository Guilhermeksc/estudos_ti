#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
FRONTEND_DIST="$ROOT_DIR/frontend/dist"
TARGET_DIR="$ROOT_DIR/dist"

echo "[1/4] Building frontend workspace..."
cd "$ROOT_DIR"
npm run build:frontend

echo "[2/4] Preparing deploy directory..."
rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"

echo "[3/4] Copying static artifacts..."
STATIC_SOURCE="$FRONTEND_DIST"
if [ -d "$FRONTEND_DIST/browser" ]; then
	STATIC_SOURCE="$FRONTEND_DIST/browser"
fi

cp -R "$STATIC_SOURCE"/. "$TARGET_DIR"/

if [ -f "$FRONTEND_DIST/3rdpartylicenses.txt" ]; then
	cp "$FRONTEND_DIST/3rdpartylicenses.txt" "$TARGET_DIR/3rdpartylicenses.txt"
fi

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
