# Workflow — Full Build, Harden, Deploy (flagship)

**Status:** Primary hackathon demo workflow  
**Reference:** flagship demo spec (see `README.md` → Flagship demo prompt)

## Trigger prompt

```txt
Create a Mantle Sepolia-ready token vault project from scratch.
Add tests, run a security review, optimize gas where possible,
deploy it to Mantle Sepolia, and generate an engineering report.
```

## System instructions

Load at workflow start:

- `hermes/system-instructions/mantle-dev-agent.md` (primary)
- `hermes/system-instructions/security-reviewer.md` (steps 7–8)
- `hermes/system-instructions/deployment-operator.md` (step 14)

## Prerequisites (hardening)

Before step 6, run **`npx mantle-harden --setup <project>`** — installs Slither/solc if missing. See `knowledge/slither-setup.md`.

Projects must include **invariant/fuzz tests** under `test/` (e.g. `*.invariants.ts`).

## Steps

| # | Step | Skill / tool |
|---|------|----------------|
| 1 | Interpret request; choose `token-vault` or `hardhat-mantle-starter` | — |
| 2 | Scaffold project | `/mantle-project-scaffold` → `mantle-scaffold` |
| 3 | Configure Hardhat for Mantle Sepolia | `/mantle-hardhat-config` → `mantle-check` |
| 4 | Generate or refine Solidity + tests (include invariant/fuzz suite) | dev agent |
| 5 | Run unit tests | `/mantle-test-runner` |
| 6 | **Setup + hardening gate (mandatory)** | `npx mantle-harden --setup` then `npx mantle-harden` |
| 7 | Agent security triage | `/mantle-security-review` |
| 8 | Apply safe hardening patches | security-reviewer role |
| 9 | Rerun hardening gate after High/Critical fixes | `mantle-harden` |
| 10 | Gas analysis | `/mantle-gas-analysis` → `mantle-gas-report` |
| 11 | Apply safe gas improvements | dev agent |
| 12 | Rerun tests + hardening gate | `mantle-test-runner` + `mantle-harden` |
| 13 | Deploy to Mantle Sepolia | `/mantle-deploy-sepolia` → `mantle-deploy` |
| 14 | Verify on Mantlescan | same skill → auto verify; retry `--verify-only` if needed |
| 15 | Generate final report | `/mantle-report-generator` → `mantle-report` |

## Hardening gate (`mantle-harden`)

**Not optional.** Full stack:

1. Toolchain setup (Slither, Mythril, Foundry, solc)
2. **Slither** — static analysis
3. **Mythril** — symbolic execution
4. **Foundry** — fuzz + invariants (`forge-test/`)
5. **Hardhat** — integration invariants (`test/*.invariants.ts`)
6. **Static triage** — mantle-audit heuristics for agent

```bash
npx mantle-harden --setup ./my-vault
npx mantle-harden ./my-vault
```

See `knowledge/hardening-toolchain.md`.

## Success criteria

| Check | Evidence |
|-------|----------|
| Project builds | `npx hardhat compile` exit 0 |
| Unit tests pass | Hardhat test output |
| **Slither + Mythril + Foundry** | `reports/harden.json` all engine steps ok |
| Security report | `reports/security.md` + agent triage notes |
| Gas report | `reports/gas.md` |
| On-chain deploy | Contract address + tx hash |
| Mantlescan verify | Source visible on explorer; `verification` in deployment JSON |
| Final report | `FINAL_REPORT.md` |

## CLI fallbacks

Skills include **fallback** terminal commands when a CLI is unavailable. **Do not skip Slither or invariants** in the flagship demo — install Slither per `knowledge/slither-setup.md`.

## Fallback demo

If live deploy fails during recording, ship artifacts under `examples/demo-runs/` per spec-demo.
