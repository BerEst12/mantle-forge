# Mantle Forge — compatible plugin bundle

Multi-vendor plugin for **Cursor**, **Codex**, **Claude Code**, **OpenClaw**, and **OpenCode**. Hermes uses the separate native plugin at `plugins/hermes-mantle-forge/`.

## One line per runtime

```bash
npm install && npm run plugin:cursor
npm install && npm run plugin:codex
npm install && npm run plugin:claude
npm install && npm run plugin:openclaw
npm install && npm run plugin:opencode
```

Hermes (native Python tools + skills):

```bash
npm install && npm run plugin:hermes
```

## Bundle layout

```text
plugins/mantle-forge/
├── .cursor-plugin/plugin.json
├── .claude-plugin/plugin.json
├── .codex-plugin/plugin.json    # skills: "./skills/"
├── skills/                      # 24 mantle-* skills (7 engineering + 17 DeFi data)
├── commands/                    # Claude / OpenClaw workflows
├── .cursor/commands/            # Cursor slash commands
├── rules/                       # Cursor rules (.mdc)
├── hooks/hooks.json             # Session-start env check
└── scripts/verify-env.js      # MANTLE_FORGE_ROOT helper
```

Hermes native plugin (separate):

```text
plugins/hermes-mantle-forge/
├── plugin.yaml
├── __init__.py                  # register_tool + register_skill
├── schemas.py
├── tools.py
└── skills/
```

## Docs

| Guide | Path |
|-------|------|
| Overview | [docs/plugins/README.md](../../docs/plugins/README.md) |
| Authoring | [docs/plugins/authoring.md](../../docs/plugins/authoring.md) |
| Docusaurus | [docs/docusaurus/docs/plugins/index.md](../../docs/docusaurus/docs/plugins/index.md) |
