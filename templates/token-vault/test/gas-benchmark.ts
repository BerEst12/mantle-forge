import { expect } from "chai";
import { ethers } from "hardhat";

// Gas benchmark: TokenVaultBaseline (unoptimized "before") vs TokenVault (optimized "after").
// Measures real gasUsed from transaction receipts on the in-process Hardhat EVM, so the
// numbers are deterministic and reproducible: `npx hardhat test --grep "gas benchmark"`.
describe("gas benchmark — TokenVault before/after", function () {
  const DEPOSIT = ethers.parseUnits("100", 18);
  const WITHDRAW = ethers.parseUnits("40", 18);

  async function deployToken() {
    const DemoToken = await ethers.getContractFactory("DemoToken");
    const token = await DemoToken.deploy();
    await token.waitForDeployment();
    return token;
  }

  async function measure(contractName: string) {
    const [, alice] = await ethers.getSigners();
    const token = await deployToken();

    const Factory = await ethers.getContractFactory(contractName);
    const vault = await Factory.deploy(await token.getAddress());
    const deployReceipt = await vault.deploymentTransaction()!.wait();
    const deployGas = deployReceipt!.gasUsed;

    await token.transfer(alice.address, DEPOSIT);
    await token.connect(alice).approve(await vault.getAddress(), DEPOSIT);

    const depositTx = await vault.connect(alice).deposit(DEPOSIT);
    const depositGas = (await depositTx.wait())!.gasUsed;

    const withdrawTx = await vault.connect(alice).withdraw(WITHDRAW);
    const withdrawGas = (await withdrawTx.wait())!.gasUsed;

    return { deployGas, depositGas, withdrawGas };
  }

  it("optimized TokenVault uses less gas than the baseline on every operation", async function () {
    const before = await measure("TokenVaultBaseline");
    const after = await measure("TokenVault");

    const pct = (b: bigint, a: bigint) => (Number((b - a) * 10000n / b) / 100).toFixed(2);

    const rows = [
      ["Deployment", before.deployGas, after.deployGas],
      ["deposit()", before.depositGas, after.depositGas],
      ["withdraw()", before.withdrawGas, after.withdrawGas],
    ] as const;

    // Print a Markdown table with the real measured numbers (copied into the report artifact).
    /* eslint-disable no-console */
    console.log("\n| Operation | Before (baseline) | After (optimized) | Gas saved | Savings |");
    console.log("|-----------|------------------:|------------------:|----------:|--------:|");
    for (const [name, b, a] of rows) {
      console.log(`| ${name} | ${b.toLocaleString()} | ${a.toLocaleString()} | ${(b - a).toLocaleString()} | ${pct(b, a)}% |`);
    }
    console.log("");
    /* eslint-enable no-console */

    // Real assertions — the optimized version must be cheaper on every operation.
    expect(after.deployGas).to.be.lt(before.deployGas);
    expect(after.depositGas).to.be.lt(before.depositGas);
    expect(after.withdrawGas).to.be.lt(before.withdrawGas);
  });
});
