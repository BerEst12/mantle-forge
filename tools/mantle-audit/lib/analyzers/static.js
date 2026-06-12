"use strict";

const { snippetAt } = require("../solidity");

const EXTERNAL_CALL_RES = [
  { re: /\.call\s*(\{|value|\()/, label: "low-level call" },
  { re: /\.delegatecall/, label: "delegatecall" },
  { re: /\.staticcall/, label: "staticcall" },
  { re: /\.transfer\s*\(/, label: "transfer" },
  { re: /\.transferFrom\s*\(/, label: "transferFrom" },
  { re: /\.safeTransfer\s*\(/, label: "safeTransfer" },
  { re: /\.safeTransferFrom\s*\(/, label: "safeTransferFrom" },
  { re: /(?<!\/\/.*)\bsend\s*\(/, label: "send" },
];

const STATE_WRITE_RES = [
  /\b\w+\s*[+\-*\/]?=\s*[^=]/,
  /\b\w+\s*\[\s*[^\]]+\s*\]\s*[+\-*\/]?=\s*/,
  /\bdelete\s+\w+/,
  /\b\w+\+\+/,
  /\b\w+--/,
];

const ACCESS_MODIFIERS = /onlyOwner|onlyRole|onlyAdmin|auth|requiresAuth|restricted|nonReentrant/;

function makeFinding(partial) {
  return {
    source: "static",
    status: "Open",
    agentVerify: partial.agentVerify ?? true,
    confidence: partial.confidence ?? "medium",
    ...partial,
  };
}

function analyzeSources(sources) {
  const findings = [];
  for (const source of sources) {
    findings.push(...analyzeFilePatterns(source));
    for (const contract of source.contracts) {
      for (const fn of contract.functions) {
        findings.push(...analyzeFunction(source, contract, fn));
      }
    }
  }
  return dedupeFindings(findings);
}

function analyzeFilePatterns({ src, relPath }) {
  const findings = [];
  const checks = [
    {
      id: "tx-origin",
      severity: "High",
      category: "Access control",
      re: /tx\.origin/,
      title: "tx.origin used for authorization",
      recommendation: "Use msg.sender and explicit role checks; tx.origin enables phishing.",
    },
    {
      id: "delegatecall-file",
      severity: "High",
      category: "External calls",
      re: /delegatecall/,
      title: "delegatecall present",
      recommendation: "Verify target is trusted and storage layout is compatible.",
    },
    {
      id: "selfdestruct",
      severity: "Medium",
      category: "Lifecycle",
      re: /\bselfdestruct\b/,
      title: "selfdestruct present",
      recommendation: "Confirm destruction is gated, documented, and cannot brick user funds.",
    },
    {
      id: "assembly",
      severity: "Informational",
      category: "Low-level",
      re: /assembly\s*\{/,
      title: "Inline assembly used",
      recommendation: "Manually verify memory safety, overflow, and delegatecall assumptions.",
      agentVerify: true,
      confidence: "low",
    },
  ];

  for (const check of checks) {
    const match = check.re.exec(src);
    if (match) {
      findings.push(
        makeFinding({
          id: check.id,
          severity: check.severity,
          category: check.category,
          title: check.title,
          location: `${relPath}:${snippetLine(src, match.index)}`,
          evidence: snippetAt(src, match.index),
          recommendation: check.recommendation,
          agentVerify: check.agentVerify,
          confidence: check.confidence,
        })
      );
    }
  }
  return findings;
}

function analyzeFunction(source, contract, fn) {
  const findings = [];
  const loc = `${source.relPath}:${fn.line} (${contract.name}.${fn.name})`;
  const guarded = fn.modifiers.some((m) => ACCESS_MODIFIERS.test(m)) || ACCESS_MODIFIERS.test(fn.body);
  const hasNonReentrant = fn.modifiers.includes("nonReentrant") || /nonReentrant/.test(fn.body);

  if (fn.mutability === "nonpayable" && fn.visibility.match(/external|public/) && fn.stateWrites > 0) {
    const sensitive = /owner|admin|pause|upgrade|mint|burn|withdraw|recover|set/i.test(fn.name);
    const inlineGuard = /msg\.sender\s*!=\s*owner|revert\s+NotOwner|_checkOwner|onlyOwner/.test(fn.body);
    if (sensitive && !fn.modifiers.some((m) => /only|auth|restricted/i.test(m)) && !inlineGuard) {
      findings.push(
        makeFinding({
          id: "missing-access-control",
          severity: "High",
          category: "Access control",
          title: "Sensitive state-changing function lacks explicit access modifier",
          location: loc,
          evidence: `function ${fn.name}(...) ${fn.qualifiers}`,
          recommendation: "Add onlyOwner/role guard or document intentional permissionlessness.",
          confidence: "medium",
        })
      );
    }
  }

  const externalIdx = firstMatchIndex(fn.body, EXTERNAL_CALL_RES.map((x) => x.re));
  const stateIdx = firstMatchIndex(fn.body, STATE_WRITE_RES);

  if (externalIdx >= 0 && stateIdx > externalIdx && fn.mutability === "nonpayable") {
    findings.push(
      makeFinding({
        id: "cei-violation",
        severity: hasNonReentrant ? "Medium" : "High",
        category: "Reentrancy",
        title: "State update after external call (checks-effects-interactions)",
        location: loc,
        evidence: snippetAround(fn.body, externalIdx, stateIdx),
        recommendation: hasNonReentrant
          ? "Confirm nonReentrant covers all paths; prefer updating state before external calls."
          : "Reorder to effects-before-interactions or add nonReentrant.",
        confidence: hasNonReentrant ? "medium" : "high",
      })
    );
  }

  if (countMatches(fn.body, EXTERNAL_CALL_RES.map((x) => x.re)) > 0 && !hasNonReentrant) {
    const inheritsGuard =
      contract.bases.some((b) => /ReentrancyGuard/.test(b)) && /nonReentrant/.test(source.src);
    if (!inheritsGuard) {
      findings.push(
        makeFinding({
          id: "missing-reentrancy-guard",
          severity: "High",
          category: "Reentrancy",
          title: "External interaction without nonReentrant",
          location: loc,
          evidence: `function ${fn.name} performs external calls`,
          recommendation: "Apply nonReentrant or prove reentrancy-safe ordering.",
          confidence: "high",
        })
      );
    }
  }

  if (/\.transfer\s*\(|\.transferFrom\s*\(/.test(fn.body) && !/SafeERC20|safeTransfer/.test(fn.body)) {
    findings.push(
      makeFinding({
        id: "unsafe-erc20",
        severity: "Medium",
        category: "Token handling",
        title: "Direct ERC20 transfer without SafeERC20",
        location: loc,
        evidence: snippetAt(source.src, source.src.indexOf(fn.body.slice(0, 40)), 0),
        recommendation: "Use SafeERC20 and handle non-standard return values.",
        confidence: "high",
        agentVerify: false,
      })
    );
  }

  if (/for\s*\([^;]*;\s*[^;]*;\s*[^)]*\)/.test(fn.body) && /\.length\b/.test(fn.body)) {
    findings.push(
      makeFinding({
        id: "unbounded-loop",
        severity: "Medium",
        category: "DoS",
        title: "Loop may be bounded by user-controlled array length",
        location: loc,
        evidence: "for-loop references .length",
        recommendation: "Cap iterations, paginate, or use pull-over-push patterns.",
        confidence: "low",
      })
    );
  }

  if (/unchecked\s*\{/.test(fn.body)) {
    findings.push(
      makeFinding({
        id: "unchecked-block",
        severity: "Informational",
        category: "Arithmetic",
        title: "unchecked arithmetic block",
        location: loc,
        evidence: "unchecked { ... }",
        recommendation: "Verify underflow/overflow cannot occur given prior guards.",
        confidence: "low",
      })
    );
  }

  return findings;
}

function snippetLine(src, index) {
  return src.slice(0, index).split("\n").length;
}

function firstMatchIndex(text, patterns) {
  let earliest = -1;
  for (const re of patterns) {
    const m = re.exec(text);
    if (m && (earliest < 0 || m.index < earliest)) earliest = m.index;
  }
  return earliest;
}

function countMatches(text, patterns) {
  return patterns.reduce((n, re) => n + ((text.match(new RegExp(re, "g")) || []).length), 0);
}

function snippetAround(body, extIdx, stateIdx) {
  return `${body.slice(extIdx, extIdx + 80).trim()} ... ${body.slice(stateIdx, stateIdx + 80).trim()}`;
}

function dedupeFindings(findings) {
  const seen = new Set();
  return findings.filter((f) => {
    const key = `${f.id}|${f.location}|${f.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

module.exports = { analyzeSources };
