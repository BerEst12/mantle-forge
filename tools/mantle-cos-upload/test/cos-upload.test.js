"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { collectArtifacts } = require("../lib/artifacts");
const { renderUploadSummary } = require("../lib/cos-upload");

function makeTmpProject(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mantle-cos-test-"));
  for (const [rel, content] of Object.entries(files)) {
    const full = path.join(dir, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content, "utf8");
  }
  return dir;
}

describe("collectArtifacts", () => {
  it("collects FINAL_REPORT.md and optional artifacts", () => {
    const dir = makeTmpProject({
      "FINAL_REPORT.md": "# Final Report",
      "reports/security.md": "# Security",
      "reports/gas.md": "# Gas",
    });

    const { found, missing } = collectArtifacts(dir);
    assert.ok(found.some((f) => f.rel === "FINAL_REPORT.md"));
    assert.ok(found.some((f) => f.rel === "reports/security.md"));
    assert.ok(missing.includes("reports/tencent-audit.md"));

    fs.rmSync(dir, { recursive: true });
  });

  it("throws when FINAL_REPORT.md is missing", () => {
    const dir = makeTmpProject({ "reports/gas.md": "# Gas" });
    assert.throws(() => collectArtifacts(dir), /FINAL_REPORT\.md/);
    fs.rmSync(dir, { recursive: true });
  });
});

describe("renderUploadSummary", () => {
  it("renders markdown with URLs and run ID", () => {
    const result = {
      runId: "run-2026-06-11",
      prefix: "mantle-forge/run-2026-06-11",
      bucket: "my-bucket",
      region: "ap-singapore",
      indexUrl: "https://my-bucket.cos.ap-singapore.myqcloud.com/mantle-forge/run-2026-06-11/FINAL_REPORT.md",
      uploaded: [
        { rel: "FINAL_REPORT.md", url: "https://my-bucket.cos.ap-singapore.myqcloud.com/mantle-forge/run-2026-06-11/FINAL_REPORT.md" },
        { rel: "reports/security.md", url: "https://my-bucket.cos.ap-singapore.myqcloud.com/mantle-forge/run-2026-06-11/reports/security.md" },
      ],
      missing: ["reports/tencent-audit.md"],
    };

    const md = renderUploadSummary(result);
    assert.ok(md.includes("run-2026-06-11"));
    assert.ok(md.includes("FINAL_REPORT.md"));
    assert.ok(md.includes("Tencent Cloud COS"));
    assert.ok(md.includes("tencent-audit.md"));
  });
});
