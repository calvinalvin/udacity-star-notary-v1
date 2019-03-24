pragma solidity >= 0.5.2;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 {
  struct Star {
    string name;
  }

  mapping(uint256 => Star) public tokenIdToStarInfo;
  mapping(uint256 => uint256) public starsForSale;

  // Function that allows you to convert an address into a payable address
  function _makePayableAddress(address x) internal pure returns (address payable) {
    return address(uint160(x));
  }
  
  function createStar(string memory _name, uint256 _tokenId) public {
    Star memory newStar = Star(_name);
    tokenIdToStarInfo[_tokenId] = newStar;
    _mint(msg.sender, _tokenId);
  }

  function putUpForSale(uint256 _tokenId, uint256 _price) public {
    require(ownerOf(_tokenId) == msg.sender, "You can't sell what's not yours");
    starsForSale[_tokenId] = _price;
  }

  function buyStar(uint256 _tokenId) public payable {
    require(starsForSale[_tokenId] > 0, "The Star is not for sale");

    uint256 starCost = starsForSale[_tokenId];
    address ownerAddress = ownerOf(_tokenId);
    address payable ownerAddressPayable = _makePayableAddress(ownerAddress);

    require(msg.value >= starCost, "Not enough value was sent to buy Star");

    _transferFrom(ownerAddress, msg.sender, _tokenId);
    ownerAddressPayable.transfer(starCost);

    // if the sender sent more ether than needed, send back remainder
    if (msg.value > starCost) {
      msg.sender.transfer(msg.value - starCost);
    }
   
    // remove this _tokenId from starsForSale
    starsForSale[_tokenId] = 0;
  }
}
