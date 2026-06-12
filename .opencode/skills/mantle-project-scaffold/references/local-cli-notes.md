# Local mantle-scaffold CLI notes

This session surfaced a few practical details for using the Mantle scaffold tool from a repo checkout.

## Repo-local invocation

If `npx mantle-scaffold ...` fails because the package is not published, run the repo-local CLI from the Mantle Forge repo root:

```bash
node tools/mantle-scaffold/cli.js <template> <output-dir>
```

## Template alias

- `token-vault` resolves to `hardhat-mantle-starter`

## Output directory rule

- The scaffold CLI refuses to write into a non-empty output directory.
- If the target path already exists and contains files, remove it first or choose a fresh empty directory.

## Install/compile sanity check

After scaffolding, install dependencies and verify with:

```bash
npm install
npx hardhat compile
```

If the project ends up missing dev dependencies in a fresh shell, reinstall with dev deps explicitly included before compiling:

```bash
NODE_ENV=development npm install --include=dev
```

## Verification

A successful scaffold should include at least:

- `hardhat.config.ts`
- `contracts/`
- `test/`
- `scripts/deploy.ts`
- `.env.example`
- `README.md`
