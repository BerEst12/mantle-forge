# Installer

Bootstrap Mantle Forge for Hermes from a cloned repo.

## Plugin install (one line per runtime)

```bash
npm install && npm run plugin:hermes
npm install && npm run plugin:cursor
npm install && npm run plugin:codex
npm install && npm run plugin:claude
npm install && npm run plugin:openclaw
```

Verify: `npm run plugin:verify`. Docs: `docs/plugins/`.

## Quick start (legacy — skills copy only)

Use when you need flat skills in `~/.hermes/skills/` without the plugin bundle:

**WSL / macOS / Linux:**

```bash
./installer/install.sh
```

**Windows (PowerShell):**

```powershell
npm install
node installer/setup.js --copy --repo .
```

Dev mode (live skill edits from repo):

```bash
./installer/install.sh --dev
```

Via npm bin from repo root after `npm install`:

```bash
npx mantle-forge init
npx mantle-forge init --dev
```

## What it does

1. `check-env.js` — Node 20+, Git, optional Hermes warning
2. `npm install` — workspace CLIs (`mantle-scaffold`, etc.)
3. Skills — copy flat `mantle-*` dirs into Hermes `skills/` (see `hermes-home.js`) or wire `external_dirs`
4. Smoke — `npm run test:tools`

## Files

| File | Role |
|------|------|
| `install.sh` | Legacy entry (skills copy + npm) |
| `install-plugin.js` | Per-vendor plugin install |
| `verify-plugin.js` | Bundle structure + CLI smoke |
| `check-env.js` | Prerequisites |
| `setup.js` | Skills copy / dev wiring / smoke |
| `cli.js` | `mantle-forge init` / `mantle-forge install --<vendor>` |

Human smoke: `knowledge/installer-docs-smoke-test.md`
