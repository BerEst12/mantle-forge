# Mantle Forge — Project Summary

Condensed from `mantle-forge-for-hermes-winning-project-doc.md`. Full source remains the authoritative spec.

## Identity

| Field | Value |
|-------|-------|
| Name | Mantle Forge |
| Tagline | Build. Harden. Deploy. On Mantle. |
| Runtimes | Hermes · Cursor · Codex · Claude · OpenClaw · OpenCode |
| Hackathon | The Turing Test Hackathon 2026 — Phase 2 (AI Awakening) |
| Track | AI DevTools |
| Repo | `mantle-forge` |

## One-liner

Mantle Forge is a Mantle-native execution layer for coding agents — plugins bundle skills and workflows; CLI tools execute deterministically. One prompt can build, harden, test, optimize, deploy, and document smart contract projects on Mantle Sepolia.

## Thesis

Do **not** build another agent runtime. Ship **plugins** for any supported coding agent:

- multi-vendor plugin bundles
- skills (inside plugins)
- CLI tools
- workflows
- templates
- curated Mantle context
- deployment automation

## Problem

Building on Mantle requires many repetitive, high-stakes steps: network config, templates, contracts, tests, security checks, gas analysis, deploy scripts, env vars, testnet deploy, verification, and documentation. Generic AI agents lack ecosystem-specific context and deterministic tooling to ship Mantle-ready projects reliably.

## Solution (five layers)

1. **Mantle Forge Plugins** — skills, commands, rules, hooks per runtime
2. **Mantle Tool Layer** — CLI tools for deterministic actions
3. **Mantle Workflow Pack** — build, harden, test, deploy, report flows
4. **Mantle Knowledge Pack** — network config, checklists, troubleshooting
5. **Installer** — `npm run plugin:<vendor>` one-command setup

## Target user

Developers and teams on Mantle who want an **autonomous engineering agent**, not a documentation chatbot: hackathon builders, Solidity devs, small Web3 teams, DevRel, reviewers, ecosystem teams.

## Winning positioning

> Mantle-native execution layer that gives coding agents the plugins, skills, tools, workflows, and context required to operate as real Mantle developers.

**Avoid:** chatbot, generic assistant, runtime replacement, dashboard-first product, universal agent OS.

## What Hermes must do (from one prompt)

1. Create project folder and scaffold Hardhat Mantle project
2. Generate Solidity, tests, deploy scripts
3. Configure Mantle Sepolia
4. Run tests and gas analysis
5. Run agent-assisted security review and apply safe fixes
6. Deploy to Mantle Sepolia
7. Produce engineering report (tests, gas, security, address, tx hash)

See `project-summary-demo.md` for the flagship prompt and report schema.

## Related docs

- `project-summary-architecture.md` — repo layout, tools, skills
- `project-summary-demo.md` — demo script, judging, milestones, risks
- Working spec — see `README.md` and `docs/SUBMISSION.md`
