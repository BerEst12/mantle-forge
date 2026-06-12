#!/usr/bin/env node
"use strict";

const { parseArgs, fail, printJson } = require("@mantle-forge/cli-utils");
const { getTx, formatWei, formatTime } = require("./lib/scan");

function printHelp() {
  console.log(`Usage: mantle-scan-tx <tx-hash> [--network mainnet|sepolia] [--json]

Look up a transaction on Mantle Scan and display a human-readable summary.

Options:
  --network   mainnet (default) or sepolia
  --json      Output raw JSON

Example:
  mantle-scan-tx 0xabc123...
  mantle-scan-tx 0xabc123... --network sepolia
`);
}

async function main(argv) {
  const { positional, flags } = parseArgs(argv);
  if (flags.help || flags.h) { printHelp(); return 0; }

  const [txHash] = positional;
  if (!txHash) return fail("Missing required argument: <tx-hash>");

  const network = flags.network || "mainnet";

  let tx;
  try {
    tx = await getTx(txHash, network);
  } catch (e) {
    return fail(`Could not fetch tx: ${e.message}`);
  }

  if (flags.json) { printJson(tx); return 0; }

  const status = tx.txreceipt_status === "1" ? "✅ Success" : tx.txreceipt_status === "0" ? "❌ Failed" : "⏳ Pending";
  const isContract = tx.input && tx.input !== "0x";

  console.log(`
Transaction: ${tx.hash}
Network:     Mantle ${network}
Status:      ${status}

From:        ${tx.from}
To:          ${tx.to || "(contract creation)"}
Value:       ${formatWei(tx.value || "0")}
Type:        ${isContract ? "Contract call" : "Transfer"}

Block:       ${parseInt(tx.blockNumber, 10).toLocaleString()}
Timestamp:   ${formatTime(tx.timeStamp)}
Gas used:    ${parseInt(tx.gasUsed, 10).toLocaleString()} / ${parseInt(tx.gas, 10).toLocaleString()}
Gas price:   ${(Number(tx.gasPrice) / 1e9).toFixed(4)} Gwei
Tx fee:      ${formatWei(String(BigInt(tx.gasUsed || 0) * BigInt(tx.gasPrice || 0)))}

Explorer: https://explorer${network === "sepolia" ? ".sepolia" : ""}.mantle.xyz/tx/${tx.hash}
`);
  return 0;
}

if (require.main === module) {
  main(process.argv.slice(2)).then(process.exit).catch((e) => { console.error(e.message); process.exit(1); });
}
module.exports = { main };
