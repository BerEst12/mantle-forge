"use strict";

const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const test = require("node:test");
const { hasInvariantSuite, runHarden, runInvariantTests } = require("../lib/harden");
const { hasFoundrySuite } = require("../lib/foundry");
const { checkPrerequisites, formatSetupReport } = require("../lib/prerequisites");

const templateDir = path.resolve(__dirname, "..", "..", "..", "templates", "token-vault");

test("token-vault template has Hardhat and Foundry suites", () => {
  assert.equal(hasInvariantSuite(templateDir), true);
  assert.equal(hasFoundrySuite(templateDir), true);
});

test("runInvariantTests passes on token-vault template", () => {
  const result = runInvariantTests(templateDir);
  assert.equal(result.ok, true);
});

test("checkPrerequisites detects solc version from token-vault", () => {
  const status = checkPrerequisites(templateDir);
  assert.equal(status.solcVersion, "0.8.24");
});

test("formatSetupReport lists full toolchain", () => {
  const report = formatSetupReport({
    python: "python",
    slither: true,
    mythril: true,
    forge: true,
    solc: true,
    solcVersion: "0.8.24",
    ok: true,
    actions: ["installed slither-analyzer + mythril"],
    missing: [],
  });
  assert.match(report, /Mythril.*ok/);
  assert.match(report, /Foundry.*ok/);
});

test("runHarden fails when invariant suite missing", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mantle-harden-no-inv-"));
  fs.mkdirSync(path.join(dir, "contracts"), { recursive: true });
  fs.mkdirSync(path.join(dir, "test"), { recursive: true });
  fs.writeFileSync(path.join(dir, "contracts", "A.sol"), "pragma solidity ^0.8.24; contract A {}", "utf8");
  fs.writeFileSync(path.join(dir, "test", "a.ts"), "it('x', () => {});", "utf8");
  fs.writeFileSync(path.join(dir, "hardhat.config.js"), "module.exports = {};", "utf8");

  assert.throws(() => runHarden(dir, { fullGate: false, requireSlither: false }), /Hardhat invariant\/fuzz suite/);
});

test("runHarden partial gate on token-vault (no Slither/Mythril/Foundry)", () => {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "mantle-harden-out-"));
  const result = runHarden(templateDir, {
    fullGate: false,
    requireSlither: false,
    outPath: path.join(outDir, "security.md"),
    jsonPath: path.join(outDir, "security.json"),
    briefPath: path.join(outDir, "audit-brief.md"),
    hardenPath: path.join(outDir, "harden.json"),
  });
  assert.ok(fs.existsSync(result.hardenPath));
  assert.equal(result.payload.steps.find((s) => s.name === "hardhat-invariants").ok, true);
  assert.equal(result.payload.fullGate, false);
});
