# Demo wallet setup (Mantle Sepolia)

Dedicated **throwaway wallet** for deploy demos. Never reuse a mainnet or personal wallet.

## 1. Generate

```bash
cast wallet new    # Foundry in WSL
```

Or MetaMask → Create Account. Save seed offline. Address is public; private key is secret.

## 2. Store the key (never commit)

| Do | Don't |
|----|-------|
| `MANTLE_PRIVATE_KEY=` in gitignored `.env` | Commit `.env`, README, or chat |
| Zero mainnet balance on this wallet | Reuse primary MetaMask |

```bash
MANTLE_SEPOLIA_RPC_URL=https://rpc.sepolia.mantle.xyz
MANTLE_PRIVATE_KEY=<demo_key_only>
```

Hermes LLM keys → `~/.hermes/.env`, not project `.env`.

## 3. Fund with test MNT

Gas token: **MNT** (chain ID `5003`). Faucet: https://faucet.sepolia.mantle.xyz/

1. Connect demo address
2. Authenticate with X (Twitter)
3. Request MNT (target ≥ 0.5 MNT)

Cooldown at ≥ 1,000 MNT balance (~4 h). Sepolia ETH faucets linked on faucet page if needed. Bridge: https://bridge.sepolia.mantle.xyz/

Verify: `cast balance <ADDR> --rpc-url https://rpc.sepolia.mantle.xyz` or [sepolia.mantlescan.xyz](https://sepolia.mantlescan.xyz).

Network details: [mantle-network-config.md](./mantle-network-config.md).

## Checklist

- [ ] Project-only wallet; key only in `.env`
- [ ] Funded before live deploy demo
- [ ] If key ever committed → rotate wallet immediately
