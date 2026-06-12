# Install — OpenCode

## One-liner

```bash
npm install && npm run plugin:opencode
```

## What it does

1. Syncs skills from `hermes/skills/` → `plugins/mantle-forge/skills/`
2. Copies skills → `.opencode/skills/`
3. Sets `MANTLE_FORGE_ROOT` in `~/.mantle-forge.env`

## OpenCode config

Add to `opencode.json`:

```json
{
  "skills": {
    "paths": ["<path-to-repo>/.opencode/skills"]
  }
}
```

Restart OpenCode.

## Agent-driven install

In OpenCode chat:

```
Fetch and follow instructions from https://raw.githubusercontent.com/BerEst12/mantle-forge/main/.opencode/INSTALL.md
```

## Verify

```bash
npm run plugin:verify
```

In OpenCode: `use skill tool to list skills` — look for `mantle-*` skills.

## Flagship demo

```txt
Create a Mantle Sepolia-ready token vault project from scratch.
Add tests, run a security review, optimize gas where possible,
deploy it to Mantle Sepolia, and generate an engineering report.
```

## See also

- [`.opencode/INSTALL.md`](../../.opencode/INSTALL.md)
- [`docs/README.opencode.md`](../README.opencode.md)
