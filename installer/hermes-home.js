#!/usr/bin/env node
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

/**
 * Hermes config root. Desktop on Windows uses %LOCALAPPDATA%\hermes;
 * override with HERMES_HOME when set.
 */
function resolveHermesHome() {
  if (process.env.HERMES_HOME) {
    return path.resolve(process.env.HERMES_HOME);
  }
  if (process.platform === "win32") {
    const local = process.env.LOCALAPPDATA;
    if (local) {
      return path.join(local, "hermes");
    }
  }
  return path.join(os.homedir(), ".hermes");
}

function hermesConfigPath() {
  return path.join(resolveHermesHome(), "config.yaml");
}

function hermesSkillsDir() {
  return path.join(resolveHermesHome(), "skills");
}

function hermesSkillsDirExists() {
  return fs.existsSync(hermesSkillsDir());
}

module.exports = {
  resolveHermesHome,
  hermesConfigPath,
  hermesSkillsDir,
  hermesSkillsDirExists,
};
