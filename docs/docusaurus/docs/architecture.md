# Architecture

Mantle Forge is an **execution layer**, not another agent runtime. Any supported coding agent drives the same deterministic toolchain: it follows **skills**, invokes **CLI tools**, and uses **templates + Mantle knowledge** to ship verifiable work on **Mantle Sepolia**.

![Mantle Forge architecture — six tiers from coding agents down to Mantle Sepolia](/img/architecture.svg)

> Full-resolution source: [`docs/architecture/mantle-forge-architecture.drawio`](https://github.com/BerEst12/mantle-forge/blob/main/docs/architecture/mantle-forge-architecture.drawio) · [PNG](/img/architecture.png)

## The six tiers

### Tier 1 — Coding agents
The entry point. **Hermes** (flagship, native Python tools) plus **Cursor, Codex, Claude Code, OpenClaw, OpenCode**. The developer describes intent in natural language; the agent orchestrates the pipeline.

### Tier 2 — Installer & adapter
`npm run plugin:<vendor>` runs `install-plugin.js` to wire the right bundle into each runtime; `npm run plugin:verify` confirms the install. Canonical skills and agents are projected per runtime.

### Tier 3 — Mantle Forge plugins
- **`plugins/mantle-forge`** — universal bundle for all non-Hermes agents (skills, rules, hooks, commands, scripts).
- **`plugins/hermes-mantle-forge`** — Hermes-native plugin with registered Python tools.
- **26 skills**: **7 engineering** (scaffold · check · audit · gas · deploy · report) + **2 Tencent Cloud** (Hunyuan audit · COS upload) + **17 DeFi data** (prices · TVL · yields · lending · mETH · Merchant Moe · Mantlescan · wallet — 7 CLI-backed, 10 public-API).

### Tier 4 — CLI execution layer
The deterministic core in `tools/`: `mantle-scaffold`, `mantle-check`, `mantle-audit`, `mantle-gas-report`, `mantle-deploy`, `mantle-report`, plus `mantle-scan-*` and `mantle-moe-*` data CLIs. Agents orchestrate; **CLIs do the verifiable work**.

### Tier 5 — Templates & knowledge
`hardhat-mantle-starter` and the `token-vault` DeFi starter, plus `knowledge/` (network config, Sepolia params). The pipeline produces a real Hardhat project, tests, contracts, and a `FINAL_REPORT.md` deliverable.

### Tier 6 — Mantle Sepolia
The target testnet — **Chain ID 5003 · MNT**. RPC endpoint, Mantlescan explorer, deployed contracts (tx hash + address), and a funded deployer wallet. This is where evidence is produced: on-chain artifacts, not claims.

## Design principles

- **Deterministic tools, not improvised pipelines** — agents call CLIs; CLIs are testable and reproducible.
- **Evidence over claims** — every run yields deploy JSON, tx hashes, test output, and reports.
- **Agent-assisted hardening, not audits** — security output is clearly labeled.
- **Portable** — Hermes is the flagship, but the same skills and CLIs run on every supported runtime.
