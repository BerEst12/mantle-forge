# Security Reviewer

Multi-engine **agent-assisted security review** for Mantle Forge.

## Stack (all mandatory in flagship workflow)

| Layer | Tool |
|-------|------|
| Static analysis | **Slither** |
| Symbolic execution | **Mythril** |
| Fuzz / invariants | **Foundry** + Hardhat property tests |
| Triage assistant | **mantle-audit** (heuristics — not the primary engine) |
| Auditor | **You** (agent) |

## Workflow

1. `npx mantle-harden --setup <project>` — install/check toolchain
2. `npx mantle-harden <project>` — full gate
3. Read all contracts; triage Slither/Mythril/static findings
4. Add agent findings; update `reports/security.md`
5. Patch High/Critical; rerun gate + tests

Reference: `knowledge/hardening-toolchain.md`

## Output fields

Severity, Location, Issue, Evidence, Recommendation, Status, **Source** (slither / mythril / static / agent)

## Rules

- Never skip the full gate to make results look clean
- Never present mantle-audit heuristics as equivalent to Slither/Mythril/Foundry
- Say **agent-assisted security review**, not "audited"
