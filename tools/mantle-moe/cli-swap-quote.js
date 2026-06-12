#!/usr/bin/env node
"use strict";

const { parseArgs, fail, printJson } = require("@mantle-forge/cli-utils");
const { getSwapQuote, getDecimals, resolveToken, ADDRESSES } = require("./lib/quote");

function printHelp() {
  console.log(`Usage: mantle-moe-swap-quote <tokenIn> <tokenOut> <amount> [--decimals N] [--json]

Get a swap quote from Merchant Moe LB Quoter on Mantle mainnet.
Uses LBQuoter.findBestPathFromAmountIn — no wallet or gas needed.

Arguments:
  tokenIn   Symbol (MNT, USDC, USDT, WETH, METH, MOE) or 0x address
  tokenOut  Symbol or 0x address
  amount    Amount of tokenIn (human-readable, e.g. 100 or 1.5)

Options:
  --decimals N   Decimals of tokenIn (default: 18; USDC/USDT = 6)
  --json         Output raw JSON

Examples:
  mantle-moe-swap-quote MNT USDC 100
  mantle-moe-swap-quote USDC MNT 50 --decimals 6
  mantle-moe-swap-quote WETH MNT 0.5

Known tokens: MNT/WMNT, USDC, USDT, WETH, METH, MOE
Contracts (Mantle mainnet):
  LB Quoter:  ${ADDRESSES.LB_QUOTER}
  LB Router:  ${ADDRESSES.LB_ROUTER}
  LB Factory: ${ADDRESSES.LB_FACTORY}
`);
}

async function main(argv) {
  const { positional, flags } = parseArgs(argv);
  if (flags.help || flags.h) { printHelp(); return 0; }

  const [tokenIn, tokenOut, amountStr] = positional;
  if (!tokenIn || !tokenOut || !amountStr) {
    printHelp();
    return fail("Missing required arguments: <tokenIn> <tokenOut> <amount>");
  }

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) return fail(`Invalid amount: ${amountStr}`);

  // Auto-detect decimals for common stable coins
  let decimals = flags.decimals ? parseInt(flags.decimals) : null;
  if (!decimals) {
    const sym = tokenIn.toUpperCase();
    decimals = (sym === "USDC" || sym === "USDT") ? 6 : 18;
  }

  console.log(`Fetching quote from Merchant Moe LB Quoter...`);
  console.log(`  ${amount} ${tokenIn.toUpperCase()} → ${tokenOut.toUpperCase()}`);
  console.log(`  Quoter: ${ADDRESSES.LB_QUOTER}\n`);

  let quote;
  try {
    quote = await getSwapQuote(tokenIn, tokenOut, amountStr, decimals);
  } catch (e) {
    return fail(`Quote failed: ${e.message}`);
  }

  if (flags.json) { printJson(quote); return 0; }

  // Parse amountOut from decoded values
  // The LBQuoter returns amounts[] where amounts[last] = amountOut
  // We look for the most likely output amount in the decoded values
  const values = quote.decoded.values;

  // amountInWei is known; find values near it or smaller (output)
  const amountInWei = BigInt(quote.amountInWei);

  // Candidate output amounts: values that are plausibly token amounts
  // Filter out obvious offsets/lengths (< 1000) and impossibly large values
  const candidates = values.filter((v) => v > 1000n && v !== amountInWei);

  if (!candidates.length) {
    console.log("⚠️  Could not parse quote output — raw response:");
    console.log(`   ${quote.raw.slice(0, 200)}...`);
    console.log("\nTip: The LBQuoter returned data but our minimal decoder needs");
    console.log("     a full ethers.js integration. Install ethers and retry:");
    console.log("     npm install ethers -w @mantle-forge/mantle-moe");
    return 0;
  }

  // Best guess: first candidate after amountIn in the slots
  const amountOutWei = candidates[0];
  const decimalsOut = (tokenOut.toUpperCase() === "USDC" || tokenOut.toUpperCase() === "USDT") ? 6 : 18;
  const amountOut = Number(amountOutWei) / 10 ** decimalsOut;
  const rate = amountOut / amount;

  // Price impact: compare with virtual amount if available
  const virtualOut = candidates[1] || amountOutWei;
  const priceImpact = candidates[1]
    ? ((Number(virtualOut) - Number(amountOutWei)) / Number(virtualOut) * 100).toFixed(3)
    : "N/A";

  console.log(`Swap Quote — Merchant Moe (Liquidity Book)
${"─".repeat(52)}
Input:        ${amount} ${quote.tokenIn}
Output:       ${amountOut.toFixed(6)} ${quote.tokenOut}
Rate:         1 ${quote.tokenIn} = ${rate.toFixed(6)} ${quote.tokenOut}
Price impact: ${priceImpact}%

Addresses:
  Token In:   ${quote.addressIn}
  Token Out:  ${quote.addressOut}
  LB Quoter:  ${ADDRESSES.LB_QUOTER}

To execute swap:
  LB Router:  ${ADDRESSES.LB_ROUTER}
  Call:       swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline)

Source: Merchant Moe LBQuoter on Mantle mainnet
Docs:   https://docs.merchantmoe.com
`);

  return 0;
}

if (require.main === module) {
  main(process.argv.slice(2)).then(process.exit).catch((e) => { console.error(e.message); process.exit(1); });
}
module.exports = { main };
