# AGENTS — Mantle Forge

Instructions for any coding agent (Hermes, Cursor, Codex, Claude Code, OpenClaw, OpenCode) operating in this repository.

## What this is

**Mantle Forge** is a Mantle-native engineering toolkit for coding agents — skills, deterministic CLI tools, Hardhat templates, and Mantle-specific knowledge. It lets any supported agent scaffold a smart-contract project, run tests, perform agent-assisted security review, analyze gas, deploy to **Mantle Sepolia**, and produce a verifiable `FINAL_REPORT.md` from a natural-language prompt.

This repository is the **execution layer**, not another agent runtime. Agents orchestrate; the CLI tools do the verifiable work.

## Ground rules

- **Deterministic tools first** — prefer the `mantle-*` CLIs (`scaffold`, `check`, `audit`, `gas-report`, `deploy`, `report`) over improvising the pipeline by hand.
- **Evidence over claims** — cite real artifacts: deploy JSON, tx hashes, test output, generated reports. Never invent a tx hash or contract address.
- **Agent-assisted hardening, not audits** — label security output as "agent-assisted security review", never as a professional audit.
- **Mantle Sepolia is the default** — chainId `5003`. Network config lives in the Hardhat templates.
- **Never commit secrets** — `MANTLE_PRIVATE_KEY` and provider API keys live in `.env` (gitignored). Copy `.env.example` to start.
- **English** for all code, docs, and committed artifacts.

## The Mantle workflow

1. **Scaffold** — Hardhat project from a template (`token-vault` or `hardhat-mantle-starter`)
2. **Test** — Hardhat test suite
3. **Harden** — agent-assisted security review → `reports/security.md`
4. **Gas** — analysis → `reports/gas.md`
5. **Deploy** — Mantle Sepolia with tx hash + artifacts
6. **Report** — `FINAL_REPORT.md` engineering summary

## Repository layout

| Path | Contents |
|------|----------|
| `plugins/` | Plugin bundles: `mantle-forge/` (Cursor, Codex, Claude, OpenClaw, OpenCode) and `hermes-mantle-forge/` (native Python) |
| `.cursor-plugin/`, `.claude-plugin/`, `.agents/plugins/` | Marketplace manifests per runtime |
| `.opencode/` | OpenCode install instructions |
| `hermes/` | Skill source, workflows, system instructions |
| `tools/` | Mantle CLI toolchain (source of truth) |
| `templates/` | Hardhat starters and the `token-vault` demo |
| `installer/` | `install-plugin.js`, verify script, install flow |
| `knowledge/` | Mantle + agent setup guides |
| `docs/` | Docusaurus site, plugin guides, architecture visuals |
| `examples/` | Demo run samples and deployment JSON |

## Install (per runtime)

```bash
npm install && npm run plugin:<runtime>   # cursor | hermes | codex | claude | openclaw | opencode
npm run plugin:verify
```

Per-runtime guides: `docs/plugins/`. See `README.md` for the full quickstart and the flagship demo prompt.
