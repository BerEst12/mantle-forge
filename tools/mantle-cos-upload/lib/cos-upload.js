"use strict";

const fs = require("fs");
const path = require("path");
const { collectArtifacts } = require("./artifacts");
const { uploadToCos } = require("./cos-client");

async function uploadArtifacts(projectDir, options = {}) {
  const bucket = options.bucket || process.env.TENCENT_COS_BUCKET;
  const region = options.region || process.env.TENCENT_COS_REGION || "ap-singapore";
  if (!bucket) throw new Error("COS bucket not set. Use --bucket or TENCENT_COS_BUCKET env var.");

  const { found, missing } = collectArtifacts(projectDir);

  const runId = options.runId || `run-${new Date().toISOString().slice(0, 19).replace(/[T:]/g, "-")}`;
  const prefix = options.prefix ? `${options.prefix}/${runId}` : `mantle-forge/${runId}`;
  const acl = options.public !== false ? "public-read" : undefined;

  const uploaded = [];

  for (const artifact of found) {
    const cosKey = `${prefix}/${artifact.rel}`;
    const buffer = fs.readFileSync(artifact.fullPath);

    process.stdout.write(`  Uploading ${artifact.rel}...`);
    const result = await uploadToCos(buffer, {
      bucket,
      region,
      cosKey,
      contentType: artifact.contentType,
      acl,
      secretId: options.secretId,
      secretKey: options.secretKey,
    });

    uploaded.push({ rel: artifact.rel, url: result.url, cosKey });
    process.stdout.write(` done\n`);
  }

  const indexUrl = uploaded.find((u) => u.rel === "FINAL_REPORT.md")?.url;

  return { uploaded, missing, runId, prefix, bucket, region, indexUrl };
}

function renderUploadSummary(result) {
  const { uploaded, missing, runId, indexUrl } = result;
  const lines = [
    "# COS Upload Summary",
    "",
    `**Run ID:** \`${runId}\``,
    `**Primary URL:** ${indexUrl || "_not found_"}`,
    "",
    "## Uploaded artifacts",
    "",
    "| File | URL |",
    "|------|-----|",
    ...uploaded.map((u) => `| \`${u.rel}\` | ${u.url} |`),
  ];

  if (missing.length) {
    lines.push("", "## Skipped (not found)", "");
    for (const m of missing) lines.push(`- \`${m}\``);
  }

  lines.push("", "_Artifacts stored on Tencent Cloud COS — publicly accessible for independent verification._", "");
  return lines.join("\n");
}

module.exports = { uploadArtifacts, renderUploadSummary };
