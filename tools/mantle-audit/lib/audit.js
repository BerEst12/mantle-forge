"use strict";

const fs = require("fs");
const path = require("path");
const { listSolidityFiles, readProjectSources } = require("./solidity");
const { buildInventory } = require("./analyzers/inventory");
const { analyzeSources } = require("./analyzers/static");
const { runSlither } = require("./analyzers/slither");
const { renderMarkdown, renderJson, sortFindings } = require("./report");
const { buildAgentTasks, renderAgentBrief } = require("./agent-brief");

function runAudit(projectDir, options = {}) {
  const root = path.resolve(projectDir);
  if (!fs.existsSync(root)) throw new Error(`Project directory not found: ${root}`);

  const files = listSolidityFiles(root);
  if (!files.length) throw new Error("No Solidity files found under contracts/");

  const sources = readProjectSources(root);
  const inventory = buildInventory(sources);
  const staticFindings = analyzeSources(sources);
  const slither = options.withSlither || options.requireSlither
    ? runSlither(root, { required: Boolean(options.requireSlither) })
    : { available: false, findings: [], note: null };
  const extraFindings = options.extraFindings || [];
  const findings = sortFindings([...staticFindings, ...slither.findings, ...extraFindings]);
  const agentTasks = buildAgentTasks({ inventory, findings });
  const engines = options.engines || {};

  const payload = {
    version: 2,
    projectDir: root,
    scope: files.map((f) => path.relative(root, f)),
    inventory,
    findings,
    engines: {
      slither: { available: slither.available, count: slither.findings.length, note: slither.note },
      mythril: engines.mythril || null,
      foundry: engines.foundry || null,
      hardhat: engines.hardhat || null,
    },
    agentTasks,
  };

  const markdown = renderMarkdown({
    projectDir: root,
    inventory,
    findings,
    slither,
    mythril: engines.mythril,
    foundry: engines.foundry,
    hardhat: engines.hardhat,
    agentTasks,
  });

  return { markdown, findings, inventory, agentTasks, payload, projectDir: root };
}

function writeAuditOutputs(projectDir, options = {}) {
  const result = runAudit(projectDir, options);
  const outPath = path.resolve(options.outPath || path.join(result.projectDir, "reports", "security.md"));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, result.markdown, "utf8");

  const written = { outPath };

  if (options.jsonPath) {
    const jsonPath = path.resolve(options.jsonPath);
    fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
    fs.writeFileSync(jsonPath, renderJson(result.payload), "utf8");
    written.jsonPath = jsonPath;
  }

  if (options.briefPath) {
    const briefPath = path.resolve(options.briefPath);
    fs.mkdirSync(path.dirname(briefPath), { recursive: true });
    fs.writeFileSync(
      briefPath,
      renderAgentBrief({
        projectDir: result.projectDir,
        inventory: result.inventory,
        findings: result.findings,
        agentTasks: result.agentTasks,
      }),
      "utf8"
    );
    written.briefPath = briefPath;
  }

  return { ...result, ...written };
}

module.exports = { runAudit, writeAuditOutputs, listSolidityFiles };
