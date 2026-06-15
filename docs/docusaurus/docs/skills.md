# Skills

**26 skills** ship **inside** Mantle Forge plugins — they are not installed separately. After `npm run plugin:<vendor>`, your agent discovers them through the plugin bundle (or Hermes native plugin). Split: **7 engineering** + **2 Tencent Cloud** + **17 DeFi data** (see below).

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

> `mantle-gas-analysis` produces **reproducible before/after gas benchmarks**, not just a snapshot. See the real measured savings (baseline vs optimized vault) in [gas-benchmark-before-after.md](https://github.com/BerEst12/mantle-forge/blob/main/examples/demo-runs/gas-benchmark-before-after.md) — regenerate with `npx hardhat test --grep "gas benchmark"`.

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

## DeFi data skills (17)

Read-only Mantle market & on-chain data. **7** wrap the deterministic CLIs
(`mantle-scan-*`, `mantle-moe-*`); **10** call public Mantle APIs directly
(DefiLlama · CoinGecko · DexScreener · RPC) — no API key required.

### Prices & market (4)

| Skill | Purpose | Source |
|-------|---------|--------|
| `mantle-defi-prices` | Real-time token prices on Mantle (by address or id) | DefiLlama coins |
| `mantle-token-info` | Price, volume, liquidity for any token | DexScreener |
| `mantle-coingecko` | MNT price, market cap, 24h change | CoinGecko |
| `mantle-gas-tracker` | Current gas price + tx cost in USD | Mantle RPC + CoinGecko |

### TVL & protocols (5)

| Skill | Purpose | Source |
|-------|---------|--------|
| `mantle-tvl-overview` | Total Mantle TVL + top protocols | DefiLlama |
| `mantle-protocol-stats` | TVL/chains/history for one protocol | DefiLlama |
| `mantle-yield-finder` | Best APY opportunities on Mantle | DefiLlama Yields |
| `mantle-lending-rates` | Supply APY / borrow APR (Lendle, INIT, Aave) | DefiLlama Yields |
| `mantle-meth-info` | mETH liquid staking TVL + pools | DefiLlama |

### Merchant Moe — CLI-backed (3)

Uses **Liquidity Book 2.2**. Contracts (Mantle mainnet): LB Quoter
`0x501b8AFd35df20f531fF45F6f695793AC3316c85`, LB Router
`0x013e138EF6008ae5FDFDE29700e3f2Bc61d21E3a`, LB Factory
`0xa6630671775c4EA2743840F9A5016dCf2A104054`.

| Skill | CLI | Purpose |
|-------|-----|---------|
| `mantle-moe-pools` | `mantle-moe-pools` | Pools ranked by liquidity/volume/APY |
| `mantle-moe-best-pool` | `mantle-moe-best-pool` | Best pool for a token pair |
| `mantle-moe-swap-quote` | `mantle-moe-swap-quote` | On-chain swap quote via LBQuoter |

### Mantle Scan explorer — CLI-backed (4)

| Skill | CLI | Purpose |
|-------|-----|---------|
| `mantle-scan-tx` | `mantle-scan-tx` | Decode any transaction by hash |
| `mantle-scan-contract` | `mantle-scan-contract` | Is-contract, bytecode size, function signatures (keyless RPC) |
| `mantle-tx-history` | `mantle-tx-history` | Recent wallet activity + gas (keyless RPC) |
| `mantle-whale-tracker` | `mantle-whale-tracker` | Large MNT transfers in recent blocks |

### Wallet (1)

| Skill | Purpose | Source |
|-------|---------|--------|
| `mantle-wallet-overview` | Portfolio: native MNT (RPC) + tokens/DeFi (Zerion, optional key) | Mantle RPC + Zerion |

**Engineering skills** (`hermes/skills/`) sync via `npm run plugin:sync-skills`. All **26 bundle skills** (7 engineering + 2 Tencent Cloud + 17 DeFi data) live in `plugins/mantle-forge/skills/`. Hermes install copies the full bundle skills directory.

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

DeFi data prompts (backed by the 17 DeFi skills):

```txt
What's the current price of MNT?
What's the total TVL on Mantle, and the top protocols?
Show me the best yield opportunities on Mantle right now.
What are the top Merchant Moe pools by APY?
How much USDC do I get for 100 MNT on Merchant Moe?
Show me the transaction history for 0xabc123...
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
