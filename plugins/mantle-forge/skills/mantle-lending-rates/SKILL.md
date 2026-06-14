---
name: mantle-lending-rates
description: Supply APY and borrow APR on Mantle lending markets (Lendle, INIT, Aave) via DefiLlama.
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [mantle, defi, lending, borrow, defillama]
    category: mantle-forge
    requires_toolsets: [terminal]
---

# Mantle Lending Rates

Supply APY and borrow APR for lending markets on Mantle (Lendle, INIT Capital,
Aave v3, …), via the public DefiLlama Yields API. No key required.

## When to Use

- User asks "lending rates on Mantle", "supply APY for USDC", "borrow cost"
- Comparing money-market rates across protocols

## Procedure

```bash
curl -s "https://yields.llama.fi/pools" \
  | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>{const lend=/lendle|init-capital|aave|compound/i;const m=JSON.parse(d).data.filter(p=>p.chain==="Mantle"&&lend.test(p.project)).sort((a,b)=>b.tvlUsd-a.tvlUsd).slice(0,12);m.forEach(p=>console.log(`${p.project} ${p.symbol}: supply ${(p.apyBase||p.apy||0).toFixed(2)}%  borrow ${p.apyBaseBorrow!=null?p.apyBaseBorrow.toFixed(2)+"%":"n/a"}  (TVL $${Math.round(p.tvlUsd).toLocaleString()})`))})'
```

## Output

Per-market supply APY and borrow APR with TVL, grouped by protocol/asset.
Source: DefiLlama Yields (`yields.llama.fi/pools`).

## Verification

- At least one lending pool on Mantle is returned
- Supply and (where available) borrow rates are shown per asset

## Pitfalls

- Not every pool exposes a borrow rate (`apyBaseBorrow` may be null)
- Rates are utilization-driven and change continuously
