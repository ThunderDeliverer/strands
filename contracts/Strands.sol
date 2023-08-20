// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "./ReentrancyGuard.sol";
import "./Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title Strands
 * @author Jan Turk
 * @notice This smart contract is used to receive Ether and ERC20 token deposits.
 */
contract Strands is ReentrancyGuard, Pausable {
    /**
     * @notice Emitted when an ERC-20 token is withdrawn.
     * @param token Address of the ERC-20 token smart contract
     * @param recipient Address of the account that received the tokens
     * @param amount The amount of tokens the address received
     */
    event TokenWithdrawal(address indexed token, address indexed recipient, uint256 amount);

    /**
     * @notice Emitted when Ether is withdrawn.
     * @param recipient Address of the account that received the Ether
     * @param amount The amount of Ether the address received
     */
    event EthWithdrawal(address indexed recipient, uint256 amount);

    /**
     * @notice Emitted when Ether is deposited.
     * @param sender Address of the account that deposited the Ether
     * @param amount Amount of Ether that was deposited
     */
    event EthDeposit(address indexed sender, uint256 amount);

    /**
     * @notice Used to signal failed Ether transfer.
     */
    error EthTransferFailed();

    /**
     * @notice Used to signal insufficient ERC-20 token balance.
     * @param token Address of the ERC-20 token smart contract
     * @param balance Balance of the ERC-20 token of this smart contract
     * @param desiredAmount Amount of ERC-20 tokens that were attempted to transfer
     */ 
    error InsufficientTokenBalance(address token, uint256 balance, uint256 desiredAmount);

    /**
     * @notice Used to signal zero Ether balance.
     */
    error EthBalanceZero();

    /**
     * @notice Used to initialize the smart contract.
     */
    constructor() Pausable() ReentrancyGuard() {}

    /**
     * @notice Used to receive Ether deposits.
     * @dev This function is called when Ether is sent to the smart contract.
     * @dev The function emits an **EthDeposit** event.
     */
    receive() external payable {
        emit EthDeposit(msg.sender, msg.value);
    }

    /**
     * @notice Used to withdraw ERC20 tokens.
     * @dev The function emits a **TokenWithdrawal** event.
     * @dev It makes no sense to add the mirror deposit function, since the ERC20 smart contract doesn't interact with
     *  the receiving address.
     * @dev The function reverts if the smart contract doesn't have enough tokens.
     * @dev The function can only be called by the owner.
     * @param tokenAddress Address of the ERC-20 token smart contract
     * @param recipient Address of the account to withdraw the tokens to
     * @param amount Amount of tokens to withdraw
     */
    function transferToken(
        address tokenAddress,
        address recipient,
        uint256 amount
    ) public onlyOwner onlyWhenOperatonal nonReentrant {
        IERC20 token = IERC20(tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        if (amount > balance) {
            revert InsufficientTokenBalance(tokenAddress, balance, amount);
        }
        token.transfer(recipient, amount);
        emit TokenWithdrawal(tokenAddress, recipient, amount);
    }

    /**
     * @notice Used to withdraw Ether.
     * @dev The function emits an **EthWithdrawal** event.
     * @dev The function reverts if the smart contract doesn't have any Ether.
     * @dev The function can only be called by the owner.
     * @param recipient Address of the account to withdraw the Ether to
     */
    function transferEth(address payable recipient) public onlyOwner onlyWhenOperatonal {
        uint256 balance = address(this).balance;
        if (balance == 0) {
            revert EthBalanceZero();
        }
        ( bool success, ) = recipient.call{value: address(this).balance}("");
        if (!success) {
            revert EthTransferFailed();
        }
        emit EthWithdrawal(recipient, balance);
    }

    /**
     * @notice Used to get the ERC-20 token balance of this smart contract.
     * @param tokenAddress Address of the ERC-20 token smart contract to check for balance
     * @return ERC-20 token balance of this smart contract
     */
    function tokenBalance(address tokenAddress) public view returns (uint256) {
        return IERC20(tokenAddress).balanceOf(address(this));
    }
}
