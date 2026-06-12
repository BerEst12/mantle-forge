#!/usr/bin/env node
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const envPath = path.join(os.homedir(), ".mantle-forge.env");
if (!fs.existsSync(envPath)) {
  console.log("[mantle-forge] Tip: run npm run plugin:cursor (or your runtime) to set MANTLE_FORGE_ROOT");
  process.exit(0);
}

const content = fs.readFileSync(envPath, "utf8");
const match = content.match(/^MANTLE_FORGE_ROOT=(.+)$/m);
if (!match) {
  console.log("[mantle-forge] MANTLE_FORGE_ROOT not set in ~/.mantle-forge.env");
  process.exit(0);
}

const root = match[1].trim();
if (!fs.existsSync(root)) {
  console.log(`[mantle-forge] MANTLE_FORGE_ROOT points to missing path: ${root}`);
  process.exit(0);
}

console.log(`[mantle-forge] Ready — root: ${root}`);
