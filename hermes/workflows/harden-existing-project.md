# Workflow — Harden Existing Project (stub)

**Status:** Secondary demo / roadmap — not flagship

## Trigger prompt

```txt
Analyze this GitHub repo and make it Mantle-ready: <repo-url>
```

## Planned steps

1. Clone repository
2. Detect stack (Hardhat, Foundry, etc.)
3. Inspect contracts under `contracts/`
4. Run `/mantle-hardhat-config` or adapt for detected stack
5. Run `/mantle-test-runner`
6. Run `/mantle-security-review`
7. Run `/mantle-gas-analysis`
8. Produce patch summary or PR notes
9. Run `/mantle-report-generator`

## Exit criteria (future)

- Mantle Sepolia config present or documented gap
- Test and review artifacts in `reports/`
- `FINAL_REPORT.md` or hardening summary

## Scope

Document only. Full automation deferred until flagship workflow passes smoke test.
