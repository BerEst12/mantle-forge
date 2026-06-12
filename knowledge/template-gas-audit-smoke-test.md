# Template, gas, and audit smoke test

Run in **WSL** from Mantle Forge repo root.

## 1. Install and unit tests

```bash
cd /mnt/c/Users/xyz16/Documents/GitHub/mantle-forge
npm install
npm run test:tools
```

## 2. Scaffold token-vault

```bash
rm -rf /tmp/mantle-vault-smoke
npx mantle-scaffold token-vault /tmp/mantle-vault-smoke
cd /tmp/mantle-vault-smoke
npm install
npx hardhat compile
npx hardhat test
```

Pass: 4 tests passing; `TokenVault.sol` present.

## 3. Gas report CLI

```bash
cd /mnt/c/Users/xyz16/Documents/GitHub/mantle-forge
npx mantle-gas-report /tmp/mantle-vault-smoke --out /tmp/mantle-vault-smoke/reports/gas.md
head -30 /tmp/mantle-vault-smoke/reports/gas.md
```

Pass: `reports/gas.md` contains gas table or raw hardhat output.

## 4. Audit CLI

```bash
npx mantle-audit /tmp/mantle-vault-smoke --out /tmp/mantle-vault-smoke/reports/security.md
head -25 /tmp/mantle-vault-smoke/reports/security.md
```

Pass: report says **Agent-Assisted**; no High findings on template.

## Report back

Pass/fail for each step + any errors.
