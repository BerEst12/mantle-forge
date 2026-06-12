# Install Mantle Forge — Claude Code

## One line (prep)

```bash
npm install && npm run plugin:claude
```

Then in **Claude Code** (two chat commands):

```text
/plugin marketplace add /path/to/mantle-forge
/plugin install mantle-forge@mantle-forge
```

Session-only (no marketplace):

```bash
claude --plugin-dir ./plugins/mantle-forge
```

## Verify

Restart Claude Code. Skills from `skills/` and commands from `commands/` should load.

## Use

```txt
@mantle-project-scaffold Create a token vault at ./token-vault
```

Docs: [Claude plugins](https://claude.com/plugins)
