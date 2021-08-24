//Contract based on https://docs.openzeppelin.com/contracts/3.x/erc721
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract DirtyNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    Counters.Counter private _tier1tokenIds;
    Counters.Counter private _tier2tokenIds;

    mapping(address => bool) public tier1minted;
    mapping(address => bool) public tier2minted;
    mapping(string => uint) public mintedCounttier1URI;
    mapping(string => uint) public mintedCounttier2URI;
    uint mintedtier1;
    uint mintedtier2;
    uint256 timestart;
    uint256 timeend;

    constructor() public ERC721("KojiNFT", "KOJINFT") {}

    function minttier1NFT(address recipient, string memory tokenURI) public returns (uint256) {

       IERC20 token = IERC20(0x08Ea9d54921d591146246AA7533C931cf78893B8);
         
       require(!tier1minted[address(msg.sender)], "Wallet has reached 1 NFT mint limit for this contract");
       require(token.balanceOf(msg.sender) >= 100000000000000000000000000, "$KOJI token balance insufficient (less than 100 Million)");
       require(_tier1tokenIds.current() <= 1000, "NFT Mint limit of 1000 has been reached");
       require(timestart > block.timestamp && timeend < block.timestamp, "Time period for minting NFT has expired");
        _tier1tokenIds.increment();

        uint256 newItemId = _tier1tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        tier1minted[address(msg.sender)] = true;
        mintedtier1 = mintedCounttier1URI[tokenURI];
        mintedCounttier1URI[tokenURI] = mintedtier1 + 1;

        return newItemId;
    }

    function minttier2NFT(address recipient, string memory tokenURI) public returns (uint256) {

       IERC20 token = IERC20(0x08Ea9d54921d591146246AA7533C931cf78893B8);
         
       require(!tier2minted[address(msg.sender)], "Wallet has reached 1 NFT mint limit for this contract");
       require(token.balanceOf(msg.sender) >= 100000000000000000000000000, "$KOJI token balance insufficient (less than 100 Million)");
       require(_tier2tokenIds.current() <= 1000, "NFT Mint limit of 1000 has been reached");
       require(timestart > block.timestamp && timeend < block.timestamp, "Time period for minting NFT has expired");
        _tier2tokenIds.increment();

        uint256 newItemId = _tier2tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        tier1minted[address(msg.sender)] = true;
        mintedtier2 = mintedCounttier2URI[tokenURI];
        mintedCounttier2URI[tokenURI] = mintedtier2 + 1;

        return newItemId;
    }

    //returns whether the mint limit has been reached or not
    function tier1mintLimitReached() public view returns (bool) {
        uint256 newItemId = _tier1tokenIds.current();
        if (newItemId == 1000) {
            return (true);
        } else {
            return (false);
        }
    }

    //returns whether the mint limit has been reached or not
    function tier2mintLimitReached() public view returns (bool) {
        uint256 newItemId = _tier2tokenIds.current();
        if (newItemId == 1000) {
            return (true);
        } else {
            return (false);
        }
    }

    //returns the total number of minted NFT
    function totalMinted() public view returns (uint256) {
        uint256 tier1 = _tier1tokenIds.current();
        uint256 tier2 = _tier2tokenIds.current();
        uint256 total = tier1.add(tier2);
        return total;
    }

    //returns the balance of the erc20 token required for validation
    function checkBalance(address token, address holder) public view returns (uint256) {
        IERC20 tokens = IERC20(token);
        return tokens.balanceOf(holder);
    }

    //returns the number of mints for each specific NFT based on URI
    function mintedCounttier1(string memory tokenURI) public view returns (uint256) {
        return mintedCounttier1URI[tokenURI];
    }

    //returns the number of mints for each specific NFT based on URI
    function mintedCounttier2(string memory tokenURI) public view returns (uint256) {
        return mintedCounttier2URI[tokenURI];
    }

    
}

