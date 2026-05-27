// Import Web3 (make sure web3 is installed: npm install web3)
const Web3 = require('web3');

// Connect to an Ethereum node (e.g., Infura, Alchemy, or local node)
//const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');

// Address to check
const address = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4'; // Replace with the address you want

// Fetch the balance
web3.eth.getBalance(address)
  .then(balance => {
    console.log('Balance in Wei:', balance);
    console.log('Balance in Ether:', web3.utils.fromWei(balance, 'ether'));
  })
  .catch(err => {
    console.error('Error fetching balance:', err);
  });