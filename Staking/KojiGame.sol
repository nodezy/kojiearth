//Contract based on https://docs.openzeppelin.com/contracts/3.x/erc721
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol"; 
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IAuth {
    function isAuthorized(address _address) external view returns (bool);
    function DEAD() external view returns (address);
    function getKojiOracle() external view returns (address);
    function getGamePass() external view returns (address);
}

// Interface for the Koji Oracle
interface IOracle {
 function getMintUSD(uint256 amount) external view returns (uint256);
}

contract KojiGame is ERC721Enumerable, ERC165, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    modifier onlyAuthorized() {
        require(IAuth(AUTH).isAuthorized(_msgSender()) || owner() == address(_msgSender()), "User not Authorized to NFT Contract");
        _;
    }

    Counters.Counter public _tokenIds;
    Counters.Counter public _NFTIds;

    mapping(uint256 => mapping(address => bool)) public nftMinted; //nftMinted[_nftID][recipient]
    mapping(address => bool) public nftAuth; //nftAuth[recipient]

    string URI;

    IAuth private auth;
    IOracle private oracle;

    address  AUTH;
    address  DEAD;
    address  ORACLE; 

    struct Achievements {
        string name; // Name of the achievement
        string uri; // Address of NFT metadata
    }

    mapping(uint256 => Achievements) private achievements; // Info of each NFT

    constructor(address _auth, string memory _uri, string[] memory strings) ERC721("SPACEWARS", "v1.Achievement") { 

        AUTH = _auth;
        auth = IAuth(AUTH);

        DEAD = auth.DEAD();
        ORACLE = auth.getKojiOracle(); 
        oracle = IOracle(ORACLE);

        URI = _uri;     

        for(uint x = 0; x < strings.length; x++) {

            Achievements storage nft = achievements[x];

            nft.name = strings[x];
            nft.uri = Strings.toString(x+1);

            _NFTIds.increment();

        }
    }

    receive() external payable {}

    function mintAchievement(string memory _holder, string memory data) external nonReentrant {

        bool gooddata = false;

        require(compareHashes(_msgSender(), _holder), "Sender is not the same as requested recipient");
        require(nftAuth[_msgSender()], "You must mint a gamepass before minting an achievement");

        for(uint x = 0; x < _NFTIds.current(); x++) {

            Achievements storage nft = achievements[x];

            if (keccak256(bytes(abi.encodePacked(nft.name, _holder, x+1))) == keccak256(bytes(abi.encodePacked(data)))) {

                require(!nftMinted[x][_msgSender()], "You already minted this achievement");

                gooddata = true;

                _tokenIds.increment();
        
                uint256 newItemId = _tokenIds.current();

                _mint(_msgSender(), newItemId);

                string memory metadata = nft.uri;
                string memory json = ".json";        
                string memory result = string.concat(metadata, json);

                _setTokenURI(newItemId, string.concat(URI, result));

            }

        }

        require(gooddata, "Game data mismatch, unable to mint achievement");

    }

    function purchaseFLUX(uint usdamount) external payable nonReentrant returns(bool) {

        uint packageCost = getPackageCost(usdamount);

        require(msg.value >= packageCost, "Please include mint fee in order to mint Koji Gamepass NFT");

        return true;

    }

    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override{
        require(ERC721.ownerOf(tokenId) == from, "ERC721: transfer of token that is not owned");
        require(to == address(DEAD), "ERC721: transfer must be to the dead address");

        _beforeTokenTransfer(from, to, tokenId);

        // Clear approvals from the previous owner
        _approve(address(0), tokenId);

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
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

    function getPackageCost(uint usdvalue) public view returns(uint) {
        return oracle.getMintUSD(usdvalue);
    }

    function setNFTAuth(address _holder) external {
        require(msg.sender == IAuth(AUTH).getGamePass(), "Sender is not authorized");
        nftAuth[_holder] = true;
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
    
}
