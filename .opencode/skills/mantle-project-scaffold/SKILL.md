---
name: mantle-project-scaffold
description: Create a new Mantle Sepolia-ready Hardhat project from a natural-language request or template name.
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [mantle, hardhat, scaffold]
    category: mantle-forge
    requires_toolsets: [terminal]
---

# Mantle Project Scaffold

## When to Use

- User asks to create a new Mantle / Hardhat project from scratch
- Flagship workflow step: pick template and scaffold directory
- User mentions token vault, starter, or new contract project on Mantle Sepolia

## Inputs

| Input | Required | Example |
|-------|----------|---------|
| Template | Yes | `token-vault`, `hardhat-mantle-starter` |
| Output directory | Yes | `./my-token-vault` |
| Project name | No | Derived from directory |

## Procedure

1. Interpret the request and choose a template:
   - **token-vault** — flagship template in `templates/token-vault/`
   - **hardhat-mantle-starter** — verified minimal starter in `templates/hardhat-mantle-starter/`
2. **Run CLI:** Prefer the repo-local CLI when working inside this repository: `node tools/mantle-scaffold/cli.js <template> <output-dir>` from the repo root.
   - If you are using an installed binary instead, `npx mantle-scaffold <template> <output-dir>` is only valid when the package is actually available in your environment.
   2. **Preferred CLI:** use the repo-local entrypoint when working inside the Mantle Forge monorepo:
      ```bash
      node tools/mantle-scaffold/cli.js <template> <output-dir>
      ```
      `token-vault` is an alias for `hardhat-mantle-starter`.
   3. **Fallback (CLI not installed):** Copy template manually:
      ```bash
      cp -r templates/hardhat-mantle-starter ./my-project
      cd ./my-project && npm install
      ```
   4. Ensure `.env.example` includes `MANTLE_SEPOLIA_RPC_URL` and `MANTLE_PRIVATE_KEY`
   5. Generate or update `README.md` with install and test commands
   6. Run `npx hardhat compile` to verify the scaffold
6. Run `npx hardhat compile` to verify the scaffold

## Callable tools

| Tool | Example |
|------|---------|
| `mantle-scaffold` | `npx mantle-scaffold token-vault ./my-vault` |
| Terminal | `npm install`, `npx hardhat compile` |

## Expected output

- Working project directory with `hardhat.config.ts`, contracts, tests, deploy script stub
- Short project summary (template used, paths, next steps)

## Verification

- `npx hardhat compile` exits 0
- `mantleSepolia` network present in Hardhat config (or run `/mantle-hardhat-config` next)
- If compile fails with Hardhat CLI bootstrap errors, confirm local dev deps are installed and `node_modules/.bin/hardhat` exists.

## Pitfalls

- **token-vault** is the flagship template (4 tests, gas reporter, deploy script)
- The scaffold CLI refuses to write into an existing non-empty output directory; clear it or choose a fresh path before retrying.
- On WSL with `/mnt/c/` paths, I/O can be slow; suggest `~/projects/` clone if needed
- A repo-local invocation is often the most reliable path for this workflow: `node tools/mantle-scaffold/cli.js hardhat-mantle-starter <output-dir>`.
- Related notes: see `references/local-cli-verify.md` for the repo-local verification recipe and the non-empty-directory failure mode.
- The scaffold CLI will refuse to write into a non-empty output directory. Pick a fresh path or clear the target before rerunning.
- If you are working inside the `mantle-forge` repo, see `references/local-cli-verify.md` for the repo-local CLI entrypoint, output-directory reset, and verification recipe.
- If `npm install` hits a peer-dependency conflict, check `references/session-token-vault.md` for a working package set and version pairings that installed cleanly in a Mantle Sepolia token-vault scaffold.
- If Hardhat appears missing after install, rerun the install with dev deps included (for example `NODE_ENV=development npm install --include=dev`) before retrying `npx hardhat compile`.
