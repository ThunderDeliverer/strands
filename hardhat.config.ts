import * as dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@primitivefi/hardhat-dodoc';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.21',
    settings: {
      evmVersion: 'london',
    },
  },
  networks: {
    linea: {
      url: process.env.LINEA_TESTNET_URL || '',
      chainId: 59140,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      linea: process.env.LINEA_EXPLORER_API_KEY || '',
    },
    customChains: [
      {
        network: 'linea',
        chainId: 59140,
        urls: {
          apiURL: 'https://api-testnet.lineascan.build/api',
          browserURL: 'https://goerli.lineascan.build/',
        },
      },
    ],
  },
};

export default config;
