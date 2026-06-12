"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

function commandExists(cmd) {
  try {
    const which = process.platform === "win32" ? "where" : "which";
    const result = spawnSync(which, [cmd], { stdio: "ignore" });
    return result.status === 0;
  } catch {
    return false;
  }
}

function hasFoundrySuite(projectDir) {
  const root = path.resolve(projectDir);
  return fs.existsSync(path.join(root, "foundry.toml")) || fs.existsSync(path.join(root, "forge-test"));
}

function ensureForgeStd(projectDir) {
  const root = path.resolve(projectDir);
  const forgeStd = path.join(root, "lib", "forge-std");
  if (fs.existsSync(forgeStd)) return { ok: true, installed: false };

  const result = spawnSync("forge", ["install", "foundry-rs/forge-std", "--no-commit"], {
    cwd: root,
    encoding: "utf8",
    shell: process.platform === "win32",
    timeout: 180000,
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.status !== 0) {
    throw new Error(`forge install forge-std failed: ${(result.stderr || result.stdout || "").trim()}`);
  }
  return { ok: true, installed: true };
}

function runFoundryFuzz(projectDir, options = {}) {
  const root = path.resolve(projectDir);
  if (!hasFoundrySuite(root)) {
    throw new Error(
      "No Foundry fuzz suite found. Add foundry.toml and forge-test/*.t.sol (see knowledge/hardening-toolchain.md)."
    );
  }
  if (!commandExists("forge")) {
    throw new Error("Foundry (forge) not installed. Run: npx mantle-harden --setup <project-dir>");
  }

  ensureForgeStd(root);

  const match = options.matchContract || "TokenVault";
  const cmd =
    process.platform === "win32"
      ? `forge test --match-contract ${match} -vv`
      : null;

  const result = cmd
    ? spawnSync(cmd, { cwd: root, encoding: "utf8", shell: true, timeout: 600000, maxBuffer: 10 * 1024 * 1024 })
    : spawnSync("forge", ["test", "--match-contract", match, "-vv"], {
        cwd: root,
        encoding: "utf8",
        timeout: 600000,
        maxBuffer: 10 * 1024 * 1024,
      });

  const combined = [result.stdout, result.stderr].filter(Boolean).join("\n");
  if (result.status !== 0) {
    throw new Error(`Foundry fuzz/invariant tests failed (exit ${result.status}):\n${combined.slice(-3000)}`);
  }

  const fuzzRuns = combined.match(/runs:\s*(\d+)/i)?.[1] || null;
  const testsMatch = combined.match(/(\d+)\s+passed/)?.[1] || "?";

  return {
    ok: true,
    engine: "foundry",
    testsPassed: testsMatch,
    fuzzRuns,
    output: combined.slice(-4000),
  };
}

module.exports = { hasFoundrySuite, ensureForgeStd, runFoundryFuzz, commandExists };
