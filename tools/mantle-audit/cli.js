#!/usr/bin/env node
"use strict";

const path = require("path");
const { parseArgs, fail } = require("@mantle-forge/cli-utils");
const { writeAuditOutputs } = require("./lib/audit");

function printHelp() {
  console.log(`Usage: mantle-audit <project-dir> [options]

Static analysis + agent verification brief for Solidity contracts.

Options:
  --out, -o <path>       Markdown report (default: <project>/reports/security.md)
  --json <path>          Structured findings JSON for agent triage
  --brief <path>         Agent audit workflow brief
  --with-slither         Run Slither when installed (pip install slither-analyzer)
  --help, -h             Show help

Example:
  mantle-audit ./my-vault --out reports/security.md --json reports/security.json --brief reports/audit-brief.md
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

  const resolved = path.resolve(projectDir);
  const outPath = flags.out || flags.o || path.join(resolved, "reports", "security.md");

  try {
    const result = writeAuditOutputs(projectDir, {
      outPath,
      jsonPath: flags.json,
      briefPath: flags.brief,
      withSlither: Boolean(flags["with-slither"] || flags.slither),
    });
    console.log(`Security report written: ${result.outPath}`);
    if (result.jsonPath) console.log(`JSON findings written: ${result.jsonPath}`);
    if (result.briefPath) console.log(`Agent brief written: ${result.briefPath}`);
    console.log(
      `Findings: ${result.findings.length} (static +${result.payload.slither.count} slither)`
    );
    return 0;
  } catch (err) {
    return fail(err.message);
  }
}

if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}

module.exports = { main };
