#!/usr/bin/env node
"use strict";

const { spawnSync } = require("child_process");
const path = require("path");

const VENDORS = ["cursor", "hermes", "codex", "claude", "openclaw", "all"];

function printHelp() {
  console.log(`Mantle Forge CLI

Usage:
  mantle-forge init [--dev]              Legacy installer (skills copy + npm)
  mantle-forge install --<vendor>        Install one plugin (one vendor)
  mantle-forge help                      Show this message

Vendors: cursor, hermes, codex, claude, openclaw

One-line per plugin (from repo root, after npm install):
  npm run plugin:cursor
  npm run plugin:hermes
  npm run plugin:codex
  npm run plugin:claude
  npm run plugin:openclaw

First-time clone + one plugin:
  npm install && npm run plugin:hermes

Verify:
  npm run plugin:verify

Docs: docs/plugins/
`);
}

function runInit(devMode) {
  const installSh = path.join(__dirname, "install.sh");
  const args = devMode ? ["--dev"] : [];
  const result = spawnSync("bash", [installSh, ...args], {
    cwd: path.join(__dirname, ".."),
    stdio: "inherit",
    shell: false,
  });
  process.exit(result.status ?? 1);
}

function runInstall(vendorFlags) {
  const script = path.join(__dirname, "install-plugin.js");
  const args = ["--repo", path.join(__dirname, "..")];
  for (const v of VENDORS) {
    if (vendorFlags.includes(v)) args.unshift(`--${v}`);
  }
  if (vendorFlags.includes("hermes") && process.platform === "win32") {
    args.push("--wsl");
  }
  const result = spawnSync("node", [script, ...args], {
    cwd: path.join(__dirname, ".."),
    stdio: "inherit",
  });
  process.exit(result.status ?? 1);
}

function main() {
  const [command, ...rest] = process.argv.slice(2);
  const devMode = rest.includes("--dev");
  const vendorFlags = VENDORS.filter((v) => rest.includes(`--${v}`));

  switch (command) {
    case "init":
      runInit(devMode);
      break;
    case "install":
      if (vendorFlags.length === 0 || vendorFlags.includes("all")) {
        console.error("Pick one vendor: --cursor, --hermes, --codex, --claude, or --openclaw");
        console.error("Or use: npm run plugin:<vendor>");
        printHelp();
        process.exit(1);
      }
      runInstall(vendorFlags.filter((v) => v !== "all"));
      break;
    case "help":
    case "--help":
    case "-h":
    case undefined:
      printHelp();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
  }
}

main();
