---
name: mantle-tencent-audit
description: AI deep security audit for Solidity contracts on Mantle — Tencent Cloud Hunyuan direct or via OpenRouter. Goes beyond static heuristics.
version: 1.1.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [mantle, security, solidity, tencent, hunyuan, openrouter]
    category: mantle-forge
    requires_toolsets: [terminal]
---

# Mantle Tencent Audit

Deep, AI-powered security review of Solidity contracts on Mantle. It sends the
contract sources through a frontier LLM and returns structured findings ranked
by severity, plus a Mantle-L2-specific assessment.

## When to Use

- After `mantle-security-review` (static pass) — as a deeper AI-powered second layer
- User asks for "deep audit", "Hunyuan audit", "Tencent Cloud review", or "OpenRouter audit"
- Before final deploy when highest confidence is required

## Providers

The audit runs through **one of two interchangeable transports** — same prompt,
same report, same JSON shape. Pick whichever key you have.

| Provider | Key env var | Get a key | Notes |
|----------|-------------|-----------|-------|
| `hunyuan` (default) | `TENCENT_HUNYUAN_API_KEY` | [console.cloud.tencent.com/hunyuan](https://console.cloud.tencent.com/hunyuan) | Tencent Cloud Hunyuan, called directly. Requires Hunyuan enabled on the account. |
| `openrouter` | `OPENROUTER_API_KEY` | [openrouter.ai/keys](https://openrouter.ai/keys) | Unified gateway to 500+ models **including Tencent's Hunyuan family**. One key, lower onboarding friction. |

**Provider selection** (priority order):

1. `--provider hunyuan|openrouter` flag
2. `MANTLE_AUDIT_PROVIDER` env var
3. Auto-detect: if `TENCENT_HUNYUAN_API_KEY` is set → `hunyuan`; else if `OPENROUTER_API_KEY` is set → `openrouter`
4. Fallback → `hunyuan` (so a missing-key message names the original tool)

## Prerequisite

Pick **one**:

```bash
# Option A — Tencent Cloud Hunyuan (direct)
export TENCENT_HUNYUAN_API_KEY=<your-key>     # console.cloud.tencent.com/hunyuan

# Option B — OpenRouter (one key, many models incl. Tencent Hunyuan)
export OPENROUTER_API_KEY=sk-or-<your-key>    # openrouter.ai/keys
```

Optional OpenRouter tuning:

```bash
export OPENROUTER_MODEL=tencent/hunyuan-a13b-instruct  # override default slug
export OPENROUTER_REFERER=https://your-app             # attribution header
export OPENROUTER_TITLE="Mantle Forge — Deep Audit"    # attribution header
```

> OpenRouter model slugs change over time. Verify the current id for any model at
> [openrouter.ai/models](https://openrouter.ai/models) and pass it with `--model`.

## Inputs

| Input | Required |
|-------|----------|
| Project directory with `contracts/*.sol` | Yes |
| One provider API key (`TENCENT_HUNYUAN_API_KEY` **or** `OPENROUTER_API_KEY`) | Yes |

## Procedure

1. Confirm a provider key is set in the environment (Tencent **or** OpenRouter).
2. Run the deep audit:
   ```bash
   # Auto-detect provider from whichever key is set
   npx mantle-tencent-audit <project-dir> --out reports/tencent-audit.md --json reports/tencent-audit.json

   # Force OpenRouter explicitly
   npx mantle-tencent-audit <project-dir> --provider openrouter --out reports/tencent-audit.md
   ```
3. Read `reports/tencent-audit.md` — review every finding by severity (Critical → High → Medium).
4. Cross-reference with `reports/security.md` from `mantle-security-review` to avoid duplicates.
5. For each Critical or High finding: verify, patch, and note disposition in the report.
6. Rerun after fixes to confirm risk level drops.

## What Hunyuan evaluates

| Category | What it checks |
|----------|---------------|
| Reentrancy | CEI pattern, external call ordering |
| Access control | Role assumptions, admin trust |
| Arithmetic | Overflow, underflow, precision loss |
| Logic | Business invariants, economic attacks |
| Gas | Unbounded loops, storage patterns |
| Mantle-specific | Cross-layer risks, MNT token handling, sequencer assumptions |

## Output

| File | Contents |
|------|----------|
| `reports/tencent-audit.md` | Full findings + Mantle L2 assessment + recommendations |
| `reports/tencent-audit.json` | Structured JSON for agent triage (optional `--json`) |

## Models available

**`hunyuan` provider** (Tencent Cloud direct):

| Model | Notes |
|-------|-------|
| `hunyuan-pro` | Default — best quality |
| `hunyuan-turbos-latest` | Faster, lower cost |
| `hunyuan-large` | Extended context for large contracts |

**`openrouter` provider** — pass any current slug from
[openrouter.ai/models](https://openrouter.ai/models) via `--model`. Examples:

| Model slug | Notes |
|------------|-------|
| `tencent/hunyuan-a13b-instruct` | Default — Tencent Hunyuan via OpenRouter |
| `deepseek/deepseek-chat` | Strong, low-cost alternative |
| `anthropic/claude-sonnet-4.6` | High-quality reasoning |

> Slugs above are examples — availability and exact ids change. Always confirm at
> [openrouter.ai/models](https://openrouter.ai/models) before relying on one.

## Verification

- `reports/tencent-audit.md` exists and contains `risk_level`
- All Critical/High findings triaged (fixed or marked false positive)
- Consistent with `reports/security.md` findings

## Pitfalls

- Label output as **agent-assisted hardening** — not a professional audit
- `hunyuan` provider: API key must have Hunyuan access enabled in Tencent Cloud console
- `openrouter` provider: an invalid/retired model slug returns an API error — verify at [openrouter.ai/models](https://openrouter.ai/models)
- Large contracts (>500 lines) may need an extended-context model (`hunyuan-large`, or a long-context slug on OpenRouter)
