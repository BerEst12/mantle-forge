# CLI tools

**15 CLI tools** ship in the workspace — **6 engineering** (flagship pipeline) + **2 Tencent Cloud** (Hunyuan audit + COS upload) + **7 DeFi data** (Mantlescan + Merchant Moe). Agents invoke these via skills; engineering output is verifiable on disk, on-chain, and in Tencent Cloud COS.

Install workspace: `npm install` from repo root.  
Wire into agent: `npm run plugin:<vendor>` — see [Plugins](./plugins/).

## Smart-contract engineering CLIs (6)

| CLI | Example | Output |
|-----|---------|--------|
| `mantle-scaffold` | `npx mantle-scaffold token-vault ./my-vault` | Hardhat project from template |
| `mantle-check` | `npx mantle-check ./my-vault` | Validation report |
| `mantle-gas-report` | `npx mantle-gas-report ./my-vault --out reports/gas.md` | Gas analysis |
| `mantle-audit` | `npx mantle-audit ./my-vault --out reports/security.md` | Security findings |
| `mantle-deploy` | `npx mantle-deploy ./my-vault --network mantleSepolia` | Address + tx hash |
| `mantle-report` | `npx mantle-report ./my-vault --out FINAL_REPORT.md` | Engineering summary |

## Tencent Cloud CLIs (2)

| CLI | Example | Output |
|-----|---------|--------|
| `mantle-tencent-audit` | `npx mantle-tencent-audit ./my-vault --out reports/tencent-audit.md` | Deep AI security audit (Hunyuan direct or via OpenRouter) |
| `mantle-cos-upload` | `npx mantle-cos-upload ./my-vault --out reports/cos-upload.md` | Public COS URLs for all artifacts |

**Required env vars:**

```bash
# Deep audit — set ONE provider key (auto-detected; or force with --provider)
TENCENT_HUNYUAN_API_KEY=   # console.cloud.tencent.com/hunyuan  (hunyuan provider)
OPENROUTER_API_KEY=        # openrouter.ai/keys                 (openrouter provider)
# Optional OpenRouter overrides: OPENROUTER_MODEL, OPENROUTER_REFERER, OPENROUTER_TITLE

# COS upload
TENCENT_COS_SECRET_ID=     # console.cloud.tencent.com/cam/capi
TENCENT_COS_SECRET_KEY=
TENCENT_COS_BUCKET=        # console.cloud.tencent.com/cos
TENCENT_COS_REGION=ap-singapore
```

## DeFi data CLIs (7)

| CLI | Example | Output |
|-----|---------|--------|
| `mantle-scan-tx` | `npx mantle-scan-tx 0xabc...` | Decoded transaction |
| `mantle-scan-contract` | `npx mantle-scan-contract 0xabc...` | Contract info + ABI |
| `mantle-tx-history` | `npx mantle-tx-history 0xabc...` | Wallet tx history |
| `mantle-whale-tracker` | `npx mantle-whale-tracker --min-value 10000` | Large MNT transfers |
| `mantle-moe-pools` | `npx mantle-moe-pools --sort tvl` | Merchant Moe pools ranked |
| `mantle-moe-best-pool` | `npx mantle-moe-best-pool MNT USDC` | Best pool for pair |
| `mantle-moe-swap-quote` | `npx mantle-moe-swap-quote MNT USDC 100` | On-chain swap quote |

## How plugins use CLIs

| Runtime | Invocation path |
|---------|----------------|
| **Hermes** | Native tools (`mantle_scaffold`, …) wrap the same CLIs |
| **Cursor / Codex / Claude / OpenClaw** | Skills instruct agent → `npx mantle-*` via shell |
| **OpenCode** | Skills → shell CLIs |

`MANTLE_FORGE_ROOT` (set by `npm run plugin:<vendor>`) points agents at this repo so `npx mantle-*` resolves correctly.

## Notes

- Security output is **agent-assisted hardening**, not a professional audit.
- Deploy requires `MANTLE_SEPOLIA_RPC_URL` and a funded wallet in project `.env`.
- Use `--dry-run` on deploy to compile without sending transactions.
- Swap quote is read-only (no wallet needed) — uses `eth_call` on Mantle mainnet RPC.
- Test all tools: `npm run test:tools`

Checklist: `knowledge/mantle-deployment-checklist.md`
