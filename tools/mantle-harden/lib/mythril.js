"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

function listAnalysisContracts(projectDir) {
  const contractsDir = path.join(projectDir, "contracts");
  if (!fs.existsSync(contractsDir)) return [];

  return fs
    .readdirSync(contractsDir)
    .filter((name) => name.endsWith(".sol") && !/^Mock|^Demo/i.test(name))
    .map((name) => path.join(contractsDir, name));
}

function mapMythrilSeverity(severity) {
  const map = { High: "High", Medium: "Medium", Low: "Low", Informational: "Informational" };
  return map[severity] || "Medium";
}

function mapMythrilIssues(issues) {
  return (issues || []).map((issue) => ({
    source: "mythril",
    id: issue.swc_id || issue.swc-id || "mythril",
    severity: mapMythrilSeverity(issue.severity),
    category: "Symbolic execution",
    title: issue.title || issue.description?.slice(0, 80) || "Mythril issue",
    location: issue.filename ? `${path.basename(issue.filename)}:${issue.lineno || "?"}` : "unknown",
    evidence: issue.description || issue.title || "",
    recommendation: "Review Mythril path; confirm exploitability with PoC or mark false positive.",
    status: "Open",
    agentVerify: true,
    confidence: "medium",
  }));
}

function runMythril(projectDir, solcVersion, options = {}) {
  const root = path.resolve(projectDir);
  const required = Boolean(options.required);
  const targets = listAnalysisContracts(root);

  if (!targets.length) {
    if (required) throw new Error("No primary contracts found for Mythril analysis.");
    return { available: false, findings: [], note: "No analysis targets." };
  }

  const mythCmd = spawnSync(process.platform === "win32" ? "where" : "which", ["myth"], { encoding: "utf8" });
  if (mythCmd.status !== 0) {
    const note = "Mythril not installed. Run: python -m pip install mythril (via mantle-harden --setup).";
    if (required) throw new Error(note);
    return { available: false, findings: [], note };
  }

  const findings = [];
  const notes = [];

  for (const target of targets.slice(0, 3)) {
    const rel = path.relative(root, target);
    const args = ["analyze", rel, "--solv", solcVersion || "0.8.24", "-o", "json", "--execution-timeout", "120"];
    const result = spawnSync("myth", args, {
      cwd: root,
      encoding: "utf8",
      shell: process.platform === "win32",
      timeout: 300000,
      maxBuffer: 10 * 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"],
    });

    const raw = result.stdout || result.stderr || "";
    try {
      const parsed = JSON.parse(raw);
      findings.push(...mapMythrilIssues(parsed.issues));
    } catch {
      if (result.status !== 0 && required) {
        notes.push(`${rel}: ${(result.stderr || raw).split("\n")[0]}`);
      }
    }
  }

  if (notes.length && required && !findings.length) {
    throw new Error(`Mythril failed: ${notes.join("; ")}`);
  }

  return {
    available: true,
    findings,
    note: notes.length ? notes.join("; ") : null,
    targets: targets.map((t) => path.relative(root, t)),
  };
}

module.exports = { runMythril, listAnalysisContracts, mapMythrilIssues };
