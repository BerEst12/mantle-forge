"use strict";

const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const test = require("node:test");

const REPO_ROOT = path.resolve(__dirname, "..", "..");

// Helpers ----------------------------------------------------------------

function tmp(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

/** Build a minimal fake repo that install-plugin.js can operate on. */
function fakeRepo(dir) {
  // plugins/mantle-forge bundle
  const bundle = path.join(dir, "plugins", "mantle-forge");
  fs.mkdirSync(path.join(bundle, "skills", "mantle-project-scaffold"), { recursive: true });
  fs.mkdirSync(path.join(bundle, "skills", "mantle-security-review"), { recursive: true });
  fs.writeFileSync(path.join(bundle, "skills", "mantle-project-scaffold", "SKILL.md"), "# scaffold");
  fs.writeFileSync(path.join(bundle, "skills", "mantle-security-review", "SKILL.md"), "# security");
  fs.mkdirSync(path.join(bundle, "rules"), { recursive: true });
  fs.writeFileSync(path.join(bundle, "rules", "mantle-forge.mdc"), "rules");

  // plugins/hermes-mantle-forge
  const hermes = path.join(dir, "plugins", "hermes-mantle-forge");
  fs.mkdirSync(hermes, { recursive: true });
  for (const f of ["plugin.yaml", "__init__.py", "schemas.py", "tools.py"]) {
    fs.writeFileSync(path.join(hermes, f), `# ${f}`);
  }

  // hermes/skills source (used by syncSkills)
  const hermesSkills = path.join(dir, "hermes", "skills");
  fs.mkdirSync(path.join(hermesSkills, "mantle-test-runner"), { recursive: true });
  fs.writeFileSync(path.join(hermesSkills, "mantle-test-runner", "SKILL.md"), "# test-runner");

  return dir;
}

// Load module fresh per-test (paths are resolved at require time) so we can
// control hermesHomeDir by passing it explicitly to the exported functions.
const {
  bundleDir,
  hermesPluginSrc,
  syncSkills,
  installHermesNative,
  installCursor,
  installClaude,
  installCodex,
  installOpenClaw,
} = require("../install-plugin");

const { toWslPath } = require("../paths");

// bundleDir / hermesPluginSrc --------------------------------------------

test("bundleDir returns plugins/mantle-forge under repoRoot", () => {
  const result = bundleDir("/some/repo");
  assert.equal(result, path.join("/some/repo", "plugins", "mantle-forge"));
});

test("hermesPluginSrc returns plugins/hermes-mantle-forge under repoRoot", () => {
  const result = hermesPluginSrc("/some/repo");
  assert.equal(result, path.join("/some/repo", "plugins", "hermes-mantle-forge"));
});

// toWslPath --------------------------------------------------------------

test("toWslPath converts Windows drive letter to /mnt/<letter>/...", () => {
  // Only meaningful on Windows paths; test the transformation logic directly.
  const result = toWslPath("C:\\Users\\xyz16\\repos\\mantle");
  assert.match(result, /^\/mnt\/c\//);
  assert.ok(result.includes("Users/xyz16/repos/mantle"));
});

test("toWslPath leaves an already-posix path unchanged", () => {
  const posix = "/mnt/c/repos/mantle";
  assert.equal(toWslPath(posix), posix);
});

test("toWslPath output always contains forward slashes only", () => {
  const result = toWslPath("C:\\Users\\xyz16\\repos\\mantle");
  assert.ok(!result.includes("\\"), "no backslashes in result");
});

// syncSkills -------------------------------------------------------------

test("syncSkills copies hermes/skills → bundle skills and hermes plugin skills", () => {
  const repo = fakeRepo(tmp("mf-sync-"));

  // Capture console output (syncSkills prints OK line)
  const logs = [];
  const orig = console.log;
  console.log = (...a) => logs.push(a.join(" "));
  syncSkills(repo);
  console.log = orig;

  // bundle skills should now include mantle-test-runner from hermes/skills
  const bundleSkills = path.join(repo, "plugins", "mantle-forge", "skills");
  assert.ok(
    fs.existsSync(path.join(bundleSkills, "mantle-test-runner", "SKILL.md")),
    "skill copied to bundle"
  );

  // hermes plugin skills also updated
  const hermesSkills = path.join(repo, "plugins", "hermes-mantle-forge", "skills");
  assert.ok(
    fs.existsSync(path.join(hermesSkills, "mantle-test-runner", "SKILL.md")),
    "skill copied to hermes plugin"
  );

  assert.ok(logs.some((l) => l.includes("synced") && l.includes("skills")));
});

test("syncSkills is a no-op when hermes/skills does not exist", () => {
  const repo = fakeRepo(tmp("mf-sync-noop-"));
  fs.rmSync(path.join(repo, "hermes", "skills"), { recursive: true, force: true });

  // Should not throw
  assert.doesNotThrow(() => syncSkills(repo));
});

// installHermesNative ----------------------------------------------------

test("installHermesNative copies plugin files to hermesHome", () => {
  const repo = fakeRepo(tmp("mf-hermes-install-"));
  const hermesHome = tmp("mf-hermes-home-");

  const logs = [];
  const orig = console.log;
  console.log = (...a) => logs.push(a.join(" "));
  installHermesNative(repo, hermesHome);
  console.log = orig;

  const target = path.join(hermesHome, "plugins", "mantle-forge");
  for (const f of ["plugin.yaml", "__init__.py", "schemas.py", "tools.py"]) {
    assert.ok(fs.existsSync(path.join(target, f)), `${f} copied`);
  }
  assert.ok(
    fs.existsSync(path.join(target, "skills", "mantle-project-scaffold", "SKILL.md")),
    "skills copied"
  );
});

test("installHermesNative sets MANTLE_FORGE_ROOT in .env", () => {
  const repo = fakeRepo(tmp("mf-hermes-env-"));
  const hermesHome = tmp("mf-hermes-home-env-");

  const orig = console.log;
  console.log = () => {};
  installHermesNative(repo, hermesHome);
  console.log = orig;

  const envContent = fs.readFileSync(path.join(hermesHome, ".env"), "utf8");
  assert.ok(envContent.includes("MANTLE_FORGE_ROOT="), ".env contains key");
  assert.ok(envContent.includes(repo), ".env contains repo path");
});

test("installHermesNative writes config.yaml with mantle-forge enabled", () => {
  const repo = fakeRepo(tmp("mf-hermes-cfg-"));
  const hermesHome = tmp("mf-hermes-home-cfg-");

  const orig = console.log;
  console.log = () => {};
  installHermesNative(repo, hermesHome);
  console.log = orig;

  const cfg = fs.readFileSync(path.join(hermesHome, "config.yaml"), "utf8");
  assert.ok(cfg.includes("mantle-forge"), "config.yaml registers plugin");
});

test("installHermesNative extends existing config.yaml without duplicating", () => {
  const repo = fakeRepo(tmp("mf-hermes-cfg2-"));
  const hermesHome = tmp("mf-hermes-home-cfg2-");

  // Pre-existing config that already has plugins block
  fs.writeFileSync(
    path.join(hermesHome, "config.yaml"),
    "plugins:\n  enabled:\n    - some-other-plugin\n"
  );

  const orig = console.log;
  console.log = () => {};
  installHermesNative(repo, hermesHome);
  installHermesNative(repo, hermesHome); // second call should not duplicate
  console.log = orig;

  const cfg = fs.readFileSync(path.join(hermesHome, "config.yaml"), "utf8");
  const matches = (cfg.match(/mantle-forge/g) || []).length;
  assert.equal(matches, 1, "mantle-forge appears exactly once");
});

// installCursor ----------------------------------------------------------

test("installCursor creates a symlink or copy in ~/.cursor/plugins/local/mantle-forge", () => {
  const repo = fakeRepo(tmp("mf-cursor-"));

  // Redirect the destination by monkey-patching os.homedir inside the module.
  // Since we can't easily override os.homedir, we test the side-effects by
  // running installCursor with the real homedir and checking the path exists.
  const expectedTarget = path.join(os.homedir(), ".cursor", "plugins", "local", "mantle-forge");

  const logs = [];
  const orig = console.log;
  console.log = (...a) => logs.push(a.join(" "));
  installCursor(repo);
  console.log = orig;

  assert.ok(
    fs.existsSync(expectedTarget),
    `cursor target exists at ${expectedTarget}`
  );
  assert.ok(logs.some((l) => l.includes("OK: Cursor plugin")));
});

test("installCursor sets MANTLE_FORGE_ROOT in ~/.mantle-forge.env", () => {
  const repo = fakeRepo(tmp("mf-cursor-env-"));

  const orig = console.log;
  console.log = () => {};
  installCursor(repo);
  console.log = orig;

  const envPath = path.join(os.homedir(), ".mantle-forge.env");
  const content = fs.readFileSync(envPath, "utf8");
  assert.ok(content.includes("MANTLE_FORGE_ROOT="));
});

// installClaude ----------------------------------------------------------

test("installClaude prints marketplace and session-only instructions", () => {
  const repo = fakeRepo(tmp("mf-claude-"));

  const logs = [];
  const orig = console.log;
  console.log = (...a) => logs.push(a.join(" "));
  installClaude(repo);
  console.log = orig;

  assert.ok(logs.some((l) => l.includes("marketplace")));
  assert.ok(logs.some((l) => l.includes("/plugin")));
  assert.ok(logs.some((l) => l.includes("--plugin-dir")));
});

test("installClaude sets MANTLE_FORGE_ROOT in ~/.mantle-forge.env", () => {
  const repo = fakeRepo(tmp("mf-claude-env-"));

  const orig = console.log;
  console.log = () => {};
  installClaude(repo);
  console.log = orig;

  const content = fs.readFileSync(path.join(os.homedir(), ".mantle-forge.env"), "utf8");
  assert.ok(content.includes("MANTLE_FORGE_ROOT="));
});

// installCodex -----------------------------------------------------------

test("installCodex prints marketplace instructions and sets env", () => {
  const repo = fakeRepo(tmp("mf-codex-"));

  const logs = [];
  const warns = [];
  const origLog = console.log;
  const origWarn = console.warn;
  console.log = (...a) => logs.push(a.join(" "));
  console.warn = (...a) => warns.push(a.join(" "));
  installCodex(repo);
  console.log = origLog;
  console.warn = origWarn;

  assert.ok(logs.some((l) => l.includes("marketplace")));
  // codex CLI won't be on PATH in CI, but function should not throw
  const content = fs.readFileSync(path.join(os.homedir(), ".mantle-forge.env"), "utf8");
  assert.ok(content.includes("MANTLE_FORGE_ROOT="));
});

// installOpenClaw --------------------------------------------------------

test("installOpenClaw prints openclaw instructions and sets env", () => {
  const repo = fakeRepo(tmp("mf-openclaw-"));

  const logs = [];
  const warns = [];
  const origLog = console.log;
  const origWarn = console.warn;
  console.log = (...a) => logs.push(a.join(" "));
  console.warn = (...a) => warns.push(a.join(" "));
  installOpenClaw(repo);
  console.log = origLog;
  console.warn = origWarn;

  assert.ok(logs.some((l) => l.includes("openclaw")));
  assert.ok(logs.some((l) => l.includes("--link")));
  // openclaw CLI absent in CI → warn, not throw
  const content = fs.readFileSync(path.join(os.homedir(), ".mantle-forge.env"), "utf8");
  assert.ok(content.includes("MANTLE_FORGE_ROOT="));
});

// setEnvFile (via repeated installs) ------------------------------------

test("setEnvFile updates existing key without creating duplicates", () => {
  const repo1 = fakeRepo(tmp("mf-env-update1-"));
  const repo2 = fakeRepo(tmp("mf-env-update2-"));

  const orig = console.log;
  console.log = () => {};
  installClaude(repo1);
  installClaude(repo2); // second call should overwrite the key
  console.log = orig;

  const content = fs.readFileSync(path.join(os.homedir(), ".mantle-forge.env"), "utf8");
  const keyMatches = (content.match(/^MANTLE_FORGE_ROOT=/gm) || []).length;
  assert.equal(keyMatches, 1, "key appears exactly once after two installs");
});
