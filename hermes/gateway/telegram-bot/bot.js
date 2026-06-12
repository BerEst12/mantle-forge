"use strict";

require("dotenv").config();

const { Telegraf } = require("telegraf");
const { runPipeline } = require("./runner");

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!TOKEN) {
  console.error("Error: TELEGRAM_BOT_TOKEN is not set. Copy .env.example → .env and fill it in.");
  process.exit(1);
}

const ALLOWED_USER_ID = process.env.ALLOWED_USER_ID
  ? Number(process.env.ALLOWED_USER_ID)
  : null;

const bot = new Telegraf(TOKEN);

// --- Auth guard ---
bot.use((ctx, next) => {
  if (ALLOWED_USER_ID && ctx.from?.id !== ALLOWED_USER_ID) {
    return ctx.reply("This bot is private. Unauthorized.");
  }
  return next();
});

// --- /start ---
bot.command("start", (ctx) => {
  ctx.reply(
    `*Mantle Forge* — demo bot\n\n` +
      `Run the full pipeline (scaffold → audit → gas → deploy → report):\n` +
      `\`/forge MyToken\`\n\n` +
      `For a real Mantle Sepolia deploy, add \`--live\`:\n` +
      `\`/forge MyToken --live\`\n\n` +
      `See /help for details.`,
    { parse_mode: "Markdown" }
  );
});

// --- /help ---
bot.command("help", (ctx) => {
  ctx.reply(
    `*Commands*\n\n` +
      `/forge <name> — run pipeline (dry-run)\n` +
      `/forge <name> --live — real Mantle Sepolia deploy\n` +
      `/start — welcome message\n` +
      `/help — this message`,
    { parse_mode: "Markdown" }
  );
});

// --- /forge ---
bot.command("forge", async (ctx) => {
  const parts = ctx.message.text.split(/\s+/).slice(1);
  const liveFlag = parts.includes("--live");
  const contractName = parts.filter((p) => p !== "--live")[0];

  if (!contractName) {
    return ctx.reply("Usage: /forge <ContractName> [--live]");
  }

  const dryRun = !liveFlag;
  const statusMsg = await ctx.reply(
    `Starting Mantle Forge pipeline for *${contractName}*…\n` +
      (dryRun ? "_Deploy step will be a dry-run._" : "_Live deploy to Mantle Sepolia._"),
    { parse_mode: "Markdown" }
  );

  const steps = [];
  const STEP_ICONS = {
    scaffold: "🏗",
    check: "✅",
    audit: "🔒",
    gas: "⛽",
    deploy: "🚀",
    report: "📄",
  };

  const updateStatus = async (step, msg) => {
    const icon = STEP_ICONS[step] || "•";
    steps.push(`${icon} *${step}:* ${escMd(msg)}`);
    try {
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        statusMsg.message_id,
        undefined,
        steps.join("\n"),
        { parse_mode: "Markdown" }
      );
    } catch {
      // Ignore "message not modified" errors
    }
  };

  try {
    const { report } = await runPipeline(contractName, {
      onStep: updateStatus,
      dryRun,
    });

    // Final report — truncate to 4000 chars to stay within Telegram limits
    const snippet =
      report.length > 4000
        ? report.slice(0, 3900) + "\n\n…_(truncated — full report in project dir)_"
        : report;

    await ctx.reply(`*FINAL\\_REPORT.md*\n\n${escMd(snippet)}`, {
      parse_mode: "Markdown",
    });
  } catch (err) {
    await ctx.reply(`Pipeline failed:\n\`${err.message.slice(0, 500)}\``);
  }
});

// --- Graceful shutdown ---
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

bot.launch().then(() => {
  console.log("Mantle Forge Telegram bot is running. Send /forge MyToken to try it.");
});

function escMd(text) {
  // Escape Markdown v1 special chars that break Telegram formatting
  return String(text).replace(/([_*[\]()~`>#+\-=|{}.!])/g, "\\$1");
}
