# Mantle Network Configuration

Reference for Mantle Forge templates, Hardhat projects, and deploy tooling.

**MVP default:** Mantle Sepolia testnet. Mainnet is reference only.

## Mantle Sepolia (default)

| Field | Value |
|-------|-------|
| Network name | Mantle Sepolia Testnet |
| Hardhat key | `mantleSepolia` |
| Chain ID | `5003` (`0x138B`) |
| RPC URL | `https://rpc.sepolia.mantle.xyz` |
| Native currency | MNT (18 decimals) |

Use **`mantleSepolia`** as the canonical Hardhat network name (matches official verify docs; avoid aliases like `mantle-testnet`).

### Explorers

| Explorer | URL | Notes |
|----------|-----|-------|
| Mantlescan (Sepolia) | https://sepolia.mantlescan.xyz | Primary for verification |
| Mantle Explorer (Sepolia) | https://explorer.sepolia.mantle.xyz | BlockScout UI |

Hardhat `customChains` URLs: API `https://api-sepolia.mantlescan.xyz/api`, browser `https://sepolia.mantlescan.xyz`.

## Mantle mainnet (reference)

| Field | Value |
|-------|-------|
| Hardhat key | `mantle` |
| Chain ID | `5000` |
| RPC URL | `https://rpc.mantle.xyz` |
| Explorer | https://mantlescan.xyz |
| Verification API | `https://api.mantlescan.xyz/api` |

Not the MVP default.

## Environment variables

| Env var | Purpose | Hardhat usage |
|---------|---------|---------------|
| `MANTLE_SEPOLIA_RPC_URL` | Sepolia JSON-RPC | `networks.mantleSepolia.url` |
| `MANTLE_PRIVATE_KEY` | Deployer wallet | `networks.mantleSepolia.accounts` |
| `MANTLE_EXPLORER_API_KEY` | Mantlescan API key | `etherscan.apiKey.mantleSepolia` |

Optional mainnet: `MANTLE_MAINNET_RPC_URL` (default `https://rpc.mantle.xyz`), `MANTLE_MAINNET_PRIVATE_KEY`.

```ts
networks: {
  mantleSepolia: {
    url: process.env.MANTLE_SEPOLIA_RPC_URL ?? "https://rpc.sepolia.mantle.xyz",
    chainId: 5003,
    accounts: process.env.MANTLE_PRIVATE_KEY ? [process.env.MANTLE_PRIVATE_KEY] : [],
  },
},
etherscan: {
  apiKey: { mantleSepolia: process.env.MANTLE_EXPLORER_API_KEY ?? "" },
  customChains: [{
    network: "mantleSepolia", chainId: 5003,
    urls: {
      apiURL: "https://api-sepolia.mantlescan.xyz/api",
      browserURL: "https://sepolia.mantlescan.xyz",
    },
  }],
},
```

## Test MNT faucets (Sepolia)

- **Official MNT faucet:** https://faucet.sepolia.mantle.xyz/ — connect wallet, authenticate with X; cooldown if balance ≥ 1,000 MNT (~4 hours)
- **Sepolia ETH:** Infura / Alchemy faucets (linked from Mantle faucet UI) for L1 gas
- **Bridge:** https://bridge.sepolia.mantle.xyz/
- **Docs:** [Fetching test tokens](https://docs.mantle.xyz/network/for-users/how-to-guides/fetching-test-tokens.md)

## Contract verification (Hardhat)

Guide: [Use Hardhat to Verify Smart Contracts](https://docs.mantle.xyz/network/for-developers/how-to-guides/how-to-verify-smart-contracts/use-hardhat-to-verify-smart-contracts.md)

```bash
npx hardhat verify --network mantleSepolia <CONTRACT_ADDRESS> [constructor args]
npx hardhat ignition deploy ./ignition/modules/MyModule.ts --network mantleSepolia --verify
```

Sources: [Mantle docs](https://docs.mantle.xyz), [wallet support](https://docs.mantle.xyz/network/for-developers/common-use-cases/adding-mantle-wallet-support.md), [Sepolia launch](https://www.mantle.xyz/blog/announcements/mantle-v2-sepolia-testnet-now-live)
