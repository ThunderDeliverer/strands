// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

/**
 * @title Ownable
 * @author Jan Turk
 * @notice This smart contract is used to manage ownership of other smart contracts.
 */
contract Ownable {
    address private _owner;

    /**
     * @notice This event is emitted when ownership of a smart contract is transferred.
     * @param previousOwner The owner that transferred the ownership
     * @param newOwner The new owner of the smart contract
     */
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @notice This error is thrown when a function is called by a non-owner.
     */
    error NotOwner();

    /**
     * @notice This modifier is used to restrict a function to the owner of the smart contract.
     */
    modifier onlyOwner {
        if (msg.sender != _owner) revert NotOwner();
        _;
    }

    /**
     * @notice Used to initialize the smart contract.
     * @dev The original owner is initialized to be the deployer of the smart contract.
     */
    constructor() {
        _owner = msg.sender;
    }

    /**
     * @notice Used to get the owner of the smart contract.
     * @dev Explicitly specifying the veiw function and not relying on the autogenerated getter of the public variable
     *  saves gas.
     * @return The address of the owner of the smart contract
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @notice Used to transfer ownership of the smart contract.
     * @dev Only the owner of the smart contract can call this function.
     * @dev The function emits an **OwnershipTransferred** event.
     * @param newOwner The address of the new owner of the smart contract
     */
    function transferOwnership(address newOwner) public onlyOwner {
        _owner = newOwner;
        emit OwnershipTransferred(msg.sender, newOwner);
    }
}
