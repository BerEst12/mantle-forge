# Authoring Mantle Forge plugins

## Concept

| Layer | Role |
|-------|------|
| **CLIs** (`tools/mantle-*`) | Source of truth — deterministic execution |
| **Compatible bundle** (`plugins/mantle-forge/`) | Skills + commands + rules + hooks + vendor manifests |
| **Hermes plugin** (`plugins/hermes-mantle-forge/`) | Python `register_tool` + `register_skill` |

You do **not** need MCP for Mantle Forge. Non-Hermes agents use skills + shell; Hermes adds native tools.

## Compatible bundle (`plugins/mantle-forge/`)

| Path | Vendor | Doc |
|------|--------|-----|
| `.cursor-plugin/plugin.json` | Cursor | [Cursor plugins](https://cursor.com/docs/plugins) |
| `.claude-plugin/plugin.json` | Claude Code | [Claude plugins](https://claude.com/plugins) |
| `.codex-plugin/plugin.json` | Codex (`"skills": "./skills/"`) | [Codex plugins](https://developers.openai.com/codex/plugins) |
| `skills/<name>/SKILL.md` | All | 7 engineering synced from `hermes/skills/`; 2 Tencent Cloud authored in bundle (DeFi data ships as CLIs, not skills) |
| `commands/*.md` | Claude, OpenClaw | YAML frontmatter: `name`, `description` |
| `.cursor/commands/*.md` | Cursor slash commands | Same frontmatter |
| `rules/*.mdc` | Cursor | `alwaysApply` / `globs` frontmatter |
| `hooks/hooks.json` | Cursor | Session-start hooks |
| `scripts/verify-env.js` | Cursor hook target | Checks `MANTLE_FORGE_ROOT` |
| `.opencode/skills/` | OpenCode | Copied by `npm run plugin:opencode` |

Repo-level marketplaces:

- `.cursor-plugin/marketplace.json` — Cursor team marketplace
- `.claude-plugin/marketplace.json` — Claude Code marketplace
- `.agents/plugins/marketplace.json` — Codex marketplace

OpenClaw loads this directory as a **compatible bundle** (Cursor/Claude/Codex markers) per [OpenClaw plugins](https://docs.openclaw.ai/tools/plugin).

## Hermes native plugin (`plugins/hermes-mantle-forge/`)

Per [Hermes plugins](https://hermes-agent.nousresearch.com/docs/user-guide/features/plugins):

```text
plugin.yaml
__init__.py      # register(ctx) — register_tool + register_skill
schemas.py       # tool schemas
tools.py         # subprocess handlers → tools/*/cli.js
skills/          # bundled skills (synced)
```

Install: `npm run plugin:hermes` (WSL on Windows).

## Add a new skill

### Engineering skill (requires terminal tools)
1. Create `plugins/mantle-forge/skills/my-new-skill/SKILL.md`
2. Sync to Hermes plugin:
   ```bash
   npm run plugin:sync-skills
   ```
3. Reinstall target vendor or reload IDE.

### Data skill (API-only, no CLI needed)
1. Create `plugins/mantle-forge/skills/mantle-<name>/SKILL.md`
2. Procedure section uses `curl` + `python3` inline — no extra tool required
3. Sync and reinstall as above

### Data skill (with CLI tool)
1. Create `tools/mantle-<name>/` with `lib/`, `cli-*.js`, `test/`, `package.json`
2. Add to `test:tools` in root `package.json`
3. Create `plugins/mantle-forge/skills/mantle-<name>/SKILL.md` referencing the CLI
4. Run `npm install` to register the new workspace
5. Verify: `npm run plugin:verify`

### Skill tiers
| Tier | When | Pattern |
|------|------|---------|
| 🟢 Easy | Public REST API, no auth | SKILL.md only (curl + python3) |
| 🟡 Medium | Needs formatting or auth | SKILL.md + CLI tool ~100 lines |
| 🔴 Hard | On-chain calls / complex auth | SKILL.md + CLI + ethers.js |

## Add a Hermes native tool

1. Add schema in `plugins/hermes-mantle-forge/schemas.py`
2. Add handler in `tools.py`
3. Register in `__init__.py`
4. List in `plugin.yaml` → `provides_tools`
5. Reinstall: `npm run plugin:hermes`

## Test checklist

- [ ] `node installer/verify-plugin.js --repo . --wsl`
- [ ] `npm run test:tools` passes
- [ ] `npx mantle-scaffold token-vault ./smoke-test` from repo root
- [ ] WSL: `hermes plugins list` shows `mantle-forge` enabled
- [ ] Flagship prompt produces `FINAL_REPORT.md` (deploy optional with dry-run)
