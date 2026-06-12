// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TokenVault is ReentrancyGuard {
    using SafeERC20 for IERC20;

    error ZeroAddress();
    error ZeroAmount();
    error InsufficientBalance(uint256 available, uint256 requiredAmount);
    error NotOwner();
    error UnsupportedToken();
    error UnsupportedTokenBehavior();

    event Deposited(address indexed account, uint256 amount);
    event Withdrawn(address indexed account, uint256 amount);
    event Recovered(address indexed token, address indexed to, uint256 amount);

    address public immutable owner;
    IERC20 public immutable asset;

    mapping(address => uint256) private _balances;

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor(address assetAddress) {
        if (assetAddress == address(0)) revert ZeroAddress();
        owner = msg.sender;
        asset = IERC20(assetAddress);
    }

    function deposit(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();

        uint256 beforeBalance = asset.balanceOf(address(this));
        asset.safeTransferFrom(msg.sender, address(this), amount);
        uint256 received = asset.balanceOf(address(this)) - beforeBalance;
        if (received != amount) revert UnsupportedTokenBehavior();

        _balances[msg.sender] += amount;
        emit Deposited(msg.sender, amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        uint256 currentBalance = _balances[msg.sender];
        if (currentBalance < amount) revert InsufficientBalance(currentBalance, amount);

        uint256 beforeRecipientBalance = asset.balanceOf(msg.sender);
        unchecked {
            _balances[msg.sender] = currentBalance - amount;
        }
        asset.safeTransfer(msg.sender, amount);
        uint256 received = asset.balanceOf(msg.sender) - beforeRecipientBalance;
        if (received != amount) revert UnsupportedTokenBehavior();

        emit Withdrawn(msg.sender, amount);
    }

    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    function recoverForeignToken(address token, address to, uint256 amount) external onlyOwner nonReentrant {
        if (token == address(asset)) revert UnsupportedToken();
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();
        IERC20(token).safeTransfer(to, amount);
        emit Recovered(token, to, amount);
    }
}
