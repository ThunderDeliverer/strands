// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "./Ownable.sol";

/**
 * @title Pausable
 * @author Jan Turk
 * @notice This smart contract is used to halt and resume operation of a smart contract.
 */
contract Pausable is Ownable {
    bool private _paused;

    /**
     * @notice Emitted when operation is paused.
     */
    event OperationPaused();

    /**
     * @notice Emitted when operation is resumed.
     */
    event OperationResumed();

    /**
     * @notice Used to signal attempted call when operation was paused.
     */
    error Paused();

    /**
     * @notice Used to signal attempted call of a function that is only callable when operation is paused while the
     *  operation is paused.
     */
    error Operational();

    /**
     * @notice This modifier is used to prevent calling a function when the operation is not paused.
     * @dev If the operation is not paused, the execution is reverted.
     */
    modifier onlyWhenPaused{
        if (!_paused) revert Operational();
        _;
    }

    /**
     * @notice This modifier is used to prevent calling a function when the operation is paused.
     * @dev If the operation is paused, the execution is reverted.
     */
    modifier onlyWhenOperatonal{
        if (_paused) revert Paused();
        _;
    }

    /**
     * @notice Used to initialize the smart contract.
     * @dev It explicitly sets the `paused` variable to `false` even if this would be the state without setting it.
     */
    constructor() Ownable() {
        _paused = false;
    }

    /**
     * @notice Used to pause the operation of the smart contract.
     * @dev Can only be called by the owner of the smart conract.
     * @dev Can only be called when the operation is not paused.
     * @dev Emits **OperationPaused** event.
     */
    function pauseOperation() public onlyOwner onlyWhenOperatonal {
        _paused = true;
        emit OperationPaused();
    }

    /**
     * @notice Used to resume the operation of the smart contract.
     * @dev Can only be called by the owner of the smart contract.
     * @dev Can only be called when the operation is paused.
     * @dev Emits **OperationResumed** event.
     */
    function resumeOperation() public onlyOwner onlyWhenPaused {
        _paused = false;
        emit OperationResumed();
    }

    /**
     * @notice Used to retrieve the state of operation of the smart contract.
     * @return A boolean value signifying whether the operation is paused (`true`) or not (`false`)
     */
    function paused() public view returns(bool) {
        return _paused;
    }
}