import { ethers, run } from 'hardhat';

async function main() {
  const accounts = await ethers.getSigners()
  console.log("Depoying smart contracts");

  const strands = await ethers.deployContract('Strands');
  await strands.waitForDeployment();

  const token = await ethers.deployContract('MockToken');
  await token.waitForDeployment();

  console.log(`Strands deployed to ${await strands.getAddress()} and mock token deployed to ${await token.getAddress()}.`);

  console.log("Minting tokens to Strands");
  await token.mint(await strands.getAddress(), 1000);

  console.log("Withdrawing tokens");
  await strands.transferToken(await token.getAddress(), accounts[0].address, 500);

  console.log("Depositing Ether");
  await accounts[0].sendTransaction({
    to: await strands.getAddress(),
    value: 50
  });

  console.log("Withdrawing Ether");
  await strands.transferEth(accounts[0].address);

  console.log("Verifying contracts");
  
  try {
    await run('verify:verify', {
      address: await strands.getAddress(),
      contract: 'contracts/Strands.sol:Strands',
      constructorArguments: [],
    });
  } catch (e) {
    console.log('Verification error', e);
  }
  
  try {
    await run('verify:verify', {
      address: await token.getAddress(),
      contract: 'contracts/mocks/MockToken.sol:MockToken',
      constructorArguments: [],
    });
  } catch (e) {
    console.log('Verification error', e);
  }
  
  console.log("Done!")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
