import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("TokenVault", function () {
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

  it("records deposits and allows withdrawals", async function () {
    const { alice, demoToken, tokenVault } = await loadFixture(deployFixture);
    const depositAmount = ethers.parseUnits("100", 18);

    await demoToken.transfer(alice.address, depositAmount);
    await demoToken.connect(alice).approve(await tokenVault.getAddress(), depositAmount);

    await expect(tokenVault.connect(alice).deposit(depositAmount))
      .to.emit(tokenVault, "Deposited")
      .withArgs(alice.address, depositAmount);

    expect(await tokenVault.balanceOf(alice.address)).to.equal(depositAmount);
    expect(await demoToken.balanceOf(await tokenVault.getAddress())).to.equal(depositAmount);

    const withdrawAmount = ethers.parseUnits("40", 18);
    await expect(tokenVault.connect(alice).withdraw(withdrawAmount))
      .to.emit(tokenVault, "Withdrawn")
      .withArgs(alice.address, withdrawAmount);

    expect(await tokenVault.balanceOf(alice.address)).to.equal(depositAmount - withdrawAmount);
    expect(await demoToken.balanceOf(alice.address)).to.equal(withdrawAmount);
  });

  it("rejects zero amounts and overdrafts", async function () {
    const { alice, tokenVault } = await loadFixture(deployFixture);

    await expect(tokenVault.connect(alice).deposit(0)).to.be.revertedWithCustomError(tokenVault, "ZeroAmount");
    await expect(tokenVault.connect(alice).withdraw(0)).to.be.revertedWithCustomError(tokenVault, "ZeroAmount");
    await expect(tokenVault.connect(alice).withdraw(1)).to.be.revertedWithCustomError(tokenVault, "InsufficientBalance");
  });

  it("only lets the owner recover foreign tokens", async function () {
    const { owner, alice, bob, demoToken, tokenVault } = await loadFixture(deployFixture);
    const foreignTokenFactory = await ethers.getContractFactory("DemoToken");
    const foreignToken = await foreignTokenFactory.deploy();
    await foreignToken.waitForDeployment();

    const amount = ethers.parseUnits("10", 18);
    await foreignToken.transfer(await tokenVault.getAddress(), amount);

    await expect(
      tokenVault.connect(alice).recoverForeignToken(await foreignToken.getAddress(), bob.address, amount)
    ).to.be.revertedWithCustomError(tokenVault, "NotOwner");

    await expect(
      tokenVault.connect(owner).recoverForeignToken(await foreignToken.getAddress(), bob.address, amount)
    )
      .to.emit(tokenVault, "Recovered")
      .withArgs(await foreignToken.getAddress(), bob.address, amount);

    expect(await foreignToken.balanceOf(bob.address)).to.equal(amount);

    await expect(
      tokenVault.connect(owner).recoverForeignToken(await demoToken.getAddress(), bob.address, amount)
    ).to.be.revertedWithCustomError(tokenVault, "UnsupportedToken");
  });

  it("rejects fee-on-transfer assets so accounting stays exact", async function () {
    const [, alice] = await ethers.getSigners();
    const MockFee = await ethers.getContractFactory("MockFeeToken");
    const feeToken = await MockFee.deploy();
    await feeToken.waitForDeployment();

    const TokenVault = await ethers.getContractFactory("TokenVault");
    const tokenVault = await TokenVault.deploy(await feeToken.getAddress());
    await tokenVault.waitForDeployment();

    const depositAmount = ethers.parseUnits("10", 18);
    await feeToken.transfer(alice.address, depositAmount + ethers.parseUnits("1", 18));
    await feeToken.connect(alice).approve(await tokenVault.getAddress(), depositAmount);

    await expect(tokenVault.connect(alice).deposit(depositAmount)).to.be.revertedWithCustomError(
      tokenVault,
      "UnsupportedTokenBehavior"
    );

    const ToggleFee = await ethers.getContractFactory("MockToggleFeeToken");
    const toggleFeeToken = await ToggleFee.deploy();
    await toggleFeeToken.waitForDeployment();

    const withdrawVault = await TokenVault.deploy(await toggleFeeToken.getAddress());
    await withdrawVault.waitForDeployment();

    await toggleFeeToken.transfer(alice.address, depositAmount);
    await toggleFeeToken.connect(alice).approve(await withdrawVault.getAddress(), depositAmount);
    await withdrawVault.connect(alice).deposit(depositAmount);

    await toggleFeeToken.setFeeEnabled(true);
    await expect(withdrawVault.connect(alice).withdraw(depositAmount)).to.be.revertedWithCustomError(
      withdrawVault,
      "UnsupportedTokenBehavior"
    );
  });
});
