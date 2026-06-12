# Hermes setup — Mantle Forge

Hermes-specific guide. Mantle Forge also ships plugins for Cursor, Codex, Claude, OpenClaw, and OpenCode — see [docs/plugins/README.md](../docs/plugins/README.md).

This doc covers installing the **Hermes native plugin** (`plugins/hermes-mantle-forge/`) with [Hermes Agent](https://github.com/NousResearch/hermes-agent).

**Official docs:** [hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs/)

## Install Mantle Forge plugin (recommended)

One line from repo root:

```bash
npm install && npm run plugin:hermes
```

- **Windows:** installs to WSL `~/.hermes/plugins/mantle-forge` (Hermes runs in WSL).
- **Linux/macOS:** installs to `~/.hermes/plugins/mantle-forge`.
- Includes 6 native tools + 7 bundled skills.

Verify: `npm run plugin:verify` or `wsl bash -lc "hermes plugins list | grep mantle-forge"`.

Guide: [docs/plugins/install-hermes.md](../docs/plugins/install-hermes.md)

## Hermes Desktop (demo)

1. Install [Hermes Desktop](https://hermes-agent.nousresearch.com/docs/user-guide/desktop) or `hermes desktop`.
2. Configure **Nous Portal** in onboarding.
3. Run `npm run plugin:hermes` (WSL path above if on Windows).
4. Open Desktop: `hermes desktop --cwd <workspace>`

Smoke guide: [knowledge/hermes-desktop-smoke-test.md](../knowledge/hermes-desktop-smoke-test.md)

## WSL setup

Terminal-first workflows: [knowledge/hermes-setup.md](../knowledge/hermes-setup.md).

## Install Hermes

Inside WSL (Linux/macOS one-liner from official README):

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
source ~/.bashrc   # or: source ~/.zshrc
```

The installer sets up Python 3.11 (via uv), Node.js, ripgrep, ffmpeg, and places config under `~/.hermes/`.

## Configure an LLM provider

Pick one (in order):

| Priority | Provider | Command |
|----------|----------|---------|
| 1 | **Nous Portal** (preferred) | `hermes setup --portal` |
| 2 | OpenRouter | `hermes model` → enter API key |
| 3 | Anthropic | `hermes model` → OAuth or API key |

Nous Portal covers models plus Tool Gateway (web search, image gen, TTS, browser) under one subscription. See the [provider decision tree](../knowledge/hermes-setup.md#llm-provider-decision-tree).

Secrets go to `~/.hermes/.env`; non-secret settings to `~/.hermes/config.yaml`.

## Load Mantle Forge skills (legacy — skills only)

Hermes scans **`~/.hermes/skills/`** by default. Mantle Forge ships skills under `hermes/skills/` in this repo.

**Hybrid installer (locked for hackathon):**

| Mode | When | What happens |
|------|------|--------------|
| **Default** | Demo, CI, clean machines | Copy repo skills → Hermes `skills/` as flat `mantle-*` dirs |
| **`--dev`** | Active skill authoring | Add `external_dirs` in Hermes `config.yaml` pointing at repo `hermes/skills/` |

Hermes home: `~/.hermes` (Linux/macOS/WSL) or `%LOCALAPPDATA%\hermes` (Windows Desktop). Override with `HERMES_HOME`.

Example dev config (paths use your WSL checkout):

```yaml
skills:
  external_dirs:
    - /mnt/c/Users/<you>/OneDrive/Documentos/GitHub/mantle-forge/hermes/skills
```

Local skills in `~/.hermes/skills/` take precedence over the same name in `external_dirs`. See [Skills System](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills).

Installer: [docs/plugins/](../docs/plugins/) — `npm run plugin:hermes`; legacy: [installer/README.md](../installer/README.md)

## Smoke test

**Desktop:** [knowledge/hermes-desktop-smoke-test.md](../knowledge/hermes-desktop-smoke-test.md)

**TUI / CLI:**

```bash
hermes doctor
hermes model
hermes --tui           # or: hermes desktop
```

Confirm Mantle Forge skills in **Skills & Tools** or chat: "List skills starting with mantle-".

## Mantle demo wallet

Fund a **dedicated** test wallet for deploy demos — never reuse a mainnet key.

Guide: [knowledge/demo-wallet-setup.md](../knowledge/demo-wallet-setup.md)  
Network reference: [knowledge/mantle-network-config.md](../knowledge/mantle-network-config.md)

## Repo layout (Hermes integration)

```text
hermes/
├── skills/              # Mantle Forge skills (copied or external_dirs)
├── workflows/           # Planned workflow definitions
├── system-instructions/ # Planned agent context
└── gateway/             # Planned Discord/Telegram guides
```

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `hermes` not found | `source ~/.bashrc`; check `~/.local/bin` on PATH |
| Empty or broken replies | Re-run `hermes model`; verify key in `~/.hermes/.env` |
| Skills missing | Re-run `npm run plugin:hermes`; or legacy `node installer/setup.js --copy --repo .` |
| Slow files on `/mnt/c/` | Clone repo under `~/projects/` in WSL |

Recovery order (official quickstart): `hermes doctor` → `hermes model` → `hermes setup`.

## Sources

- [Hermes README](https://github.com/NousResearch/hermes-agent/blob/main/README.md)
- [Quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)
- [Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)
- [Skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)
