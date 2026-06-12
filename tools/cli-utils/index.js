"use strict";

const fs = require("fs");
const path = require("path");

const REPO_MARKER = "mantle-forge";

const TEMPLATE_ALIASES = {
  "token-vault": "token-vault",
  "hardhat-mantle-starter": "hardhat-mantle-starter",
};

const COPY_IGNORE = new Set([
  "node_modules",
  ".git",
  "cache",
  "artifacts",
  "coverage",
  "typechain-types",
]);

function findRepoRoot(...startDirs) {
  if (process.env.MANTLE_FORGE_ROOT) {
    const envRoot = path.resolve(process.env.MANTLE_FORGE_ROOT);
    if (fs.existsSync(path.join(envRoot, "templates"))) {
      return envRoot;
    }
  }

  const seen = new Set();
  for (const start of startDirs) {
    if (!start) continue;
    let dir = path.resolve(start);
    while (!seen.has(dir)) {
      seen.add(dir);
      if (fs.existsSync(path.join(dir, "templates", "hardhat-mantle-starter"))) {
        return dir;
      }
      if (fs.existsSync(path.join(dir, "templates", "token-vault"))) {
        return dir;
      }
      const pkgPath = path.join(dir, "package.json");
      if (fs.existsSync(pkgPath)) {
        try {
          const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
          if (pkg.name === REPO_MARKER) return dir;
        } catch {
          /* ignore malformed package.json */
        }
      }
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }
  return null;
}

function resolveTemplateName(name) {
  const requested = String(name || "").trim();
  const resolved = TEMPLATE_ALIASES[requested];
  if (!resolved) {
    throw new Error(
      `Unknown template "${requested}". Available: ${Object.keys(TEMPLATE_ALIASES).join(", ")}`
    );
  }
  return { requested, resolved, aliased: requested !== resolved };
}

function entryKind(entry, fullPath) {
  if (entry.isDirectory()) return "directory";
  if (entry.isFile()) return "file";
  if (entry.isSymbolicLink()) {
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) return "directory";
    if (stat.isFile()) return "file";
  }
  return "skip";
}

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (COPY_IGNORE.has(entry.name)) continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    const kind = entryKind(entry, from);
    if (kind === "directory") {
      copyDirSync(from, to);
    } else if (kind === "file") {
      fs.copyFileSync(from, to);
    }
  }
}

function readTextIfExists(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null;
}

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) {
        flags[key] = true;
      } else {
        flags[key] = next;
        i += 1;
      }
    } else {
      positional.push(arg);
    }
  }
  return { positional, flags };
}

function fail(message, code = 1) {
  console.error(`Error: ${message}`);
  process.exit(code);
}

function printJson(data) {
  console.log(JSON.stringify(data, null, 2));
}

module.exports = {
  REPO_MARKER,
  TEMPLATE_ALIASES,
  COPY_IGNORE,
  findRepoRoot,
  resolveTemplateName,
  copyDirSync,
  readTextIfExists,
  parseArgs,
  fail,
  printJson,
};
