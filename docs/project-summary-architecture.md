# Project Summary — Architecture and Scope

Visual diagram: [docs/architecture/mantle-forge-architecture.drawio](./architecture/mantle-forge-architecture.drawio)

## MVP (in scope)

- **Multi-vendor plugins** — `npm run plugin:<vendor>` for Hermes, Cursor, Codex, Claude, OpenClaw, OpenCode
- **Two plugin artifacts** — `plugins/mantle-forge/` (compatible bundle) + `plugins/hermes-mantle-forge/` (Hermes native)
- Hardhat Mantle project template + Mantle Sepolia configuration
- **24 skills** in compatible bundle (7 engineering from `hermes/skills/` + 17 DeFi data in `plugins/mantle-forge/skills/`)
- **Plugin bundle extras** — commands, rules, hooks, scripts
- Workflows: full build-harden-deploy (flagship), harden existing, deploy existing
- CLI tools: 6 engineering (`mantle-scaffold` … `mantle-report`) + 7 DeFi data (`mantle-scan-*`, `mantle-moe-*`)
- Verify: `npm run plugin:verify`; legacy: `install.sh`
- Docusaurus docs site
- Optional Discord / Telegram setup guides

## Not MVP

- Custom agent runtime
- Complex dashboard
- Multi-chain support
- Skill marketplace
- Production-grade audit engine
- Full static analyzer from scratch
- WhatsApp integration

## Repository structure

```txt
plugins/
  mantle-forge/           compatible plugin (Cursor, Codex, Claude, OpenClaw, OpenCode)
    skills/ hooks/ scripts/ commands/ rules/
  hermes-mantle-forge/    Hermes native plugin (Python tools)
.opencode/                OpenCode install instructions
installer/                install-plugin.js, verify-plugin.js, install.sh
hermes/
  skills/                 skill source (synced into plugins)
  workflows/
  system-instructions/
tools/mantle-*            CLI execution layer
templates/                hardhat-mantle-starter, token-vault
knowledge/                network config, checklists
docs/docusaurus/          site + docs/plugins/
```

## Plugin architecture

| Layer | Role |
|-------|------|
| Coding agent | Orchestrates via plugin skills/commands |
| Mantle Forge plugin | Skills + rules + hooks (+ Hermes native tools) |
| CLI tools | Deterministic scaffold, check, audit, gas, deploy, report |
| Templates + Sepolia | Hardhat projects, on-chain deploy |

## CLI tools

| Tool | Role |
|------|------|
| `mantle-scaffold` | Create Hardhat project from template |
| `mantle-check` | Validate Mantle-ready project |
| `mantle-gas-report` | Gas analysis output |
| `mantle-audit` | Agent-assisted security review (not a pro audit) |
| `mantle-deploy` | Deploy to Mantle Sepolia |
| `mantle-report` | Merge outputs into `FINAL_REPORT.md` |

## Skills (inside plugins)

**7 engineering** (flagship workflow) + **17 DeFi data** (prices, TVL, yields, MoE, Mantlescan, wallet). Full catalog: `docs/docusaurus/docs/skills.md`.

| Engineering skill | Purpose |
|-------------------|---------|
| Mantle Project Scaffold | New Mantle-ready project from NL request |
| Mantle Hardhat Config | Fix/validate Hardhat for Mantle Sepolia |
| Mantle Security Review | Practical Solidity review + findings |
| Mantle Gas Analysis | Gas reporter + safe optimization notes |
| Mantle Test Runner | Run tests, capture failures, suggest fixes |
| Mantle Deploy Sepolia | Deploy and capture address + tx hash |
| Mantle Report Generator | Produce `FINAL_REPORT.md` |

## Installer flow

1. `npm install` — workspace CLIs
2. `npm run plugin:<vendor>` — install plugin for one runtime (auto syncs skills)
3. `npm run plugin:verify` — bundle structure + CLI tests + Hermes WSL smoke

**Legacy (`install.sh`):** copy skills to `~/.hermes/skills/` only — prefer plugins.

## Required environment variables

```bash
MANTLE_SEPOLIA_RPC_URL=
MANTLE_PRIVATE_KEY=
MANTLE_EXPLORER_API_KEY=
OPENROUTER_API_KEY=
GITHUB_TOKEN=
```

## Demo strategy

**Hermes Desktop** — flagship video with verified Sepolia deploy.  
**Other runtimes** — same plugin skills + CLIs; optional B-roll for multi-agent story.
