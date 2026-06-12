"use strict";

const fs = require("fs");
const path = require("path");

const FIXTURES = path.join(__dirname, "fixtures", "sample-project");

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

write(path.join(FIXTURES, "package.json"), JSON.stringify({ name: "sample-vault" }, null, 2));
write(path.join(FIXTURES, "contracts", "Vault.sol"), "// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\ncontract Vault {}\n");
write(path.join(FIXTURES, "reports", "security.md"), "# Security\n\nAgent-assisted review complete.\n");
write(path.join(FIXTURES, "reports", "gas.md"), "# Gas\n\nDeposit gas noted.\n");
write(
  path.join(FIXTURES, "deployments", "mantleSepolia.json"),
  JSON.stringify(
    {
      network: "mantleSepolia",
      chainId: 5003,
      contracts: { Vault: { address: "0xabc", txHash: "0xdef" } },
    },
    null,
    2
  )
);

module.exports = { FIXTURES };
