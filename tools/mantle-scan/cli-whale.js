#!/usr/bin/env node
"use strict";

const { parseArgs, fail, printJson } = require("@mantle-forge/cli-utils");
const { getTxHistory, formatWei, formatTime, buildUrl } = require("./lib/scan");
const https = require("https");

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

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => { try { resolve(JSON.parse(data)); } catch (e) { reject(e); } });
    }).on("error", reject);
  });
}

async function main(argv) {
  const { positional, flags } = parseArgs(argv);
  if (flags.help || flags.h) { printHelp(); return 0; }

  const network = flags.network || "mainnet";
  const minValue = parseFloat(flags["min-value"] || "10000");
  const limit = parseInt(flags.limit || "20", 10);
  const watchAddress = flags.address || null;

  console.log(`Scanning Mantle ${network} for transactions ≥ ${minValue.toLocaleString()} MNT...`);

  let txs = [];

  if (watchAddress) {
    // Watch specific address
    txs = await getTxHistory(watchAddress, { network, offset: 100 });
  } else {
    // Scan recent MNT token transfers
    const url = buildUrl(network, {
      module: "account",
      action: "tokentx",
      contractaddress: "0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb",
      page: 1,
      offset: 200,
      sort: "desc",
    });
    const res = await get(url);
    txs = Array.isArray(res.result) ? res.result : [];
  }

  const minValueWei = BigInt(Math.floor(minValue * 1e18));
  const whales = txs
    .filter((tx) => {
      try { return BigInt(tx.value) >= minValueWei; } catch { return false; }
    })
    .slice(0, limit);

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

  console.log(`\nExplorer: https://explorer${network === "sepolia" ? ".sepolia" : ""}.mantle.xyz`);
  return 0;
}

if (require.main === module) {
  main(process.argv.slice(2)).then(process.exit).catch((e) => { console.error(e.message); process.exit(1); });
}
module.exports = { main };
