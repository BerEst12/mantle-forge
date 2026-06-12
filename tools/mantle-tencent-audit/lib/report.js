"use strict";

const SEVERITY_ORDER = ["Critical", "High", "Medium", "Low", "Informational"];

function countBySeverity(findings) {
  const counts = Object.fromEntries(SEVERITY_ORDER.map((s) => [s, 0]));
  for (const f of findings) counts[f.severity] = (counts[f.severity] || 0) + 1;
  return counts;
}

function renderMarkdown(auditResult, options = {}) {
  const { summary, mantle_specific, risk_level, findings = [], positive_patterns = [], agent_tasks = [] } = auditResult;
  const model = options.model || "hunyuan-pro";
  // Provider attribution defaults to Tencent Cloud Hunyuan for backward
  // compatibility; OpenRouter runs pass providerLabel/providerUrl explicitly.
  const providerLabel = options.providerLabel || "Tencent Cloud Hunyuan";
  const providerUrl = options.providerUrl || "https://cloud.tencent.com/product/hunyuan";
  const counts = countBySeverity(findings);
  const sorted = [...findings].sort(
    (a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)
  );

  const lines = [
    `# ${providerLabel} — Deep Security Audit`,
    "",
    `_Powered by [${providerLabel}](${providerUrl}) (${model}) — AI-assisted security review. Not a substitute for a professional audit._`,
    "",
    `**Overall risk level:** ${risk_level}`,
    "",
    "## Executive summary",
    "",
    summary || "_No summary provided._",
    "",
    "## Mantle L2 assessment",
    "",
    mantle_specific || "_No Mantle-specific issues noted._",
    "",
    "## Finding counts",
    "",
    `| Severity | Count |`,
    `|----------|-------|`,
    ...SEVERITY_ORDER.map((s) => `| ${s} | ${counts[s] || 0} |`),
    "",
    "## Findings",
    "",
  ];

  if (!sorted.length) {
    lines.push("_No findings._", "");
  } else {
    for (const f of sorted) {
      lines.push(`### [${f.severity}] ${f.title}`);
      lines.push(`- **ID:** ${f.id}`);
      lines.push(`- **Category:** ${f.category}`);
      lines.push(`- **Location:** \`${f.location}\``);
      lines.push(`- **Impact:** ${f.impact}`);
      lines.push(`- **Recommendation:** ${f.recommendation}`);
      if (f.evidence) {
        lines.push("", "```solidity", f.evidence, "```");
      }
      lines.push("");
    }
  }

  if (positive_patterns.length) {
    lines.push("## Positive patterns observed", "");
    for (const p of positive_patterns) lines.push(`- ${p}`);
    lines.push("");
  }

  if (agent_tasks.length) {
    lines.push("## Agent verification tasks", "");
    for (const t of agent_tasks) lines.push(`- [ ] ${t}`);
    lines.push("");
  }

  lines.push(
    "## Next steps",
    "",
    "1. Fix Critical and High findings before deployment.",
    "2. Cross-reference with `reports/security.md` (mantle-audit static analysis).",
    "3. Rerun `npx mantle-tencent-audit` after fixes to confirm resolution.",
    "4. Label output as **agent-assisted hardening** — not a professional audit.",
    ""
  );

  return lines.join("\n");
}

function renderJson(auditResult) {
  return JSON.stringify(auditResult, null, 2);
}

module.exports = { renderMarkdown, renderJson };
