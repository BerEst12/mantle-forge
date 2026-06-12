"use strict";

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function runSlither(projectDir, options = {}) {
  const root = path.resolve(projectDir);
  const required = Boolean(options.required);

  if (!commandExists("slither")) {
    const note = "Slither not installed. Install: pip install slither-analyzer (see knowledge/slither-setup.md).";
    if (required) throw new Error(note);
    return { available: false, findings: [], note };
  }

  try {
    const raw = execFileSync(
      "slither",
      [root, "--json", "-", "--disable-color", "--filter-paths", "node_modules|lib|test"],
      { encoding: "utf8", maxBuffer: 10 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] }
    );
    return { available: true, findings: mapSlitherJson(raw), note: null };
  } catch (err) {
    const stdout = err.stdout || "";
    if (stdout.includes('"results"')) {
      return { available: true, findings: mapSlitherJson(stdout), note: "Slither exited non-zero; results parsed." };
    }
    const note = `Slither failed: ${(err.stderr || err.message).split("\n")[0]}`;
    if (required) throw new Error(note);
    return { available: true, findings: [], note };
  }
}

function commandExists(cmd) {
  try {
    execFileSync(process.platform === "win32" ? "where" : "which", [cmd], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function mapSlitherJson(raw) {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  const detectors = parsed.results?.detectors || [];
  return detectors.map((d) => ({
    source: "slither",
    id: d.check || "slither",
    severity: mapImpact(d.impact),
    category: d.confidence || "Slither",
    title: d.description?.split("\n")[0] || d.check,
    location: formatSlitherElements(d.elements),
    evidence: d.description || "",
    recommendation: "Review Slither detector output and confirm exploitability in project context.",
    status: "Open",
    agentVerify: true,
    confidence: String(d.confidence || "medium").toLowerCase(),
  }));
}

function mapImpact(impact) {
  const map = { High: "High", Medium: "Medium", Low: "Low", Informational: "Informational", Optimization: "Informational" };
  return map[impact] || "Medium";
}

function formatSlitherElements(elements) {
  if (!elements?.length) return "unknown";
  return elements
    .map((el) => {
      const src = el.source_mapping || {};
      const file = src.filename_relative || src.filename_absolute || "?";
      return `${file}:${src.lines?.[0] || "?"}`;
    })
    .join(", ");
}

module.exports = { runSlither };
