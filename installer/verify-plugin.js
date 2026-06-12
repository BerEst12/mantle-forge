#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { parseArgs } = require("../tools/cli-utils");
const { bundleDir, hermesPluginSrc } = require("./install-plugin");

const CHECKS = [
  "plugins/mantle-forge/.cursor-plugin/plugin.json",
  "plugins/mantle-forge/.claude-plugin/plugin.json",
  "plugins/mantle-forge/.codex-plugin/plugin.json",
  "plugins/mantle-forge/skills/mantle-project-scaffold/SKILL.md",
  "plugins/mantle-forge/rules/mantle-forge.mdc",
  "plugins/mantle-forge/commands/flagship-workflow.md",
  "plugins/mantle-forge/hooks/hooks.json",
  "plugins/mantle-forge/scripts/verify-env.js",
  ".opencode/INSTALL.md",
  "plugins/hermes-mantle-forge/plugin.yaml",
  "plugins/hermes-mantle-forge/__init__.py",
  ".agents/plugins/marketplace.json",
  ".claude-plugin/marketplace.json",
  ".cursor-plugin/marketplace.json",
];

function main(argv) {
  const { flags } = parseArgs(argv);
  const repoRoot = path.resolve(flags.repo || path.join(__dirname, ".."));
  let failed = 0;

  console.log("==> Plugin bundle structure");
  for (const rel of CHECKS) {
    const ok = fs.existsSync(path.join(repoRoot, rel));
    console.log(`${ok ? "PASS" : "FAIL"}: ${rel}`);
    if (!ok) failed++;
  }

  const codex = JSON.parse(
    fs.readFileSync(path.join(repoRoot, "plugins/mantle-forge/.codex-plugin/plugin.json"), "utf8")
  );
  if (codex.skills !== "./skills/") {
    console.log("FAIL: Codex manifest must set skills to ./skills/");
    failed++;
  } else {
    console.log("PASS: Codex skills path ./skills/");
  }

  const skillCount = fs.readdirSync(path.join(repoRoot, "plugins/mantle-forge/skills")).length;
  console.log(`INFO: ${skillCount} skills in bundle`);

  console.log("\n==> CLI tests");
  try {
    execSync("npm run test:tools", { cwd: repoRoot, stdio: "inherit" });
    console.log("PASS: npm run test:tools");
  } catch (e) {
    console.log("FAIL: npm run test:tools");
    if (e.stdout) process.stdout.write(e.stdout);
    if (e.stderr) process.stderr.write(e.stderr);
    failed++;
  }

  console.log("\n==> Scaffold smoke");
  const smoke = path.join(repoRoot, ".plugin-verify-smoke");
  try {
    if (fs.existsSync(smoke)) fs.rmSync(smoke, { recursive: true, force: true });
    execSync(`node tools/mantle-scaffold/cli.js token-vault "${smoke}"`, {
      cwd: repoRoot,
      stdio: "pipe",
    });
    execSync(`node tools/mantle-check/cli.js "${smoke}"`, { cwd: repoRoot, stdio: "pipe" });
    console.log("PASS: mantle-scaffold + mantle-check");
    fs.rmSync(smoke, { recursive: true, force: true });
  } catch (e) {
    console.log("FAIL: scaffold smoke", e.message || "");
    failed++;
  }

  if (flags.wsl && process.platform === "win32") {
    console.log("\n==> Hermes WSL");
    try {
      const out = execSync(
        'wsl bash -lc "hermes plugins list 2>/dev/null | grep mantle-forge || true"',
        { encoding: "utf8" }
      );
      const has = out.includes("mantle-forge");
      const enabled = /enabled/i.test(out);
      console.log(
        `${has && enabled ? "PASS" : has ? "WARN" : "WARN"}: mantle-forge in WSL hermes plugins${enabled ? " (enabled)" : has ? " (not enabled)" : ""}`
      );
      if (!has) console.log("      Run: npm run plugin:hermes");
      else if (!enabled) console.log(out.trim());
    } catch {
      console.log("WARN: could not run hermes in WSL");
    }
  }

  console.log(failed ? `\nFAILED: ${failed} check(s)` : "\nALL CHECKS PASSED");
  process.exit(failed ? 1 : 0);
}

if (require.main === module) main(process.argv.slice(2));
