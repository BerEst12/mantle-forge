#!/usr/bin/env node
"use strict";

const path = require("path");

/** Windows path → WSL /mnt/c/... for installer commands in WSL.
 *  Already-posix paths (starting with /) are returned unchanged. */
function toWslPath(winPath) {
  // Already a posix/WSL path — don't pass through path.resolve() which
  // would prepend the Windows CWD drive on Windows hosts.
  if (winPath.startsWith("/")) return winPath;
  // Normalize separators first so a Windows drive-letter path is recognized on
  // any host OS. On Linux (CI), path.resolve() would not treat "\" as a
  // separator and would prepend the runner CWD, breaking the drive match.
  const normalized = winPath.replace(/\\/g, "/");
  const match = normalized.match(/^([A-Za-z]):\/(.*)$/);
  if (match) return `/mnt/${match[1].toLowerCase()}/${match[2]}`;
  // Relative path — resolve against the current host CWD.
  return path.resolve(winPath).replace(/\\/g, "/");
}

module.exports = { toWslPath };
