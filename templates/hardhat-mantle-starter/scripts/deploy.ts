import { ethers } from "hardhat";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

async function main() {
  const [deployer] = await ethers.getSigners();
  const unlockTime = Math.floor(Date.now() / 1000) + 3600;

  const Lock = await ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlockTime);
  await lock.waitForDeployment();

  const address = await lock.getAddress();
  const network = await ethers.provider.getNetwork();
  const deployment = {
    network: network.name,
    chainId: Number(network.chainId),
    deployer: await deployer.getAddress(),
    contracts: {
      Lock: {
        address,
        txHash: lock.deploymentTransaction()?.hash ?? null,
        constructorArgs: [unlockTime],
      },
    },
    explorer: {
      lock: `https://sepolia.mantlescan.xyz/address/${address}`,
    },
    deployedAt: new Date().toISOString(),
  };

  const outDir = resolve(process.cwd(), "deployments");
  await mkdir(outDir, { recursive: true });
  await writeFile(resolve(outDir, "mantleSepolia.json"), JSON.stringify(deployment, null, 2) + "\n", "utf8");

  console.log(JSON.stringify(deployment, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
