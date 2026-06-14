# Tools

Mantle Forge CLI utilities — **16 commands** across engineering, Tencent Cloud, and DeFi data workflows.

## Engineering CLIs (7)

| Command | Purpose |
|---------|---------|
| `mantle-scaffold` | Copy template into a new project |
| `mantle-check` | Validate Mantle Sepolia Hardhat readiness |
| `mantle-gas-report` | Run gas reporter → `reports/gas.md` |
| `mantle-audit` | Static analysis + agent audit brief → `reports/security.md` |
| `mantle-harden` | **Full gate:** Slither + Mythril + Foundry + invariants + triage |
| `mantle-deploy` | Deploy to Mantle Sepolia → `deployments/mantleSepolia.json` |
| `mantle-report` | Merge artifacts into `FINAL_REPORT.md` |

## Tencent Cloud CLIs (2)

| Command | Purpose |
|---------|---------|
| `mantle-tencent-audit` | Deep AI security audit via Tencent Hunyuan (direct or OpenRouter) |
| `mantle-cos-upload` | Publish pipeline artifacts to Tencent Cloud COS |

## DeFi data CLIs (7)

| Command | Purpose |
|---------|---------|
| `mantle-scan-tx` | Decode a transaction by hash |
| `mantle-scan-contract` | Contract info + ABI |
| `mantle-tx-history` | Wallet transaction history |
| `mantle-whale-tracker` | Large MNT transfers in recent blocks |
| `mantle-moe-pools` | Merchant Moe pools ranked by TVL/volume/APY |
| `mantle-moe-best-pool` | Best pool for a token pair |
| `mantle-moe-swap-quote` | On-chain swap quote via LBQuoter |

## Install

```bash
npm install
npm run test:tools
```

## Examples

```bash
npx mantle-scaffold token-vault ./my-vault
npx mantle-check ./my-vault
npx mantle-gas-report ./my-vault --out reports/gas.md
npx mantle-audit ./my-vault --out reports/security.md --json reports/security.json --brief reports/audit-brief.md
npx mantle-harden ./my-vault
npx mantle-deploy ./my-vault --network mantleSepolia
npx mantle-report ./my-vault --out FINAL_REPORT.md
```

`mantle-deploy` submits live transactions to Mantle Sepolia when RPC and wallet are configured.
