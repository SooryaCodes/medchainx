const Web3 = require('web3');
require('dotenv').config();

const { INFURA_PROJECT_ID } = process.env;

// Connect to the Ethereum mainnet via Infura
const web3 = new Web3(`https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`);

async function checkBlockchain() {
  try {
    // Get the latest block number
    const latestBlockNumber = await web3.eth.getBlockNumber();
    console.log(`Latest Block Number: ${latestBlockNumber}`);

    // Get the latest block details
    const latestBlock = await web3.eth.getBlock(latestBlockNumber);
    console.log(`Latest Block Details:`, latestBlock);

    // Get the balance of an address (replace with your address)
    const address = '0xYourEthereumAddress';
    const balance = await web3.eth.getBalance(address);
    console.log(`Balance of ${address}: ${web3.utils.fromWei(balance, 'ether')} ETH`);
  } catch (error) {
    console.error('Error checking blockchain:', error);
  }
}

checkBlockchain();