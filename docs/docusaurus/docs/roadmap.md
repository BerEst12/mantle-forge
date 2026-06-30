---
id: roadmap
title: Roadmap
sidebar_label: Roadmap
pagination_prev: null
pagination_next: null
---

# Roadmap

Mantle Forge is moving from a working hackathon prototype to a reliable Mantle developer platform. We are not building another agent runtime — we give existing coding agents a reliable Mantle execution layer.

---

## Delivered

| Area | What was built |
|------|----------------|
| Flagship workflow | One prompt → scaffold → tests → security review → gas analysis → deploy → final report |
| Plugin system | Skills, commands, rules, and hooks for Hermes, Cursor, Codex, Claude Code, OpenClaw, OpenCode |
| CLI toolchain | Deterministic CLI tools for scaffold, audit, harden, gas, deploy, scan, and report |
| Tencent Cloud | Hunyuan second-opinion security review + COS artifact publishing |
| DeFi data layer | Skills for prices, TVL, Merchant Moe, Mantlescan, wallet, and protocol data |
| Team gateways | Discord and Telegram command surfaces |

One working end-to-end example: TokenVault deployed and verified on Mantle Sepolia. See `examples/demo-runs/`.

---

## Q3 2026 — Stabilize

- Publish a stable `npm` package — goal: `npx mantle-forge` works out of the box
- Add a "try it in 10 minutes" quickstart with a real Sepolia deployment
- Manual smoke tests and troubleshooting guides per runtime
- Expand templates: `nft-minter`, `staking-vault`, `token-launcher`, `defi-vault`, `frontend-ready-dapp`
- Support existing Hardhat/Foundry projects without overwriting their structure

---

## Q4 2026 — Reliable Platform

- Lightweight run history dashboard (artifacts, tx hashes, Mantlescan links)
- MCP server for runtime-agnostic tool invocation
- Separated agent roles: Builder · Security reviewer · Gas analyst · Deployment operator
- Stable releases and marketplace submissions

---

## Non-Goals

Not building: another agent runtime · a professional audit replacement · a multi-chain toolkit before Mantle is solid · a heavy SaaS dashboard.

---

The goal is simple: any developer building on Mantle should be able to go from idea to deployed, security-reviewed, and documented contract — in one session, with one prompt.

**Agents orchestrate. Deterministic tools do the verifiable work. Mantle Forge connects both.**
