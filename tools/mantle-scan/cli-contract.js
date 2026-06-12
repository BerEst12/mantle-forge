#!/usr/bin/env node
"use strict";

const { parseArgs, fail, printJson } = require("@mantle-forge/cli-utils");
const { getContractAbi, getContractSource } = require("./lib/scan");

function printHelp() {
  console.log(`Usage: mantle-scan-contract <address> [--network mainnet|sepolia] [--abi] [--json]

Fetch verified contract info from Mantle Scan.

Options:
  --network   mainnet (default) or sepolia
  --abi       Show full ABI instead of summary
  --json      Output raw JSON

Example:
  mantle-scan-contract 0xabc123...
  mantle-scan-contract 0xabc123... --abi
`);
}

async function main(argv) {
  const { positional, flags } = parseArgs(argv);
  if (flags.help || flags.h) { printHelp(); return 0; }

  const [address] = positional;
  if (!address) return fail("Missing required argument: <address>");

  const network = flags.network || "mainnet";

  let source, abi;
  try {
    source = await getContractSource(address, network);
  } catch (e) {
    return fail(`Could not fetch contract: ${e.message}`);
  }

  const isVerified = source.ABI && source.ABI !== "Contract source code not verified";

  if (flags.json) {
    printJson({ address, network, verified: isVerified, source });
    return 0;
  }

  console.log(`
Contract:    ${address}
Network:     Mantle ${network}
Name:        ${source.ContractName || "Unknown"}
Verified:    ${isVerified ? "✅ Yes" : "❌ Not verified"}
Compiler:    ${source.CompilerVersion || "N/A"}
License:     ${source.LicenseType || "N/A"}
Proxy:       ${source.Proxy === "1" ? `Yes → impl ${source.Implementation}` : "No"}

Explorer: https://explorer${network === "sepolia" ? ".sepolia" : ""}.mantle.xyz/address/${address}
`);

  if (isVerified && flags.abi) {
    try {
      abi = await getContractAbi(address, network);
      const functions = abi.filter((x) => x.type === "function");
      const events = abi.filter((x) => x.type === "event");
      console.log(`ABI Summary: ${functions.length} functions, ${events.length} events\n`);
      console.log("Functions:");
      for (const fn of functions) {
        const inputs = (fn.inputs || []).map((i) => `${i.type} ${i.name}`).join(", ");
        const outputs = (fn.outputs || []).map((o) => o.type).join(", ");
        const mut = fn.stateMutability || fn.constant ? "view" : "nonpayable";
        console.log(`  ${fn.name}(${inputs}) → (${outputs})  [${mut}]`);
      }
      if (events.length) {
        console.log("\nEvents:");
        for (const ev of events) {
          const inputs = (ev.inputs || []).map((i) => `${i.type} ${i.name}`).join(", ");
          console.log(`  ${ev.name}(${inputs})`);
        }
      }
    } catch (e) {
      console.log(`ABI: ${e.message}`);
    }
  } else if (isVerified) {
    console.log("Tip: Use --abi to see function signatures");
  }

  return 0;
}

if (require.main === module) {
  main(process.argv.slice(2)).then(process.exit).catch((e) => { console.error(e.message); process.exit(1); });
}
module.exports = { main };
