// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {TokenVault} from "../contracts/TokenVault.sol";
import {DemoToken} from "../contracts/DemoToken.sol";

/// @dev Foundry handler for invariant/fuzz testing of TokenVault accounting.
contract TokenVaultHandler is Test {
    DemoToken public token;
    TokenVault public vault;
    address public actor;

    uint256 public ghostDeposited;
    uint256 public ghostWithdrawn;

    constructor() {
        token = new DemoToken();
        vault = new TokenVault(address(token));
        actor = address(0xA11CE);
        token.transfer(actor, 10_000 ether);
    }

    function deposit(uint256 amount) external {
        amount = bound(amount, 1, 100 ether);
        vm.startPrank(actor);
        token.approve(address(vault), amount);
        vault.deposit(amount);
        vm.stopPrank();
        ghostDeposited += amount;
    }

    function withdraw(uint256 amount) external {
        uint256 bal = vault.balanceOf(actor);
        if (bal == 0) return;
        amount = bound(amount, 1, bal);
        vm.prank(actor);
        vault.withdraw(amount);
        ghostWithdrawn += amount;
    }

    function recordedBalance() external view returns (uint256) {
        return vault.balanceOf(actor);
    }
}
