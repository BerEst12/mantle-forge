---
name: mantle-yield-finder
description: Best APY/yield opportunities on Mantle right now via DefiLlama Yields.
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [mantle, defi, yield, apy, defillama]
    category: mantle-forge
    requires_toolsets: [terminal]
---

# Mantle Yield Finder

Top yield opportunities on Mantle, ranked by APY, via the public DefiLlama
Yields API. No key required.

## When to Use

- User asks "best yields on Mantle", "highest APY", "where to farm"
- Surveying farming/staking opportunities

## Procedure

```bash
curl -s "https://yields.llama.fi/pools" \
  | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>{const m=JSON.parse(d).data.filter(p=>p.chain==="Mantle"&&p.tvlUsd>50000).sort((a,b)=>(b.apy||0)-(a.apy||0)).slice(0,10);m.forEach(p=>console.log(`${p.project} ${p.symbol}: ${(p.apy||0).toFixed(2)}% APY  (TVL $${Math.round(p.tvlUsd).toLocaleString()})`))})'
```

Filter `chain === "Mantle"`, drop dust TVL, sort by `apy` desc.

## Output

Top pools by APY: project, symbol, APY, TVL.
Source: DefiLlama Yields (`yields.llama.fi/pools`).

## Verification

- At least one Mantle pool is returned
- A TVL floor is applied so dust pools with fake APY are excluded

## Pitfalls

- High APY often means high risk or low TVL — always show TVL alongside APY
- APY is variable and not guaranteed — never present as fixed return
