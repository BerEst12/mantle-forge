"use strict";

const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const test = require("node:test");
const { scaffoldProject } = require("../lib/scaffold");

test("scaffoldProject copies hardhat-mantle-starter", () => {
  const repoRoot = path.resolve(__dirname, "..", "..", "..");
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mantle-scaffold-"));
  const outputDir = path.join(tmpRoot, "demo");

  const result = scaffoldProject("hardhat-mantle-starter", outputDir, { repoRoot });

  assert.equal(result.template, "hardhat-mantle-starter");
  assert.ok(fs.existsSync(path.join(outputDir, "hardhat.config.ts")));
  assert.ok(fs.existsSync(path.join(outputDir, "contracts", "Lock.sol")));
  assert.match(fs.readFileSync(path.join(outputDir, "README.md"), "utf8"), /Mantle Forge scaffold/);
});

test("scaffoldProject aliases token-vault to starter", () => {
  const repoRoot = path.resolve(__dirname, "..", "..", "..");
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mantle-scaffold-alias-"));
  const outputDir = path.join(tmpRoot, "vault");

  const result = scaffoldProject("token-vault", outputDir, { repoRoot });

  assert.equal(result.requestedTemplate, "token-vault");
  assert.equal(result.template, "token-vault");
  assert.equal(result.aliased, false);
  assert.ok(fs.existsSync(path.join(outputDir, "contracts", "TokenVault.sol")));
});
