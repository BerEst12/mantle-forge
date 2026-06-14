# Skills

**9 skills** ship **inside** Mantle Forge plugins — they are not installed separately. After `npm run plugin:<vendor>`, your agent discovers them through the plugin bundle (or Hermes native plugin). DeFi data capabilities are delivered as **7 deterministic CLIs** (see below), not skills.

## Smart-contract engineering skills

Core workflow: scaffold → test → audit → gas → deploy → report.

| Skill | Purpose | CLI tool |
|-------|---------|----------|
| `mantle-project-scaffold` | New project from template | `mantle-scaffold` |
| `mantle-hardhat-config` | Mantle Sepolia Hardhat config | `mantle-check` |
| `mantle-test-runner` | Run and fix tests | `hardhat test` |
| `mantle-security-review` | Agent-assisted security review | `mantle-audit` |
| `mantle-gas-analysis` | Gas report + safe optimizations | `mantle-gas-report` |
| `mantle-deploy-sepolia` | Deploy + capture artifacts | `mantle-deploy` |
| `mantle-report-generator` | `FINAL_REPORT.md` | `mantle-report` |

## Tencent Cloud skills

Deep AI audit and artifact publishing powered by Tencent Cloud.

| Skill | Purpose | CLI tool |
|-------|---------|----------|
| `mantle-tencent-audit` | Deep AI security audit (Tencent Hunyuan direct **or** via OpenRouter) with Mantle L2-specific checks | `mantle-tencent-audit` |
| `mantle-cos-upload` | Upload pipeline artifacts to Tencent Cloud COS for public verification | `mantle-cos-upload` |

### mantle-tencent-audit

Runs a deep AI security analysis of your Solidity contracts through a frontier LLM. Goes beyond static heuristics — evaluates reentrancy, access control, arithmetic, business logic, gas patterns, and **Mantle-specific risks** (cross-layer messages, MNT token handling, sequencer assumptions).

Two interchangeable transports (same prompt, same report) — pick whichever key you have:

```bash
# Option A — Tencent Cloud Hunyuan (direct)
export TENCENT_HUNYUAN_API_KEY=<your-key>     # console.cloud.tencent.com/hunyuan
npx mantle-tencent-audit ./my-vault --out reports/tencent-audit.md

# Option B — OpenRouter (one key → 500+ models incl. Tencent Hunyuan)
export OPENROUTER_API_KEY=sk-or-<your-key>    # openrouter.ai/keys
npx mantle-tencent-audit ./my-vault --provider openrouter --out reports/tencent-audit.md
```

