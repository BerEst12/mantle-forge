---
name: mantle-whale-tracker
description: Detect large MNT transfers in recent Mantle blocks.
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [mantle, explorer, whale, transfers, monitoring]
    category: mantle-forge
    requires_toolsets: [terminal]
---

# Mantle Whale Tracker

Scans recent Mantle blocks for large MNT transfers ("whale" moves) above a
configurable threshold. Works on mainnet and Sepolia.

## When to Use

- User asks "any whale moves", "large MNT transfers recently", "big transactions"
- Lightweight on-chain activity monitoring

## Inputs

| Input | Required | Default |
|-------|----------|---------|
| Min value (MNT) | No | tool default |
| Network (`mainnet` \| `sepolia`) | No | `mainnet` |
| Filter address | No | — |

## Procedure

```bash
npx mantle-whale-tracker --min-value 10000
npx mantle-whale-tracker --min-value 50000 --address 0x<addr>
npx mantle-whale-tracker --json
```

Summarize the large transfers found (from/to, amount, tx).

## Output

List of large MNT transfers in the scanned window (from, to, amount, tx hash).
Source: Mantle RPC over recent blocks.

## Verification

- Scan completes and reports the block window covered
- Every listed transfer is ≥ the min-value threshold

## Pitfalls

- Scans a recent-block window, not full history
- Very high thresholds may return nothing — lower `--min-value` to confirm it works
