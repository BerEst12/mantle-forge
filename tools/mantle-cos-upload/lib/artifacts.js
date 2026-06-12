"use strict";

const fs = require("fs");
const path = require("path");

const ARTIFACT_MANIFEST = [
  { rel: "FINAL_REPORT.md",              required: true,  contentType: "text/markdown" },
  { rel: "reports/security.md",          required: false, contentType: "text/markdown" },
  { rel: "reports/tencent-audit.md",     required: false, contentType: "text/markdown" },
  { rel: "reports/gas.md",               required: false, contentType: "text/markdown" },
  { rel: "reports/security.json",        required: false, contentType: "application/json" },
  { rel: "reports/tencent-audit.json",   required: false, contentType: "application/json" },
  { rel: "deployments/mantleSepolia.json", required: false, contentType: "application/json" },
];

function collectArtifacts(projectDir) {
  const root = path.resolve(projectDir);
  const found = [];
  const missing = [];

  for (const entry of ARTIFACT_MANIFEST) {
    const fullPath = path.join(root, entry.rel);
    if (fs.existsSync(fullPath)) {
      found.push({ ...entry, fullPath });
    } else if (entry.required) {
      throw new Error(`Required artifact not found: ${entry.rel} — run mantle-report first`);
    } else {
      missing.push(entry.rel);
    }
  }

  return { found, missing };
}

module.exports = { collectArtifacts };
