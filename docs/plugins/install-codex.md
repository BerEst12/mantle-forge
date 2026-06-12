# Install Mantle Forge — OpenAI Codex

## One line

```bash
npm install && npm run plugin:codex
```

If `codex` is on PATH, the script runs marketplace add + install automatically. Otherwise it prints manual commands.

## Manual steps (if needed)

```bash
codex plugin marketplace add /path/to/mantle-forge
codex plugin install mantle-forge --source mantle-forge
```

## Verify

```bash
codex
/plugins
```

Find **mantle-forge** under the repo marketplace. Space toggles enabled.

## Use

```txt
@mantle-forge
```

Docs: [Codex plugins](https://developers.openai.com/codex/plugins)
