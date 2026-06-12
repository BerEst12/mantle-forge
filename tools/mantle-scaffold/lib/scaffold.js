"use strict";

const fs = require("fs");
const path = require("path");
const {
  findRepoRoot,
  resolveTemplateName,
  copyDirSync,
  readTextIfExists,
} = require("@mantle-forge/cli-utils");

function appendScaffoldReadme(outputDir, { requested, resolved, aliased }) {
  const readmePath = path.join(outputDir, "README.md");
  const projectName = path.basename(outputDir);
  const stamp = new Date().toISOString().slice(0, 10);
  const aliasNote = aliased
    ? `\n- Requested template \`${requested}\` maps to \`${resolved}\`.\n`
    : "";

  const block = [
    "",
    "## Mantle Forge scaffold",
    "",
    `- Project: **${projectName}**`,
    `- Template: \`${resolved}\``,
    `- Scaffolded: ${stamp}`,
    aliasNote,
    "### Next steps",
    "",
    "```bash",
    "npm install",
    "npx hardhat compile",
    "npx hardhat test",
    "npx mantle-check .",
    "```",
    "",
  ].join("\n");

  const existing = readTextIfExists(readmePath);
  fs.writeFileSync(readmePath, (existing || `# ${projectName}\n`) + block, "utf8");
}

function scaffoldProject(templateName, outputDir, options = {}) {
  const repoRoot =
    options.repoRoot ||
    findRepoRoot(process.cwd(), path.join(__dirname, "..", "..", ".."));
  if (!repoRoot) {
    throw new Error(
      "Could not locate Mantle Forge repo root. Run from the monorepo or set MANTLE_FORGE_ROOT."
    );
  }

  const mapping = resolveTemplateName(templateName);
  const templateDir = path.join(repoRoot, "templates", mapping.resolved);
  if (!fs.existsSync(templateDir)) {
    throw new Error(`Template directory not found: ${templateDir}`);
  }

  const target = path.resolve(outputDir);
  if (fs.existsSync(target)) {
    const entries = fs.readdirSync(target);
    if (entries.length > 0) {
      throw new Error(`Output directory is not empty: ${target}`);
    }
  }

  copyDirSync(templateDir, target);
  appendScaffoldReadme(target, mapping);

  return {
    repoRoot,
    outputDir: target,
    template: mapping.resolved,
    requestedTemplate: mapping.requested,
    aliased: mapping.aliased,
  };
}

module.exports = { scaffoldProject, appendScaffoldReadme };
