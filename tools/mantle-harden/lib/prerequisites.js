"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync, spawnSync } = require("child_process");
const { commandExists: forgeCommandExists } = require("./foundry");

function commandExists(cmd) {
  try {
    execFileSync(process.platform === "win32" ? "where" : "which", [cmd], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function findPython() {
  for (const cmd of process.platform === "win32" ? ["python", "py", "python3"] : ["python3", "python"]) {
    if (!commandExists(cmd)) continue;
    try {
      const version = execFileSync(cmd, ["--version"], { encoding: "utf8" }).trim();
      if (/Python 3\.(1[0-9]|[2-9][0-9])/.test(version)) return cmd;
    } catch {
      /* try next */
    }
  }
  return null;
}

function detectSolcVersion(projectDir) {
  const contractsDir = path.join(projectDir, "contracts");
  if (!fs.existsSync(contractsDir)) return null;

  const files = fs.readdirSync(contractsDir).filter((n) => n.endsWith(".sol"));
  for (const file of files) {
    const src = fs.readFileSync(path.join(contractsDir, file), "utf8");
    const match = src.match(/pragma\s+solidity\s+\^?\s*(0\.8\.\d+|0\.7\.\d+)/);
    if (match) return match[1];
  }
  return "0.8.24";
}

function slitherAvailable() {
  return commandExists("slither");
}

function mythrilAvailable() {
  return commandExists("myth");
}

function forgeAvailable() {
  return forgeCommandExists("forge");
}

function solcMatches(version) {
  if (!commandExists("solc")) return false;
  try {
    const out = execFileSync("solc", ["--version"], { encoding: "utf8" });
    return out.includes(`Version: ${version}`) || out.includes(version);
  } catch {
    return false;
  }
}

function runPip(python, args) {
  const result = spawnSync(python, ["-m", "pip", ...args], {
    encoding: "utf8",
    shell: process.platform === "win32",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    throw new Error(`pip ${args.join(" ")} failed: ${(result.stderr || result.stdout || "").trim()}`);
  }
}

function installPythonTools(python) {
  runPip(python, ["install", "--upgrade", "pip"]);
  runPip(python, ["install", "slither-analyzer", "mythril"]);
}

function installSolcSelect(python, version) {
  runPip(python, ["install", "solc-select"]);
  const install = spawnSync("solc-select", ["install", version], { encoding: "utf8", shell: process.platform === "win32" });
  if (install.status !== 0 && !(install.stdout || "").includes("already")) {
    throw new Error(`solc-select install ${version} failed: ${(install.stderr || install.stdout || "").trim()}`);
  }
  const use = spawnSync("solc-select", ["use", version], { encoding: "utf8", shell: process.platform === "win32" });
  if (use.status !== 0) {
    throw new Error(`solc-select use ${version} failed: ${(use.stderr || use.stdout || "").trim()}`);
  }
}

function installFoundry() {
  if (process.platform === "win32") {
    const result = spawnSync(
      "powershell",
      ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", "irm https://foundry.paradigm.xyz | iex; foundryup"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 600000 }
    );
    if (result.status !== 0) {
      throw new Error(
        `Foundry install failed: ${(result.stderr || result.stdout || "").trim()}. See knowledge/hardening-toolchain.md`
      );
    }
    return;
  }

  const result = spawnSync("bash", ["-lc", "curl -L https://foundry.paradigm.xyz | bash && foundryup"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 600000,
  });
  if (result.status !== 0) {
    throw new Error(
      `Foundry install failed: ${(result.stderr || result.stdout || "").trim()}. See knowledge/hardening-toolchain.md`
    );
  }
}

function checkPrerequisites(projectDir) {
  const root = path.resolve(projectDir);
  const python = findPython();
  const solcVersion = detectSolcVersion(root);
  const missing = [];

  if (!python) missing.push("python3.10+");
  if (!slitherAvailable()) missing.push("slither");
  if (!mythrilAvailable()) missing.push("mythril");
  if (!forgeAvailable()) missing.push("forge");
  if (solcVersion && !solcMatches(solcVersion)) missing.push(`solc-${solcVersion}`);

  return {
    ok: missing.length === 0,
    missing,
    python,
    solcVersion,
    slither: slitherAvailable(),
    mythril: mythrilAvailable(),
    forge: forgeAvailable(),
    solc: solcVersion ? solcMatches(solcVersion) : true,
  };
}

function ensurePrerequisites(projectDir, options = {}) {
  const install = options.install !== false;
  const root = path.resolve(projectDir);
  const actions = [];
  let status = checkPrerequisites(root);

  if (!status.python) {
    throw new Error(
      "Python 3.10+ not found. Install from https://www.python.org/downloads/ then rerun mantle-harden --setup."
    );
  }

  if ((!status.slither || !status.mythril) && install) {
    installPythonTools(status.python);
    actions.push("installed slither-analyzer + mythril");
  }

  status = checkPrerequisites(root);
  if (status.solcVersion && !status.solc && install) {
    installSolcSelect(status.python, status.solcVersion);
    actions.push(`installed solc ${status.solcVersion} via solc-select`);
  }

  status = checkPrerequisites(root);
  if (!status.forge && install) {
    installFoundry();
    actions.push("installed Foundry (forge)");
  }

  status = checkPrerequisites(root);
  if (!status.ok) {
    throw new Error(
      `Missing hardening prerequisites: ${status.missing.join(", ")}. See knowledge/hardening-toolchain.md`
    );
  }

  return { ...status, actions, projectDir: root };
}

function formatSetupReport(result) {
  const lines = [
    "# Hardening toolchain",
    "",
    `- **Python:** ${result.python || "missing"}`,
    `- **Slither:** ${result.slither ? "ok" : "missing"}`,
    `- **Mythril:** ${result.mythril ? "ok" : "missing"}`,
    `- **Foundry (forge):** ${result.forge ? "ok" : "missing"}`,
    `- **solc (${result.solcVersion || "?"}):** ${result.solc ? "ok" : "missing"}`,
    `- **Ready:** ${result.ok ? "yes" : "no"}`,
  ];
  if (result.actions?.length) {
    lines.push("", "## Actions taken", "");
    for (const action of result.actions) lines.push(`- ${action}`);
  }
  if (result.missing?.length && !result.ok) {
    lines.push("", "## Still missing", "");
    for (const item of result.missing) lines.push(`- ${item}`);
  }
  return lines.join("\n");
}

module.exports = {
  checkPrerequisites,
  ensurePrerequisites,
  formatSetupReport,
  detectSolcVersion,
  findPython,
};
