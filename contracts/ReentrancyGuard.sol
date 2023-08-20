// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

/**
 * @title ReentrancyGuard
 * @author Jan Turk
 * @notice This smart contract provides protection against reentrancy attacks.
 */
contract ReentrancyGuard {
    bool private _entered;

    /**
     * @notice This error is thrown if a function is called while it is already executing.
     */
    error Reentrancy();

    /**
     * @notice This modifier is used to prevent reentrancy attacks.
     * @dev If reentrant call is detected, the transaction is reverted.
     */
    modifier nonReentrant {
        if (_entered) revert Reentrancy();
        _entered = true;
        _;
        _entered = false;
    }

    /**
     * @notice Used to initialize the smart contract.
     * @dev Sets the _entered variable to false.
     */
    constructor() {
        _entered = false;
    }
}
