# Install — OpenClaw

OpenClaw links the compatible bundle as a gateway plugin.

## One line

```bash
npm install && npm run plugin:openclaw
```

Runs `openclaw plugins install --link` + `enable` when CLI is on PATH.

## Manual steps

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

Send the [flagship prompt](../demo) in your channel. Agent loads mantle skills and runs CLIs from `MANTLE_FORGE_ROOT`.

[OpenClaw plugins docs](https://docs.openclaw.ai/tools/plugin)
