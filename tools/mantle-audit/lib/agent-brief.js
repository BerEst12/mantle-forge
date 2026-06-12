"use strict";

const AGENT_REVIEW_AREAS = [
  "Threat model: who can call each external/public function and what can they steal or brick?",
  "Economic invariants: deposit/withdraw/mint/burn math matches intended tokenomics.",
  "Admin centralization: pause, upgrade, rescue, fee change — document trust assumptions.",
  "Cross-function reentrancy: callbacks via tokens, hooks, or composability.",
  "Oracle / price inputs: staleness, manipulation, decimal mismatches (if applicable).",
  "MEV and ordering: sandwich on deposits/withdrawals/swaps (if applicable).",
  "Test gap analysis: missing fuzz, invariant, or adversarial ERC20 cases.",
];

function buildAgentTasks({ inventory, findings }) {
  const tasks = [...AGENT_REVIEW_AREAS];

  for (const f of findings.filter((x) => x.agentVerify)) {
    tasks.push(`Triangulate [${f.severity}] ${f.title} at ${f.location} — confirm exploit path or mark false positive.`);
  }

  for (const c of inventory) {
    for (const fn of c.functions) {
      if (fn.externalCalls > 0) {
        tasks.push(
          `Trace ${c.name}.${fn.name}: list external call targets, reentrancy paths, and failure modes.`
        );
      }
    }
  }

  if (inventory.some((c) => /Vault|Pool|Stake|Lend/i.test(c.name))) {
    tasks.push(
      "Vault review: measure balance deltas on deposit/withdraw; reject fee-on-transfer/rebasing unless explicitly supported."
    );
  }

  return [...new Set(tasks)];
}

function renderAgentBrief({ projectDir, inventory, findings, agentTasks }) {
  const lines = [
    "# Audit agent brief",
    "",
    "Use this brief after `mantle-harden` (Slither + Mythril + Foundry + Hardhat). **Your job is auditor-style verification**, not rerunning tools.",
    "",
    `Project: \`${projectDir}\``,
    "",
    "## Mandatory workflow",
    "",
    "1. Read every `.sol` file in scope (not only this brief).",
    "2. Triage Slither, Mythril, and static findings: confirm, fix, or mark false positive.",
    "3. Add findings static analysis cannot see (logic bugs, trust model, economics).",
    "4. Propose minimal fixes for High/Critical; rerun `npx hardhat test`.",
    "5. Merge into `reports/security.md` with Location, Issue, Recommendation, Status.",
    "",
    "## Contracts",
    "",
  ];

  for (const c of inventory) {
    lines.push(`- **${c.name}** (\`${c.file}\`) — ${c.functions.length} functions`);
  }

  lines.push("", "## Static findings requiring triage", "");
  const verify = findings.filter((f) => f.agentVerify);
  if (!verify.length) lines.push("_None flagged — still perform full manual review._");
  else {
    for (const f of verify) {
      lines.push(`- [${f.severity}] **${f.title}** — \`${f.location}\``);
    }
  }

  lines.push("", "## Checklist", "");
  for (const task of agentTasks) lines.push(`- [ ] ${task}`);
  lines.push("");

  return lines.join("\n");
}

module.exports = { buildAgentTasks, renderAgentBrief, AGENT_REVIEW_AREAS };
