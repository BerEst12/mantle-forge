---
name: mantle-defi-prices
description: Real-time token prices on Mantle via DefiLlama coins (by token address or coingecko id).
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [mantle, defi, prices, defillama]
    category: mantle-forge
    requires_toolsets: [terminal]
---

# Mantle DeFi Prices

Real-time USD prices for tokens on Mantle via the public DefiLlama coins API —
by Mantle token address or by coingecko id, with a confidence score. No key.

## When to Use

- User asks "price of <token>", "MNT price", "value of this Mantle token address"
- Quick, reliable price with a freshness/confidence signal

## Procedure

MNT (by coingecko id):

```bash
curl -s "https://coins.llama.fi/prices/current/coingecko:mantle" \
  | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>{const c=JSON.parse(d).coins["coingecko:mantle"];console.log(`${c.symbol} $${c.price}  (confidence ${c.confidence})`)})'
```

Any token by Mantle address:

```bash
curl -s "https://coins.llama.fi/prices/current/mantle:0x<address>" | node -e '...'
```

Batch multiple, comma-separated: `coingecko:mantle,mantle:0x<addr>`.

## Output

USD price + confidence + timestamp per token.
Source: DefiLlama coins (`coins.llama.fi`).

## Verification

- Each requested coin key appears in `coins` (missing = unpriced / wrong id)
- `confidence` is reported; flag low-confidence prices

## Pitfalls

- Use the `mantle:` chain prefix for token addresses, `coingecko:` for ids
- Low confidence or stale timestamp = thin liquidity; cross-check `mantle-token-info`
