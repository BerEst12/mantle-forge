# Hackathon submission — Mantle Forge

**Event:** [Turing Test Hackathon 2026](https://dorahacks.io/hackathon/mantleturingtesthackathon2026) — Phase 2, AI DevTools  
**Deadline:** 2026-06-15  
**Repo:** `mantle-forge` (GitHub)  
**Live docs:** [mantle-forge.vercel.app](https://mantle-forge.vercel.app)

## One-liner

Mantle Forge is a Mantle-native execution layer for coding agents — one prompt scaffolds, tests, hardens, deploys to Mantle Sepolia, and writes `FINAL_REPORT.md`. Works with Hermes, Cursor, Codex, Claude Code, OpenClaw, and OpenCode.

## Thesis

Do not build another agent runtime. Give any coding agent Mantle-native skills, deterministic CLI tools, templates, and knowledge. **Hermes** is the flagship demo (native Python tools + verified on-chain deploys).

## What judges should see

This is not a chatbot. It is an **execution layer**:

- **26 skills** — 7 engineering (scaffold → report) + 2 Tencent Cloud (Hunyuan audit + COS upload) + 17 DeFi data (prices, TVL, MoE, Mantlescan)
- **15 CLI tools** — 6 engineering + 2 Tencent Cloud (`mantle-tencent-audit`, `mantle-cos-upload`) + 7 DeFi data (scan, MoE swap quotes)
- **Tencent Cloud integration** (hackathon infrastructure partner) — `mantle-tencent-audit` runs deep AI security analysis through [Tencent Cloud Hunyuan](https://cloud.tencent.com/product/hunyuan) (default provider) with Mantle L2-specific checks; Hunyuan is reachable both directly via the Tencent Cloud API **and** through [OpenRouter](https://openrouter.ai) (`tencent/hunyuan-*`), so the integration works on any onboarding path. `mantle-cos-upload` publishes all pipeline artifacts to [Tencent Cloud COS](https://cloud.tencent.com/product/cos) for independent verification
- **Multi-vendor plugins** — one-line install per runtime
- **On-chain proof** — live Mantle Sepolia deployments with artifacts and reports

Inspired by composable agent methodology ([Superpowers](https://github.com/obra/superpowers)): skills, hooks, scripts, per-harness install — adapted for Mantle.

## Demo video

<!-- TODO: paste YouTube/Loom URL after recording -->
**Video URL:** _pending_

Full script: [`docs/demo-script.md`](./demo-script.md)

Suggested flow:

1. Problem → solution hook + Mantlescan flash
2. Terminals — WSL verify + Hermes tool streaming (+ other runtimes)
3. Plugins + Skills docs (24 `mantle-*` skills)
4. Discord — Mantle landing page + DeFi query
5. Telegram — `/forge` pipeline on phone
6. Climax — audit + gas + tests + deploy + `FINAL_REPORT.md` + Mantlescan
7. Close — GitHub + docs

## Flagship prompt

```txt
Create a Mantle Sepolia-ready token vault project from scratch.
Add tests, run a security review, optimize gas where possible,
deploy it to Mantle Sepolia, and generate an engineering report.
```

## Live proof (Mantle Sepolia)

| Run | Interface | TokenVault |
|-----|-----------|------------|
| **2026-06-07 (latest)** | Direct CLIs (E2E test) | [`0x64D825eDcE57d56365bEb026CEAe4D2D439f7874`](https://sepolia.mantlescan.xyz/address/0x64D825eDcE57d56365bEb026CEAe4D2D439f7874) |
| **2026-06-05** | Hermes Desktop | [`0xa6608D936405470A5AF9cD003477a2042Cd0b4Ee`](https://sepolia.mantlescan.xyz/address/0xa6608D936405470A5AF9cD003477a2042Cd0b4Ee) |
| Skills phase | Hermes TUI | [`0xC313185923b2F0FB2795b9b55dB3e0B9D4865119`](https://sepolia.mantlescan.xyz/address/0xC313185923b2F0FB2795b9b55dB3e0B9D4865119) |
| CLI pipeline | Direct CLIs | [`0x2A3d1438d57417cA7708C5f63D89080E74dbF541`](https://sepolia.mantlescan.xyz/address/0x2A3d1438d57417cA7708C5f63D89080E74dbF541) |

Artifacts: [`examples/demo-runs/2026-06-05-hermes-desktop/`](../examples/demo-runs/2026-06-05-hermes-desktop/)

## Links for judges

| Resource | URL |
|----------|-----|
| **Docs site** | https://mantle-forge.vercel.app |
| **Quickstart** | https://mantle-forge.vercel.app/docs/quickstart |
| **Plugins** | https://mantle-forge.vercel.app/docs/plugins |
| **GitHub** | https://github.com/BerEst12/mantle-forge |
| **TokenVault (Sepolia, latest)** | https://sepolia.mantlescan.xyz/address/0x64D825eDcE57d56365bEb026CEAe4D2D439f7874 |
| **Architecture visual** | https://github.com/BerEst12/mantle-forge/blob/main/docs/architecture-visual.html |

## Architecture

```text
Coding agent (Hermes · Cursor · Codex · Claude · OpenClaw · OpenCode)
  ↓
Mantle Forge plugins (skills + commands + hooks; Hermes native tools)
  ↓
CLI tools (mantle-scaffold … mantle-report)
  ↓
Hardhat templates + Mantle Sepolia
  ↓
Deployment + FINAL_REPORT.md
```

Interactive: [`architecture-visual.html`](./architecture-visual.html)

## Supported runtimes

| Runtime | Install | Notes |
|---------|---------|-------|
| Hermes | `npm run plugin:hermes` | Flagship demo; WSL on Windows |
| Cursor | `npm run plugin:cursor` | IDE agent |
| Codex | `npm run plugin:codex` | OpenAI Codex |
| Claude Code | `npm run plugin:claude` | Marketplace plugin |
| OpenClaw | `npm run plugin:openclaw` | Gateway plugins |
| OpenCode | `npm run plugin:opencode` | Skills path install |

Verify: `npm run plugin:verify`. Guides: [`docs/plugins/`](../docs/plugins/)

## Mantle integration

- Default network: **Mantle Sepolia** (chainId `5003`)
- Hardhat templates with Mantle RPC + explorer config
- Deploy skill + `mantle-deploy` CLI capture address, tx, explorer links
- On-chain bytecode verified on live Sepolia deploys

## Install (judges / reviewers)

```bash
git clone https://github.com/BerEst12/mantle-forge
cd mantle-forge
npm install && npm run plugin:<your-runtime>   # see table above
npm run plugin:verify
```

**Hermes smoke:** `wsl bash -lc "hermes plugins list | grep mantle-forge"` or [`knowledge/hermes-desktop-smoke-test.md`](../knowledge/hermes-desktop-smoke-test.md)

## Business potential

Mantle Forge is open-source and built to stay that way. These are the natural monetization layers on top:

### Donations
The simplest path. A GitHub Sponsors button or Buy Me a Coffee link lets the Mantle/Web3 community support tooling they actually use. No infrastructure required — just a signal of real traction and a way for teams to say thanks.

### Custom plugin development
The `npm run plugin:<vendor>` pattern is already there. Teams with their own contract base, private network, or specific audit checks can commission a dedicated skill pack and workflow tailored to their stack. Each engagement produces a reusable plugin — low overhead, high leverage.

### Premium templates
Today there is one starter template (TokenVault). The next layer is a catalog of production-grade templates — staking contracts, lending pools, NFT launchpads, DAO governance — each pre-configured for Mantle Sepolia with tests, gas benchmarks, and an audit checklist included. Free tier gets the basic scaffold; premium templates ship battle-tested.

### Skill packs
The 26 skills in the repo are the free tier. Packaged skill bundles — a DeFi Pack (Merchant Moe + lending + yield), a Security Pack (deeper static analysis + invariant checks), a Reporting Pack (PDF exports, CI badges) — can be sold as one-line installs. Teams pay for depth; the core stays open.

## Security disclaimer

Reviews are **agent-assisted hardening**, not professional audits.

## License

MIT
