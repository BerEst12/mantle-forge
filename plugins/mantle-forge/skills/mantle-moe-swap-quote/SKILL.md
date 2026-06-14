---
name: mantle-moe-swap-quote
description: Get a real on-chain swap quote from the Merchant Moe LB Quoter on Mantle — no wallet needed.
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [mantle, defi, merchant-moe, swap, quote]
    category: mantle-forge
    requires_toolsets: [terminal]
---

# Mantle Merchant Moe — Swap Quote

Real-time swap quote from the Merchant Moe **LB Quoter** contract on Mantle
mainnet (`findBestPathFromAmountIn`). On-chain `eth_call` — no wallet, no gas,
no key required.

## When to Use

- User asks "how much USDC for 100 MNT", "swap quote", "price impact"
- Pricing a trade before execution (this skill quotes only — it does not swap)

## Inputs

| Input | Required |
|-------|----------|
| Token in (symbol or address) | Yes |
| Token out (symbol or address) | Yes |
| Amount in | Yes |

## Procedure

```bash
npx mantle-moe-swap-quote MNT USDC 100
npx mantle-moe-swap-quote WMNT USDT 100 --decimals 18 --json
```

Report `amountOut`, the route, and price impact.

## Output

Quoted output amount, route/path, and price impact %.
Source: on-chain LB Quoter `0x501b8AFd35df20f531fF45F6f695793AC3316c85` (Mantle mainnet).

## Verification

- A non-zero `amountOut` is returned for a liquid pair
- Price impact is reported and reasonable

## Pitfalls

- Quote only — never executes a swap or moves funds
- Illiquid pairs may return no route; suggest checking `mantle-moe-best-pool`
- Pass `--decimals` if a token uses non-18 decimals (e.g. USDC = 6)
