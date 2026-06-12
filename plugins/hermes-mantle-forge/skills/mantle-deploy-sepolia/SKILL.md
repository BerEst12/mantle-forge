---
name: mantle-deploy-sepolia
description: Deploy contracts to Mantle Sepolia, verify source on Mantlescan, and capture deployment artifacts.
version: 1.2.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [mantle, deploy, sepolia, verify, mantlescan]
    category: mantle-forge
    requires_toolsets: [terminal]
required_environment_variables:
  - name: MANTLE_SEPOLIA_RPC_URL
    prompt: Mantle Sepolia RPC URL
    help: Default is https://rpc.sepolia.mantle.xyz
    required_for: deployment
  - name: MANTLE_PRIVATE_KEY
    prompt: Test wallet private key (Sepolia only — never use mainnet keys)
    required_for: deployment
  - name: MANTLE_EXPLORER_API_KEY
    prompt: Etherscan API key (works for Mantlescan via API v2)
    help: Get a free key at https://etherscan.io/myapikey — Mantlescan account creation is unreliable; Etherscan key works for both
    required_for: verification
---

# Mantle Deploy Sepolia

## When to Use

- User asks to deploy to Mantle Sepolia
- Penultimate step of flagship workflow (before report)
- Tests pass and Hardhat config validated

## Inputs

| Input | Required |
|-------|----------|
| Project directory | Yes |
| Network | `mantleSepolia` (default) |

## Pre-flight: hardhat.config.ts must use API v2 format

The `etherscan.apiKey` field must be a **single string**, not a per-network object:

```ts
etherscan: {
  apiKey: process.env.MANTLE_EXPLORER_API_KEY || “”,  // v2: single string
  customChains: [{
    network: “mantleSepolia”,
    chainId: 5003,
    urls: {
      apiURL: “https://api-sepolia.mantlescan.xyz/api”,
      browserURL: “https://sepolia.mantlescan.xyz”,
    },
  }],
},
```

The v1 format `apiKey: { mantleSepolia: “...” }` is deprecated and will fail. Fix it before running verify.

Also confirm optimizer settings match the deployed bytecode:
```ts
solidity: {
  version: “0.8.24”,
  settings: { optimizer: { enabled: true, runs: 200 } },
},
```

## Procedure

1. Load `hermes/system-instructions/deployment-operator.md`
2. Load `knowledge/mantle-contract-verification.md`
3. Confirm env in project `.env`:
   - `MANTLE_SEPOLIA_RPC_URL`
   - `MANTLE_PRIVATE_KEY`
   - `MANTLE_EXPLORER_API_KEY` (Etherscan key — see note above)
4. Check `hardhat.config.ts` uses API v2 format (see Pre-flight above)
5. `npx hardhat compile` && `npx hardhat test`
6. **Deploy + verify (default):**
   ```bash
   npx mantle-deploy <project-dir> --network mantleSepolia
   ```
7. **If verification failed but deploy succeeded:**
   - Wait 30 seconds (explorer indexing)
   - Retry: `npx mantle-deploy <project-dir> --verify-only`
   - Up to 3 attempts; then fall back to manual commands (step 8)
8. **Manual verify fallback** (use when `npx hardhat` fails on Windows):
   ```bash
   # For each contract — include constructor args if any
   node ./node_modules/hardhat/internal/cli/cli.js verify --network mantleSepolia <address> [constructorArg1 ...]
   ```
9. Confirm each contract shows source on Mantlescan (`.../address/<addr>#code`)
10. Report verification status per contract from `deployments/mantleSepolia.json` → `verification.contracts`

## Expected output

- `deployments/mantleSepolia.json` with addresses, tx hashes, constructor args
- `verification` block with per-contract `status` and explorer URLs
- Human-readable summary: deployed + verified (or explicit verify failures with URLs)

## Verification checklist

- [ ] Tx visible on [sepolia.mantlescan.xyz](https://sepolia.mantlescan.xyz)
- [ ] Source code tab shows green check / contract name (not “Verify and Publish”)
- [ ] `verification.contracts.*.status` is `verified` or `already_verified`

## Pitfalls

- **API key** — use Etherscan key (etherscan.io/myapikey), not Mantlescan; Mantlescan account creation is unreliable
- **API v1 format** — `apiKey: { mantleSepolia: key }` fails with “deprecated V1 endpoint”; use single string
- **Optimizer mismatch** — bytecode won't match if optimizer settings differ from original compile; `enabled: true, runs: 200` is the standard
- **`npx hardhat` fails on Windows** — use `node ./node_modules/hardhat/internal/cli/cli.js` directly
- **Verify too soon** — wait 30s after deploy for explorer indexing, then retry `--verify-only`
- **Unfunded wallet** — https://faucet.sepolia.mantle.xyz/
- **Wrong network** — Hardhat key must be `mantleSepolia`, chainId 5003
- **Missing constructorArgs** — deploy script must write `constructorArgs` array in deployment JSON

## Related

- Report step: `/mantle-report-generator` after verify
- Explorer inspect: `/mantle-scan-contract` for ABI after verification
