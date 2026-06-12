# Install Mantle Forge — OpenClaw

## One line

```bash
npm install && npm run plugin:openclaw
```

If `openclaw` is on PATH, runs `install --link` + `enable` automatically.

## Manual steps (if needed)

```bash
openclaw plugins install --link ./plugins/mantle-forge
openclaw plugins enable mantle-forge
openclaw gateway restart
```

## Verify

```bash
openclaw plugins inspect mantle-forge --runtime --json
```

## Use

Send the flagship prompt in your OpenClaw channel. Agent loads mantle skills and runs CLIs from `MANTLE_FORGE_ROOT`.

Docs: [OpenClaw plugins](https://docs.openclaw.ai/tools/plugin)
