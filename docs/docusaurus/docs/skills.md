# Skills

**26 skills** ship **inside** Mantle Forge plugins — they are not installed separately. After `npm run plugin:<vendor>`, your agent discovers them through the plugin bundle (or Hermes native plugin).

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

## DeFi data skills — prices & market

Real-time on-chain and market data. No API key required.

| Skill | Purpose | Source |
|-------|---------|--------|
| `mantle-defi-prices` | Real-time token prices on Mantle | DefiLlama |
| `mantle-token-info` | Price, volume, liquidity for any token | DexScreener |
| `mantle-coingecko` | MNT price history, market cap, ecosystem tokens | CoinGecko |
| `mantle-gas-tracker` | Current gas price + tx cost estimates in USD | Mantle RPC |

## DeFi data skills — TVL & protocols

| Skill | Purpose | Source |
|-------|---------|--------|
| `mantle-tvl-overview` | Total TVL on Mantle ranked by protocol | DefiLlama |
| `mantle-protocol-stats` | TVL, volume, fees for any Mantle protocol | DefiLlama |
| `mantle-yield-finder` | Best APY opportunities on Mantle right now | DefiLlama Yields |
| `mantle-lending-rates` | Supply APY and borrow APR (Lendle, INIT Capital) | DefiLlama Yields |
| `mantle-meth-info` | mETH liquid staking APY, TVL, exchange rate | mETH + DefiLlama |

## DeFi data skills — Merchant Moe

Uses **Liquidity Book 2.2** architecture.

| Skill | Purpose | Source |
|-------|---------|--------|
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

## DeFi data skills — Mantle Scan explorer

| Skill | Purpose | CLI tool |
|-------|---------|----------|
| `mantle-scan-tx` | Decode any transaction by hash | `mantle-scan-tx` |
| `mantle-scan-contract` | Contract info, ABI, function signatures | `mantle-scan-contract` |
| `mantle-tx-history` | Wallet tx history + gas summary | `mantle-tx-history` |
| `mantle-whale-tracker` | Large MNT transfers in recent blocks | `mantle-whale-tracker` |

## DeFi data skills — wallet

| Skill | Purpose | Source |
|-------|---------|--------|
| `mantle-wallet-overview` | Full portfolio: tokens + DeFi positions | Zerion + Mantle RPC |

> **Zerion API key** optional but recommended for DeFi position breakdown. Free tier: 100 req/day at [developers.zerion.io](https://developers.zerion.io).

**Engineering skills** (`hermes/skills/`) sync via `npm run plugin:sync-skills`. **DeFi skills** live in `plugins/mantle-forge/skills/`. Hermes install copies the full bundle skills directory.

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

DeFi data prompts:

```txt
What's the current price of MNT?
Show me the best yield opportunities on Mantle right now.
What are the top Merchant Moe pools by APY?
Show me the transaction history for 0xabc123...
Are there any whale transactions on Mantle in the last hour?
What's the TVL breakdown on Mantle?
```

Hermes direct tool call:

```txt
Use mantle_scaffold with template token-vault and output_dir ./token-vault
```

Other runtimes: agent reads the skill, then runs the relevant CLI from `MANTLE_FORGE_ROOT`.

## Legacy install (not recommended)

`./installer/install.sh` copies skills flat to `~/.hermes/skills/mantle-*` without the full plugin. Use `npm run plugin:hermes` instead.

Dev mode: `./installer/install.sh --dev` points Hermes `external_dirs` at repo `hermes/skills/`.
