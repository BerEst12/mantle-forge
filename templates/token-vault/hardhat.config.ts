import { config as dotenvConfig } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";

dotenvConfig();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    showTimeSpent: true,
  },
  networks: {
    mantleSepolia: {
      url: process.env.MANTLE_SEPOLIA_RPC_URL || "https://rpc.sepolia.mantle.xyz",
      chainId: 5003,
      accounts: process.env.MANTLE_PRIVATE_KEY ? [process.env.MANTLE_PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: { mantleSepolia: process.env.MANTLE_EXPLORER_API_KEY || "" },
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
