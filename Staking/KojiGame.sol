//Contract based on https://docs.openzeppelin.com/contracts/3.x/erc721
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IAuth {
    function isAuthorized(address _address) external view returns (bool);
    function getKojiOracle() external view returns (address);
    function getGamePass() external view returns (address);
}

// Interface for the Koji Oracle
interface IOracle {
    function getMintUSD(uint256 amount) external view returns (uint256);
}

interface IGamePass {
    function getNFTAuth(address _holder) external view returns (bool);
}

contract KojiGame is ERC721, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    modifier onlyAuthorized() {
        require(auth.isAuthorized(_msgSender()) || owner() == address(_msgSender()), "User not Authorized to Game Contract");
        _;
    }

    Counters.Counter public _tokenIds;
    Counters.Counter public _NFTIds;

    mapping(uint256 => mapping(address => bool)) public nftMinted; //nftMinted[_nftID][recipient]
    mapping(uint256 => uint256) private tokenIdToAchievementId; // Maps token ID to achievement ID
    
    string URI;

    IAuth private auth;
    
    struct Achievements {
        string name; // Name of the achievement
        string uri; // Address of NFT metadata
    }
    
    // Mapping from owner to list of owned token IDs
    mapping(address => mapping(uint256 => uint256)) private _ownedTokens;

    // Mapping from token ID to index of the owner tokens list
    mapping(uint256 => uint256) private _ownedTokensIndex;

    // Info of each NFT 
    mapping(uint256 => Achievements) public achievements; 

     // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    constructor(address _auth, string memory _uri, string[] memory _strings) ERC721("SPACEWARS", "v1.Achievement") { 
        require(_auth != address(0), "Auth address cannot be zero");

        auth = IAuth(_auth);

        URI = _uri;     

        for(uint x = 0; x < _strings.length; x++) {

            Achievements storage nft = achievements[x];

            nft.name = _strings[x];
            nft.uri = Strings.toString(x+1);

            _NFTIds.increment();

        }
    }

    receive() external payable {}

    function mintAchievement(string memory _holder, uint data) external nonReentrant {

        bool gooddata = false;

        require(compareHashes(_msgSender(), _holder), "Sender is not the same as requested recipient");
        require(IGamePass(auth.getGamePass()).getNFTAuth(_msgSender()), "You must mint a gamepass before minting an achievement");

        for(uint x = 0; x < _NFTIds.current(); x++) {

            Achievements storage nft = achievements[x];

            if (compare(nft.name, _holder, Strings.toString(x+1), data)) {    

                require(!nftMinted[x][_msgSender()], "You already minted this achievement");

                gooddata = true;

                _tokenIds.increment();
        
                uint256 newItemId = _tokenIds.current();

                _mint(_msgSender(), newItemId);

                string memory metadata = nft.uri;
                string memory json = ".json";        
                string memory result = string.concat(metadata, json);
                string memory _uri = string.concat(URI, _holder, "/");

                _setTokenURI(newItemId, string.concat(_uri, result));

                nftMinted[x][_msgSender()] = true;
                tokenIdToAchievementId[newItemId] = x;

                return;

            }

        }

        require(gooddata, "Game data mismatch, unable to mint achievement");

    }

    /**
     * @dev Validates BNB payment for FLUX package purchase and returns bool to external game application
     * @notice This function validates the payment amount but does not handle the BNB transfer.
     * The BNB payment and FLUX distribution are handled by the external game application.
     * @param usdamount The USD amount of FLUX package to purchase
     * @return bool Returns true if payment validation passes
     */
    function purchaseFLUX(uint usdamount) external payable nonReentrant returns(bool) {

        uint packageCost = getPackageCost(usdamount);

        require(msg.value >= packageCost, "Please include proper BNB amount to purchase FLUX package");

        return true;

    }

    // This will allow to rescue ETH sent by mistake directly to the contract
    function rescueETHFromContract() external onlyOwner {
        address payable _owner = payable(_msgSender());
        (bool success, ) = _owner.call{value: address(this).balance}("");
        require(success, "ETH transfer failed");
    }

    // Function to allow admin to claim *other* ERC20 tokens sent to this contract (by mistake)
    function transferERC20Tokens(address _tokenAddr, address _to, uint _amount) public onlyOwner {
        require(_tokenAddr != address(0), "Token address cannot be zero");
        require(_to != address(0), "Recipient address cannot be zero");
        IERC20(_tokenAddr).safeTransfer(_to, _amount);
    }

    function getPackageCost(uint usdvalue) public view returns(uint) {
        return IOracle(auth.getKojiOracle()).getMintUSD(usdvalue);
    }


    function compareHashes(address _address, string memory _holder) internal pure returns (bool) {

        bytes32 first = keccak256(bytes(Strings.toHexString(uint160(_address), 20)));

        bytes32 second = keccak256(bytes(_toLower(_holder)));

        return(first == second);
    }

    function _toLower(string memory str) internal pure returns (string memory) {
        bytes memory bStr = bytes(str);
        bytes memory bLower = new bytes(bStr.length);
        for (uint i = 0; i < bStr.length; i++) {
            // Uppercase character...
            if ((uint8(bStr[i]) >= 65) && (uint8(bStr[i]) <= 90)) {
                // So we add 32 to make it lowercase
                bLower[i] = bytes1(uint8(bStr[i]) + 32);
            } else {
                bLower[i] = bStr[i];
            }
        }
        return string(bLower);
    }

    function compare(string memory name, string memory holder, string memory num, uint data) internal pure returns (bool) {
        return (
            uint(keccak256(abi.encode(name, holder, num))) == uint(data)
        );

    }

    function tokenOfOwnerByIndex(address owner, uint256 index) public view virtual returns (uint256) {
        require(index < ERC721.balanceOf(owner), "ERC721Enumerable: owner index out of bounds");
        return _ownedTokens[owner][index];
    }

    // Removed totalSupply and tokenByIndex to save gas - require global enumeration (_allTokens)
    // If needed in future, re-enable _addTokenToAllTokensEnumeration in _beforeTokenTransfer
    // function totalSupply() public view virtual returns (uint256) {
    //     return _allTokens.length;
    // }
    // function tokenByIndex(uint256 index) public view virtual returns (uint256) {
    //     require(index < totalSupply(), "ERC721Enumerable: global index out of bounds");
    //     return _allTokens[index];
    // }

    /**
     * @dev See {ERC721-_beforeTokenTransfer}.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual override(ERC721) {
       
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);

        if (batchSize > 1) {
            // Will only trigger during construction. Batch transferring (minting) is not available afterwards.
            revert("ERC721Enumerable: consecutive transfers not supported");
        }

        uint256 tokenId = firstTokenId;

        if (from == address(0)) {
            // Minting - add to owner enumeration (for tokenOfOwnerByIndex())
            _addTokenToOwnerEnumeration(to, tokenId);
        } else {
            // Transferring/burning - remove from owner enumeration
            require(to == address(0x000000000000000000000000000000000000dEaD), "ERC721: transfer must be to the dead address");
            _removeTokenFromOwnerEnumeration(from, tokenId);
            
            // Reset nftMinted for the achievement ID (not token ID) when burning
            // This allows the user to mint the same achievement again
            // All tokens are mapped to achievement IDs on mint (line 120), so this is always valid
            uint256 achievementId = tokenIdToAchievementId[tokenId];
            nftMinted[achievementId][from] = false;
            
            // Clean up the mapping since token is effectively burned (saves gas via storage refund)
            delete tokenIdToAchievementId[tokenId];
        }
    }

    /**
     * @dev Private function to add a token to this extension's ownership-tracking data structures.
     * @param to address representing the new owner of the given token ID
     * @param tokenId uint256 ID of the token to be added to the tokens list of the given address
     */
    function _addTokenToOwnerEnumeration(address to, uint256 tokenId) private {
        uint256 length = ERC721.balanceOf(to);
        _ownedTokens[to][length] = tokenId;
        _ownedTokensIndex[tokenId] = length;
    }

    /**
     * @dev Private function to remove a token from this extension's ownership-tracking data structures. Note that
     * while the token is not assigned a new owner, the `_ownedTokensIndex` mapping is _not_ updated: this allows for
     * gas optimizations e.g. when performing a transfer operation (avoiding double writes).
     * This has O(1) time complexity, but alters the order of the _ownedTokens array.
     * @param from address representing the previous owner of the given token ID
     * @param tokenId uint256 ID of the token to be removed from the tokens list of the given address
     */
    function _removeTokenFromOwnerEnumeration(address from, uint256 tokenId) private {
        // To prevent a gap in from's tokens array, we store the last token in the index of the token to delete, and
        // then delete the last slot (swap and pop).

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
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view virtual override(ERC721) returns (string memory) {
        _requireMinted(tokenId);

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }

        return super.tokenURI(tokenId);
    }

    /**
     * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    // Removed _burn override - tokens are "burned" by transferring to dead address, not via _burn()
    // Token URIs remain in storage but this is acceptable since tokens are transferred, not truly burned

    function setNFTmint(uint _numAch, address _holder, bool _status) external onlyAuthorized {
        nftMinted[_numAch][_holder] = _status;
    }
        
}
