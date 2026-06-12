# Install — Codex

Codex installs the compatible bundle from `.agents/plugins/marketplace.json`.

## One line

```bash
npm install && npm run plugin:codex
```

If `codex` is on PATH, marketplace add + install run automatically.

## Manual steps

```bash
codex plugin marketplace add /path/to/mantle-forge
codex plugin install mantle-forge --source mantle-forge
```

## Verify

```bash
codex
/plugins
```

Enable **mantle-forge** under the repo marketplace.

## Use

```txt
@mantle-forge
```

[Codex plugins docs](https://developers.openai.com/codex/plugins)
