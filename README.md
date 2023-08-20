# Strands coding assignment

This repository contains the solution to the coding challenge posted.

It contains the required `function transferToken(address tokenAddress, address recipient, uint256 amount)` and `function transferEth(address payable recipient)` functions.

## Smart contracts

The smart contract has been deployed to Linea testnet @ [0x7f444B035E55C2956653f69F0366A7045a9bE846](https://goerli.lineascan.build/address/0x7f444b035e55c2956653f69f0366a7045a9be846).

In addition to this smart contract, a mock ERC-20 smart contract was deployed. It allows anyone to mint an arbitrary amount of tokens to any address to facilitate the _ERC-20_ transfer branch of the assignment. The mock token smart contract was deployed to [0x4359F4e97D7428bAFDFA5793514326a555af4159](https://goerli.lineascan.build/address/0x4359f4e97d7428bafdfa5793514326a555af4159).

**NOTE: Both smart contracts have been verified and can be examined at their respective links.**

## Transactions

Both flows of deposit and withdraw have been showcased:

### ERC-20 flow

1. Deposit: Tokens were minted directly to the `Strands` smart contract in transaction [0xf7df85547b46abb15ecf180201847a817df695112ee48f31d2ba1aedd3b4a7ca](https://goerli.lineascan.build/tx/0xf7df85547b46abb15ecf180201847a817df695112ee48f31d2ba1aedd3b4a7ca).
2. Withdrawal: Half of the tokens were withdrawn to the deployer address in transaction [0xf9c078a76a3eb3bd3af863b225fb811d6e990c902f9499c090e9e946aabfa8d1](https://goerli.lineascan.build/tx/0xf9c078a76a3eb3bd3af863b225fb811d6e990c902f9499c090e9e946aabfa8d1).

### Ether flow

1. Deposit: Ether was sent to the smart contract in transaction [0x35d30188054fe88eef4767cb022e8e2198350e074855092aa59ad22b81aee57e](https://goerli.lineascan.build/tx/0x35d30188054fe88eef4767cb022e8e2198350e074855092aa59ad22b81aee57e).
2. Withdrawal: Ether was withdrawn from the smart contract in transaction [0xdd6f321e0a2ea16109e987e7566462c492b06defded06d16de17772408e7cbed](https://goerli.lineascan.build/tx/0xdd6f321e0a2ea16109e987e7566462c492b06defded06d16de17772408e7cbed).

## Documentation

Documentation of the smart contracts can be found in the [`docs`](./docs/) directory.

The documentation of the solution smart contract can be found in [`Strands.md`](./docs/Strands.md) file.