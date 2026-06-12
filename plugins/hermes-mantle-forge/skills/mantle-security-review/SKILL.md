---
name: mantle-security-review
description: Multi-engine security review — Slither, Mythril, Foundry fuzz, agent triage.
version: 3.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [mantle, security, solidity]
    category: mantle-forge
    requires_toolsets: [terminal]
---

# Mantle Security Review

## When to Use

- After unit tests pass, **before** gas/deploy in flagship workflow
- User asks for security review, audit, or vulnerability check

## Inputs

| Input | Required |
|-------|----------|
| Project directory | Yes |
| `foundry.toml` + `forge-test/` | Yes (flagship template includes these) |
| `test/*.invariants.ts` | Yes |

## Procedure

1. Load `hermes/system-instructions/security-reviewer.md`
2. **Install toolchain (mandatory):**
   ```bash
   npx mantle-harden --setup <project-dir>
   ```
   Installs if missing: Slither, Mythril, solc-select, Foundry (`forge`).
   See `knowledge/hardening-toolchain.md`.
3. **Run full gate (mandatory):**
   ```bash
   npx mantle-harden <project-dir>
   ```
   Runs: Slither → Mythril → Foundry fuzz/invariants → Hardhat invariants → static triage.
   Outputs: `reports/harden.json`, `security.md`, `security.json`, `audit-brief.md`.
4. Read every `.sol` file; triage **Slither + Mythril + static** findings in `security.json`.
5. **Auditor pass:** add agent findings (logic, trust model, economics).
6. Merge into `reports/security.md` with Status + Source per finding.
7. Fix High/Critical; rerun steps 2–3; rerun `npx hardhat test`.

## Engines (what each proves)

| Engine | Evidence type |
|--------|----------------|
| Slither | Industry static detectors |
| Mythril | Symbolic execution paths |
| Foundry | Fuzz + invariant counterexamples |
| Hardhat invariants | Integration-level properties |
| mantle-audit | Heuristic triage for agent |
| Agent | Business logic + threat model |

## Verification

- `harden.json` → all steps `ok: true`
- Every automated finding triaged
- At least one agent-sourced note
- After fixes: full gate + tests pass

## Pitfalls

- Label **agent-assisted security review**, not professional audit
- Never use `--skip-slither` in demo/judging
- `mantle-audit` alone is **not** the review — always run `mantle-harden`
