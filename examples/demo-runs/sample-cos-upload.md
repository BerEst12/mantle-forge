# COS Upload Summary — illustrative sample

> ⚠️ **Illustrative sample, not a live run.** The URLs below use placeholder
> bucket/region/run-id values and **do not resolve**. `mantle-cos-upload`
> generates real, publicly accessible URLs only when you run it with your own
> Tencent Cloud COS credentials (`TENCENT_COS_SECRET_ID`, `TENCENT_COS_SECRET_KEY`,
> `TENCENT_COS_BUCKET`). This file documents the *output format* the tool produces.

**Run ID:** `run-<timestamp>`
**Primary URL:** `https://<your-bucket>.cos.<region>.myqcloud.com/mantle-forge/<run-id>/FINAL_REPORT.md`

## Uploaded artifacts

| File | URL (shape) |
|------|-------------|
| `FINAL_REPORT.md` | `https://<your-bucket>.cos.<region>.myqcloud.com/mantle-forge/<run-id>/FINAL_REPORT.md` |
| `reports/security.md` | `https://<your-bucket>.cos.<region>.myqcloud.com/mantle-forge/<run-id>/reports/security.md` |
| `reports/tencent-audit.md` | `https://<your-bucket>.cos.<region>.myqcloud.com/mantle-forge/<run-id>/reports/tencent-audit.md` |
| `reports/gas.md` | `https://<your-bucket>.cos.<region>.myqcloud.com/mantle-forge/<run-id>/reports/gas.md` |
| `reports/security.json` | `https://<your-bucket>.cos.<region>.myqcloud.com/mantle-forge/<run-id>/reports/security.json` |
| `reports/tencent-audit.json` | `https://<your-bucket>.cos.<region>.myqcloud.com/mantle-forge/<run-id>/reports/tencent-audit.json` |
| `deployments/mantleSepolia.json` | `https://<your-bucket>.cos.<region>.myqcloud.com/mantle-forge/<run-id>/deployments/mantleSepolia.json` |

## Reproduce a real run

```bash
export TENCENT_COS_SECRET_ID=<id>
export TENCENT_COS_SECRET_KEY=<key>
export TENCENT_COS_BUCKET=<bucket>      # e.g. my-bucket-1250000000
export TENCENT_COS_REGION=ap-singapore
npx mantle-cos-upload ./my-vault --out reports/cos-upload.md
```

The generated `reports/cos-upload.md` will contain the real, public-read URLs for
each artifact — those are the links to share for independent verification.
