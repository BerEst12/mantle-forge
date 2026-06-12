# Hardening toolchain (full audit assistant stack)

Flagship workflow uses **`npx mantle-harden`**, which requires this stack:

| Tool | Role | Install |
|------|------|---------|
| **Slither** | Static analysis (AST) | `pip install slither-analyzer` |
| **Mythril** | Symbolic execution | `pip install mythril` |
| **Foundry** | Fuzz + invariant tests | `foundryup` (via setup) |
| **Hardhat** | Integration invariant tests | `npm install` in project |
| **mantle-audit** | Static triage for agent | bundled in monorepo |
| **Agent** | Triage + business logic | `mantle-security-review` skill |

## One-command setup

```bash
npx mantle-harden --setup ./my-vault
```

Installs/checks Python 3.10+, Slither, Mythril, solc-select, Foundry.

## Full gate

```bash
npx mantle-harden ./my-vault
```

Runs in order:

1. Toolchain setup (if needed)
2. **Slither** on full project
3. **Mythril** on primary contracts (`TokenVault.sol`, etc.)
4. **Foundry** fuzz/invariants (`forge-test/*.t.sol`, 512 fuzz / 256 invariant runs)
5. **Hardhat** invariant/fuzz tests (`test/*.invariants.ts`)
6. **Static triage** + merged `reports/security.md`, `security.json`, `audit-brief.md`
7. **`reports/harden.json`** gate summary

## Project requirements

Every Mantle Forge project entering hardening must include:

- `contracts/` with pinned `pragma solidity`
- `test/*.invariants.ts` — Hardhat property tests
- `foundry.toml` + `forge-test/` — Foundry fuzz/invariant suite
- `npm install` completed (OpenZeppelin in `node_modules`)

Setup runs `forge install foundry-rs/forge-std` when `lib/forge-std` is missing.

## Verify toolchain

```bash
slither --version
myth version
forge --version
solc --version
npx mantle-harden --setup ./my-vault
```

## Dev bypass (not for demo/CI)

```bash
npx mantle-harden ./my-vault --skip-slither
```

Skips Slither/Mythril/Foundry setup and analysis. **Do not use** for hackathon judging.
