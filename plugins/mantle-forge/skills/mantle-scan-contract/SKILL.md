---
name: mantle-scan-contract
description: Fetch verified contract info, ABI, and function signatures from Mantle Scan.
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [mantle, explorer, mantlescan, contract, abi]
    category: mantle-forge
    requires_toolsets: [terminal]
---

# Mantle Scan — Contract Info

Fetches verified contract information from Mantle Scan: name, verification
status, ABI, and function signatures. Works on mainnet and Sepolia.

## When to Use

- User asks "what is this contract", "is it verified", "show the ABI/functions"
- Inspecting a contract before interacting with it

## Inputs

| Input | Required | Default |
|-------|----------|---------|
| Contract address | Yes | — |
| Network (`mainnet` \| `sepolia`) | No | `mainnet` |

## Procedure

```bash
npx mantle-scan-contract 0x<address>
npx mantle-scan-contract 0x<address> --abi          # include full ABI
npx mantle-scan-contract 0x<address> --network sepolia --json
```

Report name, verification status, and key functions.

## Output

Contract name, verified/unverified, compiler, function signatures, optional ABI.
Source: Mantlescan explorer API. **Requires a free `MANTLE_EXPLORER_API_KEY`** (verified-source ABI/metadata needs an indexer — not available over plain RPC).

## Verification

- Verification status is reported
- For verified contracts, function signatures are listed

## Pitfalls

- Unverified contracts return bytecode only — no ABI/signatures
- Pick the correct `--network`
