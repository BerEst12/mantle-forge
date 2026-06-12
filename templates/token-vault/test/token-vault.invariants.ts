import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("TokenVault invariants", function () {
  this.timeout(120000);

  async function deployFixture() {
    const [owner, alice, bob] = await ethers.getSigners();
    const DemoToken = await ethers.getContractFactory("DemoToken");
    const demoToken = await DemoToken.deploy();
    await demoToken.waitForDeployment();
    const TokenVault = await ethers.getContractFactory("TokenVault");
    const tokenVault = await TokenVault.deploy(await demoToken.getAddress());
    await tokenVault.waitForDeployment();
    return { owner, alice, bob, demoToken, tokenVault };
  }

  async function sumUserBalances(
    tokenVault: Awaited<ReturnType<typeof deployFixture>>["tokenVault"],
    users: string[]
  ) {
    let total = 0n;
    for (const user of users) total += await tokenVault.balanceOf(user);
    return total;
  }

  function fuzzAmount(seed: number, cap: bigint): bigint {
    if (cap <= 1n) return 1n;
    const mixed = BigInt(seed * 7919 + 104729);
    return (mixed % (cap - 1n)) + 1n;
  }

  it("invariant: vault asset balance matches sum of internal balances", async function () {
    const { alice, bob, demoToken, tokenVault } = await loadFixture(deployFixture);
    const users = [alice.address, bob.address];
    const vaultAddr = await tokenVault.getAddress();

    for (const [user, amount] of [
      [alice, ethers.parseUnits("100", 18)],
      [bob, ethers.parseUnits("50", 18)],
    ] as const) {
      await demoToken.transfer(user.address, amount);
      await demoToken.connect(user).approve(vaultAddr, amount);
      await tokenVault.connect(user).deposit(amount);
    }

    expect(await demoToken.balanceOf(vaultAddr)).to.equal(await sumUserBalances(tokenVault, users));
  });

  it("fuzz: random deposit and withdraw preserves accounting", async function () {
    const { alice, demoToken, tokenVault } = await loadFixture(deployFixture);
    const vaultAddr = await tokenVault.getAddress();
    const pool = ethers.parseUnits("1000", 18);
    await demoToken.transfer(alice.address, pool);

    let recorded = 0n;
    const FUZZ_RUNS = 128;

    for (let i = 0; i < FUZZ_RUNS; i++) {
      const op = i % 3;
      if (op === 0) {
        const maxDeposit = pool - recorded;
        if (maxDeposit <= 0n) continue;
        const amount = fuzzAmount(i, maxDeposit > ethers.parseUnits("100", 18) ? ethers.parseUnits("100", 18) : maxDeposit);
        await demoToken.connect(alice).approve(vaultAddr, amount);
        await tokenVault.connect(alice).deposit(amount);
        recorded += amount;
      } else if (op === 1) {
        const current = await tokenVault.balanceOf(alice.address);
        if (current === 0n) continue;
        const amount = fuzzAmount(i + 17, current);
        await tokenVault.connect(alice).withdraw(amount);
        recorded -= amount;
      }

      expect(await tokenVault.balanceOf(alice.address)).to.equal(recorded);
      expect(await demoToken.balanceOf(vaultAddr)).to.equal(recorded);
    }
  });
});
