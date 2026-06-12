# Install — Cursor

Cursor loads the **compatible plugin bundle** via symlink to `~/.cursor/plugins/local/mantle-forge`.

## One line

```bash
npm install && npm run plugin:cursor
```

Then **Developer → Reload Window**.

Or in Agent chat: `/add-plugin mantle-forge`

## Verify

- **Settings → Rules** — `mantle-*` skills under Agent Decides
- Chat command `/flagship-workflow` available
- `npm run plugin:verify` from repo root

## Use

```txt
/flagship-workflow
```

Or paste the [flagship prompt](../demo). Agent reads skills and runs `npx mantle-*` CLIs.

[Cursor plugins docs](https://cursor.com/docs/plugins)
