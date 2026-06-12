"use strict";

require("./setup-fixtures");

const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const test = require("node:test");
const { buildReport, writeReport } = require("../lib/report");
const { FIXTURES } = require("./setup-fixtures");

test("buildReport merges fixture artifacts", () => {
  const report = buildReport(FIXTURES);
  assert.match(report.markdown, /FINAL_REPORT/);
  assert.match(report.markdown, /Agent-assisted review complete/);
  assert.match(report.markdown, /0xabc/);
  assert.deepEqual(report.missing, []);
});

test("writeReport writes markdown file", () => {
  const out = path.join(os.tmpdir(), `mantle-report-${Date.now()}.md`);
  const result = writeReport(FIXTURES, out);
  assert.equal(result.outPath, out);
  assert.ok(fs.existsSync(out));
  assert.match(fs.readFileSync(out, "utf8"), /Deposit gas noted/);
});
