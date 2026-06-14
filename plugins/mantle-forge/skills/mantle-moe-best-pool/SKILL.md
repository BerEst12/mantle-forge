---
name: mantle-moe-best-pool
description: Find the best Merchant Moe pool for a specific token pair on Mantle.
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [mantle, defi, merchant-moe, pools]
    category: mantle-forge
    requires_toolsets: [terminal]
---

# Mantle Merchant Moe — Best Pool

Finds the best Merchant Moe (Liquidity Book) pool for a given token pair on
Mantle, by liquidity/activity. Read-only — no wallet, no key.

## When to Use

- User asks "best pool for MNT/USDC", "where should I LP this pair"
- Choosing the right pool before quoting a swap

## Inputs

| Input | Required |
|-------|----------|
| Token A symbol or address | Yes |
| Token B symbol or address | Yes |

## Procedure

```bash
npx mantle-moe-best-pool MNT USDC
npx mantle-moe-best-pool WMNT USDT --json
```

Report the chosen pool, its TVL, volume, and APY, and why it ranks best.

## Output

The top pool for the pair with address, TVL, and 24h volume.
Source: GeckoTerminal (Merchant Moe) — public, keyless.

## Verification

- A pool is returned for the pair (else report "no pool found")
- Token symbols resolve to the expected pair

## Pitfalls

- Mantle mainnet only
- If a symbol is ambiguous, prefer the token contract address
