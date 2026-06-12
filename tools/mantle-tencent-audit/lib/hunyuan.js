"use strict";

// Backward-compatible thin wrapper. The audit now supports multiple chat
// transports (Tencent Hunyuan direct + OpenRouter) — see ./providers.js.
// `callHunyuan` is preserved for any external callers and forces the Tencent
// provider so its historical behavior is unchanged.
const { callChat } = require("./providers");

const DEFAULT_MODEL = "hunyuan-pro";

function callHunyuan(messages, options = {}) {
  return callChat(messages, { ...options, provider: options.provider || "hunyuan" });
}

module.exports = { callHunyuan, DEFAULT_MODEL };
