---
name: mantle-tx-history
description: Show a wallet's transaction history on Mantle with a gas summary.
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [mantle, explorer, mantlescan, wallet, history]
    category: mantle-forge
    requires_toolsets: [terminal]
---

# Mantle Scan — Transaction History

Lists recent transactions for a wallet on Mantle, with a gas-spend summary.
Works on mainnet and Sepolia.

## When to Use

- User asks "show transactions for 0x…", "what has this wallet done", "activity"
- Auditing a deployer or test wallet's recent activity

## Inputs

| Input | Required | Default |
|-------|----------|---------|
| Wallet address | Yes | — |
| Network (`mainnet` \| `sepolia`) | No | `mainnet` |
| Limit | No | provider default |

## Procedure

```bash
npx mantle-tx-history 0x<address>
npx mantle-tx-history 0x<address> --limit 20 --network sepolia
npx mantle-tx-history 0x<address> --json
```

Summarize recent txs (counterparty, value, method) and total gas spent.

## Output

Recent transactions + aggregate gas summary.
Source: Mantle JSON-RPC block scan — **keyless**. Returns **recent** wallet activity (last ~60 blocks: direction, value, counterparty, gas). Full historical archive needs an indexer (Mantlescan key), but recent activity is keyless.

## Verification

- Address resolves and returns 0+ transactions
- Gas summary totals are consistent with the listed txs

## Pitfalls

- High-activity wallets: use `--limit` to keep output readable
- Pick the correct `--network`
