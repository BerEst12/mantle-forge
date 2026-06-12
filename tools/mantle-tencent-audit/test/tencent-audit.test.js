"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { buildAuditPrompt, parseHunyuanResponse } = require("../lib/prompt");
const { renderMarkdown } = require("../lib/report");
const { resolveProvider, defaultModelFor, providerInfo } = require("../lib/providers");

const MOCK_SOURCES = [
  {
    relPath: "contracts/TokenVault.sol",
    src: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
contract TokenVault {
    mapping(address => uint256) public balances;
    function deposit(uint256 amount) external { balances[msg.sender] += amount; }
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient");
        balances[msg.sender] -= amount;
    }
}`,
    contracts: [],
  },
];

const MOCK_AUDIT_RESULT = {
  summary: "The TokenVault contract has no reentrancy guard on withdraw.",
  mantle_specific: "No cross-layer risks detected. Gas costs are within Mantle norms.",
  risk_level: "High",
  findings: [
    {
      id: "TC-001",
      severity: "High",
      title: "Missing reentrancy guard on withdraw",
      category: "Reentrancy",
      location: "TokenVault.sol:withdraw",
      description: "The withdraw function updates state after external interaction.",
      impact: "Attacker could drain funds via reentrancy.",
      recommendation: "Add ReentrancyGuard or use checks-effects-interactions pattern.",
      evidence: "balances[msg.sender] -= amount;",
    },
  ],
  positive_patterns: ["Uses uint256 for balances"],
  agent_tasks: ["Verify reentrancy protection is applied"],
};

describe("prompt builder", () => {
  it("builds system and user prompts", () => {
    const { systemPrompt, userPrompt } = buildAuditPrompt(MOCK_SOURCES);
    assert.ok(systemPrompt.includes("Mantle"));
    assert.ok(userPrompt.includes("TokenVault.sol"));
    assert.ok(userPrompt.includes("JSON"));
  });
});

describe("parseHunyuanResponse", () => {
  it("parses valid JSON response", () => {
    const raw = JSON.stringify(MOCK_AUDIT_RESULT);
    const result = parseHunyuanResponse(raw);
    assert.equal(result.risk_level, "High");
    assert.equal(result.findings.length, 1);
  });

  it("parses JSON wrapped in markdown", () => {
    const raw = `Here is the audit:\n\`\`\`json\n${JSON.stringify(MOCK_AUDIT_RESULT)}\n\`\`\``;
    const result = parseHunyuanResponse(raw);
    assert.equal(result.findings[0].id, "TC-001");
  });

  it("throws on missing JSON", () => {
    assert.throws(() => parseHunyuanResponse("No JSON here"), /valid JSON/);
  });
});

describe("renderMarkdown", () => {
  it("includes all key sections", () => {
    const md = renderMarkdown(MOCK_AUDIT_RESULT, { model: "hunyuan-pro" });
    assert.ok(md.includes("Tencent Cloud Hunyuan"));
    assert.ok(md.includes("TC-001"));
    assert.ok(md.includes("High"));
    assert.ok(md.includes("Mantle L2 assessment"));
    assert.ok(md.includes("hunyuan-pro"));
  });

  it("uses the provider label and url when supplied (OpenRouter run)", () => {
    const md = renderMarkdown(MOCK_AUDIT_RESULT, {
      model: "tencent/hunyuan-a13b-instruct",
      providerLabel: "OpenRouter",
      providerUrl: "https://openrouter.ai",
    });
    assert.ok(md.includes("# OpenRouter — Deep Security Audit"));
    assert.ok(md.includes("(https://openrouter.ai)"));
    assert.ok(md.includes("tencent/hunyuan-a13b-instruct"));
    assert.ok(!md.includes("Tencent Cloud Hunyuan"));
  });
});

describe("provider resolution", () => {
  const ENV_KEYS = ["MANTLE_AUDIT_PROVIDER", "TENCENT_HUNYUAN_API_KEY", "OPENROUTER_API_KEY"];

  function withCleanEnv(fn) {
    const saved = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]));
    for (const k of ENV_KEYS) delete process.env[k];
    try {
      fn();
    } finally {
      for (const k of ENV_KEYS) {
        if (saved[k] === undefined) delete process.env[k];
        else process.env[k] = saved[k];
      }
    }
  }

  it("explicit option wins over env keys", () => {
    withCleanEnv(() => {
      process.env.TENCENT_HUNYUAN_API_KEY = "x";
      assert.equal(resolveProvider({ provider: "openrouter" }), "openrouter");
    });
  });

  it("auto-detects openrouter when only OPENROUTER_API_KEY is set", () => {
    withCleanEnv(() => {
      process.env.OPENROUTER_API_KEY = "sk-or-test";
      assert.equal(resolveProvider(), "openrouter");
    });
  });

  it("prefers hunyuan when its key is present", () => {
    withCleanEnv(() => {
      process.env.TENCENT_HUNYUAN_API_KEY = "x";
      process.env.OPENROUTER_API_KEY = "y";
      assert.equal(resolveProvider(), "hunyuan");
    });
  });

  it("defaults to hunyuan when no key is set", () => {
    withCleanEnv(() => {
      assert.equal(resolveProvider(), "hunyuan");
    });
  });

  it("throws on an unknown provider", () => {
    assert.throws(() => resolveProvider({ provider: "bogus" }), /Unknown provider/);
  });

  it("exposes a default model per provider", () => {
    assert.equal(defaultModelFor("hunyuan"), "hunyuan-pro");
    assert.ok(defaultModelFor("openrouter").includes("/"));
    assert.equal(providerInfo("openrouter").envKey, "OPENROUTER_API_KEY");
  });
});
