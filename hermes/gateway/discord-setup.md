# Discord gateway (optional)

Optional Hermes gateway for team demos. Core hackathon path is local Hermes TUI + CLI.

## Prerequisites

- Hermes installed and configured ([hermes/README.md](../hermes/README.md))
- Discord bot token from [Discord Developer Portal](https://discord.com/developers/applications)

## High-level steps

1. Create a Discord application and bot user.
2. Enable required intents (message content if using text commands).
3. Invite the bot to a private test server.
4. Add bot token to `~/.hermes/.env` per [Hermes gateway docs](https://hermes-agent.nousresearch.com/docs/).
5. Start Hermes with Discord gateway enabled in `~/.hermes/config.yaml`.

## Demo tips

- Use a private channel for flagship workflow demos.
- Paste the flagship prompt from `hermes/workflows/full-build-harden-deploy.md`.
- Post `FINAL_REPORT.md` and Mantlescan links after deploy.

## Scope

Gateway polish is **optional** for MVP. Prioritize local CLI + TUI demo before Discord.
