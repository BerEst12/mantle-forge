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

## Steps

1. Scaffold with `npx mantle-scaffold token-vault ./token-vault`
2. Test: `cd token-vault && npm install && npx hardhat test`
3. **Harden (mandatory):** `npx mantle-harden ./token-vault`
4. Security triage: review `reports/security.md` + agent findings
5. Gas: `npx mantle-gas-report ./token-vault --out reports/gas.md`
6. Rerun: `npx mantle-harden ./token-vault`
7. Deploy: `npx mantle-deploy ./token-vault --network mantleSepolia`
8. Report: `npx mantle-report ./token-vault --out FINAL_REPORT.md`
