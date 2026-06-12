---
name: mantle-gas-analysis
description: Run gas analysis and suggest safe optimizations with before/after notes in reports/gas.md.
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [mantle, gas, optimization]
    category: mantle-forge
    requires_toolsets: [terminal]
---

# Mantle Gas Analysis

## When to Use

- After security review or when user asks to optimize gas
- Before final deploy in flagship workflow
- Comparing contract versions

## Inputs

| Input | Required |
|-------|----------|
| Project directory | Yes |

## Procedure

1. Ensure project compiles: `npx hardhat compile`
2. **Run CLI:** `npx mantle-gas-report <project-dir> --out reports/gas.md`
3. **Fallback:** Enable Hardhat gas reporter or run tests with gas output:
   ```bash
   REPORT_GAS=true npx hardhat test
   ```
4. Identify top gas consumers (deploy + key user functions)
5. Suggest **safe** optimizations (storage packing, `calldata`, immutable, custom errors) — skip risky micro-opts
6. Apply approved changes; capture before/after in report
7. Rerun tests

## Expected output

- `reports/gas.md` with function-level highlights and optimization notes
- Optional code changes with measured or estimated delta

## Verification

- Report exists
- Tests pass after any optimization patches

## Pitfalls

- Premature optimization that hurts readability or security — document tradeoffs
- Mantle L2 gas differs from L1; focus on relative improvements within the project
