# Quickstart

## 1. Prerequisites

- Node.js 20+, Git
- One coding agent runtime (table below)
- Mantle Sepolia RPC + funded test wallet (for deploy steps)

## 2. Clone and install plugin

```bash
git clone https://github.com/BerEst12/mantle-forge
cd mantle-forge
npm install
```

Install **one** plugin for your agent:

| Runtime | Command | Notes |
|---------|---------|-------|
| Hermes | `npm run plugin:hermes` | Flagship demo; WSL default on Windows |
| Cursor | `npm run plugin:cursor` | Symlink to `~/.cursor/plugins/local/mantle-forge` |
| Codex | `npm run plugin:codex` | Uses `.agents/plugins/marketplace.json` |
| Claude | `npm run plugin:claude` | Then `/plugin marketplace add` + `/plugin install` |
| OpenClaw | `npm run plugin:openclaw` | `openclaw plugins install --link` |
| OpenCode | `npm run plugin:opencode` | Copies skills to `.opencode/skills/` |

Verify:

```bash
npm run plugin:verify
```

Full plugin docs: [Plugins overview](./plugins/) · [Install guides](./plugins/install-hermes)

## 3. Configure your runtime

### Hermes

```bash
hermes setup --portal   # or: hermes model
hermes doctor
hermes plugins list     # mantle-forge enabled
```

Guide: `docs/plugins/install-hermes.md` · Smoke test: `knowledge/hermes-desktop-smoke-test.md`

### Cursor

Reload window after install. Check **Settings → Rules** for `mantle-*` skills.

Guide: `docs/plugins/install-cursor.md`

### Codex

```bash
codex plugin marketplace add <repo-path>
codex plugin install mantle-forge --source mantle-forge
```

Guide: `docs/plugins/install-codex.md`

### Claude Code

```
/plugin marketplace add <repo-path>
/plugin install mantle-forge@mantle-forge
```

Guide: `docs/plugins/install-claude.md`

### OpenClaw

```bash
openclaw plugins enable mantle-forge
openclaw gateway restart
```

Guide: `docs/plugins/install-openclaw.md`

### OpenCode

Add to `opencode.json`:

```json
{
  "skills": {
    "paths": ["./.opencode/skills"]
  }
}
```

Restart OpenCode. Guide: `docs/plugins/install-opencode.md`

## 4. Environment (deploy)

Copy `.env.example` in your scaffolded project or repo root:

```bash
MANTLE_SEPOLIA_RPC_URL=
MANTLE_PRIVATE_KEY=
```

Wallet setup: `knowledge/demo-wallet-setup.md`

## 5. Run CLIs directly (optional)

### Smart-contract engineering
```bash
npx mantle-scaffold token-vault ./my-vault
cd my-vault && npm install && npx hardhat test
npx mantle-check ./my-vault
npx mantle-gas-report ./my-vault --out reports/gas.md
npx mantle-audit ./my-vault --out reports/security.md
npx mantle-deploy ./my-vault --network mantleSepolia
npx mantle-report ./my-vault --out FINAL_REPORT.md
```

DeFi data capabilities (Mantle Scan + Merchant Moe) are handled by the **7 DeFi data CLIs** — ask your agent directly:

```txt
Show me the transaction history for 0xabc123...
What are the top Merchant Moe pools by APY?
How much USDC do I get for 100 MNT on Merchant Moe?
```

See [Skills](./skills) · [Tools](./tools).

## 6. Run the flagship demo

Paste this prompt into your agent:

```txt
Create a Mantle Sepolia-ready token vault project from scratch.
Add tests, run a security review, optimize gas where possible,
deploy it to Mantle Sepolia, and generate an engineering report.
```

Or try a DeFi data prompt:

```txt
What's the current price of MNT? Show me the top Merchant Moe
pools by APY and how much USDC I'd get for 100 MNT.
```

Success criteria: [Demo](./demo).
