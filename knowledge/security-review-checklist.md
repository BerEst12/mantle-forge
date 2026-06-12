# Security review checklist (agent-assisted)

Use with **`npx mantle-harden`** and Hermes `/mantle-security-review`.

**Not a professional audit.** Automated engines produce signals; the agent verifies and extends them.

## Toolchain setup (mandatory)

```bash
npx mantle-harden --setup ./my-project
npx mantle-harden ./my-project
```

See `knowledge/hardening-toolchain.md`.

## Engines in full gate

- [ ] **Slither** — static detectors
- [ ] **Mythril** — symbolic execution
- [ ] **Foundry** — fuzz + invariants (`forge-test/`)
- [ ] **Hardhat** — integration invariants (`test/*.invariants.ts`)
- [ ] **mantle-audit** — heuristic triage (not primary)
- [ ] **Agent** — business logic + threat model

## Agent must verify

- [ ] `reports/harden.json` — all steps `ok: true`
- [ ] Read every `.sol` file in scope
- [ ] Triage Slither + Mythril + static findings
- [ ] Document threat model and economic invariants
- [ ] Add at least one agent-sourced finding or confirmed invariant note

## Access control

- [ ] Sensitive functions restricted
- [ ] No `tx.origin` authorization

## Reentrancy and external calls

- [ ] CEI ordering; `nonReentrant` where needed
- [ ] SafeERC20 patterns

## Token handling

- [ ] Balance deltas on deposit/withdraw
- [ ] Fee-on-transfer / rebasing rejected or supported explicitly

## Reporting

- Fields: Severity, Location, Evidence, Recommendation, Status, **Source**
- Label **agent-assisted security review**
