# Strands

*Jan Turk*

> Strands

This smart contract is used to receive Ether and ERC20 token deposits.



## Methods

### owner

```solidity
function owner() external view returns (address)
```

Used to get the owner of the smart contract.

*Explicitly specifying the veiw function and not relying on the autogenerated getter of the public variable  saves gas.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | The address of the owner of the smart contract |

### pauseOperation

```solidity
function pauseOperation() external nonpayable
```

Used to pause the operation of the smart contract.

*Can only be called by the owner of the smart conract.Can only be called when the operation is not paused.Emits **OperationPaused** event.*


### paused

```solidity
function paused() external view returns (bool)
```

Used to retrieve the state of operation of the smart contract.




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | A boolean value signifying whether the operation is paused (`true`) or not (`false`) |

### resumeOperation

```solidity
function resumeOperation() external nonpayable
```

Used to resume the operation of the smart contract.

*Can only be called by the owner of the smart contract.Can only be called when the operation is paused.Emits **OperationResumed** event.*


### tokenBalance

```solidity
function tokenBalance(address tokenAddress) external view returns (uint256)
```

Used to get the ERC-20 token balance of this smart contract.



#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenAddress | address | Address of the ERC-20 token smart contract to check for balance |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | ERC-20 token balance of this smart contract |

### transferEth

```solidity
function transferEth(address payable recipient) external nonpayable
```

Used to withdraw Ether.

*The function emits an **EthWithdrawal** event.The function reverts if the smart contract doesn&#39;t have any Ether.The function can only be called by the owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| recipient | address payable | Address of the account to withdraw the Ether to |

### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```

Used to transfer ownership of the smart contract.

*Only the owner of the smart contract can call this function.The function emits an **OwnershipTransferred** event.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | The address of the new owner of the smart contract |

### transferToken

```solidity
function transferToken(address tokenAddress, address recipient, uint256 amount) external nonpayable
```

Used to withdraw ERC20 tokens.

*The function emits a **TokenWithdrawal** event.It makes no sense to add the mirror deposit function, since the ERC20 smart contract doesn&#39;t interact with  the receiving address.The function reverts if the smart contract doesn&#39;t have enough tokens.The function can only be called by the owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenAddress | address | Address of the ERC-20 token smart contract |
| recipient | address | Address of the account to withdraw the tokens to |
| amount | uint256 | Amount of tokens to withdraw |



## Events

### EthDeposit

```solidity
event EthDeposit(address indexed sender, uint256 amount)
```

Emitted when Ether is deposited.



#### Parameters

| Name | Type | Description |
|---|---|---|
| sender `indexed` | address | Address of the account that deposited the Ether |
| amount  | uint256 | Amount of Ether that was deposited |

### EthWithdrawal

```solidity
event EthWithdrawal(address indexed recipient, uint256 amount)
```

Emitted when Ether is withdrawn.



#### Parameters

| Name | Type | Description |
|---|---|---|
| recipient `indexed` | address | Address of the account that received the Ether |
| amount  | uint256 | The amount of Ether the address received |

### OperationPaused

```solidity
event OperationPaused()
```

Emitted when operation is paused.




### OperationResumed

```solidity
event OperationResumed()
```

Emitted when operation is resumed.




### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```

This event is emitted when ownership of a smart contract is transferred.



#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | The owner that transferred the ownership |
| newOwner `indexed` | address | The new owner of the smart contract |

### TokenWithdrawal

```solidity
event TokenWithdrawal(address indexed token, address indexed recipient, uint256 amount)
```

Emitted when an ERC-20 token is withdrawn.



#### Parameters

| Name | Type | Description |
|---|---|---|
| token `indexed` | address | Address of the ERC-20 token smart contract |
| recipient `indexed` | address | Address of the account that received the tokens |
| amount  | uint256 | The amount of tokens the address received |



## Errors

### EthBalanceZero

```solidity
error EthBalanceZero()
```

Used to signal zero Ether balance.




### EthTransferFailed

```solidity
error EthTransferFailed()
```

Used to signal failed Ether transfer.




### InsufficientTokenBalance

```solidity
error InsufficientTokenBalance(address token, uint256 balance, uint256 desiredAmount)
```

Used to signal insufficient ERC-20 token balance.



#### Parameters

| Name | Type | Description |
|---|---|---|
| token | address | Address of the ERC-20 token smart contract |
| balance | uint256 | Balance of the ERC-20 token of this smart contract |
| desiredAmount | uint256 | Amount of ERC-20 tokens that were attempted to transfer |

### NotOwner

```solidity
error NotOwner()
```

This error is thrown when a function is called by a non-owner.




### Operational

```solidity
error Operational()
```

Used to signal attempted call of a function that is only callable when operation is paused while the  operation is paused.




### Paused

```solidity
error Paused()
```

Used to signal attempted call when operation was paused.




### Reentrancy

```solidity
error Reentrancy()
```

This error is thrown if a function is called while it is already executing.





