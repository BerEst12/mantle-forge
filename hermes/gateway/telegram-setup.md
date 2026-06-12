# Telegram gateway — Mantle Forge demo bot

A standalone Telegram bot that runs the full Mantle Forge pipeline on demand.
One command: `/forge MyToken` → scaffold → audit → gas → deploy → `FINAL_REPORT.md`.

## Quick start

```bash
cd hermes/gateway/telegram-bot
npm install

# Configure
cp .env.example .env
# Edit .env — set TELEGRAM_BOT_TOKEN (from @BotFather)
# Optional: MANTLE_PRIVATE_KEY + MANTLE_SEPOLIA_RPC_URL for live deploys

npm start
```

## Get a bot token

1. Open Telegram → search **@BotFather**
2. `/newbot` → follow prompts
3. Copy the `HTTP API token` into `.env` as `TELEGRAM_BOT_TOKEN`

## Commands

| Command | What it does |
|---------|-------------|
| `/forge MyToken` | Full pipeline — dry-run deploy |
| `/forge MyToken --live` | Full pipeline — real Mantle Sepolia deploy |
| `/start` | Welcome message |
| `/help` | Command reference |

## Live deploy

Set in `.env`:

```
MANTLE_PRIVATE_KEY=0x...   # funded Sepolia test wallet
MANTLE_SEPOLIA_RPC_URL=https://rpc.sepolia.mantle.xyz
```

Then use `/forge MyToken --live`.

## Security

- Set `ALLOWED_USER_ID` in `.env` to your Telegram numeric user ID to restrict access during demos.
- Never commit `.env`. It is git-ignored.

## Files

```
hermes/gateway/telegram-bot/
  bot.js          Main bot (Telegraf)
  runner.js       Pipeline executor (calls CLI tools)
  package.json
  .env.example
```
