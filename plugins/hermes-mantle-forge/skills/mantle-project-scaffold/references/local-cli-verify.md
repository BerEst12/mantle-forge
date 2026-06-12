# Local Mantle Scaffold Verification Notes

This note captures the repo-local scaffold flow that worked in practice.

## Repo-local CLI

Run from the Mantle Forge repo root:

```bash
node tools/mantle-scaffold/cli.js hardhat-mantle-starter /tmp/mantle-cli-test
```

The CLI also accepts the alias `token-vault`, but the starter template is the safest default.

## Output directory rule

The scaffold implementation refuses to write into a non-empty output directory.

If the target already exists, remove it first or choose a fresh path:

```bash
rm -rf /tmp/mantle-cli-test
```

## Verification recipe

After scaffolding:

```bash
cd /tmp/mantle-cli-test
npm install --include=dev
npx hardhat compile
```

If `npx hardhat compile` reports a non-local Hardhat error, verify the local install actually populated `node_modules/.bin/hardhat` and re-run the install with dev dependencies included.

## Generated files to expect

- `hardhat.config.ts`
- `contracts/Lock.sol`
- `scripts/deploy.ts`
- `test/Lock.ts`
- `.env.example`
- `README.md`
