---
name: mantle-token-info
description: Price, volume, and liquidity for any token on Mantle via DexScreener.
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [mantle, defi, prices, dexscreener, token]
    category: mantle-forge
    requires_toolsets: [terminal]
---

# Mantle Token Info

Price, 24h volume, and pooled liquidity for any token traded on Mantle, via the
public DexScreener API. No key required.

## When to Use

- User asks "price of <token> on Mantle", "liquidity/volume for <token>"
- Looking up a token by symbol or contract address

## Procedure

By symbol/pair search:

```bash
curl -s "https://api.dexscreener.com/latest/dex/search?q=MNT%20USDC" \
  | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>{const p=(JSON.parse(d).pairs||[]).filter(x=>x.chainId==="mantle");p.slice(0,5).forEach(x=>console.log(`${x.baseToken.symbol}/${x.quoteToken.symbol}  $${x.priceUsd}  vol24h:$${Math.round(x.volume.h24||0)}  liq:$${Math.round((x.liquidity||{}).usd||0)}`))})'
```

By token address:

```bash
curl -s "https://api.dexscreener.com/latest/dex/tokens/0x<address>" | node -e '...'
```

Filter `chainId === "mantle"` and report price, 24h volume, liquidity.

## Output

Token price (USD), 24h volume, pooled liquidity, top pairs on Mantle.
Source: DexScreener (`api.dexscreener.com`).

## Verification

- At least one `mantle` pair is returned for the query
- Price/volume are non-negative numbers

## Pitfalls

- Always filter `chainId === "mantle"` — search returns all chains
- Thinly-traded tokens may have stale or volatile prices
