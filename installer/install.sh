#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
DEV=false

usage() {
  cat <<'EOF'
Mantle Forge installer

Usage:
  ./installer/install.sh [--dev]

  --dev   Wire Hermes external_dirs to repo hermes/skills (live edits)
  default Copy skills to Hermes skills dir (flat mantle-* dirs)
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dev) DEV=true; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage; exit 1 ;;
  esac
done

echo "==> Mantle Forge install (repo: ${REPO_ROOT})"

node "${SCRIPT_DIR}/check-env.js"

cd "${REPO_ROOT}"
echo "==> Installing npm workspaces..."
npm install --no-fund --no-audit

if [[ "${DEV}" == "true" ]]; then
  node "${SCRIPT_DIR}/setup.js" --dev --repo "${REPO_ROOT}"
else
  node "${SCRIPT_DIR}/setup.js" --copy --repo "${REPO_ROOT}"
fi

node "${SCRIPT_DIR}/setup.js" --smoke --repo "${REPO_ROOT}"

cat <<EOF

==> Mantle Forge is ready.

Plugin install (one line per runtime):
  npm run plugin:hermes     # Hermes (WSL on Windows)
  npm run plugin:cursor     # Cursor
  npm run plugin:codex      # Codex
  npm run plugin:claude     # Claude Code
  npm run plugin:openclaw   # OpenClaw
  npm run plugin:verify     # smoke checks
  Docs: docs/plugins/

Next steps:
  1. Configure Hermes LLM: hermes setup --portal  (or hermes model)
  2. Fund a Sepolia test wallet: knowledge/demo-wallet-setup.md
  3. Run the flagship prompt in Hermes Desktop (or: hermes desktop --cwd <workspace>)

Flagship prompt:
  Create a Mantle Sepolia-ready token vault project from scratch.
  Add tests, run a security review, optimize gas where possible,
  deploy it to Mantle Sepolia, and generate an engineering report.

CLI quick test (from repo root):
  npx mantle-scaffold token-vault ./my-vault
  npx mantle-check ./my-vault

Docs: docs/docusaurus/ (npm install && npm run build)
EOF
