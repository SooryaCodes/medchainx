const HDWalletProvider = require('@truffle/hdwallet-provider');
const infuraKey = "d91c2310a2264e359739ab1b2b99f71a";
const mnemonic = "snow rebuild face insect enrich power hair spice truth share ahead tragic";

module.exports = {
  networks: {
    mainnet: {
      provider: () => new HDWalletProvider(mnemonic, `https://mainnet.infura.io/v3/${infuraKey}`),
      network_id: 1,       // Mainnet's id
      gas: 5500000,        // Gas limit
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
    polygon: {
      provider: () => new HDWalletProvider(mnemonic, `https://polygon-mainnet.infura.io/v3/${infuraKey}`),
      network_id: 137,     // Polygon's id
      gas: 5500000,        // Gas limit
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    }
  },
  compilers: {
    solc: {
      version: "0.8.0",    // Fetch exact version from solc-bin (default: truffle's version)
    }
  }
};