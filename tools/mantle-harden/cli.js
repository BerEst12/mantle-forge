#!/usr/bin/env node
"use strict";

const path = require("path");
const { parseArgs, fail } = require("@mantle-forge/cli-utils");
const { runHarden } = require("./lib/harden");
const { ensurePrerequisites, formatSetupReport } = require("./lib/prerequisites");

function printHelp() {
  console.log(`Usage: mantle-harden <project-dir> [options]
       mantle-harden --setup <project-dir>

Full audit-assistant gate: Slither + Mythril + Foundry fuzz + Hardhat invariants + static triage.

Options:
  --setup                Check/install Python tools + Foundry + solc only
  --no-install           Check prerequisites but do not auto-install
  --out, -o <path>       Security markdown (default: reports/security.md)
  --json <path>          Findings JSON (default: reports/security.json)
  --brief <path>         Agent brief (default: reports/audit-brief.md)
  --harden-json <path>   Gate summary (default: reports/harden.json)
  --grep <pattern>       Hardhat invariant grep (default: invariant|fuzz)
  --skip-slither         Dev only: skip Slither/Mythril/Foundry (not for demo)
  --help, -h             Show help

Example:
  mantle-harden --setup ./my-vault
  mantle-harden ./my-vault
`);
}

function runSetup(projectDir, install) {
  const result = ensurePrerequisites(projectDir, { install });
  console.log(formatSetupReport(result));
  console.log("\nToolchain ready for full gate.");
  return 0;
}

function main(argv) {
  const { positional, flags } = parseArgs(argv);
  if (flags.help || flags.h) {
    printHelp();
    return 0;
  }

  const setupOnly = Boolean(flags.setup);
  const [projectDir] = positional;
  if (!projectDir) {
    printHelp();
    return fail("Missing required argument: <project-dir>");
  }

  const install = !flags["no-install"];
  if (setupOnly) {
    try {
      return runSetup(projectDir, install);
    } catch (err) {
      return fail(err.message);
    }
  }

  const resolved = path.resolve(projectDir);
  const reportsDir = path.join(resolved, "reports");
  const skipFull = Boolean(flags["skip-slither"]);

  try {
    const result = runHarden(projectDir, {
      outPath: flags.out || flags.o || path.join(reportsDir, "security.md"),
      jsonPath: flags.json || path.join(reportsDir, "security.json"),
      briefPath: flags.brief || path.join(reportsDir, "audit-brief.md"),
      hardenPath: flags["harden-json"] || path.join(reportsDir, "harden.json"),
      grep: flags.grep,
      requireSlither: !skipFull,
      fullGate: !skipFull,
      install,
    });

    console.log(`Hardening gate passed: ${result.hardenPath}`);
    console.log(`Security report: ${result.outPath}`);
    if (result.payload.summary) {
      const s = result.payload.summary;
      console.log(
        `Engines: slither=${s.slitherFindings} mythril=${s.mythrilFindings} static=${s.staticFindings} foundry=${s.foundryTestsPassed} hardhat=${s.hardhatInvariantTests}`
      );
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
