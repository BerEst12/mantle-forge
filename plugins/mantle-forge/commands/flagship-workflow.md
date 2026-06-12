---
name: flagship-workflow
description: Full Mantle Forge loop — scaffold, test, harden, deploy Sepolia, report
---

# Flagship Mantle workflow

Run the full Mantle Forge engineering loop on Mantle Sepolia.

## Prompt

```txt
Create a Mantle Sepolia-ready token vault project from scratch.
Add tests, run a security review, optimize gas where possible,
deploy it to Mantle Sepolia, and generate an engineering report.
```

## Prerequisites

- Slither: `pip install slither-analyzer` — see `knowledge/slither-setup.md`
- `MANTLE_FORGE_ROOT` points to cloned `mantle-forge`
- Project `.env`: `MANTLE_SEPOLIA_RPC_URL`, `MANTLE_PRIVATE_KEY`

## Steps (load skills in order)

1. `mantle-project-scaffold` — `npx mantle-scaffold token-vault ./token-vault`
2. `cd token-vault && npm install && npx hardhat test`
3. **Setup:** `npx mantle-harden --setup ./token-vault` — installs Slither/solc if missing
4. **Harden:** `npx mantle-harden ./token-vault` — Slither + invariants + audit reports (mandatory)
5. `mantle-security-review` — triage findings in `reports/security.md`
5. `mantle-gas-analysis` — `npx mantle-gas-report ./token-vault --out reports/gas.md`
6. `npx mantle-harden ./token-vault` — rerun after fixes
7. `mantle-deploy-sepolia` — `npx mantle-deploy ./token-vault --network mantleSepolia`
8. `mantle-report-generator` — `npx mantle-report ./token-vault --out FINAL_REPORT.md`
