import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect } from 'chai';
import exp from 'constants';
import { copyOverrides } from 'ethers/lib.commonjs/contract/contract';
import { ethers } from 'hardhat';

describe('Strands', function () {
  async function deployContractsFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Strands = await ethers.getContractFactory('Strands');
    const strands = await Strands.deploy();

    const Token = await ethers.getContractFactory('MockToken');
    const token = await Token.deploy();

    return { strands, token, owner, otherAccount };
  }

  describe('Deployment', function () {
    it('should set the expected owner', async function () {
      const { strands, owner } = await loadFixture(deployContractsFixture);

      expect(await strands.owner()).to.eql(owner.address);
    });

    it('should set paused value to false', async function () {
      const { strands } = await loadFixture(deployContractsFixture);

      expect(await strands.paused()).to.eql(false);
    });
  });

  describe('Operation', function () {
    describe('Emergency stop', function () {
      it('should allow owner to pause and unpause the operation', async function () {
        const { strands, owner } = await loadFixture(deployContractsFixture);

        await expect(strands.connect(owner).pauseOperation()).to.emit(strands, 'OperationPaused');

        expect(await strands.paused()).to.eql(true);

        await expect(strands.connect(owner).resumeOperation()).to.emit(strands, 'OperationResumed');

        expect(await strands.paused()).to.eql(false);
      });

      it('should not allow to unpause operation of already unpaused smart contract', async function () {
        const { strands, owner } = await loadFixture(deployContractsFixture);

        await expect(strands.connect(owner).resumeOperation()).to.be.revertedWithCustomError(
          strands,
          'Operational',
        );
      });

      it('should not allow to pause already paused smart contract', async function () {
        const { strands, owner } = await loadFixture(deployContractsFixture);

        await strands.connect(owner).pauseOperation();

        await expect(strands.connect(owner).pauseOperation()).to.be.revertedWithCustomError(
          strands,
          'Paused',
        );
      });

      it('should not allow anyone other than owner to pause operation', async function () {
        const { strands, otherAccount } = await loadFixture(deployContractsFixture);

        await expect(strands.connect(otherAccount).pauseOperation()).to.be.revertedWithCustomError(
          strands,
          'NotOwner',
        );
      });

      it('should not allow anyone other than owner to resume operation', async function () {
        const { strands, owner, otherAccount } = await loadFixture(deployContractsFixture);

        await strands.connect(owner).pauseOperation();

        await expect(strands.connect(otherAccount).resumeOperation()).to.be.revertedWithCustomError(
          strands,
          'NotOwner',
        );
      });
    });

    describe('Ownership', function () {
      it('should allow owner to transfer ownership', async function () {
        const { strands, owner, otherAccount } = await loadFixture(deployContractsFixture);

        await expect(strands.connect(owner).transferOwnership(otherAccount.address))
          .to.emit(strands, 'OwnershipTransferred')
          .withArgs(owner.address, otherAccount.address);

        expect(await strands.owner()).to.eql(otherAccount.address);
      });

      it('should not allow anyone other than owner to transfer ownership', async function () {
        const { strands, otherAccount } = await loadFixture(deployContractsFixture);

        await expect(
          strands.connect(otherAccount).transferOwnership(otherAccount.address),
        ).to.be.revertedWithCustomError(strands, 'NotOwner');
      });
    });

    describe('Deposits & withdrawals', function () {
      it('should reflect the correct ERC-20 balance', async function () {
        const { strands, token } = await loadFixture(deployContractsFixture);

        expect(await strands.tokenBalance(await token.getAddress())).to.equal(0);

        await token.mint(await strands.getAddress(), 1000);

        expect(await strands.tokenBalance(await token.getAddress())).to.equal(1000);
      });

      it('should accept Ether deposits', async function () {
        const { strands, owner } = await loadFixture(deployContractsFixture);

        expect(await ethers.provider.getBalance(await strands.getAddress())).to.equal(0);

        await expect(
          owner.sendTransaction({
            to: await strands.getAddress(),
            value: ethers.parseEther('1.0'),
          }),
        )
          .to.emit(strands, 'EthDeposit')
          .withArgs(owner.address, ethers.parseEther('1.0'));

        expect(await ethers.provider.getBalance(await strands.getAddress())).to.equal(
          ethers.parseEther('1.0'),
        );
      });

      it('should allow owner to withdraw ERC-20 token', async function () {
        const { strands, owner, otherAccount, token } = await loadFixture(deployContractsFixture);

        await token.mint(await strands.getAddress(), 1000);

        expect(await token.balanceOf(otherAccount.address)).to.equal(0);
        expect(await token.balanceOf(await strands.getAddress())).to.equal(1000);

        await expect(
          strands.connect(owner).transferToken(await token.getAddress(), otherAccount.address, 500),
        )
          .to.emit(strands, 'TokenWithdrawal')
          .withArgs(await token.getAddress, otherAccount.address, 500);

        expect(await token.balanceOf(otherAccount.address)).to.equal(500);
        expect(await token.balanceOf(await strands.getAddress())).to.equal(500);
      });

      it('should allow owner to withdraw Ether', async function () {
        const { strands, owner, otherAccount } = await loadFixture(deployContractsFixture);

        const initialBalance = await ethers.provider.getBalance(await otherAccount.getAddress());

        await owner.sendTransaction({
          to: await strands.getAddress(),
          value: ethers.parseEther('1.0'),
        });

        expect(await ethers.provider.getBalance(await strands.getAddress())).to.equal(
          ethers.parseEther('1.0'),
        );
        expect(await ethers.provider.getBalance(otherAccount.address)).to.equal(initialBalance);

        await expect(strands.connect(owner).transferEth(otherAccount.address))
          .to.emit(strands, 'EthWithdrawal')
          .withArgs(otherAccount.address, ethers.parseEther('1.0'));

        expect(await ethers.provider.getBalance(await strands.getAddress())).to.equal(0);
        expect(await ethers.provider.getBalance(otherAccount.address)).to.equal(
          initialBalance + ethers.parseEther('1.0'),
        );
      });

      it("should not allow to withdraw more ERC-20 tokens than contract's balance", async function () {
        const { strands, owner, token } = await loadFixture(deployContractsFixture);

        await expect(
          strands.connect(owner).transferToken(await token.getAddress(), owner.address, 1000),
        )
          .to.be.revertedWithCustomError(strands, 'InsufficientTokenBalance')
          .withArgs(await token.getAddress(), 0, 1000);
      });

      it('should not allow to withdraw Ether if the smart contract has none', async function () {
        const { strands, owner } = await loadFixture(deployContractsFixture);

        await expect(
          strands.connect(owner).transferEth(owner.address),
        ).to.be.revertedWithCustomError(strands, 'EthBalanceZero');
      });

      it("should revert if the recipient of Ether can't receive it", async function () {
        const { strands, owner, token } = await loadFixture(deployContractsFixture);

        await owner.sendTransaction({
          to: await strands.getAddress(),
          value: ethers.parseEther('1.0'),
        });

        await expect(
          strands.connect(owner).transferEth(await token.getAddress()),
        ).to.be.revertedWithCustomError(strands, 'EthTransferFailed');
      });

      it('should not allow anyone other than owner to withdraw ERC-20 tokens', async function () {
        const { strands, otherAccount, token } = await loadFixture(deployContractsFixture);

        await expect(
          strands
            .connect(otherAccount)
            .transferToken(await token.getAddress(), otherAccount.address, 1000),
        ).to.be.revertedWithCustomError(strands, 'NotOwner');
      });

      it('should not allow anyone other than owner to withdraw Ether', async function () {
        const { strands, otherAccount } = await loadFixture(deployContractsFixture);

        await expect(
          strands.connect(otherAccount).transferEth(otherAccount.address),
        ).to.be.revertedWithCustomError(strands, 'NotOwner');
      });

      it('should not allow to withdraw ERC-20 tokens when operation is paused', async function () {
        const { strands, owner, token } = await loadFixture(deployContractsFixture);

        await strands.connect(owner).pauseOperation();

        await expect(
          strands.connect(owner).transferToken(await token.getAddress(), owner.address, 1000),
        ).to.be.revertedWithCustomError(strands, 'Paused');
      });

      it('should not allow to withdraw Ether when operation is paused', async function () {
        const { strands, owner } = await loadFixture(deployContractsFixture);

        await strands.connect(owner).pauseOperation();

        await expect(
          strands.connect(owner).transferEth(owner.address),
        ).to.be.revertedWithCustomError(strands, 'Paused');
      });
    });
  });
});
