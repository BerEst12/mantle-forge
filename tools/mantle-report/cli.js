#!/usr/bin/env node
"use strict";

const path = require("path");
const { parseArgs, fail } = require("@mantle-forge/cli-utils");
const { writeReport } = require("./lib/report");

function printHelp() {
  console.log(`Usage: mantle-report <project-dir> [--out FINAL_REPORT.md]

Merges project artifacts into a markdown engineering report:
  - reports/security.md
  - reports/gas.md
  - deployments/mantleSepolia.json
  - contracts/*.sol inventory

Example:
  mantle-report ./my-vault --out FINAL_REPORT.md
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

  const outFlag = flags.out || flags.o;
  const outPath = outFlag
    ? path.resolve(String(outFlag))
    : path.join(path.resolve(projectDir), "FINAL_REPORT.md");

  try {
    const result = writeReport(projectDir, outPath);
    console.log(`Report written: ${result.outPath}`);
    if (result.missing.length) {
      console.warn(`Note: missing optional artifacts: ${result.missing.join(", ")}`);
    }
    return 0;
  } catch (err) {
    return fail(err.message);
  }
}

if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}

module.exports = { main };
