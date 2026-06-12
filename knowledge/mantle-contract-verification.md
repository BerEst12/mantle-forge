# Mantle Sepolia contract verification

Step-by-step guide for agents and developers after `mantle-deploy`.

**Official Mantle docs:** [Verify with Hardhat](https://docs.mantle.xyz/network/for-developers/how-to-guides/how-to-verify-smart-contracts/use-hardhat-to-verify-smart-contracts.md)

## Prerequisites

| Variable | Required | Purpose |
|----------|----------|---------|
| `MANTLE_EXPLORER_API_KEY` | Yes for verify | Mantlescan API key → `hardhat.config` `etherscan.apiKey.mantleSepolia` |
| `deployments/mantleSepolia.json` | Yes | Addresses + `constructorArgs` per contract |
| Compiled artifacts | Yes | Run `npx hardhat compile` in project dir |

Get API key: https://sepolia.mantlescan.xyz/myapikey (free account).

## Automated path (preferred)

`mantle-deploy` verifies by default after a successful deploy (15s indexer delay).

```bash
# Deploy + verify (default)
npx mantle-deploy . --network mantleSepolia

# Retry verification only (no new deploy)
npx mantle-deploy . --verify-only

# Deploy without verify
npx mantle-deploy . --skip-verify

# Fail the command if verify fails
npx mantle-deploy . --strict-verify
```

## Agent procedure (after deploy)

1. Confirm `MANTLE_EXPLORER_API_KEY` is in project `.env`.
2. Confirm `deployments/mantleSepolia.json` lists every contract with:
   - `address`
   - `constructorArgs` (empty array `[]` if none)
3. If deploy used `--skip-verify`, run:
   ```bash
   npx mantle-deploy <project-dir> --verify-only
   ```
4. If verify fails with timeout/indexer errors, **wait 30 seconds** and retry `--verify-only` (up to 3 attempts).
5. Confirm on explorer — each address should show source code:
   - `https://sepolia.mantlescan.xyz/address/<ADDRESS>#code`
6. Optional CLI check:
   ```bash
   npx mantle-scan contract <ADDRESS> --network sepolia
   ```
7. Update `FINAL_REPORT.md` via `npx mantle-report . --out FINAL_REPORT.md`.

## Manual Hardhat fallback

When `mantle-deploy --verify-only` fails, run per contract (order matters if args reference prior deploys):

```bash
cd <project-dir>
npx hardhat verify --network mantleSepolia <ADDRESS>
npx hardhat verify --network mantleSepolia <ADDRESS> <constructor-arg-1> <constructor-arg-2>
```

Example (token-vault):

```bash
npx hardhat verify --network mantleSepolia 0xDemoToken...
npx hardhat verify --network mantleSepolia 0xTokenVault... 0xDemoToken...
```

## Artifact format

After verify, `deployments/mantleSepolia.json` includes:

```json
"verification": {
  "verifiedAt": "2026-06-09T...",
  "network": "mantleSepolia",
  "apiKeyPresent": true,
  "contracts": {
    "DemoToken": {
      "address": "0x...",
      "status": "verified",
      "explorerUrl": "https://sepolia.mantlescan.xyz/address/0x...#code"
    }
  }
}
```

Status values: `verified`, `already_verified`, `failed`, `skipped`.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Invalid API Key | Set `MANTLE_EXPLORER_API_KEY` in `.env`; restart shell |
| Unable to verify | Wait 30s; retry `--verify-only` |
| Constructor argument mismatch | Fix `constructorArgs` in deploy script output JSON |
| Already verified | Treat as success |
| Bytecode mismatch | Recompile; redeploy; do not change compiler settings after deploy |

## Deploy script requirement

Deploy scripts must write `deployments/mantleSepolia.json` with a `contracts` map. See `templates/token-vault/scripts/deploy.ts`.
