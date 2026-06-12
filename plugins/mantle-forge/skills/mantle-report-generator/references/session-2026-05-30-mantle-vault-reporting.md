# Session note: Mantle vault reporting flow (2026-05-30)

This is a compact, reusable record of the reporting workflow that worked for the token-vault scaffold.

## Verified flow

1. Run gas report first:
   ```bash
   npx mantle-gas-report /tmp/mantle-vault-smoke --out /tmp/mantle-vault-smoke/reports/gas.md
   ```
2. Run security report second:
   ```bash
   npx mantle-audit /tmp/mantle-vault-smoke --out /tmp/mantle-vault-smoke/reports/security.md
   ```
3. Merge artifacts into a final report:
   ```bash
   npx mantle-report /tmp/mantle-vault-smoke --out /tmp/FINAL_REPORT_CLI.md
   ```

## Notes

- The gas report preserved the raw Hardhat gas table output in markdown form.
- The security report wrote a concise checklist summary to `reports/security.md`.
- `mantle-report` successfully merged both artifacts into a single final markdown file.
- When the caller provides `--out`, honor that exact path and verify the file exists afterward.
