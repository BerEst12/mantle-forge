#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { parseArgs } = require("../tools/cli-utils");
const {
  resolveHermesHome,
  hermesConfigPath,
  hermesSkillsDir,
} = require("./hermes-home");

function copySkills(repoRoot, targetDir) {
  const source = path.join(repoRoot, "hermes", "skills");
  if (!fs.existsSync(source)) {
    throw new Error(`Missing skills directory: ${source}`);
  }
  fs.mkdirSync(targetDir, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const from = path.join(source, entry.name);
    const to = path.join(targetDir, entry.name);
    fs.rmSync(to, { recursive: true, force: true });
    fs.cpSync(from, to, { recursive: true });
  }
}

function wireDevMode(repoRoot) {
  const configPath = hermesConfigPath();
  const skillsDir = path.join(repoRoot, "hermes", "skills").replace(/\\/g, "/");
  const line = `    - ${skillsDir}`;

  fs.mkdirSync(path.dirname(configPath), { recursive: true });

  let content = fs.existsSync(configPath) ? fs.readFileSync(configPath, "utf8") : "";
  if (content.includes(skillsDir)) {
    console.log(`OK: external_dirs already references ${skillsDir}`);
    return;
  }

  if (!content.includes("skills:")) {
    content = `${content.trim()}\n\nskills:\n  external_dirs:\n${line}\n`;
  } else if (content.includes("external_dirs:")) {
    content = content.replace(/external_dirs:\n/, `external_dirs:\n${line}\n`);
  } else {
    content = content.replace(/skills:\n/, `skills:\n  external_dirs:\n${line}\n`);
  }

  fs.writeFileSync(configPath, content, "utf8");
  console.log(`OK: wired dev mode in ${configPath}`);
}

function runSmoke(repoRoot) {
  console.log("==> Running tool smoke tests...");
  execSync("npm run test:tools", { cwd: repoRoot, stdio: "inherit" });
}

function main(argv) {
  const { flags } = parseArgs(argv);
  const repoRoot = path.resolve(flags.repo || path.join(__dirname, ".."));

  if (flags.copy) {
    const target = hermesSkillsDir();
    copySkills(repoRoot, target);
    console.log(`OK: copied ${countSkillDirs(repoRoot)} skills to ${target}`);
  }

  if (flags.dev) {
    wireDevMode(repoRoot);
  }

  if (flags.smoke) {
    runSmoke(repoRoot);
  }
}

if (require.main === module) {
  main(process.argv.slice(2));
}

function countSkillDirs(repoRoot) {
  const source = path.join(repoRoot, "hermes", "skills");
  return fs.readdirSync(source, { withFileTypes: true }).filter((e) => e.isDirectory()).length;
}

module.exports = { copySkills, wireDevMode, resolveHermesHome };
