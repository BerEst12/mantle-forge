# Sample gas report — Mantle Token Vault

Reference output for hackathon demo. Live runs may differ.

## Key results (TokenVault)

| Method | Avg gas |
|--------|--------:|
| `deposit` | 79,485 |
| `withdraw` | 65,444 |
| `recoverForeignToken` | 55,020 |

## Deployment gas

| Contract | Avg gas |
|----------|--------:|
| `TokenVault` | 624,044 |
| `DemoToken` | 559,167 |

## Safe optimizations applied

- `immutable` owner and asset
- Custom errors
- Optimizer enabled (200 runs)
- Exact-transfer validation (small cost, high safety value)

Generate fresh output:

```bash
npx mantle-gas-report ./my-vault --out reports/gas.md
```
