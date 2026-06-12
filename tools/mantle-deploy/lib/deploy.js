"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { readTextIfExists } = require("@mantle-forge/cli-utils");
const { checkMantleProject } = require("@mantle-forge/mantle-check/lib/check");
const { verifyDeployment } = require("./verify");

const DEFAULT_NETWORK = "mantleSepolia";
const DEPLOYMENT_FILE = "mantleSepolia.json";

function loadProjectEnv(projectDir) {
  const envPath = path.join(projectDir, ".env");
  const text = readTextIfExists(envPath);
  if (!text) return;
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env) || !process.env[key]) {
      process.env[key] = value;
    }
  }
}

function findDeployScript(projectDir) {
  for (const name of ["scripts/deploy.ts", "scripts/deploy.js"]) {
    const filePath = path.join(projectDir, name);
    if (fs.existsSync(filePath)) return filePath;
  }
  return null;
}

function validateDeployEnv(options = {}) {
  const errors = [];
  if (!process.env.MANTLE_SEPOLIA_RPC_URL) {
    errors.push("MANTLE_SEPOLIA_RPC_URL is not set (project .env or shell)");
  }
  if (!options.dryRun && !process.env.MANTLE_PRIVATE_KEY) {
    errors.push("MANTLE_PRIVATE_KEY is not set (dedicated Sepolia test wallet only)");
  }
  return errors;
}

function runCommand(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    env: process.env,
    encoding: "utf8",
    shell: process.platform === "win32",
    timeout: 300000,
    maxBuffer: 10 * 1024 * 1024,
  });
  const output = [result.stdout, result.stderr].filter(Boolean).join("\n");
  return { status: result.status ?? 1, output };
}

function readDeploymentArtifact(projectDir, network) {
  const fileName = network === "mantleSepolia" ? DEPLOYMENT_FILE : `${network}.json`;
  const filePath = path.join(projectDir, "deployments", fileName);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

async function deployProject(projectDir, options = {}) {
  const root = path.resolve(projectDir);
  const network = options.network || DEFAULT_NETWORK;
  const shouldVerify = options.verify !== false && !options.dryRun && !options.skipVerify;

  if (!fs.existsSync(root)) {
    throw new Error(`Project directory not found: ${root}`);
  }

  loadProjectEnv(root);

  const check = checkMantleProject(root);
  if (!check.ok) {
    throw new Error(`Mantle check failed:\n${check.errors.map((e) => `- ${e}`).join("\n")}`);
  }

  const envErrors = validateDeployEnv(options);
  if (envErrors.length) {
    throw new Error(envErrors.join("\n"));
  }

  const deployScript = findDeployScript(root);
  if (!deployScript) {
    throw new Error("Missing scripts/deploy.ts or scripts/deploy.js");
  }

  const compile = runCommand("npx", ["hardhat", "compile"], root);
  if (compile.status !== 0) {
    throw new Error(`hardhat compile failed:\n${compile.output.slice(-2000)}`);
  }

  if (options.dryRun) {
    return {
      projectDir: root,
      network,
      dryRun: true,
      deployScript: path.relative(root, deployScript),
      message: "Compile OK; deploy skipped (--dry-run)",
    };
  }

  if (!options.skipTests) {
    const tests = runCommand("npx", ["hardhat", "test"], root);
    if (tests.status !== 0) {
      throw new Error(`hardhat test failed:\n${tests.output.slice(-2000)}`);
    }
  }

  const deploy = runCommand("npx", ["hardhat", "run", deployScript, "--network", network], root);
  if (deploy.status !== 0) {
    throw new Error(`hardhat deploy failed:\n${deploy.output.slice(-3000)}`);
  }

  let artifact = readDeploymentArtifact(root, network);
  if (!artifact) {
    throw new Error(`Deploy command finished but deployments/${DEPLOYMENT_FILE} was not created`);
  }

  const result = {
    projectDir: root,
    network,
    artifact,
    deployOutput: deploy.output,
    verification: null,
    verifyWarnings: [],
  };

  if (shouldVerify) {
    const verifyResult = await verifyDeployment(root, {
      network,
      verifyDelayMs: options.verifyDelayMs ?? 15000,
      skipIfVerified: true,
    });
    result.artifact = verifyResult.artifact;
    result.verification = verifyResult.verification;
    result.verifyWarnings = verifyResult.warnings;
    if (!verifyResult.ok && options.strictVerify) {
      throw new Error(
        `Deploy succeeded but Mantlescan verification failed:\n${verifyResult.results
          .filter((r) => r.status === "failed")
          .map((r) => `- ${r.contractName}: ${r.error}`)
          .join("\n")}`
      );
    }
  }

  return result;
}

module.exports = {
  deployProject,
  validateDeployEnv,
  findDeployScript,
  loadProjectEnv,
  readDeploymentArtifact,
  DEFAULT_NETWORK,
  DEPLOYMENT_FILE,
};
