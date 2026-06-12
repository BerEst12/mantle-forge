# Local CLI notes

When working inside the Mantle Forge monorepo, prefer the repo-local scaffold CLI instead of `npx mantle-scaffold`:

```bash
node tools/mantle-scaffold/cli.js <template> <output-dir>
```

Template notes:
- `hardhat-mantle-starter` is the starter template
- `token-vault` is an alias for the starter template

Verification after scaffolding:
```bash
cd <output-dir>
npm install
npx hardhat compile
```

If the output directory already exists and is non-empty, clear it or choose a different empty directory before rerunning the scaffold.
