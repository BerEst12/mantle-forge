# Hardhat Mantle Sepolia Starter

Minimal Hardhat + TypeScript template for [Mantle Sepolia](https://docs.mantle.xyz/).

## Setup

```bash
cp .env.example .env
# Fill MANTLE_PRIVATE_KEY and MANTLE_EXPLORER_API_KEY
npm install
npx hardhat compile
npx hardhat test
```

## Deploy

```bash
npx hardhat run scripts/deploy.ts --network mantleSepolia
```

## Network

| Field | Value |
|-------|-------|
| RPC | `https://rpc.sepolia.mantle.xyz` |
| Chain ID | `5003` |
| Explorer | `https://sepolia.mantlescan.xyz` |
