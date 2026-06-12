# Flagship demo

One natural-language prompt drives the full Mantle workflow. Works with **any** installed Mantle Forge plugin — Hermes is recommended for the hackathon video (native tools + verified deploy).

## Prerequisite

Install a plugin for your runtime:

```bash
npm install && npm run plugin:<your-runtime>
npm run plugin:verify
```

See [Plugins](./plugins/) for per-runtime install guides.

## Prompt

```txt
Create a Mantle Sepolia-ready token vault project from scratch.
Add tests, run a security review, optimize gas where possible,
deploy it to Mantle Sepolia, and generate an engineering report.
```

## What the plugin drives

| Step | Skill | Tool | Artifact |
|------|-------|------|----------|
| Scaffold | `mantle-project-scaffold` | `mantle-scaffold` | Hardhat project |
| Test | `mantle-test-runner` | `hardhat test` | Test output |
| Harden | `mantle-security-review` | `mantle-audit` | `reports/security.md` |
| Gas | `mantle-gas-analysis` | `mantle-gas-report` | `reports/gas.md` |
| Deploy | `mantle-deploy-sepolia` | `mantle-deploy` | Address + tx hash |
| Report | `mantle-report-generator` | `mantle-report` | `FINAL_REPORT.md` |

## Success criteria

| Check | Evidence |
|-------|----------|
| Project builds | `npx hardhat compile` exit 0 |
| Tests pass | Hardhat test output |
| Security report | `reports/security.md` |
| Gas report | `reports/gas.md` |
| On-chain deploy | Contract address + tx hash on Mantle Sepolia |
| Final report | `FINAL_REPORT.md` |

## DeFi data demos

No deploy needed — read-only, works on mainnet immediately after plugin install.

### Merchant Moe — swap quote

```txt
How much USDC do I get for 100 MNT on Merchant Moe?
What's the price impact?
```

| Step | Skill | Tool |
|------|-------|------|
| Resolve tokens | `mantle-moe-swap-quote` | `mantle-moe-swap-quote MNT USDC 100` |
| Call LBQuoter on-chain | — | `eth_call` → `0x501b8AFd35df20f531fF45F6f695793AC3316c85` |
| Show rate + impact | — | amountOut + priceImpact% |

### Market overview

```txt
What's the TVL on Mantle, best yields, and current MNT price?
```

| Step | Skill | Source |
|------|-------|--------|
| TVL breakdown | `mantle-tvl-overview` | DefiLlama |
| Best APY | `mantle-yield-finder` | DefiLlama Yields |
| MNT price | `mantle-defi-prices` | DefiLlama Coins |

### Wallet + whale activity

```txt
Show me the last 20 transactions for 0xabc... and any whale moves today.
```

| Step | Skill | Tool |
|------|-------|------|
| Tx history | `mantle-tx-history` | `mantle-tx-history 0xabc...` |
| Whale scan | `mantle-whale-tracker` | `mantle-whale-tracker --min-value 10000` |

## Verified deploys (Mantle Sepolia)

| Run | Runtime | TokenVault |
|-----|---------|------------|
| **2026-06-07** | Direct CLIs (E2E test) | [`0x64D825eDcE57d56365bEb026CEAe4D2D439f7874`](https://sepolia.mantlescan.xyz/address/0x64D825eDcE57d56365bEb026CEAe4D2D439f7874) |
| **2026-06-05** | Hermes Desktop | [`0xa6608D936405470A5AF9cD003477a2042Cd0b4Ee`](https://sepolia.mantlescan.xyz/address/0xa6608D936405470A5AF9cD003477a2042Cd0b4Ee) |
| Skills phase | Hermes TUI | [`0xC313185923b2F0FB2795b9b55dB3e0B9D4865119`](https://sepolia.mantlescan.xyz/address/0xC313185923b2F0FB2795b9b55dB3e0B9D4865119) |
| CLI pipeline | Direct CLIs | [`0x2A3d1438d57417cA7708C5f63D89080E74dbF541`](https://sepolia.mantlescan.xyz/address/0x2A3d1438d57417cA7708C5f63D89080E74dbF541) |

Sample artifacts: `examples/demo-runs/` in the repo.
