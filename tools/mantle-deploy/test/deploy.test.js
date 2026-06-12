"use strict";

const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const test = require("node:test");
const {
  validateDeployEnv,
  findDeployScript,
  loadProjectEnv,
} = require("../lib/deploy");

test("validateDeployEnv requires RPC and private key", () => {
  const savedRpc = process.env.MANTLE_SEPOLIA_RPC_URL;
  const savedKey = process.env.MANTLE_PRIVATE_KEY;
  delete process.env.MANTLE_SEPOLIA_RPC_URL;
  delete process.env.MANTLE_PRIVATE_KEY;

  const errors = validateDeployEnv();
  assert.ok(errors.some((e) => e.includes("MANTLE_SEPOLIA_RPC_URL")));
  assert.ok(errors.some((e) => e.includes("MANTLE_PRIVATE_KEY")));

  process.env.MANTLE_SEPOLIA_RPC_URL = savedRpc;
  process.env.MANTLE_PRIVATE_KEY = savedKey;
});

test("validateDeployEnv dry-run skips private key", () => {
  const savedKey = process.env.MANTLE_PRIVATE_KEY;
  delete process.env.MANTLE_PRIVATE_KEY;
  process.env.MANTLE_SEPOLIA_RPC_URL = "https://rpc.sepolia.mantle.xyz";

  const errors = validateDeployEnv({ dryRun: true });
  assert.ok(!errors.some((e) => e.includes("MANTLE_PRIVATE_KEY")));

  process.env.MANTLE_PRIVATE_KEY = savedKey;
});

test("findDeployScript locates token-vault deploy script", () => {
  const templateDir = path.resolve(__dirname, "..", "..", "..", "templates", "token-vault");
  const script = findDeployScript(templateDir);
  assert.ok(script);
  assert.equal(path.basename(script), "deploy.ts");
  assert.equal(path.basename(path.dirname(script)), "scripts");
});

test("loadProjectEnv reads project .env", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mantle-deploy-env-"));
  fs.writeFileSync(
    path.join(dir, ".env"),
    "MANTLE_SEPOLIA_RPC_URL=https://example-rpc.test\n",
    "utf8"
  );
  const previous = process.env.MANTLE_SEPOLIA_RPC_URL;
  delete process.env.MANTLE_SEPOLIA_RPC_URL;
  loadProjectEnv(dir);
  assert.equal(process.env.MANTLE_SEPOLIA_RPC_URL, "https://example-rpc.test");
  process.env.MANTLE_SEPOLIA_RPC_URL = previous;
});
