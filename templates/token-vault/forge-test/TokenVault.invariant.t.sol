// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {TokenVaultHandler} from "./TokenVaultHandler.sol";

contract TokenVaultInvariantTest is Test {
    TokenVaultHandler public handler;

    function setUp() public {
        handler = new TokenVaultHandler();
        targetContract(address(handler.vault()));
    }

    function invariant_vaultBalanceMatchesRecorded() public view {
        assertEq(
            handler.token().balanceOf(address(handler.vault())),
            handler.recordedBalance()
        );
    }

    function invariant_ghostAccountingMatchesRecorded() public view {
        assertEq(handler.recordedBalance(), handler.ghostDeposited() - handler.ghostWithdrawn());
    }
}

contract TokenVaultFuzzTest is Test {
    TokenVaultHandler public handler;

    function setUp() public {
        handler = new TokenVaultHandler();
    }

    function testFuzz_depositWithdrawAccounting(uint256 depositAmt, uint256 withdrawAmt) public {
        depositAmt = bound(depositAmt, 1, 50 ether);
        withdrawAmt = bound(withdrawAmt, 1, depositAmt);

        handler.deposit(depositAmt);
        handler.withdraw(withdrawAmt);

        assertEq(handler.recordedBalance(), depositAmt - withdrawAmt);
        assertEq(handler.token().balanceOf(address(handler.vault())), depositAmt - withdrawAmt);
    }
}
