"use strict";

function buildInventory(sources) {
  const contracts = [];
  for (const { relPath, contracts: parsed } of sources) {
    for (const c of parsed) {
      contracts.push({
        file: relPath,
        name: c.name,
        inheritance: c.bases,
        functions: c.functions.map((fn) => ({
          name: fn.name,
          visibility: fn.visibility,
          mutability: fn.mutability,
          modifiers: fn.modifiers,
          line: fn.line,
          externalCalls: countExternalCalls(fn.body),
          stateWrites: countStateWrites(fn.body),
        })),
      });
    }
  }
  return contracts;
}

function countExternalCalls(body) {
  const patterns = [
    /\.call\s*(\{|value|\()/,
    /\.delegatecall/,
    /\.staticcall/,
    /\.transfer\s*\(/,
    /\.transferFrom\s*\(/,
    /\.safeTransfer\s*\(/,
    /\.safeTransferFrom\s*\(/,
    /send\s*\(/,
  ];
  return patterns.reduce((n, re) => n + (body.match(new RegExp(re, "g")) || []).length, 0);
}

function countStateWrites(body) {
  const patterns = [
    /\b\w+\s*[+\-*\/]?=\s*[^=]/,
    /\b\w+\s*\[\s*[^\]]+\s*\]\s*[+\-*\/]?=\s*/,
    /\b(delete\s+\w+)/,
    /\b\w+\+\+/,
    /\b\w+--/,
  ];
  let count = 0;
  for (const re of patterns) count += (body.match(new RegExp(re, "g")) || []).length;
  return count;
}

module.exports = { buildInventory };
