# CLI tools smoke test

Run in **WSL** from the Mantle Forge repo root.

## 1. Install

```bash
cd /mnt/c/Users/xyz16/Documents/GitHub/mantle-forge
npm install
npm run test:tools
```

Pass: all tool unit tests green.

## 2. mantle-scaffold

```bash
rm -rf /tmp/mantle-cli-test
npx mantle-scaffold hardhat-mantle-starter /tmp/mantle-cli-test
cd /tmp/mantle-cli-test
npm install
npx hardhat compile
```

Pass: compile exit 0; README contains `Mantle Forge scaffold`.

## 3. mantle-check

```bash
cd /mnt/c/Users/xyz16/Documents/GitHub/mantle-forge
npx mantle-check /tmp/mantle-cli-test
npx mantle-check /tmp || true
```

Pass: valid project → `OK: project is Mantle-ready`; invalid path → clear ERROR lines and exit 1.

## 4. mantle-report

```bash
npx mantle-report ~/projects/mantle-token-vault --out /tmp/FINAL_REPORT_CLI.md
head -40 /tmp/FINAL_REPORT_CLI.md
```

Pass: markdown with security, gas, and deployment sections when artifacts exist.

## Report back

- Output of `npm run test:tools`
- Pass/fail for scaffold, check, report
- Any error messages
