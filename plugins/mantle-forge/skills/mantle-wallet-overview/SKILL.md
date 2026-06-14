---
name: mantle-wallet-overview
description: Wallet portfolio on Mantle — native MNT via RPC, full token/DeFi breakdown via Zerion (optional key).
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [mantle, wallet, portfolio, zerion, rpc]
    category: mantle-forge
    requires_toolsets: [terminal]
---

# Mantle Wallet Overview

Portfolio snapshot for an address on Mantle. Works with **no key** for the native
MNT balance via RPC; a Zerion API key adds the full token + DeFi-position
breakdown.

## When to Use

- User asks "what's in this wallet", "portfolio for 0x…", "holdings on Mantle"

## Procedure

Native MNT balance (no key):

```bash
curl -s -X POST "https://rpc.mantle.xyz" -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getBalance","params":["0x<address>","latest"]}' \
  | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>{console.log("MNT:", Number(BigInt(JSON.parse(d).result))/1e18)})'
```

Full portfolio (tokens + DeFi positions) with a Zerion key:

```bash
export ZERION_API_KEY=<key>   # free tier: 100 req/day at developers.zerion.io
curl -s "https://api.zerion.io/v1/wallets/0x<address>/positions/?filter[chain_ids]=mantle" \
  -H "Authorization: Basic $(printf '%s:' "$ZERION_API_KEY" | base64)"
```

ERC-20 balances without Zerion: use `mantle-tx-history` / Mantle Scan token-balance endpoints.

## Output

Native MNT balance always; full token + DeFi-position breakdown when a Zerion key is set.
Source: Mantle RPC (`rpc.mantle.xyz`) + Zerion (`api.zerion.io`, optional).

## Verification

- Native balance returns from RPC even with no key
- With a Zerion key, positions are filtered to `chain_ids=mantle`

## Pitfalls

- Without a Zerion key you get native MNT only — state that limitation to the user
- Zerion auth is HTTP Basic with the key as the username (note the trailing `:`)
