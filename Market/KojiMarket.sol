// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IAuth {
    function isAuthorized(address _address) external view returns (bool);
    function getKojiNFT() external view returns (address);
  }

interface IKojiNFT {
  function getNFTwindow(uint256 _nftID) external view returns (uint256, uint256, uint256);
  function getNFTInfo(uint256 _nftID) external view returns(string[] memory, uint256[] memory, bool[] memory); 
  function getNFTIDbyURI(string memory _uri) external view returns (uint256);
}

contract KojiMarket is Ownable, IERC721Receiver, ReentrancyGuard {
    using Counters for Counters.Counter;
    using SafeERC20 for IERC20;

    modifier onlyAuthorized() {
        require(auth.isAuthorized(_msgSender()) || owner() == address(_msgSender()), "User not Authorized to Marketplace Contract");
        _;
    }

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
      address indexed seller,
      uint256 tokenId,
      uint256 price,
      uint256 time
    );

    event MarketItemSold (
      address indexed seller,
      address indexed buyer,
      uint256 tokenId,
      uint256 price,
      bool sold,
      uint256 time
    );

    bool public production = false;
    uint256 public feeTotals;
    uint256 public timedelta = 2592000;

    IAuth private auth;

    constructor(address _auth) {
      require(_auth != address(0), "Auth address cannot be zero");
      auth = IAuth(_auth);
    }   

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

      address NFTcontract = auth.getKojiNFT();
      require(NFTcontract != address(0), "NFT contract address is zero");
      
      // Check if token is already listed
      require(idToMarketItem[tokenId].owner != address(this), "Token is already listed");
      
      // Verify sender owns the token
      require(IERC721(NFTcontract).ownerOf(tokenId) == _msgSender(), "You do not own this token");
      
      (uint timestart,,) = IKojiNFT(NFTcontract).getNFTwindow(IKojiNFT(NFTcontract).getNFTIDbyURI(ERC721(NFTcontract).tokenURI(tokenId)));

      if(production) {
        require(block.timestamp > timestart + timedelta, "Listing enabled once BNB Purchase window ends for this page");
      }

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
      idToMarketItem[tokenId].seller = payable(_msgSender());
      idToMarketItem[tokenId].owner = payable(address(this));
      idToMarketItem[tokenId].sold = false;

      IERC721(NFTcontract).safeTransferFrom(_msgSender(), address(this), tokenId);

      // Listing fee is already received via msg.value, no need to transfer again
      feeTotals = feeTotals + listingFee;

      _itemsHeld.increment();
      _itemsTotal.increment();
      
      emit MarketItemCreated(
        _msgSender(),
        tokenId,
        price,
        block.timestamp
      );
    }

    /* allows someone to remove a token they have listed */
    function removeMarketItem(uint256 tokenId) external nonReentrant {
      require(idToMarketItem[tokenId].seller == address(_msgSender()) || owner() == address(_msgSender()), "Only item seller can perform this operation");
      require(idToMarketItem[tokenId].owner == address(this), "Item is not currently listed");
      require(!idToMarketItem[tokenId].sold, "Item has already been sold");
      
      idToMarketItem[tokenId].sold = false;
      idToMarketItem[tokenId].price = 0;
      idToMarketItem[tokenId].seller = payable(address(0));
      idToMarketItem[tokenId].owner = payable(address(0));
      idToMarketItem[tokenId].tier = 0;    
      idToMarketItem[tokenId].page = 0;

      _itemsHeld.decrement();

      for(uint x=0; x<heldtokens.length; x++) {                                     
        if(heldtokens[x] == tokenId) {
            heldtokens[x] = heldtokens[heldtokens.length-1];
            heldtokens.pop();
        }
      }

      IERC721(auth.getKojiNFT()).safeTransferFrom(address(this), _msgSender(), tokenId);
    }

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(
      uint256 tokenId
      ) external payable nonReentrant {
      require(idToMarketItem[tokenId].owner == address(this), "Item is not for sale");
      require(!idToMarketItem[tokenId].sold, "Item has already been sold");
      require(idToMarketItem[tokenId].seller != address(0), "Invalid market item");
      require(_msgSender() != idToMarketItem[tokenId].seller, "Seller cannot buy their own item");
      
      uint price = idToMarketItem[tokenId].price;
      address seller = idToMarketItem[tokenId].seller;
      require(price > 0, "Item price must be greater than zero");
      require(msg.value == price + buyingFee, "Please submit the asking price + fee in order to complete the purchase");

      idToMarketItem[tokenId].owner = payable(_msgSender());
      idToMarketItem[tokenId].sold = true;
      idToMarketItem[tokenId].seller = payable(seller);

      _itemsHeld.decrement();
      _itemsSold.increment();

      IERC721(auth.getKojiNFT()).safeTransferFrom(address(this), _msgSender(), tokenId);
      
      // Transfer buying fee (already received via msg.value)
      feeTotals = feeTotals + buyingFee;
      
      // Transfer payment to seller
      uint256 sellerAmount = msg.value - buyingFee;
      (bool success, ) = payable(seller).call{value: sellerAmount}("");
      require(success, "Failed to transfer payment to seller");

      for(uint x=0; x<heldtokens.length; x++) {                                     
        if(heldtokens[x] == tokenId) {
            heldtokens[x] = heldtokens[heldtokens.length-1];
            heldtokens.pop();
        }
      }

      soldtokens.push(tokenId);

      emit MarketItemSold(
        seller,
        _msgSender(),
        tokenId,
        price,
        true,
        block.timestamp
      );
    }

    /* Returns all unsold market items */
    function fetchMarketItems(uint _page, uint _tier) public view returns (MarketItem[] memory) {

      uint itemCount = _itemsHeld.current();

      if(itemCount > 0) {

        uint currentIndex = 0;
        uint tempCount = 0;

        // First pass: count matching items
        if(_page == 99 && _tier == 0) { //get all
            for (uint i = 0; i < itemCount; i++) {
                if (idToMarketItem[heldtokens[i]].owner == address(this)) {
                    tempCount++;
                }
            }
        } else if(_page != 99 && _tier != 1 && _tier != 2) { //get page + both tiers
            for (uint i = 0; i < itemCount; i++) {
                if (idToMarketItem[heldtokens[i]].owner == address(this) 
                    && idToMarketItem[heldtokens[i]].page == _page) {
                    tempCount++;
                }
            }
        } else { //get page and single tier
            for (uint i = 0; i < itemCount; i++) {
                if (idToMarketItem[heldtokens[i]].owner == address(this) 
                    && idToMarketItem[heldtokens[i]].page == _page
                    && idToMarketItem[heldtokens[i]].tier == _tier) {
                    tempCount++;
                }
            }
        }

        // Second pass: populate array with exact size
        MarketItem[] memory items = new MarketItem[](tempCount);

        if(_page == 99 && _tier == 0) { //get all
            for (uint i = 0; i < itemCount; i++) {
                if (idToMarketItem[heldtokens[i]].owner == address(this)) {
                    items[currentIndex] = idToMarketItem[heldtokens[i]];
                    currentIndex++;
                }
            }
        } else if(_page != 99 && _tier != 1 && _tier != 2) { //get page + both tiers
            for (uint i = 0; i < itemCount; i++) {
                if (idToMarketItem[heldtokens[i]].owner == address(this) 
                    && idToMarketItem[heldtokens[i]].page == _page) {
                    items[currentIndex] = idToMarketItem[heldtokens[i]];
                    currentIndex++;
                }
            }
        } else { //get page and single tier
            for (uint i = 0; i < itemCount; i++) {
                if (idToMarketItem[heldtokens[i]].owner == address(this) 
                    && idToMarketItem[heldtokens[i]].page == _page
                    && idToMarketItem[heldtokens[i]].tier == _tier) {
                    items[currentIndex] = idToMarketItem[heldtokens[i]];
                    currentIndex++;
                }
            }
        }
        
        return items;
        
      } else {
        return new MarketItem[](0);
      }       
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs(address _user) public view returns (MarketItem[] memory) {

      if(soldtokens.length > 0) {
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < soldtokens.length; i++) {
            if (idToMarketItem[soldtokens[i]].owner == _user) {
            itemCount++;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < soldtokens.length; i++) {
            if (idToMarketItem[soldtokens[i]].owner == _user) {
            items[currentIndex] = idToMarketItem[soldtokens[i]];
            currentIndex++;
            }
        }
        return items;

      } else {
        return new MarketItem[](0);
      }
    }

    /* Returns only items a user has listed */
    function fetchItemsListed(address _seller) public view returns (MarketItem[] memory) {
      uint totalItemCount = _itemsHeld.current();

      if(totalItemCount > 0) {
            uint itemCount = 0;
            uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[heldtokens[i]].seller == _seller) {
            itemCount++;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[heldtokens[i]].seller == _seller) {
            items[currentIndex] = idToMarketItem[heldtokens[i]];
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
        (bool success, ) = _owner.call{value: address(this).balance}("");
        require(success, "Failed to transfer ETH");
    }

    // Function to allow admin to claim *other* ERC20 tokens sent to this contract (by mistake)
    function transferERC20Tokens(address _tokenAddr, address _to, uint _amount) public onlyOwner {
        require(_tokenAddr != address(0), "Token address cannot be zero");
        require(_to != address(0), "Recipient address cannot be zero");
        IERC20(_tokenAddr).safeTransfer(_to, _amount);
    }


    function changeDelta(uint _delta) external onlyAuthorized() {
      timedelta = _delta;
    }

    function getNFTtimeend(uint tokenId) external view returns (uint256) {
        address NFTcontract = auth.getKojiNFT();
        (,uint timeend,) = IKojiNFT(NFTcontract).getNFTwindow(IKojiNFT(NFTcontract).getNFTIDbyURI(ERC721(NFTcontract).tokenURI(tokenId)));
        return timeend;
    }

    function setProduction(bool _status) external onlyAuthorized() {
      production = _status;
    }
}
