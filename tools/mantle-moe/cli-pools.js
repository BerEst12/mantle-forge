#!/usr/bin/env node
"use strict";

const { parseArgs, fail, printJson } = require("@mantle-forge/cli-utils");
const { getPools, formatUSD } = require("./lib/moe");

function printHelp() {
  console.log(`Usage: mantle-moe-pools [--limit N] [--sort liquidity|volume|apy] [--json]

List Merchant Moe liquidity pools on Mantle ranked by liquidity.

Options:
  --limit   Number of pools to show (default: 20)
  --sort    liquidity (default), volume, or apy
  --json    Output raw JSON

Example:
  mantle-moe-pools
  mantle-moe-pools --limit 10 --sort volume
`);
}

async function main(argv) {
  const { flags } = parseArgs(argv);
  if (flags.help || flags.h) { printHelp(); return 0; }

  const limit = parseInt(flags.limit || "20", 10);
  const sortKey = flags.sort || "liquidity";

  const orderBy = sortKey === "volume" ? "volumeUSD"
    : sortKey === "apy" ? "reserveUSD"
    : "reserveUSD";

  let pools;
  try {
    pools = await getPools({ limit, orderBy });
  } catch (e) {
    return fail(`Could not fetch pools: ${e.message}`);
  }

  if (sortKey === "apy") {
    pools.sort((a, b) => (b.apy || 0) - (a.apy || 0));
  }

  if (flags.json) { printJson(pools); return 0; }

  console.log(`\nMerchant Moe — Top ${pools.length} Pools on Mantle`);
  console.log(`Source: ${pools[0]?.source === "defillama" ? "DefiLlama" : "Subgraph"}\n`);
  console.log(`${"#".padEnd(4)} ${"Pool".padEnd(22)} ${"Liquidity".padEnd(12)} ${"Volume 24h".padEnd(12)} ${"APY".padEnd(8)} Txs`);
  console.log("─".repeat(72));

  pools.forEach((p, i) => {
    const apy = p.apy ? `${p.apy.toFixed(1)}%` : "N/A";
    const vol = p.volumeUSD ? formatUSD(p.volumeUSD) : "N/A";
    console.log(
      `${String(i + 1).padEnd(4)} ${p.symbol.padEnd(22)} ${formatUSD(p.liquidityUSD).padEnd(12)} ${vol.padEnd(12)} ${apy.padEnd(8)} ${p.txCount.toLocaleString()}`
    );
  });

  const totalLiq = pools.reduce((s, p) => s + p.liquidityUSD, 0);
  console.log(`\nTotal liquidity shown: ${formatUSD(totalLiq)}`);
  console.log(`DEX: https://app.merchantmoe.com`);
  return 0;
}

if (require.main === module) {
  main(process.argv.slice(2)).then(process.exit).catch((e) => { console.error(e.message); process.exit(1); });
}
module.exports = { main };
