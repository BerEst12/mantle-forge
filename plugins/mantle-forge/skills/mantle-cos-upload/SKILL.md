---
name: mantle-cos-upload
description: Upload Mantle Forge pipeline artifacts to Tencent Cloud COS for public, independently verifiable sharing.
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [mantle, tencent, cos, artifacts, verifiability]
    category: mantle-forge
    requires_toolsets: [terminal]
---

# Mantle COS Upload

## When to Use

- After `mantle-report` completes — final step of the pipeline
- User wants to share or archive deployment artifacts publicly
- Verifiability is required (judges, auditors, team review)

## Prerequisite

```bash
export TENCENT_COS_SECRET_ID=<your-secret-id>
export TENCENT_COS_SECRET_KEY=<your-secret-key>
export TENCENT_COS_BUCKET=<your-bucket-name>
# Get credentials at: https://console.cloud.tencent.com/cam/capi
# Create bucket at: https://console.cloud.tencent.com/cos
```

## Inputs

| Input | Required |
|-------|----------|
| Project directory with `FINAL_REPORT.md` | Yes |
| `TENCENT_COS_SECRET_ID` + `TENCENT_COS_SECRET_KEY` | Yes |
| `TENCENT_COS_BUCKET` | Yes |

## Procedure

1. Confirm env vars are set (`TENCENT_COS_SECRET_ID`, `TENCENT_COS_SECRET_KEY`, `TENCENT_COS_BUCKET`).
2. Run upload:
   ```bash
   npx mantle-cos-upload <project-dir> --out reports/cos-upload.md
   ```
3. Note the `FINAL_REPORT.md` public URL printed to stdout.
4. Add the URL to any submission or handoff document.

## What gets uploaded

| Artifact | Required |
|----------|----------|
| `FINAL_REPORT.md` | Yes — upload fails if missing |
| `reports/security.md` | If present |
| `reports/tencent-audit.md` | If present |
| `reports/gas.md` | If present |
| `reports/security.json` | If present |
| `reports/tencent-audit.json` | If present |
| `deployments/mantleSepolia.json` | If present |

## Output

```
FINAL_REPORT.md URL:
  https://<bucket>.cos.<region>.myqcloud.com/mantle-forge/<run-id>/FINAL_REPORT.md
```

Optional `--out reports/cos-upload.md` writes a markdown summary with all URLs.

## Options

| Flag | Default | Description |
|------|---------|-------------|
| `--bucket` | `TENCENT_COS_BUCKET` env | COS bucket name |
| `--region` | `ap-singapore` | COS region |
| `--prefix` | `mantle-forge` | Key prefix in bucket |
| `--run-id` | timestamp | Custom run label |
| `--private` | false | Skip public-read ACL |

## Verification

- At least one URL returned for `FINAL_REPORT.md`
- URL is publicly accessible in a browser
- `reports/cos-upload.md` lists all uploaded files
