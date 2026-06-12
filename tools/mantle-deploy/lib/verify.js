"use strict";

const fs = require("fs");
const https = require("https");
const path = require("path");
const { spawnSync } = require("child_process");
const { readTextIfExists } = require("@mantle-forge/cli-utils");

const EXPLORER_API = {
  mantleSepolia: "https://api-sepolia.mantlescan.xyz/api",
};

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

function readDeploymentArtifact(projectDir, network) {
  const fileName = network === DEFAULT_NETWORK ? DEPLOYMENT_FILE : `${network}.json`;
  const filePath = path.join(projectDir, "deployments", fileName);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function sleep(ms) {
  if (ms <= 0) return;
  const end = Date.now() + ms;
  while (Date.now() < end) {
    /* sync wait for explorer indexing */
  }
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

function validateVerifyEnv() {
  const warnings = [];
  const errors = [];
  if (!process.env.MANTLE_EXPLORER_API_KEY) {
    warnings.push(
      "MANTLE_EXPLORER_API_KEY is not set — Hardhat verify may fail. Get a key at https://sepolia.mantlescan.xyz/myapikey"
    );
  }
  return { warnings, errors };
}

function buildVerifyArgs(network, address, constructorArgs = []) {
  const args = ["hardhat", "verify", "--network", network, address];
  for (const value of constructorArgs) {
    args.push(String(value));
  }
  return args;
}

function parseVerifyOutcome(output) {
  const text = output.toLowerCase();
  if (text.includes("already verified") || text.includes("already been verified")) {
    return { status: "already_verified", error: null };
  }
  if (text.includes("successfully verified") || text.includes("contract verified")) {
    return { status: "verified", error: null };
  }
  return { status: "failed", error: output.slice(-1500) || "hardhat verify failed" };
}

function httpsGetJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(new Error(`JSON parse error: ${err.message}`));
          }
        });
      })
      .on("error", reject);
  });
}

async function fetchExplorerVerification(address, network = DEFAULT_NETWORK) {
  const base = EXPLORER_API[network];
  if (!base) {
    throw new Error(`No explorer API configured for network: ${network}`);
  }
  const params = new URLSearchParams({
    module: "contract",
    action: "getsourcecode",
    address,
  });
  if (process.env.MANTLE_EXPLORER_API_KEY) {
    params.set("apikey", process.env.MANTLE_EXPLORER_API_KEY);
  }
  const res = await httpsGetJson(`${base}?${params}`);
  const row = Array.isArray(res.result) ? res.result[0] : null;
  if (!row) {
    return { verified: false, contractName: null, compilerVersion: null };
  }
  const source = row.SourceCode || "";
  const verified = Boolean(source && source !== "{{" && !/not verified/i.test(row.ContractName || ""));
  return {
    verified,
    contractName: row.ContractName || null,
    compilerVersion: row.CompilerVersion || null,
  };
}

function writeDeploymentArtifact(projectDir, network, artifact) {
  const fileName = network === DEFAULT_NETWORK ? DEPLOYMENT_FILE : `${network}.json`;
  const filePath = path.join(projectDir, "deployments", fileName);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
  return filePath;
}

function browserUrlFor(network, address) {
  if (network === DEFAULT_NETWORK) {
    return `https://sepolia.mantlescan.xyz/address/${address}#code`;
  }
  return `https://sepolia.mantlescan.xyz/address/${address}`;
}

async function verifyOneContract(projectDir, network, contractName, info, options = {}) {
  const address = info.address;
  if (!address) {
    return { contractName, address: null, status: "skipped", error: "missing address in deployment artifact" };
  }

  if (options.skipIfVerified) {
    try {
      const onChain = await fetchExplorerVerification(address, network);
      if (onChain.verified) {
        return {
          contractName,
          address,
          status: "verified",
          explorerUrl: browserUrlFor(network, address),
          onChain,
          error: null,
        };
      }
    } catch {
      // continue with hardhat verify
    }
  }

  const constructorArgs = Array.isArray(info.constructorArgs) ? info.constructorArgs : [];
  const args = buildVerifyArgs(network, address, constructorArgs);
  const result = runCommand("npx", args, projectDir);
  const parsed = parseVerifyOutcome(result.output);

  if (parsed.status === "failed" && result.status !== 0) {
    return {
      contractName,
      address,
      status: "failed",
      explorerUrl: browserUrlFor(network, address),
      error: parsed.error,
      command: `npx ${args.join(" ")}`,
    };
  }

  let onChain = null;
  try {
    onChain = await fetchExplorerVerification(address, network);
  } catch {
    onChain = null;
  }

  return {
    contractName,
    address,
    status: parsed.status,
    explorerUrl: browserUrlFor(network, address),
    onChain,
    error: parsed.status === "failed" ? parsed.error : null,
    command: `npx ${args.join(" ")}`,
  };
}

async function verifyDeployment(projectDir, options = {}) {
  const root = path.resolve(projectDir);
  const network = options.network || DEFAULT_NETWORK;

  loadProjectEnv(root);

  const env = validateVerifyEnv();
  if (env.errors.length) {
    throw new Error(env.errors.join("\n"));
  }

  const artifact = readDeploymentArtifact(root, network);
  if (!artifact || !artifact.contracts) {
    throw new Error(`Missing deployments/${DEPLOYMENT_FILE} with contracts map — deploy first`);
  }

  if (options.verifyDelayMs > 0) {
    sleep(options.verifyDelayMs);
  }

  const results = [];
  for (const [contractName, info] of Object.entries(artifact.contracts)) {
    results.push(await verifyOneContract(root, network, contractName, info, options));
  }

  const verification = {
    verifiedAt: new Date().toISOString(),
    network,
    apiKeyPresent: Boolean(process.env.MANTLE_EXPLORER_API_KEY),
    warnings: env.warnings,
    contracts: {},
  };

  for (const row of results) {
    verification.contracts[row.contractName] = {
      address: row.address,
      status: row.status,
      explorerUrl: row.explorerUrl,
      error: row.error,
      command: row.command || null,
      onChainVerified: row.onChain?.verified ?? null,
    };
  }

  artifact.verification = verification;
  const artifactPath = writeDeploymentArtifact(root, network, artifact);

  const failed = results.filter((r) => r.status === "failed");
  const allOk = failed.length === 0;

  return {
    projectDir: root,
    network,
    artifact,
    artifactPath,
    verification,
    results,
    ok: allOk,
    warnings: env.warnings,
  };
}

module.exports = {
  validateVerifyEnv,
  buildVerifyArgs,
  parseVerifyOutcome,
  fetchExplorerVerification,
  verifyOneContract,
  verifyDeployment,
  browserUrlFor,
  sleep,
  DEFAULT_NETWORK,
};
