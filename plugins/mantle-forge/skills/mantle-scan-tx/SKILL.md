---
name: mantle-scan-tx
description: Decode and explain any Mantle transaction by hash via Mantle Scan.
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [mantle, explorer, mantlescan, transaction]
    category: mantle-forge
    requires_toolsets: [terminal]
---

# Mantle Scan — Transaction Lookup

Looks up a transaction on Mantle Scan and returns a human-readable summary
(from/to, value, status, gas, method). Works on mainnet and Sepolia.

## When to Use

- User pastes a tx hash and asks "what is this", "did it succeed", "decode this tx"
- Confirming a deploy or transfer landed on-chain

## Inputs

| Input | Required | Default |
|-------|----------|---------|
| Transaction hash | Yes | — |
| Network (`mainnet` \| `sepolia`) | No | `mainnet` |

## Procedure

```bash
npx mantle-scan-tx 0x<hash>
npx mantle-scan-tx 0x<hash> --network sepolia
npx mantle-scan-tx 0x<hash> --json
```

Summarize status, value, gas used/cost, and the method called.

## Output

From/to, value, success/failure, gas used + cost, decoded method.
Source: Mantle JSON-RPC (`rpc.mantle.xyz`) — **keyless**, no API key needed.

## Verification

- The tx exists (else report "not found" — check the network)
- Status (success/revert) is reported

## Pitfalls

- A mainnet hash on `--network sepolia` (or vice-versa) returns "not found"
- Works over the public RPC with no key; `--network sepolia` for testnet
