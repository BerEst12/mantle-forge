---
name: mantle-hardhat-config
description: Validate and fix Hardhat configuration for Mantle Sepolia (chainId 5003).
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [mantle, hardhat, config]
    category: mantle-forge
    requires_toolsets: [terminal]
---

# Mantle Hardhat Config

## When to Use

- After scaffold or when user says project is not Mantle-ready
- Before deploy or `mantle-check`
- Missing `mantleSepolia` network or wrong chainId

## Inputs

| Input | Required |
|-------|----------|
| Project directory | Yes |
| RPC URL | From `MANTLE_SEPOLIA_RPC_URL` |
| Private key | From `MANTLE_PRIVATE_KEY` (deploy only) |

## Procedure

1. Read `hardhat.config.ts` (or `.js`) and `knowledge/mantle-network-config.md`
2. **Run CLI:** `npx mantle-check <project-dir>` (from repo with `npm install`, or globally linked bins)
3. Ensure network block matches:
   ```typescript
   mantleSepolia: {
     url: process.env.MANTLE_SEPOLIA_RPC_URL || "",
     chainId: 5003,
     accounts: process.env.MANTLE_PRIVATE_KEY ? [process.env.MANTLE_PRIVATE_KEY] : [],
   }
   ```
4. Add Mantlescan custom chain for verify if missing (see starter template)
5. Confirm `.env.example` documents required vars; never commit `.env`
6. Add `scripts/deploy.ts` if missing (copy from `templates/hardhat-mantle-starter/`)

## Expected output

- Updated config files
- Validation checklist (RPC set, chainId 5003, accounts optional for compile-only)

## Verification

- `npx hardhat compile` succeeds
- `npx hardhat run scripts/deploy.ts --network mantleSepolia --dry-run` or config inspect shows correct network

## Pitfalls

- chainId **5003** for Sepolia (not mainnet 5000)
- Empty RPC URL causes obscure runtime errors — fail loudly with env hint
