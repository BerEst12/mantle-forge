# Hermes TUI smoke test

Run all steps in **WSL Ubuntu**, not PowerShell.

## 0. Go to the repo

```bash
cd /mnt/c/Users/xyz16/Documents/GitHub/mantle-forge
```

## 1. Install plugin (recommended)

```bash
npm install && npm run plugin:hermes
npm run plugin:verify
```

Pass: `hermes plugins list | grep mantle-forge` shows **enabled**.

## 2. Dev mode alternative (`external_dirs`)

Skip section 1 if you only want live skill edits from the repo without the plugin.

Edit `~/.hermes/config.yaml` and add (merge under existing keys if the file already has content):

```yaml
skills:
  external_dirs:
    - /mnt/c/Users/xyz16/Documents/GitHub/mantle-forge/hermes/skills
```

Use your real WSL path. Hermes skips missing paths silently — a typo here means no Mantle skills.

Optional: confirm the path exists:

```bash
ls hermes/skills/*/SKILL.md
```

You should see 7 engineering skills (Hermes native plugin). The compatible bundle ships 9 skills total (7 engineering + 2 Tencent Cloud).

## 3. Preflight

```bash
hermes doctor
hermes model
```

Pass: doctor reports no blockers; model shows your provider (e.g. gpt-5.4-mini) with 64K+ context.

## 4. Start TUI

```bash
hermes --tui
```

## 5. Smoke checks (inside TUI)

Run these in order. Note pass/fail for each.

| # | Action | Pass if |
|---|--------|---------|
| A | Type `/skills` or ask: "List Mantle Forge skills" | At least 7 `mantle-*` skills appear |
| B | `/mantle-project-scaffold` then ask what templates are available | Mentions `hardhat-mantle-starter`; notes `token-vault` may be future |
| C | `/mantle-hardhat-config` | Describes chainId 5003, `mantleSepolia`, env vars |
| D | Paste flagship prompt (below) | Agent outlines 12-step workflow; references skills/CLI names |

**Flagship prompt:**

```txt
Create a Mantle Sepolia-ready token vault project from scratch.
Add tests, run a security review, optimize gas where possible,
deploy it to Mantle Sepolia, and generate an engineering report.
```

**Expected behavior:** Hermes understands the workflow and names the right skills/tools. If CLI tools are unavailable, the agent should fall back to Hardhat commands.

## 6. Optional CLI smoke (no TUI)

```bash
hermes chat --toolsets skills -q "What Mantle Forge skills do you have?"
```

## 7. Report back

Tell the agent:

1. Which checks passed (A–D)
2. Any skill missing from the list
3. Screenshot or copy of flagship prompt response (first ~20 lines)
4. Errors from `hermes doctor` or TUI

Gaps get logged in the project tracker.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| No mantle skills | Run `npm run plugin:hermes`; or fix `external_dirs` path |
| Plugin not enabled | `hermes plugins enable mantle-forge` |
| Skills stale after edit | Restart Hermes session |
| Slow on `/mnt/c/` | Clone repo to `~/projects/mantle-forge` and point `external_dirs` there |
| CLI tool not found | Agent should fall back to Hardhat commands |
