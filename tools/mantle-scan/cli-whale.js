#!/usr/bin/env node
"use strict";

const { parseArgs, fail, printJson } = require("@mantle-forge/cli-utils");
const { getWhaleTransactions, formatWei, formatTime } = require("./lib/scan");

function printHelp() {
  console.log(`Usage: mantle-whale-tracker [--min-value N] [--network mainnet|sepolia] [--address 0x...] [--json]

Detect large MNT transactions on Mantle in recent blocks.

Options:
  --min-value  Minimum value in MNT (default: 10000)
  --network    mainnet (default) or sepolia
  --address    Watch a specific address instead of scanning all
  --limit      Max results (default: 20)
  --json       Output raw JSON

Example:
  mantle-whale-tracker --min-value 50000
  mantle-whale-tracker --address 0xabc123...
`);
}

async function main(argv) {
  const { flags } = parseArgs(argv);
  if (flags.help || flags.h) { printHelp(); return 0; }

  const network = flags.network || "mainnet";
  const minValue = parseFloat(flags["min-value"] || "10000");
  const limit = parseInt(flags.limit || "20", 10);
  const watchAddress = flags.address ? flags.address.toLowerCase() : null;

  console.log(`Scanning Mantle ${network} for native MNT transfers ≥ ${minValue.toLocaleString()} MNT...`);

  // Keyless: scan recent blocks over the Mantle RPC for large native-MNT transfers.
  let whales;
  try {
    whales = await getWhaleTransactions(network, minValue, watchAddress ? 500 : limit);
  } catch (e) {
    return fail(`Could not scan blocks: ${e.message}`);
  }

  if (watchAddress) {
    whales = whales
      .filter((tx) => (tx.from || "").toLowerCase() === watchAddress || (tx.to || "").toLowerCase() === watchAddress)
      .slice(0, limit);
  }

  if (flags.json) { printJson(whales); return 0; }

  if (!whales.length) {
    console.log(`No transactions ≥ ${minValue.toLocaleString()} MNT found in recent blocks.`);
    return 0;
  }

  console.log(`\nFound ${whales.length} whale transaction(s):\n${"─".repeat(110)}`);

  for (const tx of whales) {
    const val = formatWei(tx.value, 18, tx.tokenSymbol || "MNT");
    const time = formatTime(tx.timeStamp);
    const hash = tx.hash.slice(0, 12) + "...";
    console.log(`🐋 ${time}  ${val.padEnd(25)}  ${tx.from.slice(0, 10)}... → ${(tx.to || "").slice(0, 10)}...  ${hash}`);
  }

  console.log(`\nExplorer: https://${network === "sepolia" ? "sepolia." : ""}mantlescan.xyz`);
  return 0;
}

if (require.main === module) {
  main(process.argv.slice(2)).then(process.exit).catch((e) => { console.error(e.message); process.exit(1); });
}
module.exports = { main };
