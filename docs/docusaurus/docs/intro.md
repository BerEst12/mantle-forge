# Introduction

**Mantle Forge** is a Mantle-native **plugin toolkit** for coding agents. Install one plugin for your runtime — it bundles skills, commands, rules, and hooks that drive deterministic CLI tools and Hardhat templates on **Mantle Sepolia**.

## Supported runtimes

| Runtime | Install |
|---------|---------|
| Hermes | `npm run plugin:hermes` |
| Cursor | `npm run plugin:cursor` |
| Codex | `npm run plugin:codex` |
| Claude Code | `npm run plugin:claude` |
| OpenClaw | `npm run plugin:openclaw` |
| OpenCode | `npm run plugin:opencode` |

Hermes is the **flagship demo** (native Python tools + verified on-chain deploys). All other runtimes use the compatible plugin bundle with the same skills and CLIs.

## Thesis

Do not build another agent runtime. Ship **plugins** that give any coding agent Mantle-native workflows — skills orchestrate; CLI tools execute.

## What a plugin includes

- **26 skills** across three layers:
  - **Engineering (7)** — scaffold → test → harden → gas → deploy → report
  - **Tencent Cloud (2)** — Hunyuan deep audit + COS artifact upload
  - **DeFi data (17)** — prices, TVL, yields, lending, mETH, Merchant Moe, Mantle Scan, wallet (7 CLI-backed + 10 public-API)
- **16 CLI tools** — 7 engineering (`mantle-scaffold` … `mantle-report`, incl. `mantle-harden`) + 2 Tencent Cloud (`mantle-tencent-audit`, `mantle-cos-upload`) + 7 DeFi data (Mantlescan + Merchant Moe — prices, TVL, yields, swap quotes, wallet/tx lookup)
- **Commands & rules** — flagship workflow shortcuts (Cursor, Claude, OpenClaw)
- **Hooks** — session env check for `MANTLE_FORGE_ROOT`
- **Hermes only:** native Python tools (`mantle_scaffold`, …)

Details: [Architecture](./architecture) · [Plugins overview](./plugins/) · Per-runtime: [Install Hermes](./plugins/install-hermes) · [Skills](./skills) · [CLI tools](./tools)

## Flagship workflow

```txt
Create a Mantle Sepolia-ready token vault project from scratch.
Add tests, run a security review, optimize gas where possible,
deploy it to Mantle Sepolia, and generate an engineering report.
```

## Quick install

```bash
git clone https://github.com/BerEst12/mantle-forge
cd mantle-forge
npm install && npm run plugin:<your-runtime>
npm run plugin:verify
```

## DeFi data prompts

```txt
What's the current price of MNT?
What's the total TVL on Mantle, and the top protocols?
Show me the best yield opportunities on Mantle right now.
What are the top Merchant Moe pools by APY?
How much USDC do I get for 100 MNT on Merchant Moe?
Show me the transaction history for 0xabc123...
Are there any whale transactions on Mantle in the last hour?
```

## Repo map

```text
plugins/mantle-forge/        # Compatible plugin (Cursor, Codex, Claude, OpenClaw, OpenCode)
plugins/hermes-mantle-forge/ # Hermes native plugin (Python tools)
hermes/skills/               # 7 engineering skills (synced into bundle)
plugins/mantle-forge/skills/ # 26 skills total (7 engineering + 2 Tencent Cloud + 17 DeFi data)
tools/mantle-*               # CLI execution layer (16 CLIs, incl. 7 DeFi data)
installer/                   # install-plugin.js, verify-plugin.js
```
