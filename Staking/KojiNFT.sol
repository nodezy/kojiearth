//Contract based on https://docs.openzeppelin.com/contracts/3.x/erc721
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


interface IAuth {
    function isAuthorized(address _address) external view returns (bool);
    function getKojiStaking() external view returns (address);
    function DEAD() external view returns (address);
    function getKojiOracle() external view returns (address);
    function getKojiNFTPoster() external view returns (address);
}

// Interface for the Koji Oracle
interface IOracle {
    function gettier1USDprice() external view returns (uint,uint);
    function gettier2USDprice() external view returns (uint,uint);
}


contract KojiNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    // Events
    event NFTMinted(address indexed recipient, uint256 indexed tokenId, uint256 indexed nftID, uint256 tier, bool redeemed, bool superMinted, bool bnbMinted);
    event NFTUpgraded(address indexed user, uint256 indexed tokenId, uint256 tier, uint256 posterTokenId);
    event NFTWindowUpdated(uint256 indexed nftID, uint256 timestart, uint256 timeend);
    event NFTFlagsUpdated(uint256 indexed nftID, bool redeemable, bool supermintable, bool bnbable);

    modifier onlyAuthorized() {
        require(auth.isAuthorized(_msgSender()) || owner() == address(_msgSender()), "E01");
        _;
    }

    Counters.Counter private _tokenIds;
    Counters.Counter private _tier1tokenIds;
    Counters.Counter private _tier2tokenIds;
    Counters.Counter public _NFTIds; //so we can track which NFT's have been added to the system

    struct NFTInfo {
        string collectionName; // Name of nft creator/influencer/artist
        string nftName; // Name of the actual NFT artwork
        string tier1uri; //address of NFT metadata
        string tier2uri; //address of NFT metadata
        uint256 timestart; //start time of release window
        uint256 timeend; //end time of release window
        uint256 supermintend; //***end time of supermint window
        uint256 order; //order of the NFT
        bool redeemable; //can be redeemed via staking tier
        bool supermintable; //***can be redeemed with supermint
        bool bnbable; //***can be redeemed with bnb
        bool exists;
    }

    mapping(uint256 => NFTInfo) private nftInfo; // Info of each NFT 
    mapping(uint256 => mapping(address => mapping(uint256 => bool))) public nftTierMinted; //nftTierMinted[_nftID][recipient][tier#]
    mapping(uint256 => mapping(address => bool)) public nftMinted; //nftMinted[_nftID][recipient]
    mapping(uint256 => mapping(address => bool)) public nftSuperMinted; //nftMinted[_nftID][recipient]
    mapping(uint256 => mapping(address => bool)) public nftBNBtier1Minted; //nftBNBtier1Minted[_nftID][recipient]
    mapping(uint256 => mapping(address => bool)) public nftBNBtier2Minted; //nftBNBtier2Minted[_nftID][recipient]
    mapping (uint256 => mapping(uint => uint256)) public mintTotals; //mintTotals[_nftID][tier#]
    mapping (uint256 => mapping(uint => uint256)) public mintTotalsAfterWindow; //mintTotalsAfterWindow[_nftID][tier#]
    mapping (string => uint256) public mintTotalsURI; //mintTotalsURI[_nftID][URI]
    mapping (string => bool) private uriExists;
    mapping(string => uint256) public uriToNFTId; // Reverse mapping: URI => NFT ID for O(1) lookup
    mapping(address => mapping(uint256 => uint256)) private _ownedTokens; // owner => index => tokenId
    mapping(uint256 => uint256) private _ownedTokensIndex; // tokenId => index in owner's array

    uint256 windowSpan = 2592000; //31 days from timestart, regardless of mint method
    uint256 supermintSpan = 2592000; //31 days 
    
    string poster1uri;
    string poster2uri;

    IAuth private auth;
    
    address public DEAD; 
       
    constructor(string memory _poster1uri, string memory _poster2uri, address _auth) ERC721("KojiNFT", "KOJINFT") {
        require(_auth != address(0), "E02");
        require(bytes(_poster1uri).length > 0, "E50");
        require(bytes(_poster2uri).length > 0, "E50");
        
        poster1uri = _poster1uri;
        poster2uri = _poster2uri;
        auth = IAuth(_auth);
        DEAD = auth.DEAD();
    }

    /**
     * @dev Upgrades a poster NFT to a Koji NFT by burning the poster and minting a new NFT
     * @param tokenID The token ID of the poster NFT to upgrade
     * @return The new token ID of the minted Koji NFT
     */
    function upgradeNFT(uint tokenID) external nonReentrant returns (uint) {

        address POSTER = auth.getKojiNFTPoster();

        require(IERC721(POSTER).ownerOf(tokenID) == _msgSender(), "E60");
        require(IERC721(POSTER).balanceOf(_msgSender())>0, "E61");

        string memory holderuri = ERC721(POSTER).tokenURI(tokenID);

        NFTInfo storage nft = nftInfo[0];

        uint256 minted;
        uint256 minttier;

        _tokenIds.increment();
        
        uint256 newItemId = _tokenIds.current();
        _mint(_msgSender(), newItemId);

        //mint the appropriate tier based on variable passed in from staking
        if (keccak256(bytes(poster1uri)) == keccak256(bytes(holderuri))) {
            _setTokenURI(newItemId, nft.tier1uri);
             _tier1tokenIds.increment();
             minted = mintTotalsURI[nft.tier1uri];
             mintTotalsURI[nft.tier1uri] = minted + 1;
             minttier = 1;
        } else {
            if (keccak256(bytes(poster2uri)) == keccak256(bytes(holderuri))) {
                _setTokenURI(newItemId, nft.tier2uri);
                _tier2tokenIds.increment();
                minted = mintTotalsURI[nft.tier2uri];
                mintTotalsURI[nft.tier2uri] = minted + 1;
                minttier = 2;
            } else {
                revert("E50");
            }
        }

        //increment total # of NFT minted for this ID/Tier
        minted = mintTotals[0][minttier];
        mintTotals[0][minttier] = minted + 1;

        IERC721(POSTER).safeTransferFrom(_msgSender(), DEAD, tokenID);

        emit NFTUpgraded(_msgSender(), newItemId, minttier, tokenID);

        return newItemId;
    }

    /**
     * @dev Validates and calculates the price for minting an NFT after the window
     * @param _id The NFT ID
     * @param _tier The tier (1 or 2)
     * @return price The calculated price
     * @return increase The price increase per mint after window
     */
    function validatePrice(uint _id, uint _tier) external view returns (uint, uint) {

        uint price;
        uint increase;

        if(_tier == 1) {
            (price, increase) = IOracle(auth.getKojiOracle()).gettier1USDprice();
        } else {
            (price, increase) = IOracle(auth.getKojiOracle()).gettier2USDprice();
        }
        
        uint mintsAfterWindow = mintTotalsAfterWindow[_id][_tier];

        price = price + (mintsAfterWindow * increase);

        require(price > 0, "E51");

        return (price, increase);
    }

    function checkValidation(address recipient, uint256 minttier, uint256 id, uint256 userstaketime, bool redeemed, bool superMinted, bool bnbMinted) internal view returns (bool valid, string memory rstring) {
        bool validated = true;
        string memory revertstring = "OK";

        NFTInfo storage nft = nftInfo[id];

        if(!nft.exists) {validated = false; revertstring = "E44";}

        if(block.timestamp < nft.timestart) {validated = false; revertstring = "E18";}

        if((redeemed && superMinted) || (redeemed && bnbMinted) || (superMinted && bnbMinted)) {validated = false; revertstring = "E45";}

        if (!auth.isAuthorized(_msgSender())) {
            if(msg.sender != address(auth.getKojiStaking())) {validated = false; revertstring = "E46";}
        
            if(redeemed) {
                // Regular redemption requires staking
                if(!nft.redeemable) {validated = false; revertstring = "E15";}
                if(nftMinted[id][recipient]) {validated = false; revertstring = "E16";}
                if(userstaketime > nft.timestart) {validated = false; revertstring = "E47";}
            } else if(bnbMinted) {
                if(block.timestamp > nft.timeend) {validated = false; revertstring = "E48";}
                if(minttier == 1) {
                    if(nftBNBtier1Minted[id][recipient]) {validated = false; revertstring = "E26";}
                } else {
                    if(nftBNBtier2Minted[id][recipient]) {validated = false; revertstring = "E26";}
                }
            } else if(superMinted) {
                // Supermint checks - no staking requirement
                if(block.timestamp > nft.supermintend) {validated = false; revertstring = "E49";} 
                if(nftSuperMinted[id][recipient]) {validated = false; revertstring = "E23";}
                if(!nft.supermintable) {validated = false; revertstring = "E22";}
            }

            if(!redeemed && !superMinted && !bnbMinted) {validated = false; revertstring = "E45"; }
        }

        return (validated, revertstring);
    }
    
    /**
     * @dev Mints a new NFT to the recipient
     * @param recipient The address to receive the NFT
     * @param minttier The tier to mint (1 or 2)
     * @param id The NFT ID
     * @param userstaketime The user's staking time
     * @param redeemed Whether this is a redemption mint
     * @param superMinted Whether this is a supermint
     * @param bnbMinted Whether this is a BNB purchase mint
     * @return The new token ID
     */
    function mintNFT(address recipient, uint256 minttier, uint256 id, uint256 userstaketime, bool redeemed, bool superMinted, bool bnbMinted) public nonReentrant returns (uint256) {   

        (bool valid, string memory revertstring)  = checkValidation(recipient, minttier, id, userstaketime, redeemed, superMinted, bnbMinted);

        require(valid, revertstring);

        NFTInfo storage nft = nftInfo[id];
         
        uint256 minted;

        _tokenIds.increment();
        
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);

        //mint the appropriate tier based on variable passed in from staking
        if(minttier == 1) {
            _setTokenURI(newItemId, nft.tier1uri);
             _tier1tokenIds.increment();
             minted = mintTotalsURI[nft.tier1uri];
             mintTotalsURI[nft.tier1uri] = minted + 1;
        } else {
            _setTokenURI(newItemId, nft.tier2uri);
             _tier2tokenIds.increment();
             minted = mintTotalsURI[nft.tier2uri];
             mintTotalsURI[nft.tier2uri] = minted + 1;
        }
        
        //record this NFT & tier as being minted by the recipient
        if (!superMinted && !bnbMinted) {
            nftTierMinted[id][recipient][minttier] = true;
            nftMinted[id][recipient] = true;
        }

        if(superMinted) {nftSuperMinted[id][recipient] = true;}
        
        if(bnbMinted && minttier == 1) {
            nftBNBtier1Minted[id][recipient] = true;
            if(block.timestamp > nft.timeend) {mintTotalsAfterWindow[id][minttier]++;}
        }
        if(bnbMinted && minttier == 2) {
            nftBNBtier2Minted[id][recipient] = true;
            if(block.timestamp > nft.timeend) {mintTotalsAfterWindow[id][minttier]++;}
        }

        //increment total # of NFT minted for this ID/Tier
        minted = mintTotals[id][minttier];
        mintTotals[id][minttier] = minted + 1;

        emit NFTMinted(recipient, newItemId, id, minttier, redeemed, superMinted, bnbMinted);

        return newItemId;

    }

    /**
     * @dev Returns the global total number of minted NFTs across all tiers
     * @return The total number of minted NFTs
     */
    function totalMinted() public view returns (uint256) {
        uint256 tier1 = _tier1tokenIds.current();
        uint256 tier2 = _tier2tokenIds.current();
        uint256 total = tier1 + tier2;
        return total;
    }

    /**
     * @dev Returns the number of mints for a specific NFT based on URI
     * @param tokenURI The URI to check
     * @return The number of mints for that URI
     */
    function mintedCounttier(string memory tokenURI) public view returns (uint256) {
        return mintTotalsURI[tokenURI];
    }


    /**
     * @dev Allows owner to rescue ETH sent by mistake directly to the contract
     */
    function rescueETHFromContract() external onlyOwner {
        address payable _owner = payable(_msgSender());
        (bool success, ) = _owner.call{value: address(this).balance}("");
        require(success, "E56");
    }

    /**
     * @dev Allows admin to claim ERC20 tokens sent to this contract by mistake
     * @param _tokenAddr The address of the ERC20 token
     * @param _to The address to send tokens to
     * @param _amount The amount of tokens to transfer
     */
    function transferERC20Tokens(address _tokenAddr, address _to, uint _amount) public onlyOwner {
        require(_tokenAddr != address(0), "E57");
        require(_to != address(0), "E57");
        IERC20(_tokenAddr).transfer(_to, _amount);
    }

    /**
     * @dev Sets the information for a new NFT
     * @param _collectionName The collection name
     * @param _nftName The NFT name
     * @param _tier1uri The URI for tier 1
     * @param _tier2uri The URI for tier 2
     * @param _timestart The start time for the mint window
     * @param _order The order of the NFT
     * @param _redeemable Whether the NFT is redeemable via staking
     * @param _supermintable Whether the NFT can be superminted
     * @param _bnbable Whether the NFT can be purchased with BNB
     * @param _override Whether to override time validation
     * @return The NFT ID
     */
    function setNFTInfo(string memory _collectionName, string memory _nftName, string memory _tier1uri, string memory _tier2uri, uint256 _timestart, uint256 _order, bool _redeemable, bool _supermintable, bool _bnbable, bool _override) public onlyAuthorized returns (uint256) {

        require(bytes(_collectionName).length > 0, "E50");
        require(bytes(_nftName).length > 0, "E50");
        require(bytes(_tier1uri).length > 0, "E50");
        require(bytes(_tier2uri).length > 0, "E50");
        if(!_override) {
            require(_timestart != 0 && _timestart > block.timestamp, "Time start and end must be in the proper order");
        }
        
        require(!uriExists[_tier1uri], "E53");
        require(!uriExists[_tier2uri], "E53");
        
        uint256 _nftid = _NFTIds.current();
        require(_nftid < type(uint256).max, "E52");
        
        NFTInfo storage nft = nftInfo[_nftid];
        require(!nft.exists, "E54");

        nft.collectionName = _collectionName;
        nft.nftName = _nftName;
        nft.tier1uri = _tier1uri;
        nft.tier2uri = _tier2uri;
        nft.timestart = _timestart;
        nft.timeend = _timestart + windowSpan;
        nft.order = _order;
        nft.redeemable = _redeemable;
        nft.supermintable = _supermintable;
        nft.bnbable = _bnbable;
        nft.exists = true;

        uriExists[_tier1uri] = true;
        uriExists[_tier2uri] = true;
        
        // Set reverse mapping for O(1) URI lookup
        uriToNFTId[_tier1uri] = _nftid;
        uriToNFTId[_tier2uri] = _nftid;

            if(_supermintable) {nft.supermintend=nft.timeend + supermintSpan;}

        _NFTIds.increment();

        return  _nftid; 

    }

    function getNFTInfo(uint256 _nftID) external view returns(string[] memory, uint256[] memory, bool[] memory) {
        
        NFTInfo storage nft = nftInfo[_nftID];

        string[] memory strings = new string[](4);
        uint256[] memory numbers = new uint256[](4);
        bool[] memory bools = new bool[](4);

        strings[0] = nft.collectionName;
        strings[1] = nft.nftName;

        if(block.timestamp >= nft.timestart) {
            strings[2] = nft.tier1uri;
            strings[3] = nft.tier2uri;
        } else {
            strings[2] = nft.nftName;
            strings[3] = nft.nftName;
        }
        

        numbers[0] = nft.timestart;
        numbers[1] = nft.timeend;
        numbers[2] = nft.supermintend;
        numbers[3] = nft.order;

        bools[0] = nft.redeemable;
        bools[1] = nft.supermintable;
        bools[2] = nft.bnbable;
        bools[3] = nft.exists;

        return(strings,numbers,bools);
    }

    /**
     * @dev Sets the collection name for an NFT
     * @param _nftID The NFT ID
     * @param _name The new collection name
     */
    function setCollectionName(uint256 _nftID, string memory _name) external onlyAuthorized {
        require(bytes(_name).length > 0, "E62");
        NFTInfo storage nft = nftInfo[_nftID];
        require(nft.exists, "E44");
        nft.collectionName = _name;
    }

    /**
     * @dev Sets the NFT name
     * @param _nftID The NFT ID
     * @param _name The new NFT name
     */
    function setNFTName(uint256 _nftID, string memory _name) external onlyAuthorized {
        require(bytes(_name).length > 0, "E63");
        NFTInfo storage nft = nftInfo[_nftID];
        require(nft.exists, "E44");
        nft.nftName = _name;
    }

    /**
     * @dev Sets the tier 1 URI for an NFT
     * @param _nftID The NFT ID
     * @param _uri The new URI
     */
    function setTier1URI(uint256 _nftID, string memory _uri) external onlyAuthorized {
        require(bytes(_uri).length > 0, "E50");
        NFTInfo storage nft = nftInfo[_nftID];
        require(nft.exists, "E44");
        
        // Update reverse mapping
        string memory oldUri = nft.tier1uri;
        if(bytes(oldUri).length > 0) {
            uriExists[oldUri] = false;
            delete uriToNFTId[oldUri];
        }
        
        require(!uriExists[_uri], "E53");
        nft.tier1uri = _uri;
        uriExists[_uri] = true;
        uriToNFTId[_uri] = _nftID;
        
    }

    /**
     * @dev Sets the tier 2 URI for an NFT
     * @param _nftID The NFT ID
     * @param _uri The new URI
     */
    function setTier2URI(uint256 _nftID, string memory _uri) external onlyAuthorized {
        require(bytes(_uri).length > 0, "E50");
        NFTInfo storage nft = nftInfo[_nftID];
        require(nft.exists, "E44");
        
        // Update reverse mapping
        string memory oldUri = nft.tier2uri;
        if(bytes(oldUri).length > 0) {
            uriExists[oldUri] = false;
            delete uriToNFTId[oldUri];
        }
        
        require(!uriExists[_uri], "E53");
        nft.tier2uri = _uri;
        uriExists[_uri] = true;
        uriToNFTId[_uri] = _nftID;
        
    }

    /**
     * @dev Sets the mint window for an NFT
     * @param _nftID The NFT ID
     * @param _timestart The start time
     * @param _timeend The end time
     */
    function setNFTwindow(uint256 _nftID, uint256 _timestart, uint256 _timeend) external onlyAuthorized {
        require(_timeend > _timestart, "E64");
        NFTInfo storage nft = nftInfo[_nftID];
        require(nft.exists, "E44");

        nft.timestart = _timestart;
        nft.timeend = _timeend;
        
        emit NFTWindowUpdated(_nftID, _timestart, _timeend);
    }

    /**
     * @dev Sets the end time for an NFT mint window
     * @param _nftID The NFT ID
     * @param _timeend The new end time
     */
    function setNFTend(uint256 _nftID, uint256 _timeend) external onlyAuthorized {
        NFTInfo storage nft = nftInfo[_nftID];
        require(nft.exists, "E44");
        require(_timeend > nft.timestart, "E64");

        nft.timeend = _timeend;
        emit NFTWindowUpdated(_nftID, nft.timestart, _timeend);
    }

    /**
     * @dev Sets the order for an NFT
     * @param _nftID The NFT ID
     * @param _order The new order
     */
    function setNFTOrder(uint256 _nftID, uint256 _order) external onlyAuthorized {
        NFTInfo storage nft = nftInfo[_nftID];
        require(nft.exists, "E44");

        nft.order = _order;
    }

    /**
     * @dev Sets whether an NFT is redeemable
     * @param _nftID The NFT ID
     * @param _redeemable Whether it's redeemable
     */
    function setNFTredeemable(uint256 _nftID, bool _redeemable) external onlyAuthorized {
        NFTInfo storage nft = nftInfo[_nftID];
        require(nft.exists, "E44");

        nft.redeemable = _redeemable;
        
        emit NFTFlagsUpdated(_nftID, _redeemable, nft.supermintable, nft.bnbable);
    }

    /**
     * @dev Sets whether an NFT is supermintable
     * @param _nftID The NFT ID
     * @param _supermintable Whether it's supermintable
     */
    function setNFTsupermintable(uint256 _nftID, bool _supermintable) external onlyAuthorized {
        NFTInfo storage nft = nftInfo[_nftID];
        require(nft.exists, "E44");

        bool changed = nft.supermintable != _supermintable;
        nft.supermintable = _supermintable;

        // Only update supermintend if value changed
        if(changed) {
            if(!nft.supermintable) {
                nft.supermintend = 0;
            } else {
                nft.supermintend = nft.timeend + supermintSpan;
            }
        }
        
        emit NFTFlagsUpdated(_nftID, nft.redeemable, _supermintable, nft.bnbable);
    }

    /**
     * @dev Sets the supermint end time for an NFT
     * @param _nftID The NFT ID
     * @param _supermintend The new supermint end time
     */
    function setNFTsuperminEnd(uint256 _nftID, uint _supermintend) external onlyAuthorized {
        NFTInfo storage nft = nftInfo[_nftID];
        require(nft.exists, "E44");

        nft.supermintend = _supermintend;
    }

    /**
     * @dev Sets whether an NFT can be purchased with BNB
     * @param _nftID The NFT ID
     * @param _bnbable Whether it's BNB purchasable
     */
    function setNFTbnbable(uint256 _nftID, bool _bnbable) external onlyAuthorized {
        NFTInfo storage nft = nftInfo[_nftID];
        require(nft.exists, "E44");

        nft.bnbable = _bnbable;
        
        emit NFTFlagsUpdated(_nftID, nft.redeemable, nft.supermintable, _bnbable);
    }

    /**
     * @dev Sets the exists flag for an NFT
     * @param _nftID The NFT ID
     * @param _exists Whether the NFT exists
     */
    function setNFTexists(uint256 _nftID, bool _exists) external onlyAuthorized {
        NFTInfo storage nft = nftInfo[_nftID];

        nft.exists = _exists;
    }

    function getIfMinted(address _recipient, uint256 _nftID) external view returns (bool) {
        return nftMinted[_nftID][_recipient];
    }

    function getIfSuperMinted(address _recipient, uint256 _nftID) external view returns (bool) {
        return nftSuperMinted[_nftID][_recipient];
    }

    function getIfMintedTier(address _recipient, uint256 _nftID, uint256 minttier) external view returns (bool) {
        return nftTierMinted[_nftID][_recipient][minttier];
    }

    /**
     * @dev Gets the NFT ID by URI using reverse mapping (O(1) lookup)
     * @param _uri The URI to look up
     * @return The NFT ID, or 0 if not found
     */
    function getNFTIDbyURI(string memory _uri) public view returns (uint256) {
        return uriToNFTId[_uri];
    }

    function getNFTwindow(uint256 _nftID) external view returns (uint256,uint256,uint256) {
        NFTInfo storage nft = nftInfo[_nftID];  
        return (nft.timestart,nft.timeend,nft.supermintend);
    }

    function getNFTredeemable(uint256 _nftID) external view returns (bool) {
        NFTInfo storage nft = nftInfo[_nftID];  
        return (nft.redeemable);
    }

    function getNFTsupermintable(uint256 _nftID) external view returns (bool) {
        NFTInfo storage nft = nftInfo[_nftID];  
        return (nft.supermintable);
    }

    function getNFTbnbable(uint256 _nftID) external view returns (bool) {
        NFTInfo storage nft = nftInfo[_nftID];  
        return (nft.bnbable);
    } 

    function getBNBtier1minted(address _recipient, uint _nftID) external view returns (bool) {
        return nftBNBtier1Minted[_nftID][_recipient];
    }

    function getBNBtier2minted(address _recipient, uint _nftID) external view returns (bool) {
        return nftBNBtier2Minted[_nftID][_recipient];
    }

    function getMintTotalsAfterWindow(uint _nftID, uint _tier) external view returns (uint) {
        return mintTotalsAfterWindow[_nftID][_tier];
    }

    /**
     * @dev Checks if a wallet contains NFTs with a specific URI
     * @param _holder The wallet address to check
     * @param _uri The URI to search for
     * @return nftpresent Whether any matching NFTs were found
     * @return tokens Array of token IDs with matching URI
     */
    function checkWalletforNFT(address _holder, string memory _uri) public view returns (bool nftpresent, uint256[] memory tokens) {

        uint256 nftbalance = IERC721(this).balanceOf(_holder);
        
        if(nftbalance == 0) {
            return (false, new uint256[](0));
        }

        // First pass: count matches
        uint256 matchCount = 0;
        for (uint256 y = 0; y < nftbalance; y++) {
            uint256 tokenId = tokenOfOwnerByIndex(_holder, y);
            string memory holderuri = tokenURI(tokenId);
            if (keccak256(bytes(_uri)) == keccak256(bytes(holderuri))) {
                matchCount++;
            }
        }

        if(matchCount == 0) {
            return (false, new uint256[](0));
        }

        // Second pass: collect matching token IDs
        uint256[] memory tokenids = new uint256[](matchCount);
        uint256 index = 0;
        for (uint256 y = 0; y < nftbalance; y++) {
            uint256 tokenId = tokenOfOwnerByIndex(_holder, y);
            string memory holderuri = tokenURI(tokenId);
            if (keccak256(bytes(_uri)) == keccak256(bytes(holderuri))) {
                tokenids[index] = tokenId;
                index++;
            }
        }

        return (true, tokenids);
    }

    function setMintTotalsAfterWindow(uint _id, uint _tier, uint _amount) external onlyAuthorized {
        mintTotalsAfterWindow[_id][_tier] = _amount;
    }

    function tokenOfOwnerByIndex(address owner, uint256 index) public view virtual returns (uint256) {
        require(index < ERC721.balanceOf(owner), "E55");
        return _ownedTokens[owner][index];
    }

    /**
     * @dev Hook that is called before any token transfer. This includes minting
     * and burning.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);

        // Only handle single token transfers (batchSize = 1)
        if (batchSize != 1) {
            revert("Batch transfers not supported");
        }

        uint256 tokenId = firstTokenId;

        if (from == address(0)) {
            // Minting - add to owner enumeration
            _addTokenToOwnerEnumeration(to, tokenId);
        } else if (to == address(0)) {
            // Burning - remove from owner enumeration
            _removeTokenFromOwnerEnumeration(from, tokenId);
        } else {
            // Transferring - remove from old owner and add to new owner
            _removeTokenFromOwnerEnumeration(from, tokenId);
            _addTokenToOwnerEnumeration(to, tokenId);
        }
    }

    /**
     * @dev Private function to add a token to this extension's ownership-tracking data structures.
     */
    function _addTokenToOwnerEnumeration(address to, uint256 tokenId) private {
        uint256 length = ERC721.balanceOf(to);
        _ownedTokens[to][length] = tokenId;
        _ownedTokensIndex[tokenId] = length;
    }

    /**
     * @dev Private function to remove a token from this extension's ownership-tracking data structures.
     */
    function _removeTokenFromOwnerEnumeration(address from, uint256 tokenId) private {
        uint256 lastTokenIndex = ERC721.balanceOf(from) - 1;
        uint256 tokenIndex = _ownedTokensIndex[tokenId];

        // When the token to delete is the last token, the swap operation is unnecessary
        if (tokenIndex != lastTokenIndex) {
            uint256 lastTokenId = _ownedTokens[from][lastTokenIndex];

            _ownedTokens[from][tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
            _ownedTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index
        }

        // This also deletes the contents at the last position of the array
        delete _ownedTokensIndex[tokenId];
        delete _ownedTokens[from][lastTokenIndex];
    }

    /**
     * @dev Gets the tier of an NFT token
     * @param tokenId The token ID
     * @return The tier (1 or 2)
     */
    function getNFTTier(uint256 tokenId) public view returns (uint256) {
        if(_exists(tokenId)) {
            string memory nftUri = tokenURI(tokenId);
            uint256 nftID = getNFTIDbyURI(nftUri);
            
            if(nftID == 0) {
                revert("E43");
            }
            
            NFTInfo storage nft = nftInfo[nftID];
            if (keccak256(bytes(nft.tier1uri)) == keccak256(bytes(nftUri))) {
                return 1;
            }
            if (keccak256(bytes(nft.tier2uri)) == keccak256(bytes(nftUri))) {
                return 2;
            }
            revert("E43");
        }
        revert("E44");
    }

}

