# Hermes Desktop smoke test — Mantle Forge

Run on **Windows** (Hermes via WSL) or Linux/macOS. Hermes Agent v0.15.0+ recommended.

## 1. Install plugin

```bash
cd mantle-forge
npm install && npm run plugin:hermes
```

On Windows, plugin installs to WSL `~/.hermes/plugins/mantle-forge`. Verify:

```bash
npm run plugin:verify
# or:
wsl bash -lc "hermes plugins list | grep mantle-forge"
```

Legacy skills-only (no native tools): `node installer/setup.js --copy --repo .`

## 2. Open Hermes Desktop

```powershell
mkdir C:\Users\xyz16\Documents\mantle-demo-workspace -Force
hermes desktop --cwd C:\Users\xyz16\Documents\mantle-demo-workspace
```

Configure Nous Portal (or another provider) in onboarding.

## 3. Smoke checks

| # | Action | Pass if |
|---|--------|---------|
| A | **Skills & Tools** → search `mantle-` | 7 engineering skills visible (26 in compatible bundle) |
| B | Tools: `mantle_scaffold`, `mantle_deploy`, … | 6 Mantle tools listed |
| C | Flagship prompt (below) | Agent runs full workflow |

**Flagship prompt:**

```txt
Create a Mantle Sepolia-ready token vault project from scratch.
Add tests, run a security review, optimize gas where possible,
deploy it to Mantle Sepolia, and generate an engineering report.
```

## 4. Deploy prerequisites

Project `.env` (not `~/.hermes/.env`):

```env
MANTLE_SEPOLIA_RPC_URL=https://rpc.sepolia.mantle.xyz
MANTLE_PRIVATE_KEY=0x...
```

Faucet: https://faucet.sepolia.mantle.xyz/ — see [demo-wallet-setup.md](./demo-wallet-setup.md).

## 5. Expected artifacts

- `reports/security.md`, `reports/gas.md`
- `deployments/mantleSepolia.json`
- `FINAL_REPORT.md`

Reference: [examples/demo-runs/2026-06-05-hermes-desktop/](../examples/demo-runs/2026-06-05-hermes-desktop/)

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Plugin not listed | `npm run plugin:hermes`; check WSL with `hermes plugins list` |
| Skills missing | Re-run `npm run plugin:hermes`; restart Desktop |
| `0 signers` on deploy | `.env` in project dir with `MANTLE_PRIVATE_KEY` |
| CLI blocked | Set `MANTLE_FORGE_ROOT`; use `npx mantle-scaffold token-vault <dir>` |
