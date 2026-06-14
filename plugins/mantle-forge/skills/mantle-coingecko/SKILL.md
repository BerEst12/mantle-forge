---
name: mantle-coingecko
description: MNT price, market cap, 24h change, and ecosystem token data via CoinGecko.
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [mantle, defi, prices, coingecko, mnt]
    category: mantle-forge
    requires_toolsets: [terminal]
---

# Mantle CoinGecko

MNT market data — price, market cap, 24h change, volume — and other Mantle
ecosystem tokens, via the public CoinGecko API. No key required.

## When to Use

- User asks "MNT price", "MNT market cap", "how is MNT doing today"
- Market context for a Mantle token

## Procedure

MNT snapshot:

```bash
curl -s "https://api.coingecko.com/api/v3/simple/price?ids=mantle&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true" \
  | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>{const m=JSON.parse(d).mantle;console.log(`MNT $${m.usd} | mcap $${Math.round(m.usd_market_cap).toLocaleString()} | 24h ${m.usd_24h_change?.toFixed(2)}%`)})'
```

Other ecosystem tokens: change `ids=` (e.g. `ids=mantle-staked-ether`).

## Output

Price (USD), market cap, 24h change, 24h volume for the requested token(s).
Source: CoinGecko (`api.coingecko.com`).

## Verification

- The requested `id` resolves (else CoinGecko returns `{}` — confirm the slug)
- Values are present and numeric

## Pitfalls

- CoinGecko ids are slugs (`mantle`, not `MNT`)
- Public tier is rate-limited — avoid tight loops
