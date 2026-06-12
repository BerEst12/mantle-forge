# Mantle Forge + OpenCode

Mantle Forge skills work in OpenCode via the skills path mechanism.

## Install

```bash
npm install && npm run plugin:opencode
```

Or tell OpenCode to fetch [`.opencode/INSTALL.md`](../.opencode/INSTALL.md).

## Config snippet

```json
{
  "skills": {
    "paths": ["./.opencode/skills"]
  }
}
```

## Guides

- [install-opencode.md](./plugins/install-opencode.md)
- [plugins overview](./plugins/README.md)

## Note

Mantle Forge does not replace OpenCode's runtime. It adds Mantle-native skills and CLI tools your agent can follow — same philosophy as [Superpowers](https://github.com/obra/superpowers) for general software engineering.
