"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { extractGasSection } = require("../lib/gas-report");

test("extractGasSection pulls markdown tables", () => {
  const sample = `
  ·------------------------|---------------------------|-------------|
  |  Solc version: 0.8.24  ·  Optimizer enabled: true  ·  Runs: 200  │
  ·------------------------|-------------|-----------------------------|
  |  Methods                                                    │
  ·------------------------|-------------|-----|---------------------|
  |  Contract    ·  Method  ·  Min        ·  Max  ·  Avg            │
  ·------------------------|-------------|-----|---------------------|
  |  TokenVault  ·  deposit ·          -  ·     -  ·          79485  │
  `;
  const section = extractGasSection(sample);
  assert.match(section, /TokenVault/);
  assert.match(section, /deposit/);
});
