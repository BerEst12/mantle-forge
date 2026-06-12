# Hermes setup (WSL + providers)

Setup steps from [official Hermes docs](https://hermes-agent.nousresearch.com/docs/).

## 1. WSL2 + Ubuntu (Windows)

```powershell
wsl --install -d Ubuntu
```

Open Ubuntu in Windows Terminal. Verify: `uname -a` and `which curl`.

## 2. Repo path in WSL

```bash
cd /mnt/c/Users/<you>/OneDrive/Documentos/GitHub/mantle-forge
```

Use `/mnt/c/...` for Windows checkouts. For faster I/O, clone under `~/projects/` instead.

## 3. Install Hermes

Inside Ubuntu only (not PowerShell):

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
source ~/.bashrc
```

Binary: `~/.local/bin/hermes`. Config home: `~/.hermes/` (`.env` for secrets, `config.yaml` for settings).

Optional wizard: `hermes setup`. Models need **≥ 64K context** (official minimum).

## LLM provider decision tree

```text
Nous Portal subscription?  YES → hermes setup --portal
                           NO  ↓
OpenRouter API key?          YES → hermes model → OpenRouter
                           NO  ↓
Anthropic OAuth or API key?  YES → hermes model → Anthropic
                           NO  → obtain Portal or OpenRouter before continuing
```

| Provider | Setup |
|----------|-------|
| **Nous Portal** (preferred) | `hermes setup --portal` — OAuth + Tool Gateway |
| **OpenRouter** | `hermes model` + `OPENROUTER_API_KEY` in `~/.hermes/.env` |
| **Anthropic** | `hermes model` → OAuth or API key |

Status check: `hermes portal status`.

## 4. Mantle Forge plugin (recommended)

From repo root in WSL:

```bash
npm install && npm run plugin:hermes
```

Installs `~/.hermes/plugins/mantle-forge` with 6 native tools + 7 bundled skills. Verify: `npm run plugin:verify`.

Guide: [docs/plugins/install-hermes.md](../docs/plugins/install-hermes.md)

**Legacy skills-only:** `node installer/setup.js --copy --repo .` → flat `mantle-*` in `~/.hermes/skills/`

**Dev authoring:** `external_dirs` in `~/.hermes/config.yaml` → repo `hermes/skills/` (see `./installer/install.sh --dev`)

## 5. Smoke test

```bash
hermes doctor
hermes model
hermes --tui
```

Prompt: `Reply with exactly: Mantle Forge Hermes OK`

Pass: doctor clean, model shows provider, TUI replies, `/skills` lists Mantle Forge after step 4.

Keep Hermes LLM keys in `~/.hermes/.env`; Mantle deploy keys in project `.env` (see [demo-wallet-setup.md](./demo-wallet-setup.md)).

## Links

[Quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart) · [Providers](https://hermes-agent.nousresearch.com/docs/user-guide/providers) · [Skills / external_dirs](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills#external-skill-directories)
