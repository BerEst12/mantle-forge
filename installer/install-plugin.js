#!/usr/bin/env node
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execSync } = require("child_process");
const { parseArgs } = require("../tools/cli-utils");
const { toWslPath } = require("./paths");

const VENDORS = ["cursor", "hermes", "codex", "claude", "openclaw", "opencode", "all"];

function bundleDir(repoRoot) {
  return path.join(repoRoot, "plugins", "mantle-forge");
}

function hermesPluginSrc(repoRoot) {
  return path.join(repoRoot, "plugins", "hermes-mantle-forge");
}

function copyDir(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true });
}

function symlinkOrCopy(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  if (fs.existsSync(to)) fs.rmSync(to, { recursive: true, force: true });
  try {
    fs.symlinkSync(from, to, process.platform === "win32" ? "junction" : "dir");
    return "symlink";
  } catch {
    fs.cpSync(from, to, { recursive: true });
    return "copy";
  }
}

function setEnvFile(envPath, key, value) {
  fs.mkdirSync(path.dirname(envPath), { recursive: true });
  let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, "m");
  content = re.test(content) ? content.replace(re, line) : `${content.trim()}\n${line}\n`;
  fs.writeFileSync(envPath, content, "utf8");
}

function hermesHomeDir() {
  if (process.env.HERMES_HOME) return path.resolve(process.env.HERMES_HOME);
  if (process.platform === "win32" && process.env.LOCALAPPDATA) {
    return path.join(process.env.LOCALAPPDATA, "hermes");
  }
  return path.join(os.homedir(), ".hermes");
}

function ensureYamlList(content, block, item) {
  if (content.includes(`- ${item}`) || content.includes(`- "${item}"`)) return content;
  if (content.includes(`${block}:`)) {
    return content.replace(new RegExp(`${block}:\\n`), `${block}:\n    - ${item}\n`);
  }
  return `${content.trim()}\n\nplugins:\n  ${block}:\n    - ${item}\n`;
}

function installHermesNative(repoRoot, hermesHome) {
  const target = path.join(hermesHome, "plugins", "mantle-forge");
  const src = hermesPluginSrc(repoRoot);

  fs.mkdirSync(target, { recursive: true });
  for (const file of ["plugin.yaml", "__init__.py", "schemas.py", "tools.py"]) {
    fs.copyFileSync(path.join(src, file), path.join(target, file));
  }
  copyDir(path.join(bundleDir(repoRoot), "skills"), path.join(target, "skills"));

  setEnvFile(path.join(hermesHome, ".env"), "MANTLE_FORGE_ROOT", repoRoot);

  const configPath = path.join(hermesHome, "config.yaml");
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  let config = fs.existsSync(configPath) ? fs.readFileSync(configPath, "utf8") : "";
  if (!config.includes("plugins:")) config = `${config.trim()}\n\nplugins:\n  enabled:\n    - mantle-forge\n`;
  else config = ensureYamlList(config, "enabled", "mantle-forge");
  fs.writeFileSync(configPath, config, "utf8");

  console.log(`OK: Hermes plugin → ${target}`);
  console.log("    Verify: hermes plugins list");
  console.log("    Enable: hermes plugins enable mantle-forge");
}

function installCursor(repoRoot) {
  const target = path.join(os.homedir(), ".cursor", "plugins", "local", "mantle-forge");
  const mode = symlinkOrCopy(bundleDir(repoRoot), target);
  setEnvFile(path.join(os.homedir(), ".mantle-forge.env"), "MANTLE_FORGE_ROOT", repoRoot);
  console.log(`OK: Cursor plugin ${mode} → ${target}`);
  console.log("    Reload: Developer → Reload Window");
  console.log("    Docs: https://cursor.com/docs/plugins#creating-plugins");
}

function tryExec(cmd, label) {
  try {
    execSync(cmd, { stdio: "inherit" });
    return true;
  } catch {
    console.warn(`WARN: ${label} — run manually if needed`);
    return false;
  }
}

function installCodex(repoRoot) {
  setEnvFile(path.join(os.homedir(), ".mantle-forge.env"), "MANTLE_FORGE_ROOT", repoRoot);
  console.log("OK: Codex marketplace at .agents/plugins/marketplace.json");
  const added = tryExec(`codex plugin marketplace add "${repoRoot}"`, "codex marketplace add");
  if (added) {
    tryExec("codex plugin install mantle-forge --source mantle-forge", "codex plugin install");
  } else {
    console.log("    codex plugin marketplace add \"" + repoRoot + "\"");
    console.log("    codex plugin install mantle-forge --source mantle-forge");
  }
  console.log("    Docs: https://developers.openai.com/codex/plugins");
}

function installClaude(repoRoot) {
  const bundle = bundleDir(repoRoot);
  setEnvFile(path.join(os.homedir(), ".mantle-forge.env"), "MANTLE_FORGE_ROOT", repoRoot);
  console.log("OK: Claude marketplace at .claude-plugin/marketplace.json");
  console.log("    In Claude Code (two lines):");
  console.log(`      /plugin marketplace add ${repoRoot}`);
  console.log("      /plugin install mantle-forge@mantle-forge");
  console.log("    Session-only:");
  console.log(`      claude --plugin-dir "${bundle}"`);
  console.log("    Docs: https://claude.com/plugins");
}

