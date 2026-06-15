# Architecture

**Mantle Forge** is a plugin toolkit for coding agents. Install it once in your runtime and your agent gains Mantle-native workflows: it builds, audits, and deploys smart contracts on Mantle Sepolia — and queries live DeFi data on demand.

![Mantle Forge architecture — four columns: agents, engineering pipeline, DeFi skills, Mantle Sepolia](/img/architecture.svg)

> Full-resolution source: [`docs/architecture/mantle-forge-architecture.svg`](https://github.com/BerEst12/mantle-forge/blob/main/docs/architecture/mantle-forge-architecture.svg)

## Reading the diagram

The diagram flows left → right. Each column answers one question:

### Agents of IA (left)
**Who uses Mantle Forge.** Hermes (flagship), Claude Code, Cursor, Codex, OpenClaw, OpenCode. Install the plugin once with `npm run plugin:<vendor>` — all skills and CLIs become available immediately.

### Engineering pipeline (center-left)
**What it builds.** Seven skills that run in sequence:

| Step | Skill / CLI | What it does |
|------|-------------|--------------|
| 1 | `mantle-scaffold` | Creates a Hardhat project ready for Mantle (templates: `hardhat-mantle-starter`, `token-vault`) |
| 2 | `mantle-check` | Validates Hardhat config — chainId 5003, gas, network — auto-fixes common errors |
| 3 | `mantle-audit` | Security review: Slither + Mythril + Foundry fuzz + Tencent Hunyuan AI deep audit |
| 4 | `mantle-gas-report` | Gas analysis per function with safe optimization suggestions |
| 5 | `mantle-harden` | Applies security patches automatically and re-runs tests |
| 6 🚀 | `mantle-deploy` | Deploys to Mantle Sepolia and verifies source on Mantlescan |
| 7 📄 | `mantle-report` | Generates `FINAL_REPORT.md` — tests · gas · security · deploy · tx |

### Live DeFi data (center-right)
**What it queries.** 19 skills for live Mantle data and cloud services (17 DeFi data + 2 Tencent Cloud):

- **Prices & market** — MNT price, market cap, 24h volume, gas tracker
- **TVL & protocols** — total Mantle TVL, per-protocol breakdown, yields, lending rates, mETH
- **Merchant Moe DEX** — pools, best-pool, swap quotes (on-chain via LBQuoter)
- **On-chain explorer** — transactions, contract inspection (functions), whale tracker, recent wallet activity (keyless via RPC)
- **Wallet** — portfolio: native MNT + tokens/positions (Zerion optional)
- **Tencent Cloud** — Hunyuan AI deep audit + COS artifact upload

### Mantle Sepolia (right)
**Where it deploys and what it reads.** Chain ID 5003, MNT. RPC endpoint, Mantlescan explorer, deployed contracts (tx hash + address + source verified), deployer wallet. Also the external APIs: GeckoTerminal, DeFiLlama, CoinGecko, DexScreener, Mantle RPC, Tencent COS.

## Design principles

- **Deterministic tools, not improvised pipelines** — agents call CLIs; CLIs are testable and reproducible.
- **Evidence over claims** — every run yields deploy JSON, tx hashes, test output, and reports.
- **Agent-assisted hardening** — security output is clearly labeled; Hunyuan AI adds depth beyond static analysis.
- **Portable** — Hermes is the flagship, but the same 26 skills and CLIs run on every supported runtime.
