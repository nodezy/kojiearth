// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IKojiNFT {
  function getNFTwindow(uint256 _nftID) external view returns (uint256, uint256, uint256);
  function getNFTInfo(uint256 _nftID) external view returns(string[] memory, uint256[] memory, bool[] memory); 
  function getNFTIDbyURI(string memory _uri) external view returns (uint256);
}

contract KojiMarket is Ownable, IERC721Receiver, ReentrancyGuard {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    Counters.Counter public _itemsHeld;
    Counters.Counter public _itemsSold;
    Counters.Counter public _itemsTotal;

    uint256 listingFee = 0.0025 ether;
    uint256 buyingFee = 0.0025 ether;
    
    mapping(uint256 => MarketItem) public idToMarketItem;
    uint256[] public heldtokens;
    uint256[] public soldtokens;
    
    struct MarketItem {
      uint256 tokenId;
      uint256 price;
      uint128 tier;
      uint128 page;
      address payable seller;
      address payable owner;
      bool sold;
    }

    event MarketItemCreated (
      uint256 indexed tokenId,
      uint256 price,
      address seller,
      address owner,
      bool sold
    );

    
    uint256 public feeTotals;
    address NFTcontract = 0xe565Db982C546B14fc93dD428b17678D0E44F9c6;

    constructor() {}   

    receive() external payable {}

    /* Updates the listing price of the contract */
    function updatelistingFee(uint _listingFee) external onlyOwner {
      listingFee = _listingFee;
    }

    /* Updates the buying price of the contract */
    function updatebuyingFee(uint _buyingFee) external onlyOwner {
      buyingFee = _buyingFee;
    }

    /* Returns the listing price of the contract */
    function getlistingFee() public view returns (uint256) {
      return listingFee;
    }

    function getbuyingFee() public view returns (uint256) {
      return buyingFee;
    }

    function createMarketItem(
      uint256 tokenId,
      uint256 price
    ) external payable nonReentrant {
      require(price > 0, "Price must be at least 1 wei");
      require(msg.value == listingFee, "Please include listing fee in order to list the item");
      
      (,uint timeend,) = IKojiNFT(NFTcontract).getNFTwindow(IKojiNFT(NFTcontract).getNFTIDbyURI(ERC721(NFTcontract).tokenURI(tokenId)));
      require(block.timestamp > timeend, "Listing enabled once BNB Purchase window ends for this page");

      heldtokens.push(tokenId);

      idToMarketItem[tokenId].tokenId = tokenId;
      idToMarketItem[tokenId].price = price;

      string memory _uri = ERC721(NFTcontract).tokenURI(tokenId);
      uint _nftid = IKojiNFT(NFTcontract).getNFTIDbyURI(_uri); 

      string[] memory strings = new string[](4);
      (strings,,) = IKojiNFT(NFTcontract).getNFTInfo(_nftid);

      if (keccak256(bytes(_uri)) == keccak256(bytes(strings[2]))) {
        idToMarketItem[tokenId].tier = 1;
      } else {
        idToMarketItem[tokenId].tier = 2;
      }
      
      idToMarketItem[tokenId].page = uint128(_nftid);
      idToMarketItem[tokenId].seller = payable(msg.sender);
      idToMarketItem[tokenId].owner = payable(address(this));
      idToMarketItem[tokenId].sold = false;

      IERC721(NFTcontract).safeTransferFrom(msg.sender, address(this), tokenId);

      payable(this).transfer(listingFee);

      feeTotals = feeTotals.add(listingFee);

      _itemsHeld.increment();
      _itemsTotal.increment();
      
      emit MarketItemCreated(
        tokenId,
        price,
        msg.sender,
        address(this),
        false
      );
    }

    /* allows someone to remove a token they have listed */
    function removeMarketItem(uint256 tokenId) external nonReentrant {

      require(idToMarketItem[tokenId].owner == msg.sender, "Only item owner can perform this operation");
      
      idToMarketItem[tokenId].sold = false;
      idToMarketItem[tokenId].price = 0;
      idToMarketItem[tokenId].seller = payable(address(0));
      idToMarketItem[tokenId].owner = payable(address(0));
      _itemsHeld.decrement();

      for(uint x=0; x<heldtokens.length; x++) {                                     
        if(heldtokens[x] == tokenId) {
            heldtokens[x] = heldtokens[heldtokens.length-1];
            heldtokens.pop();
        }
      }

      IERC721(NFTcontract).safeTransferFrom(address(this), msg.sender, tokenId);
    }

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(
      uint256 tokenId
      ) external payable nonReentrant {
      uint price = idToMarketItem[tokenId].price;
      address seller = idToMarketItem[tokenId].seller;
      require(msg.value == price.add(buyingFee), "Please submit the asking price + fee in order to complete the purchase");

      idToMarketItem[tokenId].owner = payable(msg.sender);
      idToMarketItem[tokenId].sold = true;
      idToMarketItem[tokenId].seller = payable(address(0));

      _itemsHeld.decrement();
      _itemsSold.increment();

      IERC721(NFTcontract).safeTransferFrom(address(this), msg.sender, tokenId);
      payable(this).transfer(buyingFee);
      feeTotals = feeTotals.add(buyingFee);
      payable(seller).transfer(msg.value.sub(buyingFee));

      for(uint x=0; x<heldtokens.length; x++) {                                     
        if(heldtokens[x] == tokenId) {
            heldtokens[x] = heldtokens[heldtokens.length-1];
            heldtokens.pop();
        }
      }

      soldtokens.push(tokenId);
    }

    /* Returns all unsold market items */
    function fetchMarketItems() public view returns (MarketItem[] memory) {

      uint itemCount = _itemsHeld.current();

      if(itemCount > 0) {

        uint unsoldItemCount = _itemsHeld.current();
        uint currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint i = 0; i < itemCount; i++) {
            if (idToMarketItem[heldtokens[i]].owner == address(this)) {
            MarketItem storage currentItem = idToMarketItem[heldtokens[i]];
            items[currentIndex] = currentItem;
            currentIndex++;
            }
        }
        return items;

      } else {
        return new MarketItem[](0);
      }       
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {

      if(soldtokens.length > 0) {
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < soldtokens.length; i++) {
            if (idToMarketItem[soldtokens[i]].owner == msg.sender) {
            itemCount++;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < soldtokens.length; i++) {
            if (idToMarketItem[soldtokens[i]].owner == msg.sender) {
            MarketItem storage currentItem = idToMarketItem[soldtokens[i]];
            items[currentIndex] = currentItem;
            currentIndex++;
            }
        }
        return items;

      } else {
        return new MarketItem[](0);
      }
    }

    /* Returns only items a user has listed */
    function fetchItemsListed() public view returns (MarketItem[] memory) {
      uint totalItemCount = _itemsHeld.current();

      if(totalItemCount > 0) {
            uint itemCount = 0;
            uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[heldtokens[i]].seller == msg.sender) {
            itemCount++;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[heldtokens[i]].seller == msg.sender) {
            MarketItem storage currentItem = idToMarketItem[heldtokens[i]];
            items[currentIndex] = currentItem;
            currentIndex++;
            }
        }
        
        return items;

      } else {
        return new MarketItem[](0);
      }
    }

     function onERC721Received(address, address, uint256, bytes memory) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    // This will allow to rescue ETH sent by mistake directly to the contract
    function rescueETHFromContract() external onlyOwner {
        address payable _owner = payable(_msgSender());
        _owner.transfer(address(this).balance);
    }

    // Function to allow admin to claim *other* ERC20 tokens sent to this contract (by mistake)
    function transferERC20Tokens(address _tokenAddr, address _to, uint _amount) public onlyOwner {
       
        IERC20(_tokenAddr).transfer(_to, _amount);
    }

    function changeNFT(address _nft) external onlyOwner {
        NFTcontract = _nft;
    }

    function getNFTtimeend(uint tokenId) external view returns (uint256) {
        (,uint timeend,) = IKojiNFT(NFTcontract).getNFTwindow(IKojiNFT(NFTcontract).getNFTIDbyURI(ERC721(NFTcontract).tokenURI(tokenId)));
        return timeend;
    }
}
