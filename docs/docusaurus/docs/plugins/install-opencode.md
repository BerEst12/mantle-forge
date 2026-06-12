# Install — OpenCode

OpenCode loads Mantle skills via the skills path mechanism.

## One line

```bash
npm install && npm run plugin:opencode
```

Copies skills to `.opencode/skills/` and sets `MANTLE_FORGE_ROOT`.

## Configure `opencode.json`

```json
{
  "skills": {
    "paths": ["./.opencode/skills"]
  }
}
```

Restart OpenCode.

## Verify

```bash
npm run plugin:verify
```

In OpenCode: `use skill tool to list skills` — look for `mantle-*`.

## Agent-driven install

```txt
Fetch and follow instructions from https://raw.githubusercontent.com/BerEst12/mantle-forge/main/.opencode/INSTALL.md
```

## Use

Paste the [flagship prompt](../demo).
