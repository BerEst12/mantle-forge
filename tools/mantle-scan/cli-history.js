#!/usr/bin/env node
"use strict";

const { parseArgs, fail, printJson } = require("@mantle-forge/cli-utils");
const { getTxHistory, formatWei, formatTime } = require("./lib/scan");

function printHelp() {
  console.log(`Usage: mantle-tx-history <address> [--network mainnet|sepolia] [--limit N] [--json]

Show transaction history for a wallet on Mantle.

Options:
  --network   mainnet (default) or sepolia
  --limit     Number of transactions (default: 20)
  --json      Output raw JSON

Example:
  mantle-tx-history 0xabc123...
  mantle-tx-history 0xabc123... --limit 50 --network sepolia
`);
}

async function main(argv) {
  const { positional, flags } = parseArgs(argv);
  if (flags.help || flags.h) { printHelp(); return 0; }

  const [address] = positional;
  if (!address) return fail("Missing required argument: <address>");

  const network = flags.network || "mainnet";
  const limit = parseInt(flags.limit || "20", 10);

  let txs;
  try {
    txs = await getTxHistory(address, { network, offset: limit });
  } catch (e) {
    return fail(`Could not fetch history: ${e.message}`);
  }

  if (flags.json) { printJson(txs); return 0; }

  if (!txs.length) {
    console.log(`No transactions for ${address} in recent Mantle ${network} blocks (keyless RPC scan).`);
    return 0;
  }

  // Summarize gas spent
  const totalGasWei = txs.reduce((acc, tx) => {
    try { return acc + BigInt(tx.gasUsed) * BigInt(tx.gasPrice); } catch { return acc; }
  }, 0n);

  const sent = txs.filter((tx) => tx.from.toLowerCase() === address.toLowerCase());
  const received = txs.filter((tx) => tx.to && tx.to.toLowerCase() === address.toLowerCase());
  const contractCalls = txs.filter((tx) => tx.input && tx.input !== "0x");

  console.log(`
Transaction History: ${address}
Network: Mantle ${network}
Showing: ${txs.length} txs from recent blocks (keyless RPC — not full history)

Summary:
  Sent:           ${sent.length} txs
  Received:       ${received.length} txs
  Contract calls: ${contractCalls.length} txs
  Total gas paid: ${formatWei(totalGasWei.toString())}

Recent Transactions:
${"─".repeat(100)}`);

  for (const tx of txs) {
    const status = tx.txreceipt_status === "1" ? "✅" : tx.txreceipt_status === "0" ? "❌" : "⏳";
    const direction = tx.from.toLowerCase() === address.toLowerCase() ? "OUT" : " IN";
    const isCall = tx.input && tx.input !== "0x";
    const val = formatWei(tx.value || "0");
    const time = formatTime(tx.timeStamp);
    const hash = tx.hash.slice(0, 10) + "...";
    const counterpart = direction === "OUT" ? (tx.to || "contract create") : tx.from;

    console.log(`${status} ${direction} ${time}  ${hash}  ${val.padEnd(20)} ${isCall ? "[call]" : "      "} ${counterpart}`);
  }

  console.log(`\nExplorer: https://${network === "sepolia" ? "sepolia." : ""}mantlescan.xyz/address/${address}`);
  return 0;
}

if (require.main === module) {
  main(process.argv.slice(2)).then(process.exit).catch((e) => { console.error(e.message); process.exit(1); });
}
module.exports = { main };
