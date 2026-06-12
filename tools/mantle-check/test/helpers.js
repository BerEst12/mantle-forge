"use strict";

const fs = require("fs");
const path = require("path");

const FIXTURES = path.join(__dirname, "fixtures");

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function makeValidProject(dir) {
  write(
    path.join(dir, "hardhat.config.ts"),
    `export default {
  networks: { mantleSepolia: { url: "https://rpc.sepolia.mantle.xyz", chainId: 5003 } }
};`
  );
  write(path.join(dir, "package.json"), JSON.stringify({ devDependencies: { hardhat: "^2.26.2" } }, null, 2));
  write(path.join(dir, ".env.example"), "MANTLE_SEPOLIA_RPC_URL=\nMANTLE_PRIVATE_KEY=\n");
  write(path.join(dir, "scripts/deploy.ts"), "async function main() {}\nmain();\n");
  fs.mkdirSync(path.join(dir, "contracts"), { recursive: true });
  fs.mkdirSync(path.join(dir, "test"), { recursive: true });
}

function makeMissingNetworkProject(dir) {
  makeValidProject(dir);
  fs.writeFileSync(
    path.join(dir, "hardhat.config.ts"),
    `export default { networks: { localhost: { url: "http://127.0.0.1:8545" } } };`,
    "utf8"
  );
}

module.exports = { FIXTURES, makeValidProject, makeMissingNetworkProject };
