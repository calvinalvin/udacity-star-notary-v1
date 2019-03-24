//import 'babel-polyfill';

// Importing the StartNotary Smart Contract ABI (JSON representation of the Smart Contract)
const StarNotary = artifacts.require('StarNotary.sol');

var accounts; // List of development accounts provided by Truffle
var owner; // Global variable use it in the tests cases
var secondOwner;

// This called the StartNotary Smart contract and initialize it
contract('StarNotary', accs => {
  accounts = accs; // Assigning test accounts
  owner = accounts[0]; // Assigning the owner test account
  secondOwner = accounts[1];

});

// Example test case, it will test if the contract is able to return the starName property
// initialized in the contract constructor
it('has correct name', async () => {
  // Making sure the Smart Contract is deployed and getting the instance.
  let instance = await StarNotary.deployed();

  // Calling the starName property
  let starName = await instance.starName.call();

  // Assert if the starName property was initialized correctly
  assert.equal(starName, 'Awesome Udacity Star');
});

it('can claim a start and change owners', async () => {
  let instance = await StarNotary.deployed();
  await instance.claimStar({from: owner});
  assert.equal(await instance.starOwner.call(), owner);

  await instance.claimStar({from: secondOwner});
  assert.equal(await instance.starOwner.call(), secondOwner);
});


