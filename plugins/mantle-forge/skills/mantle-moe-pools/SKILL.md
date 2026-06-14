---
name: mantle-moe-pools
description: List Merchant Moe (Liquidity Book) pools on Mantle ranked by liquidity, volume, or APY.
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [mantle, defi, merchant-moe, pools, liquidity]
    category: mantle-forge
    requires_toolsets: [terminal]
---

# Mantle Merchant Moe Pools

Lists Merchant Moe liquidity pools on Mantle, ranked by liquidity (TVL), volume,
or APY. Read-only — no wallet, no key, no deploy.

## When to Use

- User asks "top Merchant Moe pools", "best LP pools on Mantle", "where's the liquidity"
- Picking a pool for a swap or LP position
- Before `mantle-moe-best-pool` / `mantle-moe-swap-quote` to survey the market

## Inputs

| Input | Required | Default |
|-------|----------|---------|
| Sort key (`liquidity` \| `volume` \| `apy`) | No | `liquidity` |
| Limit | No | 20 |

## Procedure

```bash
npx mantle-moe-pools                 # top 20 by liquidity
npx mantle-moe-pools --sort apy --limit 10
npx mantle-moe-pools --json          # machine-readable
```

Then summarize the top pools (pair, TVL, volume, APY) for the user.

## Output

Ranked table of pools with pair, liquidity/TVL, 24h volume, and APY.
Source: Merchant Moe subgraph / DefiLlama.

## Verification

- Command exits 0 and returns at least one pool
- Numbers are sane (TVL/volume non-negative)

## Pitfalls

- Mainnet data (Merchant Moe is on Mantle mainnet), not Sepolia
- APY is indicative and changes continuously — never present as guaranteed yield
