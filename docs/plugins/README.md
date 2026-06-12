# Mantle Forge plugins

One command per runtime. From repo root:

## One-liner per plugin

| Runtime | First time (clone + install) | Reinstall |
|---------|------------------------------|-----------|
| **Hermes** | `npm install && npm run plugin:hermes` | `npm run plugin:hermes` |
| **Cursor** | `npm install && npm run plugin:cursor` | `npm run plugin:cursor` |
| **Codex** | `npm install && npm run plugin:codex` | `npm run plugin:codex` |
| **Claude** | `npm install && npm run plugin:claude` | `npm run plugin:claude` |
| **OpenClaw** | `npm install && npm run plugin:openclaw` | `npm run plugin:openclaw` |
| **OpenCode** | `npm install && npm run plugin:opencode` | `npm run plugin:opencode` |

Verify:

```bash
npm run plugin:verify
```

## What each script does

| Script | Installs |
|--------|----------|
| `plugin:hermes` | Python plugin → WSL `~/.hermes/plugins/mantle-forge` (Windows defaults to WSL) |
| `plugin:cursor` | Symlink → `~/.cursor/plugins/local/mantle-forge` |
| `plugin:codex` | Marketplace + `codex plugin install` when `codex` is on PATH |
| `plugin:claude` | Prepares marketplace; then in Claude Code run `/plugin marketplace add` + `/plugin install` |
| `plugin:openclaw` | `openclaw plugins install --link` + enable when `openclaw` is on PATH |
| `plugin:opencode` | Skills → `.opencode/skills/` + `MANTLE_FORGE_ROOT` |

## Detailed guides

- [Hermes](./install-hermes.md)
- [Cursor](./install-cursor.md)
- [Codex](./install-codex.md)
- [Claude](./install-claude.md)
- [OpenClaw](./install-openclaw.md)
- [OpenCode](./install-opencode.md)

## Architecture

```text
plugins/mantle-forge/         → Cursor, Codex, Claude, OpenClaw, OpenCode
plugins/hermes-mantle-forge/  → Hermes (Python tools)
tools/mantle-*                → CLIs (source of truth)
```

## Flagship demo

```txt
Create a Mantle Sepolia-ready token vault project from scratch.
Add tests, run a security review, optimize gas where possible,
deploy it to Mantle Sepolia, and generate an engineering report.
```
