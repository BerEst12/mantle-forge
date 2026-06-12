"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const {
  validateVerifyEnv,
  buildVerifyArgs,
  parseVerifyOutcome,
  browserUrlFor,
} = require("../lib/verify");

test("validateVerifyEnv warns when explorer API key missing", () => {
  const saved = process.env.MANTLE_EXPLORER_API_KEY;
  delete process.env.MANTLE_EXPLORER_API_KEY;
  const { warnings, errors } = validateVerifyEnv();
  assert.equal(errors.length, 0);
  assert.ok(warnings.some((w) => w.includes("MANTLE_EXPLORER_API_KEY")));
  process.env.MANTLE_EXPLORER_API_KEY = saved;
});

test("buildVerifyArgs appends constructor args", () => {
  const args = buildVerifyArgs("mantleSepolia", "0xabc", ["0xdef", "1000"]);
  assert.deepEqual(args, ["hardhat", "verify", "--network", "mantleSepolia", "0xabc", "0xdef", "1000"]);
});

test("parseVerifyOutcome detects already verified", () => {
  const out = parseVerifyOutcome("The contract 0x... has already been verified on Etherscan.");
  assert.equal(out.status, "already_verified");
});

test("parseVerifyOutcome detects success", () => {
  const out = parseVerifyOutcome("Successfully verified contract TokenVault on Etherscan.");
  assert.equal(out.status, "verified");
});

test("parseVerifyOutcome marks unknown output as failed", () => {
  const out = parseVerifyOutcome("Error: Invalid API Key");
  assert.equal(out.status, "failed");
});

test("browserUrlFor points to Mantlescan code tab", () => {
  const url = browserUrlFor("mantleSepolia", "0x1234567890123456789012345678901234567890");
  assert.ok(url.includes("sepolia.mantlescan.xyz"));
  assert.ok(url.endsWith("#code"));
});
