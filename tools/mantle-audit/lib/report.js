"use strict";

const SEVERITY_ORDER = ["Critical", "High", "Medium", "Low", "Informational"];

function sortFindings(findings) {
  return [...findings].sort(
    (a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)
  );
}

function countBySeverity(findings) {
  const counts = Object.fromEntries(SEVERITY_ORDER.map((s) => [s, 0]));
  for (const f of findings) counts[f.severity] = (counts[f.severity] || 0) + 1;
  return counts;
}

function findingsBySource(findings, source) {
  return sortFindings(findings.filter((f) => f.source === source));
}

function renderFindingBlock(findings) {
  if (!findings.length) return ["_No findings._", ""];
  const lines = [];
  for (const f of findings) {
    lines.push(`### [${f.severity}] ${f.title}`);
    lines.push(`- **ID:** ${f.id}`);
    lines.push(`- **Category:** ${f.category}`);
    lines.push(`- **Location:** ${f.location}`);
    lines.push(`- **Confidence:** ${f.confidence}`);
    lines.push(`- **Agent verify:** ${f.agentVerify ? "required" : "optional"}`);
    lines.push(`- **Recommendation:** ${f.recommendation}`);
    lines.push("", "```solidity", f.evidence || "_no snippet_", "```", "");
  }
  return lines;
}

function renderMarkdown({ projectDir, inventory, findings, slither, mythril, foundry, hardhat, agentTasks }) {
  const counts = countBySeverity(findings);
  const scope = inventory.map((c) => `\`${c.file}::${c.name}\``).join(", ");
  const lines = [
    "# Multi-Engine Security Review",
    "",
    "_Slither + Mythril + Foundry fuzz + Hardhat invariants + static triage + agent verification._",
    "_Not a substitute for a professional audit._",
    "",
    `**Project path:** \`${projectDir}\``,
    `**Scope:** ${scope || "_none_"}`,
    "",
    "## Executive summary",
    "",
    "| Engine | Result |",
    "|---|---|",
    `| Slither | ${slither?.available ? `${slither.findings.length} detector hits` : "not run"} |`,
    `| Mythril | ${mythril?.available ? `${mythril.findings.length} symbolic issues` : "not run"} |`,
    `| Foundry fuzz/invariants | ${foundry?.ok ? `${foundry.testsPassed} tests passed` : "not run"} |`,
    `| Hardhat invariants | ${hardhat?.ok ? `${hardhat.passing} tests passed` : "not run"} |`,
    `| Static triage (mantle-audit) | ${findingsBySource(findings, "static").length} heuristic signals |`,
    "",
    "## Finding counts (all sources)",
    "",
    `- **Critical:** ${counts.Critical || 0}`,
    `- **High:** ${counts.High || 0}`,
    `- **Medium:** ${counts.Medium || 0}`,
    `- **Low:** ${counts.Low || 0}`,
    `- **Informational:** ${counts.Informational || 0}`,
    "",
    "## Contract inventory",
    "",
  ];

  for (const c of inventory) {
    lines.push(`### ${c.name} (\`${c.file}\`)`);
    if (c.inheritance.length) lines.push(`- **Inherits:** ${c.inheritance.join(", ")}`);
    lines.push("| Function | Visibility | Modifiers | External calls | State writes |");
    lines.push("|---|---|---|---:|---:|");
    for (const fn of c.functions) {
      lines.push(
        `| ${fn.name} | ${fn.visibility}/${fn.mutability} | ${fn.modifiers.join(", ") || "-"} | ${fn.externalCalls} | ${fn.stateWrites} |`
      );
    }
    lines.push("");
  }

  lines.push("## Slither findings", "");
  lines.push(...renderFindingBlock(findingsBySource(findings, "slither")));

  lines.push("## Mythril findings", "");
  lines.push(...renderFindingBlock(findingsBySource(findings, "mythril")));

  lines.push("## Static triage (mantle-audit heuristics)", "");
  lines.push(
    "_Lightweight pre-filter for the agent — not a replacement for Slither/Mythril/Foundry._",
    ""
  );
  lines.push(...renderFindingBlock(findingsBySource(findings, "static")));

  lines.push("## Agent verification tasks", "");
  for (const task of agentTasks) lines.push(`- [ ] ${task}`);
  lines.push("");

  if (slither?.note) lines.push("## Slither notes", "", `- ${slither.note}`, "");
  if (mythril?.note) lines.push("## Mythril notes", "", `- ${mythril.note}`, "");

  lines.push(
    "## Next steps",
    "",
    "1. Triage every Slither/Mythril/static finding — confirm, fix, or mark false positive.",
    "2. Add agent-sourced findings (business logic, economics, admin trust).",
    "3. Rerun `npx mantle-harden <project>` after High/Critical fixes.",
    ""
  );

  return lines.join("\n");
}

function renderJson(payload) {
  return JSON.stringify(payload, null, 2);
}

module.exports = { renderMarkdown, renderJson, sortFindings, countBySeverity };
