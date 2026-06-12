import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const privateKey = process.env.MANTLE_PRIVATE_KEY ?? "";
const accounts = privateKey ? [privateKey] : [];

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    mantleSepolia: {
      url: process.env.MANTLE_SEPOLIA_RPC_URL ?? "https://rpc.sepolia.mantle.xyz",
      chainId: 5003,
      accounts,
      gasPrice: 20_000_000,
    },
  },
  etherscan: {
    apiKey: {
      mantleSepolia: process.env.MANTLE_EXPLORER_API_KEY ?? "",
    },
    customChains: [
      {
        network: "mantleSepolia",
        chainId: 5003,
        urls: {
          apiURL: "https://api-sepolia.mantlescan.xyz/api",
          browserURL: "https://sepolia.mantlescan.xyz",
        },
      },
    ],
  },
};

export default config;
