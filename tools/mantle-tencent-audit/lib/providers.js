"use strict";

const https = require("https");

/**
 * Chat transports for the deep audit.
 *
 * Two providers expose the same OpenAI-compatible `/chat/completions` shape:
 *
 *  - `hunyuan`    — Tencent Cloud Hunyuan, called directly. Requires a Tencent
 *                   Cloud account with Hunyuan enabled.
 *  - `openrouter` — OpenRouter, a unified gateway that fronts 500+ models
 *                   (including Tencent's Hunyuan family and many others) behind
 *                   one API key. Lower onboarding friction than the direct
 *                   Tencent API, which is why it is offered as an alternative.
 *
 * The audit prompt, parser, and report are provider-agnostic — only the HTTP
 * transport and the default model differ.
 */
const PROVIDERS = {
  hunyuan: {
    label: "Tencent Cloud Hunyuan",
    url: "https://cloud.tencent.com/product/hunyuan",
    hostname: "api.hunyuan.cloud.tencent.com",
    path: "/v1/chat/completions",
    envKey: "TENCENT_HUNYUAN_API_KEY",
    keyHelp: "https://console.cloud.tencent.com/hunyuan",
    defaultModel: "hunyuan-pro",
    extraHeaders: () => ({}),
  },
  openrouter: {
    label: "OpenRouter",
    url: "https://openrouter.ai",
    hostname: "openrouter.ai",
    path: "/api/v1/chat/completions",
    envKey: "OPENROUTER_API_KEY",
    keyHelp: "https://openrouter.ai/keys",
    // OpenRouter model slugs change over time — verify the current id at
    // https://openrouter.ai/models and override with `--model` / OPENROUTER_MODEL.
    defaultModel: process.env.OPENROUTER_MODEL || "tencent/hunyuan-a13b-instruct",
    // OpenRouter uses these optional headers for attribution / leaderboard ranking.
    extraHeaders: () => ({
      "HTTP-Referer": process.env.OPENROUTER_REFERER || "https://github.com/mantle-forge",
      "X-Title": process.env.OPENROUTER_TITLE || "Mantle Forge — Deep Audit",
    }),
  },
};

/**
 * Decide which provider to use, in priority order:
 *   1. Explicit `options.provider` (e.g. from `--provider`)
 *   2. `MANTLE_AUDIT_PROVIDER` env var
 *   3. Auto-detect from whichever API key is present (Tencent preferred for
 *      backward compatibility, then OpenRouter)
 *   4. Fall back to `hunyuan` so a missing-key error names the original tool
 */
function resolveProvider(options = {}) {
  const explicit = options.provider || process.env.MANTLE_AUDIT_PROVIDER;
  if (explicit) {
    const key = String(explicit).toLowerCase();
    if (!PROVIDERS[key]) {
      throw new Error(`Unknown provider: "${explicit}". Use "hunyuan" or "openrouter".`);
    }
    return key;
  }
  if (process.env.TENCENT_HUNYUAN_API_KEY) return "hunyuan";
  if (process.env.OPENROUTER_API_KEY) return "openrouter";
  return "hunyuan";
}

/** Provider metadata (label, url, default model, env key) for help text + reports. */
function providerInfo(providerKey) {
  const provider = PROVIDERS[providerKey];
  if (!provider) throw new Error(`Unknown provider: "${providerKey}".`);
  return provider;
}

/** Default model id for a provider. */
function defaultModelFor(providerKey) {
  return providerInfo(providerKey).defaultModel;
}

/**
 * POST chat messages to the resolved provider and return the assistant content.
 *
 * @param {Array<{role: string, content: string}>} messages
 * @param {{ provider?: string, apiKey?: string, model?: string }} [options]
 * @returns {Promise<string>} assistant message content
 */
function callChat(messages, options = {}) {
  const providerKey = resolveProvider(options);
  const provider = PROVIDERS[providerKey];
  const apiKey = options.apiKey || process.env[provider.envKey];
  if (!apiKey) {
    throw new Error(
      `${provider.label} API key not found. Set ${provider.envKey} in your environment.\n` +
        `Get a key at: ${provider.keyHelp}`
    );
  }

  const model = options.model || provider.defaultModel;
  const body = JSON.stringify({
    model,
    messages,
    temperature: 0.1,
    max_tokens: 4096,
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: provider.hostname,
        path: provider.path,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "Content-Length": Buffer.byteLength(body),
          ...provider.extraHeaders(),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              reject(
                new Error(
                  `${provider.label} API error: ${parsed.error.message || JSON.stringify(parsed.error)}`
                )
              );
            } else if (!parsed.choices || !parsed.choices[0] || !parsed.choices[0].message) {
              reject(
                new Error(
                  `${provider.label} returned no choices. Raw: ${data.slice(0, 500)}`
                )
              );
            } else {
              resolve(parsed.choices[0].message.content);
            }
          } catch (e) {
            reject(
              new Error(`Failed to parse ${provider.label} response: ${e.message}\nRaw: ${data.slice(0, 500)}`)
            );
          }
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

module.exports = { callChat, resolveProvider, providerInfo, defaultModelFor, PROVIDERS };
