import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import "@nomicfoundation/hardhat-chai-matchers";

describe("Lock", function () {
  it("sets unlock time and owner", async function () {
    const unlockTime = BigInt((await time.latest()) + 3600);
    const [owner] = await ethers.getSigners();

    const Lock = await ethers.getContractFactory("Lock");
    const lock = await Lock.deploy(unlockTime);

    expect(await lock.unlockTime()).to.equal(unlockTime);
    expect(await lock.owner()).to.equal(owner.address);
  });

  it("rejects withdraw before unlock", async function () {
    const unlockTime = BigInt((await time.latest()) + 3600);
    const Lock = await ethers.getContractFactory("Lock");
    const lock = await Lock.deploy(unlockTime);

    await expect(lock.withdraw()).to.be.revertedWith("You can't withdraw yet");
  });
});
