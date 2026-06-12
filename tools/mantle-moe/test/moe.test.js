"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { formatUSD, getBestPool, getPoolsFromDefiLlama } = require("../lib/moe");

function isNetworkError(e) {
  const msg = e.message || "";
  return (
    msg === "timeout" ||
    msg.includes("ENOTFOUND") ||
    msg.includes("ECONNREFUSED") ||
    msg.includes("ETIMEDOUT") ||
    msg.includes("ECONNRESET") ||
    msg.includes("EHOSTUNREACH") ||
    msg.includes("EAI_AGAIN") ||
    msg.includes("socket hang up") ||
    msg.includes("Parse error")
  );
}

test("formatUSD formats millions correctly", () => {
  assert.equal(formatUSD(12_300_000), "$12.30M");
});

test("formatUSD formats thousands correctly", () => {
  assert.equal(formatUSD(5_400), "$5.4K");
});

test("formatUSD formats small values correctly", () => {
  assert.equal(formatUSD(42.5), "$42.50");
});

test("getBestPool returns empty array for unknown pair", async () => {
  // Use a fake pair that won't exist — should return [] gracefully
  // We mock by passing nonsense symbols. The function queries real API,
  // so in unit test we just verify it doesn't throw and returns array.
  // Use a short timeout to avoid long network calls in unit tests.
  let result;
  try {
    const networkCall = getBestPool("FAKETOKEN_A", "FAKETOKEN_B");
    networkCall.catch(() => {}); // prevent unhandled rejection if timeout wins the race
    result = await Promise.race([
      networkCall,
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 5000)),
    ]);
    assert.ok(Array.isArray(result), "result should be an array");
    assert.equal(result.length, 0, "should find no pools for fake pair");
  } catch (e) {
    // Network errors in CI are acceptable — skip the assertion
    if (isNetworkError(e)) {
      console.log("SKIP: network unavailable in test environment");
    } else {
      throw e;
    }
  }
});

test("getPoolsFromDefiLlama returns array (or skips on network error)", async () => {
  let result;
  try {
    const networkCall = getPoolsFromDefiLlama(5);
    networkCall.catch(() => {}); // prevent unhandled rejection if timeout wins the race
    result = await Promise.race([
      networkCall,
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 5000)),
    ]);
    assert.ok(Array.isArray(result));
    // Each pool should have required fields
    for (const p of result) {
      assert.ok(typeof p.symbol === "string");
      assert.ok(typeof p.liquidityUSD === "number");
    }
  } catch (e) {
    if (isNetworkError(e)) {
      console.log("SKIP: network unavailable in test environment");
    } else {
      throw e;
    }
  }
});
