#!/usr/bin/env node
"use strict";

const path = require("path");
const fs = require("fs");
const { parseArgs, fail } = require("@mantle-forge/cli-utils");
const { uploadArtifacts, renderUploadSummary } = require("./lib/cos-upload");

function printHelp() {
  console.log(`Usage: mantle-cos-upload <project-dir> [options]

Upload Mantle Forge pipeline artifacts to Tencent Cloud COS.
Uploads: FINAL_REPORT.md, reports/security.md, reports/tencent-audit.md,
         reports/gas.md, deployments/mantleSepolia.json

Required env vars:
  TENCENT_COS_SECRET_ID    Tencent Cloud SecretId
  TENCENT_COS_SECRET_KEY   Tencent Cloud SecretKey
  TENCENT_COS_BUCKET       COS bucket name (e.g. mantle-forge-artifacts-1234567890)

Options:
  --bucket <name>     COS bucket (overrides env)
  --region <region>   COS region (default: ap-singapore)
  --prefix <path>     Key prefix inside bucket (default: mantle-forge)
  --run-id <id>       Custom run identifier (default: timestamp)
  --out <path>        Write upload summary markdown to file
  --private           Upload without public-read ACL
  --help, -h          Show help

Example:
  mantle-cos-upload ./my-vault
  mantle-cos-upload ./my-vault --bucket my-bucket-1234 --out reports/cos-upload.md
`);
}

async function main(argv) {
  const { positional, flags } = parseArgs(argv);

  if (flags.help || flags.h) {
    printHelp();
    return 0;
  }

  const [projectDir] = positional;
  if (!projectDir) {
    printHelp();
    return fail("Missing required argument: <project-dir>");
  }

  console.log("Mantle COS Upload — Tencent Cloud Object Storage");
  console.log(`Project: ${path.resolve(projectDir)}`);

  try {
    const result = await uploadArtifacts(projectDir, {
      bucket: flags.bucket,
      region: flags.region,
      prefix: flags.prefix,
      runId: flags["run-id"],
      public: flags.private ? false : true,
    });

    console.log(`\nUploaded ${result.uploaded.length} artifact(s) to COS`);
    console.log(`Bucket: ${result.bucket} (${result.region})`);
    console.log(`Run prefix: ${result.prefix}`);
    if (result.indexUrl) console.log(`\nFINAL_REPORT.md URL:\n  ${result.indexUrl}`);
    if (result.missing.length) {
      console.log(`Skipped (not found): ${result.missing.join(", ")}`);
    }

    if (flags.out) {
      const outPath = path.resolve(String(flags.out));
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, renderUploadSummary(result), "utf8");
      console.log(`Upload summary written: ${outPath}`);
    }

    return 0;
  } catch (err) {
    return fail(err.message);
  }
}

if (require.main === module) {
  main(process.argv.slice(2)).then(process.exit).catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}

module.exports = { main };
