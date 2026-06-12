# Gas optimization notes (Mantle projects)

Agent-assisted guidance — measure before optimizing.

## Baseline

```bash
REPORT_GAS=true npx hardhat test
# or
npx mantle-gas-report ./my-vault --out reports/gas.md
```

## Safe optimizations

| Technique | When |
|-----------|------|
| `immutable` / constants | Values set once at deploy |
| Custom errors | Replace revert strings |
| Optimizer `runs: 200` | General-purpose contracts |
| Storage packing | Multiple small fields in one slot |
| `calldata` for external arrays | Read-only external args |

## Avoid premature optimization

- Do not remove reentrancy guards for small gas savings
- Do not skip exact-transfer validation in vaults
- Document tradeoffs in `reports/gas.md`

## Mantle L2 note

Focus on relative before/after within the project; L2 gas differs from L1 Ethereum.
