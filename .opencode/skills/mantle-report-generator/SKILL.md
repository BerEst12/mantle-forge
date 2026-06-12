---
name: mantle-report-generator
description: Collect test, gas, security, and deploy outputs into FINAL_REPORT.md.
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [mantle, report, documentation]
    category: mantle-forge
    requires_toolsets: [terminal]
---

# Mantle Report Generator

## When to Use

- End of flagship workflow
- User asks for engineering report or FINAL_REPORT
- After deploy (or after failed deploy with partial artifacts)

## Inputs

| Input | Required |
|-------|----------|
| Project directory | Yes |
| Prior artifacts | `reports/security.md`, `reports/gas.md`, deployment JSON, test logs |

## Procedure

1. **Run CLI:** `npx mantle-report <project-dir> --out FINAL_REPORT.md`
2. **If gas/security/deploy artifacts already exist, keep them as the source of truth** and merge those outputs rather than restating them from memory.
3. **Honor the caller’s `--out` path exactly** and verify the file exists after the command completes.
2. **Fallback:** Assemble markdown manually from artifacts
3. Before generating the report, make sure test output is captured if you want a populated test section (for example: `npx hardhat test | tee reports/test-summary.md`).
4. Include the following sections:
   - Project name and file tree summary
   - Contract summary
   - Test results
   - Gas report highlights
   - Security findings and fixes
   - Deployment details (network, address, tx, explorer link)
   - Next improvements
   - Execution log reference

## Expected output

- `FINAL_REPORT.md` at project root (or path user specified)
- Optional short summary for chat/Discord

## Verification

- All available sections populated; missing sections noted explicitly (e.g. deploy skipped)

## Pitfalls

- Do not invent tx hashes or addresses — only cite captured evidence
- Label security section as agent-assisted review, not audit
