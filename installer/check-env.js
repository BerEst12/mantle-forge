#!/usr/bin/env node
"use strict";

const { execSync } = require("child_process");
const { resolveHermesHome, hermesSkillsDir } = require("./hermes-home");
const fs = require("fs");

function parseVersion(raw) {
  const match = String(raw || "").match(/(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]) };
}

function checkNode() {
  const version = parseVersion(process.version);
  if (!version || version.major < 20) {
    throw new Error(`Node.js 20+ required (found ${process.version})`);
  }
  console.log(`OK: Node ${process.version}`);
}

function checkGit() {
  try {
    const out = execSync("git --version", { encoding: "utf8" }).trim();
    console.log(`OK: ${out}`);
  } catch {
    throw new Error("Git is not installed or not on PATH");
  }
}

function checkHermesOptional() {
  try {
    const out = execSync("hermes --version", { encoding: "utf8" }).trim();
    console.log(`OK: Hermes detected (${out})`);
  } catch {
    console.warn("WARN: Hermes CLI not found — install via hermes/README.md before TUI demo");
  }
}

function checkHermesHome() {
  const home = resolveHermesHome();
  console.log(`OK: Hermes home ${home}`);
  const skills = hermesSkillsDir();
  if (fs.existsSync(skills)) {
    const mantle = fs
      .readdirSync(skills, { withFileTypes: true })
      .filter((e) => e.isDirectory() && e.name.startsWith("mantle-"));
    console.log(`OK: ${mantle.length} mantle-* skill dirs under ${skills}`);
  }
}

function main() {
  checkNode();
  checkGit();
  checkHermesOptional();
  checkHermesHome();
}

main();
