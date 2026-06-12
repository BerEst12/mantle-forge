# Mantle Forge

**Build. Harden. Deploy. On Mantle.**

Mantle-native engineering toolkit for coding agents. Skills, deterministic CLI tools, Hardhat templates, and Mantle-specific knowledge let **any** supported agent scaffold projects, run tests, perform agent-assisted security review, analyze gas, deploy to **Mantle Sepolia**, and produce a verifiable `FINAL_REPORT.md` — from one natural-language prompt.

[![Hackathon](https://img.shields.io/badge/Turing_Test_2026-AI_DevTools-00D395)](https://dorahacks.io/hackathon/mantleturingtesthackathon2026)
[![Network](https://img.shields.io/badge/Network-Mantle_Sepolia-111827)](https://docs.mantle.xyz/network/for-developers/quick-access)
[![Agents](https://img.shields.io/badge/Agents-Hermes_·_Cursor_·_Codex_·_Claude_·_OpenClaw_·_OpenCode-22D3EE)](https://mantle-forge-0.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-F5F5F5)](LICENSE)

---

## Quickstart

Give your agent Mantle Forge:

**[Hermes](#hermes)** · **[Cursor](#cursor)** · **[Codex](#codex)** · **[Claude Code](#claude-code)** · **[OpenClaw](#openclaw)** · **[OpenCode](#opencode)**

```bash
git clone https://github.com/BerEst12/mantle-forge
cd mantle-forge
npm install && npm run plugin:<your-runtime>   # see Installation below
npm run plugin:verify
```

Live docs: [mantle-forge-0.vercel.app](https://mantle-forge-0.vercel.app)

---

## How it works

You describe what you want on Mantle. Your coding agent does not improvise the whole pipeline — it follows **skills** (workflows), invokes **deterministic CLI tools** (scaffold, check, audit, gas, deploy, report), and uses **templates + knowledge** tuned for Mantle Sepolia.

```
  Developer prompt (Hermes · Cursor · Codex · Claude · OpenClaw · OpenCode)
           │
           ▼
  ┌─────────────────────────────────────┐
  │  Mantle Forge plugins               │
  │  skills · commands · rules · hooks  │
  └─────────────────┬───────────────────┘
                    │ invokes
                    ▼
  ┌─────────────────────────────────────┐
  │  CLI tools (deterministic layer)    │
  │  scaffold · check · audit · gas ·   │
  │  deploy · report                    │
  └─────────────────┬───────────────────┘
                    │
                    ▼
  ┌─────────────────────────────────────┐
  │  Hardhat templates + Mantle Sepolia │
  └─────────────────────────────────────┘
```

Interactive overview: [`docs/architecture-visual.html`](docs/architecture-visual.html)

**Hermes** is the flagship hackathon demo (native Python tools + Desktop). Other runtimes use the compatible plugin bundle with the same skills and CLIs.

---

## Installation

Installation differs by harness. If you use more than one, install Mantle Forge separately for each.

### Hermes

Hermes gets a native Python plugin with registered tools.

```bash
npm install && npm run plugin:hermes    # WSL default on Windows
npm run plugin:verify
hermes plugins list                     # mantle-forge should be enabled
```

Guide: [`docs/plugins/install-hermes.md`](docs/plugins/install-hermes.md)

### Cursor

```bash
npm install && npm run plugin:cursor
```

Reload: **Developer → Reload Window**. Or in Agent chat: `/add-plugin mantle-forge`

Guide: [`docs/plugins/install-cursor.md`](docs/plugins/install-cursor.md)

### Codex

```bash
npm install && npm run plugin:codex
```

Guide: [`docs/plugins/install-codex.md`](docs/plugins/install-codex.md)

### Claude Code

```bash
npm install && npm run plugin:claude
```

Then in Claude Code:

```
/plugin marketplace add <path-to-this-repo>
/plugin install mantle-forge@mantle-forge
```

Guide: [`docs/plugins/install-claude.md`](docs/plugins/install-claude.md)

### OpenClaw

```bash
npm install && npm run plugin:openclaw
```

Guide: [`docs/plugins/install-openclaw.md`](docs/plugins/install-openclaw.md)

### OpenCode

```bash
npm install && npm run plugin:opencode
```

Or tell OpenCode:

```
Fetch and follow instructions from https://raw.githubusercontent.com/BerEst12/mantle-forge/main/.opencode/INSTALL.md
```

Guide: [`docs/plugins/install-opencode.md`](docs/plugins/install-opencode.md) · [`.opencode/INSTALL.md`](.opencode/INSTALL.md)

---

## The Mantle workflow

1. **Scaffold** — Hardhat project from `token-vault` or starter template
2. **Test** — Hardhat test suite
3. **Harden** — Agent-assisted security review → `reports/security.md`
4. **Gas** — Analysis → `reports/gas.md`
5. **Deploy** — Mantle Sepolia with tx hash + artifacts
6. **Report** — `FINAL_REPORT.md` with full engineering summary

### Flagship demo prompt

Paste into your agent after install:

```txt
Create a Mantle Sepolia-ready token vault project from scratch.
Add tests, run a security review, optimize gas where possible,
deploy it to Mantle Sepolia, and generate an engineering report.
```

Verified on Mantle Sepolia: TokenVault [`0x64D825eDcE57d56365bEb026CEAe4D2D439f7874`](https://sepolia.mantlescan.xyz/address/0x64D825eDcE57d56365bEb026CEAe4D2D439f7874) (latest E2E, 2026-06-07). More: [`examples/demo-runs/`](examples/demo-runs/)

---

## What's inside

### Skills library

**26 skills** in the compatible plugin bundle — **7 engineering** + **2 Tencent Cloud** + **17 DeFi data**. Hermes native plugin ships the 7 engineering skills plus 6 Python tools.

#### Engineering (flagship workflow)

| Skill | Purpose |
|-------|---------|
| `mantle-project-scaffold` | Create Hardhat projects from templates |
| `mantle-hardhat-config` | Mantle Sepolia network configuration |
| `mantle-test-runner` | Run and interpret Hardhat tests |
| `mantle-security-review` | Agent-assisted hardening checklist |
| `mantle-gas-analysis` | Gas profiling and optimization notes |
| `mantle-deploy-sepolia` | Deploy to Mantle Sepolia |
| `mantle-report-generator` | Produce `FINAL_REPORT.md` |

#### Tencent Cloud (deep audit + artifact publishing)

| Skill | Purpose |
|-------|---------|
| `mantle-tencent-audit` | Deep AI security audit (Tencent Hunyuan direct **or** via OpenRouter) with Mantle L2-specific checks |
| `mantle-cos-upload` | Publish pipeline artifacts to Tencent Cloud COS for public verification |

```bash
# Deep audit — set ONE provider key (auto-detected, or force with --provider)
export TENCENT_HUNYUAN_API_KEY=<key>          # Tencent Cloud direct
#   …or…
export OPENROUTER_API_KEY=sk-or-<key>         # OpenRouter → Tencent Hunyuan + 500+ models
npx mantle-tencent-audit ./my-vault --out reports/tencent-audit.md
#   force a provider / model:
npx mantle-tencent-audit ./my-vault --provider openrouter --model tencent/hunyuan-a13b-instruct

npx mantle-cos-upload ./my-vault --out reports/cos-upload.md
```

#### DeFi data (read-only, no deploy)

Prices, TVL, yields, lending, Merchant Moe pools/swap quotes, Mantlescan tx lookup, wallet overview — see [Skills docs](https://mantle-forge-0.vercel.app/docs/skills).

### CLI tools

**6 engineering CLIs** (flagship pipeline) + **2 Tencent Cloud CLIs** + **7 DeFi data CLIs** (Mantlescan + Merchant Moe).

```bash
npx mantle-scaffold token-vault ./my-vault
npx mantle-check ./my-vault
npx mantle-gas-report ./my-vault --out reports/gas.md
npx mantle-audit ./my-vault --out reports/security.md
npx mantle-deploy ./my-vault --network mantleSepolia
npx mantle-report ./my-vault --out FINAL_REPORT.md
```

Test: `npm run test:tools` · Full catalog: [Tools docs](https://mantle-forge-0.vercel.app/docs/tools)

### Also ships

- **Templates** — `hardhat-mantle-starter`, `token-vault`
- **Knowledge** — deployment checklist, security checklist, gas notes
- **Workflows** — flagship build → harden → deploy → report
- **System instructions** — `mantle-dev-agent`, `security-reviewer`, `deployment-operator`

---

## Philosophy

- **Execution layer, not another runtime** — specialize agents for Mantle; don't rebuild Hermes/Cursor/Codex
- **Deterministic tools** — agents orchestrate; CLIs do the verifiable work
- **Evidence over claims** — deploy artifacts, tx hashes, test output, reports
- **Agent-assisted hardening** — not professional audits
- **Mantle Sepolia default** — chainId `5003`

---

## Repository layout

```
mantle-forge/
  plugins/
    mantle-forge/           # Cursor, Codex, Claude, OpenClaw, OpenCode skills
      skills/ hooks/ scripts/ commands/ rules/
    hermes-mantle-forge/    # Hermes native Python plugin + tools
  .cursor-plugin/           # Cursor marketplace manifest
  .claude-plugin/           # Claude marketplace manifest
  .agents/plugins/          # Codex marketplace manifest
  .opencode/                # OpenCode install instructions
  hermes/                   # Skill source, workflows, system instructions
  tools/                    # Mantle CLI toolchain (source of truth)
  templates/                # Hardhat starters and token-vault demo
  installer/                # install-plugin.js, install.sh, mantle-forge CLI
  hooks/                    # Repo-level hook references (see plugins/mantle-forge/hooks)
  scripts/                  # Shared installer / verify scripts
  knowledge/                # Mantle + agent setup guides
  docs/                     # Docusaurus site, plugins/, architecture visual
  examples/                 # Demo run samples and deployment JSON
```

---

## Hackathon submission

| Field | Detail |
|-------|--------|
| **Event** | [The Turing Test Hackathon 2026](https://dorahacks.io/hackathon/mantleturingtesthackathon2026) — Phase 2: AI Awakening |
| **Track** | AI DevTools |
| **Product** | Mantle Forge — Mantle execution layer for coding agents |
| **Thesis** | Do not build another agent runtime. Give any coding agent Mantle-native skills, tools, and workflows. |
| **Submission** | [`docs/SUBMISSION.md`](docs/SUBMISSION.md) |

---

## Environment variables

Copy [`.env.example`](.env.example):

```bash
MANTLE_SEPOLIA_RPC_URL=      # Required for deploy
MANTLE_PRIVATE_KEY=          # Required for deploy (never commit)
MANTLE_EXPLORER_API_KEY=     # Optional — contract verification
OPENROUTER_API_KEY=          # Hermes LLM provider
```

Setup: [`hermes/README.md`](hermes/README.md) · [`knowledge/demo-wallet-setup.md`](knowledge/demo-wallet-setup.md)

---

## Documentation

| Resource | Path |
|----------|------|
| Plugin guides | [`docs/plugins/`](docs/plugins/) |
| Docusaurus site | [`docs/docusaurus/`](docs/docusaurus/) |
| Agent instructions | [`AGENTS.md`](AGENTS.md) |
| Submission package | [`docs/SUBMISSION.md`](docs/SUBMISSION.md) |

---

## License

MIT — see [LICENSE](LICENSE).
