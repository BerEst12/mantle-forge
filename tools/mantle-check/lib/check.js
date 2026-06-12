"use strict";

const fs = require("fs");
const path = require("path");
const { readTextIfExists } = require("@mantle-forge/cli-utils");

function findHardhatConfig(projectDir) {
  for (const name of ["hardhat.config.ts", "hardhat.config.js"]) {
    const filePath = path.join(projectDir, name);
    if (fs.existsSync(filePath)) return filePath;
  }
  return null;
}

function hasDeployScript(projectDir) {
  for (const name of ["scripts/deploy.ts", "scripts/deploy.js"]) {
    if (fs.existsSync(path.join(projectDir, name))) return true;
  }
  return false;
}

function checkMantleProject(projectDir) {
  const root = path.resolve(projectDir);
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    return {
      ok: false,
      projectDir: root,
      errors: [`Project directory not found: ${root}`],
      warnings: [],
    };
  }

  const hardhatConfig = findHardhatConfig(root);
  if (!hardhatConfig) {
    errors.push("Missing hardhat.config.ts or hardhat.config.js");
  }

  const packageJsonPath = path.join(root, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    errors.push("Missing package.json");
  } else {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (!deps.hardhat) {
        errors.push("package.json does not list hardhat as a dependency");
      }
    } catch {
      errors.push("package.json is not valid JSON");
    }
  }

  if (!fs.existsSync(path.join(root, "contracts"))) {
    errors.push("Missing contracts/ directory");
  }
  if (!fs.existsSync(path.join(root, "test"))) {
    errors.push("Missing test/ directory");
  }
  if (!hasDeployScript(root)) {
    warnings.push("Missing scripts/deploy.ts or scripts/deploy.js");
  }

  const envExample = readTextIfExists(path.join(root, ".env.example"));
  if (!envExample) {
    warnings.push("Missing .env.example");
  } else if (!envExample.includes("MANTLE_SEPOLIA_RPC_URL")) {
    errors.push(".env.example must document MANTLE_SEPOLIA_RPC_URL");
  }

  const configText = hardhatConfig ? readTextIfExists(hardhatConfig) : "";
  if (configText) {
    if (!configText.includes("mantleSepolia")) {
      errors.push("Hardhat config must define mantleSepolia network");
    }
    if (!/chainId:\s*5003/.test(configText) && !/chainId\s*=\s*5003/.test(configText)) {
      errors.push("Hardhat config must set Mantle Sepolia chainId 5003");
    }
  }

  if (!process.env.MANTLE_SEPOLIA_RPC_URL) {
    warnings.push("MANTLE_SEPOLIA_RPC_URL is not set in the current shell (compile may still work)");
  }
  if (!process.env.MANTLE_PRIVATE_KEY) {
    warnings.push("MANTLE_PRIVATE_KEY is not set in the current shell (deploy will fail until set)");
  }

  return {
    ok: errors.length === 0,
    projectDir: root,
    hardhatConfig,
    errors,
    warnings,
  };
}

module.exports = { checkMantleProject, findHardhatConfig };
