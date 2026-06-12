# Mantle token vault scaffold notes

Session-derived notes for a Mantle Sepolia token-vault project.

## Working project shape

- `contracts/DemoToken.sol`
- `contracts/TokenVault.sol`
- `contracts/MockFeeToken.sol`
- `contracts/MockToggleFeeToken.sol`
- `scripts/deploy.ts`
- `test/token-vault.ts`
- `reports/security.md`
- `reports/gas.md`
- `deployments/mantleSepolia.json`
- `FINAL_REPORT.md`

## Config details that worked

- Hardhat network key: `mantleSepolia`
- Chain ID: `5003`
- Mantlescan Sepolia custom chain URLs:
  - API: `https://api-sepolia.mantlescan.xyz/api`
  - Browser: `https://sepolia.mantlescan.xyz`

## Package compatibility note

A peer-dependency mismatch was resolved by using:

- `@nomicfoundation/hardhat-toolbox@^6.1.0`
- `hardhat-gas-reporter@^2.3.0`

## Workflow pattern

1. Scaffold project
2. `npm install`
3. `npx hardhat compile`
4. `npx hardhat test`
5. Run security review
6. Run gas report
7. Deploy to Mantle Sepolia
8. Generate `FINAL_REPORT.md`

## Security/gas lesson

A simple vault should reject fee-on-transfer or otherwise non-standard ERC20 behavior unless the accounting model is designed for it. A toggleable mock fee token is useful for testing that edge case.