function installOpenCode(repoRoot) {
  const bundle = bundleDir(repoRoot);
  const opencodeDir = path.join(repoRoot, ".opencode");
  const skillsDst = path.join(opencodeDir, "skills");
  copyDir(path.join(bundle, "skills"), skillsDst);
  setEnvFile(path.join(os.homedir(), ".mantle-forge.env"), "MANTLE_FORGE_ROOT", repoRoot);
  const n = fs.readdirSync(skillsDst).length;
  console.log(`OK: OpenCode skills (${n}) → ${skillsDst}`);
  console.log('    Add to opencode.json: "skills": { "paths": ["./.opencode/skills"] }');
  console.log(`    Or: Fetch instructions from ${path.join(repoRoot, ".opencode", "INSTALL.md")}`);
  console.log("    Docs: docs/plugins/install-opencode.md");
}

function installOpenClaw(repoRoot) {
  const bundle = bundleDir(repoRoot);
  setEnvFile(path.join(os.homedir(), ".mantle-forge.env"), "MANTLE_FORGE_ROOT", repoRoot);
  console.log("OK: OpenClaw compatible bundle (Cursor/Claude/Codex markers)");
  console.log(`    openclaw plugins install --link "${bundle}"`);
  console.log("    openclaw plugins enable mantle-forge");
  console.log("    openclaw gateway restart");
  console.log("    openclaw plugins inspect mantle-forge --runtime --json");
  console.log("    Docs: https://docs.openclaw.ai/tools/plugin");
  try {
    execSync(`openclaw plugins install --link "${bundle}"`, { stdio: "inherit" });
    execSync("openclaw plugins enable mantle-forge", { stdio: "inherit" });
  } catch {
    console.warn("WARN: openclaw CLI not on PATH — run commands above manually");
  }
}

function installHermes(repoRoot, useWsl) {
  if (useWsl && process.platform === "win32") {
    const wslRepo = toWslPath(repoRoot);
    const cmd = `cd '${wslRepo}' && npm install && node installer/install-plugin.js --hermes-native --repo '${wslRepo}'`;
    console.log(`==> Installing Hermes plugin inside WSL`);
    execSync(`wsl bash -lc ${JSON.stringify(cmd)}`, { stdio: "inherit" });
    return;
  }
  installHermesNative(repoRoot, hermesHomeDir());
}

function syncSkills(repoRoot) {
  const src = path.join(repoRoot, "hermes", "skills");
  for (const dst of [
    path.join(bundleDir(repoRoot), "skills"),
    path.join(hermesPluginSrc(repoRoot), "skills"),
  ]) {
    if (!fs.existsSync(src)) continue;
    copyDir(src, dst);
  }
  const n = fs.readdirSync(path.join(bundleDir(repoRoot), "skills")).length;
  console.log(`OK: synced ${n} skills → bundle + hermes plugin`);
}

function printUsage() {
  console.log(`Mantle Forge plugin installer

Usage:
  node installer/install-plugin.js --<vendor> [--wsl] --repo <path>

Vendors:
  --cursor      Cursor (~/.cursor/plugins/local/) — https://cursor.com/docs/plugins
  --hermes      Hermes (~/.hermes/plugins/) — use --wsl on Windows
  --codex       Codex (.agents/plugins/marketplace.json)
  --claude      Claude (.claude-plugin/marketplace.json)
  --openclaw    OpenClaw compatible bundle
  --opencode    OpenCode skills → .opencode/skills/
  --all         All vendors

Flags:
  --wsl         Force Hermes install inside WSL (default on Windows)
  --no-wsl      Install Hermes to Windows %LOCALAPPDATA%\\hermes instead of WSL
  --sync-skills Copy hermes/skills → plugin bundles

One plugin (pick one):
  npm install && npm run plugin:hermes
  npm install && npm run plugin:cursor
  npm install && npm run plugin:codex
  npm install && npm run plugin:claude
  npm install && npm run plugin:openclaw
  npm install && npm run plugin:opencode
`);
}

function main(argv) {
  const { flags } = parseArgs(argv);
  const repoRoot = path.resolve(flags.repo || path.join(__dirname, ".."));

  if (flags.help || flags.h) {
    printUsage();
    return;
  }

  if (flags["sync-skills"]) {
    syncSkills(repoRoot);
    return;
  }

  if (flags["hermes-native"]) {
    installHermesNative(repoRoot, hermesHomeDir());
    return;
  }

  const selected = VENDORS.filter((v) => v !== "all" && (flags[v] || flags.all));
  if (!selected.length) {
    printUsage();
    process.exit(1);
  }

  syncSkills(repoRoot);
  execSync("npm install", { cwd: repoRoot, stdio: "inherit" });

  const useWsl = Boolean(
    flags.wsl || flags.Wsl || (process.platform === "win32" && selected.includes("hermes") && !flags["no-wsl"])
  );

  for (const vendor of selected) {
    console.log(`\n==> ${vendor}`);
    if (vendor === "cursor") installCursor(repoRoot);
    else if (vendor === "hermes") installHermes(repoRoot, useWsl);
    else if (vendor === "codex") installCodex(repoRoot);
    else if (vendor === "claude") installClaude(repoRoot);
    else if (vendor === "openclaw") installOpenClaw(repoRoot);
    else if (vendor === "opencode") installOpenCode(repoRoot);
  }

  console.log("\n==> Verify: node installer/verify-plugin.js --repo .");
}

if (require.main === module) main(process.argv.slice(2));

module.exports = {
  installCursor,
  installHermes,
  installHermesNative,
  installCodex,
  installClaude,
  installOpenClaw,
  installOpenCode,
  syncSkills,
  bundleDir,
  hermesPluginSrc,
};
