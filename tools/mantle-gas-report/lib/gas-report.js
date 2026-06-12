"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

function extractGasSection(output) {
  const lines = output.split("\n");
  const tableLines = [];
  let inTable = false;

  for (const line of lines) {
    if (/^\s*\|/.test(line) || /Method\s+\|/.test(line) || /Contract\s+\|/.test(line) || /---/.test(line)) {
      inTable = true;
      tableLines.push(line);
      continue;
    }
    if (inTable && line.trim() === "") {
      tableLines.push(line);
      continue;
    }
    if (inTable && !/^\s*\|/.test(line) && line.trim() !== "") {
      inTable = false;
    }
  }

  return tableLines.join("\n").trim();
}

function runGasReport(projectDir) {
  const root = path.resolve(projectDir);
  if (!fs.existsSync(root)) {
    throw new Error(`Project directory not found: ${root}`);
  }

  const hardhatConfig = ["hardhat.config.ts", "hardhat.config.js"]
    .map((name) => path.join(root, name))
    .find((p) => fs.existsSync(p));
  if (!hardhatConfig) {
    throw new Error("Missing hardhat.config.ts or hardhat.config.js");
  }

  const result = spawnSync("npx", ["hardhat", "test"], {
    cwd: root,
    env: { ...process.env, REPORT_GAS: "true" },
    encoding: "utf8",
    shell: process.platform === "win32",
    timeout: 180000,
    maxBuffer: 10 * 1024 * 1024,
  });

  const combined = [result.stdout, result.stderr].filter(Boolean).join("\n");
  if (result.status !== 0) {
    throw new Error(`hardhat test failed (exit ${result.status}):\n${combined.slice(-2000)}`);
  }

  const gasTable = extractGasSection(combined);
  const markdown = [
    "# Gas Analysis",
    "",
    "Agent-assisted gas report — not a formal audit.",
    "",
    "## Measurement method",
    "",
    "```bash",
    "REPORT_GAS=true npx hardhat test",
    "```",
    "",
    "## Key results",
    "",
    gasTable || "_Gas reporter output not detected. Ensure hardhat-gas-reporter is configured._",
    "",
    "## Raw output excerpt",
    "",
    "```text",
    combined.slice(-4000),
    "```",
    "",
  ].join("\n");

  return { markdown, rawOutput: combined, projectDir: root };
}

function writeGasReport(projectDir, outPath) {
  const { markdown, rawOutput } = runGasReport(projectDir);
  const target = path.resolve(outPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, markdown, "utf8");
  return { outPath: target, rawOutput };
}

module.exports = { runGasReport, writeGasReport, extractGasSection };
