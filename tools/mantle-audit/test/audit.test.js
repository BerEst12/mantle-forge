"use strict";

const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const test = require("node:test");
const { runAudit, writeAuditOutputs } = require("../lib/audit");
const { parseContracts } = require("../lib/solidity");

test("runAudit produces inventory and agent tasks for token-vault template", () => {
  const templateDir = path.resolve(__dirname, "..", "..", "..", "templates", "token-vault");
  const result = runAudit(templateDir);
  assert.match(result.markdown, /Multi-Engine Security Review/);
  assert.match(result.markdown, /Contract inventory/);
  assert.ok(result.inventory.some((c) => c.name === "TokenVault"));
  assert.ok(result.agentTasks.length >= 5);
  assert.equal(result.payload.version, 2);
});

test("runAudit flags missing reentrancy guard on low-level call", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mantle-audit-bad-"));
  fs.mkdirSync(path.join(dir, "contracts"), { recursive: true });
  fs.writeFileSync(
    path.join(dir, "contracts", "Bad.sol"),
    `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
contract Bad {
  mapping(address => uint256) public balances;
  function pay(address target) external {
    (bool ok,) = target.call("");
    ok;
    balances[msg.sender] = 1;
  }
}`,
    "utf8"
  );
  const result = runAudit(dir);
  assert.ok(result.findings.some((f) => f.id === "missing-reentrancy-guard"));
  assert.ok(result.findings.some((f) => f.id === "cei-violation"));
});

test("writeAuditOutputs writes markdown json and brief", () => {
  const templateDir = path.resolve(__dirname, "..", "..", "..", "templates", "token-vault");
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "mantle-audit-out-"));
  const result = writeAuditOutputs(templateDir, {
    outPath: path.join(outDir, "security.md"),
    jsonPath: path.join(outDir, "security.json"),
    briefPath: path.join(outDir, "audit-brief.md"),
  });
  assert.ok(fs.existsSync(result.outPath));
  assert.ok(fs.existsSync(result.jsonPath));
  assert.ok(fs.existsSync(result.briefPath));
  const json = JSON.parse(fs.readFileSync(result.jsonPath, "utf8"));
  assert.ok(Array.isArray(json.findings));
});

test("parseContracts extracts function visibility and line numbers", () => {
  const src = `contract Vault is ReentrancyGuard {
    function deposit(uint256 amount) external nonReentrant {
      balances[msg.sender] += amount;
    }
  }`;
  const contracts = parseContracts(src, "Vault.sol");
  assert.equal(contracts[0].functions[0].name, "deposit");
  assert.equal(contracts[0].functions[0].visibility, "external");
  assert.ok(contracts[0].functions[0].modifiers.includes("nonReentrant"));
});
