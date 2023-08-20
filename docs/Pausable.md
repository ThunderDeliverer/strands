# Pausable

*Jan Turk*

> Pausable

This smart contract is used to halt and resume operation of a smart contract.



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



## Events

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



## Errors

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




