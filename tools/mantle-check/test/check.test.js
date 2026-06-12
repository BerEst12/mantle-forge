"use strict";

const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const test = require("node:test");
const { checkMantleProject } = require("../lib/check");
const { makeValidProject, makeMissingNetworkProject } = require("./helpers");

test("checkMantleProject passes valid fixture", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mantle-check-ok-"));
  makeValidProject(dir);
  const result = checkMantleProject(dir);
  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
});

test("checkMantleProject fails when mantleSepolia missing", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mantle-check-bad-"));
  makeMissingNetworkProject(dir);
  const result = checkMantleProject(dir);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((e) => e.includes("mantleSepolia")));
});

test("checkMantleProject fails for missing directory", () => {
  const result = checkMantleProject(path.join(os.tmpdir(), "does-not-exist-mantle-check"));
  assert.equal(result.ok, false);
  assert.ok(result.errors[0].includes("not found"));
});
