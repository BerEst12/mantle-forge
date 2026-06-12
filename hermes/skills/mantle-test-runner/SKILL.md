---
name: mantle-test-runner
description: Install dependencies, run Hardhat tests, capture failures, and suggest fixes.
version: 1.0.0
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [mantle, testing, hardhat]
    category: mantle-forge
    requires_toolsets: [terminal]
---

# Mantle Test Runner

## When to Use

- After scaffold or contract changes
- Before deploy and after security/gas patches
- User asks to run or fix tests

## Inputs

| Input | Required |
|-------|----------|
| Project directory | Yes |

## Procedure

1. `cd` to project directory
2. Install deps if `node_modules` missing: `npm install`
3. **Run CLI when available:** `npx mantle-check <project-dir>`
4. Run tests: `npx hardhat test`
5. Before deploy/hardening phase: ensure `test/*.invariants.ts` exists and passes via `npm run test:invariants` or `npx mantle-harden` (full gate)
6. On failure: capture failing test name, assertion, stack; propose minimal fix
7. Rerun until pass or escalate blocker to user

## Expected output

- Test summary: total / passing / failing
- For failures: root cause hypothesis and suggested patch
- Final pass/fail status

## Verification

- `npx hardhat test` exit code 0 for green path

## Pitfalls

- BigInt vs number mismatches in Chai — use `ethers.parseEther` and `.eq` matchers
- Running tests before compile — run compile first
