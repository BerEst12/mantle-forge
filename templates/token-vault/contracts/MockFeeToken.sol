// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockFeeToken is ERC20 {
    uint256 public constant INITIAL_SUPPLY = 1_000_000 ether;
    uint256 public constant FEE_BPS = 100;
    address public immutable feeRecipient;

    constructor() ERC20("Mock Fee Token", "FEE") {
        feeRecipient = msg.sender;
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function _update(address from, address to, uint256 value) internal override {
        if (from != address(0) && to != address(0) && value > 0) {
            uint256 fee = value / FEE_BPS;
            uint256 sendAmount = value - fee;
            super._update(from, feeRecipient, fee);
            super._update(from, to, sendAmount);
        } else {
            super._update(from, to, value);
        }
    }
}
