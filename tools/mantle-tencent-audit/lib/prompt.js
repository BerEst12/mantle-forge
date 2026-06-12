"use strict";

function buildAuditPrompt(sources) {
  const contractBlocks = sources
    .map((s) => `// File: ${s.relPath}\n${s.src}`)
    .join("\n\n---\n\n");

  const systemPrompt = `You are a senior smart contract security auditor specializing in Solidity contracts deployed on Mantle (an Ethereum L2 using optimistic rollups). You have deep expertise in EVM security patterns, DeFi attack vectors, and Mantle-specific considerations.

Your task: perform a thorough security audit of the provided Solidity contracts and return findings in the exact JSON format specified.

Mantle-specific considerations to evaluate:
- Cross-layer message risks (L1↔L2)
- MNT token handling (native gas token)
- Mantle sequencer trust assumptions
- Gas cost differences vs Ethereum mainnet
- Compatibility with Mantle's EVM equivalence

Return ONLY valid JSON — no markdown, no explanation outside the JSON.`;

  const userPrompt = `Audit the following Solidity contracts and return a JSON object with this exact structure:

{
  "summary": "2-3 sentence executive summary of the overall security posture",
  "mantle_specific": "1-2 sentence note on Mantle L2 specific risks observed",
  "risk_level": "Critical | High | Medium | Low",
  "findings": [
    {
      "id": "TC-001",
      "severity": "Critical | High | Medium | Low | Informational",
      "title": "Short descriptive title",
      "category": "Reentrancy | Access Control | Arithmetic | Logic | Gas | Mantle-Specific | Informational",
      "location": "ContractName.sol:functionName or ContractName.sol:lineNumber",
      "description": "Detailed technical description of the vulnerability",
      "impact": "What an attacker could do or what could go wrong",
      "recommendation": "Specific code-level fix recommendation",
      "evidence": "Relevant code snippet (max 5 lines)"
    }
  ],
  "positive_patterns": ["List of good security patterns found"],
  "agent_tasks": ["Actionable verification task for the developer"]
}

Contracts to audit:

${contractBlocks}`;

  return { systemPrompt, userPrompt };
}

function parseHunyuanResponse(content) {
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Hunyuan response did not contain valid JSON");

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    throw new Error(`Failed to parse Hunyuan JSON response: ${e.message}`);
  }
}

module.exports = { buildAuditPrompt, parseHunyuanResponse };
