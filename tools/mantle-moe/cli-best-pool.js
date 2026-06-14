#!/usr/bin/env node
"use strict";

const { parseArgs, fail, printJson } = require("@mantle-forge/cli-utils");
const { getBestPool, formatUSD } = require("./lib/moe");

function printHelp() {
  console.log(`Usage: mantle-moe-best-pool <tokenA> <tokenB> [--json]

Find the best Merchant Moe pool for a token pair on Mantle.

Options:
  --json    Output raw JSON

Example:
  mantle-moe-best-pool MNT USDC
  mantle-moe-best-pool WETH USDT
`);
}

async function main(argv) {
  const { positional, flags } = parseArgs(argv);
  if (flags.help || flags.h) { printHelp(); return 0; }

  const [tokenA, tokenB] = positional;
  if (!tokenA || !tokenB) return fail("Missing required arguments: <tokenA> <tokenB>");

  let matches;
  try {
    matches = await getBestPool(tokenA, tokenB);
  } catch (e) {
    return fail(`Could not fetch pools: ${e.message}`);
  }

  if (flags.json) { printJson(matches); return 0; }

  if (!matches.length) {
    console.log(`\nNo Merchant Moe pools found for ${tokenA}/${tokenB} on Mantle.`);
    console.log(`Check available pools: mantle-moe-pools`);
    console.log(`Or add liquidity: https://app.merchantmoe.com/pool`);
    return 0;
  }

  const best = matches[0];
  console.log(`
Best Merchant Moe Pool: ${tokenA.toUpperCase()}/${tokenB.toUpperCase()}
${"─".repeat(50)}
Pool:       ${best.symbol}
Liquidity:  ${formatUSD(best.liquidityUSD)}
${best.apy ? `APY:        ${best.apy.toFixed(2)}%` : ""}${best.apyBase ? `\nBase APY:   ${best.apyBase.toFixed(2)}%` : ""}${best.apyReward ? `\nReward APY: ${best.apyReward.toFixed(2)}%` : ""}
${best.volumeUSD ? `Volume 24h: ${formatUSD(best.volumeUSD)}` : ""}
Pool ID:    ${best.id}
Source:     GeckoTerminal (Merchant Moe)
`);

  if (matches.length > 1) {
    console.log(`Other matching pools:`);
    for (const p of matches.slice(1)) {
      console.log(`  ${p.symbol.padEnd(20)} Liquidity: ${formatUSD(p.liquidityUSD)}${p.apy ? `  APY: ${p.apy.toFixed(1)}%` : ""}`);
    }
  }

  console.log(`\nAdd liquidity: https://app.merchantmoe.com/pool`);
  console.log(`Trade:         https://app.merchantmoe.com/trade`);
  return 0;
}

if (require.main === module) {
  main(process.argv.slice(2)).then(process.exit).catch((e) => { console.error(e.message); process.exit(1); });
}
module.exports = { main };
