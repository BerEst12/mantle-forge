---
id: roadmap
title: Roadmap
sidebar_label: Roadmap
---

# Roadmap

**Mantle Forge** is a Mantle-native plugin toolkit for coding agents — not another runtime. The goal is clear: give any coding agent the skills, tools, and workflows to go from natural-language intent to a tested, reviewed, gas-analyzed, and deployed Mantle project.

This roadmap describes what ships today and where the project goes next.

---

## Delivered — Demo Day Prototype

The core workflow is live and reproducible.

| Area | What was built |
|------|----------------|
| Flagship workflow | One prompt → scaffold → tests → security → gas → deploy → final report |
| Plugin system | Skills, commands, rules, and hooks for Hermes, Cursor, Codex, Claude Code, OpenClaw, OpenCode |
| CLI toolchain | 16 deterministic tools for scaffold, audit, harden, gas, deploy, scan, and report |
| Hermes demo | Native Hermes-oriented workflow for the hackathon demo |
| Tencent Cloud | Hunyuan second-opinion audit + COS artifact publishing |
| DeFi data layer | 17 skills for prices, TVL, Merchant Moe, Mantlescan, wallet, and protocol data |
| Team gateways | Discord and Telegram command surfaces |
| Documentation | Public docs, architecture, plugin guides, and reproducible demo materials |

One working end-to-end example: TokenVault deployed and verified on Mantle Sepolia. See `examples/demo-runs/`.

---

## Q3 2026 — Stabilize Developer Experience

The Q3 focus is not more scope. It is making the current prototype easier to install, trust, reproduce, and extend.

### Productize onboarding

Right now the first-run experience requires too much prior knowledge.

- Publish a stable `npm` package so `npx mantle-forge` works out of the box
- Improve setup error messages so failures point to a fix, not a stack trace
- Add a "try it in 10 minutes" quickstart that ends with a real Sepolia deployment
- Add reproducible demo recipes with expected output so contributors and evaluators can validate the workflow

### Harden runtime integrations

The install scripts exist. The next step is better validation inside each runtime UI.

- Manual smoke tests for Cursor, Codex, Claude Code, OpenClaw, and OpenCode
- Runtime-specific troubleshooting guides for the most common failure modes
- A clear support matrix: **stable**, **experimental**, **planned**
- Consistent skill names and command shortcuts across all runtimes

### Expand Mantle project templates

Today there is one starter template (TokenVault). The next step is a usable catalog.

| Template | Description |
|----------|-------------|
| `nft-minter` | ERC-721 mint with phases, allowlist, and royalties |
| `staking-vault` | ERC-20 staking with rewards and emergency withdraw |
| `token-launcher` | Standard ERC-20 with minting controls and Mantle Sepolia pre-config |
| `defi-vault` | Yield-bearing vault with deposit, withdraw, and fee logic |
| `frontend-ready-dapp` | Contract + minimal frontend scaffold, deployable together |

Each template includes: Hardhat tests, Mantle Sepolia config, security assumptions, gas analysis hooks, and report generation.

### Support existing Solidity projects

Not every user starts from scratch. The "harden an existing project" workflow should be a first-class path.

- Detect existing Hardhat or Foundry structure automatically
- Add Mantle Sepolia config where it is missing, without overwriting what is there
- Run security and gas checks without touching the project structure
- Generate a migration-oriented `FINAL_REPORT.md`

### Polish Mantlescan verification

The deploy → verify loop should feel complete, not like a manual last step.

- Clear documentation for the verify flow after deployment
- Better fallback messages when explorer verification times out
- Capture verified source links inside the final report automatically

---

## Q4 2026 — Reliable Platform

The Q4 goal is turning a strong hackathon prototype into something teams can use repeatedly.

### Lightweight execution dashboard

A minimal view of what happened during a run — no heavy SaaS, just visibility.

- Run history with tool calls, reports, and deployment artifacts
- Transaction hashes and Mantlescan links per run
- Security and gas summaries in one place

The dashboard should not become a product before the execution layer is solid. Lightweight first.

### MCP server

Expose Mantle Forge tools through a standard interface that works beyond vendor-specific plugin formats.

- Standard tool invocation layer accessible to any MCP-compatible agent
- Reduced duplication across runtime adapters
- Cleaner path for local and remote tool execution

### Separated agent roles

The current workflow uses one agent for everything. Splitting responsibilities produces cleaner artifacts.

Planned roles:
- **Builder** — scaffold and write
- **Security reviewer** — static analysis, fuzz, triage
- **Gas analyst** — measurement and optimization suggestions
- **Deployment operator** — deploy, verify, capture artifacts
- **Report generator** — collect and format outputs

The goal is better artifacts, not agent theater.

### Team-ready gateways

Discord and Telegram already work as command surfaces. The next step is making them useful for teams.

- Permissions per user or role
- Shared run history and artifacts
- Review logs accessible to the full team
- Confirmation step before any deploy-related action

### Distribution

- Stable releases with changelogs
- Marketplace submissions for supported runtimes where applicable
- Example repositories per major template
- Developer guides for Mantle ecosystem builders

---

## Longer-Term Direction

Mantle Forge should become the default execution layer for coding agents building on Mantle.

Areas under consideration (not committed):

- Mainnet-ready deployment workflows with stronger safety gates
- Regression testing across template updates
- Partner integrations for audits, storage, monitoring, and on-chain verification
- Template packs for common Mantle DeFi and NFT patterns
- Enterprise workflows for agencies, hackathon teams, and protocol developers

---

## Non-Goals

Staying focused matters more than adding scope.

Mantle Forge is **not** building:

- A custom agent runtime
- A generic multi-chain toolkit before Mantle is solid
- A professional audit replacement
- A chat-only assistant
- A heavy SaaS dashboard before the execution layer is reliable
- A closed platform that forces developers off their existing tools

---

## Positioning

Mantle Forge is not another AI assistant. It is operational infrastructure for autonomous blockchain development on Mantle.

**Agents orchestrate. Deterministic tools do the verifiable work. Mantle Forge connects both.**

One prompt in. A tested, reviewed, gas-analyzed, deployed Mantle project out.

**Build. Harden. Deploy. On Mantle.**
