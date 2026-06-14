---
name: mantle-protocol-stats
description: TVL, chains, and history for any Mantle protocol via DefiLlama.
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [mantle, defi, defillama, protocol, tvl]
    category: mantle-forge
    requires_toolsets: [terminal]
---

# Mantle Protocol Stats

Detailed stats for a single protocol on Mantle — current TVL, chains it spans,
and TVL history — via the public DefiLlama API. No key required.

## When to Use

- User asks "stats for <protocol>", "how big is Merchant Moe / Lendle on Mantle"
- Drilling into one protocol after `mantle-tvl-overview`

## Procedure

```bash
# Slug comes from defillama.com/protocol/<slug> (e.g. merchant-moe, lendle, init-capital)
curl -s "https://api.llama.fi/protocol/merchant-moe" \
  | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>{const a=JSON.parse(d);const mantle=(a.currentChainTvls&&a.currentChainTvls.Mantle)||0;console.log(`${a.name} | Mantle TVL: $${Math.round(mantle).toLocaleString()} | chains: ${(a.chains||[]).join(", ")}`)})'
```

## Output

Protocol name, Mantle TVL, all chains, and recent TVL trend.
Source: DefiLlama (`api.llama.fi/protocol/<slug>`).

## Verification

- The slug resolves (else DefiLlama returns an error — confirm at defillama.com)
- `currentChainTvls.Mantle` is reported for Mantle-specific TVL

## Pitfalls

- Use the DefiLlama **slug** (kebab-case), not the display name
- Distinguish Mantle TVL from the protocol's multi-chain total
