#!/usr/bin/env node
"use strict";

const path = require("path");
const { parseArgs, fail } = require("@mantle-forge/cli-utils");
const { writeGasReport } = require("./lib/gas-report");

function printHelp() {
  console.log(`Usage: mantle-gas-report <project-dir> [--out reports/gas.md]

Runs REPORT_GAS=true npx hardhat test and writes a markdown gas report.

Example:
  mantle-gas-report ./my-vault --out reports/gas.md
`);
}

function main(argv) {
  const { positional, flags } = parseArgs(argv);
  if (flags.help || flags.h) {
    printHelp();
    return 0;
  }

  const [projectDir] = positional;
  if (!projectDir) {
    printHelp();
    return fail("Missing required argument: <project-dir>");
  }

  const outPath =
    flags.out || flags.o || path.join(path.resolve(projectDir), "reports", "gas.md");

  try {
    const result = writeGasReport(projectDir, outPath);
    console.log(`Gas report written: ${result.outPath}`);
    return 0;
  } catch (err) {
    return fail(err.message);
  }
}

if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}

module.exports = { main };
