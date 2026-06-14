// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title TokenVaultBaseline
/// @notice Intentionally UNOPTIMIZED, functionally-equivalent twin of TokenVault.
///         Used only as the "before" baseline for the gas benchmark — it deliberately
///         uses common gas anti-patterns so the optimization delta is measurable and real:
///           - `owner`/`asset` in regular storage instead of `immutable` (SLOAD per use + larger deploy)
///           - `require(<string>)` instead of custom errors (larger bytecode, more revert-path gas)
///           - no `unchecked` on a subtraction that is already range-checked
///           - redundant storage reads instead of caching the balance in memory
///         Behaviour on the happy path is identical to TokenVault.
contract TokenVaultBaseline is ReentrancyGuard {
    using SafeERC20 for IERC20;

    event Deposited(address indexed account, uint256 amount);
    event Withdrawn(address indexed account, uint256 amount);
    event Recovered(address indexed token, address indexed to, uint256 amount);

    // Anti-pattern: regular storage instead of immutable.
    address public owner;
    IERC20 public asset;

    mapping(address => uint256) private _balances;

    modifier onlyOwner() {
        require(msg.sender == owner, "TokenVault: not owner");
        _;
    }

    constructor(address assetAddress) {
        require(assetAddress != address(0), "TokenVault: zero address");
        owner = msg.sender;
        asset = IERC20(assetAddress);
    }

    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "TokenVault: zero amount");

        uint256 beforeBalance = asset.balanceOf(address(this));
        asset.safeTransferFrom(msg.sender, address(this), amount);
        uint256 received = asset.balanceOf(address(this)) - beforeBalance;
        require(received == amount, "TokenVault: unsupported token behavior");

        // Anti-pattern: read-modify-write without caching.
        _balances[msg.sender] = _balances[msg.sender] + amount;
        emit Deposited(msg.sender, amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "TokenVault: zero amount");
        // Anti-pattern: re-reads _balances[msg.sender] from storage multiple times.
        require(_balances[msg.sender] >= amount, "TokenVault: insufficient balance");

        uint256 beforeRecipientBalance = asset.balanceOf(msg.sender);
        // Anti-pattern: checked subtraction even though the require above guarantees no underflow.
        _balances[msg.sender] = _balances[msg.sender] - amount;
        asset.safeTransfer(msg.sender, amount);
        uint256 received = asset.balanceOf(msg.sender) - beforeRecipientBalance;
        require(received == amount, "TokenVault: unsupported token behavior");

        emit Withdrawn(msg.sender, amount);
    }

    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    function recoverForeignToken(address token, address to, uint256 amount) external onlyOwner nonReentrant {
        require(token != address(asset), "TokenVault: unsupported token");
        require(to != address(0), "TokenVault: zero address");
        require(amount > 0, "TokenVault: zero amount");
        IERC20(token).safeTransfer(to, amount);
        emit Recovered(token, to, amount);
    }
}
