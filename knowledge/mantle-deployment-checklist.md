# Mantle Sepolia deployment checklist

Use before `npx mantle-deploy` or Hermes `/mantle-deploy-sepolia`.

## Prerequisites

- [ ] Dedicated **test wallet** only (see [demo-wallet-setup.md](./demo-wallet-setup.md))
- [ ] Wallet funded with Sepolia **MNT** (faucet: https://faucet.sepolia.mantle.xyz/)
- [ ] `MANTLE_SEPOLIA_RPC_URL` set in project `.env`
- [ ] `MANTLE_PRIVATE_KEY` set in project `.env` (never commit)
- [ ] `MANTLE_EXPLORER_API_KEY` set in project `.env` (https://sepolia.mantlescan.xyz/myapikey)
- [ ] `npx mantle-check <project-dir>` passes

## Deploy + verify

```bash
cd <project-dir>
cp .env.example .env   # if needed
npx mantle-deploy . --network mantleSepolia
```

Dry run (compile + checks, no tx):

```bash
npx mantle-deploy . --dry-run
```

Retry verification only:

```bash
npx mantle-deploy . --verify-only
```

Full agent steps: [mantle-contract-verification.md](./mantle-contract-verification.md)

## Verify success

- [ ] `deployments/mantleSepolia.json` exists
- [ ] Contract addresses and tx hashes present
- [ ] `verification.contracts.*.status` is `verified` or `already_verified`
- [ ] Source code visible on [sepolia.mantlescan.xyz](https://sepolia.mantlescan.xyz) (`#code` tab)
- [ ] Run `npx mantle-report . --out FINAL_REPORT.md` if closing the workflow

## Failure playbook

| Error | Action |
|-------|--------|
| Insufficient funds | Refund via faucet |
| Invalid RPC | Check `MANTLE_SEPOLIA_RPC_URL` |
| Tests fail | Fix before `--skip-tests` |
| Wrong network | Hardhat network must be `mantleSepolia`, chainId 5003 |
| Verify failed | Wait 30s; `mantle-deploy . --verify-only` |
| Invalid API key | Set `MANTLE_EXPLORER_API_KEY` |

## Fallback demo

If keys rotate before recording, keep last good `deployments/mantleSepolia.json` under `examples/demo-runs/`.
