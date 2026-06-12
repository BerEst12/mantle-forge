# Sample security report — Mantle Token Vault

Multi-engine agent-assisted review — **not a professional audit**.

## Gate summary (`reports/harden.json`)

| Step | Result |
|------|--------|
| Slither | 0 High/Medium (example) |
| Mythril | 0 symbolic issues |
| Foundry fuzz/invariants | 3 tests passed |
| Hardhat invariants | 2 tests passed |
| Static triage | 1 informational (unchecked block — triaged) |

## Agent triage example

| Source | Issue | Status |
|--------|-------|--------|
| static | unchecked block in withdraw | **False positive** — bounded by prior balance check |
| agent | Owner can recover foreign tokens | **Accepted** — documented trust assumption |

## Regenerate

```bash
npx mantle-harden --setup ./my-vault
npx mantle-harden ./my-vault
```

See `examples/demo-runs/sample-harden.json` for gate JSON shape.
