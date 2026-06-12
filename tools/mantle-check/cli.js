#!/usr/bin/env node
"use strict";

const { parseArgs, fail, printJson } = require("@mantle-forge/cli-utils");
const { checkMantleProject } = require("./lib/check");

function printHelp() {
  console.log(`Usage: mantle-check <project-dir> [--json]

Validates Mantle Sepolia Hardhat readiness:
  - hardhat config with mantleSepolia + chainId 5003
  - contracts/, test/, package.json
  - .env.example documents MANTLE_SEPOLIA_RPC_URL

Example:
  mantle-check ./my-vault
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

  const result = checkMantleProject(projectDir);
  if (flags.json) {
    printJson(result);
  } else {
    console.log(`Checking ${result.projectDir}`);
    for (const err of result.errors) console.error(`ERROR: ${err}`);
    for (const warn of result.warnings) console.warn(`WARN: ${warn}`);
    if (result.ok) {
      console.log("OK: project is Mantle-ready");
    } else {
      console.error("FAIL: project is not Mantle-ready");
    }
  }

  return result.ok ? 0 : 1;
}

if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}

module.exports = { main };
