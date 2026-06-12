# Hermes Desktop flagship run — 2026-06-05

Human-verified end-to-end run on **Hermes Desktop** (Windows, Nous Portal, Step 3.7 Flash). Install today: `npm run plugin:hermes`.

## Prompt

```txt
Create a Mantle Sepolia-ready token vault project from scratch.
Add tests, run a security review, optimize gas where possible,
deploy it to Mantle Sepolia, and generate an engineering report.
```

## Results

| Step | Evidence |
|------|----------|
| Scaffold | `token-vault` template via `npx mantle-scaffold` |
| Tests | Hardhat test suite passed |
| Security | `reports/security.md` (0 high/critical checklist hits) |
| Gas | `reports/gas.md` |
| Deploy | `mantleSepolia.json` in this folder |
| Report | `FINAL_REPORT.md` generated in project workspace |

## On-chain (Mantle Sepolia)

| Contract | Address |
|----------|---------|
| TokenVault | [`0xa6608D936405470A5AF9cD003477a2042Cd0b4Ee`](https://sepolia.mantlescan.xyz/address/0xa6608D936405470A5AF9cD003477a2042Cd0b4Ee) |
| DemoToken | [`0x4E6226734449Dc01b778816Ad0cb9Ad258a3Db3D`](https://sepolia.mantlescan.xyz/address/0x4E6226734449Dc01b778816Ad0cb9Ad258a3Db3D) |

Full deployment JSON: [`mantleSepolia.json`](./mantleSepolia.json)
