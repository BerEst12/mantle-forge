# Install — Hermes

Hermes gets the **native Python plugin** (`plugins/hermes-mantle-forge/`) with six registered Python tools. The installed bundle includes **24 skills** (7 engineering + 17 DeFi data).

## One line

```bash
npm install && npm run plugin:hermes
```

On **Windows**, installs to WSL `~/.hermes/plugins/mantle-forge` automatically.

## Verify

```bash
npm run plugin:verify
wsl bash -lc "hermes plugins list | grep mantle-forge"
```

## Configure Hermes

```bash
hermes setup --portal
hermes doctor
hermes plugins enable mantle-forge
```

## Use

Direct tool call:

```txt
Use mantle_scaffold with template token-vault and output_dir ./token-vault
```

Or paste the [flagship prompt](../demo).

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `hermes` not in PowerShell | Use WSL — expected on Windows |
| Plugin missing | Re-run `npm run plugin:hermes` |

[Hermes plugins docs](https://hermes-agent.nousresearch.com/docs/user-guide/features/plugins)