The provider is auto-detected from whichever key is set, or forced with `--provider hunyuan|openrouter`. OpenRouter model slugs are configurable with `--model` — verify current ids at [openrouter.ai/models](https://openrouter.ai/models).

Output: `reports/tencent-audit.md` with findings ranked by severity + Mantle L2 assessment.

### mantle-cos-upload

Uploads all pipeline artifacts (`FINAL_REPORT.md`, `reports/security.md`, `reports/tencent-audit.md`, `reports/gas.md`, `deployments/mantleSepolia.json`) to **Tencent Cloud COS** with public-read URLs — enabling independent verification by auditors, judges, or teammates.

```bash
export TENCENT_COS_SECRET_ID=<id>
export TENCENT_COS_SECRET_KEY=<key>
export TENCENT_COS_BUCKET=<bucket>
npx mantle-cos-upload ./my-vault --out reports/cos-upload.md
# → https://<bucket>.cos.ap-singapore.myqcloud.com/mantle-forge/<run-id>/FINAL_REPORT.md
```

> **Credentials:** [console.cloud.tencent.com/hunyuan](https://console.cloud.tencent.com/hunyuan) · [console.cloud.tencent.com/cam/capi](https://console.cloud.tencent.com/cam/capi)

## DeFi data CLIs

DeFi data is **not** a skill layer — it ships as **7 deterministic CLIs** in `tools/mantle-scan/` and `tools/mantle-moe/`. Your agent invokes them directly (`npx mantle-*`); no API key required. Full reference: [CLI tools](./tools).

### Mantle Scan explorer (4)

| CLI | Purpose | Source |
|-----|---------|--------|
| `mantle-scan-tx` | Decode any transaction by hash | Mantlescan API |
| `mantle-scan-contract` | Contract info, ABI, function signatures | Mantlescan API |
| `mantle-tx-history` | Wallet tx history + gas summary | Mantlescan API |
| `mantle-whale-tracker` | Large MNT transfers in recent blocks | Mantle RPC |

### Merchant Moe (3)

Uses **Liquidity Book 2.2** architecture.

| CLI | Purpose | Source |
|-----|---------|--------|
| `mantle-moe-pools` | All pools ranked by TVL, volume, or APY | Moe subgraph / DefiLlama |
| `mantle-moe-best-pool` | Best pool for a specific token pair | Moe subgraph / DefiLlama |
| `mantle-moe-swap-quote` | Real-time swap quote via LBQuoter — no wallet needed | Mantle RPC (on-chain) |

**Contracts used (Mantle mainnet):**

| Contract | Address |
|----------|---------|
| LB Quoter | `0x501b8AFd35df20f531fF45F6f695793AC3316c85` |
| LB Router | `0x013e138EF6008ae5FDFDE29700e3f2Bc61d21E3a` |
| LB Factory | `0xa6630671775c4EA2743840F9A5016dCf2A104054` |

Source: [docs.merchantmoe.com/resources/contracts](https://docs.merchantmoe.com/resources/contracts)

**Engineering skills** (`hermes/skills/`) sync via `npm run plugin:sync-skills`. All **9 bundle skills** (7 engineering + 2 Tencent Cloud) live in `plugins/mantle-forge/skills/`. Hermes install copies the full bundle skills directory.

## How skills load per runtime

| Runtime | How skills appear |
|---------|-------------------|
| **Hermes** | Bundled in `~/.hermes/plugins/mantle-forge/skills/` + `register_skill` |
| **Cursor** | Plugin bundle `skills/` — Agent Decides under Rules |
| **Codex** | `"skills": "./skills/"` in `.codex-plugin/plugin.json` |
| **Claude** | Plugin `skills/` directory |
| **OpenClaw** | Linked bundle `skills/` |
| **OpenCode** | Copied to `.opencode/skills/` — add path in `opencode.json` |

Install a plugin first — see [Plugins overview](./plugins/) and [per-runtime install guides](./plugins/install-hermes).

```bash
npm run plugin:<your-runtime>
npm run plugin:verify
```

## Invoke via agent

Natural language (any runtime) — flagship prompt:

```txt
Create a Mantle Sepolia-ready token vault project from scratch.
Add tests, run a security review, optimize gas where possible,
deploy it to Mantle Sepolia, and generate an engineering report.
```

DeFi data prompts (backed by the 7 CLIs):

```txt
What are the top Merchant Moe pools by APY?
What's the best Merchant Moe pool for MNT/USDC?
How much USDC do I get for 100 MNT on Merchant Moe?
Show me the transaction history for 0xabc123...
Decode transaction 0xdef456... on Mantle.
Are there any whale transactions on Mantle in the last hour?
```

Hermes direct tool call:

```txt
Use mantle_scaffold with template token-vault and output_dir ./token-vault
```

Other runtimes: agent reads the skill, then runs the relevant CLI from `MANTLE_FORGE_ROOT`.

## Legacy install (not recommended)

`./installer/install.sh` copies skills flat to `~/.hermes/skills/mantle-*` without the full plugin. Use `npm run plugin:hermes` instead.

Dev mode: `./installer/install.sh --dev` points Hermes `external_dirs` at repo `hermes/skills/`.
