#!/usr/bin/env node
"use strict";

const { parseArgs, fail, printJson } = require("@mantle-forge/cli-utils");
const { getContractInfo } = require("./lib/scan");

function printHelp() {
  console.log(`Usage: mantle-scan-contract <address> [--network mainnet|sepolia] [--json]

Inspect a contract on Mantle via the public RPC (keyless): confirms it is a
contract, shows the bytecode size, and lists the function selectors found in the
bytecode, resolved to signatures via 4byte.directory.

Options:
  --network   mainnet (default) or sepolia
  --json      Output raw JSON

Example:
  mantle-scan-contract 0xabc123...
  mantle-scan-contract 0xabc123... --network sepolia
`);
}

async function main(argv) {
  const { positional, flags } = parseArgs(argv);
  if (flags.help || flags.h) { printHelp(); return 0; }

  const [address] = positional;
  if (!address) return fail("Missing required argument: <address>");

  const network = flags.network || "mainnet";

  let info;
  try {
    info = await getContractInfo(address, network);
  } catch (e) {
    return fail(`Could not inspect contract: ${e.message}`);
  }

  if (flags.json) { printJson({ network, ...info }); return 0; }

  console.log(`
Contract:     ${address}
Network:      Mantle ${network}
Is contract:  ${info.isContract ? "✅ Yes" : "❌ No (EOA / no bytecode)"}`);

  if (!info.isContract) {
    console.log(`\nNo bytecode at this address on Mantle ${network}.\n`);
    return 0;
  }

  console.log(`Bytecode:     ${info.bytecodeSize.toLocaleString()} bytes
Functions:    ${info.functions.length} detected (from bytecode selectors)
`);

  if (info.functions.length) {
    console.log("Detected functions:");
    for (const fn of info.functions) {
      console.log(`  ${fn.selector}  ${fn.signature}`);
    }
  } else {
    console.log("No known function selectors resolved (may be a proxy or minimal contract).");
  }

  console.log(`\nExplorer: https://${network === "sepolia" ? "sepolia." : ""}mantlescan.xyz/address/${address}`);
  console.log(`Note: bytecode/selectors are on-chain truth (keyless). Verified source/ABI needs a Mantlescan key.\n`);
  return 0;
}

if (require.main === module) {
  main(process.argv.slice(2)).then(process.exit).catch((e) => { console.error(e.message); process.exit(1); });
}
module.exports = { main };
