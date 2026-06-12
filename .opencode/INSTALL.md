# Installing Mantle Forge for OpenCode

## Prerequisites

- [OpenCode](https://opencode.ai) installed
- Node.js 20+ (for Mantle CLI tools)
- This repo cloned locally

## Quick install

From the repo root:

```bash
npm install && npm run plugin:opencode
```

This copies Mantle skills into `.opencode/skills/` and sets `MANTLE_FORGE_ROOT`.

## Configure OpenCode

Add the skills path to your `opencode.json` (global or project-level):

```json
{
  "skills": {
    "paths": ["./.opencode/skills"]
  }
}
```

If you develop inside this repo, you can also point directly at the bundle:

```json
{
  "skills": {
    "paths": ["./plugins/mantle-forge/skills"]
  }
}
```

Restart OpenCode after changing config.

## Verify

Ask OpenCode:

```
use skill tool to list skills
```

You should see `mantle-project-scaffold`, `mantle-deploy-sepolia`, and the other Mantle skills.

Run CLI smoke test from repo root:

```bash
npm run plugin:verify
```

## Mantle CLIs

Skills invoke deterministic tools in `tools/mantle-*`. From repo root:

```bash
npx mantle-scaffold token-vault ./my-vault
npx mantle-check ./my-vault
```

Ensure `MANTLE_FORGE_ROOT` points to this repo (set automatically by `npm run plugin:opencode` in `~/.mantle-forge.env`).

## Flagship demo

```txt
Create a Mantle Sepolia-ready token vault project from scratch.
Add tests, run a security review, optimize gas where possible,
deploy it to Mantle Sepolia, and generate an engineering report.
```

## Updating skills

After pulling new commits:

```bash
npm run plugin:sync-skills
npm run plugin:opencode
```

## Other harnesses

OpenCode uses its own install. If you also use Hermes, Cursor, Codex, or Claude Code, install Mantle Forge separately for each runtime. See [`docs/plugins/`](../docs/plugins/).

## Troubleshooting

### Skills not listed

1. Confirm `skills.paths` in `opencode.json`
2. Re-run `npm run plugin:opencode`
3. Restart OpenCode

### CLI tools fail

1. Run `npm install` in repo root
2. Check `MANTLE_FORGE_ROOT` in `~/.mantle-forge.env`
3. Run `npm run plugin:verify`

### Deploy fails

Set `MANTLE_SEPOLIA_RPC_URL` and `MANTLE_PRIVATE_KEY` — see [`.env.example`](../.env.example).

## Full documentation

- [`docs/plugins/install-opencode.md`](../docs/plugins/install-opencode.md)
- [`docs/README.opencode.md`](../docs/README.opencode.md)
