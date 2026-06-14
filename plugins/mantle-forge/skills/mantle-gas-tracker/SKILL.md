---
name: mantle-gas-tracker
description: Current Mantle gas price and transaction cost estimates in gwei and USD.
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [mantle, gas, rpc, fees]
    category: mantle-forge
    requires_toolsets: [terminal]
---

# Mantle Gas Tracker

Current Mantle gas price straight from the RPC, plus a USD cost estimate for a
typical transaction (using the live MNT price). No key required.

## When to Use

- User asks "current gas on Mantle", "how much to send a tx", "tx cost in USD"
- Sanity-checking deploy/transfer costs

## Procedure

```bash
# 1) live gas price (wei -> gwei)
curl -s -X POST "https://rpc.mantle.xyz" -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_gasPrice","params":[]}' \
  | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>{const wei=BigInt(JSON.parse(d).result);console.log("gasPrice:", Number(wei)/1e9, "gwei")})'

# 2) MNT price for the USD estimate
curl -s "https://api.coingecko.com/api/v3/simple/price?ids=mantle&vs_currencies=usd"
```

Estimate cost = gasPrice(wei) × gasLimit × MNT_price / 1e18 (e.g. 21000 for a
transfer, ~1.2M for a contract deploy). Use Sepolia RPC `https://rpc.sepolia.mantle.xyz`
for testnet.

## Output

Current gas price (gwei) and estimated USD cost for transfer / deploy.
Source: Mantle RPC (`rpc.mantle.xyz`) + CoinGecko for MNT/USD.

## Verification

- RPC returns a `result` hex gas price
- USD estimate uses the live MNT price, not a hardcoded value

## Pitfalls

- Mantle fees include an L1 data component for some txs — treat USD as an estimate
- Use the matching network RPC (mainnet vs Sepolia)
