"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { formatWei, formatTime, buildUrl, EXPLORER_URLS } = require("../lib/scan");

test("formatWei converts 1 ETH wei to readable string", () => {
  assert.equal(formatWei("1000000000000000000"), "1.0000 MNT");
});

test("formatWei handles zero value", () => {
  assert.equal(formatWei("0"), "0.0000 MNT");
});

test("formatWei uses custom symbol", () => {
  assert.ok(formatWei("500000000000000000", 18, "USDC").includes("USDC"));
});

test("formatTime converts unix timestamp to ISO string", () => {
  const result = formatTime("0");
  assert.ok(result.includes("1970"));
  assert.ok(result.includes("UTC"));
});

test("formatTime handles invalid input gracefully", () => {
  const result = formatTime("not-a-number");
  assert.ok(typeof result === "string");
});

test("buildUrl builds correct mainnet URL with module and action", () => {
  const url = buildUrl("mainnet", { module: "transaction", action: "gettxinfo", txhash: "0xabc" });
  assert.ok(url.startsWith(EXPLORER_URLS.mainnet));
  assert.ok(url.includes("module=transaction"));
  assert.ok(url.includes("action=gettxinfo"));
  assert.ok(url.includes("txhash=0xabc"));
});

test("buildUrl builds correct sepolia URL", () => {
  const url = buildUrl("sepolia", { module: "account", action: "txlist" });
  assert.ok(url.startsWith(EXPLORER_URLS.sepolia));
});

test("buildUrl includes apikey when MANTLE_EXPLORER_API_KEY is set", () => {
  const orig = process.env.MANTLE_EXPLORER_API_KEY;
  process.env.MANTLE_EXPLORER_API_KEY = "test-key-123";
  const url = buildUrl("mainnet", { module: "contract", action: "getabi" });
  process.env.MANTLE_EXPLORER_API_KEY = orig || "";
  assert.ok(url.includes("apikey=test-key-123"));
});

test("buildUrl omits apikey when env var is not set", () => {
  const orig = process.env.MANTLE_EXPLORER_API_KEY;
  delete process.env.MANTLE_EXPLORER_API_KEY;
  const url = buildUrl("mainnet", { module: "contract", action: "getabi" });
  process.env.MANTLE_EXPLORER_API_KEY = orig || "";
  assert.ok(!url.includes("apikey="));
});
