//import 'babel-polyfill';

// Importing the StartNotary Smart Contract ABI (JSON representation of the Smart Contract)
const StarNotary = artifacts.require('StarNotary');

var accounts; // List of development accounts provided by Truffle
var owner; // Global variable use it in the tests cases
var secondOwner;

// This called the StartNotary Smart contract and initialize it
contract('StarNotary', accs => {
  accounts = accs; // Assigning test accounts
  owner = accounts[0]; // Assigning the owner test account
  secondOwner = accounts[1];
});


it('can create a Star', async() => {
  let instance = await StarNotary.deployed();

  // console.log('instance -=----- ', instance);
  
  let tokenId = 1;
  await instance.createStar('My Star!', tokenId, {from: owner});
  assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'My Star!');
});

it('lets secondOwner put up their star for sale', async() => {
  let instance = await StarNotary.deployed();
  let starId = 2;
  let starPrice = web3.utils.toWei(".01", "ether");
  await instance.createStar('awesome star', starId, {from: secondOwner});
  await instance.putUpForSale(starId, starPrice, {from: secondOwner});
  assert.equal(await instance.starsForSale.call(starId), starPrice);
});
