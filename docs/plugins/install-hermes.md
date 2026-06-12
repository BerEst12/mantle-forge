# Install Mantle Forge — Hermes

## One line

```bash
npm install && npm run plugin:hermes
```

Already ran `npm install`? Just:

```bash
npm run plugin:hermes
```

On **Windows**, installs to WSL `~/.hermes/plugins/mantle-forge` automatically.

## Verify

```bash
npm run plugin:verify
```

Or in WSL:

```bash
wsl bash -lc "hermes plugins list | grep mantle-forge"
```

## Use

```txt
Use mantle_scaffold with template token-vault and output_dir ./token-vault
```

Docs: [Hermes plugins](https://hermes-agent.nousresearch.com/docs/user-guide/features/plugins)

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `hermes` not in PowerShell | Expected — use WSL |
| Plugin missing | Run `npm run plugin:hermes` again |
