# Mantle Token Vault

Flagship Mantle Forge template: a simple ERC-20 vault with tests, gas reporting, and Mantle Sepolia deploy script.

## Quick start

```bash
npm install
npx hardhat compile
npx hardhat test
REPORT_GAS=true npx hardhat test
```

## Deploy (Mantle Sepolia)

Copy `.env.example` to `.env`, fund a test wallet, then:

```bash
npx hardhat run scripts/deploy.ts --network mantleSepolia
```

Deployment artifacts are written to `deployments/mantleSepolia.json`.

## Mantle Forge CLIs

From the Mantle Forge monorepo root:

```bash
npx mantle-scaffold token-vault ./my-vault
npx mantle-check ./my-vault
npx mantle-gas-report ./my-vault --out reports/gas.md
npx mantle-audit ./my-vault --out reports/security.md
npx mantle-report ./my-vault --out FINAL_REPORT.md
```
