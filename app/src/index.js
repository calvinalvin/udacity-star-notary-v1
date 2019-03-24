import Web3 from 'web3';
import starNotaryArtifact from '../../build/contracts/StarNotary.json';

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const {web3} = this;

    try {
      // get contract instance
      //This method find the network id to retrieve the configuration from truffle-config.js file
      const networkId = await web3.eth.net.getId();

      // Retrieve the Network configuration from truffle-config.js file
      const deployedNetwork = starNotaryArtifact.networks[networkId];

      // Initializing the contract
      this.meta = new web3.eth.Contract(
        starNotaryArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts(); // Getting test accounts
      this.account = accounts[0]; // Assigning a test account
    } catch (error) {
      console.error('Could not connect to contract or chain.');
    }
  },

  // function to update the status message in the page
  setStatus: function(message) {
    const status = document.getElementById('status');
    status.innerHTML = message;
  },

  // function called to show the starName
  starNameFunc: async function() {
    // to be able to use the functions in your Smart Contract use destructuring to get the function to be call
    const {starName} = this.meta.methods;
    // calling the starName property from your Smart Contract.
    const response = await starName().call();
    const name = document.getElementById('name');
    console.log("starName response ---", response);
    console.log('owner is ----- ', name);
    name.innerHTML = response;
  },

  // function called to show the starOwner
  starOwnerFunc: async function() {
    // to be able to use the functions in your Smart Contract use destructuring to get the function to be call
    const {starOwner} = this.meta.methods;

    // calling the starOwner property from your Smart Contract.
    const response = await starOwner().call();
    console.log('starOwner response ----', response);
    const owner = document.getElementById('owner');
    owner.innerHTML = response;
  },

  // function called to claim a Star
  claimStarFunc: async function() {
    // to be able to use the functions in your Smart Contract use destructuring to get the function to be call=
    const {claimStar, starOwner} = this.meta.methods;
    await claimStar().send({from: this.account});

    // Use `send` instead of `call` when you called a function in your Smart Contract
    const response = await starOwner().call();
    App.setStatus('New Star Owner is ' + response + '.');
  },
};

window.App = App;

window.addEventListener('load', function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live',
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider('http://127.0.0.1:9545'),
    );
  }

  App.start();
});
