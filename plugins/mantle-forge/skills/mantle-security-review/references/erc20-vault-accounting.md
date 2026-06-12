# ERC20 vault accounting checklist

Use this when reviewing vaults that accept ERC20 deposits and later allow withdrawals.

## Checkpoints

1. **Measure actual token movement**
   - On deposit, compare the vault balance before and after `transferFrom`.
   - On withdrawal, compare the recipient balance before and after `transfer`.

2. **Reject unsupported token behavior**
   - Fee-on-transfer tokens
   - Rebasing tokens
   - Deflationary / burn-on-transfer tokens
   - Any asset that can deliver fewer tokens than requested

3. **Prefer explicit failure over silent drift**
   - Revert with a custom error such as `UnsupportedTokenBehavior()` if actual movement differs from the expected amount.

4. **Test with hostile mocks**
   - Standard ERC20 happy path
   - Fee-on-transfer mock
   - Toggle-fee mock to prove both deposit and withdrawal protections

## Review note

If the vault is intentionally designed to support non-standard ERC20s, the accounting model needs to be redesigned; do not patch around it with a single balance check.