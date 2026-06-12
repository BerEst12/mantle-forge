#!/usr/bin/env node
"use strict";

const { parseArgs, fail, printJson } = require("@mantle-forge/cli-utils");
const { deployProject, DEFAULT_NETWORK } = require("./lib/deploy");
const { verifyDeployment } = require("./lib/verify");

function printHelp() {
  console.log(`Usage: mantle-deploy <project-dir> [options]

Options:
  --network <name>       Hardhat network (default: mantleSepolia)
  --skip-tests           Skip hardhat test before deploy
  --dry-run              Compile + checks only; no deploy
  --skip-verify          Deploy without Mantlescan verification
  --verify-only          Verify existing deployments/mantleSepolia.json
  --verify-delay-ms <n>  Wait before verify (default: 15000 after deploy)
  --strict-verify        Fail if verification fails after deploy
  --json                 Print JSON result

Environment (project .env or shell):
  MANTLE_SEPOLIA_RPC_URL   Required for deploy
  MANTLE_PRIVATE_KEY       Required for deploy (Sepolia test wallet)
  MANTLE_EXPLORER_API_KEY  Required for Hardhat verify on Mantlescan

Examples:
  mantle-deploy ./my-vault --network mantleSepolia
  mantle-deploy ./my-vault --verify-only
  mantle-deploy ./my-vault --dry-run
`);
}

async function main(argv) {
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

  const network = flags.network || flags.n || DEFAULT_NETWORK;
  const verifyOnly = Boolean(flags["verify-only"] || flags.verifyOnly);

  if (verifyOnly) {
    try {
      const delay = Number(flags["verify-delay-ms"] || flags.verifyDelayMs || 0);
      const result = await verifyDeployment(projectDir, {
        network,
        verifyDelayMs: delay,
        skipIfVerified: true,
      });
      if (flags.json) {
        printJson(result);
      } else {
        console.log(`Verification on ${result.network}`);
        for (const [name, info] of Object.entries(result.verification.contracts)) {
          console.log(`- ${name}: ${info.status} (${info.address})`);
          if (info.explorerUrl) console.log(`  ${info.explorerUrl}`);
          if (info.error) console.log(`  error: ${info.error.split("\n")[0]}`);
        }
        if (result.warnings.length) {
          console.log("\nWarnings:");
          for (const w of result.warnings) console.log(`- ${w}`);
        }
      }
      return result.ok ? 0 : fail("One or more contracts failed verification");
    } catch (err) {
      return fail(err.message);
    }
  }

  const options = {
    network,
    skipTests: Boolean(flags["skip-tests"] || flags.skipTests),
    dryRun: Boolean(flags["dry-run"] || flags.dryRun),
    skipVerify: Boolean(flags["skip-verify"] || flags.skipVerify),
    strictVerify: Boolean(flags["strict-verify"] || flags.strictVerify),
    verifyDelayMs: Number(flags["verify-delay-ms"] || flags.verifyDelayMs || 15000),
  };

  try {
    const result = await deployProject(projectDir, options);
    if (flags.json) {
      printJson(result);
    } else if (result.dryRun) {
      console.log(`OK: ${result.message}`);
      console.log(`Deploy script: ${result.deployScript}`);
    } else {
      console.log(`Deployed on ${result.network}`);
      console.log(`Artifact: ${result.projectDir}/deployments/mantleSepolia.json`);
      if (result.artifact.contracts) {
        for (const [name, info] of Object.entries(result.artifact.contracts)) {
          console.log(`- ${name}: ${info.address}`);
          if (info.txHash) console.log(`  tx: ${info.txHash}`);
        }
      }
      if (result.verification) {
        console.log("\nMantlescan verification:");
        for (const [name, info] of Object.entries(result.verification.contracts)) {
          console.log(`- ${name}: ${info.status}`);
          if (info.explorerUrl) console.log(`  ${info.explorerUrl}`);
        }
      }
      if (result.verifyWarnings?.length) {
        console.log("\nVerify warnings:");
        for (const w of result.verifyWarnings) console.log(`- ${w}`);
      }
    }
    return 0;
  } catch (err) {
    return fail(err.message);
  }
}

if (require.main === module) {
  main(process.argv.slice(2)).then((code) => process.exit(code));
}

module.exports = { main };
