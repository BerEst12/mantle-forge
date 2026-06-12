"use strict";

const fs = require("fs");
const path = require("path");

function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/\/\/[^\n]*/g, (m) => m.replace(/[^\n]/g, " "));
}

function lineNumberAt(src, index) {
  return src.slice(0, index).split("\n").length;
}

function snippetAt(src, index, radius = 1) {
  const lines = src.split("\n");
  const line = lineNumberAt(src, index) - 1;
  const start = Math.max(0, line - radius);
  const end = Math.min(lines.length - 1, line + radius);
  return lines.slice(start, end + 1).join("\n").trim();
}

function findMatchingBrace(src, openIndex) {
  let depth = 0;
  for (let i = openIndex; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function listSolidityFiles(projectDir) {
  const contractsDir = path.join(projectDir, "contracts");
  if (!fs.existsSync(contractsDir)) return [];

  const files = [];
  function walk(dir) {
    for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, name.name);
      if (name.isDirectory()) walk(full);
      else if (name.name.endsWith(".sol")) files.push(full);
    }
  }
  walk(contractsDir);
  return files.sort();
}

function parseContracts(src, relPath) {
  const cleaned = stripComments(src);
  const contracts = [];
  const contractRe = /\bcontract\s+(\w+)(?:\s+is\s+([\w\s,]+))?\s*\{/g;
  let match;

  while ((match = contractRe.exec(cleaned))) {
    const name = match[1];
    const bases = (match[2] || "")
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);
    const bodyStart = match.index + match[0].length - 1;
    const bodyEnd = findMatchingBrace(cleaned, bodyStart);
    if (bodyEnd < 0) continue;

    const body = cleaned.slice(bodyStart + 1, bodyEnd);
    contracts.push({
      name,
      bases,
      relPath,
      body,
      bodyStart,
      functions: parseFunctions(body, src, bodyStart + 1),
    });
  }

  return contracts;
}

function parseFunctions(body, rawSrc, bodyOffset) {
  const functions = [];
  const fnRe = /function\s+(\w+)\s*\(([^)]*)\)\s*([^{;]+)\{/g;
  let match;

  while ((match = fnRe.exec(body))) {
    const name = match[1];
    const params = match[2].trim();
    const headerTail = match[3].replace(/\s+/g, " ").trim();
    const fnStartInBody = match.index + match[0].length - 1;
    const fnEndInBody = findMatchingBrace(body, fnStartInBody);
    if (fnEndInBody < 0) continue;

    const fnBody = body.slice(fnStartInBody + 1, fnEndInBody);
    const absStart = bodyOffset + fnStartInBody + 1;
    const tokens = headerTail.split(/\s+/).filter(Boolean);
    const qualifiers = tokens
      .filter((t) =>
        ["public", "external", "internal", "private", "view", "pure", "payable", "virtual", "override"].includes(t)
      )
      .join(" ");
    const modifiers = tokens.filter(
      (t) =>
        !["public", "external", "internal", "private", "view", "pure", "payable", "virtual", "override"].includes(t) &&
        !/^returns$/i.test(t) &&
        !/^\(.*\)$/.test(t)
    );

    functions.push({
      name,
      params,
      qualifiers,
      body: fnBody,
      line: lineNumberAt(rawSrc, absStart),
      modifiers,
      visibility: extractVisibility(qualifiers || headerTail),
      mutability: extractMutability(qualifiers || headerTail),
    });
  }

  return functions;
}

function extractVisibility(qualifiers) {
  if (/\bexternal\b/.test(qualifiers)) return "external";
  if (/\bpublic\b/.test(qualifiers)) return "public";
  if (/\binternal\b/.test(qualifiers)) return "internal";
  if (/\bprivate\b/.test(qualifiers)) return "private";
  return "public";
}

function extractMutability(qualifiers) {
  if (/\bpure\b/.test(qualifiers)) return "pure";
  if (/\bview\b/.test(qualifiers)) return "view";
  if (/\bpayable\b/.test(qualifiers)) return "payable";
  return "nonpayable";
}

function readProjectSources(projectDir) {
  const root = path.resolve(projectDir);
  const files = listSolidityFiles(root);
  return files.map((file) => {
    const src = fs.readFileSync(file, "utf8");
    const relPath = path.relative(root, file);
    return { file, relPath, src, contracts: parseContracts(src, relPath) };
  });
}

module.exports = {
  listSolidityFiles,
  readProjectSources,
  stripComments,
  lineNumberAt,
  snippetAt,
  parseContracts,
};
