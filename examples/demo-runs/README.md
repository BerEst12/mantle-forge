# Demo runs

Stored outputs from flagship demo executions (scaffold → test → review → deploy).

Install to reproduce: `npm install && npm run plugin:hermes` — see [docs/plugins/](../docs/plugins/).

| Run | Interface | TokenVault (Sepolia) |
|-----|-----------|----------------------|
| [2026-06-05-hermes-desktop](./2026-06-05-hermes-desktop/) | Hermes Desktop (Windows) | `0xa6608D936405470A5AF9cD003477a2042Cd0b4Ee` |

## Sample outputs

| File | Description |
|------|-------------|
| `sample-final-report.md` | `FINAL_REPORT.md` from full pipeline run |
| `sample-security-report.md` | `reports/security.md` — static + agent triage |
| `sample-tencent-audit.md` | `reports/tencent-audit.md` — Hunyuan deep AI audit |
| `sample-tencent-audit.json` | Structured JSON findings from Hunyuan |
| `sample-cos-upload.md` | `reports/cos-upload.md` — Tencent Cloud COS artifact URLs |
| `sample-gas-report.md` | `reports/gas.md` — gas analysis |
| [`gas-benchmark-before-after.md`](./gas-benchmark-before-after.md) | **Reproducible before/after gas benchmark** — real measured savings (baseline vs optimized vault), regenerate with `npx hardhat test --grep "gas benchmark"` |
| `sample-mantleSepolia-deployment.json` | Deployment artifacts with address + tx hash |
