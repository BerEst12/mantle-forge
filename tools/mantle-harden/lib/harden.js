"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { runSlither } = require("@mantle-forge/mantle-audit/lib/analyzers/slither");
const { writeAuditOutputs } = require("@mantle-forge/mantle-audit/lib/audit");
const { ensurePrerequisites } = require("./prerequisites");
const { runMythril } = require("./mythril");
const { hasFoundrySuite, runFoundryFuzz } = require("./foundry");

const DEFAULT_GREP = "invariant|fuzz";
const HARDEN_VERSION = 2;

function hasInvariantSuite(projectDir) {
  const testDir = path.join(projectDir, "test");
  if (!fs.existsSync(testDir)) return false;

  return fs.readdirSync(testDir).some((name) => {
    if (!/\.(ts|js)$/.test(name)) return false;
    if (/invariant|fuzz/i.test(name)) return true;
    const src = fs.readFileSync(path.join(testDir, name), "utf8");
    return /describe\s*\(\s*["'`][^"'`]*(invariant|fuzz)/i.test(src);
  });
}

function runHardhatInvariants(projectDir, grep = DEFAULT_GREP) {
  const root = path.resolve(projectDir);
  if (!hasInvariantSuite(root)) {
    throw new Error(
      "No Hardhat invariant/fuzz suite under test/. Add test/*.invariants.ts with describe(\"... invariant ...\")."
    );
  }

  const spawnOpts = {
    cwd: root,
    encoding: "utf8",
    timeout: 300000,
    maxBuffer: 10 * 1024 * 1024,
  };

  const result =
    process.platform === "win32"
      ? spawnSync(`npx hardhat test --grep "${grep.replace(/"/g, '\\"')}"`, { ...spawnOpts, shell: true })
      : spawnSync("npx", ["hardhat", "test", "--grep", grep], spawnOpts);

  const combined = [result.stdout, result.stderr].filter(Boolean).join("\n");
  if (result.status !== 0) {
    throw new Error(`Hardhat invariant/fuzz tests failed (exit ${result.status}):\n${combined.slice(-2500)}`);
  }

  const passing = combined.match(/(\d+)\s+passing/)?.[1] || "?";
  return { ok: true, engine: "hardhat", grep, passing, output: combined.slice(-2000) };
}

function runHarden(projectDir, options = {}) {
  const root = path.resolve(projectDir);
  if (!fs.existsSync(root)) throw new Error(`Project directory not found: ${root}`);

  const fullGate = options.fullGate !== false && options.requireSlither !== false;
  const reportsDir = path.join(root, "reports");
  const outPath = options.outPath || path.join(reportsDir, "security.md");
  const jsonPath = options.jsonPath || path.join(reportsDir, "security.json");
  const briefPath = options.briefPath || path.join(reportsDir, "audit-brief.md");
  const hardenPath = options.hardenPath || path.join(reportsDir, "harden.json");
  const steps = [];

  let solcVersion = "0.8.24";
  let mythril = { available: false, findings: [], note: null, targets: [] };
  let foundry = { ok: false, engine: "foundry" };
  let slither = { available: false, findings: [], note: null };

  if (fullGate) {
    const setup = ensurePrerequisites(root, { install: options.install !== false });
    solcVersion = setup.solcVersion || solcVersion;
    steps.push({
      name: "setup",
      ok: true,
      actions: setup.actions,
      slither: setup.slither,
      mythril: setup.mythril,
      forge: setup.forge,
      solc: setup.solc,
      solcVersion,
    });

    slither = runSlither(root, { required: true });
    steps.push({
      name: "slither",
      ok: slither.available,
      findings: slither.findings.length,
      note: slither.note,
    });

    mythril = runMythril(root, solcVersion, { required: true });
    steps.push({
      name: "mythril",
      ok: mythril.available,
      findings: mythril.findings.length,
      targets: mythril.targets,
      note: mythril.note,
    });

    if (!hasFoundrySuite(root)) {
      throw new Error("Missing Foundry suite (foundry.toml + forge-test/). See knowledge/hardening-toolchain.md");
    }
    foundry = runFoundryFuzz(root, options.foundry || {});
    steps.push({
      name: "foundry-fuzz",
      ok: foundry.ok,
      testsPassed: foundry.testsPassed,
      fuzzRuns: foundry.fuzzRuns,
    });
  }

  const hardhat = runHardhatInvariants(root, options.grep || DEFAULT_GREP);
  steps.push({
    name: "hardhat-invariants",
    ok: hardhat.ok,
    passing: hardhat.passing,
    grep: hardhat.grep,
  });

  const audit = writeAuditOutputs(root, {
    outPath,
    jsonPath,
    briefPath,
    withSlither: fullGate,
    requireSlither: fullGate,
    extraFindings: mythril.findings,
    engines: {
      slither,
      mythril,
      foundry: fullGate ? foundry : null,
      hardhat,
    },
  });

  steps.push({
    name: "static-triage",
    ok: true,
    findings: audit.findings.length,
    outPath: audit.outPath,
  });

  const payload = {
    version: HARDEN_VERSION,
    projectDir: root,
    ok: steps.every((s) => s.ok),
    fullGate,
    steps,
    summary: {
      slitherFindings: slither.findings?.length || 0,
      mythrilFindings: mythril.findings?.length || 0,
      staticFindings: audit.findings.filter((f) => f.source === "static").length,
      foundryTestsPassed: foundry.testsPassed || null,
      hardhatInvariantTests: hardhat.passing,
    },
    completedAt: new Date().toISOString(),
  };

  fs.mkdirSync(path.dirname(hardenPath), { recursive: true });
  fs.writeFileSync(hardenPath, JSON.stringify(payload, null, 2), "utf8");

  return { ...audit, hardenPath, payload, slither, mythril, foundry, hardhat };
}

module.exports = {
  runHarden,
  runHardhatInvariants,
  runInvariantTests: runHardhatInvariants,
  hasInvariantSuite,
  DEFAULT_GREP,
  ensurePrerequisites,
};
