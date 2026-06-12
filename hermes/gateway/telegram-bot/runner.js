"use strict";

const { spawn } = require("child_process");
const path = require("path");
const os = require("os");
const fs = require("fs");

// Root of the monorepo (three levels up from this file)
const FORGE_ROOT = path.resolve(__dirname, "..", "..", "..");

function runCli(bin, args, cwd, env, onLine) {
  return new Promise((resolve, reject) => {
    const proc = spawn("node", [bin, ...args], {
      cwd,
      env: { ...process.env, ...env },
      stdio: ["ignore", "pipe", "pipe"],
    });

    const lines = [];

    const collect = (chunk) => {
      const text = chunk.toString();
      text.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (trimmed) {
          lines.push(trimmed);
          if (onLine) onLine(trimmed);
        }
      });
    };

    proc.stdout.on("data", collect);
    proc.stderr.on("data", collect);

    proc.on("close", (code) => {
      if (code === 0) {
        resolve(lines.join("\n"));
      } else {
        reject(new Error(lines.join("\n") || `Process exited with code ${code}`));
      }
    });

    proc.on("error", reject);
  });
}

/**
 * Runs the full Mantle Forge pipeline for a contract name.
 *
 * @param {string} contractName  e.g. "MyVault"
 * @param {{ onStep: (step: string, msg: string) => void, dryRun?: boolean }} opts
 * @returns {Promise<{ report: string, projectDir: string }>}
 */
async function runPipeline(contractName, { onStep, dryRun = true } = {}) {
  const safe = contractName.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 32);
  const projectDir = path.join(os.tmpdir(), `forge-${safe}-${Date.now()}`);

  const tools = (name) =>
    path.join(FORGE_ROOT, "tools", name, "cli.js");

  const deployEnv = {
    MANTLE_SEPOLIA_RPC_URL: process.env.MANTLE_SEPOLIA_RPC_URL || "",
    MANTLE_PRIVATE_KEY: process.env.MANTLE_PRIVATE_KEY || "",
  };

  // 1. Scaffold
  onStep("scaffold", `Creating project in ${projectDir} …`);
  await runCli(tools("mantle-scaffold"), ["token-vault", projectDir], FORGE_ROOT, {}, onStep.bind(null, "scaffold"));

  // 2. Check
  onStep("check", "Validating Mantle-ready project …");
  await runCli(tools("mantle-check"), [projectDir], FORGE_ROOT, {}, onStep.bind(null, "check"));

  // 3. Security audit
  onStep("audit", "Running agent-assisted security review …");
  await runCli(tools("mantle-audit"), [projectDir], FORGE_ROOT, {}, onStep.bind(null, "audit"));

  // 4. Gas report
  onStep("gas", "Analysing gas usage …");
  const gasOut = path.join(projectDir, "reports", "gas.md");
  await runCli(tools("mantle-gas-report"), [projectDir, "--out", gasOut], FORGE_ROOT, {}, onStep.bind(null, "gas"));

  // 5. Deploy (dry-run by default; real deploy when keys are set)
  const deployArgs = [projectDir, "--network", "mantleSepolia"];
  if (dryRun) deployArgs.push("--dry-run");
  onStep("deploy", dryRun ? "Simulating deploy (dry-run) …" : "Deploying to Mantle Sepolia …");
  await runCli(tools("mantle-deploy"), deployArgs, FORGE_ROOT, deployEnv, onStep.bind(null, "deploy")).catch((err) => {
    onStep("deploy", `Note: ${err.message.split("\n")[0]}`);
  });

  // 6. Final report
  onStep("report", "Generating FINAL_REPORT.md …");
  const reportOut = path.join(projectDir, "FINAL_REPORT.md");
  await runCli(
    tools("mantle-report"),
    [projectDir, "--out", reportOut],
    FORGE_ROOT,
    {},
    onStep.bind(null, "report")
  );

  const report = fs.existsSync(reportOut)
    ? fs.readFileSync(reportOut, "utf8")
    : "Report generation completed — see project dir for artifacts.";

  return { report, projectDir };
}

module.exports = { runPipeline };
