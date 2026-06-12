# Deploy CLI smoke test

Run in **WSL**. Requires funded Sepolia test wallet.

## 1. Unit tests

```bash
cd /mnt/c/Users/xyz16/Documents/GitHub/mantle-forge
npm install
npm run test:tools
```

Pass: includes `mantle-deploy` tests (14+ total).

## 2. Prepare project

```bash
rm -rf /tmp/mantle-vault-deploy
npx mantle-scaffold token-vault /tmp/mantle-vault-deploy
cd /tmp/mantle-vault-deploy
npm install
cp .env.example .env
```

Edit `.env`:

```bash
MANTLE_SEPOLIA_RPC_URL=https://rpc.sepolia.mantle.xyz
MANTLE_PRIVATE_KEY=<your_sepolia_test_key>
```

## 3. Dry run (no tx)

```bash
cd /tmp/mantle-vault-deploy
npx mantle-deploy . --dry-run
```

Pass: compile OK, no deploy tx.

## 4. Live deploy

```bash
npx mantle-deploy . --network mantleSepolia
cat deployments/mantleSepolia.json
```

Pass: DemoToken + TokenVault addresses and tx hashes; explorer links work.

## 5. Report back

- Dry-run pass/fail
- Deploy addresses + tx hashes
- Explorer links
- Any errors

## Reference deploy (Hermes flagship)

- DemoToken: `0x4Bd40EFBcB8aAa21773a0e44630FEAd3d2D0435D`
- TokenVault: `0xC313185923b2F0FB2795b9b55dB3e0B9D4865119`
