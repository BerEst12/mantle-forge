# Plugins overview

Mantle Forge ships as **plugins** — not loose skills copied by hand. Each runtime gets a one-line install that wires skills, commands, rules, hooks, and (for Hermes) native Python tools into your agent.

## Install (one line per runtime)

| Runtime | Command | Guide |
|---------|---------|-------|
| **Hermes** | `npm run plugin:hermes` | [Install Hermes](./install-hermes) |
| **Cursor** | `npm run plugin:cursor` | [Install Cursor](./install-cursor) |
| **Codex** | `npm run plugin:codex` | [Install Codex](./install-codex) |
| **Claude** | `npm run plugin:claude` | [Install Claude](./install-claude) |
| **OpenClaw** | `npm run plugin:openclaw` | [Install OpenClaw](./install-openclaw) |
| **OpenCode** | `npm run plugin:opencode` | [Install OpenCode](./install-opencode) |

```bash
git clone https://github.com/BerEst12/mantle-forge
cd mantle-forge
npm install && npm run plugin:<your-runtime>
npm run plugin:verify
```

## Two plugin artifacts

| Artifact | Path | Runtimes | What it provides |
|----------|------|----------|------------------|
| **Compatible bundle** | `plugins/mantle-forge/` | Cursor, Codex, Claude, OpenClaw, OpenCode | Skills, commands, rules, hooks, scripts |
| **Hermes native** | `plugins/hermes-mantle-forge/` | Hermes only | 6 Python tools + full bundle skills (9) on install |

The Hermes plugin ships **7 engineering skills**. The compatible bundle ships **9 skills** (7 engineering + 2 Tencent Cloud). Both use the same **16 CLI tools** in `tools/mantle-*` — including the 7 DeFi data CLIs.

```text
Coding agent
     │
     ▼
Mantle Forge plugin  (skills · commands · rules · hooks)
     │
     ▼
CLI tools  (mantle-scaffold … mantle-report)
     │
     ▼
Hardhat templates + Mantle Sepolia
```

## Compatible bundle (`plugins/mantle-forge/`)

| Path | Purpose |
|------|---------|
| `.cursor-plugin/plugin.json` | Cursor manifest |
| `.claude-plugin/plugin.json` | Claude Code manifest |
| `.codex-plugin/plugin.json` | Codex manifest |
| `skills/` | 9 `mantle-*` skills (7 engineering + 2 Tencent Cloud) |
| `commands/` | Flagship workflow (Claude / OpenClaw) |
| `.cursor/commands/` | Cursor slash commands |
| `rules/` | Cursor rules (`.mdc`) |
| `hooks/hooks.json` | Session-start env check |
| `scripts/verify-env.js` | Validates `MANTLE_FORGE_ROOT` |

Marketplaces at repo root: `.cursor-plugin/`, `.claude-plugin/`, `.agents/plugins/` (Codex).

## Hermes native plugin

`plugins/hermes-mantle-forge/` registers six Python tools Hermes calls directly: `mantle_scaffold`, `mantle_check`, `mantle_audit`, `mantle_gas_report`, `mantle_deploy`, `mantle_report`.

Install → `~/.hermes/plugins/mantle-forge`. Hermes is the **flagship demo** with verified Mantle Sepolia deploys.

## What each runtime loads

| Runtime | Plugin artifact | Agent invokes |
|---------|-----------------|---------------|
| Hermes | Native Python plugin | `mantle_scaffold`, … + skills |
| Cursor | Symlinked bundle | Skills + rules + `/flagship-workflow` → shell CLIs |
| Codex | Marketplace plugin | Skills → shell CLIs |
| Claude | Marketplace plugin | Skills + commands → shell CLIs |
| OpenClaw | Linked bundle | Skills + commands → shell CLIs |
| OpenCode | Skills in `.opencode/skills/` | Native `skill` tool → shell CLIs |

No MCP required. CLIs are the deterministic execution layer.

## Skill sources

| Layer | Count | Authored in | Synced by |
|-------|-------|-------------|-----------|
| Engineering | 7 | `hermes/skills/` | `npm run plugin:sync-skills` |
| Tencent Cloud | 2 | `plugins/mantle-forge/skills/` | Shipped in bundle (not from `hermes/skills/`) |

Compatible bundle total: **9 skills**. DeFi data ships as **7 CLIs** (`tools/mantle-scan/`, `tools/mantle-moe/`), not skills. Hermes native plugin copies the full bundle skills directory on install.

```bash
npm run plugin:sync-skills   # engineering skills only
```

Every `npm run plugin:<vendor>` runs sync before install.

## Environment

Install sets `MANTLE_FORGE_ROOT` in `~/.mantle-forge.env`. Deploy needs:

```bash
MANTLE_SEPOLIA_RPC_URL=
MANTLE_PRIVATE_KEY=
```

See also: [Skills](../skills) (catalog inside plugins) · [CLI tools](../tools)
