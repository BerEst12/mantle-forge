---
name: mantle-tvl-overview
description: Total TVL on Mantle and top protocols by TVL via DefiLlama.
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [mantle, defi, tvl, defillama, protocols]
    category: mantle-forge
    requires_toolsets: [terminal]
---

# Mantle TVL Overview

Total value locked on Mantle and the top protocols ranked by TVL, via the public
DefiLlama API. No key required.

## When to Use

- User asks "TVL on Mantle", "biggest protocols on Mantle", "DeFi overview"
- Ecosystem sizing / market context

## Procedure

Chain TVL:

```bash
curl -s "https://api.llama.fi/v2/chains" \
  | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>{const m=JSON.parse(d).find(c=>c.name==="Mantle");console.log(`Mantle TVL: $${Math.round(m.tvl).toLocaleString()}`)})'
```

Top protocols on Mantle:

```bash
curl -s "https://api.llama.fi/protocols" \
  | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>{const p=JSON.parse(d).filter(x=>x.chains.includes("Mantle")).map(x=>({n:x.name,t:(x.chainTvls&&x.chainTvls.Mantle)||0})).sort((a,b)=>b.t-a.t).slice(0,10);p.forEach(x=>console.log(`${x.n}: $${Math.round(x.t).toLocaleString()}`))})'
```

## Output

Total Mantle TVL and top-10 protocols by Mantle TVL.
Source: DefiLlama (`api.llama.fi`).

## Verification

- Mantle is found in `/v2/chains` with a positive TVL
- Protocol list is sorted by Mantle-specific TVL (`chainTvls.Mantle`)

## Pitfalls

- Use `chainTvls.Mantle`, not the protocol's global `tvl`, for Mantle ranking
- TVL moves with price — present as a current snapshot
