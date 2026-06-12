# Tencent Cloud Hunyuan — Deep Security Audit

_Powered by [Tencent Cloud Hunyuan](https://cloud.tencent.com/product/hunyuan) (hunyuan-pro) — AI-assisted security review. Not a substitute for a professional audit._

**Overall risk level:** Low

## Executive summary

The TokenVault contract demonstrates a strong security posture for a single-asset ERC-20 vault. It correctly applies `ReentrancyGuard` on all state-changing external functions, uses OpenZeppelin's `SafeERC20` for transfer safety, and follows the checks-effects-interactions pattern in `withdraw`. The two identified findings are low-severity design observations rather than exploitable vulnerabilities.

## Mantle L2 assessment

No cross-layer (L1↔L2) risks detected — the contract does not interact with Mantle bridge contracts or make assumptions about L1 finality. Gas costs for `deposit` and `withdraw` are consistent with Mantle Sepolia's reduced fee model; no unbounded loops or excessive storage operations were found. The contract is fully compatible with Mantle's EVM equivalence.

## Finding counts

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 2 |
| Informational | 2 |

## Findings

### [Low] Owner is a single immutable EOA with no transfer mechanism

- **ID:** TC-001
- **Category:** Access Control
- **Location:** `TokenVault.sol:constructor`
- **Impact:** If the deployer wallet is compromised or lost, ownership cannot be transferred. The `recoverForeignToken` admin function becomes permanently inaccessible, locking any accidentally sent foreign tokens.
- **Recommendation:** Replace the immutable `owner` pattern with OpenZeppelin `Ownable2Step` to allow safe two-step ownership transfers.

```solidity
address public immutable owner; // no transfer path
constructor(address assetAddress) {
    owner = msg.sender;          // locked to deployer forever
```

---

### [Low] Fee-on-transfer tokens revert silently with UnsupportedTokenBehavior

- **ID:** TC-002
- **Category:** Logic
- **Location:** `TokenVault.sol:deposit` (line 44)
- **Impact:** The `received != amount` guard correctly rejects fee-on-transfer tokens, but the revert reason (`UnsupportedTokenBehavior`) may be unclear to integrators who do not read the source. A misconfigured deployment with a fee token will fail at runtime rather than at deploy time.
- **Recommendation:** Add a `constructor`-level check that verifies the asset is not a fee-on-transfer token (e.g., deposit 1 wei and verify received == 1), or document the limitation explicitly in NatSpec.

```solidity
uint256 received = asset.balanceOf(address(this)) - beforeBalance;
if (received != amount) revert UnsupportedTokenBehavior(); // silent to integrators
```

---

### [Informational] unchecked block in withdraw is safe but requires reader trust

- **ID:** TC-003
- **Category:** Arithmetic
- **Location:** `TokenVault.sol:withdraw` (line 56)
- **Impact:** No overflow risk — the subtraction is bounded by the `currentBalance < amount` check on line 53. However, the `unchecked` block requires the reader to verify the guard manually, reducing auditability.
- **Recommendation:** Add a NatSpec comment above the `unchecked` block explaining why underflow is impossible.

```solidity
unchecked {
    _balances[msg.sender] = currentBalance - amount; // safe: checked above
}
```

---

### [Informational] No pause mechanism for emergency response

- **ID:** TC-004
- **Category:** Access Control
- **Location:** `TokenVault.sol` (contract level)
- **Impact:** If a vulnerability is discovered post-deployment, there is no way to halt deposits/withdrawals while a fix is prepared. This is acceptable for a minimal vault but worth noting for production use.
- **Recommendation:** For production deployments, consider adding OpenZeppelin `Pausable` with an owner-controlled `pause()` / `unpause()`. For the hackathon scope, this is out of scope.

---

## Positive patterns observed

- `ReentrancyGuard` applied to all state-changing functions (`deposit`, `withdraw`, `recoverForeignToken`)
- `SafeERC20` used for all ERC-20 interactions — prevents silent transfer failures
- Checks-effects-interactions pattern correctly followed in `withdraw` (balance updated before `safeTransfer`)
- Custom errors used throughout (`ZeroAddress`, `ZeroAmount`, `InsufficientBalance`) — gas-efficient and readable
- `balanceOf` is private mapping with public accessor — no direct storage exposure
- `recoverForeignToken` correctly blocks recovery of the primary `asset` token
- `asset` and `owner` are `immutable` — reduces attack surface

## Agent verification tasks

- [ ] Confirm `ReentrancyGuard` is inherited from `@openzeppelin/contracts` v5.x (verify `package.json`)
- [ ] Verify `SafeERC20.safeTransferFrom` reverts correctly when `transferFrom` returns false
- [ ] Test TC-001 scenario: deploy with a test wallet, verify `recoverForeignToken` is inaccessible after wallet loss simulation
- [ ] Test TC-002 scenario: attempt deposit with a mock fee-on-transfer token — confirm revert with `UnsupportedTokenBehavior`
- [ ] Document the EOA owner limitation in `FINAL_REPORT.md` as a known production consideration

## Next steps

1. Fix Critical and High findings before deployment.
2. Cross-reference with `reports/security.md` (mantle-audit static analysis).
3. Rerun `npx mantle-tencent-audit` after fixes to confirm resolution.
4. Label output as **agent-assisted hardening** — not a professional audit.
