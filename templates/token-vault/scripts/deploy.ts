import { ethers } from "hardhat";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

async function main() {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();

  const DemoToken = await ethers.getContractFactory("DemoToken");
  const demoToken = await DemoToken.deploy();
  await demoToken.waitForDeployment();

  const TokenVault = await ethers.getContractFactory("TokenVault");
  const tokenVault = await TokenVault.deploy(await demoToken.getAddress());
  await tokenVault.waitForDeployment();

  const network = await ethers.provider.getNetwork();
  const deployment = {
    network: network.name,
    chainId: Number(network.chainId),
    deployer: deployerAddress,
    contracts: {
      DemoToken: {
        address: await demoToken.getAddress(),
        txHash: demoToken.deploymentTransaction()?.hash ?? null,
      },
      TokenVault: {
        address: await tokenVault.getAddress(),
        txHash: tokenVault.deploymentTransaction()?.hash ?? null,
        constructorArgs: [await demoToken.getAddress()],
      },
    },
    explorer: {
      tokenVault: `https://sepolia.mantlescan.xyz/address/${await tokenVault.getAddress()}`,
      demoToken: `https://sepolia.mantlescan.xyz/address/${await demoToken.getAddress()}`,
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
