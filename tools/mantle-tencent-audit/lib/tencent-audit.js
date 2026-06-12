"use strict";

const fs = require("fs");
const path = require("path");
const { listSolidityFiles, readProjectSources } = require("../../mantle-audit/lib/solidity");
const { callChat, resolveProvider, providerInfo, defaultModelFor } = require("./providers");
const { buildAuditPrompt, parseHunyuanResponse } = require("./prompt");
const { renderMarkdown, renderJson } = require("./report");

async function runTencentAudit(projectDir, options = {}) {
  const root = path.resolve(projectDir);
  if (!fs.existsSync(root)) throw new Error(`Project directory not found: ${root}`);

  const files = listSolidityFiles(root);
  if (!files.length) throw new Error("No Solidity files found under contracts/");

  const sources = readProjectSources(root);
  const provider = resolveProvider(options);
  const { label: providerLabel, url: providerUrl } = providerInfo(provider);
  const model = options.model || defaultModelFor(provider);

  const { systemPrompt, userPrompt } = buildAuditPrompt(sources);

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const rawContent = await callChat(messages, {
    apiKey: options.apiKey,
    provider,
    model,
  });

  const auditResult = parseHunyuanResponse(rawContent);
  const markdown = renderMarkdown(auditResult, { model, providerLabel, providerUrl });

  return {
    auditResult,
    markdown,
    provider,
    providerLabel,
    model,
    projectDir: root,
    scope: files.map((f) => path.relative(root, f)),
  };
}

async function writeTencentAuditOutputs(projectDir, options = {}) {
  const result = await runTencentAudit(projectDir, options);

  const outPath = path.resolve(
    options.outPath || path.join(result.projectDir, "reports", "tencent-audit.md")
  );
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, result.markdown, "utf8");

  const written = { outPath };

  if (options.jsonPath) {
    const jsonPath = path.resolve(options.jsonPath);
    fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
    fs.writeFileSync(jsonPath, renderJson(result.auditResult), "utf8");
    written.jsonPath = jsonPath;
  }

  return { ...result, ...written };
}

module.exports = { runTencentAudit, writeTencentAuditOutputs };
