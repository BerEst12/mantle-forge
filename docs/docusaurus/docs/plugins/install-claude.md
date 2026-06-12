# Install — Claude Code

Claude Code loads skills and commands from the compatible bundle via marketplace.

## Prep

```bash
npm install && npm run plugin:claude
```

## In Claude Code

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

[Claude plugins docs](https://claude.com/plugins)
