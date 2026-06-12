#!/usr/bin/env node
"use strict";

const path = require("path");
const { parseArgs, fail } = require("@mantle-forge/cli-utils");
const { writeTencentAuditOutputs } = require("./lib/tencent-audit");
const { resolveProvider, providerInfo, defaultModelFor } = require("./lib/providers");

function printHelp() {
  console.log(`Usage: mantle-tencent-audit <project-dir> [options]

AI-powered deep security audit for Solidity contracts on Mantle.
Goes beyond static heuristics — runs the contracts through a frontier LLM.

Providers (pick one — auto-detected from whichever API key is set):
  hunyuan      Tencent Cloud Hunyuan, called directly.
               Key: TENCENT_HUNYUAN_API_KEY  (console.cloud.tencent.com/hunyuan)
  openrouter   OpenRouter unified gateway — 500+ models incl. Tencent's Hunyuan.
               Key: OPENROUTER_API_KEY       (openrouter.ai/keys)

Options:
  --provider <name>   hunyuan | openrouter (default: auto-detect from env keys)
  --out, -o <path>    Markdown report (default: <project>/reports/tencent-audit.md)
  --json <path>       Structured JSON findings
  --model <model>     Model id. Defaults: hunyuan-pro (hunyuan),
                      tencent/hunyuan-a13b-instruct (openrouter).
                      Verify OpenRouter slugs at openrouter.ai/models.
  --help, -h          Show help

Examples:
  # Tencent Cloud direct (default when TENCENT_HUNYUAN_API_KEY is set)
  mantle-tencent-audit ./my-vault --out reports/tencent-audit.md --json reports/tencent-audit.json

  # OpenRouter — one key, access to Tencent + many other models
  OPENROUTER_API_KEY=sk-or-... mantle-tencent-audit ./my-vault --provider openrouter
  mantle-tencent-audit ./my-vault --provider openrouter --model deepseek/deepseek-chat
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

  const resolved = path.resolve(projectDir);
  const outPath = flags.out || flags.o || path.join(resolved, "reports", "tencent-audit.md");

  let provider;
  try {
    provider = resolveProvider({ provider: flags.provider });
  } catch (err) {
    return fail(err.message);
  }
  const { label: providerLabel } = providerInfo(provider);
  const model = flags.model || defaultModelFor(provider);

  console.log(`Mantle Deep Audit — AI security review`);
  console.log(`Project: ${resolved}`);
  console.log(`Provider: ${providerLabel} (${provider})`);
  console.log(`Model: ${model}`);
  console.log(`Calling ${providerLabel} API...\n`);

  try {
    const result = await writeTencentAuditOutputs(projectDir, {
      outPath,
      jsonPath: flags.json,
      provider,
      model,
    });

    const { findings = [] } = result.auditResult;
    console.log(`Security report written: ${result.outPath}`);
    if (result.jsonPath) console.log(`JSON findings written: ${result.jsonPath}`);
    console.log(`Risk level: ${result.auditResult.risk_level}`);
    console.log(`Findings: ${findings.length} (Hunyuan deep analysis)`);

    const critical = findings.filter((f) => f.severity === "Critical").length;
    const high = findings.filter((f) => f.severity === "High").length;
    if (critical > 0) console.log(`  ⚠  Critical: ${critical}`);
    if (high > 0) console.log(`  ⚠  High: ${high}`);

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
