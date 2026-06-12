#!/usr/bin/env node
"use strict";

const { parseArgs, fail } = require("@mantle-forge/cli-utils");
const { scaffoldProject } = require("./lib/scaffold");

function printHelp() {
  console.log(`Usage: mantle-scaffold <template> <output-dir>

Templates:
  hardhat-mantle-starter   Minimal Mantle Sepolia Hardhat starter
  token-vault              Flagship demo template (token vault)

Example:
  mantle-scaffold hardhat-mantle-starter ./my-vault
`);
}

function main(argv) {
  const { positional, flags } = parseArgs(argv);
  if (flags.help || flags.h) {
    printHelp();
    return 0;
  }

  const [template, outputDir] = positional;
  if (!template || !outputDir) {
    printHelp();
    return fail("Missing required arguments: <template> <output-dir>");
  }

  try {
    const result = scaffoldProject(template, outputDir);
    console.log(`Scaffolded ${result.requestedTemplate} -> ${result.outputDir}`);
    if (result.aliased) {
      console.log(`Note: "${result.requestedTemplate}" uses template "${result.template}" for now.`);
    }
    console.log("Next: cd into the project, run npm install, then npx hardhat compile");
    return 0;
  } catch (err) {
    return fail(err.message);
  }
}

if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}

module.exports = { main };
