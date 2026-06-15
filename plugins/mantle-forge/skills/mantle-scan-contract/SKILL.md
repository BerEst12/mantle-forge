---
name: mantle-scan-contract
description: Inspect a Mantle contract keyless via RPC — is-contract, bytecode size, and function signatures from the bytecode.
version: 1.1.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [mantle, explorer, contract, bytecode, rpc]
    category: mantle-forge
    requires_toolsets: [terminal]
---

# Mantle Scan — Contract Info

Inspects a contract on Mantle **keyless**, straight from the chain: confirms the
address holds bytecode, reports its size, and lists the **function selectors**
found in the bytecode, resolved to signatures via 4byte.directory. Works on
mainnet and Sepolia.

## When to Use

- User asks "is this a contract", "what functions does it have", "inspect 0x…"
- Sanity-checking a contract before interacting with it — no API key needed

## Inputs

| Input | Required | Default |
|-------|----------|---------|
| Contract address | Yes | — |
| Network (`mainnet` \| `sepolia`) | No | `mainnet` |

## Procedure

```bash
npx mantle-scan-contract 0x<address>
npx mantle-scan-contract 0x<address> --network sepolia
npx mantle-scan-contract 0x<address> --json
```

Report whether it's a contract, the bytecode size, and the detected functions.

## Output

Is-contract flag, bytecode size, and detected functions (`selector → signature`).
Source: Mantle JSON-RPC `eth_getCode` + 4byte.directory — **keyless, no API key**.
Verified source/ABI metadata needs a Mantlescan key, but the on-chain bytecode
truth (and its selectors) is keyless.

## Verification

- An EOA (no bytecode) is reported as "not a contract"
- For a real contract, function selectors are extracted and (mostly) resolved to names

## Pitfalls

- Selector extraction is a bytecode heuristic — unresolved selectors are dropped; a
  proxy may expose few of the implementation's functions
- Pick the correct `--network`
