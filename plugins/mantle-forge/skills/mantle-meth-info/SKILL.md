---
name: mantle-meth-info
description: mETH liquid staking on Mantle — APY, TVL, and pools via DefiLlama.
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [mantle, defi, meth, staking, defillama]
    category: mantle-forge
    requires_toolsets: [terminal]
---

# Mantle mETH Info

Liquid staking stats for mETH Protocol on Mantle — TVL and the mETH/cmETH yield
pools — via the public DefiLlama API. No key required.

## When to Use

- User asks "mETH APY/TVL", "mETH staking yield", "mETH pools on Mantle"
- Liquid-staking context for the Mantle ecosystem

## Procedure

Protocol TVL:

```bash
curl -s "https://api.llama.fi/protocol/meth-protocol" \
  | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>{const a=JSON.parse(d);console.log(`${a.name} | total TVL $${Math.round(a.currentChainTvls?Object.values(a.currentChainTvls).reduce((s,v)=>s+v,0):0).toLocaleString()} | chains: ${(a.chains||[]).join(", ")}`)})'
```

mETH/cmETH yield pools on Mantle:

```bash
curl -s "https://yields.llama.fi/pools" \
  | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>{const m=JSON.parse(d).data.filter(p=>p.chain==="Mantle"&&/meth/i.test(p.symbol)).sort((a,b)=>b.tvlUsd-a.tvlUsd);m.forEach(p=>console.log(`${p.project} ${p.symbol}: ${(p.apy||0).toFixed(2)}% APY  (TVL $${Math.round(p.tvlUsd).toLocaleString()})`))})'
```

## Output

mETH Protocol TVL plus mETH/cmETH pools with APY and TVL.
Source: DefiLlama (`api.llama.fi/protocol/meth-protocol`, `yields.llama.fi`).

## Verification

- The `meth-protocol` slug resolves with a TVL
- At least the mETH/cmETH pools are listed (or report none found)

## Pitfalls

- `mETH` (liquid staking receipt) vs `cmETH` (restaked) — label which you report
- Staking APY is variable; present as current, not guaranteed
