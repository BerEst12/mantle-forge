# Workflow — Deploy to Mantle Sepolia (stub)

**Status:** Secondary workflow — deploy-only path  
**Priority:** After `/mantle-deploy-sepolia` smoke passes

## Trigger prompt

```txt
Deploy this project to Mantle Sepolia and generate a deployment report.
```

## Planned steps

1. Validate config — `/mantle-hardhat-config` or `mantle-check`
2. Validate environment (`MANTLE_SEPOLIA_RPC_URL`, `MANTLE_PRIVATE_KEY`)
3. `npx hardhat compile`
4. Run `/mantle-test-runner` (optional skip if user confirms)
5. Run `/mantle-deploy-sepolia` or `mantle-deploy --network mantleSepolia` (verify included)
6. If verify failed: `mantle-deploy --verify-only` after 30s (see `knowledge/mantle-contract-verification.md`)
7. Run `/mantle-report-generator` (deploy + verification sections)

## Exit criteria (future)

- Deployment JSON with address + tx hash
- Mantlescan verification status in deployment JSON
- Explorer `#code` link in report
- `FINAL_REPORT.md` deployment section complete

## Scope

Stub for skill wiring. Use flagship workflow for primary validation.
